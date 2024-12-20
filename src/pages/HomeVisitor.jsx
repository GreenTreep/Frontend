import React, { useState } from "react";
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
import { FeaturesSectionDemo as Sd } from '@/components/landing/FeaturesSection';
import { useNavigate } from 'react-router-dom';
import debounce from "lodash/debounce";

const mapboxToken = "pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ";

const HomeVisitor = () => {
  const [startCity, setStartCity] = useState("");
  const [endCity, setEndCity] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const navigate = useNavigate();

  // Fonction pour récupérer les suggestions depuis Mapbox
  const fetchSuggestions = debounce(async (query, setSuggestions) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&autocomplete=true&access_token=${mapboxToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const suggestions = data.features.map((f) => ({
        name: f.place_name,
        coords: f.center,
      }));
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions :", error);
    }
  }, 300);

  const handleSearch = () => {
    if (startCity && endCity) {
      navigate(`/mapbox?startCity=${encodeURIComponent(startCity)}&endCity=${encodeURIComponent(endCity)}`);
    }
  };
  return (
    <>

      <AnimatedSection className="relative h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center text-center max-w-xl relative z-10 mb-8">

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 animate-slidein500 border backdrop-blur-sm border-green-500 p-6 rounded-md justify-center w-full max-w-md">
            {/* Champ avec suggestions - Ville de départ */}
            <div className="relative w-full">
              <Input
                  placeholder="Ville de départ"
                  value={startCity}
                  onChange={(e) => {
                    setStartCity(e.target.value);
                    fetchSuggestions(e.target.value, setStartSuggestions);
                  }}
              />
              {startSuggestions.length > 0 && (
                  <ul className="absolute bg-white border rounded-md mt-1 w-full z-10">
                    {startSuggestions.map((s, i) => (
                        <li
                            key={i}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                              setStartCity(s.name);
                              setStartSuggestions([]);
                            }}
                        >
                          {s.name}
                        </li>
                    ))}
                  </ul>
              )}
            </div>

            {/* Champ avec suggestions - Ville d'arrivée */}
            <div className="relative w-full">
              <Input
                  placeholder="Ville d'arrivée"
                  value={endCity}
                  onChange={(e) => {
                    setEndCity(e.target.value);
                    fetchSuggestions(e.target.value, setEndSuggestions);
                  }}
              />
              {endSuggestions.length > 0 && (
                  <ul className="absolute bg-white border rounded-md mt-1 w-full z-10">
                    {endSuggestions.map((s, i) => (
                        <li
                            key={i}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                              setEndCity(s.name);
                              setEndSuggestions([]);
                            }}
                        >
                          {s.name}
                        </li>
                    ))}
                  </ul>
              )}
            </div>
            <Button onClick={handleSearch} className="flex items-center justify-center">
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
