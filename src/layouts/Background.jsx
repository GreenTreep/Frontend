import React, { useState, useEffect } from 'react';
import backgroundImage from '../assets/h.png'; 

const Background = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const opacity = Math.min(scrollY / 600, 1);

  return (
    <div
      className="fixed inset-0 bg-cover dark:opacity-40 bg-center z-[-2]"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        transition: 'background-color 0.2s ease', 
      }}
    >
      <div
        className="absolute inset-0 dark:bg-black dark:opacity-40 bg-white"
        style={{ opacity }}
      ></div>
    </div>
  );
};

export default Background;
