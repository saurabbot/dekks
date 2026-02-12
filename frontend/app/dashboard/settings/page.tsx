"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Key, Bell, CreditCard, ChevronRight, Save, Camera, Smartphone, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'security', label: 'Security', icon: Shield },
        { id: 'api', label: 'Integrations', icon: Key },
        { id: 'billing', label: 'Enterprise', icon: CreditCard },
    ];

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
                    System Configuration
                </motion.div>

                <motion.h1
                    variants={fadeInUp}
                    className="text-4xl lg:text-5xl font-bold tracking-tighter"
                >
                    Settings
                </motion.h1>
            </motion.div>

            <div className="grid grid-cols-12 gap-8 h-full">
                {/* Settings Sidebar */}
                <motion.div
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                    className="col-span-12 lg:col-span-3 space-y-2"
                >
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <motion.button
                                key={tab.id}
                                variants={fadeInUp}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-3xl transition-all duration-300 group ${activeTab === tab.id
                                        ? 'bg-propulsion-orange/10 border border-propulsion-orange/20 text-propulsion-orange'
                                        : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-propulsion-orange' : 'group-hover:text-white'}`} />
                                    <span className="font-bold text-sm tracking-tight">{tab.label}</span>
                                </div>
                                {activeTab === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-propulsion-orange shadow-[0_0_10px_#FF8A00]" />}
                            </motion.button>
                        );
                    })}
                </motion.div>

                {/* Settings Content Area */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="col-span-12 lg:col-span-9"
                >
                    <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 lg:p-12 min-h-[600px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-propulsion-orange/5 blur-[120px] pointer-events-none" />

                        {activeTab === 'profile' && (
                            <div className="space-y-10 relative z-10">
                                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between border-b border-white/5 pb-10">
                                    <div className="flex items-center gap-6">
                                        <div className="relative group cursor-pointer">
                                            <div className="w-24 h-24 rounded-full bg-[#111] border-2 border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-propulsion-orange/50">
                                                <User className="w-10 h-10 text-gray-700" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Camera className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight text-white">Public Profile</h2>
                                            <p className="text-sm text-gray-500 font-medium">Manage how you appear on the platform.</p>
                                        </div>
                                    </div>
                                    <Button className="bg-white/5 border border-white/10 text-white font-bold px-6 h-12 rounded-2xl hover:bg-white/10">
                                        Edit Profile
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">First Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Captain"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-propulsion-orange/50 focus:outline-none transition-all font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Logistics"
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-propulsion-orange/50 focus:outline-none transition-all font-semibold"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            defaultValue="captain@dekks.io"
                                            disabled
                                            className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-gray-500 cursor-not-allowed font-semibold"
                                        />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <Button className="w-full lg:w-auto px-10 h-14 bg-propulsion-orange text-black font-extrabold rounded-2xl hover:shadow-[0_0_30px_-5px_#FF8A00] transition-all flex items-center justify-center gap-2">
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </Button>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-10 relative z-10">
                                <div className="border-b border-white/5 pb-10">
                                    <h2 className="text-2xl font-bold tracking-tight text-white">Security & Privacy</h2>
                                    <p className="text-sm text-gray-500 font-medium mt-1">Strengthen your account's defense.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-propulsion-orange/10 rounded-2xl flex items-center justify-center border border-propulsion-orange/20">
                                                <Smartphone className="w-6 h-6 text-propulsion-orange" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white tracking-tight">Two-Factor Authentication</h3>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5">Add an extra layer of security.</p>
                                            </div>
                                        </div>
                                        <Button className="h-10 px-4 bg-propulsion-orange/10 text-propulsion-orange border border-propulsion-orange/20 font-bold rounded-xl hover:bg-propulsion-orange/20">
                                            Enable
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5">
                                                <Globe className="w-6 h-6 text-gray-500" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-white tracking-tight">Active Sessions</h3>
                                                <p className="text-xs text-gray-500 font-medium mt-0.5">Currently active on 2 devices.</p>
                                            </div>
                                        </div>
                                        <ChevronRight className="text-gray-700" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'api' && (
                            <div className="space-y-10 relative z-10">
                                <div className="flex justify-between items-center border-b border-white/5 pb-10">
                                    <div>
                                        <h2 className="text-2xl font-bold tracking-tight text-white">API Integrations</h2>
                                        <p className="text-sm text-gray-500 font-medium mt-1">Orchestrate Dekks via external tools.</p>
                                    </div>
                                    <Button className="bg-propulsion-orange text-black font-extrabold px-6 h-12 rounded-2xl">
                                        Create New Key
                                    </Button>
                                </div>

                                <div className="bg-black/40 rounded-3xl border border-white/10 overflow-hidden">
                                    <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
                                        <div className="flex items-center gap-4">
                                            <Key className="text-propulsion-orange w-5 h-5" />
                                            <span className="text-sm font-bold text-white">Production_Alpha_Key</span>
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Expires in 12 days</span>
                                    </div>
                                    <div className="p-6">
                                        <div className="bg-black border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                            <code className="text-sm text-white/40 font-mono tracking-tighter">pk_live_**************************492a</code>
                                            <Button variant="ghost" className="text-propulsion-orange h-8 px-3 font-bold text-xs uppercase">Copy</Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
