# Supabase Database Setup Guide

## Quick Setup

### 1. Update Environment Variables

Edit your `.env.local` file with your Supabase password:

```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# NextAuth - Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-key-here"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 2. Get Your Supabase Password

1. Go to your Supabase Dashboard: https://[YOUR-PROJECT].supabase.co
2. Navigate to Settings → Database
3. Find your "PostgreSQL password" (or reset it)
4. Replace `[YOUR-PASSWORD]` in DATABASE_URL

### 3. Generate NextAuth Secret

Run this command to generate a secret:
```bash
openssl rand -base64 32
```

Or use an online generator: https://generate-secret.vercel.app/32

### 4. Run Database Migrations

```bash
npm run db:push
```

This will create all the tables from your Prisma schema in Supabase.

### 5. Start the Application

```bash
npm run dev
```

Your app will be available at: http://localhost:3000

## Database Features Available

✅ **PostgreSQL Database** - Full SQL capabilities
✅ **Row Level Security (RLS)** - Built-in security
✅ **Real-time Subscriptions** - Live updates
✅ **Auto-generated APIs** - REST & GraphQL
✅ **Authentication** - Built-in user management
✅ **Storage** - File uploads

## Supabase Features You Can Use

### Authentication
- Email/Password login
- Google OAuth
- Magic links
- Social logins
- JWT sessions

### Database
- Real-time subscriptions
- Row Level Security
- PostgreSQL full text search
- Edge functions

### Storage
- Image uploads
- File storage
- CDN integration

## Troubleshooting

### Connection Issues
1. Check if your IP is whitelisted in Supabase
2. Verify your password is correct
3. Ensure DATABASE_URL format is correct

### Migration Errors
```bash
# Reset database
npx prisma db push --force-reset

# Check connection
npx prisma db execute
```

### Auth Issues
1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches your environment
3. Ensure Google OAuth credentials are configured (if using Google login)

## Next Steps

1. **Set up Google OAuth** (optional but recommended)
   - Go to Supabase Dashboard → Authentication → Providers
   - Configure Google provider with your credentials

2. **Enable Real-time** (optional)
   - Enable tables you want to subscribe to

3. **Configure Row Level Security** (optional but recommended for production)
   - Add RLS policies to protect user data
   - Test thoroughly before production deployment

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | PostgreSQL connection string | ✅ |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL | ✅ |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public API key | ✅ |
| SUPABASE_SERVICE_ROLE_KEY | Admin API key | ✅ |
| NEXTAUTH_SECRET | JWT signing secret | ✅ |
| NEXTAUTH_URL | Application URL | ✅ |

## Production Checklist

- [ ] Set strong DATABASE_URL password
- [ ] Enable Row Level Security on all tables
- [ ] Configure proper CORS settings
- [ ] Set up environment variables in Vercel
- [ ] Enable auto-scaling on Supabase
- [ ] Set up monitoring and alerts
- [ ] Configure automated backups
- [ ] Test authentication flows
- [ ] Set up error tracking (e.g., Sentry)

