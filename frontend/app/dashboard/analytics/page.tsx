"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  Search, 
  Ship, 
  Anchor, 
  Activity, 
  RefreshCw,
  Globe,
  Navigation2
} from "lucide-react";
import api from "@/lib/api";

export default function AnalyticsPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Vessel Finder State
  const [vesselSearch, setVesselSearch] = useState("");
  const [vesselResults, setVesselSearchData] = useState<any[]>([]);
  const [vesselLoading, setVesselLoading] = useState(false);

  // Port Finder State
  const [portSearch, setPortSearch] = useState("");
  const [portResults, setPortSearchData] = useState<any[]>([]);
  const [portLoading, setPortLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/shipments/');
        setShipments(res.data);
      } catch (err) {
        console.error("Failed to fetch analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleVesselSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vesselSearch) return;
    setVesselLoading(true);
    try {
      const res = await api.get(`/shipments/datalastic/vessels/find?name=${vesselSearch}`);
      setVesselSearchData(res.data.data || []);
    } catch (err) {
      console.error("Vessel search failed");
    } finally {
      setVesselLoading(false);
    }
  };

  const handlePortSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!portSearch) return;
    setPortLoading(true);
    try {
      const res = await api.get(`/shipments/datalastic/ports/find?name=${portSearch}`);
      setPortSearchData(res.data.data || []);
    } catch (err) {
      console.error("Port search failed");
    } finally {
      setPortLoading(false);
    }
  };

  // Analytics helper functions
  const lineStats = shipments.reduce((acc: any, curr: any) => {
    const line = curr.shipping_line_name || 'UNKNOWN';
    acc[line] = (acc[line] || 0) + 1;
    return acc;
  }, {});

  const statusStats = shipments.reduce((acc: any, curr: any) => {
    const status = curr.container_status || 'Pending';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-2 font-medium">Deep insights and global logistics lookup tools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Shipping Line Distribution */}
        <div className="p-8 bg-white border-2 border-gray-900 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-50 border-2 border-gray-900 rounded-2xl text-blue-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Activity className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Line Distribution</h2>
          </div>
          
          <div className="space-y-6">
            {Object.entries(lineStats).length === 0 ? (
              <p className="text-gray-400 font-bold py-10 text-center">No data available</p>
            ) : (
              Object.entries(lineStats).map(([line, count]: [string, any]) => (
                <div key={line} className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-black text-gray-900 uppercase text-xs tracking-widest">{line.replace('_', ' ')}</span>
                    <span className="font-black text-propulsion-orange text-lg">{(count as number)}</span>
                  </div>
                  <div className="h-4 bg-gray-100 rounded-full border-2 border-gray-900 overflow-hidden shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <div 
                      className="h-full bg-propulsion-orange transition-all duration-1000" 
                      style={{ width: `${((count as number) / shipments.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Global Vessel Finder */}
        <div className="p-8 bg-white border-2 border-gray-900 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-propulsion-orange/10 border-2 border-gray-900 rounded-2xl text-propulsion-orange shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Ship className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Global Vessel Finder</h2>
          </div>

          <form onSubmit={handleVesselSearch} className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by vessel name..."
                className="w-full pl-12 pr-4 h-14 bg-gray-50 border-2 border-gray-900 rounded-2xl outline-none focus:bg-white transition-all font-bold text-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none"
                value={vesselSearch}
                onChange={(e) => setVesselSearch(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={vesselLoading}
              className="px-6 bg-gray-900 text-white rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-gray-800"
            >
              {vesselLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Navigation2 className="w-5 h-5" />}
            </button>
          </form>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {vesselResults.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold">
                Enter vessel name to begin lookup
              </div>
            ) : (
              vesselResults.map((vessel: any, idx: number) => (
                <div key={idx} className="p-4 bg-gray-50 border-2 border-gray-900 rounded-xl flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div>
                    <p className="font-black text-gray-900 uppercase tracking-tight">{vessel.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase mt-1">IMO: {vessel.imo} • Flag: {vessel.flag}</p>
                  </div>
                  <div className="px-3 py-1 bg-white border-2 border-gray-900 rounded-lg text-[10px] font-black uppercase">
                    {vessel.type}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Global Port Finder */}
        <div className="p-8 bg-white border-2 border-gray-900 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-green-50 border-2 border-gray-900 rounded-2xl text-green-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Anchor className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Global Port Finder</h2>
          </div>

          <form onSubmit={handlePortSearch} className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Search by port name or city..."
                className="w-full pl-12 pr-4 h-14 bg-gray-50 border-2 border-gray-900 rounded-2xl outline-none focus:bg-white transition-all font-bold text-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-none"
                value={portSearch}
                onChange={(e) => setPortSearch(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={portLoading}
              className="px-6 bg-gray-900 text-white rounded-2xl border-2 border-gray-900 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              {portLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Globe className="w-5 h-5" />}
            </button>
          </form>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {portResults.length === 0 ? (
              <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold">
                Enter port name or city to lookup
              </div>
            ) : (
              portResults.map((port: any, idx: number) => (
                <div key={idx} className="p-4 bg-gray-50 border-2 border-gray-900 rounded-xl flex justify-between items-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <div>
                    <p className="font-black text-gray-900 uppercase tracking-tight">{port.name}</p>
                    <p className="text-xs text-gray-500 font-bold uppercase mt-1">{port.city}, {port.country}</p>
                  </div>
                  <div className="px-3 py-1 bg-white border-2 border-gray-900 rounded-lg text-[10px] font-black uppercase">
                    {port.unlocode}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Status Breakdown (Chunky Bars) */}
        <div className="p-8 bg-white border-2 border-gray-900 rounded-[2.5rem] shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-purple-50 border-2 border-gray-900 rounded-2xl text-purple-600 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Status Breakdown</h2>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {Object.entries(statusStats).length === 0 ? (
              <p className="col-span-2 text-gray-400 font-bold py-10 text-center">No data available</p>
            ) : (
              Object.entries(statusStats).map(([status, count]: [string, any]) => (
                <div key={status} className="p-6 bg-gray-50 border-2 border-gray-900 rounded-3xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{status}</p>
                  <p className="text-4xl font-black text-gray-900">{count as number}</p>
                  <p className="text-[10px] font-bold text-gray-500 mt-2 uppercase tracking-tight">
                    {Math.round(((count as number) / shipments.length) * 100)}% of total
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
