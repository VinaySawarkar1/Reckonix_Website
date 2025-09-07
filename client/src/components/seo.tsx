import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  product?: {
    name: string;
    description: string;
    price?: string;
    category?: string;
    image?: string;
  };
  organization?: {
    name: string;
    description: string;
    logo: string;
  };
}

export default function SEO({
  title = 'Reckonix - Calibration, Testing & Measuring Systems',
  description = 'Leading provider of precision calibration, testing, and measuring systems. Industrial metrology solutions for aerospace, automotive, pharmaceutical, and research industries.',
  keywords = 'calibration, testing, measuring systems, metrology, precision instruments, industrial calibration, quality control, dimensional measurement',
  image = 'https://reckonix.in/og-image.jpg',
  url = 'https://reckonix.in',
  type = 'website',
  product,
  organization
}: SEOProps) {
  const fullTitle = title.includes('Reckonix') ? title : `${title} | Reckonix`;
  const fullUrl = url.startsWith('http') ? url : `https://reckonix.in${url}`;
  const fullImage = image.startsWith('http') ? image : `https://reckonix.in${image}`;

  // Generate structured data based on type
  const generateStructuredData = () => {
    if (product) {
      return {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image || fullImage,
        "category": product.category,
        "brand": {
          "@type": "Brand",
          "name": "Reckonix"
        },
        "manufacturer": {
          "@type": "Organization",
          "name": "Reckonix"
        }
      };
    }

    if (type === 'article') {
      return {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": fullImage,
        "author": {
          "@type": "Organization",
          "name": "Reckonix"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Reckonix",
          "logo": {
            "@type": "ImageObject",
            "url": "https://reckonix.in/logo.png"
          }
        }
      };
    }

    return {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": fullUrl,
      "mainEntity": {
        "@type": "Organization",
        "name": "Reckonix",
        "description": "Leading provider of precision calibration, testing, and measuring systems",
        "url": "https://reckonix.in"
      }
    };
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Reckonix" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(generateStructuredData())}
      </script>
    </Helmet>
  );
} 
