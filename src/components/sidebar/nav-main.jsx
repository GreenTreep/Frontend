"use client";

import React from "react";
import { ChevronRight } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavItinerary } from "@/components/sidebar/NavItinerary"
import { NavSettings } from "@/components/sidebar/NavSettings";
import { FaSave, FaBed } from "react-icons/fa";
import mapboxgl from "mapbox-gl";

export function NavMain({ items, setStartCoords, routeDuration, setEndCoords, setTransportMode, routeInstructions, transportMode, onSaveRoute, setWaypoints, addWaypointMarker, pois, places = [], startCoords, endCoords, waypoints, endCity }) {
  const { state } = useSidebar();
  const navigate = useNavigate();

  console.log("Données reçues dans NavMain :", { startCoords, endCoords, waypoints, transportMode, routeInstructions, endCity }); // Pour déboguer

  const handleSaveRoute = async () => {
    const routeData = {
      startCoords,
      endCoords,
      waypoints,
      transportMode,
      routeInstructions,
    };

    try {
      console.log(routeData);
      const response = await fetch('/api/save-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(routeData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'enregistrement du trajet');
      }

      const result = await response.json();
      alert('Trajet enregistré avec succès !');
      console.log(result); // Affichez le résultat si nécessaire
    } catch (error) {
      console.error('Erreur:', error);
      alert('Échec de l\'enregistrement du trajet.');
    }
  };

  const handleHebergementsClick = () => {
    console.log("Ville d'arrivée actuelle:", endCity); // Debug

    // Vérifier si nous avons une ville de destination
    if (!endCity || endCity.trim() === '') {
      alert('Veuillez d\'abord définir une destination');
      return;
    }

    // Créer un tableau des villes à rechercher
    const cities = [];
    
    // Extraire le nom de la ville (avant la première virgule)
    const cityName = endCity.split(',')[0].trim();
    console.log("Nom de la ville extrait:", cityName); // Debug
    
    // Ajouter la ville de destination
    cities.push(cityName);

    // Ajouter les villes de passage
    if (waypoints && waypoints.length > 0) {
      waypoints.forEach(waypoint => {
        if (waypoint.name) {
          const waypointCity = waypoint.name.split(',')[0].trim();
          cities.push(waypointCity);
        }
      });
    }

    // Vérifier si nous avons des villes à rechercher
    if (cities.length === 0) {
      alert('Aucune ville disponible pour la recherche d\'hébergements');
      return;
    }

    console.log("Villes à rechercher:", cities); // Debug

    // Encoder les villes pour l'URL
    const citiesParam = encodeURIComponent(JSON.stringify(cities));
    
    // Rediriger vers la page d'hébergements
    navigate(`/hebergements?cities=${citiesParam}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            open={state !== "collapsed" && item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                {item.showItinerary && (
                  <NavItinerary
                    setStartCoords={setStartCoords}
                    setEndCoords={setEndCoords}
                    setTransportMode={setTransportMode}
                    routeInstructions={routeInstructions}
                    transportMode={transportMode}
                    routeDuration={routeDuration}
                  />
                )}
                {item.showSettings && (
                  <NavSettings />
                )}
                {item.items && !item.showItinerary && !item.showSettings && (
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.url}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                )}
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        <button
          onClick={handleSaveRoute}
          className="bg-green-500 text-white p-2 rounded flex items-center"
        >
          <FaSave className="mr-2" /> Enregistrer le trajet
        </button>
      </SidebarMenu>

      {/* Bouton pour choisir les hébergements */}
      <div className="mt-4">
        <button
          onClick={handleHebergementsClick}
          className="w-full bg-blue-500 text-white p-3 rounded flex items-center justify-center hover:bg-blue-600 transition-colors"
        >
          <FaBed className="mr-2" /> Choisir les hébergements
        </button>
      </div>
    </SidebarGroup>
  );
}
