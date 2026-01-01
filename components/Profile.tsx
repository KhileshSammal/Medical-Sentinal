
import React, { useState } from 'react';
import { User, Shield, Ruler, Weight, UserCircle, Activity, Save, Edit3, Camera, Calendar } from 'lucide-react';
import { UserProfile } from '../types';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    abhaId: '34-1122-3344',
    name: 'Khilesh Sammal',
    age: 27,
    dob: '1998-07-21',
    gender: 'MALE',
    bloodGroup: 'B+',
    weight: 72,
    height: 175,
    isSmoker: false,
    chronicConditions: ['None'],
    allergies: ['Dust', 'Pollen']
  });

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white">Sovereign Identity</h2>
          <p className="text-sm text-neutral-500 mt-1">Sovereign identity for {profile.name}.</p>
        </div>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold tracking-widest uppercase text-xs transition-all indigo-glow hover:bg-indigo-500"
        >
          {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
          {isEditing ? 'Save Profile' : 'Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="glass p-8 rounded-3xl border-white/10 flex flex-col items-center text-center relative overflow-hidden group">
            <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 mb-4 p-1 relative">
              <div className="w-full h-full rounded-full bg-[#0A0A0B] flex items-center justify-center overflow-hidden border-2 border-white/5">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-1 right-1 p-2 bg-indigo-600 rounded-full border-2 border-[#0A0A0B] text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-3 h-3" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-white tracking-tight">{profile.name}</h3>
            <p className="text-xs font-mono text-neutral-500 mt-1">ABHA: {profile.abhaId}</p>
          </div>

          <div className="glass p-6 rounded-3xl border-white/10 space-y-4">
             <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-neutral-400">
                <Calendar className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">DOB</span>
              </div>
              <span className="text-sm font-bold text-white">{profile.dob}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-neutral-400">
                <Weight className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Weight</span>
              </div>
              <span className="text-sm font-bold text-white">{profile.weight} kg</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-neutral-400">
                <Activity className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Blood Group</span>
              </div>
              <span className="text-sm font-bold text-indigo-400">{profile.bloodGroup}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="glass p-8 rounded-3xl border-white/10 h-full">
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              Sovereign Health Parameters
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Allergies</label>
                <div className="flex flex-wrap gap-2">
                  {profile.allergies.map(a => (
                    <span key={a} className="px-3 py-1 bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded-lg font-bold uppercase tracking-wider">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Vitals Summary</label>
                <div className="space-y-2">
                   <div className="flex justify-between text-xs">
                     <span className="text-neutral-500">BMI</span>
                     <span className="text-white font-bold">23.5 (Healthy)</span>
                   </div>
                   <div className="flex justify-between text-xs">
                     <span className="text-neutral-500">Last BP</span>
                     <span className="text-white font-bold">120/80 mmHg</span>
                   </div>
                </div>
              </div>

              <div className="space-y-4 sm:col-span-2">
                <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Family History</label>
                <div className="p-4 glass rounded-2xl border-white/5 bg-white/[0.01]">
                   <p className="text-xs text-neutral-400">No major hereditary risks detected based on connected Family Circles.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
