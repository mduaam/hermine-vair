import React from 'react';
import Link from 'next/link';
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Gestion de Contenu Éditorial</span>
          </div>
          <h1 className="font-serif text-2xl lg:text-3xl text-primary font-normal tracking-wide">
            Sanity Studio & Éditoriaux
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Création et publication des récits, pages institutionnelles et campagnes de la Maison.
          </p>
        </div>

        <a
          href="/studio"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-background text-xs uppercase tracking-widest font-medium hover:bg-gold hover:text-primary transition-colors self-start sm:self-auto shadow-sm"
        >
          <span>Accéder au Studio Sanity</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Strict Architecture Separation Note */}
      <div className="p-5 bg-muted/20 border border-border/60 text-xs space-y-2">
        <div className="font-medium text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold inline-block"></span>
          <span>Règle d'Architecture Fondamentale (Séparation des Données) :</span>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Sanity CMS</strong> est l'unique source de vérité pour le contenu éditorial (Journal, Pages de marque, Lookbooks).
          Le commerce (produits, prix en euros, stocks physiques, commandes clients et RLS) est géré exclusivement par <strong className="text-foreground">Supabase</strong>.
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
              className="bg-surface border border-border/60 p-6 shadow-sm flex flex-col justify-between hover:border-gold/50 transition-colors"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-sm bg-primary/5 border border-primary/10 flex items-center justify-center text-gold">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-base text-primary font-medium tracking-wide">
                  {sec.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {sec.desc}
                </p>
              </div>

              <div className="pt-6 mt-4 border-t border-border/40 flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-muted-foreground bg-muted/30 px-2 py-0.5 border border-border/40">
                  {sec.count}
                </span>
                <a
                  href={`/studio/structure/${sec.sanitySchema}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-primary hover:text-gold transition-colors font-medium"
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
