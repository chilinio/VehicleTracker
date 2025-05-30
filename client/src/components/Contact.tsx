import React from 'react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold font-['Montserrat'] text-[#1d3557] mb-4">Contact Us</h2>
          <p className="text-lg text-[#457b9d]">
            Reach out for appointments, quotes, or any questions about our services.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#f1faee] p-8 rounded-xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-[#1d3557] mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="text-[#e63946] text-xl mr-4 mt-1">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1d3557]">Our Location</h4>
                      <p className="text-[#457b9d]">123 Auto Service Road<br />Anytown, ST 12345</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-[#e63946] text-xl mr-4 mt-1">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1d3557]">Phone</h4>
                      <p className="text-[#457b9d]">(555) 123-4567</p>
                      <p className="text-sm text-gray-500">Monday-Friday: 8am - 6pm</p>
                      <p className="text-sm text-gray-500">Saturday: 8am - 4pm</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="text-[#e63946] text-xl mr-4 mt-1">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#1d3557]">Email</h4>
                      <p className="text-[#457b9d]">service@blackdotautos.com</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-[#1d3557] mb-6">Business Hours</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium text-[#1d3557]">Monday - Friday:</span>
                    <span className="text-[#457b9d]">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-[#1d3557]">Saturday:</span>
                    <span className="text-[#457b9d]">8:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-[#1d3557]">Sunday:</span>
                    <span className="text-[#457b9d]">Closed</span>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-[#1d3557] mb-2">Emergency Service</h4>
                    <p className="text-[#457b9d]">
                      For after-hours emergency service, please call our emergency line at (555) 987-6543.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-bold text-[#1d3557] mb-6 text-center">Find Us</h3>
              <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden">
                {/* Embed Google Maps iframe here */}
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500">Map Placeholder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
