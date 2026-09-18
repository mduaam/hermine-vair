import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { getAdminStaffList } from '@/lib/supabase/queries/admin';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const metadata = {
  title: 'Équipe & Rôles RBAC | Administration',
};

export const dynamic = 'force-dynamic';

export default async function AdminStaffPage() {
  const staffMembers = await getAdminStaffList();

  const roleDefinitions = [
    {
      role: 'owner',
      title: 'Propriétaire (Owner)',
      desc: 'Accès illimité à l’ensemble de la plateforme, gestion des finances, suppression définitive de ressources et gestion du personnel.',
    },
    {
      role: 'admin',
      title: 'Administrateur',
      desc: 'Gestion opérationnelle complète : catalogue, commandes, clients, remises, modération des avis et exportations.',
    },
    {
      role: 'product_specialist',
      title: 'Spécialiste Produit & Atelier',
      desc: 'Création et modification des fiches produits bilingues, gestion des catégories, des stocks d’atelier et des variantes.',
    },
    {
      role: 'order_manager',
      title: 'Responsable Logistique & Commandes',
      desc: 'Traitement des commandes, étiquettes d’expédition haute sécurité, mise à jour des statuts et gestion des retours.',
    },
    {
      role: 'content_editor',
      title: 'Rédacteur Éditorial',
      desc: 'Publication sur le Journal de la Maison, lookbooks et modération éditoriale des témoignages clients.',
    },
    {
      role: 'support_agent',
      title: 'Concierge Privé & Support',
      desc: 'Accès en lecture aux commandes et profils clients pour assistance privée sans droit de modification financière.',
    },
  ];

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
          <Users className="w-3.5 h-3.5 text-gold" />
          <span>Gouvernance & Sécurité</span>
        </div>
        <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
          Collaborateurs & Rôles RBAC
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Matrice d'autorisations et contrôle d'accès basé sur les rôles (Role-Based Access Control).
        </p>
      </div>

      {/* Interactive Simulator Notice */}
      <div className="p-4 bg-gold/10 border border-gold/30 text-xs flex items-start gap-3">
        <UserCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-medium text-foreground block">
            Simulateur de Rôle Actif :
          </span>
          <p className="text-muted-foreground leading-relaxed">
            Vous pouvez tester en direct la restriction des interfaces et du menu latéral en sélectionnant l'un des 6 rôles dans le menu déroulant en haut à droite de l'en-tête administrateur.
          </p>
        </div>
      </div>

      {/* Staff Members Table */}
      <div className="bg-surface border border-border/60 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/40 bg-muted/10 flex items-center justify-between">
          <h2 className="font-serif text-sm font-medium text-primary tracking-wide">
            Comptes Collaborateurs Actifs ({staffMembers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/20 text-muted-foreground uppercase tracking-widest text-[10px]">
                <th className="py-3.5 px-4 font-normal">Collaborateur</th>
                <th className="py-3.5 px-4 font-normal">Rôle Attribué</th>
                <th className="py-3.5 px-4 font-normal">Statut Compte</th>
                <th className="py-3.5 px-4 font-normal text-right">Date d'Ajout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono text-[11px]">
              {staffMembers.map((member: any) => (
                <tr key={member.id} className="hover:bg-muted/10 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center font-serif text-[10px]">
                        {member.email ? member.email[0].toUpperCase() : 'U'}
                      </div>
                      <span>{member.email}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    <StatusBadge type="role" role={member.role} />
                  </td>
                  <td className="py-3.5 px-4 font-sans">
                    {member.active ? (
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700">
                        <CheckCircle2 className="w-3 h-3" /> Actif
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[10px]">Inactif</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right font-sans text-muted-foreground text-[11px]">
                    {new Date(member.created_at).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Definitions Matrix */}
      <div className="bg-surface border border-border/60 p-6 shadow-sm space-y-4">
        <h2 className="font-serif text-base text-primary font-medium tracking-wide border-b border-border/40 pb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-gold" />
          <span>Matrice des 6 Rôles RBAC (Spécification 06_ADMIN_SPEC.md)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {roleDefinitions.map((item) => (
            <div key={item.role} className="p-4 bg-muted/10 border border-border/40 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-medium text-foreground font-sans">{item.title}</span>
                <span className="font-mono text-[10px] bg-background border border-border/60 px-1.5 py-0.5 text-muted-foreground">
                  {item.role}
                </span>
              </div>
              <p className="text-muted-foreground leading-relaxed font-sans text-[11px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
