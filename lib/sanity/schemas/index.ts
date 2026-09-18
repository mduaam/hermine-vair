import { portableText } from './portableText';
import { journalPost } from './journalPost';
import { page } from './page';
import { lookbookEntry } from './lookbookEntry';
import { siteSettings } from './siteSettings';
import { productEnrichment } from './productEnrichment';

export const schemaTypes = [
  portableText, // must be first — referenced by rich text fields
  journalPost,
  page,
  lookbookEntry,
  siteSettings,
  productEnrichment,
];
