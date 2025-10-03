import Link from 'next/link';
import { Service } from '@/types';
import { formatCurrency, formatDuration } from '@/lib/utils';

interface ServiceCardProps {
  service: Service;
}

export default function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1">
      {service.image_url && (
        <div className="h-48 overflow-hidden">
          <img
            src={service.image_url}
            alt={service.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{service.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-purple-600">
              {formatCurrency(service.price)}
            </span>
          </div>
          <div className="text-gray-500 text-sm">
            {formatDuration(service.duration)}
          </div>
        </div>

        <Link
          href={`/booking/${service.id}`}
          className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
