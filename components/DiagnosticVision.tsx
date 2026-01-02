
import React, { useState, useRef } from 'react';
import { Camera, Scan, Activity, AlertTriangle, ShieldCheck, Info, ChevronRight, Loader2, Image as ImageIcon, Sparkles, Send, X } from 'lucide-react';
import { analyzeDiagnosticImage } from '../services/geminiService';

const DiagnosticVision: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedImage(event.target?.result as string);
      setAnalysisResult(null);
    };
    reader.readAsDataURL(file);
  };

  const startAnalysis = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    const result = await analyzeDiagnosticImage(selectedImage, prompt || "Identify what is in this image and provide medical insights if applicable.");
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const clear = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setPrompt('');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Diagnostic Vision</h2>
          <p className="text-sm text-neutral-500 mt-1">High-fidelity image understanding via Gemini 3 Pro.</p>
        </div>
        {!selectedImage && (
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all indigo-glow flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Upload Diagnostic Photo
          </button>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageSelect} 
        className="hidden" 
        accept="image/*"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          {selectedImage ? (
            <div className="space-y-6 animate-in fade-in zoom-in duration-300">
              <div className="relative glass rounded-[2.5rem] border-white/10 overflow-hidden group">
                <img src={selectedImage} alt="Selected" className="w-full h-auto max-h-[500px] object-contain mx-auto" />
                <button 
                  onClick={clear}
                  className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-md transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {!analysisResult && !isAnalyzing && (
                <div className="glass p-8 rounded-[2rem] border-white/10 space-y-4">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest">Diagnostic Prompt</h3>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none focus:border-indigo-500/50 min-h-[100px] placeholder:text-neutral-600"
                    placeholder="Describe what you want me to analyze (e.g., 'Identify this medication', 'Analyze this skin rash', 'Transcribe this handwritten note')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                  <button 
                    onClick={startAnalysis}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold uppercase tracking-widest indigo-glow flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Engage Neural Analysis
                  </button>
                </div>
              )}

              {isAnalyzing && (
                <div className="glass p-12 rounded-[2rem] border-white/10 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-400 animate-pulse" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest">Analyzing Image Data</h3>
                    <p className="text-xs text-neutral-500 mt-2">Gemini 3 Pro is processing high-dimensional diagnostic features...</p>
                  </div>
                </div>
              )}

              {analysisResult && (
                <div className="glass p-8 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/[0.03] animate-in slide-in-from-bottom-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-indigo-600 rounded-2xl indigo-glow">
                      <ShieldCheck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight uppercase tracking-widest">Diagnostic Brief</h3>
                      <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-tighter">Powered by Sentinel Neural Engine v3</p>
                    </div>
                  </div>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-sm md:text-base text-neutral-300 leading-relaxed whitespace-pre-wrap">
                      {analysisResult}
                    </p>
                  </div>
                  <div className="mt-10 pt-6 border-t border-white/5 flex flex-wrap gap-4">
                     <button onClick={clear} className="px-6 py-2.5 glass border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                       New Analysis
                     </button>
                     <button className="px-6 py-2.5 bg-white text-black rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center gap-2">
                       Save to Vault
                     </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="glass p-20 rounded-[3rem] border-white/10 border-dashed hover:border-indigo-500/50 hover:bg-white/[0.02] transition-all cursor-pointer flex flex-col items-center text-center group"
            >
               <div className="w-24 h-24 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                 <ImageIcon className="w-12 h-12 text-indigo-400" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Diagnostic Imaging Protocol</h3>
               <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
                 Capture or upload photos of medications, skin concerns, or clinical documentation for deep neural interpretation.
               </p>
               <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> Enhanced with Gemini 3 Pro
               </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="glass p-8 rounded-[2.5rem] border-white/10 bg-white/[0.01]">
             <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Info className="w-4 h-4 text-indigo-400" /> Vision Capabilities
             </h4>
             <div className="space-y-4">
                {[
                  { label: "Pill Identification", desc: "Cross-references shape, color, and imprint with clinical databases." },
                  { label: "Dermatological Scan", desc: "Analyzes skin lesions and rashes for known patterns." },
                  { label: "Prescription Transcriber", desc: "Deciphers handwritten notes into structured health records." },
                  { label: "Ophthalmic Vision", desc: "Screening support for visible ocular conditions." }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl group hover:bg-white/10 transition-colors cursor-default">
                    <p className="text-xs font-bold text-white uppercase tracking-wider mb-1">{item.label}</p>
                    <p className="text-[10px] text-neutral-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-amber-500/20 bg-amber-500/[0.03]">
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-amber-600 rounded-xl">
                   <AlertTriangle className="w-4 h-4 text-white" />
                </div>
                <h4 className="text-xs font-bold text-white uppercase tracking-widest">Clinical Disclaimer</h4>
             </div>
             <p className="text-[10px] text-neutral-400 leading-relaxed">
               Sentinel Vision is a diagnostic assistance tool designed to augment, not replace, clinical judgment. 
               Neural interpretations may contain inaccuracies. Always verify critical insights with a human healthcare professional.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticVision;
