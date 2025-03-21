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
  const [pois, setPois] = useState({ hotel: [], restaurant: [], gas_station: [], park: [] });
  const [parcoursData, setParcoursData] = useState(null); // État pour les données GeoJSON
  const [query, setQuery] = useState(""); // État pour le champ de saisie
  const [suggestions, setSuggestions] = useState([]); // État pour les suggestions
  const [showWaypoints, setShowWaypoints] = useState(true); // État pour contrôler la visibilité des villes de passage
  const [showWaypointsBox, setShowWaypointsBox] = useState(true); // État pour contrôler la visibilité de la boîte des villes de passage

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

        fetchPois(route); // Rechercher les POI
      }
    } catch (error) {
      console.error("Erreur lors de la récupération de l'itinéraire :", error);
    }
  };

  const fetchPois = async (geometry) => {
    if (!geometry) return;

    const bbox = calculateBoundingBox(geometry.coordinates);
    const categories = ["hotel", "restaurant", "gas_station", "park", "parking"];
    const poisByCategory = { hotel: [], restaurant: [], gas_station: [], park: [], parking: [] };

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

        // Définir la couleur et l'icône en fonction de la catégorie
        let color;
        let icon;
        switch (category) {
          case "hotel":
            color = "blue";
            icon = "<i class='fas fa-hotel'></i>"; // Utilisez une icône d'hôtel
            break;
          case "restaurant":
            color = "red";
            icon = "<i class='fas fa-utensils'></i>"; // Utilisez une icône de restaurant
            break;
          case "park":
            color = "green";
            icon = "<i class='fas fa-tree'></i>"; // Utilisez une icône de parc
            break;
          case "gas_station":
            color = "orange";
            icon = "<i class='fas fa-gas-pump'></i>"; // Utilisez une icône de station-service
            break;
          case "parking": // Ajoutez une condition pour les parkings
            color = "gray"; // Couleur pour le parking
            icon = "<strong>P</strong>"; // Utilisez un symbole "P" pour le parking
            break;
          default:
            color = "gray";
            icon = "<i class='fas fa-map-marker-alt'></i>"; // Icône par défaut
        }

        const marker = new mapboxgl.Marker({ color })
          .setLngLat(poi.coords)
          .setPopup(
            new mapboxgl.Popup().setHTML(`
              <strong>${poi.name}</strong><br>
              <em>${category}</em>
              <div>${icon}</div>
            `)
          )
          .addTo(map);

        markersRef.current.push(marker);
      });
    });
  };

  const addWaypointMarker = (suggestion) => {
    if (suggestion) {
      // Ajoutez la ville à la liste des waypoints
      setWaypoints((prevWaypoints) => [
        ...prevWaypoints,
        { name: suggestion.name, coords: suggestion.coords },
      ]);
      
      // Appeler la fonction pour ajouter le marqueur sur la carte
      const marker = new mapboxgl.Marker({ color: "yellow" }) // Marqueur jaune
        .setLngLat(suggestion.coords)
        .setPopup(new mapboxgl.Popup().setHTML(`<strong>${suggestion.name}</strong>`))
        .addTo(mapRef.current);
      
      markersRef.current.push(marker); // Ajouter le marqueur à la référence
    }
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

  useEffect(() => {
    if (mapRef.current && startCoords && endCoords) {
      // Marqueur pour le point de départ
      new mapboxgl.Marker({ color: "blue" })
        .setLngLat(startCoords)
        .setPopup(new mapboxgl.Popup().setHTML("<strong>Point de départ</strong>"))
        .addTo(mapRef.current);

      // Marqueur pour le point d'arrivée
      new mapboxgl.Marker({ color: "green" })
        .setLngLat(endCoords)
        .setPopup(new mapboxgl.Popup().setHTML("<strong>Point d'arrivée</strong>"))
        .addTo(mapRef.current);
    }
  }, [startCoords, endCoords]);

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
          pois={pois} // Ajout des POI dans la sidebar
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
            className="absolute top-20 left-10 text-blue-500" // Positionnez l'icône à côté de la boîte
          >
            {showWaypointsBox ? <FaEyeSlash /> : <FaEye />}
          </button>
        </SidebarInset>
      </SidebarProvider>
  );

  };
    
