import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

export function SEO({
  title,
  description,
  keywords = [],
  ogImage = '/logo.png',
  ogType = 'website',
  twitterCard = 'summary'
}: SEOProps) {
  const siteTitle = 'Typing Test';
  const fullTitle = `${title} | ${siteTitle}`;
  const defaultKeywords = ['typing', 'practice', 'speed test', 'keyboard', 'typing practice'];
  const allKeywords = [...new Set([...defaultKeywords, ...keywords])].join(', ');

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#ffffff" />
      <link rel="canonical" href={window.location.href} />
    </Helmet>
  );
} 