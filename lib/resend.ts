import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@salun.com';

export async function sendEmail(to: string, subject: string, html: string) {
  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject,
      html,
    });
    return result;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

interface BookingEmailData {
  to: string;
  clientName: string;
  serviceName: string;
  staffName: string;
  dateTime: string;
  price: number;
  bookingId: string;
}

export async function sendBookingConfirmationEmail(data: BookingEmailData) {
  try {
    const { to, clientName, serviceName, staffName, dateTime, price, bookingId } = data;

    const formattedDate = new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .booking-details {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .detail-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e5e7eb;
            }
            .detail-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: bold;
              color: #6b7280;
            }
            .value {
              color: #111827;
            }
            .price {
              font-size: 24px;
              color: #667eea;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #6b7280;
              font-size: 14px;
            }
            .button {
              display: inline-block;
              background: #667eea;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 6px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>✨ Salun Luxury Salon</h1>
            <p>Booking Confirmation</p>
          </div>
          <div class="content">
            <p>Dear ${clientName},</p>
            <p>Thank you for choosing Salun! Your appointment has been confirmed and payment has been processed successfully.</p>

            <div class="booking-details">
              <h2 style="margin-top: 0; color: #667eea;">Booking Details</h2>

              <div class="detail-row">
                <span class="label">Booking ID:</span>
                <span class="value">#${bookingId.slice(0, 8).toUpperCase()}</span>
              </div>

              <div class="detail-row">
                <span class="label">Service:</span>
                <span class="value">${serviceName}</span>
              </div>

              <div class="detail-row">
                <span class="label">Stylist:</span>
                <span class="value">${staffName}</span>
              </div>

              <div class="detail-row">
                <span class="label">Date & Time:</span>
                <span class="value">${formattedDate}</span>
              </div>

              <div class="detail-row">
                <span class="label">Amount Paid:</span>
                <span class="price">$${price.toFixed(2)}</span>
              </div>
            </div>

            <p><strong>What to expect:</strong></p>
            <ul>
              <li>Please arrive 10 minutes before your appointment</li>
              <li>Bring a valid ID for verification</li>
              <li>Our stylist will consult with you before the service</li>
            </ul>

            <p>We look forward to pampering you!</p>

            <div style="text-align: center;">
              <a href="${process.env.NEXTAUTH_URL}/dashboard/client" class="button">View My Bookings</a>
            </div>
          </div>
          <div class="footer">
            <p>Salun Luxury Salon | Premium Beauty Services</p>
            <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `✨ Booking Confirmed - ${serviceName}`,
      html: emailHtml,
    });

    return result;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    throw error;
  }
}

export async function sendBookingCancellationEmail(
  to: string,
  clientName: string,
  serviceName: string,
  dateTime: string,
  bookingId: string
) {
  try {
    const formattedDate = new Date(dateTime).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #ef4444;
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Booking Cancelled</h1>
          </div>
          <div class="content">
            <p>Dear ${clientName},</p>
            <p>Your booking has been cancelled successfully.</p>
            <p><strong>Cancelled Booking Details:</strong></p>
            <ul>
              <li>Booking ID: #${bookingId.slice(0, 8).toUpperCase()}</li>
              <li>Service: ${serviceName}</li>
              <li>Date & Time: ${formattedDate}</li>
            </ul>
            <p>We hope to see you again soon!</p>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: fromEmail,
      to,
      subject: `Booking Cancelled - ${serviceName}`,
      html: emailHtml,
    });

    return result;
  } catch (error) {
    console.error('Error sending cancellation email:', error);
    throw error;
  }
}
