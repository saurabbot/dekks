'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Logo } from '@/components/Logo';
import {
  Globe,
  Zap,
  BarChart3,
  ArrowRight,
  Shield,
  Layers,
  Container,
  Ship,
  Bell,
  Mail,
  MessageSquare,
  Activity,
  MapPin,
  Anchor,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const features = [
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Global Port Coverage",
    desc: "Direct API integrations with 600+ carriers and major global terminals.",
    color: "from-blue-500/20 to-cyan-500/20"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "AI Predictive ETA",
    desc: "Machine learning models factoring in weather and port congestion.",
    color: "from-orange-500/20 to-red-500/20"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Carbon Analytics",
    desc: "Automatically calculate and report Scope 3 emissions per shipment.",
    color: "from-emerald-500/20 to-teal-500/20"
  }
];
function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}

function WorldGlobe() {
  return (
    <div className="relative w-full aspect-square max-w-[500px] mx-auto opacity-40">
      <div className="absolute inset-0 rounded-full bg-propulsion-orange/5 blur-3xl animate-pulse" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="w-full h-full relative"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full text-propulsion-orange/30">
          <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M10 50 Q 50 10 90 50 T 10 50" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <path d="M10 50 Q 50 90 90 50 T 10 50" fill="none" stroke="currentColor" strokeWidth="0.2" />
          <circle cx="50" cy="50" r="1" fill="currentColor" />
          {[...Array(12)].map((_, i) => (
            <circle
              key={i}
              cx={(50 + 35 * Math.cos((i * Math.PI) / 6)).toFixed(2)}
              cy={(50 + 35 * Math.sin((i * Math.PI) / 6)).toFixed(2)}
              r="0.8"
              fill="currentColor"
              className="animate-pulse"
            />
          ))}
        </svg>
      </motion.div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-white tracking-widest">GLOBAL</div>
          <div className="text-xs text-propulsion-orange font-mono">NETWORK_ACTIVE</div>
        </div>
      </div>
    </div>
  );
}

