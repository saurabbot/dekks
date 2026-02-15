"use client";

import React, { useState } from 'react';
import { Plus, Package, RefreshCw, ChevronDown } from 'lucide-react';
import api from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const SHIPPING_LINES = [
  "MAERSK", "HAPAG_LLOYD", "HMM", "ONE", "EVERGREEN",
  "MSC", "CMA_CGM", "COSCO", "ZIM", "YANG_MING"
];

const MIDDLE_EAST_PORTS = [
  "JEBEL ALI, UAE",
  "ABU DHABI, UAE",
  "KHALIFA, UAE",
  "DAMMAM, SAUDI ARABIA",
  "JEDDAH, SAUDI ARABIA",
  "HAMAD, QATAR",
  "SHUWAIKH, KUWAIT",
  "KHALIFA BIN SALMAN, BAHRAIN",
  "SALALAH, OMAN",
  "SOHAR, OMAN",
  "AQABA, JORDAN",
  "UMM QASR, IRAQ",
  "PORT SAID, EGYPT",
  "ALEXANDRIA, EGYPT"
];

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateShipmentModal = ({ isOpen, onClose, onSuccess }: CreateShipmentModalProps) => {
  const [containerId, setContainerId] = useState('');
  const [shippingLine, setShippingLine] = useState(SHIPPING_LINES[0]);
  const [finalDestination, setFinalDestination] = useState('');
  const [finalDestinationPort, setFinalDestinationPort] = useState(MIDDLE_EAST_PORTS[0]);
  const [estimatedEta, setEstimatedEta] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/shipments/', {
        container_id: containerId.trim().toUpperCase(),
        shipping_line: shippingLine,
        final_destination: finalDestination.trim(),
        final_destination_port: finalDestinationPort,
        final_destination_eta: estimatedEta || null
      });
      setContainerId('');
      setFinalDestination('');
      setFinalDestinationPort(MIDDLE_EAST_PORTS[0]);
      setEstimatedEta('');
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none overflow-visible">
        <div className="bg-[#050505] rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          {/* Close Button Trigger for accessibility, but we have onOpenChange */}
          <DialogTitle className="sr-only">New Shipment Registration</DialogTitle>
          <DialogDescription className="sr-only">Register your container ID to begin real-time fleet monitoring.</DialogDescription>

          <div className="p-8 pb-4">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-[#FF8A00] rounded-2xl flex items-center justify-center text-black shadow-[0_0_40px_rgba(255,138,0,0.3)] shrink-0">
                <Plus className="w-7 h-7 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">New Shipment</h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Fleet Expansion Unit</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-2">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
                <span className="uppercase tracking-widest">{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Container Number</label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF8A00] transition-colors">
                    <Package className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="ENTER ID... (e.g. MEDU9091004)"
                    className="w-full pl-14 pr-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-[#FF8A00]/40 focus:bg-white/[0.05] transition-all font-black text-white placeholder:text-gray-700 uppercase tracking-wider text-sm shadow-inner"
                    value={containerId}
                    onChange={(e) => setContainerId(e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Shipping Carrier</label>
                <div className="relative">
                  <select
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-[#FF8A00]/40 focus:bg-white/[0.05] transition-all font-black text-white appearance-none cursor-pointer uppercase tracking-wider text-sm shadow-inner"
                    value={shippingLine}
                    onChange={(e) => setShippingLine(e.target.value)}
                  >
                    {SHIPPING_LINES.map(line => (
                      <option key={line} value={line} className="bg-[#0A0A0A] text-white py-4 capitalize font-bold">
                        {line.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Destination Port</label>
                <div className="relative">
                  <select
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-[#FF8A00]/40 focus:bg-white/[0.05] transition-all font-black text-white appearance-none cursor-pointer uppercase tracking-wider text-xs shadow-inner"
                    value={finalDestinationPort}
                    onChange={(e) => setFinalDestinationPort(e.target.value)}
                  >
                    {MIDDLE_EAST_PORTS.map(port => (
                      <option key={port} value={port} className="bg-[#0A0A0A] text-white py-4 font-bold">
                        {port}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Final Dest.</label>
                  <input
                    type="text"
                    placeholder="WAREHOUSE A"
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-[#FF8A00]/40 focus:bg-white/[0.05] transition-all font-black text-white placeholder:text-gray-700 uppercase tracking-wider text-xs shadow-inner"
                    value={finalDestination}
                    onChange={(e) => setFinalDestination(e.target.value)}
                  />
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">Estimated ETA</label>
                  <input
                    type="date"
                    className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-[#FF8A00]/40 focus:bg-white/[0.05] transition-all font-black text-white uppercase tracking-wider text-xs shadow-inner [color-scheme:dark]"
                    value={estimatedEta}
                    onChange={(e) => setEstimatedEta(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="w-full py-7 bg-[#FF8A00] hover:bg-[#FF9D29] text-black font-black rounded-2xl uppercase tracking-[0.2em] text-[12px] shadow-[0_0_40px_rgba(255,138,0,0.2)] hover:shadow-[0_0_50px_rgba(255,138,0,0.4)] transition-all ring-offset-black"
                size="lg"
              >
                {loading ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <div className="flex items-center gap-3">
                    <Plus className="w-5 h-5 stroke-[4]" />
                    <span>Register Shipment</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
