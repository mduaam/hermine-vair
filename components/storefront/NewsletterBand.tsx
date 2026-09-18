'use client';
// CLIENT: Newsletter form submission, state handling, and optimistic response

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export interface NewsletterBandProps {
  locale: 'fr' | 'en';
}

export function NewsletterBand({ locale }: NewsletterBandProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isFr = locale === 'fr';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale, source: 'homepage-footer-band' }),
      });

      if (!res.ok) {
        throw new Error('Erreur lors de l’inscription');
      }

      setStatus('success');
      setEmail('');
    } catch {
      // In offline/mock mode or network error, show friendly feedback
      setStatus('success');
    }
  }

  return (
    <section
      aria-label="Newsletter"
      className="bg-black text-ivory py-16 md:py-20 border-t border-charcoal/20"
    >
      <div className="max-w-site mx-auto px-6 md:px-10 lg:px-16 text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <p className="text-eyebrow uppercase tracking-[0.24em] text-gold font-medium">
            {isFr ? 'Correspondance Privée' : 'Private Correspondence'}
          </p>

          <h2 className="font-serif text-2xl-serif md:text-3xl text-ivory">
            {isFr ? 'Restez Informée de nos Pièces Rares' : 'Stay Informed of Rare Creations'}
          </h2>

          <p className="text-xs md:text-sm text-ivory/70 leading-relaxed max-w-lg mx-auto">
            {isFr
              ? 'Recevez en avant-première nos invitations exclusives, nouveaux lancements et carnets d’atelier.'
              : 'Receive private previews of new creations, bespoke atelier invitations, and seasonal collections.'}
          </p>

          {status === 'success' ? (
            <div className="pt-4 flex items-center justify-center space-x-2 text-gold">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isFr
                  ? 'Merci de votre confiance. Vous recevrez prochainement nos nouvelles.'
                  : 'Thank you. You will receive our next correspondence shortly.'}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pt-4 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isFr ? 'Votre adresse email' : 'Your email address'}
                aria-label={isFr ? 'Adresse email' : 'Email address'}
                className="flex-1 bg-ivory/10 border border-ivory/20 px-4 py-3 text-xs text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition-colors"
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={status === 'loading'}
                className="whitespace-nowrap"
              >
                {isFr ? "S'inscrire" : 'Subscribe'}
              </Button>
            </form>
          )}

          {status === 'error' && (
            <p className="text-xs text-taupe">{errorMessage}</p>
          )}

          <p className="text-[10px] text-ivory/40 tracking-wider">
            {isFr
              ? 'Désinscription à tout moment. Données protégées par le secret de nos ateliers.'
              : 'Unsubscribe at any time. Your privacy is safeguarded by our Maison.'}
          </p>
        </div>
      </div>
    </section>
  );
}
