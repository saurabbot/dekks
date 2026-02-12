"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import dynamic from 'next/dynamic';

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

      {/* Primary Intelligence Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        className="aspect-[21/9] w-full min-h-[500px] relative"
      >
        <LiveMap />
      </motion.div>
    </div>
  );
}
