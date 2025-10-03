import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createBooking, getServiceById, getStaffById } from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { serviceId, staffId, notes, userId, userEmail } = await req.json();

    if (!serviceId || !staffId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get service and staff details
    const service = await getServiceById(serviceId);
    const staff = await getStaffById(staffId);

    if (!service || !staff) {
      return NextResponse.json(
        { success: false, error: 'Service or staff not found' },
        { status: 404 }
      );
    }

    // Create booking with "pending_payment" status
    const booking = await createBooking({
      client_id: userId,
      service_id: serviceId,
      staff_id: staffId,
      date_time: new Date().toISOString(), // Placeholder, will be updated after Calendly
      notes,
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/booking/schedule/${booking.id}`;
    const cancelUrl = `${baseUrl}/booking/${serviceId}`;

    const stripeSession = await createCheckoutSession(
      serviceId,
      service.name,
      service.price,
      booking.id,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({
      success: true,
      checkoutUrl: stripeSession.url,
      bookingId: booking.id,
    });
  } catch (error: any) {
    console.error('Error in /api/bookings/create:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
