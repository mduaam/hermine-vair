'use client';
// CLIENT: Customer profile details editor and preferences management

import React, { useEffect, useState } from 'react';
import { User, Phone, Globe, CheckCircle2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { getCustomerProfile, updateCustomerProfile, type CustomerProfile } from '@/lib/supabase/queries/account';
import { Button } from '@/components/ui/Button';

interface ProfilePageProps {
  params: { locale: string };
}

export default function AccountProfilePage({ params: { locale } }: ProfilePageProps) {
  const isEn = locale === 'en';
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredCurrency, setPreferredCurrency] = useState('EUR');
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      setEmail(user.email || '');

      const prof = await getCustomerProfile(user.id);
      if (prof) {
        setFirstName(prof.first_name || '');
        setLastName(prof.last_name || '');
        setPhone(prof.phone || '');
        setPreferredCurrency(prof.preferred_currency || 'EUR');
        setMarketingOptIn(prof.marketing_opt_in ?? false);
      }
      setLoading(false);
    }

    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!userId) return;

    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    const success = await updateCustomerProfile(userId, {
      first_name: firstName,
      last_name: lastName,
      phone: phone || null,
      locale,
      preferred_currency: preferredCurrency,
      marketing_opt_in: marketingOptIn,
    });

    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } else {
      setErrorMsg(isEn ? 'Failed to update your details.' : 'Échec de l’enregistrement de vos coordonnées.');
    }
    setSaving(false);
  }

  if (loading) {
    return null;
  }

  return (
    <div className="bg-ivory border border-charcoal/15 p-6 sm:p-8">
      <div className="border-b border-charcoal/10 pb-4 mb-6">
        <h2 className="font-serif text-xl sm:text-2xl text-black">
          {isEn ? 'Personal Details' : 'Coordonnées Personnelles'}
        </h2>
        <p className="text-xs text-charcoal mt-1">
          {isEn
            ? 'Manage your identity, preferred currency, and confidential communications.'
            : 'Gérez votre identité, votre devise privilégiée et vos communications confidentielles.'}
        </p>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-4 bg-black text-ivory text-xs flex items-center gap-2 border border-gold/40">
          <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
          <span>{isEn ? 'Your profile has been updated successfully.' : 'Vos coordonnées ont été enregistrées avec succès.'}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-medium text-black">
              {isEn ? 'First Name' : 'Prénom'}
            </label>
            <input
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-medium text-black">
              {isEn ? 'Last Name' : 'Nom'}
            </label>
            <input
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-medium text-black">
              {isEn ? 'Email (Private ID)' : 'Courriel (Identifiant Privilège)'}
            </label>
            <input
              type="email"
              disabled
              value={email}
              className="w-full bg-charcoal/5 border border-charcoal/20 px-3.5 py-2.5 text-sm text-charcoal/70 cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs uppercase tracking-wider font-medium text-black">
              {isEn ? 'Phone (Delivery Concierge)' : 'Téléphone (Conciergerie)'}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+33 6 00 00 00 00"
              className="w-full bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs uppercase tracking-wider font-medium text-black">
            {isEn ? 'Preferred Billing Currency' : 'Devise Principale'}
          </label>
          <select
            value={preferredCurrency}
            onChange={(e) => setPreferredCurrency(e.target.value)}
            className="w-full sm:w-64 bg-ivory border border-charcoal/30 px-3.5 py-2.5 text-sm text-black focus:border-gold focus:outline-none transition-colors"
          >
            <option value="EUR">EUR (€) — Euro</option>
            <option value="USD">USD ($) — US Dollar</option>
            <option value="GBP">GBP (£) — British Pound</option>
            <option value="CHF">CHF (CHF) — Swiss Franc</option>
          </select>
        </div>

        <div className="pt-2 border-t border-charcoal/10">
          <label className="flex items-start gap-2.5 cursor-pointer text-xs text-charcoal">
            <input
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              className="mt-0.5 accent-gold cursor-pointer"
            />
            <span>
              {isEn
                ? 'Receive private salon invitations, previews of rare furs, and the Maison Journal.'
                : 'Recevoir les invitations aux ventes privées, le Journal de la Maison et les aperçus de créations uniques.'}
            </span>
          </label>
        </div>

        <Button
          type="submit"
          loading={saving}
          className="py-3 px-6 text-xs tracking-widest uppercase"
        >
          {isEn ? 'Save Changes' : 'Enregistrer les Modifications'}
        </Button>
      </form>
    </div>
  );
}
