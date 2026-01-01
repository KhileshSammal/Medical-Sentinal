
import React, { useState } from 'react';
import { Shield, Heart, Umbrella, ChevronRight, Zap, AlertCircle, Plus, X, Calendar, Hash, Building2, Wallet, PackageOpen, TrendingUp, Info, BellRing, Gift, RefreshCw, Users, UserPlus, Trash2 } from 'lucide-react';
import { InsurancePolicy, Nominee } from '../types';

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
      premiumAmount: 12400,
      status: 'ACTIVE',
      nextPremiumDate: '2025-08-15',
      benefitsUsed: {
        freeCheckup: false,
        opdUsed: 0
      },
      nominees: [{ name: 'Suman Sammal', relationship: 'Mother' }],
      coverageDetails: {
        cashless: true,
        noClaimBonus: 500000,
        roomRentLimit: 'Single Private A/C'
      }
    },
    {
      id: 'p2',
      provider: 'TATA AIA',
      type: 'TERM_LIFE',
      policyNumber: 'TAIA-TERM-551',
      sumInsured: 10000000,
      renewalDate: '2026-11-20',
      premiumAmount: 8500,
      status: 'ACTIVE',
      nextPremiumDate: '2025-05-10',
      benefitsUsed: {
        freeCheckup: true,
        opdUsed: 0
      },
      nominees: [
        { name: 'Suman Sammal', relationship: 'Mother' },
        { name: 'Rakesh Sammal', relationship: 'Brother' }
      ]
    }
  ]);

  const [nomineesInput, setNomineesInput] = useState<Nominee[]>([{ name: '', relationship: '' }]);
  const [newPolicy, setNewPolicy] = useState<Partial<InsurancePolicy>>({
    type: 'HEALTH',
    status: 'ACTIVE',
    provider: '',
    policyNumber: '',
    sumInsured: 0,
    renewalDate: '',
    premiumAmount: 0,
    nextPremiumDate: ''
  });

  const addNomineeField = () => {
    setNomineesInput([...nomineesInput, { name: '', relationship: '' }]);
  };

  const removeNomineeField = (index: number) => {
    setNomineesInput(nomineesInput.filter((_, i) => i !== index));
  };

  const updateNominee = (index: number, field: keyof Nominee, value: string) => {
    const updated = [...nomineesInput];
    updated[index][field] = value;
    setNomineesInput(updated);
  };

  const handleSyncPolicy = (e: React.FormEvent) => {
    e.preventDefault();
    const validNominees = nomineesInput.filter(n => n.name.trim() !== '');
    const policy: InsurancePolicy = {
      id: Math.random().toString(36).substr(2, 9),
      provider: newPolicy.provider || 'Generic Provider',
      type: newPolicy.type as any,
      policyNumber: newPolicy.policyNumber || '',
      sumInsured: Number(newPolicy.sumInsured) || 0,
      premiumAmount: Number(newPolicy.premiumAmount) || 0,
      renewalDate: newPolicy.renewalDate || '',
      nextPremiumDate: newPolicy.nextPremiumDate || '',
      status: 'ACTIVE',
      benefitsUsed: { freeCheckup: false, opdUsed: 0 },
      nominees: validNominees.length > 0 ? validNominees : undefined
    };
    setPolicies([...policies, policy]);
    setIsAddingPolicy(false);
    setNomineesInput([{ name: '', relationship: '' }]);
  };

  const activePolicies = policies.filter(p => p.type === selectedType);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 relative">
      {/* Sync Policy Modal */}
      {isAddingPolicy && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg glass rounded-3xl border-white/10 overflow-hidden shadow-2xl indigo-glow my-8">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white">Sync Policy Protocol</h3>
              <button onClick={() => setIsAddingPolicy(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-neutral-400" />
              </button>
            </div>
            <form onSubmit={handleSyncPolicy} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={newPolicy.type}
                    onChange={(e) => setNewPolicy({...newPolicy, type: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none focus:border-indigo-500/50"
                  >
                    <option value="HEALTH">Health</option>
                    <option value="TERM_LIFE">Term Life</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Provider</label>
                  <input 
                    type="text"
                    placeholder="e.g. Niva Bupa"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none"
                    onChange={(e) => setNewPolicy({...newPolicy, provider: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Policy Number</label>
                <input 
                  type="text"
                  placeholder="HE-123456"
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none"
                  onChange={(e) => setNewPolicy({...newPolicy, policyNumber: e.target.value})}
                />
              </div>
              
              {/* Nominee Section */}
              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest ml-1">Nominee Details</label>
                  <button 
                    type="button" 
                    onClick={addNomineeField}
                    className="text-[10px] font-bold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    <UserPlus className="w-3 h-3" /> Add Nominee
                  </button>
                </div>
                {nomineesInput.map((nominee, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 animate-in fade-in slide-in-from-top-1">
                    <div className="col-span-6">
                      <input 
                        type="text"
                        placeholder="Nominee Name"
                        value={nominee.name}
                        onChange={(e) => updateNominee(idx, 'name', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white outline-none"
                      />
                    </div>
                    <div className="col-span-4">
                      <input 
                        type="text"
                        placeholder="Relationship"
                        value={nominee.relationship}
                        onChange={(e) => updateNominee(idx, 'relationship', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-xs text-white outline-none"
                      />
                    </div>
                    <div className="col-span-2 flex justify-center items-center">
                      {nomineesInput.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeNomineeField(idx)}
                          className="p-1.5 text-neutral-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Sum Insured</label>
                  <input 
                    type="number"
                    placeholder="₹50,00,000"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none"
                    onChange={(e) => setNewPolicy({...newPolicy, sumInsured: Number(e.target.value)})}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Premium Date</label>
                  <input 
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none"
                    onChange={(e) => setNewPolicy({...newPolicy, nextPremiumDate: e.target.value})}
                  />
                </div>
              </div>
              <button className="w-full mt-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold tracking-widest uppercase transition-all shadow-lg indigo-glow">
                Sync with Sovereign Cloud
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Insurance Concierge</h2>
          <p className="text-sm text-neutral-500 mt-1">Sovereign protection for Khilesh Sammal.</p>
        </div>
        <div className="flex gap-4">
           <button 
            onClick={() => setIsAddingPolicy(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600/20 transition-all"
           >
             <RefreshCw className="w-3 h-3" /> Sync Policy
           </button>
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Quick Concierge Notifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="glass p-5 rounded-3xl border-amber-500/20 bg-amber-500/5 flex items-start gap-4">
                <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Premium Due</h4>
                  <p className="text-xs text-neutral-400">₹8,500 due in 12 days for TATA AIA Policy.</p>
                  <button className="mt-2 text-[10px] font-bold text-amber-500 uppercase tracking-widest underline">Quick Pay</button>
                </div>
             </div>
             <div className="glass p-5 rounded-3xl border-lime-500/20 bg-lime-500/5 flex items-start gap-4">
                <div className="p-3 bg-lime-500/20 rounded-2xl text-lime-500">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Annual Checkup</h4>
                  <p className="text-xs text-neutral-400">Complimentary 64-parameter checkup available.</p>
                  <button className="mt-2 text-[10px] font-bold text-lime-500 uppercase tracking-widest underline">Book Home Collection</button>
                </div>
             </div>
          </div>

          {activePolicies.map(policy => (
            <div key={policy.id} className="glass rounded-[2.5rem] border-white/10 overflow-hidden relative group hover:border-white/20 transition-all">
               <div className="p-8">
                 <div className="flex justify-between items-start mb-8">
                   <div className="flex items-center gap-4">
                     <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                        {policy.type === 'HEALTH' ? <Heart className="w-7 h-7" /> : <Umbrella className="w-7 h-7" />}
                     </div>
                     <div>
                        <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Active Protection</div>
                        <h3 className="text-2xl font-bold text-white">{policy.provider} Sentinel</h3>
                     </div>
                   </div>
                   <div className="text-right">
                     <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sum Insured</div>
                     <div className="text-3xl font-extrabold text-white">₹{(policy.sumInsured / 100000).toFixed(0)} L</div>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 py-6 border-y border-white/5">
                    <div>
                      <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Policy No.</div>
                      <div className="text-sm font-mono font-bold text-neutral-300">{policy.policyNumber}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Next Premium</div>
                      <div className="text-sm font-bold text-white">{policy.nextPremiumDate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1">NCB Bonus</div>
                      <div className="text-sm font-bold text-lime-400">₹5.5 L Accrued</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-neutral-500 uppercase mb-1">Status</div>
                      <div className="text-sm font-bold text-indigo-400 uppercase tracking-wider">{policy.status}</div>
                    </div>
                 </div>

                 {policy.nominees && policy.nominees.length > 0 && (
                   <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-4 h-4 text-neutral-500" />
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nominees</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {policy.nominees.map((nominee, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <span className="text-sm font-medium text-white">{nominee.name}</span>
                            <span className="text-[10px] font-bold text-neutral-600 uppercase">{nominee.relationship}</span>
                          </div>
                        ))}
                      </div>
                   </div>
                 )}

                 <div className="flex gap-4">
                    <button className="flex-1 py-3 glass border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600/10 transition-colors">
                      Network Hospitals
                    </button>
                    <button className="flex-1 py-3 glass border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600/10 transition-colors">
                      Policy Dashboard
                    </button>
                 </div>
               </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass p-8 rounded-[2rem] border-indigo-500/20 bg-indigo-500/5">
             <div className="flex items-center gap-3 mb-6">
                <PackageOpen className="w-5 h-5 text-indigo-400" />
                <h4 className="text-sm font-bold uppercase tracking-widest">Pre-Auth Shield</h4>
             </div>
             <p className="text-xs text-neutral-400 leading-relaxed mb-6">
               Going for a planned procedure? Sentinel AI can package your history for immediate cashless approval.
             </p>
             <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest indigo-glow">
                Generate Pre-Auth Vault
             </button>
          </div>

          <div className="glass p-8 rounded-[2rem] border-lime-500/20 bg-lime-500/5">
             <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-5 h-5 text-lime-400" />
                <h4 className="text-sm font-bold uppercase tracking-widest">Premium Optimization</h4>
             </div>
             <p className="text-xs text-neutral-400 leading-relaxed mb-4">
               "Khilesh, your health index is 92. You qualify for 'No Claim' discount optimization."
             </p>
             <div className="p-3 bg-black/20 rounded-xl border border-white/5 text-[10px] text-lime-400 font-bold flex justify-between">
                <span>RENEWAL SAVINGS</span>
                <span>₹3,800</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceVault;
