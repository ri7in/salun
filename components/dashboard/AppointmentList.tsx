'use client';

import { Booking } from '@/types';
import { formatDateTime, formatCurrency, getStatusColor } from '@/lib/utils';

interface AppointmentListProps {
  bookings: Booking[];
  onCancelBooking?: (bookingId: string) => void;
}

export default function AppointmentList({ bookings, onCancelBooking }: AppointmentListProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-gray-600">No appointments found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {booking.service?.name}
              </h3>
              <p className="text-gray-600 text-sm">
                {formatDateTime(booking.date_time)}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                  booking.payment_status
                )}`}
              >
                {booking.payment_status === 'succeeded' ? 'Paid' : booking.payment_status}
              </span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Stylist</p>
              <p className="font-semibold text-gray-900">
                {booking.staff?.user?.name || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Price</p>
              <p className="font-semibold text-purple-600">
                {booking.service?.price ? formatCurrency(booking.service.price) : 'N/A'}
              </p>
            </div>
          </div>

          {booking.notes && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-1">Notes</p>
              <p className="text-gray-900">{booking.notes}</p>
            </div>
          )}

          <div className="flex gap-2">
            <span className="text-xs text-gray-500">
              Booking ID: #{booking.id.slice(0, 8).toUpperCase()}
            </span>
          </div>

          {onCancelBooking &&
            booking.status !== 'cancelled' &&
            booking.status !== 'completed' && (
              <button
                onClick={() => onCancelBooking(booking.id)}
                className="mt-4 text-red-600 hover:text-red-800 text-sm font-semibold"
              >
                Cancel Booking
              </button>
            )}
        </div>
      ))}
    </div>
  );
}
