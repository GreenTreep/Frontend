import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapboxMap.css';
import { Icon } from '@iconify/react';
import debounce from 'lodash/debounce';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ';

const InputWithSuggestions = ({ placeholder, value, onChange, suggestions, onSelect }) => (
    <div className="input-with-suggestions">
        <input
            className="map-input"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        <ul className="map-suggestions">
            {suggestions.map((s, i) => (
                <li key={i} onClick={() => onSelect(s)}>
                    {s.name}
                </li>
            ))}
        </ul>
    </div>
);

const MapboxMap = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const markersRef = useRef([]); // Stocker les marqueurs pour pouvoir les supprimer
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [startSuggestions, setStartSuggestions] = useState([]);
    const [endSuggestions, setEndSuggestions] = useState([]);
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);
    const [transportMode, setTransportMode] = useState('driving');
    const [pois, setPois] = useState({
        hotel: [],
        restaurant: [],
        gas_station: [],
    });

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.3522, 48.8566],
            zoom: 5,
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        return () => mapRef.current?.remove();
    }, []);

    const fetchSuggestions = debounce(async (query, setSuggestions) => {
        if (!query.trim()) {
            setSuggestions([]);
            return;
        }

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&autocomplete=true&access_token=${mapboxgl.accessToken}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const suggestions = data.features.map((f) => ({ name: f.place_name, coords: f.center }));
            setSuggestions(suggestions);
        } catch (error) {
            console.error('Erreur lors de la récupération des suggestions :', error);
            setSuggestions([]);
        }
    }, 300);

    const fetchRoute = async () => {
        if (!startCoords || !endCoords) return;

        const url = `https://api.mapbox.com/directions/v5/mapbox/${transportMode}/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&steps=true&access_token=${mapboxgl.accessToken}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0]?.geometry;

                const map = mapRef.current;

                if (map.getLayer('route')) map.removeLayer('route');
                if (map.getSource('route')) map.removeSource('route');

                map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: route } });
                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#007bff', 'line-width': 5 },
                });
                map.fitBounds([startCoords, endCoords], { padding: 50 });

                fetchPois(route);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l’itinéraire :', error);
        }
    };

    const fetchPois = async (geometry) => {
        if (!geometry) return;

        const bbox = calculateBoundingBox(geometry.coordinates);
        const categories = ['hotel', 'restaurant', 'gas_station', 'campground', 'trailhead', 'park'];
        const poisByCategory = {
            hotel: [],
            restaurant: [],
            gas_station: [],
            campground: [],
            trailhead: [],
            park: [],
        };

        // Nettoyer les anciens marqueurs
        clearMarkers();

        for (const category of categories) {
            const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${category}.json?bbox=${bbox.join(',')}&access_token=${mapboxgl.accessToken}`;
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
                        10 // Augmente le rayon à 10 km pour inclure plus de POI
                    );
                    poisByCategory[category] = filteredPois;
                }
            } catch (error) {
                console.error(`Erreur lors de la récupération des POI pour ${category}:`, error);
            }
        }

        setPois(poisByCategory);
        addMarkers(poisByCategory);
    };

    const clearMarkers = () => {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = []; // Réinitialise les marqueurs stockés
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

    const addMarkers = (poisByCategory) => {
        const map = mapRef.current;

        Object.keys(poisByCategory).forEach((category) => {
            poisByCategory[category].forEach((poi) => {
                if (!poi.coords || !poi.name) return;

                const marker = new mapboxgl.Marker({
                    color: category === 'hotel' ? 'blue' : category === 'restaurant' ? 'red' : 'green',
                })
                    .setLngLat(poi.coords)
                    .setPopup(
                        new mapboxgl.Popup().setHTML(`
                            <strong>${poi.name}</strong><br>
                            <em>${category}</em>
                        `)
                    )
                    .addTo(map);

                markersRef.current.push(marker); // Stocker le marqueur pour le nettoyage
            });
        });
    };

    useEffect(() => {
        fetchRoute();
    }, [startCoords, endCoords, transportMode]);

    return (
        <div className="map-container">
            <div className="map-controls">
                <h3>Choisir un itinéraire</h3>

                <InputWithSuggestions
                    placeholder="Ville de départ"
                    value={startInput}
                    onChange={(e) => {
                        setStartInput(e.target.value);
                        fetchSuggestions(e.target.value, setStartSuggestions);
                    }}
                    suggestions={startSuggestions}
                    onSelect={(s) => {
                        setStartInput(s.name);
                        setStartCoords(s.coords);
                        setStartSuggestions([]);
                    }}
                />

                <InputWithSuggestions
                    placeholder="Ville d'arrivée"
                    value={endInput}
                    onChange={(e) => {
                        setEndInput(e.target.value);
                        fetchSuggestions(e.target.value, setEndSuggestions);
                    }}
                    suggestions={endSuggestions}
                    onSelect={(s) => {
                        setEndInput(s.name);
                        setEndCoords(s.coords);
                        setEndSuggestions([]);
                    }}
                />

                <div className="map-transport">
                    <button
                        className={transportMode === 'driving' ? 'active' : ''}
                        onClick={() => setTransportMode('driving')}
                    >
                        <Icon icon="mdi:car" className="icon" />
                    </button>
                    <button
                        className={transportMode === 'cycling' ? 'active' : ''}
                        onClick={() => setTransportMode('cycling')}
                    >
                        <Icon icon="mdi:bike" className="icon" />
                    </button>
                    <button
                        className={transportMode === 'walking' ? 'active' : ''}
                        onClick={() => setTransportMode('walking')}
                    >
                        <Icon icon="mdi:walk" className="icon" />
                    </button>
                </div>

                {/* Liste des lieux trouvés par catégories */}
                {Object.keys(pois).map((category) => (
                    <div className="pois-category" key={category}>
                        <h4>
                            <Icon
                                icon={
                                    category === 'hotel'
                                        ? 'mdi:bed'
                                        : category === 'restaurant'
                                            ? 'mdi:silverware-fork-knife'
                                            : 'mdi:gas-station'
                                }
                                className="category-icon"
                            />{' '}
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h4>
                        <ul>
                            {pois[category].map((poi, index) => (
                                <li key={index}>
                                    <strong>{poi.name}</strong>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
            <div ref={mapContainerRef} className="map-display"></div>
        </div>
    );
};

export default MapboxMap;
