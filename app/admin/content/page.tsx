import React from 'react';
import { BookOpen, ExternalLink, Sparkles, FileText, Image as ImageIcon, Compass } from 'lucide-react';

export const metadata = {
  title: 'Contenus Éditoriaux & Sanity | Administration',
};

export default function AdminContentPage() {
  const editorialSections = [
    {
      title: 'Le Journal & Carnets d’Atelier',
      desc: 'Articles d’exception, entretiens exclusifs et récits sur le savoir-faire artisanal de la Maison.',
      icon: FileText,
      sanitySchema: 'post',
      count: '4 articles publiés',
    },
    {
      title: 'La Maison & Patrimoine',
      desc: 'Pages institutionnelles : Histoire centenaire, Charte éthique et Visite des ateliers parisiens.',
      icon: BookOpen,
      sanitySchema: 'page',
      count: '3 pages actives',
    },
    {
      title: 'Lookbooks & Saisons',
      desc: 'Campagnes visuelles haute définition, silhouettes de défilés et inspirations saisonnières.',
      icon: ImageIcon,
      sanitySchema: 'lookbook',
      count: '2 collections en ligne',
    },
    {
      title: 'Menus de Navigation & Pied de Page',
      desc: 'Structure des liens bilingues d’en-tête et du pied de page du site vitrine.',
      icon: Compass,
      sanitySchema: 'navigation',
      count: 'Bilingue FR / EN',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-slate-500 mb-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Gestion de Contenu Éditorial</span>
          </div>
          <h1 className="font-sans font-semibold text-xl text-slate-900 tracking-tight">
            Sanity Studio & Éditoriaux
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Création et publication des récits, pages institutionnelles et campagnes de la Maison.
          </p>
        </div>

        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 transition-colors self-start sm:self-auto shadow-xs"
        >
          <span>Accéder au Studio Sanity</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Strict Architecture Separation Note */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
        <div className="font-semibold text-slate-900 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
          <span>Règle d'Architecture Fondamentale (Séparation des Données) :</span>
        </div>
        <p className="text-slate-600 leading-relaxed">
          <strong className="text-slate-900">Sanity CMS</strong> est l'unique source de vérité pour le contenu éditorial (Journal, Pages de marque, Lookbooks).
          Le commerce (produits, prix en euros, stocks physiques, commandes clients et RLS) est géré exclusivement par <strong className="text-slate-900">Supabase</strong>.
          Aucun prix ni niveau de stock ne doit transiter par Sanity.
        </p>
      </div>

      {/* Editorial Silo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {editorialSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <div
              key={sec.title}
              className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs flex flex-col justify-between hover:border-indigo-300 hover:shadow-sm transition-all"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-sans font-semibold text-sm text-slate-900">
                  {sec.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {sec.count}
                </span>
                <a
                  href={`/studio/structure/${sec.sanitySchema}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-800 transition-colors font-semibold"
                >
                  <span>Éditer dans Sanity</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
