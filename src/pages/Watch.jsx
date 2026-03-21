import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { db } from "../Firebase"; 
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';

const WatchFace = () => {
  const { soldierId } = useParams();
  const [time, setTime] = useState(new Date());
  const [operativeData, setOperativeData] = useState(null);
  
  // Local state for the "jittering" live numbers
  const [liveBpm, setLiveBpm] = useState(82);
  const [liveSpo2, setLiveSpo2] = useState(98.4);

  // 1. Clock Timer
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Firebase Listener
  useEffect(() => {
    if (!soldierId) return;
    const unsub = onSnapshot(doc(db, "soldiers", soldierId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setOperativeData(data);
        // Sync live values with DB updates when they happen
        if (data.bpm) setLiveBpm(data.bpm);
        if (data.spo2) setLiveSpo2(data.spo2);
      }
    });
    return () => unsub();
  }, [soldierId]);

  // 3. EVERY SECOND VITAL UPDATE (Simulation)
  useEffect(() => {
    const vitalTimer = setInterval(() => {
      // Fluctuate BPM +/- 1 or 2
      setLiveBpm(prev => {
        const jitter = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return prev + jitter;
      });

      // Fluctuate SpO2 +/- 0.1
      setLiveSpo2(prev => {
        const jitter = (Math.random() * 0.2 - 0.1);
        const next = parseFloat(prev) + jitter;
        return parseFloat(next.toFixed(1));
      });
    }, 1000);

    return () => clearInterval(vitalTimer);
  }, []);

  // Actions
  const handleSOS = async () => {
    if (!soldierId) return;
    await updateDoc(doc(db, "soldiers", soldierId), { sosActive: true, sosTimestamp: serverTimestamp() });
  };

  const handleCancelSOS = async () => {
    if (!soldierId) return;
    await updateDoc(doc(db, "soldiers", soldierId), { sosActive: false });
  };

  const sendAckToHQ = async () => {
    if (!soldierId) return;
    await updateDoc(doc(db, "soldiers", soldierId), { lastMessageFromSoldier: "ACKNOWLEDGED.", soldierMessageTime: serverTimestamp() });
  };

  const formatTime = (date) => date.toTimeString().split(' ')[0];

  if (!operativeData) return <div className="min-h-screen bg-[#0a0c10]" />;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0c10] font-mono select-none">
      <div className="relative w-[500px] h-[500px] rounded-full bg-[#12161d] border-[12px] border-[#1b222c] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
        
        <div className="absolute inset-0 rounded-full border border-white/5 m-10" />
        <div className="absolute inset-0 rounded-full border border-white/5 m-20" />
        
        {/* Side Buttons */}
        <div className="absolute -right-3 top-1/3 w-4 h-10 bg-[#232c38] rounded-r-md border-y border-r border-white/10" />
        <div className="absolute -right-3 top-1/2 w-4 h-12 bg-[#232c38] rounded-r-md border-y border-r border-white/10" />
        <div className="absolute -right-3 top-[60%] w-4 h-10 bg-[#232c38] rounded-r-md border-y border-r border-white/10" />

        <div className="relative z-10 flex flex-col items-center w-full px-12 text-center">
          
          {/* Top Status */}
          <div className="flex flex-col items-center gap-1 mb-6 min-h-[40px]">
            {operativeData.sosActive ? (
              <div className="text-[12px] font-black text-rose-500 tracking-[0.3em] uppercase animate-pulse">
                ● EMERGENCY SOS ACTIVE
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 tracking-[0.2em]">
                  <span className="animate-pulse">●</span> MISSION STATUS: ACTIVE
                </div>
                <div className="flex items-center gap-4 text-[10px] text-orange-400 font-bold">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-xs">signal_cellular_alt</span> HQ LINK</span>
                  <span className="flex items-center gap-1 text-white/40"><span className="material-symbols-outlined text-xs">battery_charging_full</span> 84%</span>
                </div>
              </>
            )}
          </div>

          {/* Clock */}
          <div className="mb-4">
            <p className="text-[#919fca] text-[10px] font-bold tracking-[0.3em] mb-1 uppercase">{operativeData.name || "T-STANDARD"}</p>
            <h1 className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {formatTime(time)}
            </h1>
            <p className="text-[#919fca] text-[10px] font-bold mt-2 uppercase">{new Date().toLocaleDateString()} | {operativeData.serviceId}</p>
          </div>

          {/* LIVE VITALS ROW */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div className="bg-[#1a2026] border border-white/10 rounded-lg p-2 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px] animate-pulse">favorite</span> Heart Rate
                </span>
                <span className="text-white text-xs font-bold">{liveBpm} <span className="text-[8px] text-white/40">BPM</span></span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(liveBpm / 200) * 100}%` }} />
              </div>
            </div>

            <div className="bg-[#1a2026] border border-white/10 rounded-lg p-2 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-orange-400 uppercase tracking-tighter flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">air</span> O2 Sat
                </span>
                <span className="text-white text-xs font-bold">{liveSpo2}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 transition-all duration-1000" style={{ width: `${liveSpo2}%` }} />
              </div>
            </div>
          </div>

          {/* Message Area */}
          <div className="w-full bg-[#1c222d] border-l-4 border-orange-500 p-3 flex items-center justify-between rounded-r-lg mb-6">
            <div className="text-left">
              <p className="text-orange-500 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">chat_bubble</span> Incoming Command
              </p>
              <p className="text-white text-[10px] italic font-medium mt-1 leading-tight truncate max-w-[180px]">
                "{operativeData.lastMessageFromHQ || "Awaiting orders..."}"
              </p>
            </div>
            <button onClick={sendAckToHQ} className="bg-orange-500/20 text-orange-500 border border-orange-500/40 px-2 py-1 rounded text-[10px] font-bold hover:bg-orange-500 hover:text-white transition-colors">
              ACK
            </button>
          </div>

          {/* SOS Toggle & Telemetry */}
          <div className="flex items-center gap-3">
            {!operativeData.sosActive ? (
              <div onClick={handleSOS} className="relative group cursor-pointer active:scale-90 transition-transform">
                <div className="absolute inset-0 bg-rose-500 blur-md opacity-20 animate-pulse"></div>
                <div className="relative w-12 h-12 bg-rose-600 rounded-full flex flex-col items-center justify-center border-2 border-rose-400 shadow-lg">
                  <span className="material-symbols-outlined text-white text-lg">error</span>
                  <span className="text-white text-[8px] font-black">SOS</span>
                </div>
              </div>
            ) : (
              <div onClick={handleCancelSOS} className="relative group cursor-pointer active:scale-90 transition-transform">
                <div className="absolute inset-0 bg-emerald-500 blur-md opacity-60 animate-ping"></div>
                <div className="relative w-12 h-12 bg-emerald-600 rounded-full flex flex-col items-center justify-center border-2 border-emerald-400 shadow-lg">
                  <span className="material-symbols-outlined text-white text-lg font-black">close</span>
                  <span className="text-white text-[7px] font-black uppercase leading-[8px]">Cancel<br/>SOS</span>
                </div>
              </div>
            )}

            <div className="text-left text-[#919fca] text-[8px] font-bold space-y-1">
              <div className="flex items-center gap-1 uppercase">
                <span className="material-symbols-outlined text-[10px]">location_on</span>
                GRID: {operativeData.lastLocation?.grid || "34.0522 N / 118.2437 W"}
              </div>
              <div className="flex items-center gap-1 uppercase">
                <span className="material-symbols-outlined text-[10px]">sensors</span>
                STATUS: {operativeData.sosActive ? "EMERGENCY" : "NOMINAL"}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WatchFace;