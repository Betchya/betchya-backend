const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
const SPORTS_DATA_API_KEY = Deno.env.get('SPORTS_DATA_NBA_API_KEY');

try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SPORTS_DATA_API_KEY) {
        throw new Error('Expected Environment Variables not set.');
    };
} catch (error) {
    console.error('Error loading environment variables:', error);
    Deno.exit(1);
}

export { SUPABASE_URL, SUPABASE_ANON_KEY, SPORTS_DATA_API_KEY };