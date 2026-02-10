import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import Navigate
import OperativeModal from './OperativeModal';

const TopStatCard = ({ label, value, icon, colorClass, statusIcon }) => (
  <div className="flex-1 min-w-[200px] bg-[#1a2036] border border-[#2d385e] rounded-xl p-5">
    <p className="text-[#919fca] text-xs font-bold uppercase tracking-wider">{label}</p>
    <div className="flex items-end justify-between mt-2">
      <h3 className={`text-3xl font-bold tracking-tight ${colorClass || 'text-white'}`}>{value}</h3>
      <span className={`material-symbols-outlined ${statusIcon ? 'text-tactical-green' : 'text-[#3b4b7a]'}`}>{icon}</span>
    </div>
  </div>
);

// 2. Updated Operative Card with onClick
const OperativeCard = ({ soldier, onClick }) => {
  const isCritical = soldier.status === 'CRITICAL';
  const isCaution = soldier.status === 'CAUTION';

  return (
    <div 
      onClick={onClick} // 2. Trigger navigation on click
      className={`bg-[#1a2036] rounded-xl border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 ${
        isCritical ? 'border-tactical-red ring-1 ring-tactical-red animate-pulse' : 'border-[#2d385e]'
      }`}
    >
      <div className={`p-3 flex items-center justify-between ${isCritical ? 'bg-tactical-red/10' : 'bg-[#232c48]/30'}`}>
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full border-2 border-[#3b4b7a] bg-slate-800 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${soldier.name}`} alt="profile" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-tight">{soldier.name}</h4>
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

      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className={`text-3xl font-bold ${isCritical ? 'text-tactical-red' : isCaution ? 'text-tactical-yellow' : 'text-white'}`}>
              {soldier.bpm}
            </span>
            <span className="text-[#919fca] text-xs font-medium uppercase">BPM</span>
          </div>
          <div className="text-[#919fca] flex items-center gap-1">
             <span className="material-symbols-outlined text-sm">air</span>
             <span className="text-[11px] font-semibold">{soldier.spo2}% O2</span>
          </div>
        </div>

        <div className="h-16 w-full bg-[#111522] rounded border border-[#232c48] overflow-hidden">
          <svg className={`w-full h-full ${isCritical ? 'text-tactical-red' : 'text-tactical-green'} opacity-70`} preserveAspectRatio="none" viewBox="0 0 200 60">
            <path d={soldier.path} fill="none" stroke="currentColor" strokeWidth="1.5"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [soldiers, setSoldiers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // 3. Initialize Navigate

  const handleAddAgent = (formData) => {
    const newAgent = {
      id: Date.now(),
      name: formData.callsign || "UNNAMED_UNIT",
      rank: formData.rank || "OPERATIVE",
      status: "STABLE",
      bpm: parseInt(formData.restingHeartRate) || 72,
      spo2: parseInt(formData.bloodOxygen) || 98,
      path: "M0,30 L20,30 L25,10 L30,50 L35,30 L60,30 L65,5 L70,55 L75,30 L200,30" 
    };
    setSoldiers([...soldiers, newAgent]);
    setIsModalOpen(false);
  };

  // 4. Function to handle card click
  const handleCardClick = (soldier) => {
    // Navigates to /Card and passes the soldier data as state
    navigate('/Card', { state: { soldier } });
  };

  return (
    <div className="flex h-screen bg-[#101422] text-white font-sans overflow-hidden">
      <aside className="w-72 bg-[#101422] border-r border-[#232c48] p-6 flex flex-col">
        <div className="mb-10">
          <p className="text-[#919fca] text-[10px] font-bold uppercase tracking-widest">Active Mission</p>
          <h1 className="text-xl font-black mt-1 uppercase text-blue-500">Operation Nightfall</h1>
        </div>
        <nav className="space-y-2 flex-1">
          <button className="w-full flex justify-between items-center bg-[#0f47f0]/10 border border-[#0f47f0]/30 p-3 rounded-lg text-sm font-bold text-white">
            <span className="flex items-center gap-3"><span className="material-symbols-outlined text-primary">groups</span> Squad Alpha</span>
            <span className="text-tactical-green text-[10px]">ACTIVE</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-[#232c48] flex items-center justify-between px-8 bg-[#101422]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0f47f0] text-3xl">shield_person</span>
            <h2 className="text-sm font-black tracking-tighter uppercase">Squad Safety Control</h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0f47f0] hover:bg-blue-600 px-4 py-2 rounded-lg text-[11px] font-black uppercase flex items-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-lg">person_add</span> Enroll Operative
          </button>
        </header>

        <div className="p-8 space-y-8">
          <div className="flex gap-6">
            <TopStatCard label="Active Members" value={`0${soldiers.length}/08`} icon="check_circle" statusIcon={soldiers.length > 0} />
            <TopStatCard label="Critical Alerts" value="00" icon="error" colorClass="text-tactical-red" />
            <TopStatCard label="Squad Average BPM" value={soldiers.length > 0 ? "72" : "--"} icon="monitor_heart" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldiers.map(s => (
              <OperativeCard 
                key={s.id} 
                soldier={s} 
                onClick={() => handleCardClick(s)} // Pass click handler
              />
            ))}
            
            <div 
              onClick={() => setIsModalOpen(true)}
              className="border-2 border-dashed border-[#3b4b7a] rounded-xl flex flex-col items-center justify-center p-10 hover:border-[#0f47f0] transition-colors cursor-pointer group"
            >
              <span className="material-symbols-outlined text-4xl mb-2 text-[#3b4b7a] group-hover:text-[#0f47f0]">add_circle</span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#919fca] group-hover:text-white">Add Operative</p>
            </div>
          </div>
        </div>
      </main>

      <OperativeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddAgent={handleAddAgent} />
    </div>
  );
}