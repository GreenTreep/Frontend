"use client";
import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'
mapboxgl.accessToken = 'pk.eyJ1Ijoic3lsdmFpbmNvc3RlcyIsImEiOiJjbTNxZXNtN3cwa2hpMmpxdWd2cndhdnYwIn0.V2ZAp-BqZq6KIHQ6Lu8eAQ';

const MapDisplay = ({
  mapRef = { current: null },
  mapContainerRef = { current: null },
  isDarkMode
}) => {
  const [hoveredPOI, setHoveredPOI] = useState(null);

  const userLanguage = navigator.language.startsWith('zh') ? 'zh' : 'en';

  useEffect(() => {
    if (mapRef && mapContainerRef && !mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: isDarkMode ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/outdoors-v12',
        center: [2.3522, 48.8566],
        zoom: 5,
      });

      const map = mapRef.current;

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
    }
  }, [mapRef, mapContainerRef, isDarkMode]);

  useEffect(() => {
    if (mapRef.current) {
      const newStyle = isDarkMode
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/outdoors-v12';
      mapRef.current.setStyle(newStyle);
    }
  }, [isDarkMode]);

  return (
    <div ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
      {hoveredPOI && (
        <div
          style={{
            position: 'absolute',
            top: hoveredPOI.point.y + 10,
            left: hoveredPOI.point.x + 10,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
        >
          <h4 style={{ margin: 0 }}>{hoveredPOI.name}</h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#555' }}>
            {hoveredPOI.category || 'Catégorie inconnue'}
          </p>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#777' }}>
            {hoveredPOI.type}
          </p>

          <p style={{ margin: 0, fontSize: '0.75rem', color: '#aaa' }}>
            {hoveredPOI.country} {hoveredPOI.region && ` - ${hoveredPOI.region}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
