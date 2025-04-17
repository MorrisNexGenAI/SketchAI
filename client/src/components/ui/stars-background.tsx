import { useEffect, useRef } from 'react';

const StarsBackground = () => {
  const starsRef = useRef(null);

  useEffect(() => {
    if (!starsRef.current) return;

    const container = starsRef.current;
    const starCount = 100;
    
    // Clear previous stars if any
    container.innerHTML = '';
    
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      
      // Random size between 1-3px
      const size = Math.random() * 2 + 1;
      star.style.width = `${size}px`;
      star.style.height = star.style.width;
      
      // Random position
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      
      // Random animation delay
      star.style.setProperty('--delay', String(Math.random() * 4));
      
      container.appendChild(star);
    }
  }, []);

  return (
    <div ref={starsRef} className="stars fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
  );
};

export default StarsBackground;
