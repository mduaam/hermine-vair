import { defineType, defineField } from 'sanity';

export const page = defineType({
  name: 'page',
  title: 'Page',
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
      name: 'slug',
      type: 'object',
      fields: [
        defineField({
          name: 'fr',
          type: 'slug',
          options: { source: 'title.fr', maxLength: 96 },
          validation: (R) => R.required(),
        }),
        defineField({
          name: 'en',
          type: 'slug',
          options: { source: 'title.en', maxLength: 96 },
          validation: (R) => R.required(),
        }),
      ],
    }),
    defineField({
      name: 'silo',
      type: 'string',
      options: {
        list: [
          { title: 'Maison', value: 'maison' },
          { title: 'Client Services', value: 'client-services' },
        ],
      },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'subSilo',
      type: 'string',
      description: 'e.g. savoir-faire, ethique, heritage, livraison, tailles, faq',
    }),
    defineField({
      name: 'heroImage',
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
    }),
    defineField({
      name: 'body',
      type: 'object',
      fields: [
        defineField({ name: 'fr', type: 'portableText' }),
        defineField({ name: 'en', type: 'portableText' }),
      ],
    }),
    defineField({
      name: 'seo',
      type: 'object',
      fields: [
        defineField({
          name: 'metaTitle',
          type: 'object',
          fields: [
            defineField({ name: 'fr', type: 'string', validation: (R) => R.max(60) }),
            defineField({ name: 'en', type: 'string', validation: (R) => R.max(60) }),
          ],
        }),
        defineField({
          name: 'metaDescription',
          type: 'object',
          fields: [
            defineField({ name: 'fr', type: 'string', validation: (R) => R.max(160) }),
            defineField({ name: 'en', type: 'string', validation: (R) => R.max(160) }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title.fr', subtitle: 'silo' },
  },
});
