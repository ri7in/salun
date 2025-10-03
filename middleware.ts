import { auth } from '@/lib/auth';

export default auth((req) => {
  // Auth check happens automatically
  // You can add additional logic here if needed
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/booking/:path*',
    '/api/bookings/:path*',
    '/api/admin/:path*',
  ],
};
