import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent } from '@/lib/stripe';
import { updateBooking, createPayment } from '@/lib/supabase';
import { sendBookingConfirmationEmail } from '@/lib/resend';
import Stripe from 'stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature provided' },
        { status: 400 }
      );
    }

    // Construct and verify webhook event
    const event = constructWebhookEvent(body, signature);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const bookingId = session.metadata?.bookingId;

        if (!bookingId) {
          console.error('No booking ID in session metadata');
          break;
        }

        // Update booking status
        const booking = await updateBooking(bookingId, {
          status: 'confirmed',
          payment_status: 'succeeded',
          stripe_payment_id: session.payment_intent as string,
        });

        if (!booking) {
          console.error('Failed to update booking');
          break;
        }

        // Create payment record
        await createPayment({
          booking_id: bookingId,
          amount: session.amount_total! / 100, // Convert from cents
          stripe_charge_id: session.payment_intent as string,
          status: 'succeeded',
        });

        // Fetch full booking details with relations
        const { supabaseAdmin } = await import('@/lib/supabase');
        const { data: fullBooking } = await supabaseAdmin
          .from('bookings')
          .select(`
            *,
            client:users!bookings_client_id_fkey(*),
            service:services(*),
            staff:staff(*, user:users(*))
          `)
          .eq('id', bookingId)
          .single();

        if (fullBooking) {
          // Send confirmation email
          await sendBookingConfirmationEmail({
            to: fullBooking.client.email,
            clientName: fullBooking.client.name,
            serviceName: fullBooking.service.name,
            staffName: fullBooking.staff.user.name,
            dateTime: fullBooking.date_time,
            price: fullBooking.service.price,
            bookingId: fullBooking.id,
          });
        }

        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle payment failure
        console.error('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 400 }
    );
  }
}
