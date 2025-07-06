import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Network {
  id: string;
  name: string;
  website: string;
  category: string;
  logo_url?: string;
  rating: number;
  countries: string[];
  created_at: string;
  updated_at: string;
}

export interface Offer {
  id: string;
  offer_name: string;
  payout: string;
  vertical: string;
  country: string;
  network_id: string;
  created_at: string;
  updated_at: string;
}

export interface NetworkWithOffers extends Network {
  offers: Offer[];
} 