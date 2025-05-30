import React, { useState, useCallback, memo } from 'react';
import GalleryModal from './GalleryModal';
import { galleryItems } from '@/lib/data';
import OptimizedImage from './OptimizedImage';

// Touch swipe tracking variables
let touchStartX = 0;
let touchEndX = 0;

// Memoized gallery item component
const GalleryItem = memo(({ 
  item, 
  onItemClick 
}: { 
  item: typeof galleryItems[0], 
  onItemClick: (item: typeof galleryItems[0]) => void 
}) => {
  
  // Handle touch events for swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipe();
  };
  
  const handleSwipe = () => {
    // Minimum swipe distance (px)
    const minSwipeDistance = 50;
    const swipeDistance = touchEndX - touchStartX;
    
    // If it's a significant swipe, prevent the click to avoid double actions
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      return;
    }
  };
  
  return (
    <div 
      className="group relative rounded-xl overflow-hidden shadow-lg h-64"
      data-category={item.category}
      style={{ contain: 'content' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <OptimizedImage 
        src={item.image} 
        alt={item.title} 
        className="w-full h-full"
        objectFit="cover"
      />
      <div className="absolute inset-0 bg-[#1d3557]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-center p-4">
          <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
          <p className="text-gray-200 mb-4">{item.description}</p>
          <button 
            onClick={() => onItemClick(item)}
            className="bg-[#e63946] hover:bg-red-700 text-white font-medium py-3 px-6 rounded-md transition-colors transform hover:scale-105 transition-transform"
            style={{ minHeight: '44px', minWidth: '120px' }}
            aria-label={`View details of ${item.title}`}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
});

GalleryItem.displayName = 'GalleryItem';

// Filter button component
const FilterButton = memo(({ 
  label, 
  value, 
  isActive, 
  onClick 
}: { 
  label: string, 
  value: string, 
  isActive: boolean,
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    className={`py-3 px-6 rounded-full transition-all ${
      isActive 
        ? 'bg-[#1d3557] text-white' 
        : 'bg-gray-200 text-[#1d3557] hover:bg-[#1d3557] hover:text-white'
    }`}
    style={{ minHeight: '44px', minWidth: '90px' }}
    aria-pressed={isActive}
  >
    {label}
  </button>
));

FilterButton.displayName = 'FilterButton';

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter options
  const filters = [
    { value: 'all', label: 'All Work' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'custom', label: 'Customization' },
    { value: 'repair', label: 'Repairs' },
  ];

  const filteredItems = selectedFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedFilter);

  // Memoize handlers to prevent unnecessary re-renders
  const openModal = useCallback((item: typeof galleryItems[0]) => {
    setSelectedItem(item);
    setCurrentIndex(filteredItems.findIndex(i => i.title === item.title));
    setIsModalOpen(true);
  }, [filteredItems]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedItem(null);
  }, []);

  const setFilter = useCallback((value: string) => {
    setSelectedFilter(value);
  }, []);

  // Swipe handlers for modal navigation
  const handleNext = useCallback(() => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedItem(filteredItems[currentIndex + 1]);
    }
  }, [currentIndex, filteredItems]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedItem(filteredItems[currentIndex - 1]);
    }
  }, [currentIndex, filteredItems]);

  return (
    <section id="gallery" className="py-20 bg-[#f1faee]" style={{ contain: 'content' }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-['Montserrat'] text-[#1d3557] mb-4">Our Work Gallery</h2>
          <p className="text-lg text-[#457b9d]">
            Browse through our portfolio of completed projects showcasing our quality workmanship.
          </p>
        </div>
        
        {/* Filters */}
        <div className="mb-8 flex justify-center gap-4 flex-wrap">
          {filters.map((filter, index) => (
            <FilterButton
              key={index}
              label={filter.label}
              value={filter.value}
              isActive={selectedFilter === filter.value}
              onClick={() => setFilter(filter.value)}
            />
          ))}
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <GalleryItem 
              key={index} 
              item={item} 
              onItemClick={openModal} 
            />
          ))}
        </div>
      </div>
      
      {/* Modal with swipe capability */}
      <GalleryModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        item={selectedItem}
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={currentIndex < filteredItems.length - 1}
        hasPrev={currentIndex > 0}
      />
    </section>
  );
};

export default memo(Gallery);
