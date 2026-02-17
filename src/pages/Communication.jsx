import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Bell, Settings, CircleAlert,
  MapPin, Radar, LayoutDashboard, Users,
  Phone, Video, Info, Paperclip, Smile,
  Send, Navigation, Shield, Wifi, Activity, MessageSquare, ChevronLeft,
  X, Crosshair, Maximize2, Droplets, Heart
} from 'lucide-react';

// --- Sidebar Item Component ---
const SidebarItem = ({ icon: Icon, label, active = false, onClick, badge }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-all border-l-4 ${active
      ? 'bg-blue-600/10 text-blue-400 border-blue-500'
      : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/30'
      }`}>
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span className="text-sm font-bold uppercase tracking-tight">{label}</span>
    </div>
    {badge && <span className="bg-rose-600 text-[10px] px-1.5 py-0.5 rounded font-black text-white">{badge}</span>}
  </div>
);

const CommunicationHub = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [showLargeMap, setShowLargeMap] = useState(false);
  const [isEmergencyActive] = useState(true); // Control pulse state

  return (
    <div className={`flex h-screen bg-[#0d101b] text-slate-200 font-sans overflow-hidden relative ${embedded ? 'h-full' : ''}`}>

      {/* 🔴 SATELLITE HUD OVERLAY */}
      {showLargeMap && (
        <div className="absolute inset-0 z-[100] bg-[#0d101b]/98 p-10 flex flex-col animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-start mb-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Satellite Uplink // Sector 7</h2>
              <p className="text-blue-500 font-mono text-xs mt-1">SQUAD POSITIONING ACTIVE • REFRESH RATE: 0.2ms</p>
            </div>
            <button onClick={() => setShowLargeMap(false)} className="bg-slate-800 p-4 rounded-full hover:bg-rose-600 transition-colors">
              <X size={28} />
            </button>
          </div>
          <div className="flex-1 border border-blue-500/20 rounded-3xl relative overflow-hidden bg-slate-900 shadow-[0_0_100px_rgba(37,99,235,0.1)]">
            <img src="https://api.placeholder.com/1600/900?text=High+Res+Topography+Sector+7" className="w-full h-full object-cover grayscale opacity-20" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <Crosshair size={40} className="text-blue-500 animate-pulse" />
              <div className="mt-4 bg-blue-600 text-white px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest">TARGET: BRAVO SQUAD</div>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(37,99,235,0.05)_50%,transparent_100%)] h-1/4 w-full animate-scan" />
          </div>
        </div>
      )}

      {/* --- LEFT SIDEBAR --- */}
      {!embedded && (
        <aside className="w-72 bg-[#101422] border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-8 flex items-center gap-3 border-b border-slate-800">
            <div className="bg-blue-600 p-2 rounded shadow-lg shadow-blue-900/40">
              <Shield size={20} className="text-white" />
            </div>
            <h1 className="text-md font-black uppercase tracking-tighter text-white">Mission Control</h1>
          </div>
          <nav className="flex-1 mt-6">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/Dashboard')} />
            <SidebarItem icon={Activity} label="Vitals" onClick={() => navigate('/operative-status')} />
            <SidebarItem icon={MessageSquare} label="Messages" active badge="2" />
          </nav>
        </aside>
      )}

      {/* --- CENTER CHAT STREAM --- */}
      <main className="flex-1 flex flex-col bg-[#101422]">
        <header className="h-20 border-b border-slate-800 px-10 flex items-center justify-between bg-[#101422]/80 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-blue-500">
              <Users size={24} />
            </div>
            <h3 className="text-xl font-black tracking-tight text-white uppercase">Alpha Team Channel</h3>
          </div>
          <div className="flex gap-4">
            <button className="p-3 bg-slate-800 rounded-lg"><Phone size={18} /></button>
            <button className="p-3 bg-slate-800 rounded-lg"><Video size={18} /></button>
            <button className="p-3 bg-slate-800 rounded-lg"><Info size={18} /></button>
          </div>
        </header>

        {isEmergencyActive && (
          <div className="bg-rose-600/10 border-b border-rose-600/30 px-10 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <CircleAlert className="text-rose-600 animate-pulse" size={24} />
              <p className="text-xs font-black text-white uppercase tracking-tight">SOS ALERT: SQUAD BRAVO // SECTOR 7</p>
            </div>
            <button className="bg-rose-600 text-white px-6 py-2 rounded font-black text-[10px] uppercase transition-all">Dispatch Medic</button>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
          <div className="flex gap-4">
            <div className="size-8 rounded-lg bg-slate-800 flex items-center justify-center text-[10px] font-black">S-01</div>
            <div className="bg-[#1a2036] border border-slate-800 p-4 rounded-2xl rounded-tl-none text-sm text-slate-300 max-w-[70%] shadow-lg">
              Proceeding to extraction point Delta. Alpha squad currently in high cover. No hostiles detected.
            </div>
          </div>
        </div>

        <footer className="p-8 border-t border-slate-800 bg-[#0d101b]">
          <div className="max-w-4xl mx-auto flex gap-4">
            <input className="flex-1 bg-[#1b2136] border border-slate-800 rounded-2xl py-5 px-8 text-sm outline-none focus:border-blue-500 transition-colors" placeholder="Enter tactical command..." />
            <button className="bg-blue-600 w-16 rounded-2xl flex items-center justify-center hover:bg-blue-500 transition-all"><Send size={24} className="text-white" /></button>
          </div>
        </footer>
      </main>

      {/* --- RIGHT INFO PANEL --- */}
      <aside className="w-80 border-l border-slate-800 bg-[#101422] p-4 hidden xl:flex flex-col gap-6">

        {/* Unit Location Card with Pulse Animation */}
        <section>
          <h4 className="text-[10px] font-black text-[#919fca] uppercase tracking-[0.2em] mb-3">Unit Location</h4>
          <div
            onClick={() => setShowLargeMap(true)}
            className={`h-40 w-full rounded-lg bg-[#1b2136] border relative overflow-hidden group cursor-pointer transition-all duration-500 ${isEmergencyActive
              ? 'border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.2)] animate-pulse-tactical'
              : 'border-[#323f67]'
              }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0f47f0]/20 to-transparent" />
            <img className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" src="https://api.placeholder.com/400/300?text=Satelitte+Map" alt="Map" />

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isEmergencyActive ? 'text-rose-500' : 'text-[#0f47f0]'} animate-pulse`}>
              <Navigation fill="currentColor" size={24} />
            </div>

            {/* Emergency Scanning Line Overlay */}
            {isEmergencyActive && <div className="absolute inset-0 bg-rose-500/5 pointer-events-none" />}
          </div>
          <p className="text-[10px] text-[#919fca] mt-2 text-center font-mono">34.0522° N, 118.2437° W • 248m ALT</p>
        </section>

        {/* Squad Status Bars */}
        <section className="space-y-4">
          <h4 className="text-[10px] font-black text-[#919fca] uppercase tracking-[0.2em] mb-1">Squad Status</h4>
          {[
            { name: "Sgt. Miller (LDR)", status: "STABLE", color: "bg-green-500", val: 92 },
            { name: "Cpl. Davis (MED)", status: "STABLE", color: "bg-green-500", val: 88 },
            { name: "Pvt. Chen (COM)", status: "CAUTION", color: "bg-yellow-500", val: 65 }
          ].map(unit => (
            <div key={unit.name} className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-white">{unit.name}</span>
                <span className={unit.color.replace('bg-', 'text-')}>{unit.status}</span>
              </div>
              <div className="w-full h-1 bg-[#1b2136] rounded-full overflow-hidden">
                <div className={`h-full ${unit.color} transition-all duration-1000`} style={{ width: `${unit.val}%` }} />
              </div>
            </div>
          ))}
        </section>

        {/* Signal Strength */}
        <div className="mt-auto p-4 bg-[#1b2136] rounded-xl border border-[#323f67] shadow-inner">
          <p className="text-[10px] font-black text-[#919fca] uppercase tracking-widest mb-3">Signal Strength</p>
          <div className="flex items-end gap-1.5 h-8">
            {[30, 50, 70, 90, 40].map((h, i) => (
              <div key={i} className={`w-2 rounded-t-sm transition-all duration-500 ${i === 4 ? 'bg-[#323f67]' : 'bg-[#0f47f0] shadow-[0_0_10px_rgba(15,71,240,0.4)]'}`} style={{ height: `${h}%` }} />
            ))}
          </div>
          <p className="text-[10px] text-[#0f47f0] font-black mt-3 flex items-center gap-2">
            <Wifi size={12} /> ENCRYPTED L-BAND 80%
          </p>
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan { from { top: -20%; } to { top: 120%; } }
        @keyframes pulse-tactical {
          0% { border-color: rgba(225, 29, 72, 0.3); }
          50% { border-color: rgba(225, 29, 72, 0.7); }
          100% { border-color: rgba(225, 29, 72, 0.3); }
        }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-pulse-tactical { animation: pulse-tactical 2s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default CommunicationHub;