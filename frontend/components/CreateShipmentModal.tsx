"use client";

import { useState } from 'react';
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

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateShipmentModal = ({ isOpen, onClose, onSuccess }: CreateShipmentModalProps) => {
  const [containerId, setContainerId] = useState('');
  const [shippingLine, setShippingLine] = useState(SHIPPING_LINES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/shipments/', {
        container_id: containerId,
        shipping_line: shippingLine
      });
      setContainerId('');
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
      <DialogContent className="max-w-md p-0 border-border/40 bg-muted/20 rounded-[2rem] overflow-hidden">
        <div className="bg-background rounded-[1.5rem] h-full flex flex-col border border-border/40 overflow-hidden m-3">
          <DialogHeader className="p-6 border-b border-border/40 bg-muted/10 flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#FF8A00] rounded-xl flex items-center justify-center text-black shadow-lg">
                <Plus className="w-5 h-5" />
              </div>
              <DialogTitle className="text-xl font-black text-foreground tracking-tighter uppercase">New Shipment</DialogTitle>
              <DialogDescription className="sr-only">
                Register a new container for tracking
              </DialogDescription>
            </div>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-bold flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="group">
                <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2.5 ml-1">Container Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Package className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="ENTER ID..."
                    className="w-full pl-12 pr-5 py-4 bg-muted/5 border border-border/40 rounded-xl outline-none focus:border-[#FF8A00]/50 focus:bg-background transition-all font-bold text-foreground placeholder:text-muted-foreground/30 uppercase tracking-wider shadow-sm text-sm"
                    value={containerId}
                    onChange={(e) => setContainerId(e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-2.5 ml-1">Shipping Carrier</label>
                <div className="relative">
                  <select
                    className="w-full px-5 py-4 bg-muted/5 border border-border/40 rounded-xl outline-none focus:border-[#FF8A00]/50 focus:bg-background transition-all font-bold text-foreground appearance-none cursor-pointer shadow-sm uppercase tracking-wider text-sm"
                    value={shippingLine}
                    onChange={(e) => setShippingLine(e.target.value)}
                  >
                    {SHIPPING_LINES.map(line => (
                      <option key={line} value={line} className="bg-background text-sm">{line.replace('_', ' ')}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={loading}
                variant="default"
                size="lg"
                className="w-full py-6 font-black rounded-xl uppercase tracking-widest text-[11px]"
              >
                {loading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    REGISTER SHIPMENT
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
