import React, { useState } from 'react';
import GalleryModal from './GalleryModal';
import { galleryItems } from '@/lib/data';

const Gallery = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    title: string;
    description: string;
    image: string;
  } | null>(null);

  const openModal = (item: typeof galleryItems[0]) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

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

  return (
    <section id="gallery" className="py-20 bg-[#f1faee]">
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
            <button
              key={index}
              onClick={() => setSelectedFilter(filter.value)}
              className={`py-2 px-5 rounded-full transition-all ${
                selectedFilter === filter.value 
                  ? 'bg-[#1d3557] text-white' 
                  : 'bg-gray-200 text-[#1d3557] hover:bg-[#1d3557] hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div 
              key={index}
              className="group relative rounded-xl overflow-hidden shadow-lg h-64"
              data-category={item.category}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#1d3557]/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-center p-4">
                  <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-200 mb-4">{item.description}</p>
                  <button 
                    onClick={() => openModal(item)}
                    className="bg-[#e63946] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Modal */}
      <GalleryModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        item={selectedItem}
      />
    </section>
  );
};

export default Gallery;
