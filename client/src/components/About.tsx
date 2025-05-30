import React from 'react';
import OptimizedImage from './OptimizedImage';

const About = () => {
  // Stats data
  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '5,000+', label: 'Happy Customers' },
    { value: '12', label: 'Expert Technicians' },
    { value: '100%', label: 'Satisfaction' },
  ];

  return (
    <section id="about" className="py-20 bg-[#1d3557] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl font-bold font-['Montserrat'] mb-6">About Blackdot Autos</h2>
            <p className="text-lg mb-6">
              Founded in 2005, Blackdot Autos has been providing exceptional automotive services for over 15 years. 
              We combine traditional craftsmanship with cutting-edge technology to deliver results that exceed expectations.
            </p>
            <p className="text-lg mb-6">
              Our team of ASE-certified technicians brings decades of combined experience to every job, 
              whether it's routine maintenance or complex customization projects.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-[#457b9d]/20 rounded-lg">
                  <div className="text-3xl font-bold text-[#e63946] mb-2">{stat.value}</div>
                  <div className="text-[#a8dadc]">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="order-1 lg:order-2 rounded-xl overflow-hidden shadow-2xl">
            <OptimizedImage 
              src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Blackdot Autos Team" 
              className="w-full h-auto"
              objectFit="cover"
              priority={true}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
