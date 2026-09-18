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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
            <Settings className="w-3.5 h-3.5 text-gold" />
            <span>Configuration & Gouvernance</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
            Paramètres de la Maison
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
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
              className="bg-surface border border-border/60 p-6 shadow-sm flex flex-col justify-between hover:border-gold/50 transition-colors group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-gold group-hover:bg-gold/10 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base text-primary font-medium tracking-wide">
                  {sec.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-border/40 flex items-center justify-between text-xs text-primary font-medium group-hover:text-gold transition-colors">
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
