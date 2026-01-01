
import React from 'react';
import { User, Activity, AlertTriangle, FileText, ChevronLeft, MapPin } from 'lucide-react';

interface ClinicalBriefProps {
  onClose: () => void;
}

const ClinicalBrief: React.FC<ClinicalBriefProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-[#0A0A0B] flex flex-col animate-in slide-in-from-right duration-300">
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
        <button onClick={onClose} className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm font-bold uppercase tracking-widest">Back to Sentinel</span>
        </button>
        <div className="flex items-center gap-2 text-lime-400">
          <MapPin className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Verified: Dr. Sharma's Clinic</span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8 space-y-12">
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-white/10 pb-4">
            <h2 className="text-4xl font-extrabold tracking-tighter text-white uppercase">Clinical Summary</h2>
            <div className="text-right">
              <p className="text-xs text-neutral-500 uppercase font-bold tracking-widest">Patient Name</p>
              <p className="text-xl font-bold">Khilesh Sammal, 27M</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-6 bg-red-500/10 border border-red-500/40 rounded-3xl">
                <div className="flex items-center gap-2 text-red-400 mb-2">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Critical Alerts</span>
                </div>
                <ul className="text-sm font-medium text-white space-y-1">
                  <li>• Severe Dust & Pollen Allergy</li>
                  <li>• Last Lipid Analysis: Borderline LDL</li>
                </ul>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-2">Chronic Vitals</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">120/80</div>
                    <div className="text-[8px] text-neutral-500 font-bold">BP (RESTING)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-400">62</div>
                    <div className="text-[8px] text-neutral-500 font-bold">HR (AVG)</div>
                  </div>
                </div>
             </div>
             <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mb-2">Medications</div>
                <ul className="text-sm font-medium text-neutral-300 space-y-1">
                  <li>• Vitamin D 60K (Weekly)</li>
                  <li>• Omega-3 Supplement</li>
                </ul>
             </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.3em] flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Long-Term Biomarker Trends
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
             {['Hemoglobin', 'Vitamin D', 'HbA1c'].map(marker => (
               <div key={marker} className="glass p-4 rounded-2xl border-white/10 flex justify-between items-center">
                  <div>
                    <div className="text-xs text-neutral-400">{marker}</div>
                    <div className="text-lg font-bold">Stable</div>
                  </div>
                  <div className="w-16 h-8 bg-indigo-500/10 rounded border border-indigo-500/20" />
               </div>
             ))}
          </div>
        </section>

        <section className="p-8 glass rounded-[2rem] border-white/10 bg-indigo-500/5">
           <h4 className="text-sm font-bold text-white mb-4">Historical Procedures</h4>
           <div className="flex gap-4">
              <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <div className="text-[10px] font-bold text-neutral-500 mb-1">MAR 2024</div>
                 <div className="text-sm font-bold">Comprehensive Wellness Check</div>
                 <div className="text-[10px] text-neutral-500">Apollo Hospitals, Bangalore</div>
              </div>
              <div className="flex-1 p-4 bg-white/5 border border-white/10 rounded-2xl">
                 <div className="text-[10px] font-bold text-neutral-500 mb-1">OCT 2023</div>
                 <div className="text-sm font-bold">Baseline Cardiology Screen</div>
                 <div className="text-[10px] text-neutral-500">Manipal Hospitals</div>
              </div>
           </div>
        </section>
      </div>

      <footer className="p-8 border-t border-white/10 bg-white/5 text-center">
        <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-[0.2em]">Encrypted Handover via ABHA Connect Protocol</p>
      </footer>
    </div>
  );
};

export default ClinicalBrief;
