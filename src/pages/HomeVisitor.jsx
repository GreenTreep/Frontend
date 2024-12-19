import React from 'react';
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from '@iconify/react';
import Section from '@/components/Section';
import Spacer from '@/components/Spacer';
import { GlobeDemo } from '@/components/landing/GlobeDemo';
import { WobbleCardDemo } from '@/components/landing/WobbleCardDemo';
import { FeaturesSectionDemo } from '@/components/landing/FeaturesSectionDemo';
import ReviewsCarousel from '@/components/landing/ReviewsCarousel';
import AnimatedSection from '@/components/landing/AnimatedSection';
import Typewriter from 'typewriter-effect';
import { FeaturesSectionDemo as Sd } from '../components/landing/FeaturesSection';

const HomeVisitor = () => {
  return (
    <>

      <AnimatedSection className="relative h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center max-w-xl relative z-10 mb-8">

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 animate-slidein500 border backdrop-blur-sm border-green-500 p-6 rounded-md justify-center w-full max-w-md">
            <Input placeholder="Recherche de sentiers" />
            <Input placeholder="Recherche de communautés" />
            <Button className="flex items-center justify-center">
              <Icon icon="material-symbols:search-rounded" width="24" height="24" />
            </Button>
          </div>

          <div className="mt-8 w-full max-w-md flex justify-center">
            <h2 className="text-2xl font-semibold text-white h-12 flex items-center justify-center">
              <Typewriter
                options={{
                  loop: true,
                  delay: 75,
                  deleteSpeed: 50,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString('Explorez des sentiers magnifiques')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('Rejoignez une communauté passionnée')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('Planifiez votre prochaine randonnée')
                    .pauseFor(1000)
                    .deleteAll()
                    .typeString('Découvrez des paysages époustouflants')
                    .pauseFor(1000)
                    .deleteAll()
                    .start();
                }}
              />
            </h2>
          </div>
        </div>

      </AnimatedSection>

      <div className='bg-white dark:bg-black relative'>

        {/* Spacer avec GlobeDemo */}
        <AnimatedSection className="bg-white dark:bg-black relative">

          {/* Conteneur pour la superposition */}
          <div className="relative">
            {/* GlobeDemo */}
            <GlobeDemo />

          </div>
        </AnimatedSection>

        {/* Spacer */}
        <Spacer />

        {/* FeaturesSectionDemo */}
        <AnimatedSection className="bg-white dark:bg-black">
          <FeaturesSectionDemo />
        </AnimatedSection>

        {/* Spacer */}
        <Spacer />

        {/* WobbleCardDemo */}
        <AnimatedSection className="bg-white dark:bg-black">
          <WobbleCardDemo />
        </AnimatedSection>

        {/* Spacer */}
        <Spacer />
        <AnimatedSection className="bg-white dark:bg-black">
        <Sd />
        </AnimatedSection>
        <Spacer />

        {/* ReviewsCarousel */}
        <AnimatedSection className="bg-white dark:bg-black">
          <ReviewsCarousel />
        </AnimatedSection>

        {/* Spacer */}
        <Spacer />

        {/* Section 6 - Contactez-Nous */}
        <AnimatedSection className="bg-white">
          <Section
            title="Contactez-Nous"
            content="Pour toute question ou suggestion, n'hésitez pas à nous contacter via nos réseaux sociaux ou notre serveur Discord."
            bgColor="bg-white dark:bg-black"
          />
        </AnimatedSection>
      </div>
    </>
  );
};

export default HomeVisitor;
