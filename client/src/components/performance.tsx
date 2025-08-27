import { useEffect } from 'react';

interface PerformanceProps {
  onLoad?: () => void;
}

export default function Performance({ onLoad }: PerformanceProps) {
  useEffect(() => {
    // Preload critical resources
    const preloadResources = () => {
      // Preload critical fonts
      const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&display=swap'
      ];

      fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
      });

      // Preload critical images
      const criticalImages = [
        '/logo.png',
        '/hero-bg.jpg',
        '/og-image.jpg'
      ];

      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Lazy load non-critical resources
    const lazyLoadResources = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute('data-src');
              observer.unobserve(img);
            }
          }
        });
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        observer.observe(img);
      });
    };

    // Initialize performance optimizations
    preloadResources();
    lazyLoadResources();

    // Call onLoad callback when component mounts
    if (onLoad) {
      onLoad();
    }

    // Cleanup
    return () => {
      // Cleanup if needed
    };
  }, [onLoad]);

  return null; // This component doesn't render anything
} 