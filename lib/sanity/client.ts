import { createClient } from 'next-sanity';
import imageUrlBuilder from '@sanity/image-url';
import {
  FALLBACK_JOURNAL_POSTS,
  FALLBACK_FAQS,
  type FallbackJournalPost,
  type FallbackFaqItem,
} from './fallback-data';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';

const isSanityConfigured =
  Boolean(projectId) &&
  projectId !== 'placeholder' &&
  projectId !== 'your_sanity_project_id' &&
  projectId!.length > 3;

export const sanityClient = createClient({
  projectId: isSanityConfigured ? projectId! : 'placeholder',
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
});

const builder = isSanityConfigured ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: unknown) {
  if (!builder || !source) return null;
  try {
    return builder.image(source as any);
  } catch {
    return null;
  }
}

export async function getJournalPosts(locale: string = 'fr'): Promise<FallbackJournalPost[]> {
  if (!isSanityConfigured) {
    return FALLBACK_JOURNAL_POSTS;
  }

  try {
    const query = `*[_type == "journalPost"] | order(publishedAt desc) {
      "id": _id,
      "slug": {
        "fr": coalesce(slug.fr.current, slug.current, ""),
        "en": coalesce(slug.en.current, slug.current, "")
      },
      category,
      publishedAt,
      "readTime": coalesce(readTime, "5 min"),
      title,
      excerpt,
      "author": { "fr": "Atelier Parisien", "en": "Parisian Atelier" },
      "heroImage": {
        "url": heroImage.asset->url,
        "alt_fr": heroImage.alt.fr,
        "alt_en": heroImage.alt.en
      },
      body,
      relatedCollectionLinks,
      seo
    }`;

    const posts = await sanityClient.fetch<FallbackJournalPost[]>(
      query,
      {},
      { next: { tags: ['journal'], revalidate: 3600 } }
    );

    if (posts && posts.length > 0) {
      return posts;
    }
    return FALLBACK_JOURNAL_POSTS;
  } catch (err) {
    console.warn('[Sanity] Error fetching journal posts, using fallback:', err);
    return FALLBACK_JOURNAL_POSTS;
  }
}

export async function getJournalPostBySlug(
  slug: string,
  locale: string = 'fr'
): Promise<FallbackJournalPost | null> {
  if (!isSanityConfigured) {
    const found = FALLBACK_JOURNAL_POSTS.find(
      (p) => p.slug.fr === slug || p.slug.en === slug
    );
    return found || null;
  }

  try {
    const query = `*[_type == "journalPost" && (slug.fr.current == $slug || slug.en.current == $slug || slug.current == $slug)][0] {
      "id": _id,
      "slug": {
        "fr": coalesce(slug.fr.current, slug.current, ""),
        "en": coalesce(slug.en.current, slug.current, "")
      },
      category,
      publishedAt,
      "readTime": coalesce(readTime, "5 min"),
      title,
      excerpt,
      "author": { "fr": "Atelier Parisien", "en": "Parisian Atelier" },
      "heroImage": {
        "url": heroImage.asset->url,
        "alt_fr": heroImage.alt.fr,
        "alt_en": heroImage.alt.en
      },
      body,
      relatedCollectionLinks,
      seo
    }`;

    const post = await sanityClient.fetch<FallbackJournalPost | null>(
      query,
      { slug },
      { next: { tags: [`journal-${slug}`, 'journal'], revalidate: 3600 } }
    );

    if (post) return post;
    const fallback = FALLBACK_JOURNAL_POSTS.find(
      (p) => p.slug.fr === slug || p.slug.en === slug
    );
    return fallback || null;
  } catch (err) {
    console.warn(`[Sanity] Error fetching post ${slug}, using fallback:`, err);
    return (
      FALLBACK_JOURNAL_POSTS.find((p) => p.slug.fr === slug || p.slug.en === slug) || null
    );
  }
}

export async function getFaqs(locale: string = 'fr'): Promise<FallbackFaqItem[]> {
  return FALLBACK_FAQS;
}
