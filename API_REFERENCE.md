# 📡 Salun API Reference

Complete API documentation for developers.

## Authentication

All API routes (except webhooks) require authentication via NextAuth session.

### Session Structure
```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    image?: string;
    role: 'client' | 'staff' | 'admin';
  }
}
```

---

## API Endpoints

### 🔐 Authentication

#### POST `/api/auth/signin`
NextAuth sign-in endpoint (Google/GitHub OAuth)

**No direct API call needed - use NextAuth client:**
```typescript
import { signIn } from 'next-auth/react';
await signIn('google', { callbackUrl: '/services' });
await signIn('github', { callbackUrl: '/services' });
```

#### POST `/api/auth/signout`
Sign out endpoint

**Usage:**
```typescript
import { signOut } from 'next-auth/react';
await signOut({ callbackUrl: '/' });
```

---

### 📅 Bookings

#### POST `/api/bookings`
Create a new booking

**Authentication:** Required (Client)

**Request Body:**
```typescript
{
  serviceId: string;    // UUID of service
  staffId: string;      // UUID of staff member
  dateTime: string;     // ISO 8601 datetime
  notes?: string;       // Optional booking notes
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: {
    booking: Booking;
    checkoutUrl: string;  // Stripe checkout URL
  };
  error?: string;
}
```

**Example:**
```typescript
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceId: '123e4567-e89b-12d3-a456-426614174000',
    staffId: '987fbc97-4bed-5078-9f07-9141ba07c9f3',
    dateTime: '2024-12-25T14:00:00Z',
    notes: 'Please use organic products'
  })
});
const data = await response.json();
```

#### GET `/api/bookings`
Get bookings for current user (or all if admin)

**Authentication:** Required

**Query Parameters:**
- `clientId` (optional): Specific client ID (admin only)

**Response:**
```typescript
{
  success: boolean;
  data?: Booking[];
  error?: string;
}
```

**Example:**
```typescript
const response = await fetch('/api/bookings');
const { data } = await response.json();
```

#### PATCH `/api/bookings`
Update booking status

**Authentication:** Required

**Request Body:**
```typescript
{
  bookingId: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}
```

**Response:**
```typescript
{
  success: boolean;
  data?: Booking;
  error?: string;
}
```

**Example:**
```typescript
const response = await fetch('/api/bookings', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    bookingId: '123e4567-e89b-12d3-a456-426614174000',
    status: 'cancelled'
  })
});
```

---

### 💳 Stripe Webhooks

#### POST `/api/stripe/webhook`
Handle Stripe webhook events

**Authentication:** Stripe signature verification

**Events Handled:**
- `checkout.session.completed` - Payment successful
- `payment_intent.payment_failed` - Payment failed

**This endpoint is called automatically by Stripe. Do not call manually.**

**Webhook Configuration:**
```bash
URL: https://your-domain.com/api/stripe/webhook
Events: checkout.session.completed
```

---

### 👔 Admin - Services

#### GET `/api/admin/services`
Get all services

**Authentication:** Required (Admin only)

**Response:**
```typescript
{
  success: boolean;
  data?: Service[];
  error?: string;
}
```

#### POST `/api/admin/services`
Create new service

**Authentication:** Required (Admin only)

**Request Body:**
```typescript
{
  name: string;
  description: string;
  price: number;        // USD amount
  duration: number;     // Minutes
  image_url?: string;
}
```

**Example:**
```typescript
await fetch('/api/admin/services', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Premium Haircut',
    description: 'Luxury haircut with consultation',
    price: 150.00,
    duration: 60,
    image_url: 'https://example.com/image.jpg'
  })
});
```

#### PATCH `/api/admin/services`
Update existing service

**Authentication:** Required (Admin only)

**Request Body:**
```typescript
{
  id: string;
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  image_url?: string;
}
```

#### DELETE `/api/admin/services?id={serviceId}`
Delete service

**Authentication:** Required (Admin only)

**Query Parameters:**
- `id`: Service UUID

---

### 👥 Admin - Staff

#### GET `/api/admin/staff`
Get all staff members

**Authentication:** Required (Admin only)

**Response:**
```typescript
{
  success: boolean;
  data?: Staff[];
  error?: string;
}
```

#### POST `/api/admin/staff`
Create staff profile

**Authentication:** Required (Admin only)

**Request Body:**
```typescript
{
  user_id: string;        // User UUID
  specialty: string;
  calendly_url: string;
  bio?: string;
  avatar_url?: string;
}
```

**Example:**
```typescript
await fetch('/api/admin/staff', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    user_id: '123e4567-e89b-12d3-a456-426614174000',
    specialty: 'Hair Coloring Expert',
    calendly_url: 'https://calendly.com/username/appointment',
    bio: 'Professional stylist with 10 years experience'
  })
});
```

#### PATCH `/api/admin/staff`
Update staff profile

**Authentication:** Required (Admin only)

**Request Body:**
```typescript
{
  id: string;
  specialty?: string;
  calendly_url?: string;
  bio?: string;
  avatar_url?: string;
}
```

