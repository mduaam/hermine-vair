import { defineType, defineField } from 'sanity';

export const productEnrichment = defineType({
  name: 'productEnrichment',
  title: 'Product Enrichment',
  type: 'document',
  fields: [
    defineField({
      name: 'productSlug',
      title: 'Product Slug (must match Supabase products.slug)',
      type: 'string',
      validation: (R) => R.required(),
      description: 'Must exactly match the slug in the Supabase products table',
    }),
    defineField({
      name: 'storyBlock',
      type: 'object',
      fields: [
        defineField({ name: 'fr', type: 'portableText' }),
        defineField({ name: 'en', type: 'portableText' }),
      ],
    }),
    defineField({
      name: 'editorialImages',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'object',
              fields: [
                { name: 'fr', type: 'string', validation: (R) => R.required() },
                { name: 'en', type: 'string', validation: (R) => R.required() },
              ],
            },
            { name: 'caption', type: 'string' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'productSlug' },
    prepare({ title }) {
      return { title: `Enrichment: ${title}` };
    },
  },
});
