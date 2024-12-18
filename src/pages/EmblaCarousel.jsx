// src/components/EmblaCarousel.jsx

import React from 'react';
import Autoplay from 'embla-carousel-autoplay';
import useEmblaCarousel from 'embla-carousel-react';
import '../embla.css'; // Import des styles spécifiques au carrousel

const EmblaCarousel = ({ slides, options }) => {
    // Options spécifiques pour le plugin Autoplay
    const autoplayOptions = { delay: 3000, stopOnInteraction: false };

    // Initialisation d'Embla Carousel avec le plugin Autoplay
    const [emblaRef] = useEmblaCarousel(options, [Autoplay(autoplayOptions)]);

    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {slides.map((slide, index) => (
                        <div className="embla__slide" key={index}>
                            {slide}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EmblaCarousel;
