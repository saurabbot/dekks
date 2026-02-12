"use client";

import { MapPin, Navigation, Anchor } from 'lucide-react';

interface MapViewProps {
  shipment?: any;
  className?: string;
}

export const MapView = ({ shipment, className = "h-[400px]" }: MapViewProps) => {
  if (!shipment) {
    return (
      <div className={`w-full ${className} bg-background rounded-xl flex items-center justify-center relative overflow-hidden group`}>
        <div className="absolute inset-0 bg-propulsion-orange/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-3 h-3 bg-propulsion-orange rounded-full animate-pulse" />
          </div>
          <p className="text-foreground font-bold text-lg mb-1 tracking-tight">Select a shipment</p>
          <p className="text-muted-foreground text-sm">To view real-time route tracking</p>
        </div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(var(--foreground)_1px,transparent_1px)] [background-size:30px_30px]" />
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className} bg-muted/10 rounded-xl relative overflow-hidden group transition-colors duration-300`}>
      {/* Simulated Map Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:40px_40px]" />
        <svg className="w-full h-full opacity-10">
          <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-muted-foreground/30"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Route Line */}
      <div className="absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-propulsion-orange/30 to-transparent flex items-center justify-between">
        {/* Origin */}
        <div className="relative -mt-10 flex flex-col items-center">
          <div className="p-2 bg-background shadow-sm rounded-lg text-muted-foreground">
            <Anchor className="w-4 h-4" />
          </div>
          <div className="absolute top-12 whitespace-nowrap text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Origin</p>
            <p className="text-xs text-foreground font-medium">{shipment.shipped_from || 'Loading Port'}</p>
          </div>
        </div>

        {/* Current Position (Simulated Movement) */}
        <div className="relative flex flex-col items-center group-hover:scale-110 transition-transform duration-500">
          <div className="p-3 bg-propulsion-orange rounded-full shadow-[0_0_20px_rgba(255,138,0,0.4)] animate-bounce">
            <Navigation className="w-5 h-5 text-black rotate-45" />
          </div>
          <div className="absolute top-14 whitespace-nowrap text-center">
            <p className="text-[10px] text-propulsion-orange uppercase font-bold tracking-tighter">In Transit</p>
            <p className="text-sm text-foreground font-bold tracking-tight">{shipment.container_id}</p>
          </div>
        </div>

        {/* Destination */}
        <div className="relative -mt-10 flex flex-col items-center">
          <div className="p-2 bg-background shadow-sm rounded-lg text-muted-foreground">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="absolute top-12 whitespace-nowrap text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Destination</p>
            <p className="text-xs text-foreground font-medium">{shipment.shipped_to || 'Final Port'}</p>
          </div>
        </div>
      </div>

      {/* Floating Info Overlay */}
      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end pointer-events-none">
        <div className="bg-background/80 backdrop-blur-md p-2.5 rounded-lg shadow-lg">
          <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Vessel</p>
          <p className="text-[11px] text-foreground font-medium truncate max-w-[120px]">{shipment.current_vessel_name || 'Detecting...'}</p>
        </div>
        <div className="bg-background/80 backdrop-blur-md p-2.5 rounded-lg text-right shadow-lg">
          <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider">Speed / Eta</p>
          <p className="text-[11px] text-foreground font-medium">14.2 kn / {shipment.eta_final_destination ? new Date(shipment.eta_final_destination).toLocaleDateString() : 'TBD'}</p>
        </div>
      </div>
    </div>
  );
};
