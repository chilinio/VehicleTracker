/**
 * Optimizes an image URL for responsive delivery
 * @param url Original image URL (from Unsplash, etc.)
 * @param width Desired width
 * @param quality Image quality (1-100)
 * @returns Optimized image URL
 */
export function optimizeImage(url: string, width: number = 800, quality: number = 80): string {
  // Check if it's an Unsplash image
  if (url.includes('unsplash.com')) {
    // Remove any existing parameters
    const baseUrl = url.split('?')[0];
    // Add our optimized parameters
    return `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=${width}&q=${quality}`;
  }
  
  // Return original URL for non-Unsplash images
  return url;
}

/**
 * Creates a responsive image srcSet for different screen sizes
 * @param url Base image URL
 * @returns String containing srcSet attribute value
 */
export function createSrcSet(url: string): string {
  if (!url.includes('unsplash.com')) return '';
  
  const baseUrl = url.split('?')[0];
  
  return [
    `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=70 400w`,
    `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=75 800w`,
    `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80 1200w`,
    `${baseUrl}?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80 1600w`,
  ].join(', ');
}

/**
 * Creates a component-ready image object with all optimization properties
 * @param url Original image URL
 * @param alt Alt text for the image
 * @returns Object with optimized properties
 */
export function prepareOptimizedImage(url: string, alt: string) {
  return {
    src: optimizeImage(url),
    srcSet: createSrcSet(url),
    alt,
    loading: 'lazy' as const,
    sizes: '(max-width: 768px) 100vw, 50vw',
  };
} 