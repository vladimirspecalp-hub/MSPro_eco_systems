interface SEOEntry {
  slug: string;
  title: string;
  description: string;
  cta: string;
  region?: string;
  keywords?: string[];
  h1?: string;
  h2?: string;
  faq?: Array<{ question: string; answer: string }>;
  benefits?: string[];
}

/**
 * Finds or generates SEO entry by fetching from the API.
 * This replaces the monolithic JSON bundle with on-demand fetching.
 */
export async function findOrGenerateSEOEntry(slug: string): Promise<SEOEntry | null> {
  try {
    // Pass current query parameters (like region) to the API
    const searchParams = new URLSearchParams(window.location.search);
    const regionParam = searchParams.get('region');

    let url = `/api/ai_seo?slug=${encodeURIComponent(slug)}`;
    if (regionParam) {
      url += `&region=${encodeURIComponent(regionParam)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to load SEO content:', error);
    return null;
  }
}

/**
 * Finds related pages by fetching from the API.
 */
export async function findRelatedPages(currentSlug: string, limit: number = 6): Promise<SEOEntry[]> {
  try {
    const response = await fetch(`/api/ai_seo?slug=${encodeURIComponent(currentSlug)}&mode=related&limit=${limit}`);
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Failed to load related pages:', error);
    return [];
  }
}

export type { SEOEntry };
