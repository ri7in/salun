# 🚀 Deployment Checklist

Use this checklist to ensure smooth deployment to production.

## Pre-Deployment

### 1. Local Testing ✓
- [ ] Run `npm run build` locally (should complete without errors)
- [ ] Test all user flows (sign in, booking, payment, email)
- [ ] Verify all dashboards (client/staff/admin)
- [ ] Test with real OAuth providers
- [ ] Test Stripe checkout (use test mode)

### 2. Environment Setup ✓

#### Production Services
- [ ] **Supabase**: Create production project
- [ ] **Stripe**: Switch to live mode (or keep test mode initially)
- [ ] **Resend**: Verify domain for production emails
- [ ] **Google OAuth**: Add production redirect URI
- [ ] **GitHub OAuth**: Add production redirect URI
- [ ] **Calendly**: Ensure staff have active accounts

#### Production Credentials
- [ ] Generate new `NEXTAUTH_SECRET` for production
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Use production Supabase credentials
- [ ] Use production Stripe keys
- [ ] Use production Resend API key
- [ ] Update OAuth redirect URIs

### 3. Database Setup ✓
- [ ] Run `supabase/schema.sql` in production Supabase
- [ ] Verify RLS policies are enabled
- [ ] Check sample services are loaded
- [ ] Test database connections
- [ ] Set up database backups

## Vercel Deployment

### 1. GitHub Repository
```bash
git init
git add .
git commit -m "Initial commit: Salun luxury salon booking app"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Vercel Project Setup
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `next build`
   - Output Directory: `.next`

### 3. Environment Variables
Add all variables in Vercel dashboard:

```env
# App
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<new-production-secret>

# OAuth
GOOGLE_CLIENT_ID=<production-google-id>
GOOGLE_CLIENT_SECRET=<production-google-secret>
GITHUB_CLIENT_ID=<production-github-id>
GITHUB_CLIENT_SECRET=<production-github-secret>

# Database
NEXT_PUBLIC_SUPABASE_URL=<production-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<production-service-key>

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=<live-or-test-pk>
STRIPE_SECRET_KEY=<live-or-test-sk>
STRIPE_WEBHOOK_SECRET=<production-webhook-secret>

# Email
RESEND_API_KEY=<production-resend-key>
RESEND_FROM_EMAIL=<verified-email>

# Admin
ADMIN_EMAIL=<admin-email>
```

### 4. Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for errors
- [ ] Visit deployed URL

## Post-Deployment Configuration

### 1. Update OAuth Redirects
- [ ] **Google**: Add `https://your-domain.vercel.app/api/auth/callback/google`
- [ ] **GitHub**: Add `https://your-domain.vercel.app/api/auth/callback/github`

### 2. Configure Stripe Webhook
1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add endpoint"
3. URL: `https://your-domain.vercel.app/api/stripe/webhook`
4. Events: Select `checkout.session.completed`
5. Copy webhook secret
6. Update `STRIPE_WEBHOOK_SECRET` in Vercel
7. Redeploy if needed

### 3. Verify Email Domain (Resend)
- [ ] Add DNS records for your domain
- [ ] Verify domain in Resend dashboard
- [ ] Update `RESEND_FROM_EMAIL` to use verified domain
- [ ] Send test email

### 4. Create Admin User
- [ ] Sign in with `ADMIN_EMAIL`
- [ ] Verify admin access to `/dashboard/admin`
- [ ] Check admin can view all bookings

### 5. Add Staff Members
For each staff member:
1. Have them sign in first
2. Use Supabase dashboard:
   ```sql
   UPDATE users SET role = 'staff' WHERE email = 'staff@example.com';

   INSERT INTO staff (user_id, specialty, calendly_url, bio)
   VALUES (
     (SELECT id FROM users WHERE email = 'staff@example.com'),
     'Specialty',
     'https://calendly.com/username/event',
     'Bio text'
   );
   ```
3. Verify they can access `/dashboard/staff`

## Testing in Production

### 1. Authentication ✓
- [ ] Sign in with Google
- [ ] Sign in with GitHub
- [ ] Sign out and sign back in
- [ ] Check session persistence

### 2. Client Flow ✓
- [ ] Browse services
- [ ] Select a service
- [ ] Choose staff member
- [ ] Select time via Calendly
- [ ] Complete payment
- [ ] Verify confirmation email
- [ ] Check booking in dashboard

