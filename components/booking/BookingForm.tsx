'use client';

import { useState } from 'react';
import { Service, Staff } from '@/types';
import { formatCurrency, formatDuration } from '@/lib/utils';
import StaffSelector from './StaffSelector';

interface BookingFormProps {
  service: Service;
  staff: Staff[];
  userId: string;
  userEmail: string;
}

export default function BookingForm({ service, staff, userId, userEmail }: BookingFormProps) {
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedStaff = staff.find((s) => s.id === selectedStaffId);

  const handleProceedToPayment = async () => {
    if (!selectedStaffId) {
      setError('Please select a stylist');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create booking with pending payment status
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          staffId: selectedStaffId,
          notes,
          userId,
          userEmail,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to create booking');
      }

      // Redirect to Stripe checkout
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Service Summary */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Service:</span>
            <span className="font-semibold">{service.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Duration:</span>
            <span className="font-semibold">{formatDuration(service.duration)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Price:</span>
            <span className="font-semibold text-purple-600 text-xl">
              {formatCurrency(service.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Staff Selection */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <StaffSelector
          staff={staff}
          selectedStaffId={selectedStaffId}
          onSelect={setSelectedStaffId}
        />
      </div>

      {/* Notes */}
      {selectedStaffId && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Additional Notes</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special requests or preferences? (Optional)"
            className="w-full border-2 border-gray-200 rounded-lg p-4 focus:border-purple-600 focus:outline-none"
            rows={4}
          />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Booking Flow Information */}
      {selectedStaffId && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border-2 border-purple-200">
          <h3 className="text-lg font-bold text-gray-900 mb-3">📋 Next Steps:</h3>
          <ol className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="font-bold text-purple-600">1.</span>
              <span>Complete payment securely via Stripe</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-purple-600">2.</span>
              <span>You'll be redirected to schedule your appointment with <strong>{selectedStaff?.user?.name}</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-purple-600">3.</span>
              <span>Receive confirmation email with booking details</span>
            </li>
          </ol>
        </div>
      )}

      {/* Proceed to Payment */}
      {selectedStaffId && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <button
            onClick={handleProceedToPayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : `Pay ${formatCurrency(service.price)} & Book Appointment`}
          </button>
          <p className="text-center text-sm text-gray-600 mt-4">
            🔒 Secure payment powered by Stripe
          </p>
        </div>
      )}
    </div>
  );
}
