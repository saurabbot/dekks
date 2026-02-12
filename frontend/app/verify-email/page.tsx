"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import Link from 'next/link';

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
};

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'already_verified'>('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('No verification token provided');
                return;
            }

            try {
                const response = await api.post('/email/verify-email', null, {
                    params: { token }
                });

                if (response.data.already_verified) {
                    setStatus('already_verified');
                    setMessage('Your email is already verified');
                } else {
                    setStatus('success');
                    setMessage('Email verified successfully!');

                    // Redirect to dashboard after 3 seconds
                    setTimeout(() => {
                        router.push('/dashboard');
                    }, 3000);
                }
            } catch (error: any) {
                setStatus('error');
                setMessage(error.response?.data?.detail || 'Verification failed. The link may be invalid or expired.');
            }
        };

        verifyEmail();
    }, [token, router]);

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
                <Link href="/login" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                    Back to Login
                </Link>
            </motion.nav>

            <main className="flex-1 flex flex-col items-center justify-center p-6 w-full relative z-10">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={fadeInUp}
                    className="w-full max-w-md flex flex-col items-center"
                >
                    {/* Status Icon */}
                    <div className="mb-8">
                        {status === 'loading' && (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 rounded-full bg-white/5 border-4 border-white/10 border-t-propulsion-orange flex items-center justify-center"
                            >
                                <Loader2 className="w-10 h-10 text-propulsion-orange" />
                            </motion.div>
                        )}

                        {status === 'success' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.6 }}
                                className="w-20 h-20 rounded-full bg-green-500/10 border-4 border-green-500/20 flex items-center justify-center"
                            >
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </motion.div>
                        )}

                        {status === 'already_verified' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.6 }}
                                className="w-20 h-20 rounded-full bg-blue-500/10 border-4 border-blue-500/20 flex items-center justify-center"
                            >
                                <Mail className="w-12 h-12 text-blue-500" />
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", duration: 0.6 }}
                                className="w-20 h-20 rounded-full bg-red-500/10 border-4 border-red-500/20 flex items-center justify-center"
                            >
                                <XCircle className="w-12 h-12 text-red-500" />
                            </motion.div>
                        )}
                    </div>

                    {/* Status Message */}
                    <motion.div
                        variants={fadeInUp}
                        className="text-center space-y-4"
                    >
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
                            {status === 'loading' && 'Verifying Your Email...'}
                            {status === 'success' && 'Email Verified!'}
                            {status === 'already_verified' && 'Already Verified'}
                            {status === 'error' && 'Verification Failed'}
                        </h1>

                        <p className="text-gray-400 font-medium max-w-sm mx-auto">
                            {message}
                        </p>

                        {status === 'success' && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-sm text-gray-500 font-medium"
                            >
                                Redirecting to dashboard in 3 seconds...
                            </motion.p>
                        )}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        variants={fadeInUp}
                        className="mt-10 w-full space-y-3"
                    >
                        {status === 'success' && (
                            <Button
                                onClick={() => router.push('/dashboard')}
                                className="w-full h-14 bg-propulsion-orange text-black font-extrabold rounded-2xl hover:shadow-[0_0_30px_rgba(255,138,0,0.4)] transition-all"
                            >
                                Go to Dashboard
                            </Button>
                        )}

                        {status === 'already_verified' && (
                            <Button
                                onClick={() => router.push('/dashboard')}
                                className="w-full h-14 bg-propulsion-orange text-black font-extrabold rounded-2xl hover:shadow-[0_0_30px_rgba(255,138,0,0.4)] transition-all"
                            >
                                Go to Dashboard
                            </Button>
                        )}

                        {status === 'error' && (
                            <>
                                <Button
                                    onClick={() => router.push('/login')}
                                    className="w-full h-14 bg-propulsion-orange text-black font-extrabold rounded-2xl hover:shadow-[0_0_30px_rgba(255,138,0,0.4)] transition-all"
                                >
                                    Back to Login
                                </Button>
                                <Button
                                    onClick={() => window.location.reload()}
                                    variant="outline"
                                    className="w-full h-14 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 transition-all"
                                >
                                    Try Again
                                </Button>
                            </>
                        )}
                    </motion.div>
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
