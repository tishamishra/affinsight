<<<<<<< HEAD
# Affiliate Directory - Supabase Backend

A modern affiliate network directory built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🏢 **Affiliate Networks Management** - Add, edit, delete networks with logo uploads
- 💰 **Offers Management** - Manage affiliate offers with payout tracking
- 🔐 **Admin Authentication** - Secure admin panel with Supabase Auth
- 📱 **Responsive Design** - Modern UI that works on all devices
- 🔍 **Search & Filter** - Find networks and offers quickly
- 🖼️ **Logo Upload** - Direct upload to Supabase Storage

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Forms**: React Hook Form + Zod validation
- **Icons**: React Icons (Feather Icons)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd affinsight
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Run these SQL commands in your Supabase SQL editor:

#### Create Networks Table
```sql
CREATE TABLE networks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  website TEXT NOT NULL,
  category TEXT NOT NULL,
  logo_url TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  countries TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE networks ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON networks
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage networks" ON networks
  FOR ALL USING (auth.role() = 'authenticated');
```

#### Create Offers Table
```sql
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_name TEXT NOT NULL,
  payout TEXT NOT NULL,
  vertical TEXT NOT NULL,
  country TEXT NOT NULL,
  network_id UUID REFERENCES networks(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON offers
  FOR SELECT USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to manage offers" ON offers
  FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `logos`
3. Set the bucket to public
4. Configure the bucket policy:

```sql
-- Allow public read access to logos
CREATE POLICY "Allow public read access to logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');

-- Allow authenticated users to upload logos
CREATE POLICY "Allow authenticated users to upload logos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'logos' AND auth.role() = 'authenticated');
```

### 5. Admin User Setup

1. Go to Authentication > Users in your Supabase dashboard
2. Create a new user with email `vishal@yourdomain.com` (or update the email in `src/lib/auth.ts`)
3. Set a password for the user
4. The user will now have admin access to the `/admin` routes

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Admin Panel

- **Login**: `/auth/login`
- **Dashboard**: `/admin`
- **Networks**: `/admin/networks`
- **Offers**: `/admin/offers`
- **Add Network**: `/admin/networks/add`
- **Add Offer**: `/admin/offers/add`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel pages
│   ├── auth/              # Authentication pages
│   └── ...
├── components/            # React components
│   ├── forms/            # Form components
│   ├── lists/            # List components
│   └── ...
├── lib/                  # Utility functions
│   ├── supabase.ts       # Supabase client
│   ├── auth.ts           # Authentication utilities
│   ├── database.ts       # Database operations
│   └── storage.ts        # File upload utilities
└── types/                # TypeScript type definitions
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

## Features

### Networks Management
- ✅ Create, read, update, delete networks
- ✅ Logo upload to Supabase Storage
- ✅ Rating system with star display
- ✅ Category and country filtering
- ✅ Search functionality

### Offers Management
- ✅ Create, read, update, delete offers
- ✅ Link offers to networks
- ✅ Payout tracking
- ✅ Vertical categorization
- ✅ Country targeting

### Authentication
- ✅ Email/password login
- ✅ Admin-only route protection
- ✅ Middleware-based access control
- ✅ Unauthorized access handling

### UI/UX
- ✅ Responsive design
- ✅ Modern Tailwind styling
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation with Zod

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.
=======
# affinsight
Modern affiliate network directory built with Next.js, TypeScript, Tailwind CSS, and Supabase
>>>>>>> 8d8f64d886c86115380a3c88cc50a1e372371a28
