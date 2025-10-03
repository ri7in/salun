import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for browser/client-side operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Database helper functions
export async function getUserByEmail(email: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user:', error);
    return null;
  }

  return data;
}

export async function createUser(email: string, name: string, image?: string) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([{ email, name, image, role: 'client' }])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    return null;
  }

  return data;
}

export async function updateUser(userId: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }

  return data;
}

export async function getAllServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching services:', error);
    return [];
  }

  return data || [];
}

export async function getServiceById(serviceId: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    return null;
  }

  return data;
}

export async function getAllStaff() {
  const { data, error } = await supabase
    .from('staff')
    .select(`
      *,
      user:users(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching staff:', error);
    return [];
  }

  return data || [];
}

export async function getStaffById(staffId: string) {
  const { data, error } = await supabase
    .from('staff')
    .select(`
      *,
      user:users(*)
    `)
    .eq('id', staffId)
    .single();

  if (error) {
    console.error('Error fetching staff:', error);
    return null;
  }

  return data;
}

export async function createBooking(bookingData: {
  client_id: string;
  staff_id: string;
  service_id: string;
  date_time: string;
  notes?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .insert([bookingData])
    .select()
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    return null;
  }

  return data;
}

export async function getBookingById(bookingId: string) {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      user:users!bookings_user_id_fkey(*),
      service:services(*),
      staff:staff(*, user:users(*))
    `)
    .eq('id', bookingId)
    .single();

  if (error) {
    console.error('Error fetching booking:', error);
    return null;
  }

  return data;
}

export async function updateBooking(bookingId: string, updates: any) {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .update(updates)
    .eq('id', bookingId)
    .select()
    .single();

  if (error) {
    console.error('Error updating booking:', error);
    return null;
  }

  return data;
}

export async function getBookingsByClientId(clientId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      service:services(*),
      staff:staff(*, user:users(*))
    `)
    .eq('client_id', clientId)
    .order('date_time', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data || [];
}

export async function getBookingsByStaffId(staffId: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      client:users!bookings_client_id_fkey(*),
      service:services(*)
    `)
    .eq('staff_id', staffId)
    .order('date_time', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }

  return data || [];
}

export async function getAllBookings() {
  const { data, error } = await supabaseAdmin
    .from('bookings')
    .select(`
      *,
      client:users!bookings_client_id_fkey(*),
      service:services(*),
      staff:staff(*, user:users(*))
    `)
    .order('date_time', { ascending: false });

  if (error) {
    console.error('Error fetching all bookings:', error);
    return [];
  }

  return data || [];
}

export async function createPayment(paymentData: {
  booking_id: string;
  amount: number;
  stripe_charge_id: string;
  status: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('payments')
    .insert([paymentData])
    .select()
    .single();

  if (error) {
    console.error('Error creating payment:', error);
    return null;
  }

  return data;
}
