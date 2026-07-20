# Manual Database Setup Guide

Since the direct database connection is currently blocked, you can manually create all the tables using the Supabase SQL Editor in your dashboard.

## Step-by-Step Instructions

### 1. Access Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select your project: `ltwjrepcpxaxeatknbgk`
3. Click on **SQL Editor** in the left sidebar

### 2. Create All Tables

Copy and paste the following SQL into the SQL Editor and click **Run**:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    email_verified TIMESTAMPTZ,
    image TEXT,
    password TEXT,
    role TEXT DEFAULT 'USER',
    subscription_plan TEXT DEFAULT 'FREE',
    subscription_ends TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accounts table (for OAuth)
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT,
    UNIQUE(provider, provider_account_id)
);

-- Sessions table
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_token TEXT UNIQUE NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL
);

-- Verification tokens table
CREATE TABLE verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    UNIQUE(identifier, token)
);

-- Subscriptions table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan TEXT NOT NULL,
    status TEXT NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    stripe_price_id TEXT,
    stripe_current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Codes table
CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT NOT NULL,
    short_code TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::TEXT,
    dynamic BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    scans INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ACTIVE',
    title TEXT,
    description TEXT,
    foreground_color TEXT DEFAULT '#000000',
    background_color TEXT DEFAULT '#ffffff',
    gradient_colors TEXT,
    frame_style TEXT,
    eye_style TEXT,
    logo_url TEXT,
    logo_size INTEGER,
    download_format TEXT DEFAULT 'png',
    folder_id UUID,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Code Scans table
CREATE TABLE qr_code_scans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    ip_address TEXT,
    user_agent TEXT,
    country TEXT,
    city TEXT,
    device TEXT,
    browser TEXT,
    os TEXT,
    referrer TEXT,
    scanned_at TIMESTAMPTZ DEFAULT NOW()
);

-- QR Code Analytics table
CREATE TABLE qr_code_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    qr_code_id UUID NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    scans INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    top_country TEXT,
    top_device TEXT,
    UNIQUE(qr_code_id, date)
);

-- Folders table
CREATE TABLE folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT,
    icon TEXT,
    parent_id UUID REFERENCES folders(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business Cards table
CREATE TABLE business_cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    title TEXT,
    company TEXT,
    bio TEXT,
    email TEXT,
    phone TEXT,
    website TEXT,
    address TEXT,
    avatar_url TEXT,
    cover_url TEXT,
    linkedin TEXT,
    twitter TEXT,
    facebook TEXT,
    instagram TEXT,
    github TEXT,
    tiktok TEXT,
    youtube TEXT,
    whatsapp TEXT,
    telegram TEXT,
    portfolio_url TEXT,
    custom_links JSONB,
    theme TEXT,
    font_family TEXT,
    primary_color TEXT,
    background_color TEXT,
    background_image TEXT,
    status TEXT DEFAULT 'DRAFT',
    is_public BOOLEAN DEFAULT TRUE,
    custom_domain TEXT,
    qr_code_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Restaurants table
CREATE TABLE restaurants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL DEFAULT uuid_generate_v4()::TEXT,
    name TEXT NOT NULL,
    description TEXT,
    logo TEXT,
    cover_image TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    status TEXT DEFAULT 'DRAFT',
    is_public BOOLEAN DEFAULT TRUE,
    custom_domain TEXT,
    qr_code_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Categories table
CREATE TABLE menu_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Menu Items table
CREATE TABLE menu_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    badge TEXT,
    offer TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Templates table
CREATE TABLE templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    thumbnail TEXT,
    content JSONB NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media table
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    key TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER,
    mime_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys table
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    key TEXT UNIQUE NOT NULL,
    permissions JSONB,
    last_used TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    entity_id TEXT,
    changes JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_qr_codes_user_id ON qr_codes(user_id);
CREATE INDEX idx_qr_codes_type ON qr_codes(type);
CREATE INDEX idx_qr_codes_status ON qr_codes(status);
CREATE INDEX idx_qr_code_scans_qr_code_id ON qr_code_scans(qr_code_id);
CREATE INDEX idx_qr_code_scans_scanned_at ON qr_code_scans(scanned_at);
CREATE INDEX idx_business_cards_user_id ON business_cards(user_id);
CREATE INDEX idx_business_cards_slug ON business_cards(slug);
CREATE INDEX idx_restaurants_user_id ON restaurants(user_id);
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable Row Level Security (RLS) - optional but recommended
-- ALTER TABLE users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE business_cards ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
```

### 3. Verify Tables Created

After running the SQL, you should see "Success" for all CREATE TABLE statements.

### 4. Test the Connection

Once tables are created, try running:

```bash
npm run dev
```

Your application should now work with the Supabase database!

## Common Issues

### Issue 1: Password with @ symbol

If your password contains special characters, make sure to URL-encode them:
- `@` becomes `%40`
- `#` becomes `%23`
- etc.

### Issue 2: Project Paused

Supabase pauses free projects after 7 days of inactivity. 
- Go to Settings → Billing
- Unpause or upgrade your project

### Issue 3: IP Whitelist

If you're getting connection errors:
1. Go to Settings → Database
2. Look for "Allowed IP addresses"
3. Add your current IP or whitelist all IPs

## What's Next?

Once your database is set up:
1. Start the dev server: `npm run dev`
2. Visit http://localhost:3000
3. Sign up for a new account
4. Start creating QR codes!

## Support

If you encounter issues:
1. Check Supabase Status: https://status.supabase.com
2. Review Supabase Docs: https://supabase.com/docs
3. Enable logs in Supabase Dashboard for debugging
