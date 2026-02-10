import React from 'react';
import { 
  Shield, MapPin, Navigation, Target, Radio, 
  Layers, Thermometer, Signal, Search, Plus, 
  Minus, Crosshair, ChevronLeft, Settings,
  LogOut, Bell, User
} from 'lucide-react';

const Location = () => {
  // Mock data for tracked units based on your image
  const units = [
    { id: 'G-1', callsign: 'Ghost-1', role: 'DESIGNATED LEAD', hr: 85, spd: 6.2, dist: '340m', active: true },
    { id: 'B-4', callsign: 'Bravo-4', hr: 72, dist: '410m', active: false },
    { id: 'V-2', callsign: 'Viper-2', hr: 94, dist: '385m', active: false },
  ];

  return (
    <div className="flex h-screen bg-[#0a0d17] text-slate-300 font-sans overflow-hidden">
      
      {/* 1. LEFT SIDEBAR - UNIT OVERLOOK */}
      <aside className="w-80 border-r border-slate-800/50 bg-[#0d111c] flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800/50 flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-sm">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">Mission Control <span className="text-blue-500 font-black italic">v2.4</span></h1>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Unit Overlook</h2>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">6 Operators Active | Sector 7-G</p>
          </div>

          <div className="space-y-3">
            {units.map((unit) => (
              <div 
                key={unit.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  unit.active 
                  ? 'bg-blue-600/10 border-blue-500/50 ring-1 ring-blue-500/20' 
                  : 'bg-[#151a29] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`size-10 rounded flex items-center justify-center text-xs font-black border ${
                      unit.active ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      {unit.id}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{unit.callsign}</h3>
                      {unit.role && <p className="text-[9px] text-blue-400 font-bold tracking-tighter uppercase">{unit.role}</p>}
                    </div>
                  </div>
                  {unit.active && <Crosshair size={16} className="text-blue-500 animate-pulse" />}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <p className="text-[8px] text-slate-500 uppercase font-bold">HR: <span className="text-white">{unit.hr} BPM</span></p>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <p className="text-[8px] text-slate-500 uppercase font-bold">
                      {unit.spd ? `SPD: ${unit.spd} KM/H` : `DIST: ${unit.dist}`}
                    </p>
                  </div>
                </div>
                {unit.active && <p className="text-[9px] text-slate-500 mt-2 font-medium italic">{unit.dist} to Extraction Point</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-[#0a0d17] border-t border-slate-800/50">
          <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800/40 hover:bg-slate-800 rounded-md text-xs font-bold transition-all border border-slate-700/50">
            <Settings size={14} /> Tactical Settings
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT - MAP VIEW */}
      <main className="flex-1 flex flex-col relative bg-[#1c1f26]">
        
        {/* TOP NAVBAR OVERLAY */}
        <header className="h-16 flex items-center justify-between px-8 bg-[#0d111c]/80 backdrop-blur-md border-b border-slate-800/50 z-20">
          <div className="flex items-center gap-6">
            <div className="flex bg-black/40 p-1 rounded-md border border-slate-800">
              <button className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase rounded shadow-lg shadow-blue-600/20">
                <Target size={14} /> Satellite View
              </button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Terrain</button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Thermal</button>
              <button className="px-4 py-1.5 text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Signals</button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded flex items-center gap-2">
              <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase text-emerald-500 tracking-widest">Uplink Stable: 42ms</span>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase rounded shadow-lg transition-all">
              <Navigation size={14} /> Request Extraction
            </button>
            <div className="flex gap-2 ml-2">
              <button className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-md hover:bg-rose-500/20 transition-all">
                <Bell size={18} />
              </button>
              <img src="https://i.pravatar.cc/100?u=commander" className="size-9 rounded border border-blue-500/50 p-0.5" alt="User" />
            </div>
          </div>
        </header>

        {/* INTERACTIVE MAP AREA */}
        <div className="flex-1 relative overflow-hidden bg-slate-400">
          {/* Mock Map Background (You would typically use Leaflet/Mapbox here) */}
          <div className="absolute inset-0 grayscale contrast-125 opacity-40 mix-blend-multiply" 
               style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
          
          {/* Search Overlay */}
          <div className="absolute top-6 left-6 z-10 w-72">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                className="w-full bg-[#151a29]/95 backdrop-blur-md border border-slate-700 rounded-md py-2.5 pl-10 pr-4 text-xs focus:ring-1 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-600 shadow-2xl" 
                placeholder="Search coordinates or callsigns..." 
              />
            </div>
          </div>

          {/* Map Tracking Markers (Visual representation from image) */}
          <div className="absolute inset-0">
            {/* Objective A */}
            <div className="absolute top-1/3 right-1/4 -translate-y-12 flex flex-col items-center gap-1 group cursor-pointer">
              <div className="bg-rose-600 text-[10px] font-black px-2 py-0.5 rounded-sm shadow-lg text-white group-hover:bg-rose-500 transition-colors uppercase tracking-widest">Objective A</div>
              <MapPin className="text-rose-600 drop-shadow-lg" size={32} fill="currentColor" fillOpacity={0.2} />
            </div>

            {/* Ghost-1 (Selected Target) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="absolute inset-0 size-12 bg-blue-500/20 rounded-full animate-ping" />
                <div className="size-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-2xl relative z-10">
                  <User size={14} fill="currentColor" />
                </div>
                
                {/* Target Information Popup */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-40 bg-[#0d111c]/95 backdrop-blur-md border border-blue-500/50 rounded p-3 shadow-2xl z-20">
                  <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">Ghost-1 (Target)</h4>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between items-center border-b border-white/5 pb-1">
                      <span className="text-[8px] text-slate-500 uppercase">Heart Rate</span>
                      <span className="text-[10px] font-black text-emerald-500 italic">85 BPM</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] text-slate-500 uppercase">Oxygen</span>
                      <span className="text-[10px] font-black text-white">98%</span>
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
                      <div className="h-full bg-blue-600 w-[98%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Other Unit Markers */}
            <div className="absolute top-1/2 right-1/3 bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-[9px] font-black text-white flex items-center gap-1.5 shadow-xl">
              <div className="size-1.5 bg-white rounded-full" /> B-4
            </div>
            <div className="absolute bottom-1/4 left-2/3 bg-white/10 backdrop-blur-sm border border-white/20 px-2 py-1 rounded text-[9px] font-black text-white flex items-center gap-1.5 shadow-xl">
              <div className="size-1.5 bg-white rounded-full" /> V-2
            </div>
          </div>

          {/* Map Controls (Right) */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
            <button className="p-2.5 bg-[#151a29] border border-slate-700 text-slate-400 hover:text-white rounded shadow-xl"><Plus size={20} /></button>
            <button className="p-2.5 bg-[#151a29] border border-slate-700 text-slate-400 hover:text-white rounded shadow-xl border-t-0"><Minus size={20} /></button>
            <button className="mt-2 p-2.5 bg-[#151a29] border border-slate-700 text-slate-400 hover:text-blue-500 rounded shadow-xl"><Navigation size={20} /></button>
          </div>

          {/* Map Bottom Stats Overlay */}
          <div className="absolute bottom-6 left-6 z-10 flex gap-4">
            <div className="bg-[#151a29]/90 backdrop-blur-md border border-slate-700 p-4 rounded-lg flex gap-8 shadow-2xl">
              <div>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Local Time</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-white tabular-nums tracking-tighter">14:22:08</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Zulu</span>
                </div>
              </div>
              <div className="border-l border-slate-800 pl-8">
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Wind Speed</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-white tabular-nums tracking-tighter">12</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase">Kts / Ne</span>
                </div>
              </div>
              <div className="border-l border-slate-800 pl-8">
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Visibility</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-white tabular-nums tracking-tighter">8.4</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">KM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Location;