import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import AppointmentList from '@/components/dashboard/AppointmentList';
import StatsCard from '@/components/dashboard/StatsCard';

export default async function StaffDashboard() {
  const session = await auth();

  if (!session || session.user.role !== 'staff') {
    redirect('/dashboard/client');
  }

  // Get staff profile
  const { data: staff } = await supabaseAdmin
    .from('staff')
    .select('id')
    .eq('user_id', session.user.id)
    .single();

  if (!staff) {
    redirect('/dashboard/client');
  }

  // Get bookings for this staff member
  const { data: bookings } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      client:users!bookings_client_id_fkey(*),
      service:services(*)
    `)
    .eq('staff_id', staff.id)
    .order('date_time', { ascending: false });

  const allBookings = bookings || [];
  const todayBookings = allBookings.filter((b) => {
    const bookingDate = new Date(b.date_time);
    const today = new Date();
    return (
      bookingDate.getDate() === today.getDate() &&
      bookingDate.getMonth() === today.getMonth() &&
      bookingDate.getFullYear() === today.getFullYear() &&
      b.status !== 'cancelled'
    );
  });

  const upcomingBookings = allBookings.filter(
    (b) => new Date(b.date_time) > new Date() && b.status !== 'cancelled'
  );

  const completedBookings = allBookings.filter((b) => b.status === 'completed');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <div className="container mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Staff Dashboard
          </h1>
          <p className="text-gray-600">Welcome, {session.user.name}!</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Today's Appointments"
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
        </div>

        {/* Today's Appointments */}
        {todayBookings.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Today's Appointments
            </h2>
            <AppointmentList bookings={todayBookings} />
          </div>
        )}

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
          <AppointmentList bookings={allBookings} />
        </div>
      </div>
    </div>
  );
}
