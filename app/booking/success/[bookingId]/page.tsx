import { auth } from '@/lib/auth';
import { getBookingById } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface SuccessPageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login');
  }

  const { bookingId } = await params;
  const booking = await getBookingById(bookingId);

  if (!booking) {
    notFound();
  }

  // Verify booking belongs to user
  if (booking.user_id !== session.user.id) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Your appointment has been successfully scheduled
            </p>
          </div>

          {/* Booking Details */}
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Booking Details
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600 font-medium">Service</span>
                <span className="text-gray-900 font-semibold">
                  {booking.service?.name}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600 font-medium">Staff Member</span>
                <span className="text-gray-900 font-semibold">
                  {booking.staff?.user?.name}
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600 font-medium">Duration</span>
                <span className="text-gray-900 font-semibold">
                  {booking.service?.duration} minutes
                </span>
              </div>

              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-gray-600 font-medium">Amount Paid</span>
                <span className="text-purple-600 font-bold text-xl">
                  {formatCurrency(booking.total_price)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Booking ID</span>
                <span className="text-gray-900 font-mono text-sm">
                  #{bookingId.substring(0, 8)}
                </span>
              </div>
            </div>

            {booking.notes && (
              <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  Special Notes:
                </p>
                <p className="text-gray-700">{booking.notes}</p>
              </div>
            )}
          </div>

          {/* What's Next */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-8 rounded-2xl shadow-lg text-white mb-8">
            <h2 className="text-2xl font-bold mb-4">What Happens Next?</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-2xl">📧</span>
                <span>
                  You'll receive a confirmation email with all booking details
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">📅</span>
                <span>
                  Check your email for a Calendly calendar invitation with your
                  appointment date and time
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">💆</span>
                <span>
                  Prepare to enjoy your luxury salon experience at Salun!
                </span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              href="/dashboard/client"
              className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              View My Bookings
            </Link>
            <Link
              href="/services"
              className="px-8 py-4 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition"
            >
              Book Another Service
            </Link>
          </div>

          <p className="text-center text-gray-600 mt-8">
            Need help? Contact us at{' '}
            <a
              href="mailto:hello@salun.com"
              className="text-purple-600 hover:underline font-semibold"
            >
              hello@salun.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
