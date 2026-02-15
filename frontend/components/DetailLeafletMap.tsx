"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Ship, Navigation, Anchor, MapPin } from 'lucide-react';

// Fix for default marker icons
const vesselIcon = L.divIcon({
  className: 'vessel-div-icon',
  html: `<div class="relative group">
          <div class="w-8 h-8 bg-[#FF8A00] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(255,138,0,0.6)] border-2 border-black/20">
            <div class="transform -rotate-45">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </div>
          </div>
        </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Component to handle map center and zoom when shipment changes
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface DetailLeafletMapProps {
  shipment: any;
  className?: string;
}

export const DetailLeafletMap = ({ shipment, className = "h-full" }: DetailLeafletMapProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use real coordinates if available, otherwise fallback to mock ones for demo
  const lat = shipment?.latitude || 25.0263;
  const lng = shipment?.longitude || 55.0273;
  const center: [number, number] = [lat, lng];

  // Mock route for visualization if real route data is missing
  const route: [number, number][] = [
    [1.3521, 103.8198], // Singapore
    [10.0, 80.0],
    [lat, lng],
  ];

  if (!isMounted) return <div className={`w-full ${className} bg-[#080808] animate-pulse rounded-2xl`} />;

  return (
    <div className={`w-full ${className} relative rounded-2xl overflow-hidden border border-white/5`}>
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '100%', width: '100%', background: '#080808' }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapController center={center} />

        {/* Route Line */}
        <Polyline
          positions={route}
          pathOptions={{
            color: '#FF8A00',
            weight: 2,
            opacity: 0.3,
            dashArray: '8, 12'
          }}
        />

        <Marker position={center} icon={vesselIcon} />
      </MapContainer>

      {/* Floating Info Overlays to match Screenshot */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2 pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-lg flex items-center gap-2">
          <Anchor className="w-3 h-3 text-propulsion-orange" />
          <div className="leading-tight">
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Origin</p>
            <p className="text-[10px] text-white font-bold">{shipment.shipped_from || 'Loading Port'}</p>
          </div>
        </div>
      </div>

      <div className="absolute top-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-black/60 backdrop-blur-md border border-white/10 p-2 rounded-lg flex items-center gap-2">
          <MapPin className="w-3 h-3 text-gray-500" />
          <div className="leading-tight text-right">
            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Destination</p>
            <p className="text-[10px] text-white font-bold">{shipment.final_destination_port || shipment.shipped_to || 'Final Port'}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-[1000] flex justify-between items-end pointer-events-none">
        <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5 space-y-1">
          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Vessel</p>
          <p className="text-xs text-white font-bold">{shipment.current_vessel_name || 'Detecting...'}</p>
        </div>
        <div className="bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5 text-right space-y-1">
          <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">Speed / ETA</p>
          <p className="text-xs text-white font-bold">14.2 kn / {shipment.final_destination_eta || shipment.eta_final_destination ? new Date(shipment.final_destination_eta || shipment.eta_final_destination).toLocaleDateString() : 'TBD'}</p>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          font-family: inherit;
        }
        .vessel-div-icon {
          background: transparent !important;
          border: none !important;
        }
      `}</style>
    </div>
  );
};
