import React, { useState, useEffect } from 'react';
import { User, Activity, ShieldAlert } from 'lucide-react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps";
import { useOutletContext } from 'react-router-dom';
import { useMission } from '../context/MissionContext';

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const Location = ({ embedded = false }) => {
  const context = useOutletContext();
  const soldier = context?.soldier;
  const { soldiers, squads } = useMission();

  const activeSquadId = soldier ? soldier.squadId : 1;
  const activeSquadUnits = soldiers.filter(s => s.squadId === activeSquadId);
  const activeSquad = squads.find(s => s.id === activeSquadId);

  const centerCoords = soldier?.coordinates || activeSquad?.coordinates || [0, 0];
  const [mapPosition, setMapPosition] = useState({ coordinates: centerCoords, zoom: 14 });

  // Update map if the selected soldier changes
  useEffect(() => {
    if (soldier?.coordinates) {
      setMapPosition({ coordinates: soldier.coordinates, zoom: 16 });
    }
  }, [soldier?.coordinates]);

  const handleMoveEnd = (position) => setMapPosition(position);

  // Scaling logic to make markers physically scale visually
  const visualGrowth = Math.pow(mapPosition.zoom, 0.5);
  const scale = visualGrowth / mapPosition.zoom;
  const textScale = Math.pow(mapPosition.zoom, 0.3) / mapPosition.zoom;

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
                     <h3 className="text-sm font-bold text-white">{unit.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* MAIN MAP AREA */}
      <main className="flex-1 flex flex-col relative bg-[#02040a]">
        <div className="absolute inset-0 z-0 bg-[#02040a]">
          <ComposableMap projectionConfig={{ scale: 220 }} className="w-full h-full opacity-100 cursor-move">
            <ZoomableGroup 
              center={mapPosition.coordinates} 
              zoom={mapPosition.zoom} 
              onMoveEnd={handleMoveEnd}
              minZoom={1} 
              maxZoom={24}
            >
              <Geographies geography={geoUrl}>
                {({ geographies }) => geographies.map((geo) => (
                  <Geography key={geo.rsmKey} geography={geo} fill="#1e293b" stroke="#334155" strokeWidth={0.5} style={{ default: { outline: "none" }, hover: { outline: "none" }, pressed: { outline: "none" } }} />
                ))}
              </Geographies>

              {/* SQUAD CENTER MARKER */}
              {activeSquad?.coordinates && (
                <Marker coordinates={activeSquad.coordinates} className="pointer-events-none">
                   <circle r={3 * scale} fill="#3b82f6" className="opacity-40" />
                   <circle r={10 * scale} fill="none" stroke="#3b82f6" strokeWidth={1 * scale} className="opacity-20 border-dashed" />
                </Marker>
              )}

              {/* OPERATIVE MARKERS */}
              {activeSquadUnits.map(unit => {
                if (!unit.coordinates) return null;
                const isSelected = unit.id === soldier?.id;
                // Highlight yellow/gold if selected, red if critical, blue otherwise
                const color = unit.status === 'CRITICAL' ? '#ef4444' : (isSelected ? '#facc15' : '#60a5fa');
                
                return (
                  <Marker key={unit.id} coordinates={unit.coordinates} className="group">
                    <polygon 
                      points={`0,-${1.5 * scale} ${1.2 * scale},${1.2 * scale} -${1.2 * scale},${1.2 * scale}`} 
                      fill={color} 
                      className={isSelected || unit.status === 'CRITICAL' ? 'animate-pulse' : ''} 
                    />
                    
                    {/* Ring highlight for the selected person */}
                    {isSelected && (
                       <circle r={4 * scale} fill="none" stroke={color} strokeWidth={0.5 * scale} className="animate-ping" />
                    )}
                    
                    {/* Hit area */}
                    <circle r={4 * scale} fill="transparent" />
                    
                    <text
                       textAnchor="middle"
                       y={-(2.5 * scale)}
                       style={{ fontFamily: "monospace", fill: color, fontSize: `${2.5 * textScale}px` }}
                       className={isSelected ? "font-bold" : "opacity-0 group-hover:opacity-100 transition-opacity"}
                    >
                       {isSelected ? `[ TARGET: ${unit.name} ]` : unit.name}
                    </text>
                  </Marker>
                );
              })}
            </ZoomableGroup>
          </ComposableMap>
        </div>

        {/* Map Coordinates UI */}
        <div className="absolute bottom-6 right-6 p-4 bg-black/60 border border-[#1a2238] rounded shadow-2xl backdrop-blur-md pointer-events-none z-10 w-48">
          <div className="flex items-center gap-2 border-b border-[#1a2238] pb-2 mb-2">
            <div className="size-1.5 bg-yellow-400 rounded animate-pulse" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Target Config</h3>
          </div>
          <p className="text-[10px] font-mono text-blue-400 mb-1">LAT: {mapPosition.coordinates[1].toFixed(4)}°</p>
          <p className="text-[10px] font-mono text-blue-400 mb-1">LNG: {mapPosition.coordinates[0].toFixed(4)}°</p>
          <p className="text-[10px] font-mono text-slate-500 mt-2">ZOOM: {Math.round(mapPosition.zoom)}x</p>
        </div>
      </main>
    </div>
  );
};

export default Location;