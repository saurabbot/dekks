"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';

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

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', formData);
      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-propulsion-orange/30 selection:text-white flex flex-col items-center relative overflow-hidden">
      {/* Background Gradient */}
      <div className="fixed inset-0 propulsion-gradient opacity-[0.2] pointer-events-none" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex items-center justify-between px-6 py-6 max-w-7xl mx-auto relative z-50"
      >
        <Link href="/" className="flex items-center gap-3">
          <Logo className="w-8 h-8 text-propulsion-orange" />
          <span className="text-xl font-bold tracking-tighter uppercase">Dekks</span>
        </Link>
        <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
          Already have an account?
        </Link>
      </motion.nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="w-full max-w-[480px] flex flex-col items-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-propulsion-orange/10 border border-propulsion-orange/20 text-propulsion-orange text-[10px] font-bold mb-8 uppercase tracking-[0.2em]"
          >
            <Sparkles className="w-3 h-3" />
            Join the Network
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-4 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
          >
            Create your account
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-gray-500 font-medium tracking-tight mb-10 text-center"
          >
            Join the next generation of global logistics orchestration.
          </motion.p>

          <motion.div variants={fadeInUp} className="w-full">
            <form onSubmit={handleRegister} className="w-full space-y-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-xs font-bold text-center uppercase tracking-widest mb-4"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-propulsion-orange transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="First Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-propulsion-orange/50 focus:outline-none transition-all font-medium text-sm"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  />
                </div>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-propulsion-orange transition-colors">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Last Name"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-propulsion-orange/50 focus:outline-none transition-all font-medium text-sm"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-propulsion-orange transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-propulsion-orange/50 focus:outline-none transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-propulsion-orange transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-propulsion-orange/50 focus:outline-none transition-all font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-propulsion-orange hover:bg-propulsion-orange text-black font-extrabold rounded-2xl hover:shadow-[0_0_30px_rgba(255,102,0,0.4)] transition-all text-lg flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Processing...' : 'Create Account'}
                {!loading && <ArrowRight className="w-5 h-5 font-black" />}
              </Button>
            </form>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mt-10 text-gray-500 text-sm font-medium"
          >
            Already joined the future of logistics? <Link href="/login" className="text-white hover:text-propulsion-orange transition-colors font-bold">Sign In</Link>
          </motion.p>
        </motion.div>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full py-8 text-center"
      >
        <div className="text-gray-600 text-[10px] font-bold tracking-[0.3em] uppercase flex items-center justify-center gap-6">
          <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <div className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-white font-mono uppercase">Secure_Encryption_AES256</span>
        </div>
      </motion.footer>
    </div>
  );
}

