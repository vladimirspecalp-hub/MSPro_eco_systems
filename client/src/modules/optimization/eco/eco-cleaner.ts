export interface UnusedResource {
  type: 'css' | 'js' | 'image' | 'font';
  url: string;
  size: number;
  reason: string;
}

export interface CleanupReport {
  totalSize: number;
  unusedResources: UnusedResource[];
  recommendations: string[];
  potentialSavings: number;
}

export function analyzeUnusedCSS(): UnusedResource[] {
  if (typeof document === 'undefined') return [];
  
  const unused: UnusedResource[] = [];
  const stylesheets = document.styleSheets;
  
  for (let i = 0; i < stylesheets.length; i++) {
    const sheet = stylesheets[i];
    if (!sheet.href) continue;
    
    try {
      const rules = sheet.cssRules;
      let unusedCount = 0;
      
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j] as CSSStyleRule;
        if (rule.selectorText) {
          try {
            const elements = document.querySelectorAll(rule.selectorText);
            if (elements.length === 0) {
              unusedCount++;
            }
          } catch {
            continue;
          }
        }
      }
      
      if (unusedCount > rules.length * 0.5) {
        unused.push({
          type: 'css',
          url: sheet.href,
          size: 0,
          reason: `${unusedCount} из ${rules.length} правил не используются`,
        });
      }
    } catch {
      continue;
    }
  }
  
  return unused;
}

export function analyzeUnusedImages(): UnusedResource[] {
  if (typeof document === 'undefined') return [];
  
  const unused: UnusedResource[] = [];
  const images = document.querySelectorAll('img');
  
  images.forEach((img) => {
    const rect = img.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight * 2;
    
    if (!isVisible && !img.loading) {
      unused.push({
        type: 'image',
        url: img.src,
        size: 0,
        reason: 'Изображение далеко от viewport без lazy loading',
      });
    }
  });
  
  return unused;
}

export function generateCleanupReport(): CleanupReport {
  const unusedCSS = analyzeUnusedCSS();
  const unusedImages = analyzeUnusedImages();
  const unusedResources = [...unusedCSS, ...unusedImages];
  
  const recommendations: string[] = [];
  
  if (unusedCSS.length > 0) {
    recommendations.push('Удалите неиспользуемые CSS-правила с помощью PurgeCSS');
  }
  
  if (unusedImages.length > 0) {
    recommendations.push('Добавьте loading="lazy" для изображений ниже fold');
  }
  
  const scripts = document.querySelectorAll('script[src]');
  if (scripts.length > 10) {
    recommendations.push('Объедините скрипты для уменьшения HTTP-запросов');
  }
  
  if (recommendations.length === 0) {
    recommendations.push('Код оптимизирован. Продолжайте мониторинг.');
  }
  
  return {
    totalSize: unusedResources.reduce((sum, r) => sum + r.size, 0),
    unusedResources,
    recommendations,
    potentialSavings: unusedResources.length * 5,
  };
}

export function suggestLazyLoading(): string[] {
  if (typeof document === 'undefined') return [];
  
  const suggestions: string[] = [];
  const images = document.querySelectorAll('img:not([loading])');
  
  if (images.length > 0) {
    suggestions.push(`Добавьте lazy loading для ${images.length} изображений`);
  }
  
  const iframes = document.querySelectorAll('iframe:not([loading])');
  if (iframes.length > 0) {
    suggestions.push(`Добавьте lazy loading для ${iframes.length} iframe`);
  }
  
  return suggestions;
}
