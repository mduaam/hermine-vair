import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getJournalPostBySlug, getJournalPosts } from '@/lib/sanity/client';
import { generateAlternates } from '@/lib/seo/hreflang';
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo/jsonld';

interface ArticlePageProps {
  params: Promise<{
    locale: string;
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getJournalPosts('fr');
  const locales = ['fr', 'en'];
  const params: Array<{ locale: string; category: string; slug: string }> = [];

  for (const post of posts) {
    for (const locale of locales) {
      params.push({
        locale,
        category: post.category,
        slug: locale === 'en' ? post.slug.en : post.slug.fr,
      });
    }
  }

  return params;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, category, slug } = await params;
  const isEn = locale === 'en';
  const post = await getJournalPostBySlug(slug, locale);

  if (!post || post.category !== category) {
    return {};
  }

  const title = isEn ? post.seo.metaTitle.en : post.seo.metaTitle.fr;
  const description = isEn ? post.seo.metaDescription.en : post.seo.metaDescription.fr;

  return {
    title,
    description,
    alternates: generateAlternates(
      {
        fr: `/journal/${category}/${post.slug.fr}`,
        en: `/journal/${category}/${post.slug.en}`,
      },
      locale
    ),
    openGraph: {
      title,
      description,
      images: [{ url: post.heroImage.url }],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, category, slug } = await params;
  const isEn = locale === 'en';
  const post = await getJournalPostBySlug(slug, locale);

  if (!post || post.category !== category) {
    notFound();
  }

  const categoryLabels: Record<string, { fr: string; en: string }> = {
    entretien: { fr: 'Entretien & Préservation', en: 'Care & Preservation' },
    style: { fr: 'Style & Silhouettes', en: 'Style & Silhouettes' },
    coulisses: { fr: 'Coulisses & Artisanat', en: 'Behind the Scenes' },
  };

  const categoryName = categoryLabels[category]
    ? isEn
      ? categoryLabels[category].en
      : categoryLabels[category].fr
    : category;

  const articleTitle = isEn ? post.title.en : post.title.fr;
  const articleExcerpt = isEn ? post.excerpt.en : post.excerpt.fr;
  const articleAuthor = isEn ? post.author.en : post.author.fr;
  const bodySections = isEn ? post.body.en : post.body.fr;

  const currentPostSlug = isEn ? post.slug.en : post.slug.fr;

  const breadcrumbs = [
    { label: isEn ? 'Home' : 'Accueil', href: `/${locale}` },
    { label: isEn ? 'The Journal' : 'Le Journal', href: `/${locale}/journal` },
    { label: categoryName, href: `/${locale}/journal` },
    { label: articleTitle, href: `/${locale}/journal/${category}/${currentPostSlug}` },
  ];

  const articleJsonLd = buildArticleJsonLd({
    title: articleTitle,
    description: articleExcerpt,
    url: `/${locale}/journal/${category}/${currentPostSlug}`,
    imageUrl: post.heroImage.url,
    datePublished: post.publishedAt,
    authorName: articleAuthor,
    locale,
  });

  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbs);

  return (
    <article className="bg-background min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <Breadcrumbs items={breadcrumbs} />

        <div className="pt-2">
          <Link
            href={`/${locale}/journal`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isEn ? 'Back to Journal' : 'Retour au Journal'}</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6 text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 text-xs tracking-widest uppercase text-gold font-medium">
            <span>{categoryName}</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-muted">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal leading-tight tracking-wide">
            {articleTitle}
          </h1>

          <p className="font-sans text-base sm:text-lg text-muted font-light leading-relaxed">
            {articleExcerpt}
          </p>

          <div className="pt-4 border-t border-border flex items-center justify-center gap-2 text-xs tracking-wider uppercase text-muted">
            <span>{isEn ? 'By' : 'Par'}</span>
            <span className="text-primary font-medium">{articleAuthor}</span>
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface border border-border">
          <Image
            src={post.heroImage.url}
            alt={isEn ? post.heroImage.alt_en : post.heroImage.alt_fr}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-lg max-w-none text-muted font-light space-y-8 pt-6">
          {bodySections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              {section.title && (
                <h2 className="font-serif text-2xl text-primary font-normal tracking-wide mt-8">
                  {section.title}
                </h2>
              )}
              <p className="font-sans text-base sm:text-lg leading-relaxed text-muted/90">
                {section.content}
              </p>
              {section.quote && (
                <blockquote className="border-l-2 border-gold pl-6 my-6 italic font-serif text-lg sm:text-xl text-primary font-light">
                  {section.quote}
                </blockquote>
              )}
            </div>
          ))}
        </div>

        {/* Cross-Silo Linking Module: Journal -> Collections */}
        {post.relatedCollectionLinks && post.relatedCollectionLinks.length > 0 && (
          <aside className="mt-16 p-8 bg-surface border border-gold/40 space-y-6">
            <div className="flex items-center gap-2.5 text-gold text-xs uppercase tracking-[0.2em] font-medium">
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'Related Collections' : 'Collections Associées'}</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-primary font-normal">
              {isEn
                ? 'Discover Creations from Our Parisian Atelier'
                : 'Découvrez les Créations de Notre Atelier Parisien'}
            </h3>
            <p className="font-sans text-sm text-muted leading-relaxed font-light">
              {isEn
                ? 'Each piece is sculpted by hand to measure, uniting heritage furrier techniques with timeless silhouettes.'
                : 'Chaque création est confectionnée à la main dans le respect absolu des règles de l’artisanat d’art français.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              {post.relatedCollectionLinks.map((link, i) => {
                const linkLabel = isEn ? link.label.en : link.label.fr;
                const linkHref = isEn ? link.href.en : link.href.fr;
                return (
                  <Link
                    key={i}
                    href={`/${locale}${linkHref}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background hover:bg-gold hover:text-primary transition-colors text-xs uppercase tracking-widest font-medium"
                  >
                    <span>{linkLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                );
              })}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
