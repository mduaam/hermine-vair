'use client';
// CLIENT: Interactive unit toggle (cm / inches) and modal dialog open/close state

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  locale?: string;
}

interface SizeRow {
  fr: string;
  it: string;
  uk: string;
  us: string;
  bustCm: string;
  bustIn: string;
  waistCm: string;
  waistIn: string;
  hipsCm: string;
  hipsIn: string;
}

const SIZE_CHART: SizeRow[] = [
  { fr: '34', it: '38', uk: '6', us: '2', bustCm: '80 - 83', bustIn: '31.5 - 32.7', waistCm: '62 - 65', waistIn: '24.4 - 25.6', hipsCm: '88 - 91', hipsIn: '34.6 - 35.8' },
  { fr: '36', it: '40', uk: '8', us: '4', bustCm: '84 - 87', bustIn: '33.1 - 34.3', waistCm: '66 - 69', waistIn: '26.0 - 27.2', hipsCm: '92 - 95', hipsIn: '36.2 - 37.4' },
  { fr: '38', it: '42', uk: '10', us: '6', bustCm: '88 - 91', bustIn: '34.6 - 35.8', waistCm: '70 - 73', waistIn: '27.6 - 28.7', hipsCm: '96 - 99', hipsIn: '37.8 - 39.0' },
  { fr: '40', it: '44', uk: '12', us: '8', bustCm: '92 - 95', bustIn: '36.2 - 37.4', waistCm: '74 - 77', waistIn: '29.1 - 30.3', hipsCm: '100 - 103', hipsIn: '39.4 - 40.6' },
  { fr: '42', it: '46', uk: '14', us: '10', bustCm: '96 - 99', bustIn: '37.8 - 39.0', waistCm: '78 - 81', waistIn: '30.7 - 31.9', hipsCm: '104 - 107', hipsIn: '40.9 - 42.1' },
  { fr: '44', it: '48', uk: '16', us: '12', bustCm: '100 - 104', bustIn: '39.4 - 40.9', waistCm: '82 - 86', waistIn: '32.3 - 33.9', hipsCm: '108 - 112', hipsIn: '42.5 - 44.1' },
];

export function SizeGuideModal({ open, onClose, locale = 'fr' }: SizeGuideModalProps) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const isEn = locale === 'en';

  const title = isEn ? 'Size Guide & Silhouette' : 'Guide des Tailles & Silhouette';
  const description = isEn
    ? 'All our coats and jackets are crafted with French couture proportions. Compare your measurements below.'
    : 'Nos pièces d’exception sont confectionnées selon les proportions de la haute couture française. Comparez vos mensurations ci-dessous.';

  return (
    <Modal open={open} onClose={onClose} title={title} description={description} size="lg">
      <div className="space-y-8 text-sm">
        {/* Unit Toggle */}
        <div className="flex items-center justify-between border-b border-charcoal/15 pb-3">
          <span className="text-xs uppercase tracking-widest text-charcoal font-medium">
            {isEn ? 'Unit of measurement' : 'Unité de mesure'}
          </span>
          <div className="flex items-center border border-charcoal/30 divide-x divide-charcoal/30 text-xs">
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 font-medium transition-colors ${
                unit === 'cm' ? 'bg-black text-ivory' : 'bg-transparent text-charcoal hover:text-black'
              }`}
            >
              Centimètres (cm)
            </button>
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-3 py-1 font-medium transition-colors ${
                unit === 'in' ? 'bg-black text-ivory' : 'bg-transparent text-charcoal hover:text-black'
              }`}
            >
              Inches (in)
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-charcoal/15">
            <thead>
              <tr className="bg-charcoal/5 border-b border-charcoal/20 text-xs tracking-wider uppercase font-medium text-black">
                <th className="p-3 border-r border-charcoal/15">FR / EU</th>
                <th className="p-3 border-r border-charcoal/15">IT</th>
                <th className="p-3 border-r border-charcoal/15">UK</th>
                <th className="p-3 border-r border-charcoal/15">US</th>
                <th className="p-3 border-r border-charcoal/15">{isEn ? 'Bust' : 'Poitrine'}</th>
                <th className="p-3 border-r border-charcoal/15">{isEn ? 'Waist' : 'Taille'}</th>
                <th className="p-3">{isEn ? 'Hips' : 'Bassin'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-charcoal/10">
              {SIZE_CHART.map((row) => (
                <tr key={row.fr} className="hover:bg-charcoal/5 transition-colors">
                  <td className="p-3 font-semibold border-r border-charcoal/15">{row.fr}</td>
                  <td className="p-3 text-charcoal border-r border-charcoal/15">{row.it}</td>
                  <td className="p-3 text-charcoal border-r border-charcoal/15">{row.uk}</td>
                  <td className="p-3 text-charcoal border-r border-charcoal/15">{row.us}</td>
                  <td className="p-3 border-r border-charcoal/15">
                    {unit === 'cm' ? `${row.bustCm} cm` : `${row.bustIn} in`}
                  </td>
                  <td className="p-3 border-r border-charcoal/15">
                    {unit === 'cm' ? `${row.waistCm} cm` : `${row.waistIn} in`}
                  </td>
                  <td className="p-3">
                    {unit === 'cm' ? `${row.hipsCm} cm` : `${row.hipsIn} in`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Measurement Guidance */}
        <div className="bg-ivory border border-charcoal/20 p-4 space-y-2">
          <h3 className="font-serif text-base text-black font-medium">
            {isEn ? 'How to measure' : 'Comment prendre vos mesures'}
          </h3>
          <ul className="space-y-1.5 text-xs text-charcoal leading-relaxed list-disc list-inside">
            <li>
              <strong className="text-black">{isEn ? 'Bust:' : 'Poitrine :'}</strong>{' '}
              {isEn
                ? 'Measure horizontally across the fullest part of the bust.'
                : 'Mesurez horizontalement au point le plus saillant du buste.'}
            </li>
            <li>
              <strong className="text-black">{isEn ? 'Waist:' : 'Taille :'}</strong>{' '}
              {isEn
                ? 'Measure at the narrowest point of the natural waistline.'
                : 'Mesurez au creux le plus étroit de la taille naturelle.'}
            </li>
            <li>
              <strong className="text-black">{isEn ? 'Hips:' : 'Bassin :'}</strong>{' '}
              {isEn
                ? 'Measure around the fullest part of your hips and seat.'
                : 'Mesurez à l’endroit le plus large au niveau du bassin.'}
            </li>
          </ul>
        </div>

        {/* Bespoke Atelier Note */}
        <div className="border-t border-charcoal/15 pt-4 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-gold font-medium">
              {isEn ? 'Bespoke Couture' : 'Haute Mesure & Atelier'}
            </p>
            <p className="text-xs text-charcoal leading-relaxed">
              {isEn
                ? 'Need custom adjustments or half-sizes? Our Parisian atelier offers private bespoke fitting.'
                : 'Vous désirez une coupe sur-mesure ou une demi-taille ? Notre atelier parisien réalise des ajustements personnalisés.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 text-xs tracking-wider uppercase underline underline-offset-4 text-black hover:text-gold transition-colors font-medium py-1"
          >
            {isEn ? 'Understood' : 'Compris'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
