'use client';
// CLIENT: interactive admin navigation sidebar with active route highlights & role filtering

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Users,
  Star,
  Tag,
  BookOpen,
  Settings,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { ADMIN_NAVIGATION, isRoleAllowed } from '@/lib/admin/nav-config';
import type { StaffRole } from '@/lib/admin/types';

interface AdminSidebarProps {
  currentRole: StaffRole;
}

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  ShoppingBag,
  Sparkles,
  Users,
  Star,
  Tag,
  BookOpen,
  Settings,
  ShieldCheck,
};

export function AdminSidebar({ currentRole }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({
    '/admin/orders': true,
    '/admin/products': true,
    '/admin/settings': true,
  });

  const toggleSubMenu = (href: string) => {
    setOpenSubMenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  const visibleItems = ADMIN_NAVIGATION.filter((item) =>
    isRoleAllowed(currentRole, item.roles)
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 bg-background border border-border text-primary hover:text-gold transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0d0d0d] border-r border-border/80 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-border/60">
            <Link
              href="/admin"
              className="block group"
              onClick={() => setMobileOpen(false)}
            >
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold font-medium">
                Back-Office Paris
              </div>
              <h1 className="font-serif text-lg tracking-wider text-primary font-normal group-hover:text-gold transition-colors mt-0.5">
                L’Hermine et le Vair
              </h1>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 flex-1">
            {visibleItems.map((item) => {
              const IconComponent = ICON_MAP[item.icon] || LayoutDashboard;
              const isActive =
                item.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(item.href);

              const hasChildren = item.children && item.children.length > 0;
              const isSubOpen = openSubMenus[item.href];

              return (
                <div key={item.href} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex-1 flex items-center gap-3 px-3.5 py-2.5 text-xs uppercase tracking-wider transition-colors ${
                        isActive
                          ? 'bg-primary text-background font-medium'
                          : 'text-muted hover:text-primary hover:bg-surface/80'
                      }`}
                    >
                      <IconComponent className="w-4 h-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>

                    {hasChildren && (
                      <button
                        type="button"
                        onClick={() => toggleSubMenu(item.href)}
                        className="px-2 py-2.5 text-muted hover:text-primary"
                        aria-label="Toggle sub-menu"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isSubOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    )}
                  </div>

                  {/* Submenu Children */}
                  {hasChildren && isSubOpen && (
                    <div className="pl-9 pr-2 py-1 space-y-1">
                      {item.children!
                        .filter((child) => isRoleAllowed(currentRole, child.roles))
                        .map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={`block px-3 py-1.5 text-[11px] uppercase tracking-wider transition-colors ${
                                isChildActive
                                  ? 'text-gold font-medium'
                                  : 'text-muted/80 hover:text-primary'
                              }`}
                            >
                              {child.title}
                            </Link>
                          );
                        })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border/60 bg-black/40 space-y-3">
          <Link
            href="/fr"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 text-xs uppercase tracking-wider text-muted hover:text-gold transition-colors border border-border/60 hover:border-gold"
          >
            <span>Boutique En Ligne</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
