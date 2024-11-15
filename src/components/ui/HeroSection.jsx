import React from 'react';


const HeroSection = () => (
    <section className="relative">
        <img src="https://example.com/your-image.jpg" alt="Header Image" className="w-full h-auto rounded-lg" />
        <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl font-semibold text-white"></h2>
        </div>
    </section>
);

export default HeroSection;