import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getBookingsByClientId } from '@/lib/supabase';
import AppointmentList from '@/components/dashboard/AppointmentList';
import StatsCard from '@/components/dashboard/StatsCard';
import Link from 'next/link';

export default async function ClientDashboard() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const bookings = await getBookingsByClientId(session.user.id);

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date_time) > new Date() && b.status !== 'cancelled'
  );
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalSpent = completedBookings.reduce(
    (sum, b) => sum + (b.service?.price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome, {session.user.name}!
          </h1>
          <p className="text-gray-600">Manage your salon appointments</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Upcoming Appointments"
            value={upcomingBookings.length}
            icon="📅"
            color="purple"
          />
          <StatsCard
            title="Completed"
            value={completedBookings.length}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="Total Spent"
            value={`$${totalSpent.toFixed(2)}`}
            icon="💰"
            color="blue"
          />
        </div>

        {/* Quick Action */}
        <div className="mb-8">
          <Link
            href="/services"
            className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition"
          >
            Book New Appointment
          </Link>
        </div>

        {/* Upcoming Appointments */}
        {upcomingBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Upcoming Appointments
            </h2>
            <AppointmentList bookings={upcomingBookings} />
          </div>
        )}

        {/* All Appointments */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Appointments
          </h2>
          <AppointmentList bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
