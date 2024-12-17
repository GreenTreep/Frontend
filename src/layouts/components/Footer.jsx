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
    <footer className="bg-green-300 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Section Company */}
          <div className="w-full md:w-1/2">
            <h4 className="text-xl md:text-2xl font-modern-era-medium text-brand-dark mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/en-fr/about"
                  className="text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13 hover:opacity-70 transition duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="https://www.hellogetsafe.com/en-fr/press"
                  className="text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13 hover:opacity-70 transition duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Press
                </Link>
              </li>
              <li>
                <Link
                  to="/en-fr/career"
                  className="text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13 hover:opacity-70 transition duration-300"
                >
                  Career
                </Link>
              </li>
            </ul>
          </div>

          {/* Section Get our App */}
          <div className="w-full md:w-1/2">
            {/* Sélecteur de Région avec ShadCN Dropdown */}
            <div className="mb-6">
              <label htmlFor="regionDropdown" className="block text-base md:text-lg lg:text-xl leading-7 md:leading-11 lg:leading-13 font-modern-era-medium text-brand-dark mb-2">
                Region
              </label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button id="regionDropdown" aria-label="Region" className="w-1/2 bg-neutral-900 flex items-center justify-between">
                    <span className=" text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13">{region}</span>
                    <Icon
                      icon="mdi-light:chevron-down"
                      className="w-4 h-4  transition-transform duration-300"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onSelect={() => handleRegionChange('France')}>
                    France
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => handleRegionChange('Suisse')}>
                    Suisse
                  </DropdownMenuItem>
                  {/* Ajoutez d'autres régions si nécessaire */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Liens vers les Stores d'Applications */}
            <h4 className="text-xl md:text-2xl font-modern-era-medium text-brand-dark mb-4">Get our App</h4>
            <div className="flex gap-4">
              <a
                href="https://app.adjust.com/sdr8jjh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-70 transition duration-300"
              >
                <Icon icon="mdi:apple" className="w-8 h-8 text-brand-dark" />
                <span className="text-ui-dark text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13">App Store</span>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=de.getsafe.nxt&gl=DE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 hover:opacity-70 transition duration-300"
              >
                <Icon icon="mdi:google-play" className="w-8 h-8 text-brand-dark" />
                <span className="text-ui-dark text-sm md:text-base lg:text-xl leading-7 md:leading-11 lg:leading-13">Google Play</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bas */}
        <div className="mt-12 border-t border-brand-dark pt-4 text-center text-sm text-brand-dark">
          GreenTrip | Tous droits réservés. &copy; 2024
        </div>
      </div>
    </footer>
  );
};

export default Footer;
