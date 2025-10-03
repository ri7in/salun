// User roles
export type UserRole = 'client' | 'staff' | 'admin';

// Database types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  image?: string;
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface Staff {
  id: string;
  user_id: string;
  user?: User;
  specialty: string;
  calendly_url: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  client_id: string;
  client?: User;
  staff_id: string;
  staff?: Staff;
  service_id: string;
  service?: Service;
  date_time: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  stripe_payment_id?: string;
  calendly_event_uri?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  booking?: Booking;
  amount: number;
  stripe_charge_id: string;
  status: PaymentStatus;
  created_at: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Booking form data
export interface BookingFormData {
  serviceId: string;
  staffId: string;
  dateTime: string;
  notes?: string;
}

// Dashboard stats
export interface DashboardStats {
  totalBookings: number;
  upcomingBookings: number;
  completedBookings: number;
  totalRevenue: number;
  todayBookings: number;
}
