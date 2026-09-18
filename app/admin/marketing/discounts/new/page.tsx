import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { DiscountForm } from '@/components/admin/DiscountForm';

export const metadata = {
  title: 'Nouveau Code Privilège | Administration',
};

export default function NewDiscountPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/marketing/discounts"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 mb-3 transition-colors font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux codes privilèges</span>
        </Link>

        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">
          <Tag className="w-3.5 h-3.5 text-indigo-600" />
          <span>Marketing & Programmes Privilège</span>
        </div>
        <h1 className="font-sans font-semibold text-xl text-slate-900 tracking-tight">
          Créer un Code Privilège
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configuration d'un avantage tarifaire ou d'une remise bilingue (FR / EN).
        </p>
      </div>

      {/* Form */}
      <DiscountForm />
    </div>
  );
}
