import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapboxMap.css'; // Importation du fichier CSS

mapboxgl.accessToken = 'pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ';

const MapboxMap = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [startInput, setStartInput] = useState('');
    const [endInput, setEndInput] = useState('');
    const [startSuggestions, setStartSuggestions] = useState([]);
    const [endSuggestions, setEndSuggestions] = useState([]);
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);

    useEffect(() => {
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.3522, 48.8566],
            zoom: 5
        });

        return () => mapRef.current?.remove();
    }, []);

    const fetchSuggestions = async (query, setSuggestions) => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?types=place&access_token=${mapboxgl.accessToken}`;
        const response = await fetch(url);
        const data = await response.json();
        setSuggestions(data.features.map(feature => ({
            name: feature.place_name,
            coords: feature.center
        })));
    };

    const fetchRoute = async () => {
        if (!startCoords || !endCoords) {
            alert('Veuillez sélectionner des villes valides.');
            return;
        }

        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
        const response = await fetch(url);
        const data = await response.json();
        const route = data.routes[0].geometry;

        const map = mapRef.current;
        if (map.getSource('route')) {
            map.getSource('route').setData({ type: 'Feature', geometry: route });
        } else {
            map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: route } });
            map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                layout: { 'line-join': 'round', 'line-cap': 'round' },
                paint: { 'line-color': '#007bff', 'line-width': 5 }
            });
        }
        map.fitBounds([startCoords, endCoords], { padding: 50 });
    };

    return (
        <div className="map-container">
            <div className="map-controls">
                <h3>Choisir un itinéraire</h3>

                <input
                    type="text"
                    placeholder="Ville de départ"
                    value={startInput}
                    onChange={(e) => {
                        setStartInput(e.target.value);
                        fetchSuggestions(e.target.value, setStartSuggestions);
                    }}
                    className="map-input"
                />
                <ul className="map-suggestions">
                    {startSuggestions.map((s, idx) => (
                        <li key={idx} onClick={() => {
                            setStartInput(s.name);
                            setStartCoords(s.coords);
                            setStartSuggestions([]);
                        }}>
                            {s.name}
                        </li>
                    ))}
                </ul>

                <input
                    type="text"
                    placeholder="Ville d'arrivée"
                    value={endInput}
                    onChange={(e) => {
                        setEndInput(e.target.value);
                        fetchSuggestions(e.target.value, setEndSuggestions);
                    }}
                    className="map-input"
                />
                <ul className="map-suggestions">
                    {endSuggestions.map((s, idx) => (
                        <li key={idx} onClick={() => {
                            setEndInput(s.name);
                            setEndCoords(s.coords);
                            setEndSuggestions([]);
                        }}>
                            {s.name}
                        </li>
                    ))}
                </ul>

                <button onClick={fetchRoute} className="map-button">
                    Partir
                </button>
            </div>
            <div ref={mapContainerRef} className="map-display"></div>
        </div>
    );
};

export default MapboxMap;
