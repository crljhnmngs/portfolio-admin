import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/types_db';
import { SupabaseClient } from '@supabase/supabase-js';

const createClient = (): SupabaseClient =>
    createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

export default createClient;
