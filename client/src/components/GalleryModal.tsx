import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    title: string;
    description: string;
    image: string;
  } | null;
}

const GalleryModal: React.FC<GalleryModalProps> = ({ isOpen, onClose, item }) => {
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

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full mx-auto bg-white rounded-lg overflow-hidden">
        <DialogTitle className="text-2xl font-bold text-[#1d3557]">
          {item.title}
        </DialogTitle>
        
        <div className="mb-6">
          <img 
            src={item.image} 
            alt={item.title} 
            className="w-full h-auto rounded-md"
          />
        </div>
        
        <DialogDescription className="text-gray-700 mb-4">
          {item.description}
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
