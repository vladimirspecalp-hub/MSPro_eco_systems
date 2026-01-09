import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  slug: string;
}

export function SEOHead({ title, description, keywords = [], slug }: SEOHeadProps) {
  useEffect(() => {
    document.title = `${title} | MS-PRO`;

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', keywords.join(', '));

    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', `https://mspro.ru/services/${slug}`);

    return () => {
      if (metaDescription?.parentNode) {
        metaDescription.parentNode.removeChild(metaDescription);
      }
      if (metaKeywords?.parentNode) {
        metaKeywords.parentNode.removeChild(metaKeywords);
      }
      if (linkCanonical?.parentNode) {
        linkCanonical.parentNode.removeChild(linkCanonical);
      }
    };
  }, [title, description, keywords, slug]);

  return null;
}
