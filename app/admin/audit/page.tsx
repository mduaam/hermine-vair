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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sécurité & Traçabilité Immuable</span>
          </div>
          <h1 className="font-sans font-semibold text-xl text-slate-900 tracking-tight">
            Journal d’Audit
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Registre d'audit horodaté consignant chaque mutation de données et changements d'états (Table public.audit_log).
          </p>
        </div>
      </div>

      {/* Audit Log Table Component */}
      <AuditLogViewer logs={logs} />
    </div>
  );
}
