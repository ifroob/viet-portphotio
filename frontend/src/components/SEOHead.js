import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEOHead = ({ portfolioSettings, seoSettings, currentPage = 'home' }) => {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'home':
        return seoSettings?.og_title || seoSettings?.site_title || portfolioSettings?.main_title || 'Viet\'s Photography Portfolio';
      case 'blog':
        return `Blog - ${seoSettings?.site_title || 'Viet\'s Photography Portfolio'}`;
      case 'photos':
        return `Gallery - ${seoSettings?.site_title || 'Viet\'s Photography Portfolio'}`;
      default:
        return seoSettings?.site_title || 'Viet\'s Photography Portfolio';
    }
  };

  const getPageDescription = () => {
    return seoSettings?.og_description || seoSettings?.site_description || portfolioSettings?.main_subtitle || 'Professional photography services with a rock and roll edge';
  };

  const getPageImage = () => {
    return seoSettings?.og_image || (portfolioSettings?.avatar_urls && portfolioSettings.avatar_urls[portfolioSettings.selected_avatar_index]) || '';
  };

  const getPageUrl = () => {
    const baseUrl = seoSettings?.og_url || window.location.origin;
    switch (currentPage) {
      case 'blog':
        return `${baseUrl}/blog`;
      case 'photos':
        return `${baseUrl}/photos`;
      default:
        return baseUrl;
    }
  };

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{getPageTitle()}</title>
      <meta name="description" content={getPageDescription()} />
      <meta name="keywords" content={seoSettings?.site_keywords?.join(', ') || 'photography, portfolio, professional, music, rock'} />

      {/* Open Graph / Facebook / Instagram */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={getPageTitle()} />
      <meta property="og:description" content={getPageDescription()} />
      <meta property="og:url" content={getPageUrl()} />
      {getPageImage() && <meta property="og:image" content={getPageImage()} />}
      <meta property="og:site_name" content={seoSettings?.site_title || 'Viet\'s Photography Portfolio'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content={seoSettings?.twitter_card_type || 'summary_large_image'} />
      <meta name="twitter:title" content={seoSettings?.twitter_title || getPageTitle()} />
      <meta name="twitter:description" content={seoSettings?.twitter_description || getPageDescription()} />
      {(seoSettings?.twitter_image || getPageImage()) && (
        <meta name="twitter:image" content={seoSettings?.twitter_image || getPageImage()} />
      )}

      {/* Additional meta tags */}
      <meta name="author" content="Viet" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" content={getPageUrl()} />

      {/* Structured Data - JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Viet",
          "jobTitle": "Photographer",
          "description": getPageDescription(),
          "url": getPageUrl(),
          "image": getPageImage(),
          "sameAs": [
            seoSettings?.social_media?.facebook_url,
            seoSettings?.social_media?.instagram_url,
            seoSettings?.social_media?.youtube_url,
            seoSettings?.social_media?.twitter_url
          ].filter(Boolean),
          "offers": {
            "@type": "Offer",
            "description": "Professional photography services including portraits, events, and artistic photography"
          }
        })}
      </script>
    </Helmet>
  );
};

export default SEOHead;