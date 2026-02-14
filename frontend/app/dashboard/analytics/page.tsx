"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { BarChart3, TrendingUp, AlertTriangle, Ship, ArrowUpRight, ArrowDownRight, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/carriers');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[500px]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-propulsion-orange border-t-transparent" />
      </div>
    );
  }

  const topCarrier = data[0];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-propulsion-orange/10 rounded-lg text-propulsion-orange">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Fleet Intelligence</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase text-white">Carrier Analytics</h1>
          <p className="text-gray-500 font-medium tracking-tight text-lg">Benchmark your shipping lines based on actual delivery data.</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-6">
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total Carriers</p>
            <p className="text-2xl font-black text-white">{data.length}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Avg Reliability</p>
            <p className="text-2xl font-black text-propulsion-orange">
              {Math.round(data.reduce((acc, curr) => acc + curr.reliability_score, 0) / (data.length || 1))}%
            </p>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Most Reliable Carrier"
          value={topCarrier?.carrier || "N/A"}
          subValue={`${topCarrier?.reliability_score || 0}% On-time Arrival`}
          icon={<Ship className="w-6 h-6" />}
          trend="primary"
        />
        <StatCard
          title="Average Fleet Delay"
          value={`${Math.round(data.reduce((acc, curr) => acc + curr.avg_delay_hours, 0) / (data.length || 1))}h`}
          subValue="Cross-carrier average"
          icon={<TrendingUp className="w-6 h-6" />}
          trend="neutral"
        />
        <StatCard
          title="Delayed Shipments"
          value="12%"
          subValue="Across all active routes"
          icon={<AlertTriangle className="w-6 h-6" />}
          trend="warning"
        />
      </div>

      {/* Carrier Table */}
      <div className="bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-black uppercase tracking-tight text-white flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-500" />
            Performance Rankings
          </h2>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Live Data Enabled</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/[0.02]">
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Carrier Name</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Reliability Score</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Avg. Delay</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Total Volume</th>
                <th className="px-8 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[15px]">
              {data.map((c, idx) => (
                <tr key={c.carrier} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-propulsion-orange font-black group-hover:scale-110 transition-transform">
                        {idx + 1}
                      </div>
                      <span className="font-bold text-white uppercase">{c.carrier}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 max-w-[100px] h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${c.reliability_score}%` }}
                          className={`h-full ${c.reliability_score > 90 ? 'bg-emerald-500' : c.reliability_score > 70 ? 'bg-propulsion-orange' : 'bg-red-500'}`}
                        />
                      </div>
                      <span className="font-black text-white">{c.reliability_score}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`font-bold ${c.avg_delay_hours === 0 ? 'text-emerald-500' : 'text-gray-400'}`}>
                      {c.avg_delay_hours}h
                    </span>
                  </td>
                  <td className="px-8 py-6 font-medium text-gray-400">{c.total_volume} Shipments</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${c.reliability_score > 80 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-propulsion-orange/10 text-propulsion-orange'
                      }`}>
                      {c.reliability_score > 80 ? 'Optimal' : 'Needs Review'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, icon, trend }: { title: string, value: string, subValue: string, icon: any, trend: 'primary' | 'neutral' | 'warning' }) {
  return (
    <div className="p-8 bg-[#0A0A0A] border border-white/10 rounded-[2.2rem] space-y-6 hover:border-white/20 transition-all group">
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl ${trend === 'primary' ? 'bg-propulsion-orange/10 text-propulsion-orange' :
            trend === 'neutral' ? 'bg-blue-500/10 text-blue-500' : 'bg-red-500/10 text-red-500'
          }`}>
          {icon}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-500/5 px-3 py-1 rounded-full">
          <ArrowUpRight className="w-3 h-3" />
          Live
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
        <h3 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-propulsion-orange transition-colors">{value}</h3>
        <p className="text-xs text-gray-500 font-medium mt-1">{subValue}</p>
      </div>
    </div>
  );
}
