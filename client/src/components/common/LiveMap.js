import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default icon issues in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const riderIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const restaurantIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/612/612295.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const destinationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

export default function LiveMap({ status }) {
  // Simulated coordinates for Urban Eats (New York area for demo)
  const [restaurant] = useState([40.7128, -74.0060]); // NYC
  const [destination] = useState([40.7306, -73.9352]); // Brooklyn
  const [riderPos, setRiderPos] = useState([40.7128, -74.0060]);

  useEffect(() => {
    let interval;
    if (status === 'Shipped') {
      // Simulate movement from restaurant to destination
      let step = 0;
      const totalSteps = 100;
      interval = setInterval(() => {
        if (step <= totalSteps) {
          const lat = restaurant[0] + (destination[0] - restaurant[0]) * (step / totalSteps);
          const lng = restaurant[1] + (destination[1] - restaurant[1]) * (step / totalSteps);
          setRiderPos([lat, lng]);
          step++;
        } else {
          clearInterval(interval);
        }
      }, 500);
    } else if (status === 'Delivered') {
      setRiderPos(destination);
    } else {
      setRiderPos(restaurant);
    }
    return () => clearInterval(interval);
  }, [status, restaurant, destination]);

  return (
    <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm relative z-0">
      <MapContainer center={restaurant} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <Marker position={restaurant} icon={restaurantIcon} />
        <Marker position={destination} icon={destinationIcon} />
        <Marker position={riderPos} icon={riderIcon} />
        <Polyline positions={[restaurant, destination]} color="#ff4a00" weight={2} dashArray="5, 10" opacity={0.5} />
        <MapUpdater center={riderPos} />
      </MapContainer>
      
      {/* Simulation Banner */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 dark:bg-gray-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-100 dark:border-gray-800 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">Simulated GPS Tracking</span>
      </div>
    </div>
  );
}
