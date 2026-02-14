"use client";

import { useState } from 'react';
import { Package, MapPin, Calendar, Ship, Navigation, RefreshCw, Activity, ArrowRight, X, Share2, Copy, Globe } from 'lucide-react';
import { DetailLeafletMap } from '@/components/DetailLeafletMap';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ShipmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: any;
  onUpdate: () => void;
}

export const ShipmentDetailsModal = ({ isOpen, onClose, shipment, onUpdate }: ShipmentDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleTrack = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/shipments/track_shipment_details?shipment_id=${shipment.id}`);
      setTrackingData(res.data.data);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch real-time tracking data');
    } finally {
      setLoading(false);
    }
  };

  if (!shipment) return null;

  const data = trackingData || shipment;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[1000px] p-0 border-none bg-transparent shadow-none rounded-[2.5rem]">
        <div className="bg-[#050505] rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.8)]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 p-2 hover:bg-white/5 rounded-full transition-colors group"
          >
            <X className="w-5 h-5 text-gray-500 group-hover:text-white" />
          </button>

          {/* Modal Header */}
          <div className="p-10 pb-6 flex items-center gap-6">
            <div className="w-16 h-16 bg-[#FF8A00] rounded-2xl flex items-center justify-center text-black shadow-[0_0_30px_rgba(255,138,0,0.3)]">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <DialogTitle className="text-4xl font-black text-white tracking-tighter uppercase leading-none mb-2">{shipment.container_id}</DialogTitle>
              <DialogDescription className="sr-only">
                Detailed tracking information for shipment {shipment.container_id}
              </DialogDescription>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  {shipment.shipping_line_name?.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold text-gray-600 uppercase tracking-tight">ID: #{shipment.id}</span>
              </div>
            </div>
          </div>

          <div className="px-10 pb-10">
            {error && (
              <div className="p-4 mb-6 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[11px] font-bold flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Map & Summary */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                <div className="h-[450px] bg-white/5 rounded-[2rem] border border-white/10 overflow-hidden">
                  <DetailLeafletMap shipment={data} className="h-full" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-white/[0.02] rounded-[1.8rem] border border-white/5 space-y-4 hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 group-hover:text-propulsion-orange transition-colors">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Current Location</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-1">{data.last_location || 'At Sea'}</h4>
                      <p className="text-xs text-gray-500 font-medium tracking-tight">{data.last_location_terminal || 'International Waters'}</p>
                    </div>
                  </div>

                  <div className="p-6 bg-white/[0.02] rounded-[1.8rem] border border-white/5 space-y-4 hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-400 group-hover:text-propulsion-orange transition-colors">
                        <Navigation className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Next Port</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white uppercase tracking-tight leading-none mb-1">{data.next_location || 'Pending'}</h4>
                      <p className="text-xs text-gray-500 font-medium tracking-tight">{data.next_location_terminal || 'Awaiting Schedule'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Status & Resync */}
              <div className="col-span-12 lg:col-span-4 space-y-4">
                <div className="p-8 bg-[#FF8A00] rounded-[2.2rem] text-black relative overflow-hidden group shadow-[0_20px_40px_rgba(255,138,0,0.15)]">
                  <div className="relative z-10">
                    <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.25em] block mb-4">Tracking Status</span>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 leading-none line-clamp-2">{data.container_status || 'Updating...'}</h3>
                    <div className="flex items-center gap-2 text-black/60">
                      <Activity className="w-4 h-4 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Live Updates Enabled</span>
                    </div>
                  </div>
                  <Package className="absolute -bottom-6 -right-6 w-32 h-32 text-black/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                </div>

                <div className="flex flex-col gap-3">
                  {data.vessel_lat && data.vessel_lon && (
                    <div className="p-5 bg-propulsion-orange/5 border border-propulsion-orange/20 rounded-2xl space-y-3 relative overflow-hidden group">
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-propulsion-orange/10 rounded-lg text-propulsion-orange">
                            <Navigation className="w-5 h-5 animate-pulse" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-propulsion-orange">Live AIS Telemetry</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Real-time</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-2 relative z-10">
                        <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Current Speed</p>
                          <p className="text-xl font-black text-white">{data.vessel_speed || '0.0'} <span className="text-[10px] text-gray-500">knots</span></p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Vessel Course</p>
                          <p className="text-xl font-black text-white">{data.vessel_course || '0'}°</p>
                        </div>
                      </div>
                      <Navigation className="absolute -bottom-6 -right-6 w-24 h-24 text-propulsion-orange/[0.03] group-hover:rotate-45 transition-transform duration-700" />
                    </div>
                  )}

                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-white/[0.04] transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-propulsion-orange transition-colors">
                        <Ship className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Vessel Name</p>
                        <p className="text-sm font-bold text-white tracking-tight">{data.current_vessel_name || 'N/A'}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-700 group-hover:text-white transition-colors" />
                  </div>

                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between hover:bg-[#00FFBD]/5 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#00FFBD]/10 rounded-xl border border-[#00FFBD]/20 flex items-center justify-center text-[#00FFBD]">
                        <Globe className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Sustainability</p>
                        <p className="text-sm font-bold text-white tracking-tight">
                          {data.co2_emissions ? `${data.co2_emissions} kg CO2` : 'Calculating...'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-gray-400">
                        <Calendar className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Last Data Sync</p>
                        <p className="text-sm font-bold text-white tracking-tight">
                          {data.updated_at ? new Date(data.updated_at).toLocaleTimeString() : 'Sync Pending'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleTrack}
                  disabled={loading}
                  className="w-full h-20 bg-white hover:bg-white/90 text-black font-black rounded-3xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                >
                  {loading ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Re-sync Live Data
                    </>
                  )}
                </Button>

                {/* Sharing Controls */}
                <div className="p-6 bg-zinc-900/40 rounded-[1.8rem] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/10 text-gray-500">
                        <Share2 className="w-4 h-4 text-emerald-500" />
                      </div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Public Sharing</span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${data.is_public ? 'bg-emerald-500/10 text-emerald-500' : 'bg-gray-500/10 text-gray-500'}`}>
                      {data.is_public ? 'Active' : 'Disabled'}
                    </div>
                  </div>

                  {data.is_public && data.share_token && (
                    <div className="flex items-center gap-2 p-3 bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                      <input
                        readOnly
                        value={`${window.location.origin}/track/${data.share_token}`}
                        className="bg-transparent text-[10px] text-gray-400 font-mono w-full focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/track/${data.share_token}`);
                          alert('Link copied to clipboard!');
                        }}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  <Button
                    onClick={async () => {
                      setLoading(true);
                      try {
                        const endpoint = data.is_public ? 'unshare' : 'share';
                        const res = await api.post(`/shipments/${shipment.id}/${endpoint}`);
                        setTrackingData(res.data);
                        onUpdate();
                      } catch (err: any) {
                        setError(err.response?.data?.detail || 'Failed to update sharing status');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all ${data.is_public ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20'}`}
                  >
                    {data.is_public ? 'Disable Sharing' : 'Enable Public Sharing'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};
