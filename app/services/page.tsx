import { getAllServices } from '@/lib/supabase';
import ServiceCard from '@/components/services/ServiceCard';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ServicesPage() {
  const services = await getAllServices();

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen py-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Premium Services
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our curated selection of luxury salon services, each designed to bring out your best.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No services available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
