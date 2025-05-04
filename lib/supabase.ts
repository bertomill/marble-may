'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// This creates a Supabase client configured for use in client components
export const supabase = createClientComponentClient();

// For server components, use:
// import { cookies } from 'next/headers';
// import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
// const cookieStore = cookies();
// const supabase = createServerComponentClient({ cookies: () => cookieStore }); 