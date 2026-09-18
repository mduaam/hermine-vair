import { defineType, defineField, defineArrayMember } from 'sanity';

export const journalPost = defineType({
  name: 'journalPost',
  title: 'Journal Post',
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
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Entretien & Préservation', value: 'entretien' },
          { title: 'Style & Silhouettes', value: 'style' },
          { title: 'Coulisses & Artisanat', value: 'coulisses' },
        ],
      },
      validation: (R) => R.required(),
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
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'excerpt',
      type: 'object',
      fields: [
        defineField({ name: 'fr', type: 'text', rows: 3, validation: (R) => R.required() }),
        defineField({ name: 'en', type: 'text', rows: 3, validation: (R) => R.required() }),
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
      name: 'relatedCollectionLinks',
      type: 'array',
      description: 'Enforces editorial to commercial linking rule (silo architecture)',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              type: 'object',
              fields: [
                defineField({ name: 'fr', type: 'string', validation: (R) => R.required() }),
                defineField({ name: 'en', type: 'string', validation: (R) => R.required() }),
              ],
            }),
            defineField({
              name: 'href',
              type: 'object',
              fields: [
                defineField({ name: 'fr', type: 'string', validation: (R) => R.required() }),
                defineField({ name: 'en', type: 'string', validation: (R) => R.required() }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      validation: (R) => R.required(),
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
    select: { title: 'title.fr', subtitle: 'category', media: 'heroImage' },
  },
});
