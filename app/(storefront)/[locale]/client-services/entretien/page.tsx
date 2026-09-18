import { redirect } from 'next/navigation';

interface EntretienRedirectProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function EntretienRedirect({ params }: EntretienRedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}/journal/entretien/guide-preservation-fourrure-precieuse`);
}
