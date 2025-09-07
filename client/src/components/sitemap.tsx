import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface SitemapProps {
  baseUrl: string;
}

export default function Sitemap({ baseUrl }: SitemapProps) {
  const { data: products = [] } = useQuery({
    queryKey: ['/api/products'],
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  useEffect(() => {
    // Generate sitemap XML
    const generateSitemap = () => {
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/products', priority: '0.9', changefreq: 'weekly' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/contact', priority: '0.8', changefreq: 'monthly' },
        { url: '/customers', priority: '0.7', changefreq: 'weekly' },
        { url: '/gallery', priority: '0.6', changefreq: 'monthly' },
        { url: '/career', priority: '0.6', changefreq: 'monthly' },
      ];

      const productPages = products.map((product: any) => ({
        url: `/products/${product.id}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: product.updatedAt || new Date().toISOString(),
      }));

      const categoryPages = categories.map((category: any) => ({
        url: `/products?category=${encodeURIComponent(category.name)}`,
        priority: '0.7',
        changefreq: 'weekly',
      }));

      const allPages = [...staticPages, ...productPages, ...categoryPages];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod || new Date().toISOString()}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      // Create a blob and download the sitemap
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'sitemap.xml';
      a.click();
      URL.revokeObjectURL(url);
    };

    // Generate sitemap when component mounts
    generateSitemap();
  }, [products, categories, baseUrl]);

  return null; // This component doesn't render anything
} 
