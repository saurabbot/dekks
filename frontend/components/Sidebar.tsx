"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  LogOut,
  Users,
  Store,
  Wallet,
  Settings,
  Shield,
  Bell
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';

export const Sidebar = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, href: '/dashboard', disabled: false },
    { name: 'Shipments', icon: Package, href: '/dashboard/shipments', disabled: false },
    { name: 'Customers', icon: Users, href: '/dashboard/customers', disabled: true },
    { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics', disabled: true },
    { name: 'Inventory', icon: Store, href: '/dashboard/shop', disabled: true },
    { name: 'Payments', icon: Wallet, href: '/dashboard/promote', disabled: true },
  ];

  const bottomItems = [
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
    { name: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-20 lg:w-72 bg-[#0A0A0A] border-r border-white/5 flex flex-col h-full relative z-50">
      {/* Brand */}
      <div className="px-6 py-10 flex items-center gap-4">
        <div className="flex-shrink-0">
          <Logo className="w-8 h-8 text-propulsion-orange" />
        </div>
        <span className="text-xl font-bold tracking-tighter uppercase hidden lg:block text-white">
          Dekks
        </span>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 space-y-8 mt-4">
        <div>
          <div className="px-4 mb-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hidden lg:block">
              Main Menu
            </span>
          </div>
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center justify-center lg:justify-start px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                    ? 'text-white'
                    : 'text-gray-500 hover:text-white'
                    } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl shadow-[inset_0_0_15px_rgba(255,255,255,0.02)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}

                  <div className={`relative z-10 transition-colors duration-300 ${isActive ? (item.disabled ? 'text-gray-500' : 'text-propulsion-orange') : 'group-hover:text-propulsion-orange'}`}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                  </div>

                  <span className="relative z-10 ml-4 hidden lg:block tracking-tight text-[15px]">
                    {item.name}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 w-1 h-5 bg-propulsion-orange rounded-r-full hidden lg:block"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="px-4 mb-4">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] hidden lg:block">
              System
            </span>
          </div>
          <nav className="space-y-1.5">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center justify-center lg:justify-start px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${isActive
                    ? 'text-white'
                    : 'text-gray-500 hover:text-white'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-white/5 border border-white/10 rounded-2xl"
                    />
                  )}
                  <item.icon className={`relative z-10 w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-propulsion-orange' : 'group-hover:text-propulsion-orange'}`} />
                  <span className="relative z-10 ml-4 hidden lg:block tracking-tight text-[15px]">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User / Footer */}
      <div className="px-4 pb-10">
        <button
          onClick={handleLogout}
          className="group flex items-center justify-center lg:justify-start w-full px-4 py-4 text-sm font-bold text-gray-500 hover:text-red-400 rounded-2xl transition-all duration-300 gap-0 hover:bg-red-500/5 mt-auto"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 transition-transform group-hover:-translate-x-1" />
          <span className="ml-4 hidden lg:block font-bold">Log Out</span>
        </button>
      </div>
    </aside>
  );
};
