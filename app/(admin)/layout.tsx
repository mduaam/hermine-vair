import React from 'react';
import type { Metadata } from 'next';
import { getCurrentStaff } from '@/lib/admin/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export const metadata: Metadata = {
  title: 'Atelier Administration | L’Hermine et le Vair',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentStaff();

  return (
    <div className="min-h-screen bg-[#080808] text-primary flex">
      {/* Fixed Sidebar */}
      <AdminSidebar currentRole={session.effectiveRole} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        <AdminHeader staff={session.staff} effectiveRole={session.effectiveRole} />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
