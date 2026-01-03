
import React, { useRef, useState, useMemo } from 'react';
// Added Activity and Sparkles to imports
import { FileText, Plus, Scan, ChevronRight, Loader2, Download, Filter, X, Calendar, Search as SearchIcon, Image as ImageIcon, FileUp, Share2, TrendingUp, List, Activity, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MedicalReport, Biomarker } from '../types';
import { shredMedicalReport } from '../services/geminiService';
import ReportVisualization from './ReportVisualization';
import { downloadFHIR } from '../services/fhirService';

interface VaultProps {
  reports: MedicalReport[];
  onReportAdded: (report: MedicalReport) => void;
}

const Vault: React.FC<VaultProps> = ({ reports, onReportAdded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'analytics'>('list');
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  
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
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [reports, searchQuery, typeFilter, startDate, endDate]);

  // Data parsing for Trends
  const trendData = useMemo(() => {
    const allMarkers = reports.flatMap(r => r.markers.map(m => ({ ...m, date: r.date })));
    const uniqueMarkerNames = Array.from(new Set(allMarkers.map(m => m.name)));
    
    // Sort reports chronologically
    const sortedReports = [...reports].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    return sortedReports.map(report => {
      const dataPoint: any = { date: report.date };
      report.markers.forEach(m => {
        dataPoint[m.name] = m.value;
      });
      return dataPoint;
    });
  }, [reports]);

  const availableBiomarkers = useMemo(() => {
    const markerSet = new Set<string>();
    reports.forEach(r => r.markers.forEach(m => markerSet.add(m.name)));
    return Array.from(markerSet);
  }, [reports]);

  const [activeTrendMarker, setActiveTrendMarker] = useState<string>(availableBiomarkers[0] || '');

  return (
    <div className="space-y-6 pb-4 relative">
      {selectedReport && (
        <ReportVisualization 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Medical Vault</h2>
          <p className="text-xs md:text-sm text-neutral-500">Sovereign, encrypted medical repository.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex glass p-1 rounded-xl border-white/10 mr-2">
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-neutral-500 hover:text-white'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('analytics')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'analytics' ? 'bg-indigo-600 text-white' : 'text-neutral-500 hover:text-white'}`}
            >
              <TrendingUp className="w-4 h-4" />
            </button>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 glass rounded-xl border-white/10 transition-all ${showFilters ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-400' : 'hover:bg-white/10 text-neutral-400'}`}
          >
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all indigo-glow disabled:opacity-50"
          >
            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            <span>{isProcessing ? 'Analyzing...' : 'Digitize'}</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,application/pdf" />
        </div>
      </div>

      {showFilters && (
        <div className="glass p-5 md:p-6 rounded-[1.5rem] border-white/10 space-y-4 animate-in fade-in slide-in-from-top-2">
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
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none"
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

      {viewMode === 'analytics' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="glass p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden">
             <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                <div>
                   <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                     <TrendingUp className="w-5 h-5 text-indigo-400" /> Longitudinal Trend Radar
                   </h3>
                   <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest">Longitudinal analysis of {reports.length} clinical datasets</p>
                </div>
                <div className="flex flex-wrap gap-2">
                   {availableBiomarkers.slice(0, 5).map(marker => (
                     <button
                       key={marker}
                       onClick={() => setActiveTrendMarker(marker)}
                       className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                         activeTrendMarker === marker ? 'bg-indigo-600 text-white' : 'glass border-white/10 text-neutral-500 hover:text-white'
                       }`}
                     >
                       {marker}
                     </button>
                   ))}
                </div>
             </div>

             <div className="h-[350px] w-full">
                {reports.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                      <defs>
                        <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#666'}} 
                        tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#666'}}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid #ffffff10', borderRadius: '16px', backdropFilter: 'blur(12px)' }}
                        itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#6366F1' }}
                        labelStyle={{ color: '#666', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey={activeTrendMarker || (trendData[0] ? Object.keys(trendData[0])[1] : '')} 
                        stroke="#6366F1" 
                        fillOpacity={1} 
                        fill="url(#colorVal)" 
                        strokeWidth={3}
                        animationDuration={1500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-10 opacity-30">
                    <Activity className="w-12 h-12 mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">Insufficient Temporal Data</p>
                    <p className="text-xs mt-2 max-w-xs">Two or more clinical reports required to generate longitudinal trend lines.</p>
                  </div>
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass p-6 rounded-[2rem] border-white/10">
                <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Correlation Scan</h4>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Glucose stability</span>
                      <span className="text-xs font-mono text-lime-400">HIGH</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Inflammatory drift</span>
                      <span className="text-xs font-mono text-indigo-400">NEUTRAL</span>
                   </div>
                </div>
             </div>
             <div className="glass p-6 rounded-[2rem] border-indigo-500/20 bg-indigo-500/[0.02] flex items-center gap-4">
                <div className="p-4 bg-indigo-600 rounded-2xl indigo-glow">
                   <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white uppercase tracking-wider">Predictive Velocity</p>
                   <p className="text-[10px] text-neutral-500 mt-1 leading-relaxed">Based on current rates of change, biological markers are trending toward OPTIMAL targets for Q3.</p>
                </div>
             </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
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
              <div className="p-12 md:p-16 text-center glass rounded-[1.5rem] border-dashed border-white/10">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-6 h-6 md:w-8 md:h-8 text-neutral-700" />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-neutral-300">Vault Empty</h3>
                <p className="text-xs md:text-sm text-neutral-500 mt-2 max-w-xs mx-auto">Historical medical records are key to Sentinel's predictive engine.</p>
              </div>
            ) : (
              filteredReports.map((report) => (
                <div 
                  key={report.id} 
                  onClick={() => setSelectedReport(report)}
                  className="group glass p-4 md:p-6 rounded-[1.25rem] border-white/10 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4 md:gap-6 min-w-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-[0.75rem] border border-white/10 flex items-center justify-center text-indigo-400 shrink-0">
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
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFHIR(report);
                      }}
                      className="p-2 glass border-white/5 rounded-lg text-neutral-600 hover:text-indigo-400 hover:border-indigo-500/30 transition-all opacity-0 group-hover:opacity-100 hidden sm:block"
                      title="Export FHIR"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-neutral-700 group-hover:text-white transition-all transform group-hover:translate-x-1 shrink-0" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
