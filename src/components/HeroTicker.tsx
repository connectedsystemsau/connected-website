'use client';

import { useEffect, useState } from 'react';

const phrases = [
  'to Perth',
  'to Community',
  'to Your Business',
  'to You',
];

export default function HeroTicker() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const [isFlashing, setIsFlashing] = useState(true);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    
    // Typing/deleting logic
    const typingSpeed = 100;
    const pauseBeforeDelete = phraseIndex === phrases.length - 1 ? 4000 : 2000; // Longer pause on last phrase
    const pauseBeforeType = 500;
    const flashDuration = 500;

    let timeout: NodeJS.Timeout;

    if (isFlashing && displayedText === '') {
      // Flash cursor before typing
      timeout = setTimeout(() => {
        setIsFlashing(false);
      }, flashDuration);
    } else if (!isDeleting && displayedText === currentPhrase) {
      // Finished typing, pause before deleting
      timeout = setTimeout(() => setIsDeleting(true), pauseBeforeDelete);
    } else if (isDeleting && displayedText !== '') {
      // Delete entire phrase at once
      timeout = setTimeout(() => {
        setDisplayedText('');
      }, 0);
    } else if (isDeleting && displayedText === '') {
      // Finished deleting, move to next phrase
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setIsFlashing(true);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, pauseBeforeType);
    } else if (!isFlashing) {
      // Continue typing character by character
      timeout = setTimeout(() => {
        setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
      }, typingSpeed);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [displayedText, isDeleting, phraseIndex, isFlashing]);

  // Separate effect for cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div 
      className="min-h-20 sm:min-h-24 lg:min-h-28 flex items-center justify-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <h1 className="text-3xl text-white sm:text-5xl lg:text-6xl drop-shadow-lg leading-[0.85] text-center">
        <span className="text-white block">Connected</span>
        <span className="text-2xl sm:text-4xl lg:text-5xl font-bold inline-block bg-linear-to-r from-brand-200 via-brand-400 to-brand-300 bg-clip-text text-transparent pb-2 min-h-[1.2em]">
          {displayedText}
          {phraseIndex !== phrases.length - 1 && (isFlashing || displayedText !== phrases[phraseIndex]) && (
            <span 
              className={`inline-block w-[0.5em] h-[0.15em] ml-1 mb-[-0.2em] bg-linear-to-r from-brand-200 to-brand-400 transition-opacity duration-100 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </span>
      </h1>
    </div>
  );
}

