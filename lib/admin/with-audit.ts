import { headers } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { getCurrentStaff } from './auth';
import type { StaffRole } from './types';
import { isRoleAllowed } from './nav-config';

export interface AuditParams<TBefore = unknown, TAfter = unknown> {
  action: string;
  resourceType: string;
  resourceId: string;
  requiredRoles: StaffRole[];
  before?: TBefore | null;
  execute: () => Promise<TAfter>;
}

export interface AuditResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function withAudit<TBefore = unknown, TAfter = unknown>(
  params: AuditParams<TBefore, TAfter>
): Promise<AuditResult<TAfter>> {
  const { action, resourceType, resourceId, requiredRoles, before = null, execute } = params;

  try {
    const session = await getCurrentStaff();
    const isAllowed = isRoleAllowed(session.effectiveRole, requiredRoles);

    if (!isAllowed) {
      return {
        success: false,
        error: `Accès refusé. Le rôle '${session.effectiveRole}' n'est pas autorisé pour l'action '${action}'.`,
      };
    }

    // Execute mutation
    const after = await execute();

    // Log to public.audit_log using adminClient (service_role)
    const adminClient = createAdminClient();
    const reqHeaders = headers();
    const ip =
      reqHeaders.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      reqHeaders.get('x-real-ip') ||
      'internal';

    await adminClient.from('audit_log').insert({
      actor_id: session.user?.id || null,
      action,
      resource_type: resourceType,
      resource_id: resourceId,
      before: before ? (before as any) : null,
      after: after ? (after as any) : null,
      ip,
    });

    return {
      success: true,
      data: after,
    };
  } catch (err: any) {
    console.error(`[withAudit] Failed executing ${action} on ${resourceType}/${resourceId}:`, err);
    return {
      success: false,
      error: err?.message || 'Erreur interne lors de la modification.',
    };
  }
}
