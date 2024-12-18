// src/components/HomeVisitor.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from '@iconify/react';
import Section from '@/components/Section';
import Spacer from '@/components/Spacer';
import { GlobeDemo } from './GlobeDemo';
import { WobbleCardDemo } from './WobbleCardDemo';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { FeaturesSectionDemo } from './FeaturesSectionDemo';
import EmblaCarousel from './EmblaCarousel';

import ReviewsCarousel from './ReviewsCarousel'; // Import de la nouvelle section

const COMMUNITY_SLIDES = [
  {
    id: 1,
    src: "https://via.placeholder.com/600x400?text=Membre+1",
    alt: "Membre 1",
  },
  {
    id: 2,
    src: "https://via.placeholder.com/600x400?text=Membre+2",
    alt: "Membre 2",
  },
  {
    id: 3,
    src: "https://via.placeholder.com/600x400?text=Membre+3",
    alt: "Membre 3",
  },
  {
    id: 4,
    src: "https://via.placeholder.com/600x400?text=Membre+4",
    alt: "Membre 4",
  },
  // Ajoutez plus de slides si nécessaire
];

const HomeVisitor = () => {
  return (
    <>
      {/* Première Section - Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b ">
        <div className="text-center max-w-xl relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white">Bienvenue sur GreenTrip</h1>
          <div className="flex space-x-4 animate-slidein500 border backdrop-blur-sm border-green-500 p-6 rounded-md justify-center">
            <Input placeholder="Recherche de sentiers" />
            <Input placeholder="Recherche de communautés" />
            <Button>
              <Icon icon="material-symbols:search-rounded" width="24" height="24" />
            </Button>
          </div>
        </div>
        {/* Ombre en bas de la section Hero */}
        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-white via-transparent to-transparent shadow-lg"></div>
      </section>

      {/* Spacer */}
      <GlobeDemo />

      {/* Le reste de vos sections */}
      <Spacer />
      <div className='bg-white'>
        <FeaturesSectionDemo />
      </div>

      {/* Spacer */}
      <Spacer />

      <div className='bg-white'>
        <WobbleCardDemo />
      </div>

      {/* Spacer */}
      <Spacer />

      {/* Nouvelle Section - Commentaires des Utilisateurs */}
      <div className='bg-white'>
        <ReviewsCarousel />
      </div>

      {/* Spacer */}
      <Spacer />

      {/* Section 6 - Contactez-Nous */}
      <Section
        title="Contactez-Nous"
        content="Pour toute question ou suggestion, n'hésitez pas à nous contacter via nos réseaux sociaux ou notre serveur Discord."
        bgColor="bg-white"
      />
    </>
  );
};

export default HomeVisitor;