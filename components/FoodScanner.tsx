
import React, { useState, useRef, useMemo } from 'react';
import { Camera, Scan, Activity, AlertTriangle, ShieldCheck, Info, ChevronRight, Loader2, History, Utensils, Zap, Plus, X, Search, Barcode, ClipboardList, Scale, RefreshCcw, Save, AlertCircle } from 'lucide-react';
import { FoodScanResult } from '../types';
import { analyzeFoodLabel } from '../services/geminiService';

interface FoodScannerProps {
  userContext?: string;
}

const FoodScanner: React.FC<FoodScannerProps> = ({ userContext = "Hypertension, Gluten Sensitivity" }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeScan, setActiveScan] = useState<FoodScanResult | null>(null);
  const [scanHistory, setScanHistory] = useState<FoodScanResult[]>([]);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [isManualOverride, setIsManualOverride] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const result = await analyzeFoodLabel(base64, userContext);
      if (result) {
        setActiveScan(result);
        setScanHistory(prev => [result, ...prev]);
      }
      setIsScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const nutritionData = useMemo(() => {
    if (!activeScan) return null;
    return {
      calories: activeScan.nutrition.calories * servingMultiplier,
      protein: activeScan.nutrition.protein * servingMultiplier,
      carbs: activeScan.nutrition.carbs * servingMultiplier,
      sugar: activeScan.nutrition.sugar * servingMultiplier,
      fat: activeScan.nutrition.fat * servingMultiplier,
      sodium: activeScan.nutrition.sodium * servingMultiplier,
      fiber: activeScan.nutrition.fiber * servingMultiplier,
      cholesterol: activeScan.nutrition.cholesterol * servingMultiplier,
    };
  }, [activeScan, servingMultiplier]);

  const getTrafficLight = (valPer100g: number, type: 'sugar' | 'fat' | 'sodium' | 'sat_fat') => {
    // UK NHS Traffic Light Standards (approx per 100g)
    if (type === 'sugar') {
      if (valPer100g > 22.5) return 'bg-red-500/20 text-red-500 border-red-500/20';
      if (valPer100g > 5) return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
      return 'bg-lime-500/20 text-lime-500 border-lime-500/20';
    }
    if (type === 'fat') {
      if (valPer100g > 17.5) return 'bg-red-500/20 text-red-500 border-red-500/20';
      if (valPer100g > 3) return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
      return 'bg-lime-500/20 text-lime-500 border-lime-500/20';
    }
    if (type === 'sodium') {
      if (valPer100g > 0.6) return 'bg-red-500/20 text-red-500 border-red-500/20';
      if (valPer100g > 0.3) return 'bg-amber-500/20 text-amber-500 border-amber-500/20';
      return 'bg-lime-500/20 text-lime-500 border-lime-500/20';
    }
    return 'bg-white/5 text-neutral-400 border-white/5';
  };

  const getHealthGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-lime-500 bg-lime-500/10 border-lime-500/20';
      case 'B': return 'text-green-400 bg-green-500/10 border-green-500/20';
      case 'C': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'D': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'E': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-neutral-500';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Clinical Food Scanner</h2>
          <p className="text-sm text-neutral-500 mt-1">Dual-mode Barcode & OCR analysis for high-fidelity nutrition extraction.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center justify-center gap-3 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all indigo-glow disabled:opacity-50"
          >
            {isScanning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
            <span>{isScanning ? 'Decrypting Label...' : 'Scan Label'}</span>
          </button>
          <input type="file" ref={fileInputRef} onChange={handleScan} className="hidden" accept="image/*" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {activeScan ? (
            <div className="space-y-6">
              {/* Main Analysis Card */}
              <div className="glass p-8 rounded-[2.5rem] border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                   <ShieldCheck className="w-24 h-24 text-indigo-400" />
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center text-2xl font-black ${getHealthGradeColor(activeScan.healthGrade)}`}>
                      {activeScan.healthGrade}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white tracking-tight">{activeScan.productName}</h3>
                      <p className="text-sm font-bold text-indigo-400 uppercase tracking-widest">{activeScan.brand}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1">NOVA Level</div>
                      <div className={`text-xl font-bold ${activeScan.novaScore >= 3 ? 'text-red-500' : 'text-lime-500'}`}>{activeScan.novaScore}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Confidence</div>
                      <div className={`text-xl font-bold ${activeScan.confidenceScore < 0.8 ? 'text-amber-500' : 'text-white'}`}>
                        {(activeScan.confidenceScore * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Accuracy Warning */}
                {activeScan.confidenceScore < 0.8 && (
                  <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <p className="text-xs text-amber-200/80 font-medium italic">Scanning resolution is sub-optimal. Review critical data points manually.</p>
                  </div>
                )}

                {/* Nutrition Breakdown */}
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                     <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.3em] flex items-center gap-2">
                       <Scale className="w-3.5 h-3.5" /> Serving Adjustment
                     </h4>
                     <div className="flex items-center gap-4 glass p-1.5 rounded-xl border-white/5">
                        <button onClick={() => setServingMultiplier(m => Math.max(0.25, m - 0.25))} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-neutral-400 transition-colors">-</button>
                        <span className="text-xs font-bold text-white w-20 text-center">{servingMultiplier}x Serving</span>
                        <button onClick={() => setServingMultiplier(m => m + 0.25)} className="w-8 h-8 flex items-center justify-center hover:bg-white/5 rounded-lg text-neutral-400 transition-colors">+</button>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: 'Energy', val: nutritionData?.calories, unit: 'kcal' },
                      { label: 'Protein', val: nutritionData?.protein, unit: 'g' },
                      { label: 'Sugars', val: nutritionData?.sugar, unit: 'g', type: 'sugar' },
                      { label: 'Sodium', val: nutritionData?.sodium, unit: 'g', type: 'sodium' },
                      { label: 'Total Fat', val: nutritionData?.fat, unit: 'g', type: 'fat' },
                      { label: 'Carbs', val: nutritionData?.carbs, unit: 'g' },
                      { label: 'Fiber', val: nutritionData?.fiber, unit: 'g' },
                      { label: 'Cholest.', val: nutritionData?.cholesterol, unit: 'mg' }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 glass rounded-2xl border-white/5 bg-white/[0.01]">
                        <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-1">{item.label}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-white">
                            {item.val?.toFixed(1)} <span className="text-[9px] font-normal text-neutral-600 uppercase ml-0.5">{item.unit}</span>
                          </div>
                          {item.type && (
                            <div className={`w-2 h-2 rounded-full border ${getTrafficLight(item.val as number, item.type as any)} shadow-[0_0_8px_currentColor]`} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 glass rounded-3xl border-indigo-500/10 bg-indigo-500/[0.03]">
                      <h5 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Utensils className="w-3.5 h-3.5" /> Visual Equivalence
                      </h5>
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-indigo-600/10 rounded-2xl flex items-center justify-center text-indigo-400">
                           <Zap className="w-6 h-6" />
                         </div>
                         <p className="text-xs text-neutral-300 leading-relaxed">
                           This portion contains roughly <span className="text-indigo-400 font-bold">{(activeScan.nutrition.sugar * servingMultiplier / 4).toFixed(1)} teaspoons</span> of sugar. Equivalent to eating <span className="text-indigo-400 font-bold">2 full slices</span> of white bread in glucose load.
                         </p>
                      </div>
                    </div>
                    <div className="p-6 glass rounded-3xl border-lime-500/10 bg-lime-500/[0.03]">
                      <h5 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <RefreshCcw className="w-3.5 h-3.5" /> Healthy Switch
                      </h5>
                      <div className="flex items-center gap-5">
                         <div className="w-12 h-12 bg-lime-600/10 rounded-2xl flex items-center justify-center text-lime-400">
                           <Search className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-xs text-neutral-300 leading-relaxed italic">"Try <span className="text-lime-400 font-bold underline">Slurrp Farm Millet Cereal</span> for a 60% lower glycemic response."</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4 border-t border-white/5 pt-8">
                  <button className="flex-1 py-4 bg-white text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-all flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> Auto-Log to Diary
                  </button>
                  <button onClick={() => setIsManualOverride(true)} className="flex-1 py-4 glass border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                    Manual Override
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass p-20 rounded-[3rem] border-white/10 flex flex-col items-center text-center">
               <div className="w-24 h-24 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-8">
                 <Barcode className="w-12 h-12 text-indigo-400" />
               </div>
               <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Label Analysis Protocol</h3>
               <p className="text-sm text-neutral-500 max-w-sm leading-relaxed">
                 Capture "Nutrition Facts" or Barcodes. Sentinel AI will extract clinical data points and cross-reference with your genomic history.
               </p>
            </div>
          )}

          {/* Manual Override Dialog */}
          {isManualOverride && (
            <div className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
              <div className="w-full max-w-lg glass rounded-[2.5rem] border-white/10 overflow-hidden">
                <div className="p-8 border-b border-white/5 flex justify-between items-center">
                  <h4 className="text-lg font-bold text-white uppercase tracking-wider">Manual Correction</h4>
                  <button onClick={() => setIsManualOverride(false)} className="p-2 hover:bg-white/5 rounded-full"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Calories</label>
                      <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none" defaultValue={activeScan?.nutrition.calories} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Serving Size</label>
                      <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white outline-none" defaultValue={activeScan?.servingSize} />
                    </div>
                  </div>
                  <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest indigo-glow">Update Analysis</button>
                </div>
              </div>
            </div>
          )}

          {/* Historical Scans */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
              <History className="w-3.5 h-3.5" /> Previous Session Logs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {scanHistory.map(scan => (
                <div key={scan.id} onClick={() => setActiveScan(scan)} className="glass p-5 rounded-3xl border-white/10 hover:bg-white/[0.02] transition-all cursor-pointer group flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm ${getHealthGradeColor(scan.healthGrade)}`}>
                      {scan.healthGrade}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{scan.productName}</h4>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest">{new Date(scan.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-neutral-800 group-hover:text-white transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Intelligence */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass p-8 rounded-[2.5rem] border-white/10 bg-white/[0.01]">
              <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> Clinical Safety Guard
              </h4>
              <div className="space-y-6">
                 {activeScan?.alerts.length ? activeScan.alerts.map((alert, i) => (
                    <div key={i} className={`relative pl-6 border-l-2 ${alert.severity === 'HIGH' ? 'border-red-500' : 'border-amber-500'}`}>
                      <div className={`absolute top-0 left-[-5px] w-2 h-2 rounded-full ${alert.severity === 'HIGH' ? 'bg-red-500' : 'bg-amber-500'}`} />
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${alert.severity === 'HIGH' ? 'text-red-400' : 'text-amber-400'}`}>
                        {alert.type} Alert
                      </p>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{alert.message}</p>
                    </div>
                 )) : (
                   <div className="flex flex-col items-center text-center py-6 opacity-30">
                     <ShieldCheck className="w-10 h-10 text-neutral-500 mb-2" />
                     <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">No Active Scans</p>
                   </div>
                 )}
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border-white/10 bg-white/[0.01]">
              <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-indigo-400" /> Ingredient Intelligence
              </h4>
              <div className="flex flex-wrap gap-2">
                {activeScan?.ingredients.map((ing, i) => (
                  <span key={i} className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold text-neutral-400 uppercase tracking-wider">
                    {ing}
                  </span>
                )) || <p className="text-[9px] text-neutral-600">Awaiting analysis...</p>}
              </div>
           </div>

           <div className="glass p-8 rounded-[2.5rem] border-indigo-500/20 bg-indigo-500/5">
              <div className="flex items-center gap-3 mb-4">
                 <div className="p-2 bg-indigo-600 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-white" />
                 </div>
                 <h4 className="text-xs font-bold text-white uppercase tracking-widest">Additive Protocol</h4>
              </div>
              <p className="text-[10px] text-neutral-400 leading-relaxed mb-6">
                Sentinel AI is screening for 250+ harmful additives (e.g. Sodium Nitrite, Trans Fats, Aspartame) flagged by WHO/NHS clinical guidelines.
              </p>
              <div className="flex items-center justify-between text-[10px] font-bold text-indigo-400 border-t border-white/5 pt-4">
                 <span>ACTIVE MONITORING</span>
                 <ShieldCheck className="w-3.5 h-3.5" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FoodScanner;
