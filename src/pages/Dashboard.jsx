import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import OperativeModal from './OperativeModal';
import firebaseService from '../Service/FirebaseService';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/* ---------------- Operative Card ---------------- */
const OperativeCard = ({ soldier, onClick, onEdit, onDelete }) => {
  const isCritical = soldier.status === 'CRITICAL';
  return (
    <div
      onClick={onClick}
      className={`bg-[#0a0f1e]/90 backdrop-blur-md border p-3 transition-all cursor-pointer group rounded ${
        isCritical ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)] animate-pulse' : 'border-[#1a2238] hover:border-blue-500/50'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
           <div className={`size-1.5 rounded-full ${isCritical ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-blue-400'}`}></div>
           <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-300">{soldier.name}</span>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span onClick={(e) => { e.stopPropagation(); onEdit(); }} className="material-symbols-outlined text-[14px] hover:text-blue-400">edit</span>
          <span onClick={(e) => { e.stopPropagation(); onDelete(); }} className="material-symbols-outlined text-[14px] hover:text-red-500">delete</span>
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-[8px] text-[#4a5578] uppercase font-black">{soldier.rank}</p>
          <p className="text-xl font-mono font-bold text-white leading-none">{soldier.bpm}<span className="text-[9px] ml-1 text-blue-500 font-normal">BPM</span></p>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Dashboard ---------------- */
export default function Dashboard() {
  const navigate = useNavigate();
  const [squads, setSquads] = useState([]); 
  const [soldiers, setSoldiers] = useState([]);
  const [activeSquadId, setActiveSquadId] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    const unsubSquads = firebaseService.subscribeToSquads(setSquads);
    const unsubSoldiers = firebaseService.subscribeToSoldiers(setSoldiers);
    return () => { clearInterval(timer); unsubSquads(); unsubSoldiers(); };
  }, []);

  const filteredSoldiers = soldiers.filter(s => s.squadId === activeSquadId);
  const criticalCount = filteredSoldiers.filter(s => s.status === 'CRITICAL').length;

  /* -------- SQUAD CRUD FUNCTIONS -------- */
  const handleAddSquad = async () => {
    const name = prompt("Enter new squad name:");
    if (name && name.trim() !== "") {
      try {
        await firebaseService.addSquad(name);
      } catch (error) {
        console.error("Uplink Failure:", error);
      }
    }
  };

  const handleEditSquad = async (id, currentName) => {
    const newName = prompt("Rename Squad Asset:", currentName);
    if (newName && newName.trim() !== "" && newName !== currentName) {
      try {
        await firebaseService.updateSquad(id, newName);
      } catch (error) {
        console.error("Update Failure:", error);
      }
    }
  };

  const handleDeleteSquad = async (id) => {
    if(window.confirm("CONFIRM DECOMMISSION: Permanently delete this squad and all associated data?")) {
      try {
        await firebaseService.deleteSquad(id);
        if (activeSquadId === id) setActiveSquadId(null);
      } catch (error) {
        console.error("Deletion Failure:", error);
      }
    }
  };

  /* -------- OPERATIVE FUNCTIONS -------- */
  const handleAddAgent = async (formData) => {
    if (!activeSquadId) return alert("Select squad.");
    try {
      await firebaseService.addOperative(activeSquadId, formData);
      setIsModalOpen(false);
    } catch (error) { console.error(error); }
  };

  const handleCardClick = (soldier) => navigate('/Card', { state: { soldier } });

  return (
    <div className="flex h-screen bg-[#02040a] text-white font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#050810] border-r border-[#1a2238] flex flex-col relative z-20 shadow-2xl">
        <div className="p-6 border-b border-[#1a2238] bg-[#080b14]">
          <h1 className="text-sm font-black tracking-[0.3em] text-blue-500 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">radar</span> COMMAND CENTER
          </h1>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {squads.map((squad) => {
            const count = soldiers.filter(s => s.squadId === squad.id).length;
            return (
              <div
                key={squad.id}
                onClick={() => setActiveSquadId(squad.id)}
                className={`group w-full p-3 rounded flex justify-between items-center cursor-pointer border transition-all ${
                  activeSquadId === squad.id 
                  ? 'bg-blue-600/20 border-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.1)]' 
                  : 'bg-transparent border-transparent hover:bg-[#0d1117] hover:border-[#1a2238]'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${activeSquadId === squad.id ? 'text-blue-400' : 'text-[#4a5578]'}`}>
                    {squad.name}
                  </span>
                  <span className="text-[8px] text-[#4a5578] font-bold">{count} UNITS ACTIVE</span>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span 
                    onClick={(e) => { e.stopPropagation(); handleEditSquad(squad.id, squad.name); }} 
                    className="material-symbols-outlined text-[16px] text-[#4a5578] hover:text-blue-400"
                  >
                    edit
                  </span>
                  <span 
                    onClick={(e) => { e.stopPropagation(); handleDeleteSquad(squad.id); }} 
                    className="material-symbols-outlined text-[16px] text-[#4a5578] hover:text-red-500"
                  >
                    delete
                  </span>
                </div>
              </div>
            );
          })}

          <button
            onClick={handleAddSquad}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1a2238] p-3 rounded text-[9px] font-black uppercase text-[#4a5578] hover:border-blue-500 hover:text-white transition-all mt-4"
          >
            <span className="material-symbols-outlined text-sm">add</span> Initialize New Squad
          </button>
        </nav>

        <div className="p-6 border-t border-[#1a2238] bg-[#02040a]">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-1.5 bg-red-600 rounded-full animate-ping"></div>
            <span className="text-[9px] font-black text-red-500 tracking-widest">LIVE_SIGNAL</span>
          </div>
          <p className="text-2xl font-mono font-light text-white leading-tight">
            {currentTime.toLocaleTimeString([], { hour12: false })}
          </p>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 relative flex flex-col overflow-hidden">
        
        {/* WORLD MAP LAYER */}
        <div className="absolute inset-0 z-0 pointer-events-none bg-[#02040a]">
          <ComposableMap projectionConfig={{ scale: 220 }} className="w-full h-full opacity-20">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} fill="#1e293b" stroke="#334155" strokeWidth={0.5} style={{ default: { outline: "none" } }} />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>

        {/* HEADER */}
        <header className="h-16 border-b border-[#1a2238] flex items-center justify-between px-8 relative z-10 bg-[#02040a]/40 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-blue-500 tracking-widest uppercase">Target_Sector:</span>
            <span className="text-xs font-bold text-white uppercase tracking-widest">
                {squads.find(s => s.id === activeSquadId)?.name || "Awaiting Uplink"}
            </span>
          </div>
          <button 
            disabled={!activeSquadId}
            onClick={() => setIsModalOpen(true)} 
            className={`${!activeSquadId ? 'bg-gray-800 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-500'} px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all`}
          >
            Deploy Unit
          </button>
        </header>

        {/* OPERATIVES GRID */}
        <div className="flex-1 p-8 relative z-10 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredSoldiers.map(s => (
              <OperativeCard 
                key={s.id} 
                soldier={s} 
                onClick={() => handleCardClick(s)} 
                onEdit={() => alert('Edit Operative Modal coming soon')} 
                onDelete={() => firebaseService.deleteOperative(s.id)} 
              />
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="h-10 bg-[#050810] border-t border-[#1a2238] flex items-center px-8 text-[9px] font-bold gap-10 relative z-10">
           <div className="flex items-center gap-2"><span className="text-blue-500 tracking-tighter">TOTAL_UNITS:</span> <span className="text-white font-mono">{filteredSoldiers.length}</span></div>
           <div className="flex items-center gap-2"><span className="text-blue-500 tracking-tighter">ALERT_COUNT:</span> <span className={criticalCount > 0 ? 'text-red-500 animate-pulse' : 'text-green-500'}>{criticalCount}</span></div>
        </footer>
      </main>

      <OperativeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddAgent={handleAddAgent} />
    </div>
  );
}