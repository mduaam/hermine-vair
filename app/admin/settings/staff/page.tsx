import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, ShieldCheck, CheckCircle2, UserCheck } from 'lucide-react';
import { getAdminStaffList } from '@/lib/supabase/queries/admin';
import { StatusBadge } from '@/components/admin/StatusBadge';

export const metadata = {
  title: 'Équipe & Rôles RBAC | Administration',
};

export const dynamic = 'force-dynamic';

interface StaffMember {
  id: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
}

export default async function AdminStaffPage() {
  const rawStaff = await getAdminStaffList();
  const staffMembers = rawStaff as unknown as StaffMember[];

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
          <Users className="w-3.5 h-3.5 text-indigo-600" />
          <span>Gouvernance & Sécurité</span>
        </div>
        <h1 className="font-sans font-semibold text-xl text-slate-900 tracking-tight">
          Collaborateurs & Rôles RBAC
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Matrice d'autorisations et contrôle d'accès basé sur les rôles (Role-Based Access Control).
        </p>
      </div>

      {/* Interactive Simulator Notice */}
      <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-lg text-xs flex items-start gap-3">
        <UserCheck className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-indigo-950 block">
            Simulateur de Rôle Actif :
          </span>
          <p className="text-indigo-900/80 leading-relaxed font-sans">
            Vous pouvez tester en direct la restriction des interfaces et du menu latéral en sélectionnant l'un des 6 rôles dans le menu déroulant en haut à droite de l'en-tête administrateur.
          </p>
        </div>
      </div>

      {/* Staff Members Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h2 className="font-sans font-semibold text-xs text-slate-900 uppercase tracking-wider">
            Comptes Collaborateurs Actifs ({staffMembers.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
                <th className="py-3 px-4">Collaborateur</th>
                <th className="py-3 px-4">Rôle Attribué</th>
                <th className="py-3 px-4">Statut Compte</th>
                <th className="py-3 px-4 text-right">Date d'Ajout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {staffMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 flex items-center justify-center font-sans font-semibold text-xs shrink-0">
                        {member.email ? member.email.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span>{member.email}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <StatusBadge type="role" role={member.role} />
                  </td>
                  <td className="py-3 px-4 font-sans">
                    {member.active ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Actif
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[11px]">Inactif</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-sans text-slate-500 text-[11px]">
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
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
        <h2 className="font-sans font-semibold text-xs uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-2.5 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Matrice des 6 Rôles RBAC (Spécification 06_ADMIN_SPEC.md)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          {roleDefinitions.map((item) => (
            <div key={item.role} className="p-3.5 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-900 font-sans">{item.title}</span>
                <span className="font-mono text-[10px] font-semibold bg-white border border-slate-300 px-1.5 py-0.5 text-slate-700 rounded">
                  {item.role}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed font-sans text-[11px]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