### 3. Staff Flow ✓
- [ ] Sign in as staff
- [ ] View today's appointments
- [ ] Check upcoming bookings
- [ ] Verify client details visible

### 4. Admin Flow ✓
- [ ] Sign in as admin
- [ ] View all bookings
- [ ] Check revenue stats
- [ ] Monitor today's bookings

### 5. Email Verification ✓
- [ ] Complete a test booking
- [ ] Check confirmation email arrives
- [ ] Verify email formatting
- [ ] Test email links work

## Monitoring Setup

### 1. Vercel Analytics
- [ ] Enable Vercel Analytics
- [ ] Monitor page views
- [ ] Track Core Web Vitals

### 2. Error Tracking (Optional)
- [ ] Set up Sentry or similar
- [ ] Add error boundary
- [ ] Test error reporting

### 3. Stripe Monitoring
- [ ] Check Stripe dashboard regularly
- [ ] Monitor failed payments
- [ ] Review webhook logs

### 4. Database Monitoring
- [ ] Set up Supabase alerts
- [ ] Monitor query performance
- [ ] Check database size

## Security Checklist

- [ ] All environment variables are secure
- [ ] No secrets in source code
- [ ] HTTPS enabled (automatic on Vercel)
- [ ] OAuth redirects use HTTPS only
- [ ] Webhook signatures verified
- [ ] RLS policies enabled on all tables
- [ ] API routes protected with auth
- [ ] CORS configured properly

## Performance Optimization

- [ ] Enable Vercel CDN
- [ ] Optimize images (use next/image)
- [ ] Enable caching headers
- [ ] Monitor loading times
- [ ] Check mobile performance

## Backup & Recovery

- [ ] Set up Supabase automated backups
- [ ] Export booking data regularly
- [ ] Document recovery procedures
- [ ] Test backup restoration

## Documentation

- [ ] Update README with production URLs
- [ ] Document staff onboarding process
- [ ] Create admin guide
- [ ] Write troubleshooting guide

## Legal & Compliance

- [ ] Add privacy policy page
- [ ] Add terms of service page
- [ ] GDPR compliance (if EU users)
- [ ] Payment processing compliance
- [ ] Cookie consent (if required)

## Launch Preparation

### Soft Launch
- [ ] Test with small group of users
- [ ] Collect feedback
- [ ] Fix any issues
- [ ] Monitor for errors

### Full Launch
- [ ] Announce on social media
- [ ] Send launch emails
- [ ] Monitor traffic
- [ ] Be ready for support requests

## Post-Launch Monitoring

### Day 1-3
- [ ] Monitor error rates
- [ ] Check payment success rates
- [ ] Verify emails are sending
- [ ] Watch for performance issues

### Week 1
- [ ] Review analytics
- [ ] Check user feedback
- [ ] Monitor database performance
- [ ] Review booking patterns

### Month 1
- [ ] Analyze booking trends
- [ ] Review revenue metrics
- [ ] Optimize based on usage
- [ ] Plan feature improvements

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor Stripe dashboard
- [ ] Review failed bookings

### Weekly
- [ ] Check Supabase usage
- [ ] Review email delivery rates
- [ ] Monitor API response times
- [ ] Check for security updates

### Monthly
- [ ] Update dependencies
- [ ] Review and optimize queries
- [ ] Analyze user feedback
- [ ] Plan new features

## Rollback Plan

If issues arise:
1. Use Vercel "Redeploy" to previous version
2. Check Vercel deployment logs
3. Review Supabase logs
4. Check Stripe webhook logs
5. Verify environment variables
6. Test in staging first if possible

## Support Contacts

Keep these handy:
- **Vercel Support**: https://vercel.com/help
- **Supabase Support**: https://supabase.com/support
- **Stripe Support**: https://support.stripe.com
- **Resend Support**: https://resend.com/support

## Success Metrics

Track these KPIs:
- [ ] Total bookings per day/week/month
- [ ] Conversion rate (visitors → bookings)
- [ ] Average booking value
- [ ] Customer retention rate
- [ ] Email open rates
- [ ] Payment success rate
- [ ] Page load times
- [ ] Error rates

---

## 🎉 You're Live!

Once all items are checked:
- ✅ Your application is production-ready
- ✅ All integrations are configured
- ✅ Monitoring is in place
- ✅ You're ready to accept real bookings!

**Congratulations on launching Salun! 🚀✨**

---

*Keep this checklist handy for future updates and deployments.*
