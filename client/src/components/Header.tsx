import React, { useState, useEffect, memo, useCallback } from 'react';

// Memoized NavLink component
const NavLink = memo(({ 
  href, 
  label, 
  onClick 
}: { 
  href: string, 
  label: string, 
  onClick: () => void 
}) => (
  <a 
    href={href} 
    className="font-medium hover:text-[#e63946] transition-colors duration-200 transform hover:scale-105"
    onClick={onClick}
    aria-label={label}
    style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
  >
    {label}
  </a>
));

NavLink.displayName = 'NavLink';

// Memoized MobileNavLink component
const MobileNavLink = memo(({ 
  href, 
  label, 
  onClick 
}: { 
  href: string, 
  label: string, 
  onClick: () => void 
}) => (
  <a 
    href={href} 
    className="block py-3 px-4 hover:bg-[#457b9d] hover:text-white rounded transition-colors"
    onClick={onClick}
    aria-label={label}
    style={{ minHeight: '44px', display: 'flex', alignItems: 'center' }}
  >
    {label}
  </a>
));

MobileNavLink.displayName = 'MobileNavLink';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  // Memoized functions for performance
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Handle scroll events for header visibility and style
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Determine if scrolled past threshold for visual changes
      setIsScrolled(currentScrollPos > 10);
      
      // Determine if header should be visible based on scroll direction
      // Show header if scrolling up or at top, hide when scrolling down
      const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;
      setVisible(isVisible);
      
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [closeMenu, isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/#services' },
    { label: 'About', href: '/#about' },
    { label: 'Book Appointment', href: '/book-appointment' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header 
      className={`bg-[#1d3557] text-white fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-md py-2' : 'py-4'
      } ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{ contain: 'layout' }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <nav className="flex justify-between items-center">
          <a 
            href="#" 
            className={`text-2xl font-bold font-['Montserrat'] text-[#e63946] transition-all duration-300 ${
              isScrolled ? 'scale-90' : 'scale-100'
            }`}
          >
            Blackdot<span className="text-white">Autos</span>
          </a>
          
          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink 
                  href={link.href} 
                  label={link.label}
                  onClick={closeMenu}
                />
              </li>
            ))}
          </ul>
          
          {/* Mobile Navigation Button */}
          <button 
            className="md:hidden text-white focus:outline-none p-2 rounded-md hover:bg-[#457b9d]/30 transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMenuOpen}
            style={{ minHeight: '44px', minWidth: '44px' }}
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
          </button>
        </nav>
        
        {/* Mobile Navigation Menu */}
        <div 
          className={`md:hidden fixed inset-0 top-[56px] bg-[#1d3557] z-40 transition-transform duration-300 ease-in-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-hidden={!isMenuOpen}
        >
          <ul className="flex flex-col py-4">
            {navLinks.map((link, index) => (
              <li key={index}>
                <MobileNavLink 
                  href={link.href} 
                  label={link.label}
                  onClick={closeMenu}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
