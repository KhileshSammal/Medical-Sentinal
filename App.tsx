
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Shield, Activity, Users, Settings, Bell, Zap, Menu, ShieldCheck } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CommandBar from './components/CommandBar';
import HealthAura from './components/HealthAura';
import BodyMap from './components/BodyMap';
import Vault from './components/Vault';
import InsuranceVault from './components/InsuranceVault';
import { MedicalReport, HealthStatus } from './types';
import { getGuardianBrief } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'vault' | 'guardian' | 'family' | 'insurance'>('overview');
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [guardianBrief, setGuardianBrief] = useState<string>('Initializing Sentinel protocol...');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const mockTrends = [
    { date: '2023-Q1', val: 12.4 },
    { date: '2023-Q2', val: 11.8 },
    { date: '2023-Q3', val: 13.2 },
    { date: '2023-Q4', val: 14.5 },
    { date: '2024-Q1', val: 12.9 },
  ];

  useEffect(() => {
    if (reports.length > 0) {
      getGuardianBrief(reports).then(setGuardianBrief);
    } else {
      setGuardianBrief("Upload reports to activate the Guardian protocol.");
    }
  }, [reports]);

  const handleAction = (id: string) => {
    if (id === 'vault') setActiveTab('vault');
    if (id === 'scan') setActiveTab('vault');
    if (id === 'trends') setActiveTab('overview');
    if (id === 'family') setActiveTab('family');
    if (id === 'insurance') setActiveTab('insurance');
  };

  const NavItem = ({ id, icon: Icon, label }: { id: any, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group ${
        activeTab === id 
          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
          : 'text-neutral-500 hover:text-neutral-200 hover:bg-white/5'
      }`}
    >
      <Icon className={`w-4 h-4 ${activeTab === id ? 'text-indigo-400' : 'group-hover:text-neutral-200'}`} />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <CommandBar onAction={handleAction} />
      
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} h-full glass border-r border-white/10 transition-all duration-300 flex flex-col hidden md:flex`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center indigo-glow">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold tracking-tight text-white text-lg">SENTINEL</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem id="overview" icon={LayoutDashboard} label="Overview" />
          <NavItem id="vault" icon={Zap} label="Medical Vault" />
          <NavItem id="insurance" icon={ShieldCheck} label="Insurance" />
          <NavItem id="guardian" icon={Activity} label="Guardian Logic" />
          <NavItem id="family" icon={Users} label="Family Circles" />
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
           <div className="flex items-center gap-3 px-3 py-2 text-xs text-neutral-500 uppercase tracking-widest font-bold">
            Sovereign Identity
          </div>
          <div className="glass p-3 rounded-xl border-white/10 flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
             {isSidebarOpen && (
               <div className="overflow-hidden">
                 <div className="text-xs font-bold text-white truncate">ADITYA VERMA</div>
                 <div className="text-[10px] text-neutral-500 truncate font-mono">ABHA: 34-1122-3344</div>
               </div>
             )}
          </div>
          <NavItem id="settings" icon={Settings} label="Settings" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-transparent relative">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-lime-600/5 blur-[120px] pointer-events-none" />

        <header className="sticky top-0 z-40 glass px-8 py-4 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-4">
             <button className="md:hidden text-neutral-400" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
               <Menu className="w-6 h-6" />
             </button>
             <h1 className="text-lg font-semibold tracking-tight capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-neutral-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0A0A0B]" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 glass rounded-full border-white/10 text-[10px] font-mono text-neutral-400">
               <span className="w-1.5 h-1.5 bg-lime-500 rounded-full animate-pulse" />
               SERVER: BENGALURU-SECURE
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Health Aura & Vital Signs */}
              <div className="lg:col-span-4 space-y-8">
                <section className="glass p-8 rounded-[2rem] border-white/10 flex flex-col items-center">
                  <HealthAura status={reports.length > 0 ? HealthStatus.OPTIMAL : HealthStatus.STABLE} score={reports.length > 0 ? 88 : 0} />
                  <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                     <div className="p-4 glass rounded-2xl border-white/10">
                        <div className="text-[10px] font-bold text-neutral-500 tracking-widest mb-1">BLOOD SUGAR</div>
                        <div className="text-xl font-bold text-white">94 <span className="text-xs font-normal text-neutral-500 uppercase">mg/dL</span></div>
                     </div>
                     <div className="p-4 glass rounded-2xl border-white/10">
                        <div className="text-[10px] font-bold text-neutral-500 tracking-widest mb-1">HR VARIABILITY</div>
                        <div className="text-xl font-bold text-white">62 <span className="text-xs font-normal text-neutral-500 uppercase">ms</span></div>
                     </div>
                  </div>
                </section>
                
                <section className="glass p-6 rounded-3xl border-white/10">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-4">Anatomical Overview</h3>
                  <BodyMap />
                </section>
              </div>

              {/* Center/Right Column: Guardian & Trends */}
              <div className="lg:col-span-8 space-y-8">
                <section className="glass p-8 rounded-[2rem] border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <Zap className="w-5 h-5 text-lime-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    Guardian Sentinel Protocol
                  </h3>
                  <div className="prose prose-invert max-w-none text-neutral-300 text-sm leading-relaxed">
                    {guardianBrief}
                  </div>
                  <button className="mt-6 flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-widest hover:text-indigo-300 transition-colors">
                    View Full Analysis Report →
                  </button>
                </section>

                <section className="glass p-8 rounded-[2rem] border-white/10">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Biomarker Trendline</h3>
                    <select className="bg-white/5 border border-white/10 rounded-lg text-xs font-bold px-3 py-1 outline-none">
                       <option>Hemoglobin (Hb)</option>
                       <option>Vitamin D</option>
                       <option>Creatinine</option>
                    </select>
                  </div>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockTrends}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis dataKey="date" stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                        <Tooltip 
                          contentStyle={{ background: '#171717', border: '1px solid #333', borderRadius: '8px', fontSize: '10px' }}
                          itemStyle={{ color: '#6366F1' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="val" 
                          stroke="#6366F1" 
                          strokeWidth={3} 
                          dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, stroke: '#6366F1', strokeWidth: 0, fill: '#fff' }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-6 rounded-2xl border-white/10 flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-red-400">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Conflict Detector</h4>
                      <p className="text-xs text-neutral-500">No drug-drug interactions detected in current regimen.</p>
                    </div>
                  </div>
                  <div className="glass p-6 rounded-2xl border-white/10 flex items-start gap-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-lime-400">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold mb-1">Next Action</h4>
                      <p className="text-xs text-neutral-500">Lipid Profile due in 12 days. Click to book home collection.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'vault' && (
            <div className="max-w-4xl mx-auto">
               <Vault 
                reports={reports} 
                onReportAdded={(r) => setReports([r, ...reports])} 
              />
            </div>
          )}

          {activeTab === 'insurance' && (
            <InsuranceVault />
          )}

          {(activeTab === 'guardian' || activeTab === 'family') && (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
               <div className="p-4 rounded-full glass border-white/10 animate-pulse">
                  <Activity className="w-8 h-8 text-neutral-600" />
               </div>
               <h3 className="text-xl font-bold tracking-tight">System Module Restricted</h3>
               <p className="text-neutral-500 max-w-sm">This module requires Level 2 clearance or a valid ABHA sync to populate personalized predictive data.</p>
               <button className="px-6 py-2 glass rounded-lg border-white/20 text-xs font-bold tracking-widest uppercase hover:bg-white/10 transition-colors">
                  Upgrade Security Tier
               </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
