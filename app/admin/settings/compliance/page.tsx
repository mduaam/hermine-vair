import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { getAdminComplianceRules } from '@/lib/supabase/queries/admin';

export const metadata = {
  title: 'Conformité Régionale & Fourrure | Administration',
};

export const dynamic = 'force-dynamic';

interface ComplianceRule {
  id: string;
  country_code: string;
  fur_sales_allowed: boolean;
  currency: string;
  default_locale: string;
  duties_note_fr?: string | null;
  duties_note_en?: string | null;
}

export default async function AdminCompliancePage() {
  const rawRules = await getAdminComplianceRules();
  const rules = rawRules as unknown as ComplianceRule[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-3 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux paramètres</span>
        </Link>

        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">
          <Globe className="w-3.5 h-3.5 text-indigo-600" />
          <span>Législation & Territoires Internationaux</span>
        </div>
        <h1 className="font-sans font-semibold text-xl text-slate-900 tracking-tight">
          Règles Régionales & Vente de Fourrure
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Contrôle des restrictions légales de vente de fourrure naturelle et obligations douanières.
        </p>
      </div>

      {/* Statutory Fur Sales Warning */}
      <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs space-y-1.5">
        <div className="font-semibold text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Exigence Légale Impérative (Non-Négociable) :</span>
        </div>
        <p className="text-amber-800 leading-relaxed font-sans">
          Certains territoires interdisent formellement l'importation ou la commercialisation de peaux et fourrures animales (ex: loi californienne AB 44, État d'Israël, certaines juridictions municipales).
          Le système bloque automatiquement la finalisation du panier (checkout) si l'adresse de livraison cible une région sous restriction légale.
        </p>
      </div>

      {/* Rules Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="font-sans font-semibold text-xs text-slate-900 uppercase tracking-wider">
            Territoires Paramétrés ({rules.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Pays / Code</th>
                <th className="py-3 px-4">Vente de Fourrure</th>
                <th className="py-3 px-4">Devise</th>
                <th className="py-3 px-4">Langue</th>
                <th className="py-3 px-4">Mention Douanière (FR)</th>
                <th className="py-3 px-4">Customs Note (EN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {rules.map((rule) => (
                <tr key={rule.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">
                    <span className="font-mono bg-slate-100 border border-slate-300 px-2 py-0.5 text-xs font-semibold rounded text-slate-800">
                      {rule.country_code}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    {rule.fur_sales_allowed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Autorisée
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                        <ShieldAlert className="w-3 h-3 text-rose-600" /> Interdiction Légale
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">
                    {rule.currency}
                  </td>
                  <td className="py-3 px-4 font-sans uppercase text-slate-500">
                    {rule.default_locale}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {rule.duties_note_fr || '—'}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-600">
                    {rule.duties_note_en || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
