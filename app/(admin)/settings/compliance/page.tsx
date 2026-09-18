import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Globe, AlertTriangle, CheckCircle2, ShieldAlert, FileText } from 'lucide-react';
import { getAdminComplianceRules } from '@/lib/supabase/queries/admin';

export const metadata = {
  title: 'Conformité Régionale & Fourrure | Administration',
};

export const dynamic = 'force-dynamic';

export default async function AdminCompliancePage() {
  const rules = await getAdminComplianceRules();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux paramètres</span>
        </Link>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
          <Globe className="w-3.5 h-3.5 text-gold" />
          <span>Législation & Territoires Internationaux</span>
        </div>
        <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
          Règles Régionales & Vente de Fourrure
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Contrôle des restrictions légales de vente de fourrure naturelle et obligations douanières.
        </p>
      </div>

      {/* Statutory Fur Sales Warning */}
      <div className="p-5 bg-amber-500/10 border border-amber-500/30 text-xs space-y-2">
        <div className="font-medium text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Exigence Légale Impérative (Non-Négociable) :</span>
        </div>
        <p className="text-amber-800 leading-relaxed font-sans">
          Certains territoires interdisent formellement l'importation ou la commercialisation de peaux et fourrures animales (ex: loi californienne AB 44, État d'Israël, certaines juridictions municipales).
          Le système bloque automatiquement la finalisation du panier (checkout) si l'adresse de livraison cible une région sous restriction légale.
        </p>
      </div>

      {/* Rules Table */}
      <div className="bg-surface border border-border/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/40 bg-muted/10 flex items-center justify-between">
          <h2 className="font-serif text-sm font-medium text-primary tracking-wide">
            Territoires Paramétrés ({rules.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase tracking-widest text-[10px]">
                <th className="py-3.5 px-4 font-normal">Pays / Code</th>
                <th className="py-3.5 px-4 font-normal">Vente de Fourrure</th>
                <th className="py-3.5 px-4 font-normal">Devise</th>
                <th className="py-3.5 px-4 font-normal">Langue</th>
                <th className="py-3.5 px-4 font-normal">Mention Douanière (FR)</th>
                <th className="py-3.5 px-4 font-normal">Customs Note (EN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-[11px]">
              {rules.map((rule: any) => (
                <tr key={rule.id} className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    <span className="font-mono bg-muted/50 border border-border/60 px-2 py-0.5 text-xs font-semibold mr-2">
                      {rule.country_code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    {rule.fur_sales_allowed ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Autorisée
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-destructive bg-destructive/10 border border-destructive/30 px-2 py-0.5">
                        <ShieldAlert className="w-3 h-3" /> Interdiction Légale
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    {rule.currency}
                  </td>
                  <td className="py-3.5 px-4 font-sans uppercase text-muted-foreground">
                    {rule.default_locale}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-muted-foreground">
                    {rule.duties_note_fr || '—'}
                  </td>
                  <td className="py-3.5 px-4 font-sans text-muted-foreground">
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
