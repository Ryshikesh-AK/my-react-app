import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { db } from "../Firebase"; 
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';

const WatchFace = () => {
  const { soldierId } = useParams();
  const [time, setTime] = useState(new Date());
  const [operativeData, setOperativeData] = useState(null);

  // Clock Timer Logic
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time Firebase Sync
  useEffect(() => {
    if (!soldierId) return;
    
    const unsub = onSnapshot(doc(db, "soldiers", soldierId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setOperativeData(docSnapshot.data());
      }
    });

    return () => unsub();
  }, [soldierId]);

  // --- NEW TACTICAL FUNCTIONS ---

  // 1. SOS Function
  const handleSOS = async () => {
    if (!soldierId) return;
    try {
      await updateDoc(doc(db, "soldiers", soldierId), {
        sosActive: true,
        sosTimestamp: serverTimestamp(),
        lastLocation: { grid: "34.0522 N / 118.2437 W" } // Static for now
      });
      alert("SOS SIGNAL SENT TO HQ");
    } catch (error) { console.error("SOS Error:", error); }
  };

  // 2. ACK / Send Message to Admin
  const sendAckToHQ = async () => {
    if (!soldierId) return;
    try {
      await updateDoc(doc(db, "soldiers", soldierId), {
        lastMessageFromSoldier: "ACKNOWLEDGED. PROCEEDING.",
        soldierMessageTime: serverTimestamp()
      });
      alert("CONFIRMATION SENT TO ADMIN");
    } catch (error) { console.error("Message Error:", error); }
  };

  const formatTime = (date) => date.toTimeString().split(' ')[0];

  if (!operativeData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0c10] font-mono">
        <div className="text-emerald-500 animate-pulse tracking-[0.4em] font-black text-xl text-center">
          ESTABLISHING SECURE UPLINK...
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0c10] font-mono select-none">
      <div className="relative w-[500px] h-[500px] rounded-full bg-[#12161d] border-[12px] border-[#1b222c] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
        
        <div className="absolute inset-0 rounded-full border border-white/5 m-10" />
        <div className="absolute inset-0 rounded-full border border-white/5 m-20" />
        
        <div className="relative z-10 flex flex-col items-center w-full px-12 text-center">
          
          {/* Top Status Indicators */}
          <div className="flex flex-col items-center gap-1 mb-6">
            <div className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] ${operativeData.sosActive ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
              <span className="animate-pulse">●</span> {operativeData.sosActive ? 'EMERGENCY: SOS ACTIVE' : 'MISSION STATUS: ACTIVE'}
            </div>
            <div className="flex items-center gap-4 text-[10px] text-orange-400 font-bold uppercase">
               LINK: {operativeData.serviceId}
            </div>
          </div>

          {/* Clock & NAME SECTION */}
          <div className="mb-4">
            <p className="text-emerald-500 text-[12px] font-black tracking-[0.4em] mb-1 uppercase drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">
              {operativeData.name || "UNNAMED OPERATIVE"}
            </p>
            
            <h1 className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {formatTime(time)}
            </h1>
            
            <p className="text-[#919fca] text-[10px] font-bold mt-2 tracking-widest uppercase">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | SECTOR 7G
            </p>
          </div>

          {/* Vitals Summary Row */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div className="bg-[#1a2026] border border-white/10 rounded-lg p-2 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">favorite</span> Heart Rate
                </span>
                <span className="text-white text-xs font-bold">{operativeData.bpm} <span className="text-[8px] text-white/40">BPM</span></span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500" 
                  style={{ width: `${Math.min((operativeData.bpm / 200) * 100, 100)}%` }} 
                />
              </div>
            </div>

            <div className="bg-[#1a2026] border border-white/10 rounded-lg p-2 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-orange-400 uppercase tracking-tighter flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">air</span> O2 Sat
                </span>
                <span className="text-white text-xs font-bold">{operativeData.spo2}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-orange-400 transition-all duration-500" 
                  style={{ width: `${operativeData.spo2}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Incoming Command - UPDATED TO BE DYNAMIC */}
          <div className="w-full bg-[#1c222d] border-l-4 border-orange-500 p-3 flex items-center justify-between rounded-r-lg mb-6 text-left">
            <div>
              <p className="text-orange-500 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">chat_bubble</span> Incoming Command
              </p>
              <p className="text-white text-[10px] italic font-medium mt-1 leading-tight">
                {/* Shows real message from Firestore or default if empty */}
                "{operativeData.lastMessageFromHQ || "Proceed to Extraction Point Bravo. ETA 0500."}"
              </p>
            </div>
            <button 
              onClick={sendAckToHQ}
              className="bg-orange-500/20 text-orange-500 border border-orange-500/40 px-2 py-1 rounded text-[10px] font-bold hover:bg-orange-500 hover:text-white transition-colors"
            >
              ACK
            </button>
          </div>

          {/* SOS & Grid - UPDATED WITH HANDLE SOS */}
          <div className="flex items-center gap-3">
            <div onClick={handleSOS} className="relative group cursor-pointer">
              <div className={`absolute inset-0 blur-md opacity-20 group-hover:opacity-40 animate-pulse ${operativeData.sosActive ? 'bg-white opacity-60' : 'bg-rose-500'}`}></div>
              <div className={`relative w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 shadow-lg active:scale-95 transition-all ${operativeData.sosActive ? 'bg-white border-rose-600' : 'bg-rose-600 border-rose-400'}`}>
                <span className={`material-symbols-outlined text-lg ${operativeData.sosActive ? 'text-rose-600' : 'text-white'}`}>error</span>
                <span className={`${operativeData.sosActive ? 'text-rose-600' : 'text-white'} text-[8px] font-black`}>SOS</span>
              </div>
            </div>
            <div className="text-left text-[#919fca] text-[8px] font-bold space-y-1">
              <div>GRID: 34.0522 N / 118.2437 W</div>
              <div className="uppercase">DEVICE: {operativeData.device || "MW-BIO-091"}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


export default WatchFace;