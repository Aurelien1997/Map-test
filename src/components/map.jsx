import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import './map.css';

const API_KEY = process.env.REACT_APP_PRIVATE_KEY;
const DEFAULT_LNG = 4.834277;
const DEFAULT_LAT = 45.763420;
const DEFAULT_ZOOM = 12;
const MIN_ZOOM = 10;
const MAX_ZOOM = 15;

export default function Map({ toggleState }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [center] = useState(JSON.parse(localStorage.getItem("center")) || [DEFAULT_LNG, DEFAULT_LAT]);
  const [zoom] = useState(JSON.parse(localStorage.getItem("zoom")) || DEFAULT_ZOOM);
  const [mapStyle] = useState(JSON.parse(localStorage.getItem("mapStyle")) || `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`);

  useEffect(() => {
    if (toggleState !== 2) return;
    if (map.current) return; 
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: center,
      zoom: zoom,
      minZoom: MIN_ZOOM,
      maxZoom: MAX_ZOOM,
      maxTileCacheSize: 1
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    new maplibregl.Marker({color:"red"})
      .setLngLat([DEFAULT_LNG, DEFAULT_LAT])
      .addTo(map.current);
    map.current.on('move', () => {
      localStorage.setItem("center", JSON.stringify(map.current.getCenter()));
      localStorage.setItem("zoom", JSON.stringify(map.current.getZoom()));
      localStorage.setItem("mapStyle", JSON.stringify(map.current.getStyle()));
    });
    }, [map, center, zoom, mapStyle, toggleState]);
    
    return (
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
    );
  }
