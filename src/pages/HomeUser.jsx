import React from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from '@iconify/react';
import backgroundImage from '../assets/bgi.jpg'; // Assurez-vous que le chemin est correct
import Section from '@/components/Section';
import Spacer from '@/components/Spacer';
import { GlobeDemo } from '@/components/landing/GlobeDemo';

function HomeUser() {
  return (
    <>
      {/* Première Section avec l'image de fond */}
      <section className="relative h-screen bg-bgcolor flex flex-col items-center justify-center  p-4">
        {/* Image de fond */}
        <img
          src={backgroundImage}
          alt="Background"
          className="absolute top-0  left-0 w-full h-full object-cover z-[-1] hidden"
        />
        <div className="text-center max-w-xl relative z-10">
          <h1 className="text-5xl font-bold mb-4 text-white">Texte!</h1>
          <div className="flex space-x-4 animate-slidein500 border backdrop-blur-sm border-green-500 p-6 rounded-md justify-center">
            <Input placeholder="Recherche 1" />
            <Input placeholder="Recherche 2" />
            <Button>
              <Icon icon="material-symbols:search-rounded" width="24" height="24" />
            </Button>
          </div>
        </div>
      </section>

      {/* Sections Suivantes */}
      {/* Section 1 */}
      <Section
        title="Bienvenue dans la section suivante"
        content="Ceci est une autre section de votre page où vous pouvez ajouter plus de contenu. L'image de fond de la première section ne persiste pas ici, permettant aux utilisateurs de défiler et de découvrir d'autres informations."
        bgColor="bg-white"
      />

      {/* Spacer */}
      <GlobeDemo />

      {/* Section 2 */}
      <Section
        title="Une autre section"
        content="Continuez à ajouter du contenu ici. Chaque section peut avoir son propre style et ses propres images de fond si nécessaire."
        bgColor="bg-secondary"
      />

      {/* Spacer */}
      <Spacer />

      {/* Section 3 */}
      <Section
        title="Bienvenue dans la section suivante"
        content="Ceci est une autre section de votre page où vous pouvez ajouter plus de contenu. L'image de fond de la première section ne persiste pas ici, permettant aux utilisateurs de défiler et de découvrir d'autres informations."
        bgColor="bg-white"
      />

      {/* Spacer */}
      <Spacer />

      {/* Section 4 */}
      <Section
        title="Une autre section"
        content="Continuez à ajouter du contenu ici. Chaque section peut avoir son propre style et ses propres images de fond si nécessaire."
        bgColor="bg-secondary"
      />
    </>
  );
};

export default HomeUser