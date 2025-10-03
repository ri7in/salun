import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateBooking, getBookingById } from '@/lib/supabase';
import { sendEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { bookingId, calendlyEventUri, calendlyInviteeUri } = await req.json();

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Missing booking ID' },
        { status: 400 }
      );
    }

    // Get booking details
    const booking = await getBookingById(bookingId);

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify booking belongs to user
    if (booking.user_id !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Extract scheduled time from Calendly (you would need to parse the event details)
    // For now, we'll set it to the current time as a placeholder
    // In production, you should fetch the actual scheduled time from Calendly API
    const scheduledDateTime = new Date().toISOString();

    // Update booking status to scheduled
    await updateBooking(bookingId, {
      status: 'scheduled',
      date_time: scheduledDateTime,
    });

    // Send confirmation email
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #9333ea 0%, #4f46e5 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; }
              .booking-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
              .footer { background: #1f2937; color: #9ca3af; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; padding: 12px 24px; background: #9333ea; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✨ Booking Confirmed!</h1>
                <p>Your appointment at Salun is all set</p>
              </div>
              <div class="content">
                <p>Hi ${booking.user?.name || 'there'},</p>
                <p>Thank you for choosing Salun! Your appointment has been confirmed and payment has been processed.</p>

                <div class="booking-details">
                  <h2 style="margin-top: 0; color: #9333ea;">Booking Details</h2>
                  <div class="detail-row">
                    <span><strong>Service:</strong></span>
                    <span>${booking.service?.name}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>Staff:</strong></span>
                    <span>${booking.staff?.user?.name}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>Amount Paid:</strong></span>
                    <span>$${booking.total_price.toFixed(2)}</span>
                  </div>
                  <div class="detail-row">
                    <span><strong>Duration:</strong></span>
                    <span>${booking.service?.duration} minutes</span>
                  </div>
                  <div class="detail-row" style="border-bottom: none;">
                    <span><strong>Booking ID:</strong></span>
                    <span>${bookingId}</span>
                  </div>
                </div>

                <p><strong>📅 Your appointment details:</strong></p>
                <p>You will receive a separate calendar invitation from Calendly with the exact date and time of your appointment.</p>

                ${booking.notes ? `
                <p><strong>Special Notes:</strong></p>
                <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; border-radius: 4px; margin: 15px 0;">
                  ${booking.notes}
                </div>
                ` : ''}

                <p style="margin-top: 30px;">We're excited to see you at Salun!</p>

                <center>
                  <a href="${process.env.NEXTAUTH_URL}/dashboard/client" class="button">
                    View My Bookings
                  </a>
                </center>
              </div>
              <div class="footer">
                <p>✨ Salun - Luxury Salon Services</p>
                <p style="font-size: 12px; margin-top: 10px;">
                  Need to make changes? Contact us at hello@salun.com
                </p>
              </div>
            </div>
          </body>
        </html>
      `;

      await sendEmail(
        booking.user?.email || session.user.email,
        `Booking Confirmed - ${booking.service?.name} at Salun`,
        emailHtml
      );
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      booking: {
        id: bookingId,
        status: 'scheduled',
      },
    });
  } catch (error: any) {
    console.error('Error in /api/bookings/confirm-schedule:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
