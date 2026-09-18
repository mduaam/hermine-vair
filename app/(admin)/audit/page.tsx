import React from 'react';
import { Shield } from 'lucide-react';
import { getAdminAuditLogsList } from '@/lib/supabase/queries/admin';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';

export const metadata = {
  title: 'Journal d’Audit & Sécurité | Administration',
};

export const dynamic = 'force-dynamic';

export default async function AdminAuditPage() {
  const logs = await getAdminAuditLogsList();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
            <Shield className="w-3.5 h-3.5 text-gold" />
            <span>Sécurité & Traçabilité Immuable</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
            Journal d’Audit
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Registre d'audit horodaté consignant chaque mutation de données et changements d'états (Table public.audit_log).
          </p>
        </div>
      </div>

      {/* Audit Log Table Component */}
      <AuditLogViewer logs={logs} />
    </div>
  );
}
