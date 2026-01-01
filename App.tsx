
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Shield, Activity, Users, Settings, Bell, Zap, Menu, ShieldCheck, User, FileText, ChevronRight, X, HeartPulse, MessageSquare, Dna, CloudRain, Thermometer, Wind, AlertCircle, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CommandBar from './components/CommandBar';
import HealthAura from './components/HealthAura';
import BodyMap from './components/BodyMap';
import Vault from './components/Vault';
import InsuranceVault from './components/InsuranceVault';
import Profile from './components/Profile';
import ClinicalBrief from './components/ClinicalBrief';
import Concierge from './components/Concierge';
import Longevity from './components/Longevity';
import Guardian from './components/Guardian';
import FamilyCircles from './components/FamilyCircles';
import { MedicalReport, HealthStatus, EnvironmentData, ChronicLog } from './types';
import { getGuardianBrief } from './services/geminiService';
import { getEnvironmentData, checkEnvironmentalCorrelations } from './services/environmentService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vault' | 'guardian' | 'family' | 'insurance' | 'profile' | 'concierge' | 'longevity'>('overview');
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [envData, setEnvData] = useState<EnvironmentData | null>(null);
  const [guardianBrief, setGuardianBrief] = useState<string>('Initializing Sentinel protocol...');
  const [envAdvisory, setEnvAdvisory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showClinicalBrief, setShowClinicalBrief] = useState(false);
  const [isHeartbeating, setIsHeartbeating] = useState(false);

  // Mock chronic logs for correlation demonstration
  const [chronicLogs] = useState<ChronicLog[]>([
    { id: '1', symptom: 'Shortness of Breath', severity: 3, timestamp: '2024-07-15T10:00:00Z', envContext: { humidity: 82 } },
    { id: '2', symptom: 'Shortness of Breath', severity: 4, timestamp: '2024-07-18T14:00:00Z', envContext: { humidity: 88 } }
  ]);

  useEffect(() => {
    const fetchEnv = async () => {
      const data = await getEnvironmentData();
      setEnvData(data);
      const advisory = checkEnvironmentalCorrelations(data, chronicLogs);
      setEnvAdvisory(advisory);
    };
    fetchEnv();
    const interval = setInterval(fetchEnv, 300000); // Every 5 mins
    return () => clearInterval(interval);
  }, [chronicLogs]);

  useEffect(() => {
    if (reports.length > 0 || envData) {
      setIsHeartbeating(true);
      getGuardianBrief(reports, envData || undefined, chronicLogs).then((brief) => {
        setGuardianBrief(brief);
        setTimeout(() => setIsHeartbeating(false), 2000);
      });
    } else {
      setGuardianBrief("Active: Monitoring longitudinal trends and genomic sync.");
    }
  }, [reports, envData, chronicLogs]);

  const handleAction = (id: string) => {
    const tabMap: Record<string, typeof activeTab> = {
      vault: 'vault',
      scan: 'vault',
      trends: 'guardian',
      family: 'family',
      insurance: 'insurance',
      profile: 'profile',
      concierge: 'concierge',
      longevity: 'longevity',
      guardian: 'guardian'
    };
    if (tabMap[id]) setActiveTab(tabMap[id]);
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ id, icon: Icon, label, premium }: { id: typeof activeTab, icon: any, label: string, premium?: boolean }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setIsMobileMenuOpen(false);
      }}
      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
        activeTab === id 
          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.2)]' 
          : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className={`w-4 h-4 ${activeTab === id ? 'text-indigo-400' : 'group-hover:text-neutral-200'}`} />
        <span>{label}</span>
      </div>
      {premium && <div className="text-[8px] font-bold bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded uppercase tracking-tighter">PRM</div>}
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

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <NavItem id="overview" icon={LayoutDashboard} label="Sovereign Pulse" />
          <NavItem id="vault" icon={Zap} label="Medical Vault" />
          <NavItem id="insurance" icon={ShieldCheck} label="Insurance" />
          <NavItem id="longevity" icon={Dna} label="DNA Blueprint" premium />
          <NavItem id="concierge" icon={MessageSquare} label="Quartermaster" premium />
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
                 <div className="text-[9px] text-neutral-500 truncate font-mono">BIO-AGE: 23.2Y</div>
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
               {activeTab === 'overview' ? 'Sovereign Command' : activeTab === 'longevity' ? 'Longevity Protocol' : activeTab}
             </h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             {envData && (
               <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-neutral-400">
                  <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
                    <Wind className="w-3 h-3 text-indigo-400" /> AQI {envData.aqi}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="w-3 h-3 text-red-400" /> {envData.temp}°C
                  </div>
               </div>
             )}
            <button 
              onClick={() => setActiveTab('concierge')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-lg text-[9px] font-bold uppercase tracking-wider text-indigo-400 group"
            >
              <MessageSquare className="w-3 h-3 group-hover:scale-110" /> <span className="hidden xs:inline">Quartermaster</span>
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
                {/* Environmental Pulse Widget */}
                {envData && (
                  <section className="glass p-6 rounded-[2rem] border-white/10 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                        <CloudRain className="w-8 h-8 text-indigo-400" />
                     </div>
                     <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">Environmental Pulse</h3>
                     <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <div className="text-[8px] text-neutral-500 font-bold uppercase">AQI</div>
                          <div className={`text-lg font-bold ${envData.aqi > 150 ? 'text-red-400' : 'text-indigo-400'}`}>{envData.aqi}</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] text-neutral-500 font-bold uppercase">Humidity</div>
                          <div className="text-lg font-bold text-white">{envData.humidity}%</div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[8px] text-neutral-500 font-bold uppercase">Temp</div>
                          <div className="text-lg font-bold text-white">{envData.temp}°</div>
                        </div>
                     </div>
                     {envAdvisory && (
                       <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex gap-2 items-start animate-pulse">
                          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          <p className="text-[9px] font-bold text-red-200 leading-relaxed uppercase tracking-tighter">
                            {envAdvisory}
                          </p>
                       </div>
                     )}
                  </section>
                )}

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
                </section>
                
                <section className="glass p-5 md:p-6 rounded-3xl border-white/10">
                  <h3 className="text-[9px] md:text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">Anatomical Status</h3>
                  <BodyMap />
                </section>
              </div>

              <div className="lg:col-span-8 space-y-4 md:space-y-6">
                {/* Shortened Guardian Sentinel Protocol Section */}
                <section className="glass p-4 md:p-5 rounded-[1.5rem] md:rounded-[2rem] border-white/10 relative overflow-hidden bg-gradient-to-br from-indigo-500/[0.05] to-transparent flex items-center gap-4">
                  <div className="shrink-0 p-3 bg-indigo-600 rounded-2xl indigo-glow">
                    <Sparkles className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-[10px] md:text-xs font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                        Guardian Brief <span className="opacity-40 font-mono text-[8px] md:text-[9px]">V2.1</span>
                      </h3>
                      <button onClick={() => setActiveTab('guardian')} className="text-[8px] md:text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">Analyze Radar</button>
                    </div>
                    <p className="text-[10px] md:text-xs text-neutral-400 truncate opacity-90 leading-tight">
                      {guardianBrief.split('\n')[0]}
                    </p>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div onClick={() => setActiveTab('longevity')} className="glass p-6 md:p-8 rounded-[2rem] border-indigo-500/20 bg-indigo-500/[0.02] cursor-pointer hover:bg-indigo-500/5 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <Dna className="w-5 h-5 md:w-6 md:h-6 text-indigo-400" />
                       <div className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[8px] font-bold rounded uppercase">Genomic</div>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-white mb-1 uppercase tracking-wider">DNA Blueprint Online</h4>
                    <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed">Longevity optimization active. Bio-age remains 4 years below chronological.</p>
                  </div>
                  <div onClick={() => setActiveTab('concierge')} className="glass p-6 md:p-8 rounded-[2rem] border-lime-500/20 bg-lime-500/[0.02] cursor-pointer hover:bg-lime-500/5 transition-all group">
                    <div className="flex justify-between items-start mb-4">
                       <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-lime-400" />
                       <div className="px-2 py-0.5 bg-lime-500/10 text-lime-400 text-[8px] font-bold rounded uppercase">Concierge</div>
                    </div>
                    <h4 className="text-xs md:text-sm font-bold text-white mb-1 uppercase tracking-wider">Quartermaster Ready</h4>
                    <p className="text-[11px] md:text-xs text-neutral-500 leading-relaxed">Senior Nurse Anjali is analyzing your last sleep cycle. Tap to chat.</p>
                  </div>
                </div>

                <section className="glass p-6 rounded-[2.5rem] border-white/10 bg-white/[0.01]">
                  <h3 className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.3em] mb-4">Long-Term Stability Log</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 glass rounded-2xl border-white/5">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Metabolic Quotient</span>
                      </div>
                      <span className="text-xs font-mono text-lime-400">92/100</span>
                    </div>
                    <div className="flex items-center justify-between p-4 glass rounded-2xl border-white/5">
                      <div className="flex items-center gap-3">
                        <HeartPulse className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">Cardiac Efficiency</span>
                      </div>
                      <span className="text-xs font-mono text-indigo-400">OPTIMAL</span>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )}

          {activeTab === 'vault' && <Vault reports={reports} onReportAdded={(r) => setReports([r, ...reports])} />}
          {activeTab === 'insurance' && <InsuranceVault />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'longevity' && <Longevity />}
          {activeTab === 'concierge' && <Concierge />}
          {activeTab === 'guardian' && <Guardian />}
          {activeTab === 'family' && <FamilyCircles />}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-[50] glass border-t border-white/10 px-2 flex md:hidden bg-[#0A0A0B]/80 backdrop-blur-xl">
        <BottomTab id="overview" icon={LayoutDashboard} label="Pulse" />
        <BottomTab id="vault" icon={Zap} label="Vault" />
        <BottomTab id="longevity" icon={Dna} label="DNA" />
        <BottomTab id="guardian" icon={Activity} label="Guardian" />
        <BottomTab id="profile" icon={User} label="Me" />
      </nav>
    </div>
  );
};

export default App;
