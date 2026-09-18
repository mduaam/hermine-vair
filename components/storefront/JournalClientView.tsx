'use client';
// CLIENT: interactive category filter tabs for Journal magazine index

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';
import type { FallbackJournalPost } from '@/lib/sanity/fallback-data';

interface JournalClientViewProps {
  posts: FallbackJournalPost[];
  locale: string;
}

export function JournalClientView({ posts, locale }: JournalClientViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const isEn = locale === 'en';

  const categories = [
    { id: 'all', label: isEn ? 'All Stories' : 'Toutes les Chroniques' },
    { id: 'entretien', label: isEn ? 'Care & Preservation' : 'Entretien & Préservation' },
    { id: 'style', label: isEn ? 'Style & Silhouettes' : 'Style & Silhouettes' },
    { id: 'coulisses', label: isEn ? 'Behind the Scenes' : 'Coulisses & Artisanat' },
  ];

  const filteredPosts =
    selectedCategory === 'all'
      ? posts
      : posts.filter((p) => p.category === selectedCategory);

  const featured = filteredPosts[0];
  const remaining = filteredPosts.slice(1);

  return (
    <div className="space-y-16">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-border pb-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-6 py-2.5 text-xs uppercase tracking-widest transition-colors duration-200 ${
              selectedCategory === cat.id
                ? 'bg-primary text-background font-medium'
                : 'text-muted hover:text-primary hover:bg-surface'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Featured Lead Story */}
      {featured && (
        <article className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-surface p-6 lg:p-10 border border-border">
          <div className="lg:col-span-7 relative aspect-[16/10] overflow-hidden bg-background">
            <Image
              src={featured.heroImage.url}
              alt={isEn ? featured.heroImage.alt_en : featured.heroImage.alt_fr}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
          </div>
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs tracking-widest uppercase text-gold font-medium">
                <span>{featured.category}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-muted">
                  <Clock className="w-3.5 h-3.5" />
                  {featured.readTime}
                </span>
              </div>
              <h2 className="font-serif text-2xl lg:text-3xl text-primary font-normal leading-snug tracking-wide group-hover:text-gold transition-colors">
                <Link href={`/${locale}/journal/${featured.category}/${isEn ? featured.slug.en : featured.slug.fr}`}>
                  {isEn ? featured.title.en : featured.title.fr}
                </Link>
              </h2>
              <p className="font-sans text-sm text-muted leading-relaxed line-clamp-3">
                {isEn ? featured.excerpt.en : featured.excerpt.fr}
              </p>
            </div>

            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs tracking-wider uppercase text-muted">
                {isEn ? featured.author.en : featured.author.fr}
              </span>
              <Link
                href={`/${locale}/journal/${featured.category}/${isEn ? featured.slug.en : featured.slug.fr}`}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-medium group-hover:text-gold transition-colors"
              >
                <span>{isEn ? 'Read Article' : 'Lire l’Article'}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Grid of Remaining Stories */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {remaining.map((post) => {
            const postSlug = isEn ? post.slug.en : post.slug.fr;
            return (
              <article
                key={post.id}
                className="group flex flex-col justify-between bg-surface border border-border overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-background">
                  <Image
                    src={post.heroImage.url}
                    alt={isEn ? post.heroImage.alt_en : post.heroImage.alt_fr}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[11px] tracking-widest uppercase text-gold">
                      <span>{post.category}</span>
                      <span>•</span>
                      <span className="text-muted flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg lg:text-xl text-primary font-normal leading-snug group-hover:text-gold transition-colors">
                      <Link href={`/${locale}/journal/${post.category}/${postSlug}`}>
                        {isEn ? post.title.en : post.title.fr}
                      </Link>
                    </h3>
                    <p className="font-sans text-xs text-muted leading-relaxed line-clamp-3">
                      {isEn ? post.excerpt.en : post.excerpt.fr}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] tracking-wider uppercase text-muted">
                      {isEn ? post.author.en : post.author.fr}
                    </span>
                    <Link
                      href={`/${locale}/journal/${post.category}/${postSlug}`}
                      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-primary font-medium group-hover:text-gold transition-colors"
                    >
                      <span>{isEn ? 'Read' : 'Lire'}</span>
                      <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 bg-surface border border-border">
          <p className="font-serif text-lg text-muted">
            {isEn
              ? 'No articles found in this category.'
              : 'Aucun article répertorié dans cette catégorie.'}
          </p>
        </div>
      )}
    </div>
  );
}
