// Footer.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const Footer = () => {
  const [region, setRegion] = useState('France');

  const handleRegionChange = (newRegion) => {
    setRegion(newRegion);
  };

  return (
    <footer className="bg-green-300 dark:bg-green-800 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Section Company */}
          <div className="w-full md:w-1/2">
            <h4 className="text-xl md:text-2xl font-modern-era-medium text-brand-dark dark:text-white mb-4">
              Entreprise
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/en-fr/about"
                  className="text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13 hover:opacity-70 transition duration-300 text-brand-dark dark:text-gray-200"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link
                  to="/carbon-footprint"
                  className="text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13 hover:opacity-70 transition duration-300 text-brand-dark dark:text-gray-200"
                >
                  Empreinte carbone
                </Link>
              </li>
              <li>
                <Link
                  to="/eco-news"
                  className="text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13 hover:opacity-70 transition duration-300 text-brand-dark dark:text-gray-200"
                >
                  Éco-actualités
                </Link>
              </li>
            </ul>
          </div>

          {/* Section Get our App */}
          <div className="w-full md:w-1/2">
            {/* Sélecteur de Région */}
            <div className="mb-6">
              <label
                htmlFor="regionDropdown"
                className="block text-base md:text-lg lg:text-xl leading-7 md:leading-11 lg:leading-13 font-modern-era-medium text-brand-dark dark:text-white mb-2"
              >
                Région
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    id="regionDropdown"
                    aria-label="Région"
                    className="w-1/2 bg-neutral-900 dark:bg-neutral-700 flex items-center justify-between"
                  >
                    <span className="text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13 text-white">
                      {region}
                    </span>
                    <Icon
                      icon="mdi-light:chevron-down"
                      className="w-4 h-4 transition-transform duration-300 text-white"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white dark:bg-gray-700">
                  <DropdownMenuItem
                    onSelect={() => handleRegionChange('France')}
                    className="text-brand-dark dark:text-gray-200"
                  >
                    France
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => handleRegionChange('Suisse')}
                    className="text-brand-dark dark:text-gray-200"
                  >
                    Suisse
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Liens vers les Stores d'Applications */}
            <h4 className="text-xl md:text-2xl font-modern-era-medium text-brand-dark dark:text-white mb-4">
              Get our App (soon)
            </h4>
            <div className="flex gap-4">
              <a
                href="https://app.adjust.com/sdr8jjh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-70 transition duration-300"
              >
                <Icon icon="mdi:apple" className="w-8 h-8 text-brand-dark dark:text-gray-200" />
                <span className="text-ui-dark dark:text-gray-200 text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13">
                  App Store
                </span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=de.getsafe.nxt&gl=DE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-70 transition duration-300"
              >
                <Icon icon="mdi:google-play" className="w-8 h-8 text-brand-dark dark:text-gray-200" />
                <span className="text-ui-dark dark:text-gray-200 text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13">
                  Google Play
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bas */}
        <div className="mt-12 border-t border-brand-dark dark:border-gray-600 pt-4 text-center text-sm text-brand-dark dark:text-gray-200">
          GreenTrip | Tous droits réservés. &copy; 2024
        </div>
      </div>
    </footer>
  );
};

export default Footer;
