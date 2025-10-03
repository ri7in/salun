import { getServiceById, getAllStaff } from '@/lib/supabase';
import { notFound, redirect } from 'next/navigation';
import BookingForm from '@/components/booking/BookingForm';
import { auth } from '@/lib/auth';

interface BookingPageProps {
  params: Promise<{ serviceId: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  // Require authentication for booking
  const session = await auth();
  if (!session || !session.user) {
    redirect('/login?callbackUrl=/booking/' + (await params).serviceId);
  }

  const { serviceId } = await params;
  const service = await getServiceById(serviceId);

  if (!service) {
    notFound();
  }

  const staff = await getAllStaff();

  if (staff.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Staff Available
            </h1>
            <p className="text-gray-600">
              Sorry, there are no staff members available at this time. Please check back later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Book {service.name}
            </h1>
            <p className="text-gray-600">{service.description}</p>
          </div>

          <BookingForm service={service} staff={staff} userId={session.user.id} userEmail={session.user.email} />
        </div>
      </div>
    </div>
  );
}
