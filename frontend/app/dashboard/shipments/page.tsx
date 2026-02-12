"use client";

import { useState, useEffect } from "react";
import { Package, Search, RefreshCw, Plus, Ship, MapPin, Clock, TrendingUp, LayoutGrid, List, Anchor } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import { ShipmentDetailsModal } from "@/components/ShipmentDetailsModal";
import { CreateShipmentModal } from "@/components/CreateShipmentModal";
import { Button } from "@/components/ui/button";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

type ViewMode = 'tiles' | 'grid';

export default function ShipmentsPage() {
  const [shipments, setShipments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('tiles');

  const fetchShipments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shipments/');
      setShipments(res.data);
    } catch (err) {
      console.error("Failed to fetch shipments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  const filteredShipments = shipments.filter(s =>
    s.container_id.toLowerCase().includes(search.toLowerCase()) ||
    s.shipping_line_name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDetails = (shipment: any) => {
    setSelectedShipment(shipment);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <motion.div
        initial="initial"
        animate="animate"
        className="flex flex-col gap-2"
      >
        <motion.div
          variants={fadeInUp}
          className="text-[10px] font-bold text-propulsion-orange uppercase tracking-[0.3em]"
        >
          Fleet Management
        </motion.div>

        <div className="flex items-end justify-between">
          <motion.h1
            variants={fadeInUp}
            className="text-4xl lg:text-5xl font-bold tracking-tighter"
          >
            Active Shipments
          </motion.h1>

          <motion.div
            variants={fadeInUp}
            className="hidden lg:flex items-center gap-4"
          >
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('tiles')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'tiles'
                  ? 'bg-propulsion-orange text-black'
                  : 'text-gray-500 hover:text-white'
                  }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all ${viewMode === 'grid'
                  ? 'bg-propulsion-orange text-black'
                  : 'text-gray-500 hover:text-white'
                  }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            <Button
              onClick={() => setIsCreateOpen(true)}
              className="h-12 px-6 bg-propulsion-orange text-black font-extrabold rounded-2xl hover:shadow-[0_0_30px_rgba(255,138,0,0.4)] transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Launch Vessel
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={fadeInUp} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-propulsion-orange/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-propulsion-orange/5 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-propulsion-orange/10 rounded-2xl flex items-center justify-center border border-propulsion-orange/20">
                <Ship className="w-6 h-6 text-propulsion-orange" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{shipments.length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Total Vessels</div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center border border-green-500/20">
                <MapPin className="w-6 h-6 text-green-500" />
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{shipments.filter(s => s.container_status === 'Active').length}</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">In Transit</div>
          </div>
        </motion.div>

        <motion.div variants={fadeInUp} className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/20 transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">98.2%</div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">On-Time Rate</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by Container ID or Shipping Line..."
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-gray-600 focus:border-propulsion-orange/50 focus:outline-none transition-all font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Shipments Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <RefreshCw className="w-10 h-10 animate-spin text-propulsion-orange mb-4" />
          <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Fleet Database...</span>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white/[0.02] border border-white/5 rounded-3xl">
          <Package className="w-16 h-16 text-gray-700 mb-4" />
          <span className="text-gray-500 font-bold uppercase tracking-widest text-xs">No Shipments Found</span>
        </div>
      ) : viewMode === 'tiles' ? (
        /* Tiles View - Compact */
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredShipments.map((shipment) => (
            <motion.div
              key={shipment.id}
              variants={fadeInUp}
              onClick={() => handleOpenDetails(shipment)}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-propulsion-orange/30 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-propulsion-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-propulsion-orange/10 rounded-2xl flex items-center justify-center border border-propulsion-orange/20 group-hover:bg-propulsion-orange/20 transition-all">
                    <Package className="w-6 h-6 text-propulsion-orange" />
                  </div>
                  <div className="px-2.5 py-1 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-bold text-green-500 uppercase tracking-wider">{shipment.container_status || 'Active'}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white tracking-tight mb-2 truncate">
                  {shipment.shipping_line_name?.replace('_', ' ') || 'Unknown Line'}
                </h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium text-xs">Container</span>
                    <code className="text-white font-mono font-bold text-xs">{shipment.container_id}</code>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 font-medium text-xs">Updated</span>
                    <span className="text-gray-400 font-medium text-xs">{new Date(shipment.updated_at).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Grid View - Detailed */
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 gap-4"
        >
          {filteredShipments.map((shipment) => (
            <motion.div
              key={shipment.id}
              variants={fadeInUp}
              onClick={() => handleOpenDetails(shipment)}
              className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 hover:border-propulsion-orange/30 transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-propulsion-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <div className="w-14 h-14 bg-propulsion-orange/10 rounded-2xl flex items-center justify-center border border-propulsion-orange/20 group-hover:bg-propulsion-orange/20 transition-all flex-shrink-0">
                    <Package className="w-7 h-7 text-propulsion-orange" />
                  </div>

                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-white tracking-tight">{shipment.shipping_line_name?.replace('_', ' ') || 'Unknown Line'}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 font-medium text-xs">Container:</span>
                        <code className="text-white font-mono font-bold text-xs tracking-wider">{shipment.container_id}</code>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Anchor className="w-4 h-4 text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Origin</span>
                      </div>
                      <span className="text-sm font-bold text-white">{shipment.shipped_from || 'Unknown'}</span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Destination</span>
                      </div>
                      <span className="text-sm font-bold text-white">{shipment.shipped_to || 'Unknown'}</span>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last Update</span>
                      </div>
                      <span className="text-sm font-bold text-white">{new Date(shipment.updated_at).toLocaleDateString('en-GB')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">{shipment.container_status || 'Active'}</span>
                  </div>

                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenDetails(shipment);
                    }}
                    className="h-10 px-6 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <ShipmentDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        shipment={selectedShipment}
        onUpdate={fetchShipments}
      />

      <CreateShipmentModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={fetchShipments}
      />
    </div>
  );
}
