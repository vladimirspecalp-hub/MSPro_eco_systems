// TODO: Реализовать модуль после подключения Supabase и API.

export interface SEOMetaTags {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function setPageMeta(meta: SEOMetaTags): void {
  if (typeof document === 'undefined') return;

  document.title = meta.title;
  
  const setMetaTag = (name: string, content: string) => {
    let element = document.querySelector(`meta[name="${name}"]`);
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute('name', name);
      document.head.appendChild(element);
    }
    element.setAttribute('content', content);
  };

  setMetaTag('description', meta.description);
  if (meta.keywords) setMetaTag('keywords', meta.keywords);
  if (meta.ogTitle) setMetaTag('og:title', meta.ogTitle);
  if (meta.ogDescription) setMetaTag('og:description', meta.ogDescription);
  if (meta.ogImage) setMetaTag('og:image', meta.ogImage);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .trim();
}
