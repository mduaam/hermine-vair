import { defineType, defineField } from 'sanity';

export const lookbookEntry = defineType({
  name: 'lookbookEntry',
  title: 'Lookbook Entry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'object',
      fields: [
        defineField({ name: 'fr', type: 'string', validation: (R) => R.required() }),
        defineField({ name: 'en', type: 'string', validation: (R) => R.required() }),
      ],
    }),
    defineField({
      name: 'description',
      type: 'object',
      fields: [
        defineField({ name: 'fr', type: 'text', rows: 2 }),
        defineField({ name: 'en', type: 'text', rows: 2 }),
      ],
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'object',
          fields: [
            defineField({ name: 'fr', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'en', type: 'string', validation: (R) => R.required() }),
          ],
        }),
      ],
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'campaign',
      type: 'object',
      fields: [
        defineField({ name: 'fr', type: 'string', description: 'e.g. "Hiver 2025"' }),
        defineField({ name: 'en', type: 'string', description: 'e.g. "Winter 2025"' }),
      ],
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Display order (ascending)',
      validation: (R) => R.required().integer().min(1),
    }),
    defineField({
      name: 'linkedCollectionSlug',
      type: 'object',
      description: 'Supabase category slug this image links to per locale',
      fields: [
        defineField({ name: 'fr', type: 'string', description: 'e.g. manteaux-de-fourrure' }),
        defineField({ name: 'en', type: 'string', description: 'e.g. fur-coats' }),
      ],
    }),
  ],
  orderings: [
    { title: 'Display Order', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
  preview: {
    select: { title: 'title.fr', media: 'image' },
  },
});
