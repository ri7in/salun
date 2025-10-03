'use client';

import { useEffect, useState } from 'react';
import { InlineWidget } from 'react-calendly';
import { useRouter } from 'next/navigation';

interface ScheduleCalendlyProps {
  calendlyUrl: string;
  bookingId: string;
  userEmail: string;
  userName: string;
}

export default function ScheduleCalendly({
  calendlyUrl,
  bookingId,
  userEmail,
  userName,
}: ScheduleCalendlyProps) {
  const router = useRouter();
  const [isScheduled, setIsScheduled] = useState(false);

  useEffect(() => {
    const handleCalendlyEvent = async (e: MessageEvent) => {
      if (e.data.event && e.data.event === 'calendly.event_scheduled') {
        setIsScheduled(true);

        const eventUri = e.data.payload.event.uri;
        const inviteeUri = e.data.payload.invitee.uri;

        try {
          // Update booking with Calendly event details
          const response = await fetch('/api/bookings/confirm-schedule', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bookingId,
              calendlyEventUri: eventUri,
              calendlyInviteeUri: inviteeUri,
            }),
          });

          const data = await response.json();

          if (data.success) {
            // Redirect to success page
            setTimeout(() => {
              router.push(`/booking/success/${bookingId}`);
            }, 2000);
          }
        } catch (error) {
          console.error('Error confirming schedule:', error);
        }
      }
    };

    window.addEventListener('message', handleCalendlyEvent);
    return () => window.removeEventListener('message', handleCalendlyEvent);
  }, [bookingId, router]);

  if (isScheduled) {
    return (
      <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
        <div className="animate-bounce text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Appointment Scheduled!
        </h2>
        <p className="text-gray-600 mb-4">
          Redirecting you to confirmation page...
        </p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Schedule Your Appointment
      </h2>
      <p className="text-gray-600 mb-6">
        Select a convenient time slot from the calendar below
      </p>
      <InlineWidget
        url={calendlyUrl}
        prefill={{
          email: userEmail,
          name: userName,
          customAnswers: {
            a1: bookingId, // Pass booking ID as custom answer
          },
        }}
        styles={{
          height: '700px',
        }}
      />
    </div>
  );
}
