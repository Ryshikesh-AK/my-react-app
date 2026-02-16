// Accept 'soldiers' and 'activeSquadId' as props
const Location = ({ soldiers = [], activeSquadId }) => {
  
  // 1. Filter soldiers to only show those in the selected squad
  const activeSquadUnits = soldiers.filter(s => s.squadId === activeSquadId);

  return (
    <div className="flex h-screen bg-[#0a0d17] text-slate-300 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-80 border-r border-slate-800/50 bg-[#0d111c] flex flex-col shrink-0">
        {/* ... Header stays same ... */}

        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white tracking-tight">Unit Overlook</h2>
            {/* Dynamic count based on filtered list */}
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">
              {activeSquadUnits.length} Operators Active
            </p>
          </div>

          <div className="space-y-3">
            {activeSquadUnits.map((unit, index) => (
              <div 
                key={unit.id}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  index === 0 ? 'bg-blue-600/10 border-blue-500/50' : 'bg-[#151a29] border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded flex items-center justify-center text-[10px] font-black border bg-slate-800 border-slate-700 text-slate-400">
                      {/* Short ID or Initial */}
                      {unit.name.substring(0, 3).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{unit.name}</h3>
                      <p className="text-[9px] text-blue-400 font-bold uppercase">{unit.rank}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <p className="text-[8px] text-slate-500 uppercase font-bold">HR: <span className="text-white">{unit.bpm} BPM</span></p>
                  </div>
                  <div className="bg-black/20 p-2 rounded border border-white/5">
                    <p className="text-[8px] text-slate-500 uppercase font-bold">STATUS: <span className="text-white">{unit.status}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* MAIN MAP AREA */}
      <main className="flex-1 flex flex-col relative bg-[#1c1f26]">
        {/* ... Header and Search ... */}

        <div className="flex-1 relative overflow-hidden bg-slate-400">
          <div className="absolute inset-0">
             {/* Map Markers for your Added Soldiers */}
             {activeSquadUnits.map((unit, index) => (
               <div 
                key={unit.id}
                style={{ 
                    top: `${40 + (index * 15)}%`, 
                    left: `${45 + (index * 10)}%` 
                }} 
                className="absolute"
               >
                  <div className="relative group cursor-pointer">
                    <div className="size-8 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center text-white shadow-2xl relative z-10">
                      <User size={14} fill="currentColor" />
                    </div>
                    <div className="bg-[#0d111c] text-[9px] font-black px-2 py-1 rounded absolute top-full mt-1 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      {unit.name}
                    </div>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </main>
    </div>
  );
};
export default Location;