
import React, { useState, useMemo } from 'react';
import { Shield, Heart, Umbrella, ChevronRight, Zap, AlertCircle, Plus, X, Calendar, Hash, Building2, Wallet, PackageOpen, TrendingUp, Info, BellRing, Gift, RefreshCw, Users, UserPlus, Trash2, Clock } from 'lucide-react';
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
      renewalDate: '2025-06-15', 
      premiumAmount: 12400,
      status: 'ACTIVE',
      nextPremiumDate: '2025-06-15',
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
      renewalDate: '2025-04-20', 
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

  const renewalAlerts = useMemo(() => {
    const today = new Date();
    return policies.map(policy => {
      const renewalDate = new Date(policy.renewalDate);
      const diffTime = renewalDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...policy, daysUntilRenewal: diffDays };
    }).filter(p => p.daysUntilRenewal <= 60 && p.daysUntilRenewal >= -30) 
    .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);
  }, [policies]);

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
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 relative pb-10">
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
                  <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">Renewal Date</label>
                  <input 
                    type="date"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white outline-none"
                    onChange={(e) => setNewPolicy({...newPolicy, renewalDate: e.target.value})}
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
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Insurance Concierge</h2>
          <p className="text-xs md:text-sm text-neutral-500 mt-1 uppercase tracking-widest">Sovereign protection for Khilesh Sammal.</p>
        </div>
        <div className="flex flex-wrap gap-2">
           <button 
            onClick={() => setIsAddingPolicy(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600/20 transition-all"
           >
             <RefreshCw className="w-3 h-3" /> Sync Policy
           </button>
           <div className="flex glass p-1 rounded-xl border-white/10">
            <button 
              onClick={() => setSelectedType('HEALTH')}
              className={`px-3 md:px-4 py-1.5 rounded-lg text-[9px] md:text-xs font-bold transition-all ${selectedType === 'HEALTH' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
            >
              Health
            </button>
            <button 
              onClick={() => setSelectedType('TERM_LIFE')}
              className={`px-3 md:px-4 py-1.5 rounded-lg text-[9px] md:text-xs font-bold transition-all ${selectedType === 'TERM_LIFE' ? 'bg-indigo-600 text-white shadow-lg' : 'text-neutral-500 hover:text-white'}`}
            >
              Term Life
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          {/* Renewal & Alerts */}
          <div className="space-y-4">
             <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
               <BellRing className="w-3 h-3 text-indigo-400" /> Sentinel Alerts
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {renewalAlerts.length > 0 ? (
                 renewalAlerts.map(alert => (
                   <div key={`alert-${alert.id}`} className={`glass p-4 md:p-5 rounded-3xl border-l-4 flex items-start gap-3 md:gap-4 transition-all hover:translate-x-1 ${
                     alert.daysUntilRenewal <= 15 ? 'border-red-500 bg-red-500/5' : 
                     alert.daysUntilRenewal <= 30 ? 'border-amber-500 bg-amber-500/5' : 'border-indigo-500 bg-indigo-500/5'
                   }`}>
                      <div className={`p-2 md:p-3 rounded-2xl shrink-0 ${
                        alert.daysUntilRenewal <= 15 ? 'bg-red-500/20 text-red-400' : 
                        alert.daysUntilRenewal <= 30 ? 'bg-amber-500/20 text-amber-400' : 'bg-indigo-500/20 text-indigo-400'
                      }`}>
                        <Clock className="w-4 h-4 md:w-5 md:h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-bold text-white truncate">{alert.provider} Renewal</h4>
                          {alert.daysUntilRenewal < 0 ? (
                            <span className="px-1 py-0.5 bg-red-600 text-white text-[7px] font-black rounded uppercase">LAPSED</span>
                          ) : null}
                        </div>
                        <p className="text-[10px] md:text-xs text-neutral-400 leading-relaxed">
                          {alert.daysUntilRenewal < 0 
                            ? `Policy expired ${Math.abs(alert.daysUntilRenewal)} days ago.` 
                            : `Expires in ${alert.daysUntilRenewal} days.`}
                        </p>
                        <button className={`mt-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all hover:gap-2 ${
                          alert.daysUntilRenewal <= 15 ? 'text-red-400' : 'text-indigo-400'
                        }`}>
                          Renew Now <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="col-span-2 glass p-6 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center opacity-40">
                   <Shield className="w-8 h-8 text-neutral-500 mb-2" />
                   <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">No Immediate Risks</p>
                 </div>
               )}
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] px-2">Synced Policies</h3>
            {activePolicies.map(policy => (
              <div key={policy.id} className="glass rounded-[2rem] md:rounded-[2.5rem] border-white/10 overflow-hidden relative group hover:border-white/20 transition-all">
                 <div className="p-5 md:p-8">
                   <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
                     <div className="flex items-center gap-3 md:gap-4">
                       <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400">
                          {policy.type === 'HEALTH' ? <Heart className="w-5 h-5 md:w-7 md:h-7" /> : <Umbrella className="w-5 h-5 md:w-7 md:h-7" />}
                       </div>
                       <div>
                          <div className="text-[8px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5 md:mb-1">Active Protection</div>
                          <h3 className="text-lg md:text-2xl font-bold text-white leading-tight">{policy.provider} Sentinel</h3>
                       </div>
                     </div>
                     <div className="sm:text-right">
                       <div className="text-[8px] md:text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Sum Insured</div>
                       <div className="text-xl md:text-3xl font-extrabold text-white">₹{(policy.sumInsured / 100000).toFixed(0)} L</div>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 py-4 md:py-6 border-y border-white/5">
                      <div>
                        <div className="text-[8px] md:text-[10px] font-bold text-neutral-500 uppercase mb-0.5">Policy No.</div>
                        <div className="text-[10px] md:text-sm font-mono font-bold text-neutral-300 truncate">{policy.policyNumber}</div>
                      </div>
                      <div>
                        <div className="text-[8px] md:text-[10px] font-bold text-neutral-500 uppercase mb-0.5">Renewal</div>
                        <div className="text-[10px] md:text-sm font-bold text-white">{policy.renewalDate}</div>
                      </div>
                      <div>
                        <div className="text-[8px] md:text-[10px] font-bold text-neutral-500 uppercase mb-0.5">Bonus</div>
                        <div className="text-[10px] md:text-sm font-bold text-lime-400">₹{(policy.coverageDetails?.noClaimBonus ? policy.coverageDetails.noClaimBonus / 100000 : 0).toFixed(1)} L</div>
                      </div>
                      <div>
                        <div className="text-[8px] md:text-[10px] font-bold text-neutral-500 uppercase mb-0.5">Status</div>
                        <div className="text-[10px] md:text-sm font-bold text-indigo-400 uppercase tracking-wider">{policy.status}</div>
                      </div>
                   </div>

                   {policy.nominees && policy.nominees.length > 0 && (
                     <div className="mb-6 md:mb-8 p-3 md:p-4 bg-white/5 rounded-2xl border border-white/10">
                        <div className="flex items-center gap-2 mb-2 md:mb-3">
                          <Users className="w-3.5 h-3.5 text-neutral-500" />
                          <span className="text-[8px] md:text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Nominees</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4">
                          {policy.nominees.map((nominee, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-white/5 pb-1 md:pb-2 last:border-0 last:pb-0">
                              <span className="text-xs font-medium text-white truncate max-w-[120px]">{nominee.name}</span>
                              <span className="text-[8px] md:text-[10px] font-bold text-neutral-600 uppercase shrink-0">{nominee.relationship}</span>
                            </div>
                          ))}
                        </div>
                     </div>
                   )}

                   <div className="flex flex-col sm:flex-row gap-2 md:gap-4">
                      <button className="w-full py-2.5 glass border-white/10 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600/10 transition-colors">
                        Network Hospitals
                      </button>
                      <button className="w-full py-2.5 glass border-white/10 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-600/10 transition-colors">
                        Policy Dashboard
                      </button>
                   </div>
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="glass p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-indigo-500/20 bg-indigo-500/5">
             <div className="flex items-center gap-3 mb-4 md:mb-6">
                <PackageOpen className="w-5 h-5 text-indigo-400" />
                <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest">Pre-Auth Shield</h4>
             </div>
             <p className="text-[10px] md:text-xs text-neutral-400 leading-relaxed mb-6">
               Sentinel AI can package your history for immediate cashless approval.
             </p>
             <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest indigo-glow">
                Generate Pre-Auth Vault
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceVault;
