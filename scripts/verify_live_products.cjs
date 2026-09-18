const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf-8')
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => {
      const idx = l.indexOf('=');
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data: cats, error: catErr } = await supabase.from('categories').select('id, slug, name_fr');
  if (catErr) {
    console.error('Error fetching categories:', catErr);
    return;
  }
  const { data: prods, error: prodErr } = await supabase.from('products').select('id, slug, name_fr, category_id');
  if (prodErr) {
    console.error('Error fetching products:', prodErr);
    return;
  }

  console.log('Total categories in Supabase:', cats.length);
  console.log('Total products in live Supabase:', prods.length);

  const targetSlugs = [
    'manteau-fourrure-femme',
    'veste-fourrure-femme',
    'gilet-fourrure-femme',
    'doudoune-fourrure-femme',
    'parka-fourrure-femme',
    'blouson-fourrure-femme',
    'bolero-en-fourrure',
    'cape-fourrure-femme',
    'chapeau-fourrure-femme',
    'toque-fourrure-femme',
    'bandeau-en-fourrure',
    'bonnet-fourrure-femme',
    'chapka-fourrure-femme'
  ];

  console.log('\n--- Status per Category ---');
  for (const slug of targetSlugs) {
    const cat = cats.find((c) => c.slug === slug);
    if (!cat) {
      console.log(`[MISSING CATEGORY] ${slug}`);
      continue;
    }
    const matching = prods.filter((p) => p.category_id === cat.id);
    console.log(`[${matching.length} products] ${slug} -> ${matching.map(p => p.name_fr).join(', ')}`);
  }
}

test().catch(console.error);
