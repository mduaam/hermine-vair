'use client';
// CLIENT: Account portal navigation tabs, active state highlighting, and sign-out handler

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User, Package, MapPin, Heart, LogOut, Loader2, Sparkles } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getCustomerProfile, type CustomerProfile } from '@/lib/supabase/queries/account';

interface AccountLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function AccountLayout({ children, params: { locale } }: AccountLayoutProps) {
  const isEn = locale === 'en';
  const pathname = usePathname();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push(`/${locale}/auth/login?redirect=${encodeURIComponent(pathname)}`);
        return;
      }

      setUserEmail(user.email || null);
      const prof = await getCustomerProfile(user.id);
      setProfile(prof);
      setLoading(false);
    }

    checkAuth();
  }, [locale, pathname, router]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-taupe" />
        <p className="text-xs uppercase tracking-widest text-charcoal">
          {isEn ? 'Verifying access...' : 'Accès à votre salon privé...'}
        </p>
      </div>
    );
  }

  const displayName = profile?.first_name
    ? `${profile.first_name} ${profile.last_name || ''}`
    : userEmail || (isEn ? 'Privileged Client' : 'Client Privilège');

  const navLinks = [
    {
      href: `/${locale}/account`,
      label: isEn ? 'Profile & Details' : 'Profil & Coordonnées',
      icon: User,
      exact: true,
    },
    {
      href: `/${locale}/account/orders`,
      label: isEn ? 'Orders & Tracking' : 'Mes Commandes',
      icon: Package,
      exact: false,
    },
    {
      href: `/${locale}/account/addresses`,
      label: isEn ? 'Address Book' : 'Carnet d’Adresses',
      icon: MapPin,
      exact: false,
    },
    {
      href: `/${locale}/account/wishlist`,
      label: isEn ? 'Saved Pieces' : 'Pièces Enregistrées',
      icon: Heart,
      exact: false,
    },
  ];

  return (
    <div className="max-w-site mx-auto px-6 md:px-10 lg:px-16 py-12">
      {/* Account Greeting Header */}
      <div className="border-b border-charcoal/15 pb-8 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-taupe mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>{isEn ? 'Maison Privilège Salon' : 'Salon Privilège de la Maison'}</span>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-black">
            {isEn ? `Welcome, ${displayName}` : `Bienvenue, ${displayName}`}
          </h1>
          <p className="text-xs text-charcoal mt-1">
            {userEmail} · {isEn ? 'Active Haute Couture Member' : 'Membre Haute Couture Actif'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-charcoal hover:text-black border border-charcoal/20 px-3.5 py-2 transition-colors self-start md:self-auto"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{isEn ? 'Sign Out' : 'Se Déconnecter'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <nav aria-label="Menu du Compte" className="space-y-1">
          {navLinks.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-black text-ivory font-medium border-l-2 border-gold'
                    : 'text-charcoal hover:bg-black/5 hover:text-black'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold' : 'text-charcoal'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Content Area */}
        <div className="lg:col-span-3 min-h-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
