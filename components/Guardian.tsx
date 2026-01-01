
import React from 'react';
import { Activity, ShieldAlert, TrendingUp, Zap, Pill, Info, AlertTriangle, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const Guardian: React.FC = () => {
  const trendData = [
    { date: 'Jan', vitD: 24, hba1c: 5.4 },
    { date: 'Feb', vitD: 22, hba1c: 5.3 },
    { date: 'Mar', vitD: 18, hba1c: 5.5 },
    { date: 'Apr', vitD: 15, hba1c: 5.6 },
    { date: 'May', vitD: 28, hba1c: 5.2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Guardian Logic</h2>
          <p className="text-sm text-neutral-500 mt-1">Predictive intelligence & risk mitigation.</p>
        </div>
        <div className="flex gap-2">
           <div className="px-4 py-2 glass rounded-xl border-indigo-500/20 text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 animate-pulse" /> Pulse Engine: Active
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Trend Radar */}
        <div className="lg:col-span-8 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" /> Long-Term Trend Radar
              </h3>
              <div className="flex gap-4">
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-500" />
                   <span className="text-[10px] font-bold text-neutral-500 uppercase">Vitamin D</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-lime-500" />
                   <span className="text-[10px] font-bold text-neutral-500 uppercase">HbA1c</span>
                 </div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="colorVitD" x1="0" y1="0" x2="0" y2="1">
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
                  />
                  <YAxis hide domain={[0, 40]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1E', border: '1px solid #ffffff10', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="vitD" stroke="#6366F1" fillOpacity={1} fill="url(#colorVitD)" strokeWidth={3} />
                  <Area type="monotone" dataKey="hba1c" stroke="#ADFA1D" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-6 p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-start gap-4">
              <div className="p-2 bg-indigo-500/20 rounded-xl text-indigo-400">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-wider">Guardian Insight</p>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                  Your Vitamin D dropped 15% during Q1. Correlation detected with low sunlight exposure in Bengaluru East. 
                  <span className="text-indigo-400 ml-1">Protocol: Increase oral 60k IU frequency to 1x/week.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="glass p-8 rounded-[2rem] border-red-500/20 bg-red-500/[0.02]">
                <div className="flex justify-between items-center mb-6">
                   <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2">
                     <ShieldAlert className="w-4 h-4 text-red-500" /> Conflict Detector
                   </h4>
                   <div className="px-2 py-0.5 bg-red-500/10 text-red-500 text-[8px] font-bold rounded">LIVE SCAN</div>
                </div>
                <div className="space-y-4">
                   <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Pill className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs font-bold text-white">Metformin + B12</span>
                      </div>
                      <span className="text-[10px] font-bold text-lime-500 uppercase">SAFE</span>
                   </div>
                   <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <Pill className="w-4 h-4 text-neutral-400" />
                        <span className="text-xs font-bold text-white">Statins + Grapefruit</span>
                      </div>
                      <span className="text-[10px] font-bold text-red-500 uppercase">CONFLICT</span>
                   </div>
                </div>
                <p className="mt-4 text-[9px] text-neutral-600 leading-relaxed uppercase font-bold tracking-tighter">
                  Scanning current prescriptions against historical reaction logs.
                </p>
             </div>

             <div className="glass p-8 rounded-[2rem] border-indigo-500/20 bg-indigo-500/[0.02] flex flex-col justify-between">
                <div>
                   <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Sovereign Health Aura</h4>
                   <div className="flex items-end gap-2">
                      <div className="text-4xl font-bold text-white tracking-tighter">92.4%</div>
                      <div className="text-[10px] font-bold text-indigo-400 mb-2">+1.2%</div>
                   </div>
                   <p className="text-xs text-neutral-500 mt-2">Predicted stability for the next 30 days based on current metabolic trends.</p>
                </div>
                <button className="mt-6 w-full py-3 glass border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                   View Full Scorecard <ArrowRight className="w-3 h-3" />
                </button>
             </div>
          </div>
        </div>

        {/* Predictive Brief */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border-white/10 bg-white/[0.01]">
              <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-6">Immediate Adversaries</h4>
              <div className="space-y-6">
                 <div className="relative pl-6 border-l border-red-500/50">
                    <div className="absolute top-0 left-[-4.5px] w-2 h-2 rounded-full bg-red-500" />
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Priority 1: Uric Acid</p>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Trending toward upper threshold (6.8 mg/dL). Reduce high-purine intake for 14 days.</p>
                 </div>
                 <div className="relative pl-6 border-l border-amber-500/50">
                    <div className="absolute top-0 left-[-4.5px] w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Priority 2: Sleep Cycle</p>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Deep sleep consistently below 45 mins. Correlates with 8PM blue-light exposure.</p>
                 </div>
                 <div className="relative pl-6 border-l border-indigo-500/50 opacity-40">
                    <div className="absolute top-0 left-[-4.5px] w-2 h-2 rounded-full bg-indigo-500" />
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Priority 3: HbA1c</p>
                    <p className="text-xs text-neutral-400 mt-1 leading-relaxed">Stable at 5.2. Next scan recommended in 90 days.</p>
                 </div>
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-indigo-600 rounded-lg">
                    <Activity className="w-4 h-4 text-white" />
                 </div>
                 <h4 className="text-xs font-bold text-white uppercase tracking-widest">Bio-Feedback Loop</h4>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed mb-6">
                Sentinel AI is monitoring your active recovery. 
                Last night's HRV (62ms) suggests optimal recovery.
              </p>
              <div className="flex items-center justify-between text-[10px] font-bold text-indigo-400 border-t border-white/5 pt-4">
                 <span>READY FOR HI-INTENSITY</span>
                 <AlertTriangle className="w-3 h-3" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Guardian;
