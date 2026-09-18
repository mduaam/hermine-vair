export interface Category {
  id: string;
  slug: string;
  slug_en?: string;
  name_fr: string;
  name_en: string;
  parent_id?: string | null;
  kind: 'type' | 'material' | 'season';
  position: number;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text_fr: string;
  alt_text_en: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size: string;
  color?: string | null;
  sku: string;
  stock_quantity: number;
  price_override?: number | null;
}

export interface Product {
  id: string;
  slug: string;
  slug_en?: string;
  sku: string;
  name_fr: string;
  name_en: string;
  description_fr?: string | null;
  description_en?: string | null;
  category_id: string;
  material: 'vison' | 'renard' | 'chinchilla' | 'cachemire' | 'laine' | 'autre';
  price_amount: number;
  price_currency: string;
  status: 'draft' | 'active' | 'archived';
  is_best_seller: boolean;
  care_instructions_fr?: string | null;
  care_instructions_en?: string | null;
  origin_atelier?: string | null;
  meta_title_fr?: string | null;
  meta_title_en?: string | null;
  meta_description_fr?: string | null;
  meta_description_en?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  category?: Category;
}

// -------------------------------------------------------------
// SEED CATALOG FALLBACK DATA (matches supabase/seed.sql)
// -------------------------------------------------------------

export const SEED_CATEGORIES: Category[] = [
  { id: '10000000-0000-0000-0000-000000000001', slug: 'manteaux', slug_en: 'coats', name_fr: 'Manteaux', name_en: 'Coats', kind: 'type', position: 1 },
  { id: '10000000-0000-0000-0000-000000000002', slug: 'gilets', slug_en: 'vests', name_fr: 'Gilets & Vestes', name_en: 'Vests & Jackets', kind: 'type', position: 2 },
  { id: '10000000-0000-0000-0000-000000000003', slug: 'capes', slug_en: 'capes', name_fr: 'Capes & Étoles', name_en: 'Capes & Stoles', kind: 'type', position: 3 },
  { id: '10000000-0000-0000-0000-000000000004', slug: 'accessoires', slug_en: 'accessories', name_fr: 'Accessoires', name_en: 'Accessories', kind: 'type', position: 4 },
  { id: '10000000-0000-0000-0000-000000000005', slug: 'vison', slug_en: 'mink', name_fr: 'Vison', name_en: 'Mink', kind: 'material', position: 5 },
  { id: '10000000-0000-0000-0000-000000000006', slug: 'renard', slug_en: 'fox', name_fr: 'Renard', name_en: 'Fox', kind: 'material', position: 6 },
  { id: '10000000-0000-0000-0000-000000000007', slug: 'chinchilla', slug_en: 'chinchilla', name_fr: 'Chinchilla', name_en: 'Chinchilla', kind: 'material', position: 7 },
  { id: '10000000-0000-0000-0000-000000000008', slug: 'cachemire', slug_en: 'cashmere', name_fr: 'Cachemire', name_en: 'Cashmere', kind: 'material', position: 8 },
  { id: '10000000-0000-0000-0000-000000000011', slug: 'manteaux-de-fourrure', slug_en: 'fur-coats', name_fr: 'Manteaux de Fourrure', name_en: 'Fur Coats', parent_id: '10000000-0000-0000-0000-000000000001', kind: 'type', position: 1 },
  { id: '10000000-0000-0000-0000-000000000012', slug: 'manteaux-en-cachemire', slug_en: 'cashmere-coats', name_fr: 'Manteaux en Cachemire', name_en: 'Cashmere Coats', parent_id: '10000000-0000-0000-0000-000000000001', kind: 'type', position: 2 },
];


