import React, { useState, useRef, useEffect } from 'react';
import { testimonials } from '@/lib/data';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollToTestimonial = (index: number) => {
    if (!sliderRef.current) return;
    
    // Handle circular navigation
    let targetIndex = index;
    if (index < 0) targetIndex = testimonials.length - 1;
    if (index >= testimonials.length) targetIndex = 0;
    
    setCurrentIndex(targetIndex);
    
    const testimonialCards = sliderRef.current.querySelectorAll('.testimonial-card');
    if (testimonialCards[targetIndex]) {
      testimonialCards[targetIndex].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  };

  // Auto-rotate testimonials every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      scrollToTestimonial(currentIndex + 1);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <section id="testimonials" className="py-20 bg-[#a8dadc]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-['Montserrat'] text-[#1d3557] mb-4">
            What Our Customers Say
          </h2>
          <p className="text-lg text-[#457b9d]">
            Hear from our satisfied customers about their experience with Auto Extreme.
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          <button 
            onClick={() => scrollToTestimonial(currentIndex - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#1d3557] rounded-full p-3 shadow-md -ml-4 lg:-ml-6 focus:outline-none"
            aria-label="Previous testimonial"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div 
            ref={sliderRef}
            className="overflow-x-auto pb-4 flex snap-x scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="testimonial-card min-w-full md:min-w-[80%] lg:min-w-[50%] p-8 bg-white rounded-xl shadow-md mx-4 scroll-snap-align-center"
              >
                <div className="mb-5 text-yellow-400 flex justify-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <i key={i} className={`fas ${i < testimonial.rating ? 'fa-star' : i + 0.5 === testimonial.rating ? 'fa-star-half-alt' : 'fa-star'}`}></i>
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-[#1d3557]">{testimonial.name}</h4>
                    <p className="text-[#457b9d] text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => scrollToTestimonial(currentIndex + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-[#1d3557] rounded-full p-3 shadow-md -mr-4 lg:-mr-6 focus:outline-none"
            aria-label="Next testimonial"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
