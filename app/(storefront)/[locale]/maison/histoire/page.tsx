import { redirect } from 'next/navigation';

interface MaisonHistoireRedirectProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function MaisonHistoireRedirect({ params }: MaisonHistoireRedirectProps) {
  const { locale } = await params;
  redirect(`/${locale}/maison/heritage/histoire`);
}
