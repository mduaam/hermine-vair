export type StaffRole =
  | 'owner'
  | 'admin'
  | 'product_specialist'
  | 'order_manager'
  | 'content_editor'
  | 'support_agent';

export interface StaffMember {
  id: string;
  role: StaffRole;
  active: boolean;
  created_at: string;
  updated_at: string;
  email?: string;
  fullName?: string;
}

export interface AuditLogEntry {
  id: string;
  actor_id: string | null;
  actor_email?: string;
  action: string;
  resource_type: string;
  resource_id: string;
  before: Record<string, unknown> | null;
  after: Record<string, unknown> | null;
  ip: string | null;
  created_at: string;
}

export interface NavigationItem {
  title: string;
  href: string;
  icon: string;
  roles: StaffRole[];
  badge?: string;
  children?: Array<{
    title: string;
    href: string;
    roles: StaffRole[];
  }>;
}
