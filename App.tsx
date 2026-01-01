
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Shield, Activity, Users, Settings, Bell, Zap, Menu, ShieldCheck, User, FileText, ChevronRight, X, HeartPulse } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CommandBar from './components/CommandBar';
import HealthAura from './components/HealthAura';
import BodyMap from './components/BodyMap';
import Vault from './components/Vault';
import InsuranceVault from './components/InsuranceVault';
import Profile from './components/Profile';
import ClinicalBrief from './components/ClinicalBrief';
import { MedicalReport, HealthStatus } from './types';
import { getGuardianBrief } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vault' | 'guardian' | 'family' | 'insurance' | 'profile'>('overview');
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [guardianBrief, setGuardianBrief] = useState<string>('Initializing Sentinel protocol...');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showClinicalBrief, setShowClinicalBrief] = useState(false);
  const [isHeartbeating, setIsHeartbeating] = useState(false);

  const mockTrends = [
    { date: '2023-Q1', val: 12.4 },
    { date: '2023-Q2', val: 11.8 },
    { date: '2023-Q3', val: 13.2 },
    { date: '2023-Q4', val: 14.5 },
    { date: '2024-Q1', val: 12.9 },
  ];

  useEffect(() => {
    if (reports.length > 0) {
      setIsHeartbeating(true);
      getGuardianBrief(reports).then((brief) => {
        setGuardianBrief(brief);
        setTimeout(() => setIsHeartbeating(false), 2000);
      });
    } else {
      setGuardianBrief("Upload reports to activate the Guardian protocol for Khilesh.");
    }
  }, [reports]);

  const handleAction = (id: string) => {
    const tabMap: Record<string, typeof activeTab> = {
      vault: 'vault',
      scan: 'vault',
      trends: 'overview',
      family: 'family',
      insurance: 'insurance',
      profile: 'profile'
    };
    if (tabMap[id]) setActiveTab(tabMap[id]);
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
        activeTab === id 
          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.2)]' 
          : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
      }`}
    >
      <Icon className={`w-4 h-4 ${activeTab === id ? 'text-indigo-400' : 'group-hover:text-neutral-200'}`} />
      <span>{label}</span>
    </button>
  );

  const BottomTab = ({ id, icon: Icon, label }: { id: typeof activeTab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all ${
        activeTab === id ? 'text-indigo-400' : 'text-neutral-500'
      }`}
    >
      <Icon className={`w-5 h-5 ${activeTab === id ? 'fill-indigo-400/10' : ''}`} />
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
      {activeTab === id && <div className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />}
    </button>
  );

  return (
    <div className={`flex h-screen overflow-hidden bg-[#0A0A0B] ${isHeartbeating ? 'animate-pulse' : ''}`}>
      <CommandBar onAction={handleAction} />
      {showClinicalBrief && <ClinicalBrief onClose={() => setShowClinicalBrief(false)} />}
      
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-[70] transition-transform duration-300 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 ${isSidebarOpen ? 'w-64' : 'w-20'} h-full glass border-r border-white/10 flex flex-col hidden md:flex`}>
        <div className="p-6 flex items-center justify-between mb-6">
          <button onClick={() => setActiveTab('overview')} className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center indigo-glow transition-transform group-hover:scale-110">
              <Shield className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && <span className="font-bold tracking-tight text-white text-lg">SENTINEL</span>}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <NavItem id="overview" icon={LayoutDashboard} label="Sovereign Pulse" />
          <NavItem id="vault" icon={Zap} label="Medical Vault" />
          <NavItem id="insurance" icon={ShieldCheck} label="Insurance" />
          <NavItem id="guardian" icon={Activity} label="Guardian Logic" />
          <NavItem id="family" icon={Users} label="Family Circles" />
          <NavItem id="profile" icon={User} label="Identity Profile" />
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-full glass p-3 rounded-xl border-white/10 flex items-center gap-3 mb-4 hover:bg-white/10 transition-colors text-left group"
          >
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border border-white/10 overflow-hidden shrink-0">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=KhileshSammal`} alt="Avatar" className="w-full h-full object-cover" />
             </div>
             {isSidebarOpen && (
               <div className="overflow-hidden">
                 <div className="text-[10px] font-bold text-white truncate uppercase tracking-wider">Khilesh Sammal</div>
                 <div className="text-[9px] text-neutral-500 truncate font-mono">ID: SENTINEL-2026</div>
               </div>
             )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-transparent relative pb-20 md:pb-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none" />
        
        <header className="sticky top-0 z-40 glass px-4 md:px-8 py-3 md:py-4 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center md:hidden shrink-0">
                <Shield className="w-4 h-4 text-white" />
             </div>
             <h1 className="text-xs md:text-sm font-bold tracking-widest text-white uppercase opacity-70 truncate max-w-[150px]">
               {activeTab === 'overview' ? 'Sovereign Command' : activeTab}
             </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setShowClinicalBrief(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-bold uppercase tracking-wider hover:bg-indigo-600/20 hover:border-indigo-500/40 transition-all text-neutral-300 group"
            >
              <FileText className="w-3 h-3 group-hover:text-indigo-400" /> <span className="hidden xs:inline">Clinic Brief</span>
            </button>
            <button className="relative p-2 text-neutral-400 hover:text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-in fade-in duration-700">
              <div className="lg:col-span-4 space-y-6 md:space-y-8">
                <section 
                  onClick={() => setShowClinicalBrief(true)}
                  className="glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/10 flex flex-col items-center relative overflow-hidden group cursor-pointer hover:border-indigo-500/30 transition-all"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <HealthAura status={reports.length > 0 ? HealthStatus.OPTIMAL : HealthStatus.STABLE} score={reports.length > 0 ? 92 : 88} />
                  <div className="mt-6 md:mt-8 grid grid-cols-2 gap-3 md:gap-4 w-full">
                     <div className="p-3 md:p-4 glass rounded-2xl border-white/5 bg-white/[0.01]">
                        <div className="text-[8px] md:text-[9px] font-bold text-neutral-500 tracking-widest mb-1">METABOLIC</div>
                        <div className="text-lg md:text-xl font-bold text-white tracking-tighter">94 <span className="text-[9px] font-normal text-neutral-600 uppercase">mg/dL</span></div>
                     </div>
                     <div className="p-3 md:p-4 glass rounded-2xl border-white/5 bg-white/[0.01]">
                        <div className="text-[8px] md:text-[9px] font-bold text-neutral-500 tracking-widest mb-1">RECOVERY</div>
                        <div className="text-lg md:text-xl font-bold text-indigo-400 tracking-tighter">62 <span className="text-[9px] font-normal text-neutral-600 uppercase">ms</span></div>
                     </div>
                  </div>
                  <div className="mt-4 text-[8px] md:text-[9px] font-bold text-neutral-500 uppercase tracking-widest flex items-center gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <HeartPulse className="w-3 h-3 text-red-500" /> Tap for detailed clinic handover
                  </div>
                </section>
                
                <section className="glass p-5 md:p-6 rounded-3xl border-white/10">
                  <h3 className="text-[9px] md:text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">Anatomical Status</h3>
                  <BodyMap />
                </section>
              </div>

              <div className="lg:col-span-8 space-y-6 md:space-y-8">
                <section className="glass p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-500/[0.03] to-transparent">
                  <div className="absolute top-0 right-0 p-4 md:p-6">
                    <Zap className="w-5 h-5 md:w-6 md:h-6 text-lime-400 animate-pulse" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2 text-white">
                    Guardian Protocol <span className="text-[8px] md:text-[10px] font-mono text-neutral-600 px-2 py-0.5 border border-white/10 rounded ml-2">V2.1</span>
                  </h3>
                  <div className="prose prose-invert max-w-none text-neutral-400 text-xs md:text-sm leading-relaxed whitespace-pre-line">
                    {guardianBrief}
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div onClick={() => setActiveTab('insurance')} className="glass p-6 md:p-8 rounded-[2rem] border-amber-500/20 bg-amber-500/[0.02] cursor-pointer hover:bg-amber-500/5 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-amber-500" />
                       <div className="px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[8px] font-bold rounded uppercase">Priority</div>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-white mb-1 uppercase tracking-wider">Premium Alert</h4>
                    <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed">₹8,500 due for TATA AIA. Pay now to avoid sovereign lapse.</p>
                  </div>
                  <div onClick={() => setActiveTab('vault')} className="glass p-6 md:p-8 rounded-[2rem] border-indigo-500/20 bg-indigo-500/[0.02] cursor-pointer hover:bg-indigo-500/5 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <Zap className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
                       <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-bold rounded uppercase">System</div>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-white mb-1 uppercase tracking-wider">Shredder Ready</h4>
                    <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed">No new reports shredded this week. Digitise physical documents.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vault' && <Vault reports={reports} onReportAdded={(r) => setReports([r, ...reports])} />}
          {activeTab === 'insurance' && <InsuranceVault />}
          {activeTab === 'profile' && <Profile />}
          {(activeTab === 'guardian' || activeTab === 'family') && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6">
               <div className="p-4 rounded-full glass border-white/10 animate-pulse mb-6">
                  <Activity className="w-8 h-8 text-neutral-600" />
               </div>
               <h3 className="text-lg font-bold tracking-tight mb-2">System Module Restricted</h3>
               <p className="text-xs text-neutral-500 max-w-sm mb-6 leading-relaxed">This module requires Level 2 clearance or a valid ABHA sync to populate personalized predictive data.</p>
               <button className="px-6 py-2.5 glass rounded-xl border-white/20 text-[10px] font-bold tracking-widest uppercase hover:bg-white/10 transition-colors">
                  Upgrade Security Tier
               </button>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[50] glass border-t border-white/10 px-2 flex md:hidden bg-[#0A0A0B]/80 backdrop-blur-xl">
        <BottomTab id="overview" icon={LayoutDashboard} label="Pulse" />
        <BottomTab id="vault" icon={Zap} label="Vault" />
        <BottomTab id="insurance" icon={ShieldCheck} label="Shield" />
        <BottomTab id="profile" icon={User} label="Me" />
      </nav>
    </div>
  );
};

export default App;
