import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = parsed.data;

    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set() {},
          remove() {},
        },
      }
    );

    // Insert into contact_requests
    const { data, error } = await supabase
      .from('contact_requests')
      .insert({
        name,
        email,
        subject,
        message,
        status: 'new',
      })
      .select('id')
      .single();

    if (error) {
      console.error('[Contact API] Supabase error:', error);
      // Even if database has an issue, provide reassuring client response if it was logged
      return NextResponse.json(
        { error: 'Failed to record request. Please contact our concierge directly at contact@lhermineetlevair.com' },
        { status: 500 }
      );
    }

    // Optional Resend notification
    if (process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_placeholder') {
      try {
        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: "Conciergerie L'Hermine et le Vair <concierge@lhermineetlevair.com>",
          to: ['concierge@lhermineetlevair.com'],
          replyTo: email,
          subject: `[Conciergerie] Demande de contact: ${subject} (${name})`,
          text: `Nouvelle demande reçue de ${name} (${email}):\n\nSujet: ${subject}\n\nMessage:\n${message}`,
        });
      } catch (emailErr) {
        console.warn('[Contact API] Failed to dispatch Resend email:', emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      id: data?.id,
      message: 'Your inquiry has been transmitted to our Paris concierge.',
    });
  } catch (err) {
    console.error('[Contact API] Unexpected error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
