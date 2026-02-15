"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Ship, Navigation, Anchor, Activity, Clock } from 'lucide-react';

// Fix for default marker icons in Leaflet + Next.js
const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `<div class="w-4 h-4 bg-[#FF8A00] rounded-full border-2 border-black/50 shadow-[0_0_15px_rgba(255,138,0,0.6)] animate-pulse"></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
});

const vesselIcon = L.divIcon({
    className: 'vessel-div-icon',
    html: `<div class="relative group">
          <div class="w-6 h-6 bg-[#FF8A00] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,138,0,0.4)] rotate-45 transform transition-transform group-hover:scale-110">
            <div class="-rotate-45">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
            </div>
          </div>
        </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
});

// Mock Shipments with Real Coordinates
const MOCK_SHIPMENTS = [
    {
        id: 'SHP-001',
        vessel: 'Maersk Atlantic',
        lat: 34.0522,
        lng: -118.2437, // Near LA
        status: 'In Transit',
        speed: '14.2 kn',
        destination: 'Singapore',
        route: [[34.0522, -118.2437], [20.0, -150.0], [1.3521, 103.8198]]
    },
    {
        id: 'SHP-002',
        vessel: 'Evergreen Global',
        lat: 51.9225,
        lng: 4.4791, // Rotterdam
        status: 'Moored',
        speed: '0 kn',
        destination: 'New York',
        route: [[51.9225, 4.4791], [40.7128, -74.0060]]
    },
    {
        id: 'SHP-003',
        vessel: 'CMA CGM Apex',
        lat: 1.3521,
        lng: 103.8198, // Singapore
        status: 'Active',
        speed: '18.5 kn',
        destination: 'Rotterdam',
        route: [[1.3521, 103.8198], [15.0, 80.0], [51.9225, 4.4791]]
    }
];

export const LiveMap = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [hoveredShipment, setHoveredShipment] = useState<any>(null);
    const [shipments, setShipments] = useState<any[]>([]);

    useEffect(() => {
        setIsMounted(true);
        fetchShipments();
    }, []);

    const fetchShipments = async () => {
        try {
            const res = await api.get('/shipments/');
            // Transform DB shipments to Map format
            console.log(res.data);
            const mapped = res.data.map((s: any, index: number) => {
                const lat = s.vessel_lat || 20;
                const lng = s.vessel_lon || 0;

                // Add a small jitter for overlapping coordinates (like the default 20, 0)
                // This ensures that even if they are at the same spot, you can see multiple markers
                const jitterLat = lat + (Math.random() - 0.5) * 2.0;
                const jitterLng = lng + (Math.random() - 0.5) * 2.0;

                return {
                    id: s.container_id,
                    vessel: s.current_vessel_name || 'Unknown Vessel',
                    lat: jitterLat,
                    lng: jitterLng,
                    status: s.container_status || 'Unknown',
                    speed: s.vessel_speed ? `${s.vessel_speed} kn` : '0 kn',
                    destination: s.shipped_to || 'Unknown',
                    eta: s.eta_final_destination,
                    is_live: !!s.vessel_lat
                };
            }).filter((s: any) => s.lat !== null && s.lng !== null);
            setShipments(mapped);
        } catch (err) {
            console.error('Failed to fetch map shipments');
        }
    };

    if (!isMounted) return (
        <div className="w-full h-full bg-[#080808] animate-pulse flex items-center justify-center rounded-[2.5rem]">
            <Activity className="w-8 h-8 text-propulsion-orange/20" />
        </div>
    );

    return (
        <div className="relative w-full h-full bg-[#080808] rounded-[2.5rem] overflow-hidden border border-white/5">
            <MapContainer
                center={[20, 0]}
                zoom={2}
                minZoom={2}
                maxZoom={18}
                maxBounds={[[-85, -180], [85, 180]]}
                maxBoundsViscosity={1.0}
                style={{ height: '100%', width: '100%', background: '#080808' }}
                zoomControl={false}
                attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {shipments.map((ship) => (
                    <React.Fragment key={ship.id}>
                        <Marker
                            position={[ship.lat, ship.lng]}
                            icon={vesselIcon}
                            eventHandlers={{
                                mouseover: () => setHoveredShipment(ship),
                                mouseout: () => setHoveredShipment(null),
                            }}
                        >
                            <Popup className="custom-popup">
                                <div className="bg-[#0A0A0A] border border-white/10 p-3 rounded-xl min-w-[200px]">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-propulsion-orange uppercase tracking-widest">{ship.id}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${ship.is_live ? 'bg-propulsion-orange/10 text-propulsion-orange' : 'bg-gray-500/10 text-gray-500'
                                            }`}>
                                            {ship.is_live ? 'LIVE AIS' : 'ESTIMATED'}
                                        </span>
                                    </div>
                                    <h3 className="text-white font-bold text-sm mb-3 tracking-tight">{ship.vessel}</h3>

                                    <div className="grid grid-cols-2 gap-3 border-t border-white/5 pt-3">
                                        <div>
                                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Speed</p>
                                            <p className="text-[11px] text-white font-medium">{ship.speed}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] text-gray-500 font-bold uppercase tracking-wider">Destination</p>
                                            <p className="text-[11px] text-white font-medium truncate max-w-[80px]">{ship.destination}</p>
                                        </div>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    </React.Fragment>
                ))}
            </MapContainer>

            {/* Floating Telemetry Overlay (Visible on Hover) */}
            <AnimatePresence>
                {hoveredShipment && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="absolute top-8 right-8 z-[1000] w-72"
                    >
                        <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-2xl">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-propulsion-orange/10 rounded-2xl flex items-center justify-center border border-propulsion-orange/20">
                                    <Ship className="w-6 h-6 text-propulsion-orange" />
                                </div>
                                <div>
                                    <h2 className="text-white font-bold text-lg leading-tight">{hoveredShipment.vessel}</h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em]">Signal_Locked</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Navigation className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-400 font-medium">Latitude</span>
                                    </div>
                                    <span className="text-xs text-white font-mono">{hoveredShipment.lat.toFixed(4)}°N</span>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Navigation className="w-4 h-4 text-gray-500 rotate-90" />
                                        <span className="text-xs text-gray-400 font-medium">Longitude</span>
                                    </div>
                                    <span className="text-xs text-white font-mono">{hoveredShipment.lng.toFixed(4)}°W</span>
                                </div>

                                <div className="flex justify-between items-center bg-white/5 p-3 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-400 font-medium">ETA</span>
                                    </div>
                                    <span className="text-xs text-white font-bold tracking-tight">Feb 14, 2026</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Map Branding Overlay */}
            <div className="absolute bottom-8 left-8 z-[1000] pointer-events-none">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/5 px-4 py-2 rounded-2xl shadow-xl">
                    <div className="w-2 h-2 rounded-full bg-propulsion-orange shadow-[0_0_10px_#FF8A00]" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Global_Fleet_View</span>
                </div>
            </div>

            {/* CSS Overrides for Leaflet Popups */}
            <style jsx global>{`
        .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }
        .leaflet-popup-tip-container {
          display: none !important;
        }
        .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }
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
