"use client";

import React from "react";
import { ChevronRight } from "lucide-react"
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
import { FaSave } from "react-icons/fa";
import mapboxgl from "mapbox-gl";

export function NavMain({ items, setStartCoords, routeDuration, setEndCoords, setTransportMode, routeInstructions, transportMode, onSaveRoute, setWaypoints, addWaypointMarker, pois, places = [], startCoords, endCoords, waypoints }) {
  const { state } = useSidebar(); // "expanded" ou "collapsed"

  console.log("Données reçues dans NavMain :", { startCoords, endCoords, waypoints, transportMode, routeInstructions }); // Pour déboguer

  const handleSaveRoute = async () => {
    const routeData = {
      startCoords,
      endCoords,
      waypoints,
      transportMode,
      routeInstructions,
    };

    try {
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

      {/* Afficher la liste des établissements */}
      <div className="mt-4">
        <h4 className="font-semibold">Établissements à proximité :</h4>
        <ul className="mt-2">
          {places.length > 0 ? (
            places.map((place, index) => (
              <li key={index} className="p-2 bg-gray-200 rounded mb-2">
                <strong>{place.name}</strong>
                <p>{place.description}</p>
              </li>
            ))
          ) : (
            <li className="p-2 bg-gray-200 rounded mb-2">Aucun établissement trouvé.</li>
          )}
        </ul>
      </div>
    </SidebarGroup>
  );
}
