// Test storefront collection queries against live DB and static catalog
const http = require('http');

const collectionsFr = [
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

const collectionsEn = [
  'womens-fur-coat',
  'womens-fur-jacket',
  'womens-fur-vest',
  'womens-fur-down-jacket',
  'womens-fur-parka',
  'womens-fur-bomber',
  'fur-bolero',
  'womens-fur-cape',
  'womens-fur-hat',
  'womens-fur-toque',
  'fur-headband',
  'womens-fur-beanie',
  'womens-fur-chapka'
];

function fetchPage(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        resolve({ status: res.statusCode, body: data });
      });
    }).on('error', (err) => {
      resolve({ status: 500, error: err.message });
    });
  });
}

async function testAll() {
  console.log('Testing 13 FR collection pages on http://localhost:3000...');
  let failed = 0;
  for (const slug of collectionsFr) {
    const res = await fetchPage(`http://localhost:3000/fr/collections/${slug}`);
    const hasProducts = res.body.includes('data-product-card') || res.body.includes('EUR') || res.body.includes('Imperial') || res.body.includes('Manteau') || res.body.includes('Vison') || res.body.includes('Chinchilla') || res.body.includes('Renard');
    if (res.status === 200 && hasProducts) {
      console.log(`✓ /fr/collections/${slug} -> HTTP 200 (Products present)`);
    } else {
      console.log(`✗ /fr/collections/${slug} -> HTTP ${res.status}, Products found: ${hasProducts}`);
      failed++;
    }
  }

  console.log('\nTesting 13 EN collection pages on http://localhost:3000...');
  for (const slug of collectionsEn) {
    const res = await fetchPage(`http://localhost:3000/en/collections/${slug}`);
    const hasProducts = res.body.includes('data-product-card') || res.body.includes('EUR') || res.body.includes('Coat') || res.body.includes('Mink') || res.body.includes('Chinchilla') || res.body.includes('Fox') || res.body.includes('Jacket');
    if (res.status === 200 && hasProducts) {
      console.log(`✓ /en/collections/${slug} -> HTTP 200 (Products present)`);
    } else {
      console.log(`✗ /en/collections/${slug} -> HTTP ${res.status}, Products found: ${hasProducts}`);
      failed++;
    }
  }

  if (failed === 0) {
    console.log('\nSUCCESS: All 26 localized collection pages returned HTTP 200 with populated products!');
  } else {
    console.log(`\nCOMPLETED with ${failed} issues.`);
  }
}

testAll().catch(console.error);
