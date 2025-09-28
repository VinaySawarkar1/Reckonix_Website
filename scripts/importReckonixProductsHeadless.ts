import { chromium } from 'playwright';
import { getDb } from '../server/mongo.js';

const baseUrl = 'https://www.reckonix.in';

async function fetchProductLinks(page) {
  const productLinks = [];
  try {
    await page.goto(baseUrl + '/products', { waitUntil: 'networkidle' });

    // Adjust selector based on actual product link elements
    const links = await page.$$eval('a', anchors =>
      anchors
        .map(a => a.href)
        .filter(href => href.includes('/product/'))
    );

    productLinks.push(...links);
  } catch (error) {
    console.error('Error fetching product links:', error);
  }
  return productLinks;
}

async function fetchProductDetails(page, url) {
  try {
    await page.goto(url, { waitUntil: 'networkidle' });

    // Extract product details - adjust selectors as per actual page structure
    const name = await page.$eval('h1', el => el.textContent.trim());
    const category = await page.$$eval('a', (anchors) => {
      const cat = anchors.find(a => a.textContent.toLowerCase().includes('category'));
      return cat ? cat.textContent.trim() : '';
    });
    const subcategory = await page.$$eval('a', (anchors) => {
      const subcat = anchors.find(a => a.textContent.toLowerCase().includes('subcategory'));
      return subcat ? subcat.textContent.trim() : '';
    });
    const shortDescription = await page.$eval('p', el => el.textContent.trim()).catch(() => '');
    const technicalDetails = await page.$eval('#technical-details', el => el.textContent.trim()).catch(() => '');
    const specifications = await page.$eval('#specifications', el => el.textContent.trim()).catch(() => '');
    const featuresBenefits = await page.$eval('#features-benefits', el => el.textContent.trim()).catch(() => '');
    const certifications = await page.$eval('#certifications', el => el.textContent.trim()).catch(() => '');
    const imageUrl = await page.$eval('img', el => el.src).catch(() => null);
    const catalogPdfUrl = await page.$$eval('a', (anchors) => {
      const link = anchors.find(a => a.textContent.toLowerCase().includes('catalog'));
      return link ? link.href : null;
    }).catch(() => null);
    const datasheetPdfUrl = await page.$$eval('a', (anchors) => {
      const link = anchors.find(a => a.textContent.toLowerCase().includes('datasheet'));
      return link ? link.href : null;
    }).catch(() => null);

    return {
      name,
      category,
      subcategory,
      shortDescription,
      technicalDetails,
      specifications,
      featuresBenefits,
      certifications,
      imageUrl,
      catalogPdfUrl,
      datasheetPdfUrl,
    };
  } catch (error) {
    console.error('Error fetching product details from', url, error);
    return null;
  }
}

async function main() {
  console.log('Starting Reckonix product import with headless browser...');
  const db = await getDb();
  const productsCollection = db.collection('Product');

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const productLinks = await fetchProductLinks(page);
  console.log(\`Found \${productLinks.length} products to process.\`);

  let createdCount = 0;

  for (const link of productLinks) {
    const product = await fetchProductDetails(page, link);
    if (!product) continue;

    try {
      const existingProduct = await productsCollection.findOne({ name: product.name });
      if (existingProduct) {
        console.log(\`Product already exists, skipping: \${product.name}\`);
        continue;
      }

      await productsCollection.insertOne(product);
      createdCount++;
      console.log(\`Added new product: \${product.name}\`);
    } catch (error) {
      console.error('Error inserting product:', product.name, error);
    }
  }

  await browser.close();

  console.log(\`Import completed. Added \${createdCount} new products.\`);
}

main()
  .then(() => {
    console.log('Reckonix product import finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Reckonix product import failed:', error);
    process.exit(1);
  });
