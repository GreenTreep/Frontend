"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MapDisplay from "@/components/sidebar/MapDisplay";
import mapboxgl from "mapbox-gl";
import { useTheme } from "@/hooks/theme-provider";

mapboxgl.accessToken = "pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ";

export default function Page() {
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [transportMode, setTransportMode] = useState("driving");
  const [routeInstructions, setRouteInstructions] = useState([]);

  // Utilisation du thème depuis le hook useTheme
  const { theme } = useTheme();
  const isDarkMode = (theme === "dark");

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);

  const fetchRoute = async () => {
    if (!startCoords || !endCoords) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      const route = data.routes[0]?.geometry;
      const steps = data.routes[0]?.legs[0]?.steps || [];

      if (route && mapRef.current) {
        if (mapRef.current.getLayer("route")) mapRef.current.removeLayer("route");
        if (mapRef.current.getSource("route")) mapRef.current.removeSource("route");

        mapRef.current.addSource("route", { type: "geojson", data: { type: "Feature", geometry: route } });
        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#007bff", "line-width": 5 },
        });

        mapRef.current.fitBounds([startCoords, endCoords], { padding: 50 });

        setRouteInstructions(
          steps.map((step) => ({
            instruction: step.maneuver.instruction,
            type: step.maneuver.type,
            modifier: step.maneuver.modifier,
          }))
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l’itinéraire :", error);
    }
  };

  useEffect(() => {
    fetchRoute();
  }, [startCoords, endCoords, transportMode]);

  return (
    <SidebarProvider>
      <AppSidebar
        setStartCoords={setStartCoords}
        setEndCoords={setEndCoords}
        setTransportMode={setTransportMode}
        transportMode={transportMode}
        routeInstructions={routeInstructions}
      />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <MapDisplay
              mapRef={mapRef}
              mapContainerRef={mapContainerRef}
              startCoords={startCoords}
              endCoords={endCoords}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