function NotificationDemo() {
  const isMounted = useIsMounted();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!isMounted) return;
    const types = [
      { type: 'whatsapp', icon: <MessageSquare className="w-4 h-4 text-green-500" />, text: 'Shipment #4928 Arrived at Port of Singapore', time: 'Just now' },
      { type: 'email', icon: <Mail className="w-4 h-4 text-blue-500" />, text: 'Delayed: Weather warning for Atlantic Route', time: '1m ago' },
      { type: 'system', icon: <Bell className="w-4 h-4 text-propulsion-orange" />, text: 'ETA Update: Predictive AI reduced transit by 14h', time: '2m ago' }
    ];

    let count = 0;
    const interval = setInterval(() => {
      const newNotif = {
        ...types[count % 3],
        instanceId: Date.now()
      };
      setNotifications(prev => [newNotif, ...prev].slice(0, 3));
      count++;
    }, 4000);

    return () => clearInterval(interval);
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div className="relative w-full max-w-sm mx-auto space-y-4">
      <AnimatePresence initial={false} mode="popLayout">
        {notifications.map((notif) => (
          <motion.div
            key={notif.instanceId}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, x: -20, transition: { duration: 0.2 } }}
            className="bg-zinc-950/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-start gap-4 shadow-2xl"
          >
            <div className="flex-shrink-0 mt-1">{notif.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{notif.type} notification</span>
                <span className="text-[10px] text-gray-500">Just now</span>
              </div>
              <p className="text-sm text-gray-200 leading-tight font-medium">{notif.text}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function TrackingVisualization() {
  const isMounted = useIsMounted();

  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-propulsion-orange/20 rounded-xl flex items-center justify-center">
            <Container className="text-propulsion-orange w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Container ID</div>
            <div className="text-lg font-mono font-bold">MSKU9382011</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">Status</div>
          <div className="text-sm font-bold text-propulsion-orange flex items-center gap-2 justify-end">
            <span className="w-2 h-2 rounded-full bg-propulsion-orange animate-pulse" />
            IN TRANSIT
          </div>
        </div>
      </div>

      <div className="relative h-2 bg-white/5 rounded-full mb-20">
        <motion.div
          initial={{ width: "0%" }}
          animate={isMounted ? { width: "65%" } : { width: "0%" }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-propulsion-orange/50 to-propulsion-orange rounded-full"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-propulsion-orange rounded-lg shadow-[0_0_15px_rgba(255,102,0,0.5)] flex items-center justify-center"
          >
            <Ship className="w-3.5 h-3.5 text-black" />
          </motion.div>
        </motion.div>

        {/* Milestones */}
        <div className="absolute inset-x-0 -bottom-10 flex justify-between px-2">
          {[
            { label: 'Shanghai', status: 'done', icon: <Anchor className="w-3 h-3" /> },
            { label: 'Singapore', status: 'done', icon: <Anchor className="w-3 h-3" /> },
            { label: 'Rotterdam', status: 'current', icon: <Activity className="w-3 h-3" /> },
            { label: 'New York', status: 'upcoming', icon: <MapPin className="w-3 h-3" /> }
          ].map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className={`w-1 h-2 rounded-full ${m.status !== 'upcoming' ? 'bg-propulsion-orange' : 'bg-white/10'}`} />
              <span className={`text-[10px] uppercase font-bold tracking-tighter ${m.status === 'upcoming' ? 'text-gray-600' : 'text-gray-300'}`}>
                {m.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Temp / Humidity</div>
          <div className="text-lg font-mono">18°C / 42%</div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
          <div className="text-[10px] text-gray-500 font-bold uppercase mb-1">Predicted ETA</div>
          <div className="text-lg font-mono">FEB 14, 2026</div>
        </div>
      </div>
    </div>
  );
}


// --- Original SpotlightCard ---

function SpotlightCard({ icon, title, desc, color }: any) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const background = useTransform(
    [mouseX, mouseY],
    ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,102,0,0.1), transparent 40%)`
  );

  return (
    <motion.div
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative h-full rounded-3xl border border-white/10 bg-[#0a0a0a] p-8 overflow-hidden transition-colors hover:border-propulsion-orange/50"
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background }}
      />

      <div className="relative z-10">
        <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${color} border border-white/5 text-propulsion-orange shadow-lg shadow-black/50`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-white mb-3">
          {title}
        </h3>
        <p className="text-gray-400 leading-relaxed text-sm md:text-base">
          {desc}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-propulsion-orange transition-all duration-700 group-hover:w-full" />
    </motion.div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-propulsion-orange/30 selection:text-white">
      <div className="fixed inset-0 propulsion-gradient opacity-[0.15] pointer-events-none" />

      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-50 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-3">
          <Logo className="w-8 h-8 text-propulsion-orange" />
          <span className="text-xl font-bold tracking-tighter uppercase">Dekks</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="#features" className="hover:text-white transition-colors">Platform</Link>
          <Link href="#solutions" className="hover:text-white transition-colors">Solutions</Link>
          <Link href="/login" className="px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white">
            Sign In
          </Link>
        </div>
      </motion.nav>

      <main className="relative z-10">
        <section className="flex flex-col items-center justify-center pt-24 pb-32 px-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center max-w-5xl"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-propulsion-orange/10 border border-propulsion-orange/20 text-propulsion-orange text-xs font-bold mb-10 uppercase tracking-[0.2em]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-propulsion-orange opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-propulsion-orange"></span>
              </span>
              Intelligence for Logistics
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-6xl md:text-[100px] font-bold mb-10 tracking-tighter leading-[0.85] bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
            >
              Move with <br />
              <span className="text-propulsion-orange">Precision.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-gray-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed"
            >
              The unified orchestration layer for global supply chains.
              Real-time container tracking meets predictive AI.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/login"
                className="group px-10 py-4 bg-propulsion-orange text-black font-extrabold rounded-2xl hover:shadow-[0_0_30px_rgba(255,102,0,0.4)] transition-all text-lg flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/dashboard"
                className="px-10 py-4 border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-2xl text-white font-bold transition-all text-lg"
              >
                View Demo
              </Link>
            </motion.div>
          </motion.div>

          {/* New Interactive Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-40 w-full max-w-7xl items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                Track every <br />
                <span className="text-propulsion-orange">Move.</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-md">
                Granular visibility across the entire supply chain. From berth to warehouse,
                stay informed with sub-minute latency.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-white font-medium">
                  <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
                    <MessageSquare className="w-4 h-4 text-green-500" />
                  </div>
                  WhatsApp Notifications
                </div>
                <div className="flex items-center gap-4 text-white font-medium">
                  <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <Mail className="w-4 h-4 text-blue-500" />
                  </div>
                  Real-time Email Alerts
                </div>
              </div>
            </motion.div>

            <div className="relative">
              <div className="absolute -inset-20 bg-propulsion-orange/10 blur-[100px] rounded-full pointer-events-none" />
              <TrackingVisualization />
              <div className="absolute -top-10 -right-10 md:-right-20 z-20 w-64">
                <NotificationDemo />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-40 w-full max-w-7xl">
            {features.map((feature, i) => (
              <SpotlightCard key={i} {...feature} />
            ))}
          </div>
        </section>

        {/* Global Network Section with World Globe and Buzz */}
        <section className="py-32 px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 lg:order-1">
              <WorldGlobe />
              {/* Stats buzz */}
              <div className="absolute top-0 right-0 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 animate-bounce">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global Ports</div>
                <div className="text-2xl font-bold">642+</div>
              </div>
              <div className="absolute bottom-10 left-0 p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 animate-pulse">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Vessels</div>
                <div className="text-2xl font-bold">12,840</div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-5xl font-bold mb-8 tracking-tight">
                A World of <br />
                <span className="text-propulsion-orange">Connectivity.</span>
              </h2>
              <div className="grid grid-cols-2 gap-8 mb-12">
                <div>
                  <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                  <div className="text-sm text-gray-500 font-medium">Uptime Guarantee</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-white mb-2">250ms</div>
                  <div className="text-sm text-gray-500 font-medium">Data Latency</div>
                </div>
              </div>
              <p className="text-gray-400 text-lg leading-relaxed">
                Our infrastructure handles over 5 million data points daily, ensuring that your logistics
                decisions are backed by the most current information available globally.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-32 px-4 border-t border-white/5 bg-[#030303]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
                Built for the <span className="text-propulsion-orange">Modern Carrier.</span>
              </h2>
              <div className="space-y-6">
                {[
                  { icon: <Shield />, t: "Enterprise Security", d: "SOC2 Type II compliant infrastructure for data privacy." },
                  { icon: <Layers />, t: "Native Integrations", d: "Connect seamlessly with SAP, Oracle, and custom ERPs." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-propulsion-orange mt-1">{item.icon}</div>
                    <div>
                      <h4 className="font-bold text-white">{item.t}</h4>
                      <p className="text-gray-400 text-sm">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="aspect-video bg-gradient-to-br from-propulsion-orange/20 to-transparent rounded-3xl border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-3xl m-1 rounded-[calc(1.5rem-1px)] flex items-center justify-center overflow-hidden">
                <div className="w-full p-8">
                  {/* Mini Dashboard Buzz */}
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(k => (
                      <div key={k} className="h-20 bg-white/5 rounded-xl border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-propulsion-orange/5 to-transparent" />
                        <div className="p-3">
                          <div className="w-8 h-1 bg-white/20 rounded-full mb-2" />
                          <div className="w-16 h-4 bg-white/10 rounded-full" />
                        </div>
                        <motion.div
                          animate={{ x: ["-100%", "100%"] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-propulsion-orange"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-propulsion-orange font-mono text-sm font-bold tracking-widest">
                    LIVE_ANALYTICS_V2.0
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 py-16 border-t border-white/5 text-center bg-[#050505]">
        <div className="text-gray-500 text-xs font-bold tracking-[0.3em] uppercase">
          Technology by <span className="text-white">Propulsion AI</span>
        </div>
      </footer>
    </div>
  );
}

