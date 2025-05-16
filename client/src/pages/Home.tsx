import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import About from '@/components/About';
import Gallery from '@/components/Gallery';
import Testimonials from '@/components/Testimonials';
import Cta from '@/components/Cta';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#f1faee] font-sans">
      <Header />
      <Hero />
      <Services />
      <About />
      <Gallery />
      <Testimonials />
      <Cta />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Home;
