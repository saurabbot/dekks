"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap } from 'lucide-react';

// Key global logistics hubs
const HUB_LOCATIONS = [
    { id: 1, name: 'Singapore', x: 80, y: 70, status: 'active', traffic: 'High' },
    { id: 2, name: 'Rotterdam', x: 48, y: 35, status: 'warning', traffic: 'Congested' },
    { id: 3, name: 'Shanghai', x: 85, y: 55, status: 'active', traffic: 'Normal' },
    { id: 4, name: 'New York', x: 25, y: 40, status: 'active', traffic: 'High' },
    { id: 5, name: 'Los Angeles', x: 12, y: 45, status: 'active', traffic: 'Normal' },
    { id: 6, name: 'Dubai', x: 62, y: 55, status: 'active', traffic: 'High' },
];

export const GlobalMap = () => {
    const [mounted, setMounted] = useState(false);
    const [hoveredHub, setHoveredHub] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <div className="w-full h-full bg-black/20 animate-pulse rounded-[2.5rem]" />;

    return (
        <div className="relative w-full h-full bg-[#080808] rounded-[2.5rem] overflow-hidden border border-white/5 group shadow-2xl">
            {/* Abstract Map Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_#fff_1px,_transparent_1px)] [background-size:40px_40px]" />
            </div>

            {/* World Map SVG Container */}
            <svg
                viewBox="0 0 100 100"
                className="w-full h-full p-10 opacity-30 grayscale"
                preserveAspectRatio="xMidYMid slice"
            >
                <path
                    d="M10,40 Q15,35 20,40 T30,45 T45,42 T60,50 T75,45 T90,55"
                    fill="none"
                    stroke="rgba(255,138,0,0.2)"
                    strokeWidth="0.5"
                />
                <path
                    d="M20,60 Q30,65 40,55 T55,60 T70,70 T85,65"
                    fill="none"
                    stroke="rgba(255,138,0,0.1)"
                    strokeWidth="0.5"
                />

                {/* Animated Connection Routes */}
                <motion.path
                    d="M25,40 L48,35 L80,70 L85,55"
                    fill="none"
                    stroke="url(#route-gradient)"
                    strokeWidth="0.2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                <defs>
                    <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="50%" stopColor="#FF8A00" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Hub Interactive Points */}
            {HUB_LOCATIONS.map((hub) => (
                <div
                    key={hub.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
                    style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
                    onMouseEnter={() => setHoveredHub(hub)}
                    onMouseLeave={() => setHoveredHub(null)}
                >
                    <div className="relative">
                        <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${hub.status === 'warning' ? 'bg-red-500' : 'bg-propulsion-orange'}`} style={{ animationDuration: '3s' }} />
                        <div className={`w-2.5 h-2.5 rounded-full border border-black/50 shadow-lg ${hub.status === 'warning' ? 'bg-red-500' : 'bg-propulsion-orange'}`} />

                        <AnimatePresence>
                            {(hoveredHub?.id === hub.id) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                    className="absolute bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-zinc-900/90 border border-white/10 p-4 rounded-2xl shadow-2xl z-30 backdrop-blur-2xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${hub.status === 'warning' ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`} />
                                        <div>
                                            <div className="text-[13px] font-bold text-white tracking-tight">{hub.name}</div>
                                            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Traffic Index: {hub.traffic}</div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            ))}

            {/* Map Overlay UI */}
            <div className="absolute top-8 left-8 flex flex-col gap-4 pointer-events-none z-10">
                <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
                    <div className="w-10 h-10 bg-propulsion-orange/10 rounded-xl flex items-center justify-center border border-propulsion-orange/20">
                        <Zap className="w-5 h-5 text-propulsion-orange" />
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Network Status</div>
                        <div className="text-sm font-bold text-white uppercase tracking-tight">System_Optimized</div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 right-8 flex gap-3 z-10">
                <div className="bg-black/60 backdrop-blur-2xl border border-white/10 px-4 py-2.5 rounded-full flex items-center gap-3 shadow-2xl">
                    <Activity className="w-3.5 h-3.5 text-propulsion-orange animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Real-time Telemetry Active</span>
                </div>
            </div>

            {/* Vignette Effect */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.9)] z-0" />
        </div>
    );
};
