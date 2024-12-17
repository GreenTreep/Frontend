import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ';

const MapboxMap = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [startCity, setStartCity] = useState('Paris');
    const [endCity, setEndCity] = useState('Lyon');

    useEffect(() => {
        // Initialisation de la carte
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [2.3522, 48.8566], // Paris
            zoom: 5
        });

        return () => mapRef.current?.remove(); // Nettoyer la carte
    }, []);

    const fetchCoordinates = async (city) => {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxgl.accessToken}`;
        const response = await fetch(url);
        const data = await response.json();
        return data.features[0]?.center || null; // Retourne les coordonnées [lng, lat]
    };

    const fetchRoute = async () => {
        try {
            // Récupère les coordonnées des deux villes
            const startCoords = await fetchCoordinates(startCity);
            const endCoords = await fetchCoordinates(endCity);

            if (!startCoords || !endCoords) {
                alert('Impossible de trouver les coordonnées des villes.');
                return;
            }

            const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoords[0]},${startCoords[1]};${endCoords[0]},${endCoords[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

            const response = await fetch(url);
            const data = await response.json();
            const route = data.routes[0].geometry;

            // Ajouter la source et la couche de l'itinéraire
            const map = mapRef.current;
            if (map.getSource('route')) {
                map.getSource('route').setData({ type: 'Feature', geometry: route });
            } else {
                map.addSource('route', {
                    type: 'geojson',
                    data: { type: 'Feature', geometry: route }
                });

                map.addLayer({
                    id: 'route',
                    type: 'line',
                    source: 'route',
                    layout: { 'line-join': 'round', 'line-cap': 'round' },
                    paint: { 'line-color': '#007bff', 'line-width': 5 }
                });
            }

            // Recentrer la carte sur l'itinéraire
            map.fitBounds([startCoords, endCoords], { padding: 50 });
        } catch (error) {
            console.error('Erreur de récupération du trajet :', error);
        }
    };

    return (
        <div style={{ position: 'relative', height: '100vh' }}>
            <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}></div>
            <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'white',
                padding: '10px',
                borderRadius: '5px'
            }}>
                <h3>Choisir l'itinéraire</h3>
                <input
                    type="text"
                    placeholder="Ville de départ"
                    value={startCity}
                    onChange={(e) => setStartCity(e.target.value)}
                    style={{ marginBottom: '5px', padding: '5px', width: '100%' }}
                />
                <input
                    type="text"
                    placeholder="Ville d'arrivée"
                    value={endCity}
                    onChange={(e) => setEndCity(e.target.value)}
                    style={{ marginBottom: '5px', padding: '5px', width: '100%' }}
                />
                <button onClick={fetchRoute} style={{ padding: '5px 10px', cursor: 'pointer' }}>
                    Partir
                </button>
            </div>
        </div>
    );
};

export default MapboxMap;