---

## Type Definitions

### User
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: 'client' | 'staff' | 'admin';
  image?: string;
  created_at: string;
  updated_at?: string;
}
```

### Service
```typescript
interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image_url?: string;
  created_at: string;
  updated_at?: string;
}
```

### Staff
```typescript
interface Staff {
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
```

### Booking
```typescript
interface Booking {
  id: string;
  client_id: string;
  client?: User;
  staff_id: string;
  staff?: Staff;
  service_id: string;
  service?: Service;
  date_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  stripe_payment_id?: string;
  calendly_event_uri?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}
```

### Payment
```typescript
interface Payment {
  id: string;
  booking_id: string;
  amount: number;
  stripe_charge_id: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  created_at: string;
}
```

---

## Database Functions

All database operations are in `lib/supabase.ts`:

### User Functions
- `getUserByEmail(email: string): Promise<User | null>`
- `createUser(email, name, image?): Promise<User | null>`
- `updateUser(userId, updates): Promise<User | null>`

### Service Functions
- `getAllServices(): Promise<Service[]>`
- `getServiceById(serviceId): Promise<Service | null>`

### Staff Functions
- `getAllStaff(): Promise<Staff[]>`
- `getStaffById(staffId): Promise<Staff | null>`

### Booking Functions
- `createBooking(bookingData): Promise<Booking | null>`
- `updateBooking(bookingId, updates): Promise<Booking | null>`
- `getBookingsByClientId(clientId): Promise<Booking[]>`
- `getBookingsByStaffId(staffId): Promise<Booking[]>`
- `getAllBookings(): Promise<Booking[]>`

### Payment Functions
- `createPayment(paymentData): Promise<Payment | null>`

---

## Stripe Integration

### Create Checkout Session
```typescript
import { createCheckoutSession } from '@/lib/stripe';

const session = await createCheckoutSession(
  serviceId,
  serviceName,
  amount,
  bookingId,
  successUrl,
  cancelUrl
);
```

### Handle Webhook
Stripe webhooks are automatically processed in `/api/stripe/webhook`

---

## Email Service

### Send Booking Confirmation
```typescript
import { sendBookingConfirmationEmail } from '@/lib/resend';

await sendBookingConfirmationEmail({
  to: 'client@example.com',
  clientName: 'John Doe',
  serviceName: 'Premium Haircut',
  staffName: 'Jane Smith',
  dateTime: '2024-12-25T14:00:00Z',
  price: 150.00,
  bookingId: '123e4567-e89b-12d3-a456-426614174000'
});
```

### Send Cancellation Email
```typescript
import { sendBookingCancellationEmail } from '@/lib/resend';

await sendBookingCancellationEmail(
  'client@example.com',
  'John Doe',
  'Premium Haircut',
  '2024-12-25T14:00:00Z',
  '123e4567-e89b-12d3-a456-426614174000'
);
```

---

## Error Handling

All API responses follow this structure:

### Success Response
```typescript
{
  success: true,
  data: any,
  message?: string
}
```

### Error Response
```typescript
{
  success: false,
  error: string
}
```

### HTTP Status Codes
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

**Currently:** No rate limiting implemented

**Recommendation for Production:**
- Implement rate limiting with Upstash Redis
- Use Vercel Edge Middleware
- Limit: 100 requests per hour per user

---

## Security

### Authentication
- All routes (except public pages) require authentication
- Middleware protects dashboard and booking routes
- OAuth 2.0 with Google and GitHub

### Authorization
- Role-based access control (RBAC)
- Admin-only routes check `session.user.role === 'admin'`
- Staff routes check `session.user.role === 'staff'`

### Database Security
- Row Level Security (RLS) enabled
- Users can only access their own data
- Staff can access their bookings
- Admins have full access

### API Security
- CSRF protection enabled
- Environment variables for secrets
- Stripe webhook signature verification
- Input validation on all endpoints

---

## Usage Examples

### Complete Booking Flow
```typescript
// 1. User selects service and staff
// 2. User picks time via Calendly
// 3. Create booking
const booking = await fetch('/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceId,
    staffId,
    dateTime,
    notes
  })
});

// 4. Redirect to Stripe checkout
const { data } = await booking.json();
window.location.href = data.checkoutUrl;

// 5. Stripe processes payment
// 6. Webhook updates booking status
// 7. Confirmation email sent automatically
// 8. User redirected to success page
```

---

## Development Tips

### Testing Webhooks Locally
```bash
# Terminal 1
npm run dev

# Terminal 2
stripe listen --forward-to localhost:3000/api/stripe/webhook
# Copy webhook secret to .env.local
```

### Database Queries
Use Supabase dashboard SQL editor for direct queries

### Debugging
- Check Vercel logs for production
- Use `console.log` in development
- Review Stripe dashboard for payment issues
- Check Supabase logs for database errors

---

## Support

For issues or questions:
- Check [README.md](README.md) for setup help
- Review [QUICKSTART.md](QUICKSTART.md) for quick start
- See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for deployment

---

**Happy Building! 🚀**
