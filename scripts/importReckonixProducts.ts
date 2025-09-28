import * as axios from 'axios';
import * as cheerio from 'cheerio';
import { getDb } from '../server/mongo.js';

const baseUrl = 'https://www.reckonix.in';

async function fetchProductLinks() {
  const productLinks: string[] = [];
  try {
    const response = await axios.default.get(baseUrl + '/products');
    const $ = cheerio.load(response.data);

    // Assuming product links are in anchor tags under product listing
    $('a').each((_, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('/product/')) {
        productLinks.push(baseUrl + href);
      }
    });
  } catch (error) {
    console.error('Error fetching product links:', error);
  }
  return productLinks;
}

async function fetchProductDetails(url: string) {
  try {
    const response = await axios.default.get(url);
    const $ = cheerio.load(response.data);

    // Extract product details - adjust selectors as per actual page structure
    const name = $('h1').first().text().trim();
    const category = $('a').filter((i, el) => $(el).text().toLowerCase().includes('category')).first().text().trim();
    const subcategory = $('a').filter((i, el) => $(el).text().toLowerCase().includes('subcategory')).first().text().trim();

    const shortDescription = $('p').first().text().trim();

    // Extract technical details, specifications, features, certifications, images, catalogs, etc.
    const technicalDetails = $('#technical-details').text().trim();
    const specifications = $('#specifications').text().trim();
    const featuresBenefits = $('#features-benefits').text().trim();
    const certifications = $('#certifications').text().trim();

    const imageUrl = $('img').first().attr('src');
    const catalogPdfUrl = $('a').filter((i, el) => $(el).text().toLowerCase().includes('catalog')).attr('href');
    const datasheetPdfUrl = $('a').filter((i, el) => $(el).text().toLowerCase().includes('datasheet')).attr('href');

    return {
      name,
      category,
      subcategory,
      shortDescription,
      technicalDetails,
      specifications,
      featuresBenefits,
      certifications,
      imageUrl: imageUrl ? baseUrl + imageUrl : null,
      catalogPdfUrl: catalogPdfUrl ? baseUrl + catalogPdfUrl : null,
      datasheetPdfUrl: datasheetPdfUrl ? baseUrl + datasheetPdfUrl : null,
    };
  } catch (error) {
    console.error('Error fetching product details from', url, error);
    return null;
  }
}

async function main() {
  console.log('Starting Reckonix product import...');
  const db = await getDb();
  const productsCollection = db.collection('Product');

  const productLinks = await fetchProductLinks();
  console.log('Found ' + productLinks.length + ' products to process.');

  let createdCount = 0;

  for (const link of productLinks) {
    const product = await fetchProductDetails(link);
    if (!product) continue;

    try {
      const existingProduct = await productsCollection.findOne({ name: product.name });
      if (existingProduct) {
        console.log('Product already exists, skipping: ' + product.name);
        continue;
      }

      await productsCollection.insertOne(product);
      createdCount++;
      console.log('Added new product: ' + product.name);
    } catch (error) {
      console.error('Error inserting product:', product.name, error);
    }
  }

  console.log('Import completed. Added ' + createdCount + ' new products.');
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
