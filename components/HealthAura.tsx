
import React from 'react';
import { HealthStatus } from '../types';

interface HealthAuraProps {
  status: HealthStatus;
  score: number;
}

const HealthAura: React.FC<HealthAuraProps> = ({ status, score }) => {
  const colors = {
    [HealthStatus.OPTIMAL]: 'from-[#ADFA1D] to-[#4ADE80]',
    [HealthStatus.STABLE]: 'from-[#6366F1] to-[#8B5CF6]',
    [HealthStatus.WARNING]: 'from-[#F59E0B] to-[#D97706]',
    [HealthStatus.CRITICAL]: 'from-[#EF4444] to-[#B91C1C]',
  };

  const glowColors = {
    [HealthStatus.OPTIMAL]: 'shadow-[#ADFA1D]/20',
    [HealthStatus.STABLE]: 'shadow-[#6366F1]/20',
    [HealthStatus.WARNING]: 'shadow-[#F59E0B]/20',
    [HealthStatus.CRITICAL]: 'shadow-[#EF4444]/20',
  };

  return (
    <div className="relative flex items-center justify-center w-56 h-56 md:w-64 md:h-64 mx-auto group cursor-pointer">
      {/* Outer Pulse Rings */}
      <div className={`absolute inset-0 rounded-full border border-white/5 aura-animate opacity-20`} />
      <div className={`absolute inset-4 rounded-full border border-white/10 aura-animate opacity-40 delay-75`} />
      
      {/* Main Aura Ring */}
      <div className={`relative w-40 h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br ${colors[status]} p-[2px] ${glowColors[status]} shadow-2xl transition-all duration-700 group-hover:scale-105`}>
        <div className="w-full h-full rounded-full bg-[#0A0A0B] flex flex-col items-center justify-center relative overflow-hidden">
          {/* Internal Glow */}
          <div className={`absolute top-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none`} />
          
          <span className="text-[8px] md:text-xs font-bold text-neutral-500 tracking-widest uppercase mb-0.5 md:mb-1">Health Index</span>
          <span className="text-5xl md:text-6xl font-bold text-white tracking-tighter leading-none">{score}</span>
          <div className={`mt-1.5 md:mt-2 px-2.5 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold tracking-wider uppercase border border-white/10 bg-white/5`}>
            {status}
          </div>
        </div>
      </div>
      
      {/* Status Indicators */}
      <div className="absolute top-2 -right-2 md:-top-4 md:-right-4 glass px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-mono text-indigo-400">
        Active Sentinel
      </div>
    </div>
  );
};

export default HealthAura;
