import { redirect } from 'next/navigation';

interface ContactRedirectProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function ContactRedirect({ params }: ContactRedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}/client-services/contact`);
}
