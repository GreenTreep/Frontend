"use client";

import React, { useState, useRef } from "react";
import debounce from "lodash/debounce";
import { MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@iconify/react";

// Import du Dialog depuis shadcn/ui
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";

mapboxgl.accessToken = "votre_token_mapbox";

const InputWithSuggestions = ({ placeholder, value, onChange, suggestions, onSelect }) => (
  <div className="relative">
    <Input
      className="w-full p-2 border rounded"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {suggestions.length > 0 && (
      <ul className="absolute bg-white border mt-1 w-full z-10 max-h-40 overflow-auto text-sm">
        {suggestions.map((s, i) => (
          <li
            key={i}
            className="p-2 hover:bg-gray-200 cursor-pointer"
            onClick={() => onSelect(s)}
          >
            {s.name}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const getManeuverIcon = (type, modifier) => {
  if (type === 'depart') return 'mdi:map-marker';
  if (type === 'arrive') return 'mdi:flag-checkered';
  if (type === 'turn') {
    if (modifier === 'left') return 'mdi:arrow-left';
    if (modifier === 'right') return 'mdi:arrow-right';
    if (modifier === 'straight') return 'mdi:arrow-up';
    if (modifier === 'uturn') return 'mdi:arrow-u-left-top';
  }
  if (type === 'roundabout') return 'mdi:arrow-u-right-top';
  return 'mdi:circle-outline';
};

export function NavItinerary({ setStartCoords, setEndCoords, routeDuration, setTransportMode, routeInstructions, transportMode }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [startSuggestions, setStartSuggestions] = useState([]);
  const [endSuggestions, setEndSuggestions] = useState([]);
  const suggestionCache = useRef({});

  const fetchSuggestions = debounce(async (query, setSuggestions) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    if (suggestionCache.current[query]) {
      setSuggestions(suggestionCache.current[query]);
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      query
    )}.json?types=place&autocomplete=true&access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Erreur API Mapbox Geocoding");
      const data = await response.json();
      const suggestions = data.features.map((f) => ({
        name: f.place_name,
        coords: f.center,
      }));
      suggestionCache.current[query] = suggestions;
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions :", error);
      setSuggestions([]);
    }
  }, 300);

  const modes = [
    { mode: 'driving', icon: 'mdi:car' },
    { mode: 'cycling', icon: 'mdi:bike' },
    { mode: 'walking', icon: 'mdi:walk' },
  ];

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <MapPin className="mr-2" />
              <InputWithSuggestions
                placeholder="Ville de départ"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                  fetchSuggestions(e.target.value, setStartSuggestions);
                }}
                suggestions={startSuggestions}
                onSelect={(s) => {
                  setStart(s.name);
                  setStartCoords(s.coords);
                  setStartSuggestions([]);
                }}
              />
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2" />
              <InputWithSuggestions
                placeholder="Ville d'arrivée"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                  fetchSuggestions(e.target.value, setEndSuggestions);
                }}
                suggestions={endSuggestions}
                onSelect={(s) => {
                  setEnd(s.name);
                  setEndCoords(s.coords);
                  setEndSuggestions([]);
                  // Par défaut, on passe en "walking" dès qu'une destination est choisie.
                  setTransportMode("walking");
                }}
              />
            </div>

            {/* Modes de transport */}
            <div className="flex justify-around mt-4">
              {modes.map((m) => (
                <Button
                  key={m.mode}
                  onClick={() => setTransportMode(m.mode)}
                  className={`flex items-center justify-center rounded-full ${transportMode === m.mode ? "text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                >
                  <Icon icon={m.icon} className="iconify text-xl" />
                </Button>
              ))}
            </div>
            {/* Durée du trajet */}
            {routeDuration && routeDuration != null && (
              <div className="mt-4 text-sm">
                <h4 className="font-semibold mb-2 text-base">Durée du trajet :</h4>
                <p>{routeDuration}</p>
              </div>
            )}
            {/* Instructions */}
            {routeInstructions && routeInstructions.length > 0 && (
              <div className="mt-4 text-sm leading-tight">
                <h4 className="font-semibold mb-2 text-base">Instructions du trajet :</h4>
                {/* Conteneur pour instructions, hauteur fixe et overflow hidden */}
                <div className="relative h-20 overflow-hidden">
                  <ul className="space-y-1 relative z-0">
                    {routeInstructions.map((step, index) => (
                      <li key={index} className="flex items-center">
                        <Icon icon={getManeuverIcon(step.type, step.modifier)} className="mr-2 text-sm" />
                        <span className="text-xs">{step.instruction}</span>
                      </li>
                    ))}
                  </ul>
                  {/* Overlay avec dégradé et blur + bouton "Voir tout l'itinéraire" */}
                  <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-white to-transparent dark:from-gray-900 dark:to-transparent backdrop-blur-sm flex items-end justify-center p-2 z-10">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" className="underline text-sm p-0 h-auto">
                          Voir tout l'itinéraire
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Itinéraire complet</DialogTitle>
                          <DialogDescription>
                            Voici la liste complète des instructions du trajet.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-96 overflow-auto space-y-1 mt-4">
                          <ul>
                            {routeInstructions.map((step, index) => (
                              <li key={index} className="flex items-center mb-1">
                                <Icon icon={getManeuverIcon(step.type, step.modifier)} className="mr-2 text-sm" />
                                <span className="text-sm">{step.instruction}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <DialogFooter className="flex justify-between items-center">
                          <p className="text-sm text-start flex-1">Durée du trajet : {routeDuration}</p>
                          <DialogClose asChild>
                            <Button variant="secondary">Fermer</Button>
                          </DialogClose>
                        </DialogFooter>

                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            )}
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
