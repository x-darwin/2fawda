import { createClient } from '@supabase/supabase-js';
import { Database } from '../database.types';

// Create a separate Supabase client for server-side operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabaseAdmin = createClient<Database>(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

export async function isCountryBlocked(countryCode: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('blocked_countries')
      .select('country_code')
      .eq('country_code', countryCode)
      .single();

    if (error) {
      console.error('Error checking blocked country:', error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error('Error checking blocked country:', error);
    return false;
  }
}
