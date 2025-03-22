"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import MapDisplay from "@/components/sidebar/MapDisplay";
import mapboxgl from "mapbox-gl";
import { useTheme } from "@/hooks/theme-provider";
import { useLocation } from "react-router-dom";
import { NavMain } from "@/components/sidebar/nav-main";
import { FaTrash, FaEye, FaEyeSlash } from "react-icons/fa";

mapboxgl.accessToken = "pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ";

const fetchCoordinatesFromCity = async (city) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    const coords = data.features[0]?.center || null;
    if (coords && Array.isArray(coords) && coords.length === 2) {
      return coords; // Assurez-vous que les coordonnées sont au format [lng, lat]
    }
    return null;
  } catch (error) {
    console.error(`Erreur lors de la récupération des coordonnées pour ${city}:`, error);
    return null;
  }
};

export default function Page() {
  const [startCoords, setStartCoords] = useState(null);
  const [endCoords, setEndCoords] = useState(null);
  const [waypoints, setWaypoints] = useState([]); // Déclaration de setWaypoints
  const [transportMode, setTransportMode] = useState("driving");
  const [routeInstructions, setRouteInstructions] = useState([]);
  const [parcoursData, setParcoursData] = useState(null); // État pour les données GeoJSON
  const [query, setQuery] = useState(""); // État pour le champ de saisie
  const [suggestions, setSuggestions] = useState([]); // État pour les suggestions
  const [showWaypoints, setShowWaypoints] = useState(true); // État pour contrôler la visibilité des villes de passage
  const [showWaypointsBox, setShowWaypointsBox] = useState(true); // État pour contrôler la visibilité de la boîte des villes de passage
  const [places, setPlaces] = useState([]); // Initialisez places avec un tableau vide

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

  // Ajoutez un autre useEffect pour mettre à jour le trajet
  useEffect(() => {
    fetchRoute(waypoints); // Appelez fetchRoute avec les waypoints actuels
  }, [startCoords, endCoords, waypoints, transportMode]); // Ajoutez transportMode ici

  useEffect(() => {
    if (startCoords && endCoords) {
      fetchRoute(waypoints); // Appelez fetchRoute avec les waypoints actuels
    }
  }, [startCoords, endCoords, waypoints, transportMode]); // Ajoutez transportMode ici

  const fetchSuggestions = async (query) => {
    if (query.length < 3) {
      setSuggestions([]); // Ne pas afficher de suggestions si la requête est trop courte
      return;
    }

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      const results = data.features.map((feature) => ({
        name: feature.place_name,
        coords: feature.geometry.coordinates,
      }));
      setSuggestions(results); // Mettre à jour l'état avec les suggestions
    } catch (error) {
      console.error("Erreur lors de la récupération des suggestions :", error);
    }
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    fetchSuggestions(value); // Appeler la fonction pour récupérer les suggestions
  };

  const addWaypoint = (suggestion) => {
    if (suggestion) {
      const exists = waypoints.some((waypoint) => waypoint.name === suggestion.name);
      if (exists) {
        alert("Cette ville est déjà ajoutée comme point de passage.");
        return;
      }

      // Ajoutez la ville à la liste des waypoints
      setWaypoints((prevWaypoints) => {
        const newWaypoints = [
          ...prevWaypoints,
          { name: suggestion.name, coords: suggestion.coords },
        ];

        // Mettre à jour le chemin après l'ajout
        fetchRoute(newWaypoints); // Passez les nouveaux waypoints à fetchRoute

        return newWaypoints;
      });

      // Créer un marqueur jaune sur la carte
      const marker = new mapboxgl.Marker({ color: "yellow" })
        .setLngLat(suggestion.coords)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${suggestion.name}</strong>`))
        .addTo(mapRef.current);
      
      markersRef.current.push(marker); // Ajouter le marqueur à la référence

      setQuery("");
      setSuggestions([]);
    }
  };

  const removeWaypoint = (index) => {
    setWaypoints((prevWaypoints) => {
      const newWaypoints = prevWaypoints.filter((_, i) => i !== index);
      
      if (markersRef.current[index]) {
        markersRef.current[index].remove(); // Supprimez le marqueur de la carte
        markersRef.current.splice(index, 1); // Supprimez le marqueur de la référence
      }
      
      // Mettre à jour le chemin après la suppression
      fetchRoute(newWaypoints); // Passez les nouveaux waypoints à fetchRoute

      return newWaypoints;
    });
  };

  const fetchRoute = async (waypointsToUse) => {
    if (!startCoords || !endCoords) {
      console.warn("Les coordonnées de départ ou d'arrivée ne sont pas définies.");
      return; // Ne pas continuer si les coordonnées ne sont pas disponibles
    }

    const waypointCoords = waypointsToUse.map((waypoint) => waypoint.coords);
    const routePath = [startCoords, ...waypointCoords, endCoords]
        .map(([lng, lat]) => `${lng},${lat}`)
        .join(";");

    console.log("Coordonnées du trajet :", routePath); // Ajoutez cette ligne pour déboguer

    const url = `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${routePath}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (!data.routes || data.routes.length === 0) {
        console.warn("Aucune route trouvée.");
        return; // Ne pas continuer si aucune route n'est trouvée
      }

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

        setRouteInstructions(
            steps.map((step) => ({
              instruction: step.maneuver.instruction,
              type: step.maneuver.type,
              modifier: step.maneuver.modifier,
            }))
        );

        // Récupérer les hôtels à proximité du trajet
        const hotels = await fetchNearbyHotels(waypointCoords);
        addHotelMarkers(hotels); // Ajouter les marqueurs pour les hôtels

        // Récupérer les établissements dans la ville d'arrivée
        const arrivalPlaces = await fetchPlacesInCities([endCity]);
        addHotelMarkers(arrivalPlaces); // Ajouter les marqueurs pour les établissements dans la ville d'arrivée

        // Récupérer les établissements proches du trajet
        const routeCoords = await getRouteCoordinates(startCoords, endCoords, waypointsToUse);
        const nearbyPlaces = await fetchNearbyPlaces(routeCoords);
        addHotelMarkers(nearbyPlaces); // Ajouter les marqueurs pour les établissements proches
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'itinéraire :", error);
    }
  };

  const addParcoursMarkers = (parcoursData) => {
    if (!parcoursData || !parcoursData.features) return;
  
    const map = mapRef.current;
    const allParcours = [];
  
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
          distance,
        },
      });
    });
  
    // Vérifiez si la source existe déjà avant de l'ajouter
    if (map.getSource('parcours')) {
      map.removeSource('parcours');
    }
  
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
  };

  const clearMarkers = () => {
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];
  };

  const fetchNearbyHotels = async (routeCoordinates) => {
    if (!routeCoordinates || routeCoordinates.length === 0) return [];

    const hotels = [];
    
    // Parcourez chaque segment de l'itinéraire
    for (let i = 0; i < routeCoordinates.length - 1; i++) {
      const [start, end] = [routeCoordinates[i], routeCoordinates[i + 1]];
      const midLng = (start[0] + end[0]) / 2;
      const midLat = (start[1] + end[1]) / 2;

      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/hotel.json?proximity=${midLng},${midLat}&access_token=${mapboxgl.accessToken}`;

      console.log("URL Mapbox :", url); // Ajoutez cette ligne pour déboguer

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features) {
          const segmentHotels = data.features.map((feature) => ({
            name: feature.text || "Hôtel sans nom",
            coords: feature.geometry.coordinates,
          }));
          hotels.push(...segmentHotels); // Ajouter les hôtels récupérés à la liste
    } else {
          console.warn("Aucun hôtel trouvé à proximité.");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des hôtels :", error);
      }
    }

    console.log("Hôtels récupérés le long du trajet :", hotels); // Affichez la liste des hôtels récupérés
    return hotels; // Retourner la liste des hôtels
  };

  const addHotelMarkers = (places) => {
    const map = mapRef.current;

    if (!Array.isArray(places)) {
      console.warn("Les établissements doivent être un tableau.");
      return; // Ne pas continuer si places n'est pas un tableau
    }

    // Supprimer les anciens marqueurs avant d'ajouter de nouveaux
    clearMarkers();

    places.forEach((place) => {
      const marker = new mapboxgl.Marker({ color: "blue" }) // Couleur pour les établissements
        .setLngLat(place.coords)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${place.name}</strong>`))
        .addTo(map);

      markersRef.current.push(marker); // Ajouter le marqueur à la référence
    });
  };

  const fetchPlacesInCities = async (cities) => {
    const allPlaces = [];

    for (const city of cities) {
      const coords = await fetchCoordinatesFromCity(city);
      if (!coords) continue; // Passer à la prochaine ville si les coordonnées ne sont pas disponibles

      const [lng, lat] = coords;
      const url = `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent("restaurant")}&proximity=${lng},${lat}&access_token=${mapboxgl.accessToken}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features) {
          const places = data.features.map((feature) => ({
            name: feature.properties.name || "Établissement sans nom",
            coords: feature.geometry.coordinates,
            description: feature.properties.description || "Aucune description disponible",
            image: feature.properties.image || "URL_de_l_image_par_défaut.jpg",
          }));
          allPlaces.push(...places); // Ajouter les établissements récupérés à la liste
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des établissements :", error);
      }
    }

    return allPlaces; // Retourner la liste de tous les établissements
  };

  const fetchNearbyPlaces = async (routeCoords) => {
    const places = [];
    for (const coord of routeCoords) {
      const [lng, lat] = coord; // Décomposer les coordonnées
      const url = `https://api.mapbox.com/search/searchbox/v1/forward?q=${encodeURIComponent("restaurant")}&proximity=${lng},${lat}&access_token=${mapboxgl.accessToken}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.features) {
          const nearbyPlaces = data.features.map((feature) => ({
            name: feature.properties.name || "Établissement sans nom",
            coords: feature.geometry.coordinates,
            description: feature.properties.description || "Aucune description disponible",
            image: feature.properties.image || "URL_de_l_image_par_défaut.jpg",
          }));
          places.push(...nearbyPlaces); // Ajouter les établissements à la liste
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des établissements :", error);
      }
    }
    return places; // Retourner la liste des établissements
  };

  useEffect(() => {
    const fetchPlaces = async () => {
      const cities = [endCity, ...waypoints.map(waypoint => waypoint.name)]; // Inclure la ville d'arrivée et les villes de passage
      const placesInCities = await fetchPlacesInCities(cities);
      setPlaces(placesInCities); // Mettez à jour l'état avec les établissements récupérés
      addHotelMarkers(placesInCities); // Ajouter les marqueurs pour les établissements récupérés
    };

    fetchPlaces();
  }, [endCoords, waypoints]); // Déclencher cet effet lorsque endCoords ou waypoints changent

  return (
      <SidebarProvider>
        <AppSidebar
            setStartCoords={setStartCoords}
            setEndCoords={setEndCoords}
          waypoints={waypoints}
          setWaypoints={setWaypoints}
            setTransportMode={setTransportMode}
            transportMode={transportMode}
            routeInstructions={routeInstructions}
            places={places}
            startCoords={startCoords}
            endCoords={endCoords}
        />

        <SidebarInset>
          <div className="absolute top-2 left-2 z-10">
            <SidebarTrigger className="p-2 rounded-full shadow-md" />
          </div>

          <div className="flex flex-1 relative min-h-screen" style={{ height: "100vh" }}>
            <MapDisplay
                mapRef={mapRef}
                mapContainerRef={mapContainerRef}
                startCoords={startCoords}
                endCoords={endCoords}
              isDarkMode={isDarkMode}
                waypoints={waypoints}
            />
          </div>

          {/* Boîte pour ajouter une ville de passage */}
          {showWaypointsBox && ( // Affichez la boîte seulement si showWaypointsBox est vrai
          <div className="absolute top-20 left-2 bg-white p-4 rounded shadow w-80">
            <h4 className="font-semibold">Ajouter une ville (point de passage)</h4>
            <div className="flex items-center mb-2">
            <input
                type="text"
                placeholder="Ajouter une ville (point de passage)"
                className="p-2 border border-gray-300 rounded w-full"
                value={query}
                onChange={handleQueryChange}
            />
            </div>
            <ul className="mt-2 bg-gray-100 rounded shadow">
              {suggestions.map((suggestion, index) => (
                  <li
                      key={index}
                      className="p-2 cursor-pointer hover:bg-blue-100"
                      onClick={() => addWaypoint(suggestion)}
                  >
                    {suggestion.name}
                  </li>
              ))}
            </ul>

            {/* Liste des villes de passage ajoutées */}
            <div className="mt-4">
              <h4 className="font-semibold">Villes de passage :</h4>
              <ul className="mt-2">
                {waypoints.map((waypoint, index) => (
                  <li key={index} className="flex items-center justify-between p-2 bg-gray-200 rounded mb-2">
                      <span>{waypoint.name}</span>
                      <button
                          onClick={() => removeWaypoint(index)}
                          className="text-red-500 hover:underline"
                      >
                      <FaTrash />
                      </button>
                    </li>
                ))}
              </ul>
            </div>
          </div>
          )}

          {/* Icône d'œil fixe pour cacher ou afficher la boîte d'ajout de ville de passage */}
          <button
            onClick={() => setShowWaypointsBox((prev) => !prev)}
            className="absolute top-20 left-10 text-blue-500"
          >
            {showWaypointsBox ? <FaEyeSlash /> : <FaEye />}
          </button>
        </SidebarInset>
      </SidebarProvider>
  );
}
    
