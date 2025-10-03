import { auth } from '@/lib/auth';
import { getBookingById, getStaffById } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import ScheduleCalendly from '@/components/booking/ScheduleCalendly';

interface SchedulePageProps {
  params: Promise<{ bookingId: string }>;
}

export default async function SchedulePage({ params }: SchedulePageProps) {
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Unauthorized
            </h1>
            <p className="text-gray-600">
              This booking does not belong to you.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Check if booking is already scheduled
  if (booking.status === 'scheduled' || booking.date_time) {
    redirect(`/dashboard/client?booking=${bookingId}`);
  }

  // Check if payment is confirmed
  if (booking.status !== 'confirmed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Pending
            </h1>
            <p className="text-gray-600 mb-6">
              Your payment is being processed. This usually takes a few moments.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  const staff = await getStaffById(booking.staff_id);

  if (!staff) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Payment Successful!
                </h1>
                <p className="text-gray-600">
                  Now let's schedule your appointment
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-gray-700">
                <strong>Service:</strong> {booking.service?.name}
              </p>
              <p className="text-gray-700">
                <strong>Staff:</strong> {staff.user?.name}
              </p>
            </div>
          </div>

          <ScheduleCalendly
            calendlyUrl={staff.calendly_url}
            bookingId={bookingId}
            userEmail={session.user.email}
            userName={session.user.name}
          />
        </div>
      </div>
    </div>
  );
}
