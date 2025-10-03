# 🚀 Quick Start Guide

Get Salun up and running in under 15 minutes!

## Step 1: Install Dependencies (1 min)

```bash
npm install
```

## Step 2: Set Up Environment Variables (5 mins)

1. Copy the example file:
```bash
cp .env.example .env.local
```

2. Fill in the required values in `.env.local`:

### Minimum Required Setup (For Development)

To get started quickly, you need **at least these 3 services**:

#### 1. Supabase (Free)
- Sign up at [supabase.com](https://supabase.com)
- Create a new project
- Go to Settings > API
- Copy `URL` and `anon key`
- Go to SQL Editor and paste the entire content from `supabase/schema.sql`
- Click "Run"

#### 2. Google OAuth (Free)
- Go to [console.cloud.google.com](https://console.cloud.google.com)
- Create project → Enable Google+ API
- Credentials → Create OAuth 2.0 Client
- Add redirect: `http://localhost:3000/api/auth/callback/google`
- Copy Client ID and Secret

#### 3. Generate Auth Secret
```bash
openssl rand -base64 32
```

### Your Minimal .env.local

```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generated-secret>

GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Optional for now (add later for full functionality)
STRIPE_SECRET_KEY=sk_test_placeholder
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_placeholder
STRIPE_WEBHOOK_SECRET=whsec_placeholder
RESEND_API_KEY=re_placeholder
RESEND_FROM_EMAIL=test@example.com
ADMIN_EMAIL=your-email@example.com
GITHUB_CLIENT_ID=placeholder
GITHUB_CLIENT_SECRET=placeholder
```

## Step 3: Run Development Server (1 min)

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Step 4: Test the App (3 mins)

1. Click "Sign In"
2. Sign in with Google
3. Browse services at `/services`
4. View your dashboard at `/dashboard/client`

## ✅ You're Ready!

The app is now running with:
- ✅ Authentication (Google OAuth)
- ✅ Service browsing
- ✅ User dashboard
- ✅ Database with sample services

## 🔧 Next Steps (Add When Ready)

### To Enable Full Booking Flow:

1. **Add Stripe** (for payments)
   - Sign up at [stripe.com](https://stripe.com)
   - Get API keys from Developers section
   - Add to `.env.local`

2. **Add Resend** (for emails)
   - Sign up at [resend.com](https://resend.com)
   - Get API key
   - Add to `.env.local`

3. **Add Staff Members**
   - Create Calendly account for each staff member
   - Add staff to database using Supabase dashboard:

```sql
-- First, sign in as the staff user to create their account
-- Then run this in Supabase SQL Editor:

-- Update user to staff role
UPDATE users SET role = 'staff' WHERE email = 'staff@example.com';

-- Add staff profile
INSERT INTO staff (user_id, specialty, calendly_url, bio)
VALUES (
  (SELECT id FROM users WHERE email = 'staff@example.com'),
  'Hair Styling Expert',
  'https://calendly.com/your-username/appointment',
  'Professional stylist with 10 years experience'
);
```

4. **Test Full Booking Flow**
   - Browse services
   - Select a service
   - Choose a staff member
   - Pick a time slot (Calendly)
   - Complete payment (Stripe)
   - Receive confirmation email (Resend)

## 🎯 Common Issues

### "Invalid environment variables"
- Check all required variables are set
- No trailing spaces in values
- URLs don't end with `/`

### "Authentication error"
- Verify OAuth redirect URIs match exactly
- Check client ID and secrets
- Clear browser cookies and try again

### "Database error"
- Confirm schema was run successfully in Supabase
- Check Supabase credentials
- Verify RLS policies are enabled

### Services not showing
- Run the schema.sql in Supabase
- Check sample data was inserted
- Verify Supabase connection

## 📚 Full Documentation

For complete setup instructions, deployment guide, and troubleshooting:
- See [README.md](README.md)

## 🎉 Have Fun!

You now have a working luxury salon booking system. Customize it, add features, and make it your own!

**Need help?** Check the [README.md](README.md) for detailed documentation.