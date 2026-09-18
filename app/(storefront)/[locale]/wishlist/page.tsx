import { redirect } from 'next/navigation';

export default function WishlistRedirectPage({ params: { locale } }: { params: { locale: string } }) {
  redirect(`/${locale}/account/wishlist`);
}
