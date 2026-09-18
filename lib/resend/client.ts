import { Resend } from 'resend';

// Server-side only Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);
