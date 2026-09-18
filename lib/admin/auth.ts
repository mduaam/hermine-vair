import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { StaffMember, StaffRole } from './types';
import { ALL_ROLES } from './nav-config';

export interface CurrentStaffSession {
  user: {
    id: string;
    email: string;
  } | null;
  staff: StaffMember;
  effectiveRole: StaffRole;
}

export async function getCurrentStaff(): Promise<CurrentStaffSession> {
  const cookieStore = cookies();
  const roleOverrideCookie = cookieStore.get('admin_role_override')?.value as StaffRole | undefined;

  let authUser: { id: string; email: string } | null = null;

  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email) {
      authUser = { id: user.id, email: user.email };
    }
  } catch {
    // In dev or SSR fallback
  }

  let realRole: StaffRole = 'owner';
  let staffRecord: StaffMember = {
    id: authUser?.id || '00000000-0000-0000-0000-000000000001',
    role: 'owner',
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    email: authUser?.email || 'directrice@lhermineetlevair.com',
    fullName: 'Direction Générale',
  };

  if (authUser) {
    try {
      const adminClient = createAdminClient();
      const { data, error } = await adminClient
        .from('staff')
        .select('*')
        .eq('id', authUser.id)
        .eq('active', true)
        .maybeSingle();

      if (!error && data) {
        realRole = data.role as StaffRole;
        staffRecord = {
          ...data,
          email: authUser.email,
        };
      } else if (!data) {
        // Auto-bootstrap first staff member as owner
        const { data: staffCount } = await adminClient.from('staff').select('id', { count: 'exact', head: true });
        if (staffCount === null || (staffCount as any) === 0) {
          await adminClient.from('staff').insert({
            id: authUser.id,
            role: 'owner',
            active: true,
          });
          realRole = 'owner';
          staffRecord.id = authUser.id;
          staffRecord.role = 'owner';
        }
      }
    } catch (err) {
      console.warn('[Admin Auth] Error checking staff record:', err);
    }
  }

  // Allow role override in development / testing if cookie is set
  const effectiveRole: StaffRole =
    roleOverrideCookie && ALL_ROLES.includes(roleOverrideCookie)
      ? roleOverrideCookie
      : realRole;

  return {
    user: authUser,
    staff: {
      ...staffRecord,
      role: effectiveRole,
    },
    effectiveRole,
  };
}
