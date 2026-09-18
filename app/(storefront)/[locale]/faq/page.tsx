import { redirect } from 'next/navigation';

interface FaqRedirectProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function FaqRedirect({ params }: FaqRedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}/client-services/faq`);
}
