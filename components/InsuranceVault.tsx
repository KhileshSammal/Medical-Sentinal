
import React, { useState } from 'react';
import { Shield, Heart, Umbrella, ChevronRight, Zap, AlertCircle, FileCheck, CheckCircle2, Plus, X, Calendar, Hash, Building2, Wallet } from 'lucide-react';
import { InsurancePolicy } from '../types';

const InsuranceVault: React.FC = () => {
  const [selectedType, setSelectedType] = useState<'HEALTH' | 'TERM_LIFE'>('HEALTH');
  const [isAddingPolicy, setIsAddingPolicy] = useState(false);
  
  const [policies, setPolicies] = useState<InsurancePolicy[]>([
    {
      id: 'p1',
      provider: 'HDFC ERGO',
      type: 'HEALTH',
      policyNumber: 'HE-9022-8812-X',
      sumInsured: 5000000,
      renewalDate: '2026-08-15',
      status: 'ACTIVE',
      coverageDetails: {
        cashless: true,
        noClaimBonus: 500000,
        roomRentLimit: 'Single Private A/C'
      }
    },
    {
      id: 'p2',
      provider: 'MAX LIFE',
      type: 'TERM_LIFE',
      policyNumber: 'ML-TERM-2024-001',
      sumInsured: 20000000,
      renewalDate: '2026-12-01',
      status: 'ACTIVE',
      nominees: ['Priya Verma (Wife)', 'Rahul Verma (Son)']
    }
  ]);

  const [newPolicy, setNewPolicy] = useState<Partial<InsurancePolicy>>({
    type: 'HEALTH',
    status: 'ACTIVE',
    provider: '',
    policyNumber: '',
    sumInsured: 0,
    renewalDate: ''
  });

  const handleAddPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicy.provider || !newPolicy.policyNumber) return;

    const policy: InsurancePolicy = {
      id: Math.random().toString(36).substr(2, 9),
      provider: newPolicy.provider || '',
      type: newPolicy.type as any,
      policyNumber: newPolicy.policyNumber || '',
      sumInsured: Number(newPolicy.sumInsured) || 0,
      renewalDate: newPolicy.renewalDate || '',
      status: newPolicy.status as any,
      nominees: newPolicy.type === 'TERM_LIFE' ? ['Family Members'] : undefined,
      coverageDetails: newPolicy.type === 'HEALTH' ? {
        cashless: true,
        noClaimBonus: 0,
        roomRentLimit: 'TBD'
      } : undefined
    };

    setPolicies([...policies, policy]);
    setIsAddingPolicy(false);
    setNewPolicy({ type: 'HEALTH', status: 'ACTIVE', provider: '', policyNumber: '', sumInsured: 0, renewalDate: '' });
  };

  const activePolicies = policies.filter(p => p.type === selectedType);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Add Policy Modal */}
      {isAddingPolicy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass rounded-3xl border-white/10 overflow-hidden shadow-2xl indigo-glow">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Add New Protection</h3>
              <button onClick={() => setIsAddingPolicy(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <form onSubmit={handleAddPolicy} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Type</label>
                  <select 
                    value={newPolicy.type}
                    onChange={(e) => setNewPolicy({...newPolicy, type: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="HEALTH">Health Insurance</option>
                    <option value="TERM_LIFE">Term Life</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Status</label>
                  <select 
                    value={newPolicy.status}
                    onChange={(e) => setNewPolicy({...newPolicy, status: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending</option>
                    <option value="LAPSED">Lapsed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Provider Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Niva Bupa, ICICI Lombard"
                    value={newPolicy.provider}
                    onChange={(e) => setNewPolicy({...newPolicy, provider: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white outline-none focus:border-indigo-500/50 placeholder:text-neutral-700"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Policy Number</label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input 
                    type="text"
                    required
                    placeholder="XYZ-12345678"
                    value={newPolicy.policyNumber}
                    onChange={(e) => setNewPolicy({...newPolicy, policyNumber: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white outline-none focus:border-indigo-500/50 placeholder:text-neutral-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Sum Insured (₹)</label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input 
                      type="number"
                      required
                      placeholder="Amount"
                      value={newPolicy.sumInsured || ''}
                      onChange={(e) => setNewPolicy({...newPolicy, sumInsured: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Renewal Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    <input 
                      type="date"
                      required
                      value={newPolicy.renewalDate}
                      onChange={(e) => setNewPolicy({...newPolicy, renewalDate: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-3 text-sm text-white outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg indigo-glow"
              >
                Secure Policy
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Sovereign Protection</h2>
          <p className="text-sm text-neutral-500 mt-1">Unified Health and Life insurance portfolio.</p>
        </div>
        <div className="flex glass p-1 rounded-xl border-white/10">
          <button 
            onClick={() => setSelectedType('HEALTH')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedType === 'HEALTH' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
          >
            Health
          </button>
          <button 
            onClick={() => setSelectedType('TERM_LIFE')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedType === 'TERM_LIFE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
          >
            Term Life
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Policy Display */}
        <div className="lg:col-span-8 space-y-6">
          {activePolicies.length === 0 ? (
            <div className="p-12 text-center glass rounded-3xl border-dashed border-white/10 flex flex-col items-center">
              <Shield className="w-12 h-12 text-neutral-600 mb-4" />
              <h3 className="text-lg font-medium text-neutral-300">No active {selectedType === 'HEALTH' ? 'Health' : 'Term Life'} policies</h3>
              <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">Digitize your physical policy documents to track renewals and claim readiness.</p>
              <button 
                onClick={() => setIsAddingPolicy(true)}
                className="mt-6 flex items-center gap-2 px-6 py-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-lg text-xs font-bold tracking-widest uppercase hover:bg-indigo-600/20 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Policy
              </button>
            </div>
          ) : (
            activePolicies.map(policy => (
              <div key={policy.id} className="glass rounded-3xl border-white/10 overflow-hidden group hover:border-white/20 transition-all">
                <div className="p-8 border-b border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 text-indigo-400">
                        {policy.type === 'HEALTH' ? <Heart className="w-6 h-6" /> : <Umbrella className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className={`text-[10px] font-bold uppercase tracking-[0.2em] ${policy.status === 'ACTIVE' ? 'text-lime-400' : 'text-amber-400'}`}>
                          {policy.status} Policy
                        </div>
                        <h3 className="text-xl font-bold text-white mt-0.5">{policy.provider} Protection</h3>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sum Insured</div>
                      <div className="text-2xl font-bold text-white">
                        {policy.sumInsured >= 10000000 
                          ? `₹${(policy.sumInsured / 10000000).toFixed(1)} Cr` 
                          : `₹${(policy.sumInsured / 100000).toFixed(1)} L`}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-white/5">
                    <div>
                      <div className="text-[10px] font-bold text-neutral-600 uppercase mb-1">Policy No.</div>
                      <div className="text-sm font-mono text-neutral-300 truncate pr-2">{policy.policyNumber}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-600 uppercase mb-1">Renewal</div>
                      <div className="text-sm text-neutral-300">{policy.renewalDate}</div>
                    </div>
                    {policy.coverageDetails ? (
                      <>
                        <div>
                          <div className="text-[10px] font-bold text-neutral-600 uppercase mb-1">Cashless</div>
                          <div className={`text-sm font-bold ${policy.coverageDetails.cashless ? 'text-lime-400' : 'text-neutral-500'}`}>
                            {policy.coverageDetails.cashless ? 'Enabled' : 'Disabled'}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-neutral-600 uppercase mb-1">Room Limit</div>
                          <div className="text-sm text-neutral-300 truncate">{policy.coverageDetails.roomRentLimit}</div>
                        </div>
                      </>
                    ) : policy.nominees ? (
                      <div className="col-span-2">
                        <div className="text-[10px] font-bold text-neutral-600 uppercase mb-1">Nominees</div>
                        <div className="text-sm text-neutral-300 truncate">{policy.nominees.join(', ')}</div>
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 w-full sm:w-auto">
                       <button className="flex-1 sm:flex-none px-4 py-2 glass rounded-xl border-white/10 text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">
                          Policy PDF
                       </button>
                       <button className="flex-1 sm:flex-none px-4 py-2 glass rounded-xl border-white/10 text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 transition-colors">
                          Network
                       </button>
                    </div>
                    <button className="flex items-center gap-2 text-indigo-400 font-bold text-[10px] uppercase tracking-[0.2em] group-hover:translate-x-1 transition-transform">
                      Policy Analytics <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Claim Readiness Score */}
          <div className="glass p-8 rounded-3xl border-white/10 relative overflow-hidden bg-indigo-500/5">
             <div className="flex justify-between items-start">
               <div className="space-y-2">
                 <h4 className="text-lg font-bold flex items-center gap-2">
                   <Zap className="w-5 h-5 text-lime-400" />
                   Claim Readiness Score
                 </h4>
                 <p className="text-sm text-neutral-400 max-w-md">
                   Sentinel AI is analyzing your Medical Vault. You have sufficient documentation for a standard claim.
                 </p>
               </div>
               <div className="flex flex-col items-center">
                  <div className="text-4xl font-bold text-lime-400">92%</div>
                  <div className="text-[10px] font-bold text-neutral-600 uppercase">Optimal</div>
               </div>
             </div>
             
             <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-lime-500" />
                  KYC & ABHA ID Verified
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-300">
                  <CheckCircle2 className="w-4 h-4 text-lime-500" />
                  Historical Lab Reports Synced (3 Years)
                </div>
                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  Missing: Recent BMI verification for Term Life renewal
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar Insights */}
        <div className="lg:col-span-4 space-y-6">
           <div className="glass p-6 rounded-3xl border-white/10 bg-white/[0.01]">
              <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6">Coverage Radar</h4>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-neutral-400">OPD Coverage</span>
                    <span className="text-white">₹15,000 / Year</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[40%] bg-indigo-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-neutral-400">Mental Wellness</span>
                    <span className="text-white">₹25,000 / Year</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[10%] bg-indigo-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-neutral-400">Life Coverage</span>
                    <span className="text-white">₹2.0 Cr</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[80%] bg-lime-500" />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsAddingPolicy(true)}
                className="w-full mt-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" /> Add New Policy
              </button>
           </div>

           <div className="glass p-6 rounded-3xl border-amber-500/20 bg-amber-500/5">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-500 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white">Sentinel Insight</h4>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Based on your recent medical trends (Vitamin D deficiency, Rising Creatinine), 
                    Sentinel suggests upgrading your critical illness rider before the next renewal window.
                  </p>
                  <button className="mt-4 text-[10px] font-bold text-amber-500 uppercase tracking-widest underline hover:text-amber-400">
                    Compare Rider Options
                  </button>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceVault;
