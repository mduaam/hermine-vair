'use client';
// CLIENT: Registration form with customer profile creation and email opt-in

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, Mail, Lock, User, Phone, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface RegisterPageProps {
  params: { locale: string };
}

function RegisterForm({ locale }: { locale: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || `/${locale}/account`;

  const isEn = locale === 'en';
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [marketingOptIn, setMarketingOptIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/${locale}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
        },
      });

      if (authError) {
        setErrorMsg(authError.message);
        setLoading(false);
        return;
      }

      const user = authData.user;
      if (user) {
        // Upsert customer profile
        await supabase.from('customer_profiles').upsert({
          id: user.id,
          first_name: firstName,
          last_name: lastName,
          phone: phone || null,
          locale,
          preferred_currency: 'EUR',
          marketing_opt_in: marketingOptIn,
        });
      }

      // If user session is established immediately (auto-confirm enabled)
      if (authData.session) {
        router.push(redirectTo);
        router.refresh();
      } else {
        setSuccessMsg(true);
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg(isEn ? 'Failed to create your account.' : 'Échec de la création de votre compte.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 sm:py-24 w-full">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex p-3 rounded-full border border-charcoal/20 bg-ivory text-taupe mb-2">
          <Sparkles className="w-5 h-5 stroke-[1.2] text-gold" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-black">
          {isEn ? 'Create Your Account' : 'Rejoindre la Maison'}
        </h1>
        <p className="text-xs text-charcoal tracking-wide">
          {isEn
            ? 'Receive private salon invitations, private order tracking, and complimentary white-glove courier service.'
            : 'Bénéficiez de vos invitations privées, du suivi de vos créations et de l’accès à notre conciergerie.'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg ? (
        <div className="p-6 bg-ivory border border-gold/40 text-center space-y-3">
          <Sparkles className="w-6 h-6 text-gold mx-auto" />
          <h2 className="font-serif text-lg text-black">
            {isEn ? 'Account Created' : 'Votre compte est créé'}
          </h2>
          <p className="text-xs text-charcoal leading-relaxed">
            {isEn
              ? `A confirmation email has been sent to ${email}. Please confirm your email address to finalize your membership.`
              : `Un courriel de confirmation a été expédié à ${email}. Cliquez sur le lien pour valider votre adhésion.`}
          </p>
          <Link
            href={`/${locale}/auth/login`}
            className="mt-4 inline-flex items-center justify-center font-sans uppercase tracking-[0.14em] text-xs px-4 py-2 border border-charcoal text-black hover:border-black hover:bg-black/5 font-medium transition-colors"
          >
            {isEn ? 'Proceed to Sign In' : 'Aller à la page de connexion'}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="firstName"
                className="block text-xs uppercase tracking-wider font-medium text-black"
              >
                {isEn ? 'First Name' : 'Prénom'}
              </label>
              <input
                id="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-1">
              <label
                htmlFor="lastName"
                className="block text-xs uppercase tracking-wider font-medium text-black"
              >
                {isEn ? 'Last Name' : 'Nom'}
              </label>
              <input
                id="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-xs uppercase tracking-wider font-medium text-black"
            >
              {isEn ? 'Email Address' : 'Adresse Courriel'}
            </label>
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="madame@haute-fourrure.com"
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black placeholder:text-charcoal/40 focus:border-gold focus:outline-none transition-colors"
              />
              <Mail className="w-4 h-4 text-charcoal/40 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="phone"
              className="block text-xs uppercase tracking-wider font-medium text-black"
            >
              {isEn ? 'Phone (Optional)' : 'Téléphone (Optionnel)'}
            </label>
            <div className="relative">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 00 00 00 00"
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black placeholder:text-charcoal/40 focus:border-gold focus:outline-none transition-colors"
              />
              <Phone className="w-4 h-4 text-charcoal/40 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-xs uppercase tracking-wider font-medium text-black"
            >
              {isEn ? 'Password' : 'Mot de passe'}
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
              />
              <Lock className="w-4 h-4 text-charcoal/40 absolute right-3 top-3 pointer-events-none" />
            </div>
            <p className="text-[10px] text-charcoal/70">
              {isEn ? 'Minimum 8 characters.' : 'Minimum 8 caractères recommandés.'}
            </p>
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-charcoal">
              <input
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="mt-0.5 accent-gold cursor-pointer"
              />
              <span>
                {isEn
                  ? 'I wish to receive confidential previews, private salon invitations, and the Maison Journal.'
                  : 'Je souhaite recevoir en avant-première les invitations aux ventes privées et le Journal de la Maison.'}
              </span>
            </label>
          </div>

          <Button
            type="submit"
            loading={loading}
            className="w-full py-3.5 text-xs tracking-widest uppercase mt-4"
          >
            {isEn ? 'Create Privilege Account' : 'Créer Mon Compte Privilège'}
          </Button>

          <div className="text-center pt-4 border-t border-charcoal/10">
            <p className="text-xs text-charcoal">
              {isEn ? 'Already a client?' : 'Déjà client de la Maison ?'}{' '}
              <Link
                href={`/${locale}/auth/login${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-black font-medium underline underline-offset-4 hover:text-taupe"
              >
                {isEn ? 'Sign In' : 'Se Connecter'}
              </Link>
            </p>
          </div>
        </form>
      )}

      {/* Trust Footer */}
      <div className="mt-12 text-center text-[11px] text-charcoal/60 space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-charcoal">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span>{isEn ? 'Strict Confidentiality Guaranteed' : 'Confidentialité Absolue Garantie'}</span>
        </div>
        <p>{isEn ? 'Your personal data is never shared with third parties.' : 'Vos données personnelles ne sont jamais cédées à des tiers.'}</p>
      </div>
    </div>
  );
}

export default function RegisterPage({ params: { locale } }: RegisterPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-taupe" />
        </div>
      }
    >
      <RegisterForm locale={locale} />
    </Suspense>
  );
}