export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-vison-noir',
    slug: 'manteau-vison-noir',
    slug_en: 'black-mink-coat',
    sku: 'SKU-VIS-001',
    name_fr: 'Manteau en Vison Noir',
    name_en: 'Black Mink Coat',
    description_fr: "Un manteau d'exception taillé dans le vison le plus soyeux, signé de la main de nos maîtres artisans parisiens. La doublure en soie ivoire révèle l'attention portée à chaque détail.",
    description_en: 'An exceptional coat cut from the finest silky mink, signed by our Parisian master artisans. The ivory silk lining reveals the attention paid to every detail.',
    category_id: 'cat-manteaux-fourrure',
    material: 'vison',
    price_amount: 8900,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Confier à un professionnel de la fourrure. Ne pas mouiller. Conserver dans une housse respirante.',
    care_instructions_en: 'Entrust to a professional furrier. Do not wet. Store in a breathable garment bag.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Manteau en Vison Noir | L'Hermine et le Vair",
    meta_title_en: "Black Mink Coat | L'Hermine et le Vair",
    meta_description_fr: "Manteau en vison noir, créé à la main dans notre atelier parisien. Fourrure d'exception, doublure soie.",
    meta_description_en: 'Black mink coat, handcrafted in our Parisian atelier. Exceptional fur, silk lining.',
    images: [
      {
        id: 'img-vn-1',
        product_id: 'prod-vison-noir',
        url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Manteau en vison noir, vue de face',
        alt_text_en: 'Black mink coat, front view',
        position: 1,
      },
      {
        id: 'img-vn-2',
        product_id: 'prod-vison-noir',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Manteau en vison noir, détail de la coupe',
        alt_text_en: 'Black mink coat, tailoring detail',
        position: 2,
      },
      {
        id: 'img-vn-3',
        product_id: 'prod-vison-noir',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Texture du poil de vison noir scandinave',
        alt_text_en: 'Texture of Scandinavian black mink pelt',
        position: 3,
      },
    ],
    variants: [
      { id: 'var-vn-36', product_id: 'prod-vison-noir', size: '36', sku: 'SKU-VIS-001-36', stock_quantity: 2 },
      { id: 'var-vn-38', product_id: 'prod-vison-noir', size: '38', sku: 'SKU-VIS-001-38', stock_quantity: 3 },
      { id: 'var-vn-40', product_id: 'prod-vison-noir', size: '40', sku: 'SKU-VIS-001-40', stock_quantity: 2 },
      { id: 'var-vn-42', product_id: 'prod-vison-noir', size: '42', sku: 'SKU-VIS-001-42', stock_quantity: 1 },
    ],
  },
  {
    id: 'prod-vison-cognac',
    slug: 'manteau-vison-cognac',
    slug_en: 'cognac-mink-coat',
    sku: 'SKU-VIS-002',
    name_fr: 'Manteau en Vison Cognac',
    name_en: 'Cognac Mink Coat',
    description_fr: "La chaleur cuivrée du cognac rencontre la douceur incomparable du vison scandinave. Une pièce intemporelle pour les femmes qui cultivent l'élégance.",
    description_en: 'The copper warmth of cognac meets the incomparable softness of Scandinavian mink. A timeless piece for women who cultivate elegance.',
    category_id: 'cat-manteaux-fourrure',
    material: 'vison',
    price_amount: 9800,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Confier à un professionnel de la fourrure. Sécher naturellement si mouillé.',
    care_instructions_en: 'Entrust to a professional furrier. Dry naturally if wet.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Manteau en Vison Cognac | L'Hermine et le Vair",
    meta_title_en: "Cognac Mink Coat | L'Hermine et le Vair",
    meta_description_fr: "Manteau en vison cognac, teinte chaude et lumineuse. Artisanat parisien d'exception.",
    meta_description_en: 'Cognac mink coat in a warm and luminous hue. Exceptional Parisian craftsmanship.',
    images: [
      {
        id: 'img-vc-1',
        product_id: 'prod-vison-cognac',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Manteau en vison cognac scandinave',
        alt_text_en: 'Cognac mink coat, front view',
        position: 1,
      },
    ],
    variants: [
      { id: 'var-vc-38', product_id: 'prod-vison-cognac', size: '38', sku: 'SKU-VIS-002-38', stock_quantity: 2 },
      { id: 'var-vc-40', product_id: 'prod-vison-cognac', size: '40', sku: 'SKU-VIS-002-40', stock_quantity: 2 },
    ],
  },
  {
    id: 'prod-renard-platine',
    slug: 'gilet-renard-platine',
    slug_en: 'platinum-fox-vest',
    sku: 'SKU-REN-001',
    name_fr: 'Gilet en Renard Platine',
    name_en: 'Platinum Fox Vest',
    description_fr: 'La légèreté du renard platine sublimée en gilet. Porté seul sur un chemisier en soie ou sous un manteau, cette pièce transforme toute tenue.',
    description_en: 'The lightness of platinum fox sublimated in a vest. Worn alone over a silk blouse or under a coat, this piece transforms any outfit.',
    category_id: 'cat-gilets',
    material: 'renard',
    price_amount: 4800,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Confier à un professionnel de la fourrure. Éviter l’humidité prolongée.',
    care_instructions_en: 'Entrust to a professional furrier. Avoid prolonged moisture.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Gilet en Renard Platine | L'Hermine et le Vair",
    meta_title_en: "Platinum Fox Vest | L'Hermine et le Vair",
    meta_description_fr: "Gilet en renard platine, pièce intemporelle de la maison L'Hermine et le Vair.",
    meta_description_en: "Platinum fox fur vest, a timeless piece by L'Hermine et le Vair.",
    images: [
      {
        id: 'img-rp-1',
        product_id: 'prod-renard-platine',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Gilet en renard platine, vue de face',
        alt_text_en: 'Platinum fox vest, front view',
        position: 1,
      },
    ],
    variants: [
      { id: 'var-rp-xs', product_id: 'prod-renard-platine', size: 'XS', sku: 'SKU-REN-001-XS', stock_quantity: 3 },
      { id: 'var-rp-s', product_id: 'prod-renard-platine', size: 'S', sku: 'SKU-REN-001-S', stock_quantity: 4 },
      { id: 'var-rp-m', product_id: 'prod-renard-platine', size: 'M', sku: 'SKU-REN-001-M', stock_quantity: 3 },
    ],
  },
  {
    id: 'prod-renard-blanc',
    slug: 'cape-renard-blanc',
    slug_en: 'white-fox-cape',
    sku: 'SKU-REN-002',
    name_fr: 'Cape en Renard Blanc',
    name_en: 'White Fox Cape',
    description_fr: 'La blancheur immaculée du renard arctique, sculptée en cape fluide. Une déclaration d’élégance pour les grandes occasions.',
    description_en: 'The immaculate whiteness of Arctic fox, sculpted into a fluid cape. A declaration of elegance for special occasions.',
    category_id: 'cat-capes',
    material: 'renard',
    price_amount: 5600,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Confier à un professionnel de la fourrure. Ne jamais plier — conserver sur un cintre rembourré.',
    care_instructions_en: 'Entrust to a professional furrier. Never fold — store on a padded hanger.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Cape en Renard Blanc | L'Hermine et le Vair",
    meta_title_en: "White Fox Cape | L'Hermine et le Vair",
    meta_description_fr: 'Cape en renard blanc arctique, élégance pure pour les grandes occasions.',
    meta_description_en: 'White Arctic fox cape, pure elegance for special occasions.',
    images: [
      {
        id: 'img-rb-1',
        product_id: 'prod-renard-blanc',
        url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Cape en renard blanc arctique',
        alt_text_en: 'White Arctic fox cape',
        position: 1,
      },
    ],
    variants: [
      { id: 'var-rb-u', product_id: 'prod-renard-blanc', size: 'TU', sku: 'SKU-REN-002-TU', stock_quantity: 4 },
    ],
  },
  {
    id: 'prod-chinchilla-court',
    slug: 'veste-chinchilla',
    slug_en: 'chinchilla-jacket',
    sku: 'SKU-CHI-001',
    name_fr: 'Veste en Chinchilla',
    name_en: 'Chinchilla Jacket',
    description_fr: 'La fourrure la plus précieuse au monde, tissée en veste structurée. La légèreté du chinchilla est incomparable ; chaque pièce est unique.',
    description_en: "The world's most precious fur, woven into a structured jacket. The lightness of chinchilla is incomparable; each piece is unique.",
    category_id: 'cat-manteaux-fourrure',
    material: 'chinchilla',
    price_amount: 12500,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Réservé aux professionnels de la fourrure uniquement. Extrêmement délicat.',
    care_instructions_en: 'Professional furriers only. Extremely delicate.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Veste en Chinchilla | L'Hermine et le Vair",
    meta_title_en: "Chinchilla Jacket | L'Hermine et le Vair",
    meta_description_fr: "Veste en chinchilla, la fourrure la plus rare et précieuse. Artisanat d'exception, Paris.",
    meta_description_en: 'Chinchilla jacket — the rarest and most precious fur. Exceptional craftsmanship, Paris.',
    images: [
      {
        id: 'img-chi-1',
        product_id: 'prod-chinchilla-court',
        url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Veste en chinchilla, texture de la fourrure',
        alt_text_en: 'Chinchilla jacket, fur texture',
        position: 1,
      },
    ],
    variants: [
      { id: 'var-chi-36', product_id: 'prod-chinchilla-court', size: '36', sku: 'SKU-CHI-001-36', stock_quantity: 1 },
      { id: 'var-chi-38', product_id: 'prod-chinchilla-court', size: '38', sku: 'SKU-CHI-001-38', stock_quantity: 1 },
      { id: 'var-chi-40', product_id: 'prod-chinchilla-court', size: '40', sku: 'SKU-CHI-001-40', stock_quantity: 1 },
    ],
  },
  {
    id: 'prod-chinchilla-stole',
    slug: 'etole-chinchilla',
    slug_en: 'chinchilla-stole',
    sku: 'SKU-CHI-002',
    name_fr: 'Étole en Chinchilla',
    name_en: 'Chinchilla Stole',
    description_fr: "Une étole en chinchilla pour transformer une tenue du soir en œuvre d'art. Doucement posée sur les épaules, elle fait de vous la femme la plus élégante de la salle.",
    description_en: 'A chinchilla stole to transform an evening outfit into a work of art. Gently draped over the shoulders, it makes you the most elegant woman in the room.',
    category_id: 'cat-accessoires',
    material: 'chinchilla',
    price_amount: 4200,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Réservé aux professionnels. Conserver dans une housse en tissu naturel.',
    care_instructions_en: 'Professional furriers only. Store in a natural fabric garment bag.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Étole en Chinchilla | L'Hermine et le Vair",
    meta_title_en: "Chinchilla Stole | L'Hermine et le Vair",
    meta_description_fr: "Étole en chinchilla pour soirées d'exception. La légèreté et la douceur du chinchilla.",
    meta_description_en: 'Chinchilla stole for exceptional evenings. The lightness and softness of chinchilla.',
    images: [
      {
        id: 'img-sto-1',
        product_id: 'prod-chinchilla-stole',
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Étole en chinchilla',
        alt_text_en: 'Chinchilla stole',
        position: 1,
      },
    ],
    variants: [
      { id: 'var-sto-u', product_id: 'prod-chinchilla-stole', size: 'TU', sku: 'SKU-CHI-002-TU', stock_quantity: 5 },
    ],
  },
  {
    id: 'prod-cachemire-manteau',
    slug: 'manteau-cachemire-ivoire',
    slug_en: 'ivory-cashmere-coat',
    sku: 'SKU-CAS-001',
    name_fr: 'Manteau en Cachemire Ivoire',
    name_en: 'Ivory Cashmere Coat',
    description_fr: 'Cachemire gobi de première qualité, filé à la main en Mongolie, cousu dans notre atelier parisien. L’alternative irremplaçable pour celles qui préfèrent la pure fibre naturelle.',
    description_en: 'First-quality Gobi cashmere, hand-spun in Mongolia, sewn in our Parisian atelier. The irreplaceable alternative for those who prefer natural fibre.',
    category_id: 'cat-manteaux-cachemire',
    material: 'cachemire',
    price_amount: 3800,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Nettoyage à sec spécialisé ou lavage délicat à froid. Sécher à plat.',
    care_instructions_en: 'Specialized dry cleaning or gentle cold wash. Dry flat.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Manteau en Cachemire Ivoire | L'Hermine et le Vair",
    meta_title_en: "Ivory Cashmere Coat | L'Hermine et le Vair",
    meta_description_fr: 'Manteau en cachemire ivoire, première qualité, cousu à Paris. Élégance et chaleur naturelle.',
    meta_description_en: 'Ivory cashmere coat, first quality, sewn in Paris. Elegance and natural warmth.',
    images: [
      {
        id: 'img-cas-1',
        product_id: 'prod-cachemire-manteau',
        url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Manteau en cachemire ivoire',
        alt_text_en: 'Ivory cashmere coat',
        position: 1,
      },
    ],
    variants: [
      { id: 'var-cas-36', product_id: 'prod-cachemire-manteau', size: '36', sku: 'SKU-CAS-001-36', stock_quantity: 3 },
      { id: 'var-cas-38', product_id: 'prod-cachemire-manteau', size: '38', sku: 'SKU-CAS-001-38', stock_quantity: 4 },
      { id: 'var-cas-40', product_id: 'prod-cachemire-manteau', size: '40', sku: 'SKU-CAS-001-40', stock_quantity: 3 },
    ],
  },
  {
    id: 'prod-cachemire-echarpe',
    slug: 'echarpe-cachemire-beige',
    slug_en: 'beige-cashmere-scarf',
    sku: 'SKU-CAS-002',
    name_fr: 'Écharpe en Cachemire Beige',
    name_en: 'Beige Cashmere Scarf',
    description_fr: 'Cachemire ultra-doux, 4 fils, dans le beige le plus enveloppant. Le cadeau idéal pour une élégance au quotidien.',
    description_en: 'Ultra-soft 4-ply cashmere in the most enveloping beige. The ideal gift for everyday elegance.',
    category_id: 'cat-accessoires',
    material: 'cachemire',
    price_amount: 680,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Laver délicatement à la main à l’eau froide. Ne pas essorer en machine. Sécher à plat.',
    care_instructions_en: 'Gently hand wash in cold water. Do not machine spin. Dry flat.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Écharpe en Cachemire | L'Hermine et le Vair",
    meta_title_en: "Cashmere Scarf | L'Hermine et le Vair",
    meta_description_fr: 'Écharpe en cachemire 4 fils, ultra-douce. Cadeau de luxe idéal.',
    meta_description_en: 'Ultra-soft 4-ply cashmere scarf. The ideal luxury gift.',
    images: [
      {
        id: 'img-ech-1',
        product_id: 'prod-cachemire-echarpe',
        url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=85',
        alt_text_fr: 'Écharpe en cachemire beige 4 fils',
        alt_text_en: 'Beige 4-ply cashmere scarf',
        position: 1,
      },
    ],
    variants: [
      { id: 'var-ech-u', product_id: 'prod-cachemire-echarpe', size: 'TU', sku: 'SKU-CAS-002-TU', stock_quantity: 10 },
    ],
  },
];

