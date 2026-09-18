import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function GET(request: Request, { params }: { params: { locale: string } }) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || `/${params.locale || 'fr'}/account`;

  if (code) {
    try {
      const supabase = createServerClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch (err) {
      console.error('Error exchanging code for session:', err);
      return NextResponse.redirect(new URL(`/${params.locale || 'fr'}/auth/login?error=auth`, request.url));
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
