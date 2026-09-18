'use client';
// CLIENT: interactive unit toggle for size guide

import React, { useState } from 'react';
import { Ruler } from 'lucide-react';

interface SizeGuideViewProps {
  locale: string;
}

export function SizeGuideView({ locale }: SizeGuideViewProps) {
  const isEn = locale === 'en';
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  const sizes = [
    { fr: '34', it: '38', uk: '6', us: '2', bustCm: '80-84', bustIn: '31-33', waistCm: '60-64', waistIn: '23-25', hipsCm: '86-90', hipsIn: '34-35' },
    { fr: '36', it: '40', uk: '8', us: '4', bustCm: '84-88', bustIn: '33-35', waistCm: '64-68', waistIn: '25-27', hipsCm: '90-94', hipsIn: '35-37' },
    { fr: '38', it: '42', uk: '10', us: '6', bustCm: '88-92', bustIn: '35-36', waistCm: '68-72', waistIn: '27-28', hipsCm: '94-98', hipsIn: '37-39' },
    { fr: '40', it: '44', uk: '12', us: '8', bustCm: '92-96', bustIn: '36-38', waistCm: '72-76', waistIn: '28-30', hipsCm: '98-102', hipsIn: '39-40' },
    { fr: '42', it: '46', uk: '14', us: '10', bustCm: '96-102', bustIn: '38-40', waistCm: '76-82', waistIn: '30-32', hipsCm: '102-108', hipsIn: '40-42' },
    { fr: '44', it: '48', uk: '16', us: '12', bustCm: '102-108', bustIn: '40-42', waistCm: '82-88', waistIn: '32-35', hipsCm: '108-114', hipsIn: '42-45' },
  ];

  return (
    <div className="space-y-8">
      {/* Unit Toggle */}
      <div className="flex items-center justify-end gap-3 text-xs uppercase tracking-wider">
        <span className="text-muted">{isEn ? 'Measurement Unit:' : 'Unité :'}</span>
        <div className="flex border border-border">
          <button
            type="button"
            onClick={() => setUnit('cm')}
            className={`px-4 py-1.5 transition-colors ${
              unit === 'cm' ? 'bg-primary text-background font-medium' : 'text-muted hover:text-primary'
            }`}
          >
            CM
          </button>
          <button
            type="button"
            onClick={() => setUnit('in')}
            className={`px-4 py-1.5 transition-colors ${
              unit === 'in' ? 'bg-primary text-background font-medium' : 'text-muted hover:text-primary'
            }`}
          >
            INCHES
          </button>
        </div>
      </div>

      {/* Sizing Table */}
      <div className="overflow-x-auto border border-border bg-surface">
        <table className="w-full text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-border bg-background/60 text-xs uppercase tracking-wider text-gold">
              <th className="p-4">FR</th>
              <th className="p-4">IT</th>
              <th className="p-4">UK</th>
              <th className="p-4">US</th>
              <th className="p-4">{isEn ? 'Bust' : 'Tour de Poitrine'}</th>
              <th className="p-4">{isEn ? 'Waist' : 'Tour de Taille'}</th>
              <th className="p-4">{isEn ? 'Hips' : 'Tour de Bassin'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-muted">
            {sizes.map((row) => (
              <tr key={row.fr} className="hover:bg-background/40 transition-colors">
                <td className="p-4 font-medium text-primary">{row.fr}</td>
                <td className="p-4">{row.it}</td>
                <td className="p-4">{row.uk}</td>
                <td className="p-4">{row.us}</td>
                <td className="p-4">{unit === 'cm' ? `${row.bustCm} cm` : `${row.bustIn} in`}</td>
                <td className="p-4">{unit === 'cm' ? `${row.waistCm} cm` : `${row.waistIn} in`}</td>
                <td className="p-4">{unit === 'cm' ? `${row.hipsCm} cm` : `${row.hipsIn} in`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bespoke advice */}
      <div className="p-6 bg-surface border border-border space-y-2">
        <h3 className="font-serif text-lg text-primary font-normal">
          {isEn ? 'Between two sizes?' : 'Entre deux tailles ?'}
        </h3>
        <p className="font-sans text-xs text-muted font-light leading-relaxed">
          {isEn
            ? 'Due to the generous drape and bespoke silk lining of haute fourrure pieces, our cuts allow comfortable layering over evening attire or knitwear. If you hesitate, we advise selecting your usual French size or contacting our concierge for tailored pattern measurements.'
            : 'En raison du tombé généreux et de la doublure de soie de nos confections de haute fourrure, nos coupes permettent un porté aisé sur des mailles ou des robes du soir. En cas d’hésitation, nous vous conseillons de choisir votre taille française habituelle ou de solliciter notre conciergerie pour un ajustement sur-mesure.'}
        </p>
      </div>
    </div>
  );
}
