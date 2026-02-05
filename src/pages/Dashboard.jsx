import React, { useState } from 'react';

// 1. Individual Stat Card Component (Top Row)
const TopStatCard = ({ label, value, icon, colorClass, statusIcon }) => (
  <div className="flex-1 min-w-[200px] bg-[#1a2036] border border-[#2d385e] rounded-xl p-5">
    <p className="text-[#919fca] text-xs font-bold uppercase tracking-wider">{label}</p>
    <div className="flex items-end justify-between mt-2">
      <h3 className={`text-3xl font-bold tracking-tight ${colorClass || 'text-white'}`}>{value}</h3>
      <span className={`material-symbols-outlined ${statusIcon ? 'text-tactical-green' : 'text-[#3b4b7a]'}`}>{icon}</span>
    </div>
  </div>
);

// 2. Operative Card Component (The Vitals Display)
const OperativeCard = ({ soldier }) => {
  const isCritical = soldier.status === 'CRITICAL';
  const isCaution = soldier.status === 'CAUTION';

  return (
    <div className={`bg-[#1a2036] rounded-xl border transition-all duration-500 overflow-hidden flex flex-col ${
      isCritical ? 'border-tactical-red ring-1 ring-tactical-red animate-pulse' : 'border-[#2d385e]'
    }`}>
      {/* Card Header */}
      <div className={`p-3 flex items-center justify-between ${isCritical ? 'bg-tactical-red/10' : 'bg-[#232c48]/30'}`}>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full border-2 border-[#3b4b7a] bg-slate-800 overflow-hidden">
            <img src={`https://i.pravatar.cc/150?u=${soldier.id}`} alt="profile" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold uppercase">{soldier.name}</h4>
            <p className="text-[#919fca] text-[10px] uppercase tracking-tighter">{soldier.rank}</p>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
          isCritical ? 'bg-tactical-red text-white border-tactical-red' : 
          isCaution ? 'bg-tactical-yellow/20 text-tactical-yellow border-tactical-yellow/30' : 
          'bg-tactical-green/20 text-tactical-green border-tactical-green/30'
        }`}>
          {soldier.status}
        </span>
      </div>

      {/* Vitals Data */}
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${isCritical ? 'text-tactical-red' : isCaution ? 'text-tactical-yellow' : 'text-white'}`}>
              {soldier.bpm}
            </span>
            <span className="text-[#919fca] text-xs font-medium uppercase">BPM</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-[#919fca]">
                <span className="material-symbols-outlined text-sm">{soldier.temp ? 'thermostat' : 'air'}</span>
                <span className="text-[11px] font-semibold">{soldier.temp || `${soldier.spo2}% O2`}</span>
            </div>
            {isCritical && <span className="text-tactical-red text-[11px] font-bold uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">warning</span> Tachycardia
            </span>}
          </div>
        </div>

        {/* ECG-style Waveform (SVG) */}
        <div className="h-16 w-full bg-[#111522] rounded border border-[#232c48] overflow-hidden">
          <svg className={`w-full h-full ${isCritical ? 'text-tactical-red' : isCaution ? 'text-tactical-yellow' : 'text-tactical-green'} opacity-70`} preserveAspectRatio="none" viewBox="0 0 200 60">
            <path d={soldier.path} fill="none" stroke="currentColor" strokeWidth="1.5"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

// 3. Main Dashboard Layout
export default function Dashboard() {
  const [soldiers] = useState([
    { id: 1, name: "LT. COVINGTON", rank: "Alpha 01 - Lead", status: "STABLE", bpm: 72, temp: "98.6°F", path: "M0,30 L20,30 L25,10 L30,50 L35,30 L60,30 L65,5 L70,55 L75,30 L200,30" },
    { id: 2, name: "SGT. MARTINEZ", rank: "Alpha 02 - Medic", status: "CAUTION", bpm: 115, temp: "101.2°F", path: "M0,30 L10,30 L15,15 L20,45 L25,30 L50,30 L55,5 L60,55 L200,30" },
    { id: 3, name: "PVT. CHEN", rank: "Alpha 03 - Scout", status: "CRITICAL", bpm: 158, spo2: 88, path: "M0,30 L5,10 L10,50 L15,10 L20,50 L25,10 L30,50 L35,10 L200,30" },
    { id: 4, name: "SGT. ROSS", rank: "Alpha 04 - Comms", status: "STABLE", bpm: 68, spo2: 98, path: "M0,30 L30,30 L35,10 L40,50 L45,30 L80,30 L200,30" },
    { id: 5, name: "CPL. KIM", rank: "Alpha 05 - Sniper", status: "STABLE", bpm: 59, spo2: 99, path: "M0,30 L40,30 L45,15 L50,45 L55,30 L100,30 L200,30" },
  ]);

  return (
    <div className="flex h-screen bg-[#101422] text-white font-sans overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-72 bg-[#101422] border-r border-[#232c48] p-6 flex flex-col">
        <div className="mb-10">
          <p className="text-[#919fca] text-[10px] font-bold uppercase tracking-widest">Active Mission</p>
          <h1 className="text-xl font-black mt-1 uppercase">Operation Nightfall</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <button className="w-full flex justify-between items-center bg-[#0f47f0]/10 border border-[#0f47f0]/30 p-3 rounded-lg text-sm font-bold text-white">
            <span className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">groups</span> Squad Alpha</span>
            <span className="text-tactical-green text-[10px]">ACTIVE</span>
          </button>
          <button className="w-full flex items-center gap-3 p-3 text-[#919fca] text-sm font-medium hover:text-white transition-colors">
            <span className="material-symbols-outlined">groups</span> Squad Bravo
          </button>
        </nav>

        {/* Mission Timer */}
        <div className="mb-10">
            <p className="text-[#919fca] text-[10px] font-bold uppercase mb-2">Mission Duration</p>
            <div className="grid grid-cols-4 gap-2">
                {['00','04','28','54'].map((num, i) => (
                    <div key={i} className="bg-[#232c48] border border-[#3b4b7a] rounded p-2 text-center">
                        <span className="text-sm font-bold">{num}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Emergency Alert Box */}
        <div className="bg-tactical-red/10 border border-tactical-red/30 p-4 rounded-xl">
          <h3 className="text-tactical-red text-[10px] font-black uppercase flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">warning</span> Emergency Alerts
          </h3>
          <p className="text-white text-xs mt-3 font-bold">LOW OXYGEN</p>
          <p className="text-[#919fca] text-[10px] mt-1 leading-relaxed">Operative Miller: Suit integrity warning in Sector 4.</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Header */}
        <header className="h-16 border-b border-[#232c48] flex items-center justify-between px-8 bg-[#101422]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#0f47f0] text-3xl">shield_person</span>
              <h2 className="text-sm font-black tracking-tighter">SQUAD SAFETY CONTROL</h2>
            </div>
            <nav className="flex gap-8">
              {['Mission Control', 'Vitals Monitor', 'Alerts Log', 'Personnel'].map((tab, i) => (
                <button key={i} className={`text-xs font-bold uppercase tracking-tight ${i === 0 ? 'text-[#0f47f0] border-b-2 border-[#0f47f0] pb-1' : 'text-[#919fca]'}`}>
                  {tab}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <button className="bg-[#0f47f0] px-4 py-2 rounded-lg text-[11px] font-black uppercase flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">person_add</span> Enroll Operative
            </button>
            <span className="material-symbols-outlined text-[#919fca]">notifications</span>
            <span className="material-symbols-outlined text-[#919fca]">settings</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8">
          
          {/* Top Stat Row */}
          <div className="flex gap-6">
            <TopStatCard label="Active Members" value="06/08" icon="check_circle" statusIcon />
            <TopStatCard label="Critical Alerts" value="01" icon="error" colorClass="text-tactical-red" />
            <TopStatCard label="Avg Squad BPM" value="84" icon="monitor_heart" />
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Real-time Vitals Monitoring</h2>
            <div className="flex bg-[#232c48] p-1 rounded-lg">
                <button className="px-3 py-1 text-[10px] font-bold uppercase">Grid View</button>
                <button className="px-3 py-1 bg-[#0f47f0] rounded text-[10px] font-bold uppercase">Focus View</button>
            </div>
          </div>

          {/* Soldiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldiers.map(s => <OperativeCard key={s.id} soldier={s} />)}
            
            {/* Add Operative Placeholder */}
            <div className="border-2 border-dashed border-[#3b4b7a] rounded-xl flex flex-col items-center justify-center p-10 hover:border-[#0f47f0] transition-colors cursor-pointer opacity-50">
                <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
                <p className="text-[10px] font-bold uppercase tracking-widest">Add Operative</p>
                <p className="text-[9px] text-[#919fca] uppercase mt-1">Alpha 07 - Unassigned</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto border-t border-[#232c48] p-4 px-8 flex justify-between text-[#919fca] text-[10px] font-bold uppercase">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-tactical-green"></span> 4 Operatives Stable</span>
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-tactical-yellow"></span> 1 Operative Caution</span>
            <span className="flex items-center gap-2"><span className="size-2 rounded-full bg-tactical-red"></span> 1 Operative Critical</span>
          </div>
          <p>Last System Sync: 0.4s ago | Encryption: AES-256 Active</p>
        </footer>
      </main>
    </div>
  );
}