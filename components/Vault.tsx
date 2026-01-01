
import React, { useRef, useState, useMemo } from 'react';
import { FileText, Plus, Scan, ChevronRight, Loader2, Download, Filter, X, Calendar, Search as SearchIcon, Image as ImageIcon, FileUp } from 'lucide-react';
import { MedicalReport } from '../types';
import { shredMedicalReport } from '../services/geminiService';

interface VaultProps {
  reports: MedicalReport[];
  onReportAdded: (report: MedicalReport) => void;
}

const Vault: React.FC<VaultProps> = ({ reports, onReportAdded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const report = await shredMedicalReport(base64);
      if (report) onReportAdded(report);
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch = report.labName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'ALL' || report.type === typeFilter;
      const reportDate = new Date(report.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      let matchesDate = true;
      if (start && reportDate < start) matchesDate = false;
      if (end && reportDate > end) matchesDate = false;
      return matchesSearch && matchesType && matchesDate;
    });
  }, [reports, searchQuery, typeFilter, startDate, endDate]);

  return (
    <div className="space-y-6 pb-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Medical Vault</h2>
          <p className="text-xs md:text-sm text-neutral-500">Sovereign, encrypted medical repository.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-1 md:flex-none p-2.5 glass rounded-xl border-white/10 transition-all flex items-center justify-center ${showFilters ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400' : 'hover:bg-white/10 text-neutral-400'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex-3 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all indigo-glow disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{isProcessing ? 'Analyzing...' : 'Digitize'}</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileSelect} 
            className="hidden" 
            accept="image/*,application/pdf"
          />
        </div>
      </div>

      {showFilters && (
        <div className="glass p-5 md:p-6 rounded-[1.5rem] md:rounded-3xl border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Lab / Hospital</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input 
                  type="text"
                  placeholder="Apollo, Dr. Lal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-500/50"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Category</label>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none appearance-none"
              >
                <option value="ALL">All Sources</option>
                <option value="BLOOD">Blood Work</option>
                <option value="IMAGING">MRI / CT / X-Ray</option>
                <option value="PRESCRIPTION">Handwritten Rx</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">From</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">To</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none" />
            </div>
          </div>
        </div>
      )}

      {/* Shredder Logic Area */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: FileUp, label: 'Upload PDF', sub: 'Lab Portal Reports', type: 'PDF' },
          { icon: ImageIcon, label: 'Images', sub: 'Physical Paper Photos', type: 'IMG' },
          { icon: Scan, label: 'Handwriting', sub: 'Prescription OCR', type: 'RX' }
        ].map((item, i) => (
          <div 
            key={i}
            onClick={() => fileInputRef.current?.click()} 
            className="group glass p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-white/10 border-dashed hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all cursor-pointer flex items-center md:flex-col gap-4 md:text-center"
          >
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:text-indigo-400 group-hover:scale-110 transition-all shrink-0">
              <item.icon className="w-5 h-5 md:w-8 md:h-8" />
            </div>
            <div className="text-left md:text-center">
              <h4 className="text-[10px] md:text-sm font-bold text-white uppercase tracking-widest">{item.label}</h4>
              <p className="text-[8px] md:text-[10px] text-neutral-500 mt-0.5">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="p-12 md:p-16 text-center glass rounded-[1.5rem] md:rounded-3xl border-dashed border-white/10">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-6 h-6 md:w-8 md:h-8 text-neutral-700" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-neutral-300">Vault Empty</h3>
            <p className="text-xs md:text-sm text-neutral-500 mt-2 max-w-xs mx-auto">Historical medical records are key to Sentinel's predictive engine.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="group glass p-4 md:p-6 rounded-[1.25rem] md:rounded-3xl border-white/10 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer active:scale-[0.98]">
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-[0.75rem] md:rounded-2xl border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
                  <FileText className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-white text-sm md:text-lg tracking-tight truncate">{report.labName}</h4>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[8px] md:text-[10px] text-neutral-500 font-bold uppercase tracking-[0.15em] mt-0.5 md:mt-1">
                    <span>{report.date}</span>
                    <span className="hidden xs:inline w-1 h-1 rounded-full bg-neutral-700" />
                    <span className="text-indigo-500/80">{report.type}</span>
                    <span className="hidden xs:inline w-1 h-1 rounded-full bg-neutral-700" />
                    <span className="hidden sm:inline">{report.markers.length} biomarkers</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-neutral-700 group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Vault;
