import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OperativeModal from './OperativeModal';
import firebaseService from '../Service/FirebaseService';

/* ---------------- Top Stat Card ---------------- */
const TopStatCard = ({ label, value, icon, colorClass, statusIcon }) => (
  <div className="flex-1 min-w-[200px] bg-[#1a2036] border border-[#2d385e] rounded-xl p-5">
    <p className="text-[#919fca] text-xs font-bold uppercase tracking-wider">{label}</p>
    <div className="flex items-end justify-between mt-2">
      <h3 className={`text-3xl font-bold tracking-tight ${colorClass || 'text-white'}`}>
        {value}
      </h3>
      <span className={`material-symbols-outlined ${statusIcon ? 'text-tactical-green' : 'text-[#3b4b7a]'}`}>
        {icon}
      </span>
    </div>
  </div>
);

/* ---------------- Operative Card ---------------- */
const OperativeCard = ({ soldier, onClick, onEdit, onDelete }) => {
  const isCritical = soldier.status === 'CRITICAL';
  const isCaution = soldier.status === 'CAUTION';

  return (
    <div
      onClick={onClick}
      className={`bg-[#1a2036] rounded-xl border transition-all duration-300 overflow-hidden flex flex-col cursor-pointer hover:scale-[1.02] ${
        isCritical ? 'border-tactical-red ring-1 ring-tactical-red animate-pulse' : 'border-[#2d385e]'
      }`}
    >
      <div className="p-3 flex items-center justify-between bg-[#232c48]/30">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full border-2 border-[#3b4b7a] bg-slate-800 overflow-hidden">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${soldier.name}`} alt="profile" />
          </div>
          <div>
            <h4 className="text-white text-sm font-bold uppercase">{soldier.name}</h4>
            <p className="text-[#919fca] text-[10px] uppercase">{soldier.rank}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="material-symbols-outlined text-sm cursor-pointer hover:text-blue-400"
          >
            edit
          </span>
          <span
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="material-symbols-outlined text-sm cursor-pointer hover:text-red-500"
          >
            delete
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            isCritical
              ? 'bg-tactical-red text-white border-tactical-red'
              : isCaution
              ? 'bg-tactical-yellow/20 text-tactical-yellow border-tactical-yellow/30'
              : 'bg-tactical-green/20 text-tactical-green border-tactical-green/30'
          }`}>
            {soldier.status}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">{soldier.bpm}</span>
          <span className="text-[#919fca] text-xs uppercase">BPM</span>
        </div>
      </div>
    </div>
  );
};

/* ---------------- Dashboard ---------------- */
export default function Dashboard() {
  const navigate = useNavigate();

  const [squads, setSquads] = useState([
    { id: 1, name: "Squad Alpha", status: "ACTIVE" }
  ]);

    const [soldiers, setSoldiers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // 1. Start the subscription via the service
    const unsubscribe = firebaseService.subscribeToSoldiers((data) => {
      // 2. Update the local state with the data from Firebase
      setSoldiers(data);
      console.log("Tactical Data Synced: Units online.");
    });

    // 3. Cleanup: Stop listening when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this runs once on mount

  /* -------- Squad Functions -------- */
  const handleAddSquad = () => {
    const name = prompt("Enter new squad name:");
    if (!name) return;

    setSquads([...squads, {
      id: Date.now(),
      name,
      status: "ACTIVE"
    }]);
  };

  const handleEditSquad = (id) => {
    const newName = prompt("Enter new squad name:");
    if (!newName) return;

    setSquads(squads.map(s =>
      s.id === id ? { ...s, name: newName } : s
    ));
  };

  const handleDeleteSquad = (id) => {
    setSquads(squads.filter(s => s.id !== id));
  };

  /* -------- Member Functions -------- */
  const handleAddAgent = async (formData) => {
  try {
    // 1. Await the Firebase service call first
    // This ensures data is sent to the cloud before we update the local UI
    const savedAgent = await firebaseService.addOperative(1, formData);

    // 2. Prepare the new agent for the local state
    // We use the ID returned from Firebase (savedAgent.id) instead of Date.now()
    const newAgent = {
      id: savedAgent.id || Date.now(),
      name: formData.callsign || "UNNAMED_UNIT",
      rank: formData.rank || "OPERATIVE",
      status: "STABLE",
      bpm: parseInt(formData.restingHeartRate) || 72,
      squadId: 1
    };

    // 3. Update local state and close the UI
    setSoldiers(prevSoldiers => [...prevSoldiers, newAgent]);
    setIsModalOpen(false);

    console.log("Tactical Uplink Success: Operative deployed to SSTracker.");
  } catch (error) {
    // 4. Handle any connection or permission errors
    console.error("Tactical Uplink Failed:", error);
    alert("System Error: Failed to sync operative with Firebase.");
  }
};  

  const handleEditMember = (id) => {
    const newName = prompt("Enter new member name:");
    if (!newName) return;

    setSoldiers(soldiers.map(s =>
      s.id === id ? { ...s, name: newName } : s
    ));
  };

  const handleDeleteMember = (id) => {
    setSoldiers(soldiers.filter(s => s.id !== id));
  };

  const handleCardClick = (soldier) => {
    navigate('/Card', { state: { soldier } });
  };

  return (
    <div className="flex h-screen bg-[#101422] text-white font-sans overflow-hidden">

      {/* Sidebar */}
      <aside className="w-72 bg-[#101422] border-r border-[#232c48] p-6 flex flex-col">
        <div className="mb-6">
          <p className="text-[#919fca] text-[10px] font-bold uppercase tracking-widest">
            Active Mission
          </p>
          <h1 className="text-xl font-black mt-1 uppercase text-blue-500">
            Operation Nightfall
          </h1>
        </div>

        <nav className="space-y-2 flex-1">
          {squads.map((squad) => (
            <div
              key={squad.id}
              className="w-full bg-[#0f47f0]/10 border border-[#0f47f0]/30 p-3 rounded-lg flex justify-between items-center"
            >
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className="material-symbols-outlined text-primary">groups</span>
                {squad.name}
              </span>

              <div className="flex items-center gap-2">
                <span
                  onClick={() => handleEditSquad(squad.id)}
                  className="material-symbols-outlined text-xs cursor-pointer hover:text-blue-400"
                >
                  edit
                </span>
                <span
                  onClick={() => handleDeleteSquad(squad.id)}
                  className="material-symbols-outlined text-xs cursor-pointer hover:text-red-500"
                >
                  delete
                </span>
              </div>
            </div>
          ))}

          {/* Add Squad Button */}
          <button
            onClick={handleAddSquad}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-[#3b4b7a] p-3 rounded-lg text-sm font-bold text-[#919fca] hover:border-[#0f47f0] hover:text-white transition-all"
          >
            <span className="material-symbols-outlined">add</span>
            Add Squad
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">

        <header className="h-16 border-b border-[#232c48] flex items-center justify-between px-8">
          <h2 className="text-sm font-black uppercase">Squad Safety Control</h2>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#0f47f0] px-4 py-2 rounded-lg text-[11px] font-black uppercase flex items-center gap-2"
          >
            <span className="material-symbols-outlined">person_add</span>
            Enroll Operative
          </button>
        </header>

        <div className="p-8 space-y-8">
          <div className="flex gap-6">
            <TopStatCard label="Active Members" value={soldiers.length} icon="groups" />
            <TopStatCard label="Critical Alerts" value="00" icon="error" colorClass="text-red-500" />
            <TopStatCard label="Squad Avg BPM" value={soldiers.length ? 72 : "--"} icon="monitor_heart" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldiers.map(s => (
              <OperativeCard
                key={s.id}
                soldier={s}
                onClick={() => handleCardClick(s)}
                onEdit={() => handleEditMember(s.id)}
                onDelete={() => handleDeleteMember(s.id)}
              />
            ))}
          </div>
        </div>
      </main>

      <OperativeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAgent={handleAddAgent}
      />
    </div>
  );
}
