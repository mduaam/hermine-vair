import { defineType, defineField, defineArrayMember } from 'sanity';

const navLinkType = defineArrayMember({
  type: 'object',
  fields: [
    defineField({ name: 'labelFr', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'labelEn', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'href', type: 'string', validation: (R) => R.required() }),
  ],
});

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'navigation',
      type: 'object',
      fields: [
        defineField({
          name: 'collectionsLinks',
          type: 'array',
          of: [navLinkType],
        }),
        defineField({
          name: 'maisonLinks',
          type: 'array',
          of: [navLinkType],
        }),
        defineField({
          name: 'journalLinks',
          type: 'array',
          of: [navLinkType],
        }),
        defineField({
          name: 'footerColumns',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              fields: [
                defineField({
                  name: 'heading',
                  type: 'object',
                  fields: [
                    defineField({ name: 'fr', type: 'string' }),
                    defineField({ name: 'en', type: 'string' }),
                  ],
                }),
                defineField({ name: 'links', type: 'array', of: [navLinkType] }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'announcementBar',
      type: 'object',
      description: 'Top-of-page announcement (optional)',
      fields: [
        defineField({ name: 'fr', type: 'string' }),
        defineField({ name: 'en', type: 'string' }),
        defineField({ name: 'active', type: 'boolean', initialValue: false }),
      ],
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: { list: ['instagram', 'pinterest', 'facebook', 'tiktok', 'youtube'] },
            }),
            defineField({ name: 'url', type: 'url' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'regionBanners',
      type: 'array',
      description: 'Country-specific banners (e.g. geolocation currency suggestion)',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'countryCode',
              type: 'string',
              description: 'ISO 3166-1 alpha-2, e.g. US, GB, JP',
            }),
            defineField({
              name: 'message',
              type: 'object',
              fields: [
                defineField({ name: 'fr', type: 'string' }),
                defineField({ name: 'en', type: 'string' }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings (singleton)' };
    },
  },
});
