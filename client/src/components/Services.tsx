import React, { memo } from 'react';
import { services } from '@/lib/data';
import OptimizedImage from './OptimizedImage';

// Separate service card component to be memoized
const ServiceCard = memo(({ service }: { service: typeof services[0] }) => {
  return (
    <div 
      className="rounded-xl overflow-hidden bg-white shadow-lg transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-xl contain-content"
      style={{ contain: 'content' }}
    >
      <div className="h-56 overflow-hidden">
        <OptimizedImage 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full"
          objectFit="cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold mb-3 text-[#1d3557]">{service.title}</h3>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <a 
          href="#" 
          className="inline-block bg-[#e63946] hover:bg-red-700 text-white font-medium py-2 px-5 rounded-md transition-colors transition-transform transform hover:scale-105 touch-manipulation"
          role="button"
          aria-label={`Learn more about ${service.title}`}
          style={{ minHeight: '44px', minWidth: '120px' }}
        >
          Learn More
        </a>
      </div>
    </div>
  );
});

ServiceCard.displayName = 'ServiceCard';

const Services = () => {
  return (
    <section id="services" className="py-20 bg-white" style={{ contain: 'content' }}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-['Montserrat'] text-[#1d3557] mb-4">
            Our Premium Services
          </h2>
          <p className="text-lg text-[#457b9d]">
            From routine maintenance to full customization, we provide comprehensive solutions for your vehicle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default memo(Services);
