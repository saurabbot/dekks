"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import api from '@/lib/api';
import { Bell, Mail, MessageSquare, Shield, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user, refreshUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [prefs, setPrefs] = useState({
        notify_on_arrival: true,
        notify_on_departure: true,
        notify_on_delay: true,
        notify_via_email: true,
        notify_via_whatsapp: false,
        whatsapp_number: ''
    });

    useEffect(() => {
        if (user) {
            setPrefs({
                notify_on_arrival: user.notify_on_arrival ?? true,
                notify_on_departure: user.notify_on_departure ?? true,
                notify_on_delay: user.notify_on_delay ?? true,
                notify_via_email: user.notify_via_email ?? true,
                notify_via_whatsapp: user.notify_via_whatsapp ?? false,
                whatsapp_number: user.whatsapp_number ?? ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            await api.patch('/auth/me', prefs);
            await refreshUser();
            toast.success('Settings updated successfully');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to update settings');
        } finally {
            setLoading(false);
        }
    };

    const toggle = (key: string) => {
        setPrefs(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
    };

    return (
        <div className="space-y-10 max-w-4xl">
            <div className="space-y-2">
                <h1 className="text-5xl font-black tracking-tighter uppercase text-white">Settings</h1>
                <p className="text-gray-500 font-medium tracking-tight text-lg">Manage your account preferences and notifications.</p>
            </div>

            <div className="grid gap-8">
                {/* Alerts Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-propulsion-orange/10 rounded-lg text-propulsion-orange">
                            <Bell className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Notification Alerts</h2>
                    </div>

                    <div className="grid gap-4">
                        <PreferenceToggle
                            title="Arrival Alerts"
                            description="Get notified when a shipment arrives at the port of discharge."
                            enabled={prefs.notify_on_arrival}
                            onToggle={() => toggle('notify_on_arrival')}
                        />
                        <PreferenceToggle
                            title="Departure Alerts"
                            description="Get notified when a shipment departs from the port of loading."
                            enabled={prefs.notify_on_departure}
                            onToggle={() => toggle('notify_on_departure')}
                        />
                        <PreferenceToggle
                            title="Delay Alerts"
                            description="Be the first to know if your shipment's ETA changes or encounters delays."
                            enabled={prefs.notify_on_delay}
                            onToggle={() => toggle('notify_on_delay')}
                        />
                    </div>
                </section>

                {/* Channels Section */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <Mail className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-black uppercase tracking-tight">Communication Channels</h2>
                    </div>

                    <div className="grid gap-4">
                        <PreferenceToggle
                            title="Email Notifications"
                            description="Receive detailed status updates and weekly reports via email."
                            enabled={prefs.notify_via_email}
                            onToggle={() => toggle('notify_via_email')}
                        />
                        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-white uppercase tracking-tight">WhatsApp Alerts <span className="ml-2 px-2 py-0.5 bg-propulsion-orange/10 text-propulsion-orange text-[9px] font-black rounded-full uppercase">Enterprise</span></h3>
                                    <p className="text-xs text-gray-500 font-medium max-w-md line-clamp-1">Receive real-time alerts directly on your WhatsApp.</p>
                                </div>
                                <button
                                    onClick={() => toggle('notify_via_whatsapp')}
                                    className={`w-14 h-8 rounded-full transition-all relative ${prefs.notify_via_whatsapp ? 'bg-propulsion-orange' : 'bg-white/10'}`}
                                >
                                    <motion.div
                                        animate={{ x: prefs.notify_via_whatsapp ? 24 : 4 }}
                                        className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-md"
                                    />
                                </button>
                            </div>

                            {prefs.notify_via_whatsapp && (
                                <div className="pt-4 border-t border-white/5">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-2">WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={prefs.whatsapp_number}
                                        onChange={(e) => setPrefs(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-propulsion-orange/50 transition-colors"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <div className="pt-6 flex justify-end">
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        className="bg-white hover:bg-white/90 text-black px-10 py-7 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-transform active:scale-95"
                    >
                        {loading ? <AlertCircle className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Preferences
                    </Button>
                </div>
            </div>
        </div>
    );
}

function PreferenceToggle({ title, description, enabled, onToggle }: { title: string, description: string, enabled: boolean, onToggle: () => void }) {
    return (
        <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between hover:bg-white/[0.04] transition-colors group">
            <div className="space-y-1">
                <h3 className="font-bold text-white uppercase tracking-tight group-hover:text-propulsion-orange transition-colors">{title}</h3>
                <p className="text-xs text-gray-500 font-medium max-w-md">{description}</p>
            </div>
            <button
                onClick={onToggle}
                className={`w-14 h-8 rounded-full transition-all relative ${enabled ? 'bg-propulsion-orange' : 'bg-white/10'}`}
            >
                <motion.div
                    animate={{ x: enabled ? 24 : 4 }}
                    className="w-6 h-6 bg-white rounded-full absolute top-1 shadow-md"
                />
            </button>
        </div>
    );
}
