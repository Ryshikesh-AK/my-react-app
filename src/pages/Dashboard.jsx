import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import OperativeModal from './OperativeModal';
import SquadModal from './SquadModal';
import { useMission } from '../context/MissionContext';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

/* ---------------- Operative Card ---------------- */
const OperativeCard = ({ soldier, onClick, onEdit, onDelete }) => {
  const isCritical = soldier.status === 'CRITICAL';
  return (
    <div
      onClick={onClick}
      className={`bg-[#0a0f1e]/90 backdrop-blur-md border p-3 transition-all cursor-pointer group rounded ${isCritical ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)] animate-pulse' : 'border-[#1a2238] hover:border-blue-500/50'
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
      <div className="flex justify-between items-end mt-2">
        <div>
          <p className="text-[8px] text-[#4a5578] uppercase font-black">{soldier.rank}</p>
          <p className="text-xl font-mono font-bold text-white leading-none tracking-tighter">{soldier.bpm}<span className="text-[9px] ml-1 text-blue-500 font-normal tracking-normal">BPM</span></p>
        </div>
        <div className="text-[9px] font-mono font-bold text-blue-400 border border-blue-500/30 px-2 py-1 rounded bg-blue-500/10 tracking-widest uppercase shadow-[0_0_10px_rgba(59,130,246,0.2)]">
          ID:{soldier.serviceId}
        </div>
      </div>
    </div>
  );
};

/* ---------------- Dashboard ---------------- */
export default function Dashboard() {
  const navigate = useNavigate();
  // Destructure updateOperative from your context
  const { squads, soldiers, addSquad, updateSquad, deleteSquad, addOperative, deleteOperative, updateOperative } = useMission();

  const [activeSquadId, setActiveSquadId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSoldier, setEditingSoldier] = useState(null); // TRACKS CURRENT EDIT TARGET
  const [isSquadModalOpen, setIsSquadModalOpen] = useState(false);
  const [editingSquad, setEditingSquad] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [mapPosition, setMapPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  const handleZoomIn = () => {
    if (mapPosition.zoom >= 20) return;
    setMapPosition(pos => ({ ...pos, zoom: Math.min(pos.zoom * 1.5, 20) }));
  };

  const handleZoomOut = () => {
    if (mapPosition.zoom <= 1) return;
    setMapPosition(pos => ({ ...pos, zoom: Math.max(pos.zoom / 1.5, 1) }));
  };

  const handleResetZoom = () => {
    setMapPosition({ coordinates: [0, 0], zoom: 1 });
  };

  const handleMoveEnd = (position) => {
    setMapPosition(position);
  };


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

// PASTE THE NEW AUTO-ZOOM EFFECT HERE:
  useEffect(() => {
    if (activeSquadId) {
      const activeSquad = squads.find(s => s.id === activeSquadId);
      if (activeSquad && activeSquad.coordinates) {
        setMapPosition({
          coordinates: activeSquad.coordinates,
          zoom: 12 
        });
      }
    }
  }, [activeSquadId, squads]);

  const filteredSoldiers = soldiers.filter(s => s.squadId === activeSquadId);
  const criticalCount = filteredSoldiers.filter(s => s.status === 'CRITICAL').length;

  /* -------- SQUAD CRUD FUNCTIONS -------- */
  const handleAddSquadClick = () => {
    setEditingSquad(null);
    setIsSquadModalOpen(true);
  };

  const handleEditSquadClick = (squad) => {
    setEditingSquad(squad);
    setIsSquadModalOpen(true);
  };

  const handleSaveSquad = async (squadData) => {
    try {
      if (editingSquad) {
        await updateSquad(editingSquad.id, squadData);
      } else {
        await addSquad(squadData);
      }
      setIsSquadModalOpen(false);
      setEditingSquad(null);
    } catch (error) {
      console.error("Squad Save Failure:", error);
    }
  };

  const handleDeleteSquad = async (id) => {
    if (window.confirm("CONFIRM DECOMMISSION?")) {
      try {
        await deleteSquad(id);
        if (activeSquadId === id) setActiveSquadId(null);
      } catch (error) { console.error("Deletion Failure:", error); }
    }
  };

  /* -------- OPERATIVE FUNCTIONS -------- */

  // Open modal for NEW agent
  const handleOpenDeployModal = () => {
    setEditingSoldier(null);
    setIsModalOpen(true);
  };

  // Open modal to EDIT existing agent
  const handleOpenEditModal = (soldier) => {
    setEditingSoldier(soldier);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSoldier(null);
  };

  // Unified Save function (Handles both ADD and UPDATE)
  const handleSaveOperative = async (formData) => {
    try {
      if (editingSoldier) {
        // Use updateOperative from context
        await updateOperative(editingSoldier.id, formData);
      } else {
        if (!activeSquadId) return alert("Select squad.");
        const squad = squads.find(s => s.id === activeSquadId);
        const squadName = squad ? squad.name : '';
        
        // 10km to 20km true radial offset mapping
        let opCoords = null;
        if (squad?.coordinates) {
          const angle = Math.random() * Math.PI * 2;
          const minRadiusDeg = 10 / 111; // 10km in degrees
          const maxRadiusDeg = 20 / 111; // 20km in degrees
          const radiusDeg = minRadiusDeg + Math.random() * (maxRadiusDeg - minRadiusDeg);
          
          // Longitude scale correction based on Earth's curvature at given Latitude
          const latRad = squad.coordinates[1] * (Math.PI / 180);
          const lonScale = 1 / Math.abs(Math.cos(latRad));
          
          opCoords = [
             squad.coordinates[0] + (Math.cos(angle) * radiusDeg * lonScale), // Longitude
             squad.coordinates[1] + (Math.sin(angle) * radiusDeg)             // Latitude
          ];
        }

        await addOperative(activeSquadId, squadName, { ...formData, coordinates: opCoords });
      }
      handleCloseModal();
    } catch (error) {
      console.error("Operative Sync Error:", error);
    }
  };

  const handleCardClick = (soldier) => navigate(`/operative/${soldier.id}/vitals`);

  return (
    <div className="flex h-screen bg-[#02040a] text-white font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-72 bg-[#050810] border-r border-[#1a2238] flex flex-col relative z-20 shadow-2xl">
        <div 
          onClick={() => {
            setActiveSquadId(null);
            setMapPosition({ coordinates: [0, 0], zoom: 1 });
          }}
          className="p-6 border-b border-[#1a2238] bg-[#080b14] cursor-pointer hover:bg-[#0a0f1e] transition-colors"
          title="Return to Global View"
        >
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
                className={`group w-full p-3 rounded flex justify-between items-center cursor-pointer border transition-all ${activeSquadId === squad.id
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
                  <span onClick={(e) => { e.stopPropagation(); handleEditSquadClick(squad); }} className="material-symbols-outlined text-[16px] text-[#4a5578] hover:text-blue-400">edit</span>
                  <span onClick={(e) => { e.stopPropagation(); handleDeleteSquad(squad.id); }} className="material-symbols-outlined text-[16px] text-[#4a5578] hover:text-red-500">delete</span>
                </div>
              </div>
            );
          })}
          <button onClick={handleAddSquadClick} className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#1a2238] p-3 rounded text-[9px] font-black uppercase text-[#4a5578] hover:border-blue-500 hover:text-white transition-all mt-4">
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
        <div className="absolute inset-0 z-0 bg-[#02040a]">
          <ComposableMap projectionConfig={{ scale: 220 }} className="w-full h-full opacity-100 cursor-move">
            <ZoomableGroup 
              center={mapPosition.coordinates} 
              zoom={mapPosition.zoom} 
              onMoveEnd={handleMoveEnd}
              minZoom={1} 
              maxZoom={20}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} fill="#1e293b" stroke="#334155" strokeWidth={0.5} style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }} />
                ))}
              </Geographies>
              {squads.map(squad => {
                const isActive = activeSquadId === squad.id;
                const mainColor = isActive ? "#22c55e" : "#3b82f6"; // Green if active, Blue otherwise
                const textColor = isActive ? "#4ade80" : "#93c5fd";
                
                // Allow markers to visually zoom up to ~3.5x size at max zoom
                const visualGrowth = Math.pow(mapPosition.zoom, 0.5); 
                const scale = visualGrowth / mapPosition.zoom;
                const textScale = Math.pow(mapPosition.zoom, 0.3) / mapPosition.zoom; // Text grows slightly slower

                return squad.coordinates ? (
                  <Marker 
                    key={squad.id} 
                    coordinates={squad.coordinates}
                    onClick={() => setActiveSquadId(squad.id)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                  >
                     <circle r={3 * scale} fill={mainColor} className={isActive ? "" : "animate-pulse"} />
                     <circle r={(isActive ? 16 : 10) * scale} fill="none" stroke={mainColor} strokeWidth={1 * scale} className="animate-ping" />
                     <text
                       textAnchor="middle"
                       y={-( (isActive ? 14 : 9) * scale )}
                       style={{ fontFamily: "monospace", fill: textColor, fontSize: `${5 * textScale}px`, fontWeight: "bold" }}
                     >
                       <tspan x="0" dy="0">{squad.name}</tspan>
                       {mapPosition.zoom > 5 && squad.location && (
                         <tspan x="0" dy={`${6 * textScale}px`} fill="#64748b" fontSize={`${3.5 * textScale}px`} fontWeight="normal" className="tracking-widest">
                           {squad.location.toUpperCase()}
                         </tspan>
                       )}
                     </text>
                  </Marker>
                ) : null;
              })}
              
              {/* RENDER OPERATIVES FOR ACTIVE SQUAD */}
              {activeSquadId && filteredSoldiers.map(soldier => {
                const visualGrowth = Math.pow(mapPosition.zoom, 0.5);
                const scale = visualGrowth / mapPosition.zoom;
                const textScale = Math.pow(mapPosition.zoom, 0.3) / mapPosition.zoom;
                
                return soldier.coordinates ? (
                  <Marker key={soldier.id} coordinates={soldier.coordinates} onClick={() => handleCardClick(soldier)} className="cursor-pointer hover:opacity-80 transition-opacity group">
                    {/* Tactical Triangle Style for Operatives */}
                    <polygon 
                      points={`0,-${1.5 * scale} ${1.2 * scale},${1.2 * scale} -${1.2 * scale},${1.2 * scale}`} 
                      fill={soldier.status === 'CRITICAL' ? '#ef4444' : '#60a5fa'} 
                      className={soldier.status === 'CRITICAL' ? 'animate-pulse' : ''} 
                    />
                    {/* Hidden hit-area for easier clicking */}
                    <circle r={4 * scale} fill="transparent" />
                    <text
                       textAnchor="middle"
                       y={-(2.5 * scale)}
                       style={{ fontFamily: "monospace", fill: soldier.status === 'CRITICAL' ? '#fca5a5' : '#bfdbfe', fontSize: `${2.5 * textScale}px` }}
                       className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                       {soldier.name}
                    </text>
                  </Marker>
                ) : null;
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* MAP CONTROLS */}
        <div className="absolute bottom-16 right-8 z-20 flex flex-col gap-2 pointer-events-auto">
          <button onClick={handleZoomIn} title="Zoom In" className="bg-[#1a2238]/80 hover:bg-blue-600 border border-[#2a3248] p-2 rounded shadow-lg backdrop-blur text-white flex items-center justify-center transition-all group">
            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">add</span>
          </button>
          <button onClick={handleZoomOut} title="Zoom Out" className="bg-[#1a2238]/80 hover:bg-blue-600 border border-[#2a3248] p-2 rounded shadow-lg backdrop-blur text-white flex items-center justify-center transition-all group">
            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">remove</span>
          </button>
          <button onClick={handleResetZoom} title="Reset View" className="bg-[#1a2238]/80 hover:bg-red-600 border border-[#2a3248] p-2 rounded shadow-lg backdrop-blur text-white flex items-center justify-center transition-all group mt-2">
            <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">fit_screen</span>
          </button>
        </div>

        <header className="h-16 border-b border-[#1a2238] flex items-center justify-between px-8 relative z-10 bg-[#02040a]/40 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-blue-500 tracking-widest uppercase">Target_Sector:</span>
            <span className="text-xs font-bold text-white uppercase tracking-widest">
              {squads.find(s => s.id === activeSquadId)?.name || "Awaiting Uplink"}
            </span>
          </div>
          <button
            disabled={!activeSquadId}
            onClick={handleOpenDeployModal}
            className={`${!activeSquadId ? 'bg-gray-800 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-500'} px-6 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest transition-all`}
          >
            Deploy Unit
          </button>
        </header>

        <div className="flex-1 p-8 relative z-10 overflow-y-auto pointer-events-none">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pointer-events-auto">
            {filteredSoldiers.map(s => (
              <OperativeCard
                key={s.id}
                soldier={s}
                onClick={() => handleCardClick(s)}
                onEdit={() => handleOpenEditModal(s)} // CONNECTED TO EDIT MODAL
                onDelete={() => deleteOperative(s.id)}
              />
            ))}
          </div>
        </div>

        <footer className="h-10 bg-[#050810] border-t border-[#1a2238] flex items-center px-8 text-[9px] font-bold gap-10 relative z-10">
          <div className="flex items-center gap-2"><span className="text-blue-500 tracking-tighter">TOTAL_UNITS:</span> <span className="text-white font-mono">{filteredSoldiers.length}</span></div>
          <div className="flex items-center gap-2"><span className="text-blue-500 tracking-tighter">ALERT_COUNT:</span> <span className={criticalCount > 0 ? 'text-red-500 animate-pulse' : 'text-green-500'}>{criticalCount}</span></div>
        </footer>
      </main>

      {/* MODAL HANDLES BOTH ADD AND EDIT */}
      <OperativeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddAgent={handleSaveOperative}
        initialData={editingSoldier} // PASS DATA TO MODAL
      />

      <SquadModal 
        isOpen={isSquadModalOpen}
        onClose={() => { setIsSquadModalOpen(false); setEditingSquad(null); }}
        onSave={handleSaveSquad}
        initialData={editingSquad}
      />
    </div>
  );
}