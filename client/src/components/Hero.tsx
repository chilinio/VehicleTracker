import React from 'react';

const Hero = () => {
  return (
    <section 
      className="relative h-[80vh] bg-center bg-cover flex items-center" 
      style={{ 
        backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1580273916550-e323be2ae537?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1000')" 
      }}
    >
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-['Montserrat'] mb-6 leading-tight">
            Blackdot Autos: Expert Vehicle Maintenance
          </h1>
          <p className="text-xl mb-8">
            Your trusted partner for all automotive needs, from routine maintenance to premium customization services.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#services" 
              className="bg-[#e63946] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg uppercase tracking-wide"
            >
              Our Services
            </a>
            <a 
              href="/book-appointment" 
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold py-3 px-8 rounded-md transition-colors text-lg uppercase tracking-wide"
            >
              Book Appointment
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
