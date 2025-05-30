import React from 'react';

const Cta = () => {
  return (
    <section 
      className="py-24 bg-center bg-cover relative" 
      style={{ 
        backgroundImage: "linear-gradient(rgba(29, 53, 87, 0.9), rgba(29, 53, 87, 0.9)), url('https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" 
      }}
    >
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="max-w-3xl mx-auto text-white">
          <h2 className="text-4xl font-bold font-['Montserrat'] mb-6">
            Ready to Experience Superior Auto Service?
          </h2>
          <p className="text-xl mb-8">
            Schedule your appointment today and join thousands of satisfied customers who trust Blackdot Autos with their vehicles.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/book-appointment" 
              className="bg-[#e63946] hover:bg-red-700 text-white font-bold py-3 px-8 rounded-md transition-colors text-lg uppercase tracking-wide"
            >
              Book Now
            </a>
            <a 
              href="tel:+15551234567" 
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold py-3 px-8 rounded-md transition-colors text-lg"
            >
              <i className="fas fa-phone-alt mr-2"></i> Call (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cta;
