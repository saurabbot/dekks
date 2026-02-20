"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Package,
  RefreshCw,
  ChevronDown,
  UploadCloud,
  FileSpreadsheet,
} from "lucide-react";
import api from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

const SHIPPING_LINES = [
  "MAERSK",
  "HAPAG_LLOYD",
  "HMM",
  "ONE",
  "EVERGREEN",
  "MSC",
  "CMA_CGM",
  "COSCO",
  "ZIM",
  "YANG_MING",
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
  "ALEXANDRIA, EGYPT",
];

interface CreateShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateShipmentModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateShipmentModalProps) => {
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [containerId, setContainerId] = useState("");
  const [shippingLine, setShippingLine] = useState(SHIPPING_LINES[0]);
  const [finalDestination, setFinalDestination] = useState("");
  const [finalDestinationPort, setFinalDestinationPort] = useState(
    MIDDLE_EAST_PORTS[0],
  );
  const [estimatedEta, setEstimatedEta] = useState("");

  // Bulk upload state
  const [bulkShipments, setBulkShipments] = useState<any[]>([]);
  const [parsedCount, setParsedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const submitSingle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/shipments/", {
        container_id: containerId.trim().toUpperCase(),
        shipping_line: shippingLine,
        final_destination: finalDestination.trim(),
        final_destination_port: finalDestinationPort,
        final_destination_eta: estimatedEta || null,
      });
      setContainerId("");
      setFinalDestination("");
      setFinalDestinationPort(MIDDLE_EAST_PORTS[0]);
      setEstimatedEta("");
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const wsname = workbook.SheetNames[0];
        const ws = workbook.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        const mappedData = data
          .map((row: any) => {
            // Flexible matching for tracking tracking -> shipping line matching
            return {
              container_id: String(row["CONTAINER"] || row["Container"] || "")
                .trim()
                .toUpperCase(),
              shipping_line: String(row["TRACKING"] || row["Tracking"] || "")
                .trim()
                .toUpperCase(),
              item_code: String(row["ITEM CODE"] || row["Item Code"] || ""),
              item_name: String(row["ITEM NAME"] || row["Item Name"] || ""),
              coo: String(row["COO"] || ""),
              brand: String(row["BRAND"] || row["Brand"] || ""),
              buyer_name: String(row["BUYER NAME"] || row["Buyer Name"] || ""),
              ref_no: String(
                row["REF NO:"] || row["Ref No"] || row["REF NO"] || "",
              ),
              doc_status: String(
                row["DOC. STATUS"] ||
                  row["Doc. Status"] ||
                  row["DOC STATUS"] ||
                  "",
              ),
              order_date: String(row["DATE"] || row["Date"] || ""),
              estimated_eta: String(row["ETA"] || row["Eta"] || ""),
            };
          })
          .filter((item) => item.container_id);

        setBulkShipments(mappedData);
        setParsedCount(mappedData.length);
        setError("");
      } catch (err) {
        setError(
          "Error parsing the file. Please ensure it's a valid Excel format.",
        );
        setBulkShipments([]);
        setParsedCount(0);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = ""; // reset
  };

  const submitBulk = async () => {
    if (bulkShipments.length === 0) return;
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const resp = await api.post("/shipments/bulk", bulkShipments);
      setSuccessMsg(resp.data.message);
      setTimeout(() => {
        setBulkShipments([]);
        setParsedCount(0);
        setSuccessMsg("");
        onSuccess();
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Bulk registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md p-0 border-none bg-transparent shadow-none overflow-visible">
        <div className="bg-[#050505] rounded-[2.5rem] border border-white/10 overflow-hidden relative shadow-[0_0_80px_rgba(0,0,0,0.9)] transition-all duration-300">
          <DialogTitle className="sr-only">
            New Shipment Registration
          </DialogTitle>
          <DialogDescription className="sr-only">
            Register your container ID to begin real-time fleet monitoring or
            bulk upload details.
          </DialogDescription>

          <div className="p-8 pb-4">
            <div className="flex items-center gap-5 mb-6">
              <div className="w-14 h-14 bg-[#FF8A00] rounded-2xl flex items-center justify-center text-black shadow-[0_0_40px_rgba(255,138,0,0.3)] shrink-0">
                <Plus className="w-7 h-7 stroke-[3]" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
                  New Shipment
                </h2>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Fleet Expansion Unit
                </p>
              </div>
            </div>

            <div className="flex gap-1 bg-white/5 p-1 rounded-2xl w-full">
              <button
                onClick={() => setActiveTab("single")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === "single" ? "bg-[#FF8A00] text-black shadow-[0_0_20px_rgba(255,138,0,0.2)]" : "text-gray-500 hover:text-white"}`}
              >
                Single Entry
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === "bulk" ? "bg-[#FF8A00] text-black shadow-[0_0_20px_rgba(255,138,0,0.2)]" : "text-gray-500 hover:text-white"}`}
              >
                Bulk Upload
              </button>
            </div>
          </div>

          <div className="px-8 py-2">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>

          {activeTab === "single" ? (
            <form
              onSubmit={submitSingle}
              className="p-8 space-y-6 animate-in slide-in-from-left-4 fade-in duration-300"
            >
              {error && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
                  <span className="uppercase tracking-widest">{error}</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    Container Number
                  </label>
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
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    Shipping Carrier
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-[#FF8A00]/40 focus:bg-white/[0.05] transition-all font-black text-white appearance-none cursor-pointer uppercase tracking-wider text-sm shadow-inner"
                      value={shippingLine}
                      onChange={(e) => setShippingLine(e.target.value)}
                    >
                      {SHIPPING_LINES.map((line) => (
                        <option
                          key={line}
                          value={line}
                          className="bg-[#0A0A0A] text-white py-4 capitalize font-bold"
                        >
                          {line.replace("_", " ")}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    Destination Port
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-[#FF8A00]/40 focus:bg-white/[0.05] transition-all font-black text-white appearance-none cursor-pointer uppercase tracking-wider text-xs shadow-inner"
                      value={finalDestinationPort}
                      onChange={(e) => setFinalDestinationPort(e.target.value)}
                    >
                      {MIDDLE_EAST_PORTS.map((port) => (
                        <option
                          key={port}
                          value={port}
                          className="bg-[#0A0A0A] text-white py-4 font-bold"
                        >
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
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                      Final Dest.
                    </label>
                    <input
                      type="text"
                      placeholder="WAREHOUSE A"
                      className="w-full px-6 py-4 bg-white/[0.03] border border-white/5 rounded-2xl outline-none focus:border-[#FF8A00]/40 focus:bg-white/[0.05] transition-all font-black text-white placeholder:text-gray-700 uppercase tracking-wider text-xs shadow-inner"
                      value={finalDestination}
                      onChange={(e) => setFinalDestination(e.target.value)}
                    />
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                      Estimated ETA
                    </label>
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
          ) : (
            <div className="p-8 space-y-6 animate-in slide-in-from-right-4 fade-in duration-300">
              {error && (
                <div className="p-4 bg-red-500/5 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
                  <span className="uppercase tracking-widest">{error}</span>
                </div>
              )}
              {successMsg && (
                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-2xl text-[10px] font-black flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]" />
                  <span className="uppercase tracking-widest">
                    {successMsg}
                  </span>
                </div>
              )}

              <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full h-48 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all ${parsedCount > 0 ? "border-[#FF8A00] bg-[#FF8A00]/5" : "border-white/10 hover:border-[#FF8A00]/50 hover:bg-white/[0.02]"}`}
              >
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />

                {parsedCount > 0 ? (
                  <>
                    <div className="w-16 h-16 bg-[#FF8A00]/20 rounded-2xl flex items-center justify-center mb-4 text-[#FF8A00]">
                      <FileSpreadsheet className="w-8 h-8" />
                    </div>
                    <p className="font-black text-white text-lg tracking-wider uppercase">
                      {parsedCount} Shipments Found
                    </p>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
                      Ready to sync
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 text-gray-400 group-hover:text-[#FF8A00] transition-colors">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <p className="font-black text-white tracking-wider uppercase mb-2">
                      Drop your Excel file here
                    </p>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.1em]">
                      Or click to browse (.XLSX, .CSV)
                    </p>
                  </>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="button"
                  onClick={submitBulk}
                  disabled={loading || parsedCount === 0}
                  className="w-full py-7 bg-white text-black hover:bg-gray-200 disabled:opacity-50 disabled:bg-white/10 disabled:text-gray-500 font-black rounded-2xl uppercase tracking-[0.2em] text-[12px] transition-all ring-offset-black"
                  size="lg"
                >
                  {loading ? (
                    <RefreshCw className="w-6 h-6 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-3">
                      <Plus className="w-5 h-5 stroke-[4]" />
                      <span>Sync Bulk Data</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
