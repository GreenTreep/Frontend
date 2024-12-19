// src/components/ReviewsCarousel.jsx

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Icon } from '@iconify/react';
import EmblaCarousel from './EmblaCarousel';
import peakpx from '@/assets/peakpx.jpg';

const REVIEWS = [
    {
        id: 1,
        name: "Élodie Martin",
        profileImage: "https://via.placeholder.com/100x100?text=Élodie",
        rating: 5,
        comment: "GreenTrip a complètement transformé mes randonnées ! Les sentiers sont magnifiques et la communauté est très accueillante.",
    },
    {
        id: 2,
        name: "Lucas Dupont",
        profileImage: "https://via.placeholder.com/100x100?text=Lucas",
        rating: 4,
        comment: "Une application intuitive avec de nombreuses fonctionnalités utiles. J'apprécie particulièrement les itinéraires personnalisés.",
    },
    {
        id: 3,
        name: "Sophie Bernard",
        profileImage: "https://via.placeholder.com/100x100?text=Sophie",
        rating: 5,
        comment: "Excellente plateforme pour les passionnés de randonnée. J'ai pu découvrir de nouveaux sentiers grâce à GreenTrip !",
    },
    {
        id: 4,
        name: "Thomas Leroy",
        profileImage: "https://via.placeholder.com/100x100?text=Thomas",
        rating: 4,
        comment: "Les fonctionnalités de suivi de randonnée sont très pratiques. J'aime aussi la communauté active.",
    },
    // Ajoutez plus de reviews si nécessaire
];

const ReviewsCarousel = () => {
    // Transformer les avis en slides pour Embla Carousel
    const slides = REVIEWS.map(review => (
        <div className="p-4" key={review.id}>
            <Card className="p-6 shadow-md rounded-lg bg-white h-full">
                <CardHeader className="flex items-center mb-4">
                    <img
                        src={review.profileImage}
                        alt={review.name}
                        className="w-16 h-16 rounded-full mr-4"
                    />
                    <div>
                        <h3 className="text-xl font-semibold">{review.name}</h3>
                        <div className="flex">
                            {[...Array(review.rating)].map((_, index) => (
                                <Icon key={index} icon="mdi:star" className="text-yellow-500" width="20" height="20" />
                            ))}
                            {[...Array(5 - review.rating)].map((_, index) => (
                                <Icon key={index} icon="mdi:star-outline" className="text-yellow-500" width="20" height="20" />
                            ))}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700">{review.comment}</p>
                </CardContent>
            </Card>
        </div>
    ));

    return (
        <section
            className="py-16 rounded-lg mx-5 bg-gray-100"
            style={{ backgroundImage: `url(${peakpx})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-semibold text-center mb-8">Ce que nos utilisateurs disent</h2>
                <EmblaCarousel slides={slides} options={{
                    loop: true,
                    speed: 10,          // Vitesse du carrousel
                    draggable: true,    // Permet de glisser les slides
                    containScroll: 'trimSnaps', // Contenir le scroll
                }} />
            </div>
        </section>
    );
};

export default ReviewsCarousel;
