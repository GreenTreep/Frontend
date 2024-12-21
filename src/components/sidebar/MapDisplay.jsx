// src/components/sidebar/MapDisplay.jsx
import React, { useEffect, useState, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css'; // Importer le CSS de NProgress

mapboxgl.accessToken = 'pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ';

const MapDisplay = ({
  mapRef = { current: null },
  mapContainerRef = { current: null },
  isDarkMode
}) => {
  const [hoveredPOI, setHoveredPOI] = useState(null);
  // const [isLoading, setIsLoading] = useState(true); // Supprimé car NProgress gère le chargement
  const userLanguage = navigator.language.startsWith('zh') ? 'zh' : 'en';
  const loadStartTime = useRef(null); // Référence pour le temps de début

  useEffect(() => {
    if (mapRef && mapContainerRef && !mapRef.current && mapContainerRef.current) {
      NProgress.start(); // Démarrer la barre de progression lors de l'initialisation de la carte
      loadStartTime.current = Date.now(); // Enregistrer le temps de début

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/outdoors-v12',
        center: [2.3522, 48.8566],
        zoom: 5,
      });

      const map = mapRef.current;

      const handleMapLoad = () => {
        const elapsed = Date.now() - loadStartTime.current;
        const remaining = 1000 - elapsed; // 1000 ms = 1 seconde
        if (remaining > 0) {
          setTimeout(() => {
            NProgress.done(); // Terminer la barre de progression après le délai restant
          }, remaining);
        } else {
          NProgress.done(); // Terminer immédiatement si le temps écoulé >= 1 seconde
        }
      };

      const handleStyleLoad = () => {
        const elapsed = Date.now() - loadStartTime.current;
        const remaining = 1000 - elapsed;
        if (remaining > 0) {
          setTimeout(() => {
            NProgress.done();
          }, remaining);
        } else {
          NProgress.done();
        }
        map.resize();
      };

      map.on('load', handleMapLoad);
      map.on('style.load', handleStyleLoad);

      map.on('mousemove', (e) => {
        const features = map.queryRenderedFeatures(e.point, {
          layers: ['poi-label'],
        });

        if (features.length > 0) {
          const feature = features[0];
          const category =
            userLanguage === 'zh'
              ? feature.properties.category_zh_Hans
              : feature.properties.category_en;

          setHoveredPOI({
            name: feature.properties.name || 'Nom inconnu',
            category: category || 'Catégorie inconnue',
            type: feature.properties.type || 'Type non spécifié',
            country: feature.properties.iso_3166_1 || 'Pays inconnu',
            region: feature.properties.iso_3166_2 || '',
            maki: feature.properties.maki || '',
            point: e.point,
          });

          map.getCanvas().style.cursor = 'pointer';
        } else {
          setHoveredPOI(null);
          map.getCanvas().style.cursor = 'grab';
        }
      });

      map.on('mouseleave', 'poi-label', () => {
        setHoveredPOI(null);
      });

      // Initial resize
      map.resize();
    }
  }, [mapRef, mapContainerRef, isDarkMode]);

  useEffect(() => {
    if (mapRef.current) {
      NProgress.start(); // Démarrer la barre de progression lors du changement de style
      loadStartTime.current = Date.now(); // Enregistrer le temps de début
      const newStyle = isDarkMode
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/outdoors-v12';
      mapRef.current.setStyle(newStyle);
    }
  }, [isDarkMode]);

  // Utilisation de ResizeObserver avec délai et debouncing
  useEffect(() => {
    if (!mapContainerRef.current) return;

    let resizeTimeout;

    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.resize();
        }
      }, 0); // Ajustez le délai selon vos besoins
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      clearTimeout(resizeTimeout);
      if (mapContainerRef.current instanceof Element) {
        resizeObserver.unobserve(mapContainerRef.current);
      }
    };
  }, [mapRef, mapContainerRef]);

  return (
    <div className="relative w-full h-full">
      {/* NProgress gère la barre de progression */}
      <div ref={mapContainerRef} className="w-full h-full" />
      {hoveredPOI && (
        <div
          className="absolute bg-white p-2 rounded shadow-lg"
          style={{
            top: hoveredPOI.point.y + 10,
            left: hoveredPOI.point.x + 10,
            zIndex: 10,
          }}
        >
          <h4 className="text-lg font-semibold">{hoveredPOI.name}</h4>
          <p className="text-sm text-gray-600">
            {hoveredPOI.category || 'Catégorie inconnue'}
          </p>
          <p className="text-sm text-gray-700">
            {hoveredPOI.type}
          </p>

          <p className="text-xs text-gray-400">
            {hoveredPOI.country} {hoveredPOI.region && `- ${hoveredPOI.region}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
