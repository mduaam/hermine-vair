'use client';
// CLIENT: topbar with global search, live role simulator switcher, and staff profile

import React from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Search, UserCheck } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { ALL_ROLES } from '@/lib/admin/nav-config';
import type { StaffMember, StaffRole } from '@/lib/admin/types';

interface AdminHeaderProps {
  staff: StaffMember;
  effectiveRole: StaffRole;
}

const ROLE_LABELS: Record<StaffRole, string> = {
  owner: 'Propriétaire (Owner)',
  admin: 'Administrateur',
  product_specialist: 'Spécialiste Produit',
  order_manager: 'Responsable Commandes',
  content_editor: 'Éditeur Contenu',
  support_agent: 'Agent Conciergerie',
};

export function AdminHeader({ staff, effectiveRole }: AdminHeaderProps) {
  const router = useRouter();

  const handleRoleSwitch = (newRole: StaffRole) => {
    // Set cookie for role simulation and refresh
    document.cookie = `admin_role_override=${newRole}; path=/; max-age=86400; SameSite=Lax`;
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher commandes, clients… (⌘K)"
            className="w-full bg-slate-100 border border-slate-200 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:bg-white focus:border-indigo-500 rounded-sm transition-colors font-sans"
          />
        </div>
      </div>

      {/* Right Controls: Role Simulator + Notifications + Profile */}
      <div className="flex items-center gap-4 ml-auto">
        {/* RBAC Role Simulator for testing */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-sm">
          <UserCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="text-[10px] uppercase tracking-wider text-slate-500 hidden md:inline font-medium">
            Rôle RBAC:
          </span>
          <select
            value={effectiveRole}
            onChange={(e) => handleRoleSwitch(e.target.value as StaffRole)}
            className="bg-transparent text-xs text-slate-800 font-medium focus:outline-hidden cursor-pointer"
            aria-label="Sélectionner un rôle de test RBAC"
          >
            {ALL_ROLES.map((role) => (
              <option key={role} value={role} className="bg-white text-slate-800">
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>

        <StatusBadge type="role" value={effectiveRole} />

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-slate-900 transition-colors"
          aria-label="Alertes administratives"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
        </button>

        {/* Staff User Avatar & Email */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
          <div className="w-7 h-7 rounded-sm bg-indigo-50 border border-indigo-200 flex items-center justify-center text-[11px] font-sans font-semibold text-indigo-700">
            {staff.email ? staff.email[0]?.toUpperCase() ?? 'H' : 'H'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-semibold text-slate-900 leading-none">
              {staff.fullName || 'Direction Atelier'}
            </div>
            <div className="text-[10px] text-slate-500 leading-tight mt-0.5">
              {staff.email}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
