
import React, { useState } from 'react';
import { Heart, Activity, Brain, ShieldAlert, Zap, Thermometer, Wind, Droplets } from 'lucide-react';

const BodyMap: React.FC = () => {
  const [activePart, setActivePart] = useState<string | null>(null);

  const parts = [
    { id: 'brain', label: 'Neurological', icon: Brain, top: '8%', left: '50%', color: 'text-indigo-400' },
    { id: 'lungs', label: 'Respiratory', icon: Wind, top: '25%', left: '42%', color: 'text-blue-400' },
    { id: 'heart', label: 'Cardiovascular', icon: Heart, top: '28%', left: '56%', color: 'text-red-400' },
    { id: 'digestive', label: 'Gastrointestinal', icon: Droplets, top: '45%', left: '50%', color: 'text-lime-400' },
    { id: 'joints', label: 'Skeletal-Structural', icon: ShieldAlert, top: '70%', left: '40%', color: 'text-amber-400' },
    { id: 'blood', label: 'Hematological', icon: Activity, top: '60%', left: '60%', color: 'text-indigo-500' },
  ];

  return (
    <div className="relative w-full aspect-[3/4] max-w-[450px] mx-auto bg-white/[0.02] rounded-[2.5rem] border border-white/10 overflow-hidden group">
      {/* High-Fidelity Silhouette */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none p-10" viewBox="0 0 100 200" fill="none">
        <path d="M50 5C56 5 62 10 62 25C62 40 56 45 50 45C44 45 38 40 38 25C38 10 44 5 50 5Z" stroke="white" strokeWidth="0.5"/>
        <path d="M38 45C30 45 25 55 20 85C18 95 15 105 15 115M62 45C70 45 75 55 80 85C82 95 85 105 85 115" stroke="white" strokeWidth="0.5" strokeDasharray="2 2"/>
        <path d="M40 45L35 70L30 110L32 195H48V130H52V195H68L70 110L65 70L60 45H40Z" fill="white" fillOpacity="0.1"/>
        <path d="M40 45H60L65 70L70 110M40 45L35 70L30 110" stroke="white" strokeWidth="0.8"/>
      </svg>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

      {/* Diagnostic nodes */}
      {parts.map((part) => (
        <button
          key={part.id}
          onMouseEnter={() => setActivePart(part.id)}
          onMouseLeave={() => setActivePart(null)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-125 focus:outline-none z-20"
          style={{ top: part.top, left: part.left }}
        >
          <div className={`p-2.5 rounded-full glass border-white/20 backdrop-blur-md shadow-2xl ${activePart === part.id ? 'indigo-glow bg-indigo-500/20 scale-110' : 'bg-white/5'}`}>
            <part.icon className={`w-3.5 h-3.5 md:w-4 md:h-4 ${part.color} ${activePart === part.id ? 'animate-pulse' : ''}`} />
          </div>
          {activePart === part.id && (
            <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap glass px-3 py-1.5 rounded-lg text-[9px] uppercase font-bold tracking-[0.2em] z-30 animate-in fade-in slide-in-from-top-2 border-indigo-500/30">
              {part.label}: <span className="text-white">Active Scan</span>
            </div>
          )}
        </button>
      ))}

      {/* Data Summary Overlay */}
      <div className="absolute bottom-6 left-6 right-6 p-5 glass rounded-2xl border-white/10 bg-black/40">
        <div className="flex justify-between items-center mb-3">
          <h4 className="text-[9px] uppercase font-bold text-neutral-500 tracking-[0.2em]">Bio-Sync: Online</h4>
          <div className="flex gap-1">
            <div className="w-1 h-1 rounded-full bg-lime-500 animate-pulse" />
            <div className="w-1 h-1 rounded-full bg-lime-500 animate-pulse delay-75" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-white uppercase">Cardiovascular</div>
              <div className="text-[10px] text-neutral-500 font-mono">62 BPM / 118/74 mmHg</div>
            </div>
            <div className="h-5 w-16 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full w-[88%] bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div className="space-y-0.5">
              <div className="text-[10px] font-bold text-white uppercase">Metabolic Tier</div>
              <div className="text-[10px] text-neutral-500 font-mono">Gluc: 92 mg/dL</div>
            </div>
            <div className="h-5 w-16 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className="h-full w-[72%] bg-lime-500 shadow-[0_0_8px_rgba(163,230,53,0.5)]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMap;
