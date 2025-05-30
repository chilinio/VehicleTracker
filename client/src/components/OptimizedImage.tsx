import React from 'react';
import { prepareOptimizedImage } from '../lib/imageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
}

/**
 * A component that renders an optimized image with responsive sizing and lazy loading
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  objectFit = 'cover',
  priority = false,
}) => {
  const imageProps = prepareOptimizedImage(src, alt);
  
  return (
    <img
      {...imageProps}
      className={`${className} ${objectFit ? `object-${objectFit}` : ''}`}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};

export default OptimizedImage; 