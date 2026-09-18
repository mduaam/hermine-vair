import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Tag } from 'lucide-react';
import { DiscountForm } from '@/components/admin/DiscountForm';

export const metadata = {
  title: 'Nouveau Code Privilège | Administration',
};

export default function NewDiscountPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/admin/marketing/discounts"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Retour aux codes privilèges</span>
        </Link>

        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
          <Tag className="w-3.5 h-3.5 text-gold" />
          <span>Marketing & Programmes Privilège</span>
        </div>
        <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
          Créer un Code Privilège
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Configuration d'un avantage tarifaire ou d'une remise bilingue (FR / EN).
        </p>
      </div>

      {/* Form */}
      <DiscountForm />
    </div>
  );
}
