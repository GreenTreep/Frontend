"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MapDisplay from "@/components/sidebar/MapDisplay";
import mapboxgl from "mapbox-gl";
import { useTheme } from "@/hooks/theme-provider";
import hotelIcon from '@iconify-icons/mdi/hotel';
import restaurantIcon from '@iconify-icons/mdi/restaurant';
import gasStationIcon from '@iconify-icons/mdi/gas-station';
import parkIcon from '@iconify-icons/mdi/parking';
import trailIcon from '@iconify-icons/mdi/hiking'; // Icône pour les sentiers
import startIcon from '@iconify-icons/mdi/map-marker-check'; // Exemple d'icône pour le départ
import endIcon from '@iconify-icons/mdi/flag-checkered'; // Exemple d'icône pour l'arrivée


mapboxgl.accessToken = "pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ";

// Définir une carte des couleurs par catégorie
const categoryColors = {
  hotel: '#800080',       // Bleu
  restaurant: '#FF4500',  // Rouge-orange
  gas_station: '#FFA500', // Orange
  park: '#1E90FF',        // Vert
  trail: '#32CD32',       // Vert clair pour les sentiers
};

export default function Page() {
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [transportMode, setTransportMode] = useState("driving");
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [routeDuration, setRouteDuration] = useState(null);
  const [pois, setPois] = useState({ hotel: [], restaurant: [], gas_station: [], park: [], trail: [] });

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markersRef = useRef([]); // Stocker les marqueurs pour nettoyage ultérieur
  const getStartEndMarkerElement = (type) => {
    const el = document.createElement('div');
    el.style.width = '40px';
    el.style.height = '40px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.cursor = 'pointer';

    const icon = type === 'start' ? startIcon : endIcon;

    if (icon) {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"></svg>`, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = icon.body;
      const pathElements = tempDiv.querySelectorAll('path');

      pathElements.forEach((path) => {
        path.removeAttribute('fill');
        svgElement.appendChild(path.cloneNode(true));
      });

      svgElement.setAttribute('fill', type === 'start' ? '#32CD32' : '#FF4500'); // Couleur pour le départ et l’arrivée

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      el.innerHTML = svgString;
    } else {
      el.style.backgroundColor = 'gray';
      el.style.borderRadius = '50%';
    }

    return el;
  };

  // Fonction pour générer les éléments de marqueur avec Iconify et DOMParser
  const getMarkerElement = (category) => {
    const el = document.createElement('div');
    el.style.width = '30px';
    el.style.height = '30px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.cursor = 'pointer';

    let icon;
    switch (category) {
      case 'hotel':
        icon = hotelIcon;
        break;
      case 'restaurant':
        icon = restaurantIcon;
        break;
      case 'gas_station':
        icon = gasStationIcon;
        break;
      case 'park':
        icon = parkIcon;
        break;
      case 'trail':
        icon = trailIcon;
        break;
      default:
        icon = null;
    }

    if (icon) {
      // Parse the SVG string
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"></svg>`, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');

      // Inject the icon body
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = icon.body;
      const pathElements = tempDiv.querySelectorAll('path');

      pathElements.forEach(path => {
        path.removeAttribute('fill'); // Remove existing fill
        svgElement.appendChild(path.cloneNode(true));
      });

      // Set the desired fill color
      svgElement.setAttribute('fill', categoryColors[category] || '#000000');

      // Serialize the SVG back to a string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);
      el.innerHTML = svgString;
    } else {
      // Fallback si aucune icône n'est trouvée
      el.style.backgroundColor = 'gray';
      el.style.borderRadius = '50%';
    }

    return el;
  };

  const fetchRoute = async () => {
    if (!startCoords || !endCoords) return;

    const url = `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      const route = data.routes[0]?.geometry;
      const steps = data.routes[0]?.legs[0]?.steps || [];
      const duration = data.routes[0]?.duration || null;

      if (route && mapRef.current) {
        if (mapRef.current.getLayer("route")) mapRef.current.removeLayer("route");
        if (mapRef.current.getSource("route")) mapRef.current.removeSource("route");

        mapRef.current.addSource("route", { type: "geojson", data: { type: "Feature", geometry: route } });
        mapRef.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: { "line-color": "#008000", "line-width": 5 },
        });

        mapRef.current.fitBounds([startCoords, endCoords], { padding: 50 });

        // Ajouter le marqueur de départ
        const startMarker = new mapboxgl.Marker(getStartEndMarkerElement('start'))
          .setLngLat(startCoords)
          .setPopup(new mapboxgl.Popup().setHTML('<strong>Point de Départ</strong>'))
          .addTo(mapRef.current);

        // Ajouter le marqueur d’arrivée
        const endMarker = new mapboxgl.Marker(getStartEndMarkerElement('end'))
          .setLngLat(endCoords)
          .setPopup(new mapboxgl.Popup().setHTML('<strong>Point d’Arrivée</strong>'))
          .addTo(mapRef.current);

        const formatDuration = (duration) => {
          const hours = Math.floor(duration / 3600);
          const minutes = Math.floor((duration % 3600) / 60);
          return `${hours > 0 ? `${hours} h ` : ""}${minutes} min`;
        };
        const formattedDuration = formatDuration(duration);

        setRouteInstructions(
          steps.map((step) => ({
            instruction: step.maneuver.instruction,
            type: step.maneuver.type,
            modifier: step.maneuver.modifier,
          }))
        );

        setRouteDuration(formattedDuration);
        fetchPois(route);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l’itinéraire :", error);
    }
  };


  const fetchPois = async (geometry) => {
    if (!geometry) return;

    const segmentLength = 10; // Nombre de points par segment (ajustez selon la densité de vos données)
    const coordinates = geometry.coordinates;
    const numSegments = Math.ceil(coordinates.length / segmentLength);

    const categories = ["hotel", "restaurant", "gas_station", "park", "trail"]; // Ajout de "trail"
    const poisByCategory = { hotel: [], restaurant: [], gas_station: [], park: [], trail: [] };

    clearMarkers(); // Nettoyer les anciens marqueurs

    for (let i = 0; i < numSegments; i++) {
      const segmentStart = i * segmentLength;
      const segmentEnd = Math.min((i + 1) * segmentLength, coordinates.length);
      const segmentCoords = coordinates.slice(segmentStart, segmentEnd);

      const bbox = calculateBoundingBox(segmentCoords);

      for (const category of categories) {
        const searchCategory = category === 'trail' ? 'trail,hiking_trail,path' : category;

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchCategory}.json?bbox=${bbox.join(",")}&limit=50&access_token=${mapboxgl.accessToken}`;
        try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.features) {
            const filteredPois = data.features.map((feature) => ({
              name: feature.text,
              coords: feature.geometry.coordinates,
              category,
            }));
            poisByCategory[category].push(...filteredPois);
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération des POI pour ${category}:`, error);
        }
      }
    }

    setPois(poisByCategory); // Mettre à jour les POI dans le state
    addMarkers(poisByCategory); // Ajouter les nouveaux marqueurs
  };


  const filterPoisByProximity = (pois, routeCoordinates, maxDistance) => {
    return pois.filter((poi) => {
      return routeCoordinates.some((coordinate) => {
        const distance = calculateDistance(coordinate, poi.coords);
        return distance <= maxDistance;
      });
    });
  };

  const calculateDistance = ([lng1, lat1], [lng2, lat2]) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371; // Rayon de la Terre en km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateBoundingBox = (coordinates) => {
    let minLng = Infinity,
      minLat = Infinity,
      maxLng = -Infinity,
      maxLat = -Infinity;

    coordinates.forEach(([lng, lat]) => {
      if (lng < minLng) minLng = lng;
      if (lat < minLat) minLat = lat;
      if (lng > maxLng) maxLng = lng;
      if (lat > maxLat) maxLat = lat;
    });

    return [minLng, minLat, maxLng, maxLat];
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  const addMarkers = (poisByCategory) => {
    const map = mapRef.current;

    Object.keys(poisByCategory).forEach((category) => {
      poisByCategory[category].forEach((poi) => {
        if (!poi.coords || !poi.name) return;

        const markerElement = getMarkerElement(category);

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat(poi.coords)
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${poi.name}</strong><br><em>${category}</em>`
            )
          )
          .addTo(map);

        markersRef.current.push(marker);
      });
    });
  };

  useEffect(() => {
    // Initialiser la carte Mapbox dans le composant MapDisplay
    // Assurez-vous que MapDisplay ne gère pas déjà la création de la carte
  }, []);

  useEffect(() => {
    if (pois) {
      clearMarkers();
      addMarkers(pois);

    }
  }, [pois]);

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
        routeDuration={routeDuration}
        pois={pois} // Ajout des POI dans la sidebar

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
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
