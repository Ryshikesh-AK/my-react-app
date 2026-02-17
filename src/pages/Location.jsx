import React from 'react';
import { User, Activity, ShieldAlert } from 'lucide-react';

const Location = ({ soldiers = [], activeSquadId = 1, embedded = false }) => {
  // If embedded, we might get soldiers/squad info from context, but keeping props for now or assuming context usage if needed.
  // Actually, let's switch to using Context if we want true "embedded" support without passing props down manually from App.
  // But for now, let's just handle the UI hiding.

  // 1. Filter soldiers and ensure we handle empty states gracefully
  const activeSquadUnits = soldiers.filter(s => s.squadId === activeSquadId);

  return (
    <div className={`flex h-screen bg-[#0a0d17] text-slate-300 font-sans overflow-hidden ${embedded ? 'h-full' : ''}`}>

      {/* LEFT SIDEBAR: Unit Overlook - HIDDEN IF EMBEDDED */}
      {!embedded && (
        <aside className="w-80 border-r border-slate-800/50 bg-[#0d111c] flex flex-col shrink-0">
          <header className="p-6 border-b border-slate-800/50">
            <div className="flex items-center gap-2 text-blue-500 mb-1">
              <Activity size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Signal Strength: Nominal</span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">SQUAD LOCATOR</h2>
          </header>

          <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
            <div className="mb-6 flex justify-between items-end">
              <div>
                <h2 className="text-sm font-bold text-slate-400 uppercase">Unit Overlook</h2>
                <p className="text-[10px] text-blue-500/80 uppercase font-black tracking-widest">
                  {activeSquadUnits.length} Operators In-Sector
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {activeSquadUnits.map((unit) => (
                <div
                  key={unit.id}
                  className={`p-4 rounded-lg border transition-all hover:border-blue-500/50 bg-[#151a29] ${unit.status === 'CRITICAL' ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800'
                    }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${unit.name}`}
                          alt="avatar"
                          className="size-8"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white">{unit.name}</h3>
                        <p className="text-[9px] text-blue-400 font-bold uppercase">{unit.rank}</p>
                      </div>
                    </div>
                    {unit.status === 'CRITICAL' && <ShieldAlert size={14} className="text-red-500 animate-pulse" />}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-black/40 p-2 rounded border border-white/5 flex justify-between items-center">
                      <p className="text-[8px] text-slate-500 uppercase font-bold">HR: <span className="text-white">{unit.bpm}</span></p>
                      <div className={`size-1 rounded-full ${unit.bpm > 100 ? 'bg-red-500 animate-ping' : 'bg-green-500'}`} />
                    </div>
                    <div className="bg-black/40 p-2 rounded border border-white/5">
                      <p className="text-[8px] text-slate-500 uppercase font-bold">STATUS:
                        <span className={`ml-1 ${unit.status === 'CRITICAL' ? 'text-red-500' : 'text-green-500'}`}>
                          {unit.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* MAIN MAP AREA */}
      <main className="flex-1 flex flex-col relative bg-[#1c1f26]">
        <div className="flex-1 relative overflow-hidden bg-[#11141b] bg-[radial-gradient(#2d385e_1px,transparent_1px)] [background-size:40px_40px]">

          {/* Map Grid Overlay */}
          <div className="absolute inset-0 opacity-20 pointer-events-none border-[20px] border-[#0a0d17] z-20"></div>

          <div className="absolute inset-0">
            {activeSquadUnits.map((unit, index) => {
              // If you don't have X/Y in DB yet, we use a predictable spread
              const topPos = unit.posY || (30 + (index * 12));
              const leftPos = unit.posX || (40 + (index * 8));

              return (
                <div
                  key={unit.id}
                  style={{ top: `${topPos}%`, left: `${leftPos}%` }}
                  className="absolute transition-all duration-1000"
                >
                  <div className="relative group cursor-pointer">
                    {/* Pulsing effect for Critical status */}
                    {unit.status === 'CRITICAL' && (
                      <div className="absolute inset-0 size-8 bg-red-600 rounded-full animate-ping opacity-75"></div>
                    )}

                    <div className={`size-8 rounded-full border-2 border-white flex items-center justify-center text-white shadow-2xl relative z-10 transition-colors ${unit.status === 'CRITICAL' ? 'bg-red-600' : 'bg-blue-600'
                      }`}>
                      <User size={14} fill="currentColor" />
                    </div>

                    {/* Label Tag */}
                    <div className="bg-[#0d111c] border border-slate-700 text-[9px] font-black px-2 py-1 rounded absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-xl">
                      <span className="text-slate-500 mr-1">{unit.rank}</span>
                      <span className="text-white">{unit.name}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Map Coordinates UI */}
          <div className="absolute bottom-6 right-6 p-4 bg-black/60 border border-white/10 rounded backdrop-blur-md">
            <p className="text-[10px] font-mono text-blue-400">LAT: 34.0522° N</p>
            <p className="text-[10px] font-mono text-blue-400">LNG: 118.2437° W</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Location;