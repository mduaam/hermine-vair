const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read environment variables from .env.local
const envPath = path.resolve(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
  envContent
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing Supabase URL or Service Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// 2. Complete Test Products Specification across all 13 Categories
const products = [
  // -------------------------------------------------------------
  // 1. manteau-fourrure-femme (10000000-0000-0000-0000-000000000021)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000001',
    slug: 'manteau-vison-noir',
    slug_en: 'black-mink-coat',
    sku: 'SKU-VIS-001',
    name_fr: 'Manteau en Vison Noir Impérial',
    name_en: 'Imperial Black Mink Coat',
    description_fr: "Un manteau d’exception taillé dans le vison le plus soyeux, signé de la main de nos maîtres artisans parisiens. La doublure en soie ivoire révèle l’attention portée à chaque détail.",
    description_en: 'An exceptional coat cut from the finest silky mink, signed by our Parisian master artisans. The ivory silk lining reveals the attention paid to every detail.',
    category_id: '10000000-0000-0000-0000-000000000021',
    material: 'vison',
    price_amount: 8900.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Confier à un professionnel de la fourrure. Ne pas mouiller. Conserver dans une housse respirante.',
    care_instructions_en: 'Entrust to a professional furrier. Do not wet. Store in a breathable garment bag.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Manteau en Vison Noir | L’Hermine et le Vair",
    meta_title_en: "Black Mink Coat | L’Hermine et le Vair",
    meta_description_fr: "Manteau en vison noir d'exception, créé à la main dans notre atelier parisien. Doublure soie.",
    meta_description_en: 'Exceptional black mink coat, handcrafted in our Parisian atelier. Silk lining.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000001', size: '36', color: 'Noir Impérial', sku: 'SKU-VIS-001-36', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000002', size: '38', color: 'Noir Impérial', sku: 'SKU-VIS-001-38', stock_quantity: 3 },
      { id: '40000000-0000-0000-0000-000000000003', size: '40', color: 'Noir Impérial', sku: 'SKU-VIS-001-40', stock_quantity: 1 },
      { id: '40000000-0000-0000-0000-000000000004', size: '42', color: 'Noir Impérial', sku: 'SKU-VIS-001-42', stock_quantity: 1 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000001', url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Manteau en vison noir impérial face', alt_text_en: 'Imperial black mink coat front view', position: 1 },
      { id: '50000000-0000-0000-0000-000000000002', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Manteau en vison noir impérial profil', alt_text_en: 'Imperial black mink coat profile', position: 2 }
    ]
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    slug: 'manteau-vison-cognac',
    slug_en: 'cognac-mink-coat',
    sku: 'SKU-VIS-002',
    name_fr: 'Manteau en Vison Cognac',
    name_en: 'Cognac Mink Coat',
    description_fr: "La chaleur cuivrée du cognac rencontre la douceur incomparable du vison scandinave. Une pièce intemporelle pour les femmes qui cultivent l’élégance souveraine.",
    description_en: 'The copper warmth of cognac meets the incomparable softness of Scandinavian mink. A timeless piece for women who cultivate elegance.',
    category_id: '10000000-0000-0000-0000-000000000021',
    material: 'vison',
    price_amount: 9800.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Confier à un professionnel de la fourrure. Sécher naturellement si mouillé.',
    care_instructions_en: 'Entrust to a professional furrier. Dry naturally if wet.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Manteau en Vison Cognac | L’Hermine et le Vair",
    meta_title_en: "Cognac Mink Coat | L’Hermine et le Vair",
    meta_description_fr: "Manteau en vison cognac, teinte chaude et lumineuse. Artisanat d'exception parisien.",
    meta_description_en: 'Cognac mink coat in a warm and luminous hue. Exceptional Parisian craftsmanship.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000005', size: '36', color: 'Cognac', sku: 'SKU-VIS-002-36', stock_quantity: 1 },
      { id: '40000000-0000-0000-0000-000000000006', size: '38', color: 'Cognac', sku: 'SKU-VIS-002-38', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000007', size: '40', color: 'Cognac', sku: 'SKU-VIS-002-40', stock_quantity: 1 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000003', url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Manteau en vison cognac face', alt_text_en: 'Cognac mink coat front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000004', url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Manteau en vison cognac dos', alt_text_en: 'Cognac mink coat back', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 2. veste-fourrure-femme (10000000-0000-0000-0000-000000000022)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000005',
    slug: 'veste-chinchilla',
    slug_en: 'chinchilla-jacket',
    sku: 'SKU-CHI-001',
    name_fr: 'Veste en Chinchilla Impérial',
    name_en: 'Imperial Chinchilla Jacket',
    description_fr: "La fourrure la plus soyeuse et précieuse au monde, tissée en veste structurée. La légèreté du chinchilla est incomparable ; chaque pièce est unique.",
    description_en: 'The world’s most precious fur, woven into a structured jacket. The lightness of chinchilla is incomparable; each piece is unique.',
    category_id: '10000000-0000-0000-0000-000000000022',
    material: 'chinchilla',
    price_amount: 12500.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Réservé aux professionnels de la fourrure uniquement. Extrêmement délicat.',
    care_instructions_en: 'Professional furriers only. Extremely delicate.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Veste en Chinchilla | L’Hermine et le Vair",
    meta_title_en: "Chinchilla Jacket | L’Hermine et le Vair",
    meta_description_fr: "Veste en chinchilla, la fourrure la plus rare et précieuse. Artisanat d'art, Paris.",
    meta_description_en: 'Chinchilla jacket, the rarest and most precious fur. High craftsmanship, Paris.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000012', size: '36', color: 'Gris Ombré', sku: 'SKU-CHI-001-36', stock_quantity: 1 },
      { id: '40000000-0000-0000-0000-000000000013', size: '38', color: 'Gris Ombré', sku: 'SKU-CHI-001-38', stock_quantity: 1 },
      { id: '40000000-0000-0000-0000-000000000014', size: '40', color: 'Gris Ombré', sku: 'SKU-CHI-001-40', stock_quantity: 1 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000009', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Veste en chinchilla impérial face', alt_text_en: 'Imperial chinchilla jacket front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000010', url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Veste en chinchilla impérial détail', alt_text_en: 'Imperial chinchilla jacket detail', position: 2 }
    ]
  },
  {
    id: '30000000-0000-0000-0000-000000000022',
    slug: 'veste-renard-dore',
    slug_en: 'golden-fox-jacket',
    sku: 'SKU-REN-003',
    name_fr: 'Veste Cintrée en Renard Doré',
    name_en: 'Tailored Golden Fox Jacket',
    description_fr: "Coupe cintrée contemporaine taillée dans un somptueux renard doré aux reflets ambrés. Col tailleur montant et finitions cuir nappa.",
    description_en: 'Contemporary tailored cut in sumptuous golden fox with amber highlights. Stand collar and nappa leather detailing.',
    category_id: '10000000-0000-0000-0000-000000000022',
    material: 'renard',
    price_amount: 6800.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Nettoyage chez un maître fourreur agréé. Conserver sur cintre large.',
    care_instructions_en: 'Specialist cleaning by an authorized master furrier. Store on a broad hanger.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Veste en Renard Doré | L’Hermine et le Vair",
    meta_title_en: "Golden Fox Jacket | L’Hermine et le Vair",
    meta_description_fr: "Veste haute couture en renard doré cintrée. Nuances ambrées et finitions nappa.",
    meta_description_en: 'Tailored golden fox couture jacket. Amber hues with refined nappa accents.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000022', size: '36', color: 'Or Ambré', sku: 'SKU-REN-003-36', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000023', size: '38', color: 'Or Ambré', sku: 'SKU-REN-003-38', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000024', size: '40', color: 'Or Ambré', sku: 'SKU-REN-003-40', stock_quantity: 1 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000022', url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Veste cintrée en renard doré face', alt_text_en: 'Tailored golden fox jacket front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000023', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Veste cintrée en renard doré dos', alt_text_en: 'Tailored golden fox jacket back', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 3. gilet-fourrure-femme (10000000-0000-0000-0000-000000000023)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000003',
    slug: 'gilet-renard-platine',
    slug_en: 'platinum-fox-vest',
    sku: 'SKU-REN-001',
    name_fr: 'Gilet en Renard Platine',
    name_en: 'Platinum Fox Vest',
    description_fr: "La légèreté du renard platine sublimée en gilet couture. Porté seul sur un chemisier en soie ou sous un manteau d’apparat, cette pièce métamorphose toute silhouette.",
    description_en: 'The lightness of platinum fox sublimated in a vest. Worn alone over a silk blouse or under a coat, this piece transforms any outfit.',
    category_id: '10000000-0000-0000-0000-000000000023',
    material: 'renard',
    price_amount: 4800.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Confier à un professionnel de la fourrure. Éviter l’humidité prolongée.',
    care_instructions_en: 'Entrust to a professional furrier. Avoid prolonged moisture.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Gilet en Renard Platine | L’Hermine et le Vair",
    meta_title_en: "Platinum Fox Vest | L’Hermine et le Vair",
    meta_description_fr: "Gilet en renard platine, pièce intemporelle de la maison L’Hermine et le Vair.",
    meta_description_en: 'Platinum fox fur vest, a timeless piece by L’Hermine et le Vair.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000008', size: '36', color: 'Platine', sku: 'SKU-REN-001-36', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000009', size: '38', color: 'Platine', sku: 'SKU-REN-001-38', stock_quantity: 3 },
      { id: '40000000-0000-0000-0000-000000000010', size: '40', color: 'Platine', sku: 'SKU-REN-001-40', stock_quantity: 1 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000005', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Gilet en renard platine face', alt_text_en: 'Platinum fox vest front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000006', url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Gilet en renard platine détail', alt_text_en: 'Platinum fox vest detail', position: 2 }
    ]
  },
  {
    id: '30000000-0000-0000-0000-000000000023',
    slug: 'gilet-vison-saphir',
    slug_en: 'sapphire-mink-vest',
    sku: 'SKU-VIS-003',
    name_fr: 'Gilet Long en Vison Saphir',
    name_en: 'Sapphire Mink Long Vest',
    description_fr: "Gilet sans manches long en vison bleu saphir d’élevage scandinave certifié. Coupe droite architecturale rehaussée de poches dissimulées.",
    description_en: 'Sleeveless long vest in certified Scandinavian sapphire blue mink. Architectural straight cut with concealed pockets.',
    category_id: '10000000-0000-0000-0000-000000000023',
    material: 'vison',
    price_amount: 5200.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: "Nettoyage professionnel de la fourrure uniquement. Aérer à l'ombre.",
    care_instructions_en: 'Professional fur clean only. Air dry in the shade.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Gilet Long en Vison Saphir | L’Hermine et le Vair",
    meta_title_en: "Sapphire Mink Long Vest | L’Hermine et le Vair",
    meta_description_fr: "Gilet long en vison saphir scandinave. Allure architecturale et pureté des lignes.",
    meta_description_en: 'Long vest in Scandinavian sapphire mink. Architectural lines and quiet luxury.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000025', size: '36', color: 'Bleu Saphir', sku: 'SKU-VIS-003-36', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000026', size: '38', color: 'Bleu Saphir', sku: 'SKU-VIS-003-38', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000027', size: '40', color: 'Bleu Saphir', sku: 'SKU-VIS-003-40', stock_quantity: 1 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000024', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Gilet long en vison saphir face', alt_text_en: 'Sapphire mink long vest front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000025', url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Gilet long en vison saphir profil', alt_text_en: 'Sapphire mink long vest profile', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 4. doudoune-fourrure-femme (10000000-0000-0000-0000-000000000024)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000024',
    slug: 'doudoune-duvet-vison',
    slug_en: 'mink-trimmed-down-jacket',
    sku: 'SKU-DOU-001',
    name_fr: 'Doudoune Soie & Vison Impérial',
    name_en: 'Silk & Imperial Mink Down Jacket',
    description_fr: "Doudoune matelassée en faille de soie hydrofuge, garnie de duvet d'oie blanc immaculé et couronnée d'un col châle amovible en vison impérial.",
    description_en: 'Water-repellent silk faille quilted down jacket, padded with pure white goose down and finished with a detachable imperial mink shawl collar.',
    category_id: '10000000-0000-0000-0000-000000000024',
    material: 'vison',
    price_amount: 6400.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Détacher le col fourrure avant tout entretien textile spécialisé.',
    care_instructions_en: 'Detach fur collar prior to specialized textile dry cleaning.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Doudoune Soie & Vison | L’Hermine et le Vair",
    meta_title_en: "Silk & Mink Down Jacket | L’Hermine et le Vair",
    meta_description_fr: "Doudoune en faille de soie et col vison amovible. Duvet blanc et élégance hivernale.",
    meta_description_en: 'Water-repellent silk down jacket with detachable mink collar. Pure winter luxury.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000028', size: '36', color: 'Blanc Perle', sku: 'SKU-DOU-001-36', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000029', size: '38', color: 'Blanc Perle', sku: 'SKU-DOU-001-38', stock_quantity: 3 },
      { id: '40000000-0000-0000-0000-000000000030', size: '40', color: 'Blanc Perle', sku: 'SKU-DOU-001-40', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000031', size: '42', color: 'Blanc Perle', sku: 'SKU-DOU-001-42', stock_quantity: 1 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000026', url: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Doudoune soie et vison blanc perle', alt_text_en: 'Silk and mink down jacket pearl white', position: 1 },
      { id: '50000000-0000-0000-0000-000000000027', url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Doudoune col vison détail matelassage', alt_text_en: 'Mink collar down jacket quilting detail', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 5. parka-fourrure-femme (10000000-0000-0000-0000-000000000025)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000025',
    slug: 'parka-grand-froid-renard',
    slug_en: 'fox-lined-winter-parka',
    sku: 'SKU-PAR-001',
    name_fr: 'Parka Grand Froid Doublée Renard',
    name_en: 'Sub-Zero Fox-Lined Parka',
    description_fr: "Parka technique en gabardine de coton enduite imperméable, entièrement doublée d'une fourrure de renard argenté amovible. Conçue pour affronter les hivers les plus rigoureux avec panache.",
    description_en: 'Technical weatherproof coated cotton gabardine parka, fully lined with detachable silver fox fur. Engineered for severe winter climates with absolute elegance.',
    category_id: '10000000-0000-0000-0000-000000000025',
    material: 'renard',
    price_amount: 7200.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Nettoyage à sec spécialisé. Retirer la doublure en fourrure avant entretien.',
    care_instructions_en: 'Specialist dry clean. Remove fur lining before garment care.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Parka Doublée Renard Argenté | L’Hermine et le Vair",
    meta_title_en: "Fox-Lined Winter Parka | L’Hermine et le Vair",
    meta_description_fr: "Parka grand froid doublée en renard argenté. Gabardine technique imperméable.",
    meta_description_en: 'Weatherproof technical parka lined with detachable silver fox fur. Alpine luxury.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000032', size: '36', color: 'Kaki & Renard Naturel', sku: 'SKU-PAR-001-36', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000033', size: '38', color: 'Kaki & Renard Naturel', sku: 'SKU-PAR-001-38', stock_quantity: 3 },
      { id: '40000000-0000-0000-0000-000000000034', size: '40', color: 'Kaki & Renard Naturel', sku: 'SKU-PAR-001-40', stock_quantity: 2 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000028', url: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Parka grand froid doublée renard vue face', alt_text_en: 'Fox-lined winter parka front view', position: 1 },
      { id: '50000000-0000-0000-0000-000000000029', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Capuche fourrure renard parka détail', alt_text_en: 'Parka fox fur hood detail', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 6. blouson-fourrure-femme (10000000-0000-0000-0000-000000000026)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000026',
    slug: 'blouson-court-vison-noir',
    slug_en: 'cropped-black-mink-bomber',
    sku: 'SKU-BLO-001',
    name_fr: 'Blouson Bomber en Vison Noir',
    name_en: 'Cropped Black Mink Bomber Jacket',
    description_fr: "Réinterprétation haute couture du bomber : vison rasé noir mat rehaussé de bord-côtes en cachemire tricoté main et zip double curseur en laiton doré.",
    description_en: 'Haute couture bomber reinterpretation: sheared black mink complemented by hand-knit cashmere ribbing and double gold-finish brass zip.',
    category_id: '10000000-0000-0000-0000-000000000026',
    material: 'vison',
    price_amount: 8200.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Confier exclusivement à un spécialiste fourrure. Ne pas repasser.',
    care_instructions_en: 'Entrust exclusively to a fur specialist. Do not iron.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Blouson Bomber en Vison Noir | L’Hermine et le Vair",
    meta_title_en: "Cropped Black Mink Bomber | L’Hermine et le Vair",
    meta_description_fr: "Bomber de luxe en vison rasé noir et cachemire tricoté main. Zip or brossé.",
    meta_description_en: 'Luxury sheared black mink bomber with hand-knit cashmere trim. Brushed gold zip.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000035', size: '36', color: 'Noir Ébène', sku: 'SKU-BLO-001-36', stock_quantity: 1 },
      { id: '40000000-0000-0000-0000-000000000036', size: '38', color: 'Noir Ébène', sku: 'SKU-BLO-001-38', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000037', size: '40', color: 'Noir Ébène', sku: 'SKU-BLO-001-40', stock_quantity: 1 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000030', url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Blouson bomber en vison noir face', alt_text_en: 'Black mink bomber jacket front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000031', url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Blouson bomber en vison noir porté', alt_text_en: 'Black mink bomber jacket styling', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 7. bolero-en-fourrure (10000000-0000-0000-0000-000000000027)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000006',
    slug: 'etole-chinchilla',
    slug_en: 'chinchilla-stole',
    sku: 'SKU-CHI-002',
    name_fr: 'Étole d’Apparat en Chinchilla',
    name_en: 'Chinchilla Evening Stole',
    description_fr: "Une étole en chinchilla pour illuminer une tenue de gala. Posée sur les épaules, elle incarne le sommet du raffinement.",
    description_en: 'A chinchilla stole to transform an evening outfit into a work of art. Gently draped over the shoulders.',
    category_id: '10000000-0000-0000-0000-000000000027',
    material: 'chinchilla',
    price_amount: 4200.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Réservé aux professionnels. Conserver dans une housse en tissu naturel.',
    care_instructions_en: 'Professional furriers only. Store in a natural fabric garment bag.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Étole en Chinchilla | L’Hermine et le Vair",
    meta_title_en: "Chinchilla Stole | L’Hermine et le Vair",
    meta_description_fr: "Étole en chinchilla pour soirées d’exception. Douceur souveraine.",
    meta_description_en: 'Chinchilla stole for exceptional evenings.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000015', size: 'TU', color: 'Gris Ombré', sku: 'SKU-CHI-002-TU', stock_quantity: 4 }
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000011', url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Étole en chinchilla d’apparat', alt_text_en: 'Chinchilla evening stole drape', position: 1 },
      { id: '50000000-0000-0000-0000-000000000012', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Étole en chinchilla portée', alt_text_en: 'Chinchilla stole worn', position: 2 }
    ]
  },
  {
    id: '30000000-0000-0000-0000-000000000027',
    slug: 'bolero-fourrure-vison-ivoire',
    slug_en: 'ivory-mink-bolero',
    sku: 'SKU-BOL-001',
    name_fr: 'Boléro en Vison Blanc Pur',
    name_en: 'Pure White Mink Bolero',
    description_fr: "Boléro court pour robe de mariée ou de soirée, façonné en vison blanc immaculé. Manches trois-quarts et fermeture aimantée invisible.",
    description_en: 'Cropped bolero for bridal or evening gowns, crafted in pure white mink. Three-quarter sleeves and invisible magnetic closure.',
    category_id: '10000000-0000-0000-0000-000000000027',
    material: 'vison',
    price_amount: 5400.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: "Conserver à l'abri de la lumière naturelle. Nettoyage professionnel spécialisé.",
    care_instructions_en: 'Store away from natural light. Specialist professional cleaning only.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Boléro en Vison Blanc Pur | L’Hermine et le Vair",
    meta_title_en: "Pure White Mink Bolero | L’Hermine et le Vair",
    meta_description_fr: "Boléro en vison blanc pur pour mariée et soirées d'apparat. Manches trois-quarts.",
    meta_description_en: 'Pure white mink bridal and evening bolero. Three-quarter sleeves, magnetic clasp.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000038', size: '36', color: 'Blanc Pur', sku: 'SKU-BOL-001-36', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000039', size: '38', color: 'Blanc Pur', sku: 'SKU-BOL-001-38', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000040', size: '40', color: 'Blanc Pur', sku: 'SKU-BOL-001-40', stock_quantity: 1 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000032', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Boléro en vison blanc pur face', alt_text_en: 'Pure white mink bolero front view', position: 1 },
      { id: '50000000-0000-0000-0000-000000000033', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Boléro en vison blanc pur détail dos', alt_text_en: 'Pure white mink bolero back detail', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 8. cape-fourrure-femme (10000000-0000-0000-0000-000000000028)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000004',
    slug: 'cape-renard-blanc',
    slug_en: 'white-fox-cape',
    sku: 'SKU-REN-002',
    name_fr: 'Cape en Renard Blanc Boréal',
    name_en: 'Boreal White Fox Cape',
    description_fr: "La blancheur immaculée du renard arctique, sculptée en cape fluide. Une déclaration de majesté pour les grandes réceptions.",
    description_en: 'The immaculate whiteness of Arctic fox, sculpted into a fluid cape. A declaration of elegance for special occasions.',
    category_id: '10000000-0000-0000-0000-000000000028',
    material: 'renard',
    price_amount: 5600.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Confier à un professionnel de la fourrure. Conserver sur cintre rembourré.',
    care_instructions_en: 'Entrust to a professional furrier. Never fold — store on a padded hanger.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Cape en Renard Blanc | L’Hermine et le Vair",
    meta_title_en: "White Fox Cape | L’Hermine et le Vair",
    meta_description_fr: "Cape en renard blanc arctique, élégance pure pour les grandes occasions.",
    meta_description_en: 'White Arctic fox cape, pure elegance for special occasions.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000011', size: 'TU', color: 'Blanc Boréal', sku: 'SKU-REN-002-TU', stock_quantity: 3 }
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000007', url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Cape en renard blanc boréal face', alt_text_en: 'White fox cape front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000008', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Cape en renard blanc tombé', alt_text_en: 'White fox cape drape', position: 2 }
    ]
  },
  {
    id: '30000000-0000-0000-0000-000000000028',
    slug: 'cape-cachemire-chinchilla-royale',
    slug_en: 'royal-cashmere-chinchilla-cape',
    sku: 'SKU-CAP-001',
    name_fr: 'Cape Cachemire & Col Chinchilla',
    name_en: 'Royal Cashmere & Chinchilla Cape',
    description_fr: "Drap de cachemire double-face noir impérial bordé d’un opulent col en chinchilla. L’accord suprême de la légèreté et de la volupté.",
    description_en: 'Double-faced imperial black cashmere fabric edged with an opulent chinchilla collar. The supreme harmony of lightness and warmth.',
    category_id: '10000000-0000-0000-0000-000000000028',
    material: 'cachemire',
    price_amount: 7900.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Nettoyage chez un spécialiste haute fourrure uniquement.',
    care_instructions_en: 'Cleaning by a high fur specialist exclusively.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Cape Cachemire & Col Chinchilla | L’Hermine et le Vair",
    meta_title_en: "Royal Cashmere & Chinchilla Cape | L’Hermine et le Vair",
    meta_description_fr: "Cape en drap de cachemire noir et col chinchilla impérial. Tombé majestueux.",
    meta_description_en: 'Black cashmere cape with imperial chinchilla collar. Majestic drape and feel.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000041', size: 'TU', color: 'Noir & Chinchilla', sku: 'SKU-CAP-001-TU', stock_quantity: 2 }
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000034', url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Cape cachemire col chinchilla impérial', alt_text_en: 'Royal cashmere chinchilla cape front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000035', url: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Cape cachemire col chinchilla détail col', alt_text_en: 'Cashmere chinchilla cape collar detail', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 9. chapeau-fourrure-femme (10000000-0000-0000-0000-000000000031)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000031',
    slug: 'chapeau-cloche-vison-noir',
    slug_en: 'black-mink-cloche-hat',
    sku: 'SKU-ACC-001',
    name_fr: 'Chapeau Cloche en Vison Noir',
    name_en: 'Black Mink Cloche Hat',
    description_fr: "Inspiré des années folles, ce chapeau cloche en vison rasé noir sublime le port de tête. Doublure soie satinée et ruban gros-grain discret.",
    description_en: 'Inspired by the Roaring Twenties, this sheared black mink cloche hat elevates any silhouette. Satin silk lining and subtle grosgrain band.',
    category_id: '10000000-0000-0000-0000-000000000031',
    material: 'vison',
    price_amount: 1450.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: "Conserver dans sa boîte à chapeau d'origine avec forme adaptée.",
    care_instructions_en: 'Store in its original hatbox with proper shaping support.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Chapeau Cloche en Vison Noir | L’Hermine et le Vair",
    meta_title_en: "Black Mink Cloche Hat | L’Hermine et le Vair",
    meta_description_fr: "Chapeau cloche en vison noir rasé et doublure soie. Élégance intemporelle.",
    meta_description_en: 'Sheared black mink cloche hat with satin silk lining. Timeless Parisian style.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000042', size: '56', color: 'Noir', sku: 'SKU-ACC-001-56', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000043', size: '58', color: 'Noir', sku: 'SKU-ACC-001-58', stock_quantity: 3 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000036', url: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Chapeau cloche en vison noir', alt_text_en: 'Black mink cloche hat front view', position: 1 },
      { id: '50000000-0000-0000-0000-000000000037', url: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Chapeau cloche en vison porté', alt_text_en: 'Black mink cloche hat styled', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 10. toque-fourrure-femme (10000000-0000-0000-0000-000000000032)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000032',
    slug: 'toque-imperiale-vison-noir',
    slug_en: 'imperial-black-mink-toque',
    sku: 'SKU-ACC-002',
    name_fr: 'Toque Impériale en Vison Noir',
    name_en: 'Imperial Black Mink Toque',
    description_fr: "Toque cylindrique majestueuse en vison d'élevage sélectionné. Doublée de soie matelassée pour une isolation thermique parfaite et un maintien impérial.",
    description_en: 'Stately cylindrical toque in premium selected mink. Quilted silk lining for superior thermal comfort and regal presence.',
    category_id: '10000000-0000-0000-0000-000000000032',
    material: 'vison',
    price_amount: 1850.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: 'Brosser délicatement dans le sens du poil avec une brosse en poils naturels.',
    care_instructions_en: 'Brush gently along the fur grain with a natural bristle brush.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Toque Impériale en Vison Noir | L’Hermine et le Vair",
    meta_title_en: "Imperial Black Mink Toque | L’Hermine et le Vair",
    meta_description_fr: "Toque impériale en vison noir d'exception doublée soie matelassée.",
    meta_description_en: 'Imperial black mink toque with quilted silk lining. Regal winter headwear.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000044', size: '56', color: 'Noir Impérial', sku: 'SKU-ACC-002-56', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000045', size: '58', color: 'Noir Impérial', sku: 'SKU-ACC-002-58', stock_quantity: 2 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000038', url: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Toque impériale en vison noir', alt_text_en: 'Imperial black mink toque front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000039', url: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Toque impériale en vison noir portée', alt_text_en: 'Imperial black mink toque worn', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 11. bandeau-en-fourrure (10000000-0000-0000-0000-000000000033)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000033',
    slug: 'bandeau-fourrure-renard-argente',
    slug_en: 'silver-fox-fur-headband',
    sku: 'SKU-ACC-003',
    name_fr: 'Bandeau en Renard Argenté',
    name_en: 'Silver Fox Fur Headband',
    description_fr: "Bandeau d'hiver luxueux en renard argenté aux longues soies chatoyantes. Élastique ajustable dissimulé sous un ruban de velours de soie noir.",
    description_en: 'Luxurious winter headband in silver fox with shimmering long guard hairs. Adjustable stretch band concealed under black silk velvet.',
    category_id: '10000000-0000-0000-0000-000000000033',
    material: 'renard',
    price_amount: 950.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Secouer doucement pour regonfler le poil après usage. Éviter la pluie.',
    care_instructions_en: 'Shake gently to fluff fur after wear. Avoid rain and heavy humidity.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Bandeau en Renard Argenté | L’Hermine et le Vair",
    meta_title_en: "Silver Fox Fur Headband | L’Hermine et le Vair",
    meta_description_fr: "Bandeau de luxe en renard argenté et velours de soie. Confort alpin raffiné.",
    meta_description_en: 'Luxury silver fox and silk velvet headband. Alpine chic and warmth.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000046', size: 'TU', color: 'Argenté Naturel', sku: 'SKU-ACC-003-TU', stock_quantity: 5 }
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000040', url: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Bandeau en renard argenté', alt_text_en: 'Silver fox fur headband', position: 1 },
      { id: '50000000-0000-0000-0000-000000000041', url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Bandeau en renard argenté porté', alt_text_en: 'Silver fox fur headband styled', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 12. bonnet-fourrure-femme (10000000-0000-0000-0000-000000000034)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000034',
    slug: 'bonnet-cachemire-pompon-renard',
    slug_en: 'cashmere-beanie-fox-pompon',
    sku: 'SKU-ACC-004',
    name_fr: 'Bonnet Cachemire & Pompon Renard',
    name_en: 'Cashmere Beanie with Fox Pompon',
    description_fr: "Tricoté en côte anglaise dans un pur cachemire 4 fils ultra-doux, ce bonnet d'hiver est surmonté d'un généreux pompon amovible en renard arctique blanc.",
    description_en: 'Rib-knitted in ultra-soft 4-ply pure cashmere, this winter beanie is crowned with a generous detachable Arctic white fox pompon.',
    category_id: '10000000-0000-0000-0000-000000000034',
    material: 'cachemire',
    price_amount: 580.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: true,
    care_instructions_fr: "Détacher le pompon avant lavage du bonnet à la main à l'eau froide.",
    care_instructions_en: 'Detach the pompon before washing the cashmere beanie by hand in cold water.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Bonnet Cachemire & Pompon Renard | L’Hermine et le Vair",
    meta_title_en: "Cashmere Beanie & Fox Pompon | L’Hermine et le Vair",
    meta_description_fr: "Bonnet en pur cachemire 4 fils avec pompon amovible en renard arctique.",
    meta_description_en: 'Pure 4-ply cashmere beanie with detachable Arctic fox pompon.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000047', size: 'TU', color: 'Blanc Écru', sku: 'SKU-ACC-004-TU', stock_quantity: 6 }
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000042', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Bonnet cachemire et pompon renard blanc', alt_text_en: 'Cashmere beanie with white fox pompon', position: 1 },
      { id: '50000000-0000-0000-0000-000000000043', url: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Bonnet cachemire pompon détail maille', alt_text_en: 'Cashmere beanie knitwear detail', position: 2 }
    ]
  },

  // -------------------------------------------------------------
  // 13. chapka-fourrure-femme (10000000-0000-0000-0000-000000000035)
  // -------------------------------------------------------------
  {
    id: '30000000-0000-0000-0000-000000000035',
    slug: 'chapka-vison-cuir-noir',
    slug_en: 'mink-and-leather-ushanka',
    sku: 'SKU-ACC-005',
    name_fr: 'Chapka d’Exception Vison & Nappa',
    name_en: 'Exceptional Mink & Nappa Ushanka',
    description_fr: "Chapka traditionnelle réinventée en cuir d'agneau plongé nappa souple et vison noir impérial. Rabats modulables attachables par brides en cuir à boucle dorée.",
    description_en: 'Traditional ushanka reinvented in supple plunged nappa lambskin and imperial black mink. Modular ear flaps with gold-buckled leather straps.',
    category_id: '10000000-0000-0000-0000-000000000035',
    material: 'vison',
    price_amount: 2400.00,
    price_currency: 'EUR',
    status: 'active',
    is_best_seller: false,
    care_instructions_fr: 'Entretien cuir et fourrure chez un artisan spécialiste uniquement.',
    care_instructions_en: 'Leather and fur care by a specialist artisan exclusively.',
    origin_atelier: 'Atelier Paris',
    meta_title_fr: "Chapka Vison & Cuir Nappa | L’Hermine et le Vair",
    meta_title_en: "Mink & Nappa Ushanka | L’Hermine et le Vair",
    meta_description_fr: "Chapka d'exception en vison noir et agneau plongé nappa. Brides boucle or.",
    meta_description_en: 'Exceptional ushanka in black mink and plunged nappa leather. Gold buckle straps.',
    variants: [
      { id: '40000000-0000-0000-0000-000000000048', size: '56', color: 'Noir & Cuir Noir', sku: 'SKU-ACC-005-56', stock_quantity: 2 },
      { id: '40000000-0000-0000-0000-000000000049', size: '58', color: 'Noir & Cuir Noir', sku: 'SKU-ACC-005-58', stock_quantity: 2 },
    ],
    images: [
      { id: '50000000-0000-0000-0000-000000000044', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Chapka d’exception vison et cuir noir', alt_text_en: 'Exceptional mink and leather ushanka front', position: 1 },
      { id: '50000000-0000-0000-0000-000000000045', url: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?q=80&w=1200&auto=format&fit=crop', alt_text_fr: 'Chapka vison et cuir rabats relevés', alt_text_en: 'Mink ushanka with flaps fastened up', position: 2 }
    ]
  }
];

async function seed() {
  console.log(`Starting seed of ${products.length} products across all 13 categories...`);

  for (const prod of products) {
    const { variants, images, ...productData } = prod;

    // 1. Upsert product
    const { error: prodErr } = await supabase
      .from('products')
      .upsert(productData, { onConflict: 'id' });

    if (prodErr) {
      console.error(`Error upserting product ${productData.slug}:`, prodErr);
      process.exit(1);
    }
    console.log(`✓ Product upserted: ${productData.name_fr} (${productData.slug})`);

    // 2. Upsert variants
    if (variants && variants.length > 0) {
      const variantRows = variants.map((v) => ({
        ...v,
        product_id: productData.id,
      }));

      const { error: varErr } = await supabase
        .from('product_variants')
        .upsert(variantRows, { onConflict: 'id' });

      if (varErr) {
        console.error(`Error upserting variants for ${productData.slug}:`, varErr);
        process.exit(1);
      }
      console.log(`  ✓ ${variants.length} variants upserted for ${productData.slug}`);
    }

    // 3. Upsert images
    if (images && images.length > 0) {
      const imageRows = images.map((img) => ({
        ...img,
        product_id: productData.id,
      }));

      const { error: imgErr } = await supabase
        .from('product_images')
        .upsert(imageRows, { onConflict: 'id' });

      if (imgErr) {
        console.error(`Error upserting images for ${productData.slug}:`, imgErr);
        process.exit(1);
      }
      console.log(`  ✓ ${images.length} images upserted for ${productData.slug}`);
    }
  }

  console.log('\n--- SUCCESS: All 17 products, variants and images seeded to live Supabase! ---');
}

seed().catch((err) => {
  console.error('Fatal seed error:', err);
  process.exit(1);
});
