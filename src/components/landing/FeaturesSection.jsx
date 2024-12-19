import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import { Link } from 'react-router-dom';
import  Equipment3D  from "./3dcomponents/Equipment3D";


export function FeaturesSectionDemo() {
  const features = [
    {
      title: "Suivez Vos Randonnées",
      description:
        "Surveillez et enregistrez facilement vos itinéraires de randonnée grâce à notre système de suivi intuitif.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b border-green-400 lg:border-r dark:border-green-900",
    },
    {
      title: "Mises à Jour Météo en Temps Réel",
      description:
        "Restez informé avec les prévisions météorologiques actualisées, adaptées à vos itinéraires de randonnée.",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 border-green-400 lg:col-span-2 dark:border-green-900",
    },
    {
      title: "Partagez Vos Aventures sur YouTube",
      description:
        "Connectez-vous avec d'autres randonneurs et partagez vos aventures via notre chaîne YouTube intégrée.",
      skeleton: <SkeletonThree />,
      className:
        "col-span-1 lg:col-span-3 lg:border-r border-green-400 dark:border-green-900",
    },
    {
      title: "Recommandations d'Équipement",
      description:
        "Obtenez des suggestions personnalisées d'équipement pour vous assurer d'être bien préparé pour chaque randonnée.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-green-400 border-b lg:border-none",
    },
  ];

  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <div className="px-8">
        <h4
          className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
          Rempli de Fonctionnalités pour Chaque Randonneur
        </h4>

        <p
          className="text-sm lg:text-base max-w-2xl my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
          Du suivi des sentiers au partage communautaire, GreenTrip offre tout ce dont vous avez besoin pour votre prochaine aventure de randonnée.
        </p>
      </div>
      <div className="relative">
        <div
          className="grid grid-cols-1 lg:grid-cols-6 border-green-400 mt-12 xl:border rounded-md dark:border-green-900">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({ children, className }) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }) => {
  return (
    <p
      className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }) => {
  return (
    <p
      className={cn(
        "text-sm md:text-base max-w-4xl text-left mx-auto",
        "text-neutral-500 text-center font-normal dark:text-neutral-300",
        "text-left max-w-sm mx-0 md:text-sm my-2"
      )}>
      {children}
    </p>
  );
};

/* Skeletons pour les Fonctionnalités de Base */

/* SkeletonOne - Suivez Vos Randonnées */
export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div
        className="w-full p-5 mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2">
          {/* Image de Suivi de Sentier */}
          <img
            src="https://images.squarespace-cdn.com/content/v1/5eabefd1b259fc1e715e7e3b/aea49c69-b6b0-463b-b41a-c43f261768de/OS+X+MR+Edited-16.jpg"
            alt="Suivi de Sentier"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-left-top rounded-sm" />
        </div>
      </div>
      <div
        className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div
        className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

/* SkeletonTwo - Mises à Jour Météo en Temps Réel */
export const SkeletonTwo = () => {
  const weatherIcons = [
    "https://images.squarespace-cdn.com/content/v1/5eabefd1b259fc1e715e7e3b/aea49c69-b6b0-463b-b41a-c43f261768de/OS+X+MR+Edited-16.jpg",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=3425&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=3540&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=3387&auto=format&fit=crop",
    "https://www.science-et-vie.com/wp-content/uploads/scienceetvie/2021/07/comment-prevoir-meteo-scaled.jpg",
    "https://www.lademeureduparc.fr/wp-content/uploads/2024/05/Les-meilleurs-road-trips-en-Europe-pour-un-ete-inoubliable.png"
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };

  return (
    <div
      className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      {/* Icônes ou Graphiques Météo */}
      <div className="flex flex-row -ml-20">
        {weatherIcons.map((img, idx) => (
          <motion.div
            variants={imageVariants}
            key={"weather-icons-first" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden">
            <img
              src={img}
              alt="Icône Météo"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0" />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {weatherIcons.map((img, idx) => (
          <motion.div
            key={"weather-icons-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden">
            <img
              src={img}
              alt="Icône Météo"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0" />
          </motion.div>
        ))}
      </div>
      <div
        className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
      <div
        className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent h-full pointer-events-none" />
    </div>
  );
};

/* SkeletonThree - Partagez Vos Aventures sur YouTube */
export const SkeletonThree = () => {
  return (
    <Link
      to="https://www.youtube.com/watch?v=PyQQJWmV1LE"
      target="__blank"
      className="relative flex gap-10 h-full group/img">
      <div
        className="w-full mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2 relative">
          {/* Icône YouTube */}
          <IconBrandYoutubeFilled className="h-20 w-20 absolute z-10 inset-0 text-red-500 m-auto" />
          <img
            src="https://i.natgeofe.com/n/7afda449-1780-4938-8342-2abe32326c86/Montblanchike.jpg" 
            alt="Vidéo YouTube de Randonnée"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/img:blur-md transition-all duration-200" />
        </div>
      </div>
    </Link>
  );
};

export const SkeletonFour = () => {
    const equipmentModels = ["backpack", "boots"]; // Identifiants des modèles
  
    return (
      <div className="relative flex py-8 px-2 gap-10 h-full">
        <div className="w-full p-5 mx-auto bg-transparent dark:bg-neutral-900 shadow-2xl group h-full flex flex-col items-center justify-center">
          <div className="flex flex-col space-y-4 items-center">
            {equipmentModels.map((model, idx) => (
              <div key={idx} className="h-40 w-40 md:h-60 md:w-60">
                <Equipment3D model={model} />
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 z-40 inset-x-0 h-40 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
        <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
      </div>
    );
  };

