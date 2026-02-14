"use client";

import { useState, useEffect, useRef } from 'react';
import { Bell, Package, Check, Clock, X } from 'lucide-react';
import api from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/notifications/');
            setNotifications(res.data);
            setUnreadCount(res.data.filter((n: any) => !n.is_read).length);
        } catch (err) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id: number) => {
        try {
            await api.post(`/notifications/${id}/read`);
            fetchNotifications();
        } catch (err) {
            console.error('Failed to mark notification as read');
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 bg-accent/50 hover:bg-accent rounded-xl transition-colors group"
            >
                <Bell className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-propulsion-orange rounded-full border-2 border-background" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-[380px] bg-[#0A0A0A] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden z-[100]"
                    >
                        <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-black text-[10px] uppercase tracking-widest text-gray-500">Notifications</h3>
                            <div className="flex items-center gap-3">
                                {unreadCount > 0 && <span className="px-2 py-0.5 bg-propulsion-orange/10 text-propulsion-orange text-[9px] font-black rounded-full">{unreadCount} New</span>}
                                <button onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            {notifications.length === 0 ? (
                                <div className="p-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-gray-700">
                                        <Bell className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Inbox Clean</p>
                                        <p className="text-[10px] text-gray-600 font-medium">No new alerts at this time</p>
                                    </div>
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`p-5 flex gap-4 transition-all cursor-pointer border-b border-white/5 last:border-none hover:bg-white/[0.03] ${!n.is_read ? 'bg-propulsion-orange/[0.03]' : ''}`}
                                        onClick={() => {
                                            if (!n.is_read) markAsRead(n.id);
                                        }}
                                    >
                                        <div className={`w-12 h-12 rounded-[1.2rem] flex items-center justify-center shrink-0 border transition-colors ${!n.is_read ? 'bg-propulsion-orange/10 border-propulsion-orange/20 text-propulsion-orange' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 space-y-1.5 overflow-hidden">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={`text-[11px] font-black uppercase tracking-tight truncate ${!n.is_read ? 'text-white' : 'text-gray-500'}`}>{n.title}</p>
                                                <div className="flex items-center gap-1 text-[9px] text-gray-600 whitespace-nowrap font-bold uppercase">
                                                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                                                </div>
                                            </div>
                                            <p className={`text-xs leading-relaxed line-clamp-2 ${!n.is_read ? 'text-gray-300' : 'text-gray-500'}`}>{n.message}</p>
                                            {!n.is_read && (
                                                <div className="flex items-center gap-2 pt-1">
                                                    <div className="w-1.5 h-1.5 bg-propulsion-orange rounded-full animate-pulse" />
                                                    <span className="text-[9px] font-black text-propulsion-orange uppercase tracking-widest">New Update</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-4 bg-white/[0.01] border-t border-white/5">
                                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white transition-all">
                                    Clear All History
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
