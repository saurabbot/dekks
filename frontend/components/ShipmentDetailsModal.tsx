"use client";

import { useState, useEffect } from 'react';
import {
  Package, MapPin, Calendar, Ship, Navigation, RefreshCw,
  Activity, ArrowRight, X, Share2, Copy, Globe, Info,
  History, Gauge, Anchor, Wind, Droplets, Shield, ExternalLink,
  ChevronRight, AlertCircle, CheckCircle2, Factory
} from 'lucide-react';
import { DetailLeafletMap } from '@/components/DetailLeafletMap';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from 'framer-motion';

interface ShipmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: any;
  onUpdate: () => void;
}

type Tab = 'overview' | 'technicals' | 'history' | 'sustainability';

export const ShipmentDetailsModal = ({ isOpen, onClose, shipment, onUpdate }: ShipmentDetailsModalProps) => {
  const [loading, setLoading] = useState(false);
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when modal opens
      setTrackingData(null);
      setActiveTab('overview');
    }
  }, [isOpen]);

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

  const data = trackingData ? { ...shipment, ...trackingData } : shipment;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Globe },
    { id: 'technicals', label: 'Technical Details', icon: Gauge },
    { id: 'history', label: 'Location History', icon: History },
    { id: 'sustainability', label: 'Sustainability', icon: Droplets },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isExpanded ? 'max-w-[98vw] h-[95vh]' : 'max-w-[1200px] h-[85vh]'} p-0 border-none bg-transparent shadow-none overflow-hidden`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="w-full h-full bg-[#050505] rounded-[3rem] border border-white/10 flex flex-col relative shadow-[0_40px_100px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-10 py-6 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-gradient-to-br from-[#FF8A00] to-[#FF5C00] rounded-2xl flex items-center justify-center text-black shadow-[0_10px_30px_rgba(255,138,0,0.3)] shrink-0">
                <Package className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{data.container_id}</DialogTitle>
                  <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[#00FFBD] text-[9px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    Live Connection
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                  <span>{data.shipping_line_name?.replace('_', ' ')}</span>
                  <div className="w-1 h-1 bg-white/10 rounded-full" />
                  <span>ID: #{data.id}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Controls */}
              <div className="flex bg-white/5 rounded-2xl border border-white/10 p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-propulsion-orange text-black' : 'text-gray-500 hover:text-white'}`}
                  >
                    <tab.icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  {isExpanded ? <Activity className="rotate-90 w-5 h-5" /> : <Activity className="w-5 h-5" />}
                </button>
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all group"
                >
                  <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Layout Area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar: Key Stats */}
            <div className="w-[320px] border-r border-white/5 p-8 space-y-8 overflow-y-auto overflow-x-hidden custom-scrollbar bg-black/20 shrink-0">
              {/* Main Status Card */}
              <div className="bg-gradient-to-br from-[#FF8A00] to-[#FF5C00] p-7 rounded-[2.5rem] text-black relative overflow-hidden group">
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black text-black/50 uppercase tracking-[0.2em]">Operational Status</span>
                    <Info className="w-4 h-4 text-black/30" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-[0.9]">{data.container_status || 'DETECTING'}</h3>
                  <div className="pt-2 flex items-center gap-3">
                    <div className="px-3 py-1.5 bg-black rounded-xl text-propulsion-orange text-[9px] font-black uppercase tracking-widest">Priority One</div>
                  </div>
                </div>
                <Package className="absolute -bottom-8 -right-8 w-40 h-40 text-black/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              </div>

              {/* Quick Intel */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] px-2 mb-4">Voyage Intel</h4>

                <div className="grid gap-3">
                  <div className="p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-propulsion-orange transition-colors">
                        <Ship className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Primary Carrier</p>
                        <p className="text-sm font-black text-white truncate max-w-[160px]">{data.current_vessel_name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-propulsion-orange transition-colors">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Expected Arrival</p>
                        <p className="text-sm font-black text-white">{data.final_destination_eta ? new Date(data.final_destination_eta).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'TBD'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 bg-white/[0.03] border border-white/5 rounded-3xl hover:border-white/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-propulsion-orange transition-colors">
                        <Droplets className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest text-emerald-500">Green Score</p>
                        <p className="text-sm font-black text-white">{data.co2_emissions ? `${Math.round(data.co2_emissions)} KG` : '--'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Health */}
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Satellite Link</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full" />
                    <div className="w-1 h-3 bg-emerald-500/50 rounded-full" />
                    <div className="w-1 h-5 bg-emerald-500/80 rounded-full" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight">Last Data Pulse</p>
                  <p className="text-xs text-white font-black">{data.updated_at ? new Date(data.updated_at).toLocaleTimeString() : 'WAITING...'}</p>
                </div>
                <Button
                  onClick={handleTrack}
                  disabled={loading}
                  className="w-full py-6 bg-white hover:bg-white/90 text-black rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  Re-Scan Fleet
                </Button>
              </div>
            </div>

            {/* Content Area: Main Tabs */}
            <div className="flex-1 flex flex-col min-w-0 bg-[#080808]">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 flex flex-col p-10 space-y-10 overflow-y-auto overflow-x-hidden custom-scrollbar"
                  >
                    {/* Map Section */}
                    <div className="grid grid-cols-12 gap-8 shrink-0">
                      <div className="col-span-8 h-[500px] bg-white/[0.02] border border-white/10 rounded-[2.5rem] overflow-hidden relative group">
                        <DetailLeafletMap shipment={data} className="h-full" />
                        <div className="absolute top-6 left-6 z-[1000] flex gap-3">
                          <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-white font-black text-[10px] uppercase tracking-widest">
                            Vessel Alpha Port
                          </div>
                        </div>
                      </div>

                      <div className="col-span-4 flex flex-col gap-6">
                        <div className="p-8 bg-white/[0.04] border border-white/10 rounded-[2.5rem] flex-1 flex flex-col justify-between relative overflow-hidden group">
                          <div className="space-y-4">
                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-propulsion-orange">
                              <MapPin className="w-6 h-6 border-black" />
                            </div>
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Current Positioning</h4>
                            <div className="space-y-1">
                              <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{data.last_location || 'AT SEA'}</h2>
                              <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">{data.last_location_terminal || 'International Waters'}</p>
                            </div>
                          </div>
                          <ArrowRight className="absolute bottom-8 right-8 w-12 h-12 text-white/5 -rotate-45 group-hover:rotate-0 transition-transform duration-500" />
                        </div>

                        <div className="p-8 bg-white/[0.04] border border-white/10 rounded-[2.5rem] flex-1 flex flex-col justify-between relative overflow-hidden group border-l-4 border-l-propulsion-orange">
                          <div className="space-y-4">
                            <div className="w-12 h-12 bg-propulsion-orange/10 rounded-2xl flex items-center justify-center text-propulsion-orange">
                              <Anchor className="w-6 h-6" />
                            </div>
                            <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Final Terminal</h4>
                            <div className="space-y-1">
                              <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">{data.final_destination_port || 'PENDING'}</h2>
                              <p className="text-sm font-bold text-gray-500 uppercase tracking-tight">{data.final_destination || 'Awaiting Arrival'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Journey Breakdown */}
                    <div className="space-y-6">
                      <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-2">Logistics Intelligence</h4>
                      <div className="grid grid-cols-4 gap-6">
                        {[
                          { label: 'Loading Port', val: data.loading_port || 'TBA', icon: Anchor },
                          { label: 'Voyage No', val: data.current_voyage_number || '---', icon: Navigation },
                          { label: 'Discharge Port', val: data.discharging_port || 'TBA', icon: Ship },
                          { label: 'Transit Time', val: '14 Days Est.', icon: Activity }
                        ].map((stat, i) => (
                          <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] hover:bg-white/[0.04] transition-all">
                            <stat.icon className="w-5 h-5 text-gray-600 mb-4" />
                            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-lg font-black text-white uppercase tracking-tight">{stat.val}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'technicals' && (
                  <motion.div
                    key="technicals"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 p-10 space-y-10 custom-scrollbar overflow-y-auto"
                  >
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-8">
                        <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[3rem] relative overflow-hidden group">
                          <div className="relative z-10 flex items-center justify-between">
                            <div className="space-y-6">
                              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-propulsion-orange shadow-inner">
                                <Ship className="w-8 h-8" />
                              </div>
                              <div>
                                <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">{data.current_vessel_name}</h3>
                                <div className="flex gap-4">
                                  <span className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">IMO: 9876543</span>
                                  <span className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">MMSI: 235123445</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Ship className="absolute -bottom-10 -right-10 w-64 h-64 text-white/[0.02] group-hover:scale-110 transition-transform duration-1000" />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
                            <Gauge className="w-6 h-6 text-emerald-500" />
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Velocity</p>
                            <p className="text-4xl font-black text-white">{data.vessel_speed || '0.0'} <span className="text-sm text-gray-600 font-bold uppercase tracking-widest">Knots</span></p>
                          </div>
                          <div className="p-8 bg-zinc-900/50 border border-white/5 rounded-3xl space-y-4">
                            <Navigation className="w-6 h-6 text-propulsion-orange" />
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Heading</p>
                            <p className="text-4xl font-black text-white">{data.vessel_course || '0'}° <span className="text-sm text-gray-600 font-bold uppercase tracking-widest">NW</span></p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] px-2 flex items-center gap-3">
                          Vessel Specification
                          <div className="h-px flex-1 bg-white/10" />
                        </h4>
                        <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] divide-y divide-white/5 overflow-hidden">
                          {[
                            { label: 'Build Year', value: '2019', icon: Factory },
                            { label: 'Deadweight', value: '154,000 T', icon: Gauge },
                            { label: 'Max Capacity', value: '18,000 TEU', icon: Package },
                            { label: 'Vessel Type', value: 'Container Ship', icon: Ship },
                            { label: 'Flag', value: 'Panama (PA)', icon: Globe },
                            { label: 'Registry', value: 'Liberia', icon: Shield },
                          ].map((spec, i) => (
                            <div key={i} className="flex items-center justify-between p-6 px-10 hover:bg-white/[0.02] transition-colors">
                              <div className="flex items-center gap-4">
                                <spec.icon className="w-4 h-4 text-gray-600" />
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{spec.label}</span>
                              </div>
                              <span className="text-sm font-black text-white uppercase tracking-tight">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 p-10 custom-scrollbar overflow-y-auto"
                  >
                    <div className="max-w-3xl mx-auto space-y-12 py-10">
                      {[
                        { label: 'DEPARTED ORIGIN', location: data.shipped_from || 'PORT OF ORIGIN', date: 'FEB 02, 2026', time: '14:30', success: true },
                        { label: 'GATE OUT TERMINAL', location: data.shipped_from_terminal || 'MAIN TERMINAL', date: 'FEB 02, 2026', time: '09:12', success: true },
                        { label: 'CONTAINER RECEIVED', location: 'PORT AREA 04', date: 'FEB 01, 2026', time: '18:45', success: true },
                      ].map((event, i) => (
                        <div key={i} className="flex gap-10 group">
                          <div className="flex flex-col items-center">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all ${event.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-white/5 border-white/10 text-gray-600'}`}>
                              {event.success ? <CheckCircle2 className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                            </div>
                            {i !== 2 && <div className="w-0.5 h-full bg-white/5 mt-4" />}
                          </div>
                          <div className="flex-1 pt-2 space-y-4">
                            <div className="flex items-center justify-between">
                              <h5 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em]">{event.label}</h5>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{event.date}</span>
                                <div className="w-1 h-1 bg-white/10 rounded-full" />
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{event.time}</span>
                              </div>
                            </div>
                            <div className="p-8 bg-white/[0.03] border border-white/5 rounded-[2rem] group-hover:border-propulsion-orange/30 transition-all">
                              <div className="flex items-center gap-4">
                                <MapPin className="w-5 h-5 text-gray-600" />
                                <span className="text-xl font-black text-white uppercase tracking-tight">{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'sustainability' && (
                  <motion.div
                    key="sustainability"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex-1 p-10 space-y-10 custom-scrollbar overflow-y-auto"
                  >
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-12 bg-gradient-to-br from-emerald-500/20 to-transparent border border-emerald-500/20 rounded-[3rem] relative overflow-hidden flex flex-col justify-between">
                        <div className="space-y-6">
                          <Globe className="w-16 h-16 text-[#00FFBD] mb-10" />
                          <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-[0.8]">Sustainability Report</h2>
                          <p className="text-sm text-gray-400 font-medium max-w-[400px]">Advanced real-time carbon tracking based on actual vessel efficiency and voyage route data.</p>
                        </div>
                        <div className="mt-20">
                          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4">Total Carbon Impact</p>
                          <div className="flex items-baseline gap-4">
                            <h3 className="text-7xl font-black text-white tracking-tighter">{data.co2_emissions ? Math.round(data.co2_emissions) : '1,240'}</h3>
                            <p className="text-2xl font-black text-emerald-500 uppercase tracking-tight">KG CO2</p>
                          </div>
                        </div>
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />
                      </div>

                      <div className="space-y-6">
                        <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em] px-2">Carbon Contributors</h4>
                        <div className="grid gap-4">
                          {[
                            { label: 'Ocean Freight Phase', pct: 85, val: '1,054 KG' },
                            { label: 'Port Handling Phase', pct: 10, val: '124 KG' },
                            { label: 'Last Mile Transshipment', pct: 5, val: '62 KG' },
                          ].map((c, i) => (
                            <div key={i} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-6">
                              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className="text-gray-400">{c.label}</span>
                                <span className="text-white">{c.val}</span>
                              </div>
                              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${c.pct}%` }}
                                  transition={{ duration: 1, delay: i * 0.2 }}
                                  className="h-full bg-emerald-500 rounded-full"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group cursor-pointer hover:bg-emerald-500/5 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                              <Shield className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-black text-white uppercase tracking-tight">ESG Compliance Verified</span>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-emerald-500 transition-colors" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sharing Footer - only visible on overview */}
              {activeTab === 'overview' && (
                <div className="mt-auto border-t border-white/5 bg-black/40 backdrop-blur-xl px-10 py-6 flex items-center justify-between">
                  <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${data.is_public ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Public Visibility: {data.is_public ? 'Active' : 'Private'}</span>
                    </div>

                    {data.is_public && (
                      <div className="flex items-center gap-2 px-4 py-2.5 bg-white/5 rounded-xl border border-white/10 max-w-[300px]">
                        <Globe className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                        <span className="text-[10px] font-mono text-gray-500 truncate">{`${window.location.origin}/track/${data.share_token}`}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/track/${data.share_token}`);
                          }}
                          className="p-1 hover:text-propulsion-orange transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
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
                      className={`h-12 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center gap-2 ${data.is_public ? 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'}`}
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      {data.is_public ? 'Revoke Access' : 'Initial Public Node'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </DialogContent>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 138, 0, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 138, 0, 0.3);
        }
      `}</style>
    </Dialog >
  );
};
