
import React, { useRef, useState, useMemo } from 'react';
import { FileText, Plus, Scan, ChevronRight, Loader2, Download, Filter, X, Calendar, Search as SearchIcon } from 'lucide-react';
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
  
  // Filter States
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

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white">The Vault</h2>
          <p className="text-sm text-neutral-500">Sovereign, encrypted medical repository.</p>
        </div>
        <div className="flex gap-2">
           <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 glass rounded-lg border-white/10 transition-all ${showFilters ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400' : 'hover:bg-white/10 text-neutral-400'}`}
            title="Toggle Filters"
          >
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all indigo-glow disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span className="hidden sm:inline">{isProcessing ? 'Shredding...' : 'Add Record'}</span>
            <span className="sm:hidden">{isProcessing ? '...' : 'Add'}</span>
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

      {/* Filter Panel */}
      {showFilters && (
        <div className="glass p-4 rounded-xl border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Lab Name</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <input 
                  type="text"
                  placeholder="Search labs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Report Type</label>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors appearance-none"
              >
                <option value="ALL">All Types</option>
                <option value="BLOOD">Blood Work</option>
                <option value="IMAGING">Imaging (MRI/CT)</option>
                <option value="PRESCRIPTION">Prescription</option>
                <option value="URINE">Urinalysis</option>
              </select>
            </div>

            {/* Date Range */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">From</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">To</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500 pointer-events-none" />
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-indigo-500/50 transition-colors"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-2 border-t border-white/5">
            <button 
              onClick={clearFilters}
              className="text-[10px] font-bold text-neutral-500 hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors"
            >
              <X className="w-3 h-3" />
              Reset Filters
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-3">
        {filteredReports.length === 0 ? (
          <div className="p-12 text-center glass rounded-2xl border-dashed border-white/10">
            <Scan className="w-12 h-12 text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-300">No matching records</h3>
            <p className="text-sm text-neutral-500 mt-1">Try adjusting your filters or shred a new report.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div key={report.id} className="group glass p-4 rounded-xl border-white/10 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-lg border border-white/10 text-indigo-400">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-neutral-200">{report.labName}</h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 font-mono uppercase tracking-widest mt-1">
                    <span>{report.date}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-700" />
                    <span className="text-indigo-500/80">{report.type}</span>
                    <span className="w-1 h-1 rounded-full bg-neutral-700" />
                    <span>{report.markers.length} biomarkers</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="hidden md:flex gap-1">
                  {report.markers.slice(0, 3).map((m, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/5 text-neutral-400">
                      {m.name}
                    </span>
                  ))}
                </div>
                <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 glass rounded-xl border-white/10 bg-indigo-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-full text-indigo-400">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">ABHA Cloud Sync</h4>
            <p className="text-xs text-neutral-400">Automatically fetching new records from Apollo & Manipal Hospitals.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vault;
