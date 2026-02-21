"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Github, Chrome, Shield, Key, ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/context/auth-context';

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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showPassword && email) {
      setShowPassword(true);
      return;
    }
    handleLogin(e);
  };

  const handleLogin = async (e: React.FormEvent) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.access_token, response.data.refresh_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-propulsion-orange/30 selection:text-white flex flex-col items-center relative overflow-hidden">
      <div className="fixed inset-0 propulsion-gradient opacity-[0.2] pointer-events-none" />
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full flex items-center justify-between px-6 py-6 max-w-7xl mx-auto relative z-50"
      >
        <Link href="/" className="flex items-center gap-3">
          <Logo className="w-8 h-8 text-propulsion-orange" />
          <span className="text-xl font-bold tracking-tighter uppercase">Dekks</span>
        </Link>
        <Link href="/" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
          Back to Home
        </Link>
      </motion.nav>

      <main className="flex-1 flex flex-col items-center justify-center p-6 w-full relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="w-full max-w-[440px] flex flex-col items-center"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-propulsion-orange/10 border border-propulsion-orange/20 text-propulsion-orange text-[10px] font-bold mb-8 uppercase tracking-[0.2em]"
          >
            Secure Access
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold tracking-tighter text-center mb-10 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent"
          >
            Log in to <span className="text-propulsion-orange">Dekks</span>
          </motion.h1>

          <motion.div variants={fadeInUp} className="w-full">
            <form onSubmit={handleContinue} className="w-full space-y-4">
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

              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-propulsion-orange transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:border-propulsion-orange/50 focus:outline-none transition-all font-medium"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={showPassword && !loading}
                  />
                </div>

                <AnimatePresence>
                  {showPassword && (
                    <motion.div
                      key="password-input"
                      initial={{ opacity: 0, height: 0, y: -20 }}
                      animate={{ opacity: 1, height: 'auto', y: 0 }}
                      exit={{ opacity: 0, height: 0, y: -20 }}
                      className="relative group overflow-hidden"
                    >
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-propulsion-orange transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        placeholder="Password"
                        required
                        autoFocus
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-gray-600 focus:border-propulsion-orange/50 focus:outline-none transition-all font-medium"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
                      >
                        {isPasswordVisible ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-propulsion-orange hover:bg-propulsion-orange text-black font-extrabold rounded-2xl hover:shadow-[0_0_30px_rgba(255,102,0,0.4)] transition-all text-lg flex items-center justify-center gap-2"
                >
                  {loading ? 'Authenticating...' : showPassword ? 'Sign In' : 'Continue'}
                  {!loading && <ArrowRight className="w-5 h-5 font-black" />}
                </Button>
              </div>
            </form>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full my-8 flex items-center gap-4">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Or continue with</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </motion.div>
          <motion.div
            variants={fadeInUp}
            className="w-full grid grid-cols-2 gap-3"
          >
            <Button
              variant="outline"
              className="h-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-3"
            >
              <Chrome className="w-5 h-5" />
              <span>Google</span>
            </Button>

            <Button
              variant="outline"
              className="h-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-3"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </Button>
          </motion.div>

          <motion.div variants={fadeInUp} className="w-full mt-4 flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-3"
            >
              <Shield className="w-5 h-5" />
              <span>Enterprise SSO</span>
            </Button>
            <Button
              variant="outline"
              className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 text-white font-bold transition-all flex items-center justify-center gap-3"
            >
              <Key className="w-5 h-5" />
              <span>Continue with Passkey</span>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeInUp}
            className="mt-10 text-gray-500 text-sm font-medium"
          >
            Don't have an account? <Link href="/register" className="text-white hover:text-propulsion-orange transition-colors font-bold">Sign Up</Link>
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
          <span className="text-white">Dekks v2.0</span>
        </div>
      </motion.footer>
    </div>
  );
}

