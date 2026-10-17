import { createClient } from '@supabase/supabase-js'

// Retrieve Supabase credentials from environment variables (.env file)
let supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim()
// Automatically clean URL if the user copied the /rest/v1/ endpoint or trailing slash
supabaseUrl = supabaseUrl.replace(/\/rest\/v1\/?$/i, '').replace(/\/+$/, '')

const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()

// Check whether real credentials have been provided
export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-supabase-project') && 
  !supabaseAnonKey.includes('your-anon-key')
)

// Initialize the Supabase client
// If keys are not configured yet, use a placeholder so the frontend never crashes with a blank screen
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://demo.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy')
