import React, { useEffect, memo } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import OptimizedImage from './OptimizedImage';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    description: string;
    image: string;
  } | null;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ 
  isOpen, 
  onClose, 
  item, 
  onNext, 
  onPrev, 
  hasNext = false, 
  hasPrev = false 
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      if (e.key === 'ArrowRight' && onNext && hasNext) {
        onNext();
      } else if (e.key === 'ArrowLeft' && onPrev && hasPrev) {
        onPrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onNext, onPrev, hasNext, hasPrev, onClose]);

  // Touch swipe functionality
  let touchStartX = 0;
  let touchEndX = 0;
  
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  };
  
  const handleSwipe = () => {
    const minSwipeDistance = 75; // Minimum distance required for swipe
    const swipeDistance = touchEndX - touchStartX;
    
    if (swipeDistance > minSwipeDistance && onPrev && hasPrev) {
      // Right swipe - go to previous
      onPrev();
    } else if (swipeDistance < -minSwipeDistance && onNext && hasNext) {
      // Left swipe - go to next
      onNext();
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl w-full mx-auto bg-white rounded-lg overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{ contain: 'content' }}
      >
        <DialogTitle className="text-2xl font-bold text-[#1d3557]">
          {item.title}
        </DialogTitle>
        
        <div className="mb-6 relative">
          <OptimizedImage 
            src={item.image} 
            alt={item.title} 
            className="w-full h-auto rounded-md"
            priority={true}
          />
          
          {/* Navigation arrows */}
          <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center px-4">
            {hasPrev && onPrev && (
              <button 
                onClick={onPrev}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                aria-label="Previous image"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <i className="fas fa-chevron-left"></i>
              </button>
            )}
            
            {hasNext && onNext && (
              <button 
                onClick={onNext}
                className="bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors"
                aria-label="Next image"
                style={{ minHeight: '44px', minWidth: '44px' }}
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            )}
          </div>
        </div>
        
        <DialogDescription className="text-gray-700 mb-4">
          {item.description}
        </DialogDescription>
        
        {/* Navigation indicator */}
        {(hasNext || hasPrev) && (
          <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-500">
            <span>
              {hasPrev ? "Swipe right or use ← arrow for previous" : ""}
              {hasPrev && hasNext ? " | " : ""}
              {hasNext ? "Swipe left or use → arrow for next" : ""}
            </span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default memo(GalleryModal);
