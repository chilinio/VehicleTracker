import React, { useState, useEffect, memo, useCallback } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate scroll progress percentage
  const calculateScrollProgress = useCallback(() => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY;
    
    // Don't show progress until we've scrolled a bit
    if (scrollTop < 300) {
      setIsVisible(false);
      return;
    }
    
    setIsVisible(true);
    
    // Calculate scroll percentage
    const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
    setScrollProgress(Math.min(Math.round(scrollPercentage), 100));
  }, []);

  // Set the scroll event listener with performance optimizations
  useEffect(() => {
    // Use passive to improve performance
    window.addEventListener('scroll', calculateScrollProgress, { passive: true });
    
    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener('scroll', calculateScrollProgress);
  }, [calculateScrollProgress]);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    // Focus on top element for accessibility
    document.getElementById('top')?.focus();
  }, []);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      className={`fixed bottom-6 right-6 bg-[#1d3557] hover:bg-[#457b9d] text-white p-4 rounded-full shadow-lg transition-all z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e63946] ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}
      aria-label={`Back to top, current scroll progress: ${scrollProgress}%`}
      style={{ 
        minHeight: '56px', 
        minWidth: '56px',
        transform: isVisible ? 'scale(1)' : 'scale(0.8)',
        contain: 'layout'
      }}
      tabIndex={isVisible ? 0 : -1}
      role="button"
    >
      <i className="fas fa-arrow-up"></i>
      <svg 
        className="absolute inset-0 w-full h-full -rotate-90" 
        viewBox="0 0 100 100"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle 
          className="text-[#1d3557] stroke-current" 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          strokeWidth="8" 
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset="283"
        />
        <circle 
          className="text-[#e63946] stroke-current" 
          cx="50" 
          cy="50" 
          r="45" 
          fill="none" 
          strokeWidth="8" 
          strokeLinecap="round"
          strokeDasharray="283"
          strokeDashoffset={283 - (283 * scrollProgress) / 100}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
    </button>
  );
};

export default memo(BackToTop);
