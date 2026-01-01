
import React, { useState } from 'react';
import { Heart, Activity, Brain, ShieldAlert } from 'lucide-react';

const BodyMap: React.FC = () => {
  const [activePart, setActivePart] = useState<string | null>(null);

  const parts = [
    { id: 'brain', label: 'Cerebral', icon: Brain, top: '10%', left: '50%', color: 'text-indigo-400' },
    { id: 'heart', label: 'Cardiovascular', icon: Heart, top: '28%', left: '52%', color: 'text-red-400' },
    { id: 'liver', label: 'Metabolic', icon: Activity, top: '40%', left: '42%', color: 'text-lime-400' },
    { id: 'joints', label: 'Structural', icon: ShieldAlert, top: '75%', left: '50%', color: 'text-amber-400' },
  ];

  return (
    <div className="relative w-full aspect-[2/3] max-w-[400px] mx-auto bg-white/5 rounded-3xl border border-white/10 overflow-hidden group">
      {/* Stylized Body Outline (SVG) */}
      <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none p-12" viewBox="0 0 100 200" fill="none">
        <path d="M50 10C55 10 60 15 60 25C60 35 55 40 50 40C45 40 40 35 40 25C40 15 45 10 50 10ZM40 45H60L75 90L65 95L55 60V190H45V60L35 95L25 90L40 45Z" fill="white"/>
      </svg>

      {/* Interactive nodes */}
      {parts.map((part) => (
        <button
          key={part.id}
          onMouseEnter={() => setActivePart(part.id)}
          onMouseLeave={() => setActivePart(null)}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-125 focus:outline-none"
          style={{ top: part.top, left: part.left }}
        >
          <div className={`p-2 rounded-full glass border-white/20 ${activePart === part.id ? 'indigo-glow bg-white/10' : ''}`}>
            <part.icon className={`w-4 h-4 ${part.color}`} />
          </div>
          {activePart === part.id && (
            <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap glass px-2 py-1 rounded text-[10px] uppercase font-bold tracking-widest z-10 animate-in fade-in slide-in-from-top-1">
              {part.label}
            </div>
          )}
        </button>
      ))}

      {/* Data Summary Overlay */}
      <div className="absolute bottom-6 left-6 right-6 p-4 glass rounded-xl border-white/10">
        <h4 className="text-[10px] uppercase font-bold text-neutral-500 tracking-tighter mb-2">Systems Analysis</h4>
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <div className="text-xs font-medium text-white">Cardiovascular: Stable</div>
            <div className="text-[10px] text-neutral-400">Resting HR: 64 BPM</div>
          </div>
          <div className="h-6 w-16 bg-white/5 rounded overflow-hidden">
            <div className="h-full w-[80%] bg-indigo-500/50" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMap;
