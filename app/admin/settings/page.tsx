import React from 'react';
import Link from 'next/link';
import { Settings, Users, Globe, Shield, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Paramètres du Système | Administration',
};

export default function AdminSettingsPage() {
  const sections = [
    {
      title: 'Équipe & Gestion des Rôles (RBAC)',
      desc: 'Gestion des comptes collaborateurs et attribution des 6 rôles de sécurité (Propriétaire, Administrateur, Spécialiste Produit, etc.).',
      href: '/admin/settings/staff',
      icon: Users,
    },
    {
      title: 'Conformité Internationale & Vente de Fourrure',
      desc: 'Règles douanières par pays et application stricte des interdictions légales de vente de fourrure (AB 44, Israël, etc.).',
      href: '/admin/settings/compliance',
      icon: Globe,
    },
    {
      title: 'Journal d’Audit & Sécurité',
      desc: 'Historique immuable de toutes les actions administratives avec traçabilité de l’état avant/après et horodatage certifié.',
      href: '/admin/audit',
      icon: Shield,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">
            <Settings className="w-3.5 h-3.5 text-indigo-600" />
            <span>Configuration & Gouvernance</span>
          </div>
          <h1 className="font-sans font-semibold text-xl text-slate-900 tracking-tight">
            Paramètres de la Maison
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Contrôle d’accès, conformité internationale et traçabilité des opérations.
          </p>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((sec) => {
          const Icon = sec.icon;
          return (
            <Link
              key={sec.title}
              href={sec.href}
              className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs flex flex-col justify-between hover:border-indigo-400 hover:shadow-sm transition-all group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-semibold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {sec.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold group-hover:text-indigo-700 transition-colors">
                <span>Accéder</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
