import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getAllBookings } from '@/lib/supabase';
import AppointmentList from '@/components/dashboard/AppointmentList';
import StatsCard from '@/components/dashboard/StatsCard';

export default async function AdminDashboard() {
  const session = await auth();

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard/client');
  }

  const bookings = await getAllBookings();

  const todayBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date_time);
    const today = new Date();
    return (
      bookingDate.getDate() === today.getDate() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getFullYear() === today.getFullYear()
    );
  });

  const upcomingBookings = bookings.filter(
    (b) => new Date(b.date_time) > new Date() && b.status !== 'cancelled'
  );

  const completedBookings = bookings.filter((b) => b.status === 'completed');

  const totalRevenue = completedBookings.reduce(
    (sum, b) => sum + (b.service?.price || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage salon operations</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Today's Bookings"
            value={todayBookings.length}
            icon="📅"
            color="yellow"
          />
          <StatsCard
            title="Upcoming"
            value={upcomingBookings.length}
            icon="⏰"
            color="purple"
          />
          <StatsCard
            title="Completed"
            value={completedBookings.length}
            icon="✅"
            color="green"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon="💰"
            color="blue"
          />
        </div>

        {/* Today's Bookings */}
        {todayBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Today's Bookings
            </h2>
            <AppointmentList bookings={todayBookings} />
          </div>
        )}

        {/* Upcoming Bookings */}
        {upcomingBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Upcoming Bookings
            </h2>
            <AppointmentList bookings={upcomingBookings} />
          </div>
        )}

        {/* All Bookings */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            All Bookings
          </h2>
          <AppointmentList bookings={bookings} />
        </div>
      </div>
    </div>
  );
}
