import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  createBooking,
  updateBooking,
  getBookingsByClientId,
  getAllBookings,
  getServiceById,
  getStaffById,
} from '@/lib/supabase';
import { createCheckoutSession } from '@/lib/stripe';
import { ApiResponse, BookingFormData } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: BookingFormData = await req.json();
    const { serviceId, staffId, dateTime, notes } = body;

    // Validate required fields
    if (!serviceId || !staffId || !dateTime) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get service details
    const service = await getServiceById(serviceId);
    if (!service) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Service not found' },
        { status: 404 }
      );
    }

    // Get staff details
    const staff = await getStaffById(staffId);
    if (!staff) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Staff not found' },
        { status: 404 }
      );
    }

    // Create booking
    const booking = await createBooking({
      client_id: session.user.id,
      staff_id: staffId,
      service_id: serviceId,
      date_time: dateTime,
      notes,
    });

    if (!booking) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    // Create Stripe checkout session
    const checkoutSession = await createCheckoutSession(
      serviceId,
      service.name,
      service.price,
      booking.id,
      `${process.env.NEXTAUTH_URL}/success?bookingId=${booking.id}`,
      `${process.env.NEXTAUTH_URL}/services`
    );

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        booking,
        checkoutUrl: checkoutSession.url,
      },
    });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get('clientId');

    let bookings;
    if (session.user.role === 'admin') {
      bookings = await getAllBookings();
    } else if (clientId && clientId === session.user.id) {
      bookings = await getBookingsByClientId(clientId);
    } else {
      bookings = await getBookingsByClientId(session.user.id);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: bookings,
    });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { bookingId, status } = await req.json();

    if (!bookingId || !status) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const booking = await updateBooking(bookingId, { status });

    if (!booking) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: booking,
    });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
