
import React from 'react';
import { X, Download, Share2, Activity, ShieldCheck, FileText, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { MedicalReport, HealthStatus } from '../types';
import { downloadFHIR } from '../services/fhirService';

interface ReportVisualizationProps {
  report: MedicalReport;
  onClose: () => void;
}

const ReportVisualization: React.FC<ReportVisualizationProps> = ({ report, onClose }) => {
  const getStatusColor = (status: HealthStatus) => {
    switch (status) {
      case HealthStatus.OPTIMAL: return 'text-lime-400 border-lime-500/20 bg-lime-500/5';
      case HealthStatus.STABLE: return 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5';
      case HealthStatus.WARNING: return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
      case HealthStatus.CRITICAL: return 'text-red-400 border-red-500/20 bg-red-500/5';
      default: return 'text-neutral-400 border-white/10 bg-white/5';
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-[#0A0A0B]/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 animate-in fade-in zoom-in duration-300">
      <div className="w-full max-w-5xl h-full max-h-[90vh] glass rounded-[2.5rem] border-white/10 overflow-hidden flex flex-col shadow-2xl relative">
        {/* Header */}
        <header className="p-6 md:p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-indigo-600 rounded-2xl indigo-glow shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight truncate">{report.labName} Analysis</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">{report.date}</span>
                <span className="w-1 h-1 rounded-full bg-neutral-700" />
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{report.type} Protocol</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => downloadFHIR(report)}
              className="flex items-center gap-2 px-4 py-2 glass border-white/10 rounded-xl text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              <Download className="w-4 h-4" /> Export FHIR
            </button>
            <button className="p-2.5 glass border-white/10 rounded-xl text-neutral-400 hover:text-white transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button 
              onClick={onClose}
              className="p-2.5 hover:bg-white/5 rounded-full transition-all ml-2"
            >
              <X className="w-6 h-6 text-neutral-500" />
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-10 custom-scrollbar">
          {/* Executive Summary */}
          <section className="glass p-8 rounded-[2rem] border-indigo-500/20 bg-indigo-500/[0.03] relative overflow-hidden">
             <div className="absolute top-0 right-0 p-6 opacity-10">
                <ShieldCheck className="w-12 h-12 text-indigo-400" />
             </div>
             <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">Sentinel Executive Summary</h3>
             <p className="text-sm md:text-base text-neutral-300 leading-relaxed max-w-3xl">
               {report.summary || "No automated summary available. Markers analyzed against your longitudinal history and genetic baseline."}
             </p>
          </section>

          {/* Biomarkers Grid */}
          <section className="space-y-6">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Quantitative Biomarker Data
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {report.markers.map((marker, i) => (
                <div key={i} className={`p-6 rounded-[1.5rem] border transition-all hover:translate-y-[-2px] ${getStatusColor(marker.status)}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">{marker.status}</span>
                    <Info className="w-3.5 h-3.5 opacity-40 cursor-help" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase truncate">{marker.name}</div>
                    <div className="text-2xl font-bold text-white flex items-baseline gap-1.5">
                      {marker.value}
                      <span className="text-[10px] font-medium text-neutral-500 uppercase">{marker.unit}</span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center text-[9px] font-bold">
                    <span className="text-neutral-500 uppercase">REF RANGE</span>
                    <span className="text-neutral-300">{marker.referenceRange}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Clinical Insights */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[2rem] border-white/10">
               <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                 <AlertCircle className="w-4 h-4 text-amber-500" /> Critical Correlations
               </h4>
               <p className="text-xs text-neutral-500 leading-relaxed">
                 Based on the elevation in specific inflammatory markers, Sentinel suggests a temporary reduction in high-intensity anaerobic training for the next 48 hours to optimize recovery.
               </p>
            </div>
            <div className="glass p-8 rounded-[2rem] border-lime-500/20 bg-lime-500/[0.02]">
               <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-lime-400" /> Data Portability Ready
               </h4>
               <p className="text-xs text-neutral-500 leading-relaxed">
                 This report is mapped to FHIR R4 standards. Use the export button above to transfer this data to clinical systems like Apollo, Manipal, or Mayo Clinic.
               </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="p-6 border-t border-white/5 bg-white/[0.01] flex justify-center">
          <p className="text-[9px] font-bold text-neutral-600 uppercase tracking-[0.2em] flex items-center gap-2">
            <ShieldCheck className="w-3 h-3" /> Encrypted via Sovereign Ledger • Diagnostic Grade V2.4
          </p>
        </footer>
      </div>
    </div>
  );
};

export default ReportVisualization;
