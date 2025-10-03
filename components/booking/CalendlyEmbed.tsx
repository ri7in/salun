'use client';

import { useEffect } from 'react';

interface CalendlyEmbedProps {
  calendlyUrl: string;
  onDateTimeSelected: (dateTime: string, eventUri: string) => void;
}

export default function CalendlyEmbed({ calendlyUrl, onDateTimeSelected }: CalendlyEmbedProps) {
  useEffect(() => {
    // Load Calendly widget
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    // Listen for Calendly events
    const handleMessage = (e: MessageEvent) => {
      if (e.data.event === 'calendly.event_scheduled') {
        const event = e.data.payload.event;
        const startTime = event.start_time;
        const eventUri = event.uri;
        onDateTimeSelected(startTime, eventUri);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      document.body.removeChild(script);
      window.removeEventListener('message', handleMessage);
    };
  }, [calendlyUrl, onDateTimeSelected]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Select Date & Time</h2>
      <div
        className="calendly-inline-widget"
        data-url={calendlyUrl}
        style={{ minWidth: '320px', height: '630px' }}
      />
    </div>
  );
}
