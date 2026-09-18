import type { NavigationItem, StaffRole } from './types';

export const ALL_ROLES: StaffRole[] = [
  'owner',
  'admin',
  'product_specialist',
  'order_manager',
  'content_editor',
  'support_agent',
];

export const ADMIN_NAVIGATION: NavigationItem[] = [
  {
    title: 'Tableau de Bord',
    href: '/admin',
    icon: 'LayoutDashboard',
    roles: ALL_ROLES,
  },
  {
    title: 'Commandes',
    href: '/admin/orders',
    icon: 'ShoppingBag',
    roles: ['owner', 'admin', 'order_manager', 'support_agent'],
    children: [
      { title: 'Toutes les Commandes', href: '/admin/orders', roles: ['owner', 'admin', 'order_manager', 'support_agent'] },
      { title: 'Retours & Remboursements', href: '/admin/orders?status=refunded', roles: ['owner', 'admin', 'order_manager'] },
    ],
  },
  {
    title: 'Catalogue & Produits',
    href: '/admin/products',
    icon: 'Sparkles',
    roles: ['owner', 'admin', 'product_specialist', 'order_manager', 'content_editor', 'support_agent'],
    children: [
      { title: 'Tous les Produits', href: '/admin/products', roles: ['owner', 'admin', 'product_specialist', 'order_manager', 'content_editor', 'support_agent'] },
      { title: 'Nouveau Produit (FR/EN)', href: '/admin/products/new', roles: ['owner', 'admin', 'product_specialist'] },
      { title: 'Catégories & Silos', href: '/admin/categories', roles: ['owner', 'admin', 'product_specialist'] },
    ],
  },
  {
    title: 'Clients',
    href: '/admin/customers',
    icon: 'Users',
    roles: ['owner', 'admin', 'order_manager', 'support_agent'],
  },
  {
    title: 'Avis Vérifiés',
    href: '/admin/reviews',
    icon: 'Star',
    roles: ['owner', 'admin', 'content_editor', 'support_agent'],
  },
  {
    title: 'Marketing & Codes',
    href: '/admin/marketing/discounts',
    icon: 'Tag',
    roles: ['owner', 'admin', 'content_editor'],
  },
  {
    title: 'Studio Éditorial',
    href: '/admin/content',
    icon: 'BookOpen',
    roles: ['owner', 'admin', 'content_editor'],
  },
  {
    title: 'Paramètres & Staff',
    href: '/admin/settings',
    icon: 'Settings',
    roles: ['owner', 'admin'],
    children: [
      { title: 'Équipe & Rôles RBAC', href: '/admin/settings/staff', roles: ['owner', 'admin'] },
      { title: 'Conformité & Fourrure', href: '/admin/settings/compliance', roles: ['owner', 'admin'] },
    ],
  },
  {
    title: 'Journal d’Audit',
    href: '/admin/audit',
    icon: 'ShieldCheck',
    roles: ['owner', 'admin'],
  },
];

export function isRoleAllowed(userRole: StaffRole, allowedRoles: StaffRole[]): boolean {
  if (userRole === 'owner') return true;
  return allowedRoles.includes(userRole);
}
