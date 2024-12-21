"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MapDisplay from "@/components/sidebar/MapDisplay";
import mapboxgl from "mapbox-gl";
import { useTheme } from "@/hooks/theme-provider";
import { useLocation } from "react-router-dom";

mapboxgl.accessToken = "pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ";

const fetchCoordinatesFromCity = async (city) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.features[0]?.center || null;
  } catch (error) {
    console.error(`Erreur lors de la récupération des coordonnées pour ${city}:`, error);
    return null;
  }
};

export default function Page() {
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [transportMode, setTransportMode] = useState("driving");
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [pois, setPois] = useState({ hotel: [], restaurant: [], gas_station: [], park: [] });
  const [parcoursData, setParcoursData] = useState(null); // État pour les données GeoJSON

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const markersRef = useRef([]); // Stocker les marqueurs pour nettoyage ultérieur
  const location = useLocation(); // Lire les paramètres de l'URL
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const queryParams = new URLSearchParams(location.search);
  const startCity = queryParams.get("startCity");
  const endCity = queryParams.get("endCity");

  useEffect(() => {
    const initializeCoords = async () => {
      if (startCity) {
        const start = await fetchCoordinatesFromCity(startCity);
        setStartCoords(start);
      }
      if (endCity) {
        const end = await fetchCoordinatesFromCity(endCity);
        setEndCoords(end);
      }
    };

    initializeCoords();
  }, [startCity, endCity]);


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

        fetchPois(route); // Rechercher les POI
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l’itinéraire :", error);
    }
  };

  const fetchPois = async (geometry) => {
    if (!geometry) return;

    const bbox = calculateBoundingBox(geometry.coordinates);
    const categories = ["hotel", "restaurant", "gas_station", "park"];
    const poisByCategory = { hotel: [], restaurant: [], gas_station: [], park: [] };

    clearMarkers(); // Nettoyer les anciens marqueurs

    for (const category of categories) {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${category}.json?bbox=${bbox.join(",")}&access_token=${mapboxgl.accessToken}`;
      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features) {
          const filteredPois = filterPoisByProximity(
              data.features.map((feature) => ({
                name: feature.text,
                coords: feature.geometry.coordinates,
                category,
              })),
              geometry.coordinates,
              5 // Distance maximale en kilomètres
          );
          poisByCategory[category] = filteredPois;
        }
      } catch (error) {
        console.error(`Erreur lors de la récupération des POI pour ${category}:`, error);
      }
    }

    setPois(poisByCategory); // Mettre à jour les POI dans le state
    addMarkers(poisByCategory); // Ajouter les nouveaux marqueurs
    // addParcoursMarkers(); // Ajouter les marqueurs pour les parcours
  };

  const addParcoursMarkers = (parcoursData) => {
    if (!parcoursData || !parcoursData.features) return;
  
    const map = mapRef.current;
    const allParcours = [];
  
    // Préparation des données pour les clusters
    parcoursData.features.forEach((parcours) => {
      const { coordinates } = parcours.geometry;
      const { name, distance } = parcours.properties;
      const [lat, lon] = coordinates;
  
      allParcours.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        properties: {
          name,
          distance, // Garder la distance pour l'affichage
        },
      });
    });
  
    // Ajouter une source GeoJSON pour les clusters des parcours
    map.addSource('parcours', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: allParcours,
      },
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50,
    });
  
    // Ajouter des couches pour les clusters des parcours
    map.addLayer({
      id: 'parcours-clusters',
      type: 'circle',
      source: 'parcours',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': '#51bbd6',
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['get', 'point_count'],
          0,
          20,
          100,
          40,
        ],
      },
    });
  
    // Ajouter une couche pour afficher le nombre de points dans chaque cluster
    map.addLayer({
      id: 'parcours-cluster-count',
      type: 'symbol',
      source: 'parcours',  
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}', // Afficher le nombre abrégé de points dans le cluster
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12,
      },
      paint: {
        'text-color': '#ffffff',
      },
    });
  
    // Ajouter une couche pour les parcours individuels (non clusterisés)
    map.addLayer({
      id: 'parcours-individual-points',
      type: 'circle',
      source: 'parcours',
      filter: ['!has', 'point_count'],
      paint: {
        'circle-color': '#f28cb1',
        'circle-radius': 15,
      },
    });
  
    // Événement de clic sur le cluster pour zoomer
    map.on('click', 'parcours-cluster-count', (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: ['parcours-cluster-count'],
      });
      const clusterId = features[0].properties.cluster_id;
      map.getSource('parcours').getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
  
        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom,
        });
      });
    });
  
    // Événement de clic sur les points individuels pour afficher un popup avec des détails
    map.on('click', 'parcours-individual-points', (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const name = e.features[0].properties.name;
      const distance = e.features[0].properties.distance;
  
      // Conversion de la distance en kilomètres pour l'afficher dans le popup
      const distanceInKm = (distance / 1000).toFixed(3);
  
      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(`
          <strong>${name}</strong><br>
          <em>Distance: ${distanceInKm} km</em>
        `)
        .addTo(map);
    });
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

        const marker = new mapboxgl.Marker({
          color: category === "hotel"
              ? "blue"
              : category === "restaurant"
                  ? "red"
                  : category === "park"
                      ? "green"
                      : "orange",
        })
            .setLngLat(poi.coords)
            .setPopup(
                new mapboxgl.Popup().setHTML(`
              <strong>${poi.name}</strong><br>
              <em>${category}</em>
            `)
            )
            .addTo(map);

        markersRef.current.push(marker);
      });
    });
  };

  useEffect(() => {
    // Charger le fichier GeoJSON
    fetch("/data_extraction/marqueurs3.geojson")
      .then((response) => response.json())
      .then((data) => {
        setParcoursData(data);
        addParcoursMarkers(data); // Appeler la fonction pour ajouter les marqueurs
      })
      .catch((error) => console.error("Erreur lors de la récupération des données GeoJSON:", error));
  
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
          pois={pois} // Ajout des POI dans la sidebar
        />
    
        <SidebarInset>
          {/* SidebarTrigger uniquement */}
          <div className="absolute top-2 left-2 z-10">
            <SidebarTrigger className="p-2 rounded-full  shadow-md" />
          </div>
    
          {/* MapDisplay pour prendre tout l'espace */}
          <div
            className="flex flex-1 relative min-h-screen"
            style={{ height: "100vh" }} // S'assure que la carte prend toute la hauteur
          >
            <MapDisplay
              mapRef={mapRef}
              mapContainerRef={mapContainerRef}
              startCoords={startCoords}
              endCoords={endCoords}
              isDarkMode={isDarkMode}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    );

  };
    
