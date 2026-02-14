"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import dynamic from 'next/dynamic';
import { Globe } from 'lucide-react';

const LiveMap = dynamic(
  () => import('@/components/LiveMap').then((mod) => mod.LiveMap),
  {
    ssr: false,
    loading: () => <div className="w-full h-full bg-[#080808] animate-pulse rounded-[2.5rem]" />
  }
);

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};
const HealthItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
      <span className="text-xs font-bold text-gray-400 uppercase tracking-tight">{label}</span>
    </div>
    <span className="text-sm font-black text-white">{value}</span>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-10">
      <motion.div
        initial="initial"
        animate="animate"
        className="flex flex-col gap-2"
      >
        <motion.div
          variants={fadeInUp}
          className="text-[10px] font-bold text-propulsion-orange uppercase tracking-[0.3em]"
        >
          Operation Center
        </motion.div>

        <div className="flex items-end justify-between">
          <motion.h1
            variants={fadeInUp}
            className="text-4xl lg:text-5xl font-bold tracking-tighter"
          >
            Welcome, <span className="text-white/50">{user?.first_name} {user?.last_name}.</span>
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            className="hidden lg:flex items-center gap-4 text-xs font-bold text-gray-500 uppercase tracking-widest"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              API_ONLINE
            </div>
            <div className="w-[1px] h-4 bg-white/10" />
            <div>FEB 10, 2026</div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 aspect-[21/9] w-full min-h-[500px] relative">
          <LiveMap />
        </div>

        <div className="space-y-6">
          <motion.div
            variants={fadeInUp}
            className="p-8 bg-[#0A0A0A] border border-[#00FFBD]/20 rounded-[2.2rem] space-y-6 relative overflow-hidden group shadow-[0_20px_40px_rgba(0,255,189,0.05)]"
          >
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#00FFBD]/10 rounded-lg text-[#00FFBD]">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Sustainability</span>
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-1">Fleet Impact</h3>
                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Estimated CO2 Footprint</p>
              </div>
              <div className="pt-4">
                <div className="text-4xl font-black text-[#00FFBD] tracking-tighter">4.2t <span className="text-lg font-bold text-[#00FFBD]/50">CO2</span></div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-[#00FFBD]/10 text-[#00FFBD] text-[9px] font-black rounded-full uppercase tracking-widest">-12% Saved</span>
                  <span className="text-[9px] font-bold text-gray-600 uppercase">vs Last Month</span>
                </div>
              </div>
            </div>
            <Globe className="absolute -bottom-10 -right-10 w-40 h-40 text-[#00FFBD]/5 group-hover:rotate-12 transition-transform duration-1000" />
          </motion.div>

          <motion.div
            variants={fadeInUp}
            className="p-8 bg-[#0A0A0A] border border-white/5 rounded-[2.2rem] space-y-6 relative group"
          >
            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Fleet Health</div>
              <div className="space-y-3">
                <HealthItem label="On-time Ratio" value="94%" color="bg-emerald-500" />
                <HealthItem label="Active Delays" value="2" color="bg-red-500" />
                <HealthItem label="Efficiency" value="88%" color="bg-propulsion-orange" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
