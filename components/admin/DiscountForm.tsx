'use client';
// CLIENT: interactive discount creation form with dual-language French and English descriptions

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, Loader2, Check } from 'lucide-react';
import { DualLanguageTabs } from './DualLanguageTabs';

export function DiscountForm() {
  const router = useRouter();
  const [activeLocale, setActiveLocale] = useState<'fr' | 'en'>('fr');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    min_order_amount: 0,
    description_fr: '',
    description_en: '',
    starts_at: new Date().toISOString().split('T')[0],
    ends_at: '',
    active: true,
  });

  const handleChange = (field: string, val: any) => {
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.code.trim()) {
      setError('Le code de réduction est obligatoire.');
      return;
    }

    if (!form.description_fr.trim() || !form.description_en.trim()) {
      setError('Mandat Bilingue : Veuillez renseigner la description en Français ET en Anglais.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          code: form.code.toUpperCase().trim(),
          value: Number(form.value),
          min_order_amount: Number(form.min_order_amount) || 0,
          starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la création du code privilège.');
      }

      router.push('/admin/marketing/discounts');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/30 text-destructive text-xs">
          {error}
        </div>
      )}

      {/* Main Parameters */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-6">
        <h2 className="font-sans font-semibold text-xs uppercase tracking-widest text-slate-700 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-indigo-600" />
          <span>Paramètres du Code Privilège</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div>
            <label className="block text-slate-600 uppercase tracking-wider text-[11px] mb-1.5 font-semibold">
              Code Promotionnel *
            </label>
            <input
              type="text"
              required
              value={form.code}
              onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
              placeholder="ex: PRIVILEGE10"
              className="w-full bg-white border border-slate-300 px-3 py-2 text-slate-900 font-mono uppercase focus:outline-none focus:border-indigo-500 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-slate-600 uppercase tracking-wider text-[11px] mb-1.5 font-semibold">
              Type de Remise *
            </label>
            <select
              value={form.type}
              onChange={(e) => handleChange('type', e.target.value)}
              className="w-full bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 rounded-sm"
            >
              <option value="percentage">Pourcentage (%)</option>
              <option value="fixed">Montant fixe (€)</option>
              <option value="free_shipping">Livraison Concierge Offerte</option>
            </select>
          </div>

          {form.type !== 'free_shipping' && (
            <div>
              <label className="block text-slate-600 uppercase tracking-wider text-[11px] mb-1.5 font-semibold">
                Valeur ({form.type === 'percentage' ? '%' : '€'}) *
              </label>
              <input
                type="number"
                min="1"
                step="1"
                required
                value={form.value}
                onChange={(e) => handleChange('value', e.target.value)}
                className="w-full bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 rounded-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-600 uppercase tracking-wider text-[11px] mb-1.5 font-semibold">
              Panier Minimum (€)
            </label>
            <input
              type="number"
              min="0"
              step="50"
              value={form.min_order_amount}
              onChange={(e) => handleChange('min_order_amount', e.target.value)}
              placeholder="0 pour aucun minimum"
              className="w-full bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-slate-600 uppercase tracking-wider text-[11px] mb-1.5 font-semibold">
              Date d'effet
            </label>
            <input
              type="date"
              value={form.starts_at}
              onChange={(e) => handleChange('starts_at', e.target.value)}
              className="w-full bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 rounded-sm"
            />
          </div>

          <div>
            <label className="block text-slate-600 uppercase tracking-wider text-[11px] mb-1.5 font-semibold">
              Date d'expiration (Optionnel)
            </label>
            <input
              type="date"
              value={form.ends_at}
              onChange={(e) => handleChange('ends_at', e.target.value)}
              className="w-full bg-white border border-slate-300 px-3 py-2 text-slate-900 focus:outline-none focus:border-indigo-500 rounded-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <input
            type="checkbox"
            id="active"
            checked={form.active}
            onChange={(e) => handleChange('active', e.target.checked)}
            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="active" className="text-xs text-slate-700 font-semibold cursor-pointer select-none">
            Activer immédiatement ce code promotionnel
          </label>
        </div>
      </div>

      {/* Dual Language Mandate: Descriptions */}
      <div className="bg-white border border-slate-200 shadow-xs rounded-md p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="font-sans font-bold text-base text-slate-900">
              Mandat Bilingue : Description du Privilège
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Les libellés français et anglais doivent être obligatoirement rédigés.
            </p>
          </div>
          <DualLanguageTabs activeLocale={activeLocale} onLocaleChange={setActiveLocale} />
        </div>

        {activeLocale === 'fr' ? (
          <div className="space-y-2">
            <label className="block text-slate-600 uppercase tracking-wider text-[11px] font-semibold">
              Description en Français (FR) *
            </label>
            <textarea
              required
              rows={3}
              value={form.description_fr}
              onChange={(e) => handleChange('description_fr', e.target.value)}
              placeholder="ex: Remise exclusive de 10% sur les commandes supérieures à 3 000 €."
              className="w-full bg-white border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 rounded-sm"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <label className="block text-slate-600 uppercase tracking-wider text-[11px] font-semibold">
              Description in English (EN) *
            </label>
            <textarea
              required
              rows={3}
              value={form.description_en}
              onChange={(e) => handleChange('description_en', e.target.value)}
              placeholder="e.g. Exclusive 10% privilege on orders exceeding €3,000."
              className="w-full bg-white border border-slate-300 p-3 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 rounded-sm"
            />
          </div>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex items-center justify-end gap-4 border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-slate-200 text-slate-600 text-xs font-medium rounded-sm hover:bg-slate-50 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs uppercase tracking-widest font-semibold rounded-sm shadow-xs transition-colors disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Enregistrement...</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Créer le Code Privilège</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