import { createClient } from '@/lib/supabase/client';

// -------------------------------------------------------------
// QUERY FUNCTIONS
// -------------------------------------------------------------

export async function getCategories(): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('position', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Category[];
    }
  } catch {
    // Fallback to seed if connection unavailable
  }
  return SEED_CATEGORIES;
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .or(`slug.eq.${slug},slug_en.eq.${slug}`)
      .maybeSingle();

    if (!error && data) {
      return data as Category;
    }
  } catch {
    // Fallback to seed
  }
  return SEED_CATEGORIES.find((c) => c.slug === slug || c.slug_en === slug) || null;
}

export async function getSubCategories(parentId: string): Promise<Category[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_id', parentId)
      .order('position', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as Category[];
    }
  } catch {
    // Fallback to seed
  }
  return SEED_CATEGORIES.filter((c) => c.parent_id === parentId);
}

export interface ProductFilters {
  categorySlug?: string;
  subCategorySlug?: string;
  material?: string;
  size?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'best_selling';
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    const supabase = createClient();
    let query = supabase
      .from('products')
      .select('*, images:product_images(*), variants:product_variants(*)');

    if (filters?.material) {
      query = query.eq('material', filters.material.toLowerCase());
    }

    if (filters?.sortBy) {
      if (filters.sortBy === 'price_asc') {
        query = query.order('price_amount', { ascending: true });
      } else if (filters.sortBy === 'price_desc') {
        query = query.order('price_amount', { ascending: false });
      } else if (filters.sortBy === 'best_selling') {
        query = query.order('is_best_seller', { ascending: false });
      }
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      let filtered = data as unknown as Product[];

      if (filters?.subCategorySlug) {
        const subCat = await getCategoryBySlug(filters.subCategorySlug);
        if (subCat) {
          filtered = filtered.filter((p) => p.category_id === subCat.id);
        }
      } else if (filters?.categorySlug) {
        const parentCat = await getCategoryBySlug(filters.categorySlug);
        if (parentCat) {
          const subCats = await getSubCategories(parentCat.id);
          const allowedIds = [parentCat.id, ...subCats.map((s) => s.id)];
          filtered = filtered.filter(
            (p) => allowedIds.includes(p.category_id) || p.material === filters.categorySlug
          );
        }
      }

      if (filters?.size) {
        filtered = filtered.filter((p) => p.variants?.some((v) => v.size === filters.size));
      }

      return filtered;
    }
  } catch {
    // Fallback to static seed filtering
  }

  let products = [...SEED_PRODUCTS];

  if (filters?.subCategorySlug) {
    const subCat = await getCategoryBySlug(filters.subCategorySlug);
    if (subCat) {
      products = products.filter((p) => p.category_id === subCat.id);
    }
  } else if (filters?.categorySlug) {
    const parentCat = await getCategoryBySlug(filters.categorySlug);
    if (parentCat) {
      const subCats = await getSubCategories(parentCat.id);
      const allowedCategoryIds = [parentCat.id, ...subCats.map((s) => s.id)];
      products = products.filter(
        (p) => allowedCategoryIds.includes(p.category_id) || p.material === filters.categorySlug
      );
    }
  }

  if (filters?.material) {
    products = products.filter((p) => p.material.toLowerCase() === filters.material?.toLowerCase());
  }

  if (filters?.size) {
    products = products.filter((p) => p.variants.some((v) => v.size === filters.size));
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case 'price_asc':
        products.sort((a, b) => a.price_amount - b.price_amount);
        break;
      case 'price_desc':
        products.sort((a, b) => b.price_amount - a.price_amount);
        break;
      case 'best_selling':
        products.sort((a, b) => (b.is_best_seller ? 1 : 0) - (a.is_best_seller ? 1 : 0));
        break;
      default:
        break;
    }
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, images:product_images(*), variants:product_variants(*), category:categories(*)')
      .or(`slug.eq.${slug},slug_en.eq.${slug}`)
      .maybeSingle();

    if (!error && data) {
      return data as unknown as Product;
    }
  } catch {
    // Fallback to seed
  }

  const prod = SEED_PRODUCTS.find((p) => p.slug === slug || p.slug_en === slug);
  if (!prod) return null;

  const category = SEED_CATEGORIES.find((c) => c.id === prod.category_id);
  return { ...prod, category };
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string,
  material: string
): Promise<Product[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, images:product_images(*), variants:product_variants(*)')
      .neq('id', productId)
      .or(`category_id.eq.${categoryId},material.eq.${material}`)
      .limit(4);

    if (!error && data && data.length > 0) {
      return data as unknown as Product[];
    }
  } catch {
    // Fallback to seed
  }

  return SEED_PRODUCTS.filter(
    (p) => p.id !== productId && (p.category_id === categoryId || p.material === material)
  ).slice(0, 4);
}


export async function getAllProductPaths(): Promise<
  Array<{ category: string; subCategory: string; productSlug: string }>
> {
  const paths: Array<{ category: string; subCategory: string; productSlug: string }> = [];

  for (const prod of SEED_PRODUCTS) {
    const subCat = SEED_CATEGORIES.find((c) => c.id === prod.category_id);
    const parentCat = subCat?.parent_id
      ? SEED_CATEGORIES.find((c) => c.id === subCat.parent_id)
      : subCat;

    // French localized path
    paths.push({
      category: parentCat?.slug || 'manteaux',
      subCategory: subCat?.slug || 'manteaux-de-fourrure',
      productSlug: prod.slug,
    });

    // English localized path
    if (prod.slug_en) {
      paths.push({
        category: parentCat?.slug_en || parentCat?.slug || 'coats',
        subCategory: subCat?.slug_en || subCat?.slug || 'fur-coats',
        productSlug: prod.slug_en,
      });
    }
  }

  return paths;
}
