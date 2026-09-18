'use client';
// CLIENT: Customer wishlist items list, quick-add and removal triggers

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Trash2, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getCustomerWishlist, toggleWishlistItem, type WishlistItem } from '@/lib/supabase/queries/account';

interface WishlistPageProps {
  params: { locale: string };
}

export default function AccountWishlistPage({ params: { locale } }: WishlistPageProps) {
  const isEn = locale === 'en';
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);

  async function loadWishlist(uid: string) {
    const list = await getCustomerWishlist(uid);
    setItems(list);
    setLoading(false);
  }

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      await loadWishlist(user.id);
    }

    init();
  }, []);

  async function handleRemove(productId: string) {
    if (!userId) return;
    await toggleWishlistItem(userId, productId);
    await loadWishlist(userId);
  }

  if (loading) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-charcoal/10 pb-4">
        <h2 className="font-serif text-xl sm:text-2xl text-black">
          {isEn ? 'Saved Pieces & Desires' : 'Pièces Enregistrées & Coups de Cœur'}
        </h2>
        <p className="text-xs text-charcoal mt-1">
          {isEn
            ? 'Your private selection of haute fourrure creations saved for future acquisition.'
            : 'Votre sélection privée de haute fourrure réservée pour vos projets d’acquisition.'}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="bg-ivory border border-charcoal/15 p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full border border-charcoal/20 flex items-center justify-center mx-auto text-taupe">
            <Heart className="w-5 h-5 stroke-[1.2]" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg text-black">
              {isEn ? 'Your wishlist is empty' : 'Votre carnet de coups de cœur est vide'}
            </h3>
            <p className="text-xs text-charcoal max-w-sm mx-auto">
              {isEn
                ? 'Browse our coats, stoles, and jackets to save pieces to your private salon.'
                : 'Parcourez nos créations pour enregistrer vos pièces préférées dans votre salon.'}
            </p>
          </div>
          <Link
            href={`/${locale}/collections`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-black bg-gold hover:bg-gold/90 px-5 py-2.5 transition-colors mt-2"
          >
            <span>{isEn ? 'Discover Creations' : 'Découvrir les Créations'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {items.map((item) => {
            const product = item.product;
            if (!product) return null;

            const title = isEn ? product.name_en : product.name_fr;
            const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6';
            const formattedPrice = new Intl.NumberFormat(isEn ? 'en-US' : 'fr-FR', {
              style: 'currency',
              currency: product.price_currency || 'EUR',
              maximumFractionDigits: 0,
            }).format(product.price_amount);

            return (
              <div key={item.id} className="bg-ivory border border-charcoal/20 overflow-hidden flex flex-col group">
                <div className="relative aspect-[3/4] bg-charcoal/5">
                  <Image
                    src={imageUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(product.id)}
                    aria-label={isEn ? 'Remove from wishlist' : 'Retirer des favoris'}
                    className="absolute top-3 right-3 p-2 bg-ivory/80 backdrop-blur-xs text-charcoal hover:text-black transition-colors rounded-full"
                  >
                    <Trash2 className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[10px] text-taupe uppercase tracking-widest block">
                      {product.material}
                    </span>
                    <h3 className="font-serif text-base font-medium text-black mt-0.5 line-clamp-1">
                      {title}
                    </h3>
                    <p className="font-serif text-sm font-semibold text-black mt-1">
                      {formattedPrice}
                    </p>
                  </div>

                  <Link
                    href={`/${locale}/collections/manteaux/vison/${product.slug}`}
                    className="w-full py-2.5 text-center text-xs uppercase tracking-wider font-semibold border border-charcoal text-black hover:bg-black hover:text-ivory transition-colors"
                  >
                    {isEn ? 'View Creation' : 'Découvrir la Pièce'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
