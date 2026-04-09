/**
 * Supabase Client Configuration
 *
 * This file initializes and exports the Supabase client instance.
 * DO NOT modify this configuration unless you're changing the Supabase project.
 *
 * The client is configured to work with both authenticated (admin) and
 * unauthenticated (customer) users.
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
