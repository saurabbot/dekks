"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import {
    Container,
    Ship,
    MapPin,
    Anchor,
    Activity,
    AlertCircle,
    ArrowRight,
    Clock,
    Navigation
} from 'lucide-react';
import dynamic from 'next/dynamic';

const LiveMap = dynamic(
    () => import('@/components/LiveMap').then((mod) => mod.LiveMap),
    { ssr: false, loading: () => <div className="w-full h-full bg-[#080808] animate-pulse rounded-3xl" /> }
);

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
};

export default function PublicTrackingPage() {
    const { token } = useParams();
    const [shipment, setShipment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShipment = async () => {
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/shipments/public/${token}`);
                setShipment(response.data);
            } catch (err: any) {
                setError(err.response?.data?.detail || "Could not find shipment");
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchShipment();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-propulsion-orange/20 border-t-propulsion-orange rounded-full animate-spin" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Locating Shipment...</p>
                </div>
            </div>
        );
    }

    if (error || !shipment) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
                <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center max-w-md">
                    <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 mx-auto mb-8">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4 tracking-tight">Access Denied</h1>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        This tracking link is invalid or has expired. Please contact the sender for a new link.
                    </p>
                    <a href="/" className="inline-flex items-center gap-2 text-propulsion-orange font-bold uppercase tracking-widest text-xs hover:gap-3 transition-all">
                        Return to Home <ArrowRight className="w-4 h-4" />
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-propulsion-orange/30">
            <div className="fixed inset-0 propulsion-gradient opacity-[0.05] pointer-events-none" />

            {/* Header */}
            <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <Logo className="w-8 h-8 text-propulsion-orange" />
                    <span className="text-xl font-bold tracking-tighter uppercase">Dekks Tracking</span>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    LIVE_STATUS
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Shipment Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-12 h-12 bg-propulsion-orange/20 rounded-2xl flex items-center justify-center">
                                    <Container className="text-propulsion-orange w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Container ID</div>
                                    <div className="text-xl font-bold tracking-tight">{shipment.container_id}</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Status</span>
                                    <span className="text-sm font-bold text-propulsion-orange">{shipment.container_status}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Carrier</span>
                                    <span className="text-sm font-bold text-white">{shipment.shipping_line_name}</span>
                                </div>
                                <div className="flex justify-between items-center py-4 border-b border-white/5">
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Vessel</span>
                                    <span className="text-sm font-bold text-white">{shipment.current_vessel_name || 'N/A'}</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ delay: 0.1 }} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-xl">
                            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] mb-6">Route Insights</h3>
                            <div className="space-y-8 relative">
                                <div className="absolute left-4 top-2 bottom-2 w-px bg-white/5" />

                                <div className="relative pl-12">
                                    <div className="absolute left-2.5 top-0 w-3 h-3 rounded-full bg-propulsion-orange border-2 border-black" />
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Origin</div>
                                    <div className="text-sm font-bold">{shipment.shipped_from || 'Loading Port'}</div>
                                    <div className="text-[10px] text-gray-400 mt-1">{shipment.shipped_from_terminal}</div>
                                </div>

                                <div className="relative pl-12">
                                    <div className="absolute left-2.5 top-0 w-3 h-3 rounded-full bg-propulsion-orange/50 border-2 border-black animate-pulse" />
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Current Location</div>
                                    <div className="text-sm font-bold text-propulsion-orange">{shipment.last_location || 'At Sea'}</div>
                                    <div className="text-[10px] text-gray-400 mt-1">{shipment.last_location_terminal}</div>
                                </div>

                                <div className="relative pl-12 opacity-50">
                                    <div className="absolute left-2.5 top-0 w-3 h-3 rounded-full bg-zinc-700 border-2 border-black" />
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Destination</div>
                                    <div className="text-sm font-bold">{shipment.shipped_to || 'Final Port'}</div>
                                    <div className="text-[10px] text-gray-400 mt-1">{shipment.shipped_to_terminal}</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Live Map */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="h-[600px] w-full relative"
                        >
                            <LiveMap />
                            <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Activity className="w-4 h-4 text-propulsion-orange" />
                                    <span className="text-[10px] font-bold text-white uppercase tracking-widest">AIS_TELEMETRY_CONNECTED</span>
                                </div>
                            </div>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ delay: 0.3 }} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20">
                                        <Clock className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Predicted Arrival</div>
                                        <div className="text-lg font-mono font-bold tracking-tight">
                                            {shipment.eta_final_destination ? new Date(shipment.eta_final_destination).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Calculating...'}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div initial="initial" animate="animate" variants={fadeInUp} transition={{ delay: 0.4 }} className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 backdrop-blur-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20">
                                        <Navigation className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Next Port</div>
                                        <div className="text-lg font-bold tracking-tight">{shipment.next_location || 'En Route'}</div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center px-6">
                <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em]">
                    Powered by <span className="text-white">Dekks Logistics Platform</span>
                </div>
            </footer>

            {/* Styles for the propulsion gradient (matches landing page style) */}
            <style jsx global>{`
        .propulsion-gradient {
          background: radial-gradient(circle at 50% 50%, #FF8A00 0%, transparent 50%);
          filter: blur(100px);
        }
      `}</style>
        </div>
    );
}
