import { createClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  // Hanya jalankan jika ada secret cron (Keamanan agar tidak sembarang orang menembak API ini)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = await createClient();

  try {
    // 1. Simpan log sistem (Setiap 1 jam)
    await supabase.from('logs').insert({
      action: 'system_maintenance',
      details: 'Automatic 1-hour system update and log cleanup.',
      created_at: new Date().toISOString()
    });

    // 2. Hapus log yang sudah lebih dari 1 jam
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { error: deleteError } = await supabase
      .from('logs')
      .delete()
      .lt('created_at', oneHourAgo);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, message: 'Logs processed and cleaned successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
