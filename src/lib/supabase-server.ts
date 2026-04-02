import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function createClient() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )

  return supabase
}

// Helper untuk proteksi mode maintenance secara global
export async function checkMaintenanceMode() {
  const supabase = await createClient()

  const { data: config } = await supabase
    .from('system_config')
    .select('value')
    .eq('key', 'site_mode')
    .maybeSingle()

  if (config?.value === 'maintenance') {
    // Cek apakah admin sedang login (Admin kebal maintenance agar bisa buka settings lagi)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()
        
      if (profile?.role === 'admin') return false // Lolos (Bukan maintenance bagi admin)
    }
    
    return true // Sedang maintenance bagi user biasa
  }
  return false
}
