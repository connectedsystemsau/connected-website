'use client';

import { useEffect, useState } from 'react';

const slides = [
  { id: 1, text: 'Connected to Perth', duration: 3500 },
  { id: 2, text: 'Connected to Your Goals', duration: 3500 },
  { id: 3, text: 'Connected to Your Business', duration: 3500 },
  { id: 3, text: 'Connected to You', duration: 3500 },
];

export default function HeroTicker() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animationClass, setAnimationClass] = useState('animate-[blinds-in_0.3s_ease-out_forwards]');

  useEffect(() => {
    const slide = slides[currentSlide];
    
    // Regular slides: blinds transition
    const timer = setTimeout(() => {
      setAnimationClass('animate-[blinds-out_0.3s_ease-in_forwards]');
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setAnimationClass('animate-[blinds-in_0.3s_ease-out_forwards]');
      }, 300);
    }, slide.duration);
    
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];
  
  // Parse slide text to get text after "Connected"
  const renderSlideText = () => {
    const parts = slide.text.split('Connected');
    return parts[1] || '';
  };

  return (
    <div 
      className="min-h-20 sm:min-h-24 lg:min-h-28 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <h1 className="text-3xl text-white sm:text-5xl lg:text-6xl drop-shadow-lg leading-[0.85] text-center">
        <span className="text-white block">Connected</span>
        <span 
          className={`text-2xl sm:text-4xl lg:text-5xl font-bold inline-block bg-linear-to-r from-brand-200 via-brand-400 to-brand-300 bg-clip-text text-transparent pb-2 ${animationClass}`}
        >
          {renderSlideText()}
        </span>
      </h1>
    </div>
  );
}
