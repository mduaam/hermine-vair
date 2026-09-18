import React from 'react';
import type { Metadata } from 'next';
import { getCurrentStaff } from '@/lib/admin/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { inter } from '@/lib/fonts';
import '@/app/globals.css';

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
    <html lang="fr" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <div className="min-h-screen flex">
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
      </body>
    </html>
  );
}
