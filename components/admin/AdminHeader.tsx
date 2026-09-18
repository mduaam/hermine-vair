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
    <header className="sticky top-0 z-30 bg-[#0d0d0d]/95 backdrop-blur-xs border-b border-border/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md hidden sm:block">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Rechercher commandes, clients, références..."
            className="w-full bg-surface/80 border border-border/80 pl-10 pr-4 py-2 text-xs text-primary placeholder:text-muted/60 focus:outline-hidden focus:border-gold transition-colors font-sans"
          />
        </div>
      </div>

      {/* Right Controls: Role Simulator + Notifications + Profile */}
      <div className="flex items-center gap-4 ml-auto">
        {/* RBAC Role Simulator for testing */}
        <div className="flex items-center gap-2 bg-surface/80 border border-border px-3 py-1.5 rounded-sm">
          <UserCheck className="w-3.5 h-3.5 text-gold shrink-0" />
          <span className="text-[10px] uppercase tracking-wider text-muted hidden md:inline">
            Rôle RBAC:
          </span>
          <select
            value={effectiveRole}
            onChange={(e) => handleRoleSwitch(e.target.value as StaffRole)}
            className="bg-transparent text-xs text-primary font-medium focus:outline-hidden cursor-pointer"
            aria-label="Sélectionner un rôle de test RBAC"
          >
            {ALL_ROLES.map((role) => (
              <option key={role} value={role} className="bg-[#111111] text-primary">
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>

        <StatusBadge type="role" value={effectiveRole} />

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-2 text-muted hover:text-primary transition-colors"
          aria-label="Alertes administratives"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
        </button>

        {/* Staff User Avatar & Email */}
        <div className="flex items-center gap-3 pl-3 border-l border-border/60">
          <div className="w-7 h-7 rounded-full bg-surface border border-gold/40 flex items-center justify-center text-[11px] font-serif text-gold">
            {staff.email ? staff.email[0]?.toUpperCase() ?? 'H' : 'H'}
          </div>
          <div className="hidden xl:block text-left">
            <div className="text-xs font-medium text-primary leading-none">
              {staff.fullName || 'Direction Atelier'}
            </div>
            <div className="text-[10px] text-muted leading-tight mt-0.5">
              {staff.email}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
