'use client';
// CLIENT: Authentication form with client-side Supabase credentials and magic-link handler

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

interface LoginPageProps {
  params: { locale: string };
}

function LoginForm({ locale }: { locale: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || `/${locale}/account`;

  const isEn = locale === 'en';
  const [authMode, setAuthMode] = useState<'password' | 'magic'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();

    try {
      if (authMode === 'password') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(
            isEn
              ? 'Invalid email or password. Please verify your credentials.'
              : 'Identifiants invalides. Veuillez vérifier votre adresse courriel et votre mot de passe.'
          );
          setLoading(false);
          return;
        }

        router.push(redirectTo);
        router.refresh();
      } else {
        // Magic Link
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/${locale}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        setMagicLinkSent(true);
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg(isEn ? 'An unexpected error occurred.' : 'Une erreur inattendue est survenue.');
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16 sm:py-24 w-full">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex p-3 rounded-full border border-charcoal/20 bg-ivory text-taupe mb-2">
          <Lock className="w-5 h-5 stroke-[1.2]" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-black">
          {isEn ? 'Client Privilege' : 'Espace Privilège'}
        </h1>
        <p className="text-xs text-charcoal tracking-wide">
          {isEn
            ? 'Access your private boutique, orders, and bespoke concierge.'
            : 'Accédez à vos commandes, adresses et conciergerie privée.'}
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex border border-charcoal/20 mb-6 p-1 bg-ivory">
        <button
          type="button"
          onClick={() => setAuthMode('password')}
          className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium transition-colors ${
            authMode === 'password'
              ? 'bg-black text-ivory'
              : 'text-charcoal hover:text-black'
          }`}
        >
          {isEn ? 'Password' : 'Mot de passe'}
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('magic')}
          className={`flex-1 py-2 text-xs uppercase tracking-wider font-medium transition-colors ${
            authMode === 'magic'
              ? 'bg-black text-ivory'
              : 'text-charcoal hover:text-black'
          }`}
        >
          {isEn ? 'Magic Link' : 'Lien Magique'}
        </button>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {magicLinkSent ? (
        <div className="p-6 bg-ivory border border-gold/40 text-center space-y-3">
          <Sparkles className="w-6 h-6 text-gold mx-auto" />
          <h2 className="font-serif text-lg text-black">
            {isEn ? 'Magic Link Sent' : 'Lien de connexion expédié'}
          </h2>
          <p className="text-xs text-charcoal leading-relaxed">
            {isEn
              ? `A private secure login link has been sent to ${email}. Please check your inbox.`
              : `Un lien confidentiel d’accès sécurisé a été transmis à ${email}. Consultez votre boîte de réception.`}
          </p>
          <button
            type="button"
            onClick={() => setMagicLinkSent(false)}
            className="text-xs text-taupe hover:text-black underline pt-2"
          >
            {isEn ? 'Use another address or method' : 'Utiliser une autre adresse ou méthode'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
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

          {authMode === 'password' && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-wider font-medium text-black"
                >
                  {isEn ? 'Password' : 'Mot de passe'}
                </label>
                <Link
                  href={`/${locale}/auth/forgot-password`}
                  className="text-[11px] text-charcoal hover:text-black underline"
                >
                  {isEn ? 'Forgot?' : 'Oublié ?'}
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black placeholder:text-charcoal/40 focus:border-gold focus:outline-none transition-colors"
              />
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full py-3.5 text-xs tracking-widest uppercase mt-4"
          >
            {authMode === 'password'
              ? isEn
                ? 'Sign In'
                : 'Se Connecter'
              : isEn
              ? 'Send Magic Link'
              : 'Recevoir le Lien Sécurisé'}
          </Button>

          <div className="text-center pt-4 border-t border-charcoal/10">
            <p className="text-xs text-charcoal">
              {isEn ? 'New to L’Hermine et le Vair?' : 'Nouveau client de la Maison ?'}{' '}
              <Link
                href={`/${locale}/auth/register${redirectTo ? `?redirect=${encodeURIComponent(redirectTo)}` : ''}`}
                className="text-black font-medium underline underline-offset-4 hover:text-taupe"
              >
                {isEn ? 'Create an Account' : 'Créer un Compte Privilège'}
              </Link>
            </p>
          </div>
        </form>
      )}

      {/* Trust Footer */}
      <div className="mt-12 text-center text-[11px] text-charcoal/60 space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-charcoal">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span>{isEn ? '256-bit Encrypted Private Access' : 'Accès Confidentiel Chiffré 256-bit'}</span>
        </div>
        <p>{isEn ? 'Strict compliance with European GDPR directives.' : 'Conformité stricte aux directives RGPD européennes.'}</p>
      </div>
    </div>
  );
}

export default function LoginPage({ params: { locale } }: LoginPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-taupe" />
        </div>
      }
    >
      <LoginForm locale={locale} />
    </Suspense>
  );
}
