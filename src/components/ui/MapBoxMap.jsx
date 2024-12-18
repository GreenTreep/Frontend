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
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [startSuggestions, setStartSuggestions] = useState([]);
    const [endSuggestions, setEndSuggestions] = useState([]);
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);
    const [transportMode, setTransportMode] = useState('driving');
    const [routeInstructions, setRouteInstructions] = useState([]);
    const suggestionCache = useRef({});

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.3522, 48.8566], // Paris par défaut
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

        if (suggestionCache.current[query]) {
            setSuggestions(suggestionCache.current[query]);
            return;
        }

        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&autocomplete=true&access_token=${mapboxgl.accessToken}`;
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Erreur API Mapbox Geocoding');
            const data = await response.json();
            const suggestions = data.features.map((f) => ({ name: f.place_name, coords: f.center }));
            suggestionCache.current[query] = suggestions;
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

            const route = data.routes[0]?.geometry;
            const steps = data.routes[0]?.legs[0]?.steps || [];

            if (route) {
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

                setRouteInstructions(
                    steps.map((step) => ({
                        instruction: step.maneuver.instruction,
                        type: step.maneuver.type,
                        modifier: step.maneuver.modifier,
                    }))
                );
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l’itinéraire :', error);
        }
    };

    useEffect(() => {
        fetchRoute();
    }, [startCoords, endCoords, transportMode]);

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

    return (
        <div className="map-container">
            <div className="map-controls">
                <h3>Choisir un itinéraire</h3>

                {/* Entrée pour la ville de départ */}
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

                {/* Entrée pour la ville d'arrivée */}
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

                {/* Modes de transport */}
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

                {/* Instructions */}
                {routeInstructions.length > 0 && (
                    <div className="map-instructions">
                        <h4>Instructions du trajet :</h4>
                        <ul>
                            {routeInstructions.map((step, index) => (
                                <li key={index}>
                                    <Icon icon={getManeuverIcon(step.type, step.modifier)} className="instruction-icon" />
                                    <span>{step.instruction}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            <div ref={mapContainerRef} className="map-display"></div>
        </div>
    );
};

export default MapboxMap;
