import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { db } from "../Firebase"; 
import { doc, onSnapshot, updateDoc, serverTimestamp, collection, addDoc, query, orderBy, getDocs, writeBatch, limit } from 'firebase/firestore';

const WatchFace = () => {
  const { soldierId } = useParams();
  const [time, setTime] = useState(new Date());
  const [operativeData, setOperativeData] = useState(null);

  // Threshold constants from your Analytics
  const MAX_BPM_LIMIT = 100;
  const MIN_SPO2_LIMIT = 92;

  // 1. Clock Timer Logic
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. 🟢 UPDATED LIVE VITALS SIMULATOR (Pushes data TO Firebase)
  useEffect(() => {
    if (!soldierId) return;

    const sensorPulse = setInterval(async () => {
      // Matches your HealthAnalyticsDetail ranges exactly
      const mockBpm = Math.floor(Math.random() * (110 - 65 + 1)) + 65;
      const mockSpo2 = Math.floor(Math.random() * (100 - 89 + 1)) + 89;

      try {
        const healthHistoryRef = collection(db, "soldiers", soldierId, "healthHistory");
        await addDoc(healthHistoryRef, {
          bpm: mockBpm,
          spo2: mockSpo2,
          timestamp: serverTimestamp()
        });
        // Maintain only last 50 entries
        const q = query(healthHistoryRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size > 50) {
          const batch = writeBatch(db);
          querySnapshot.docs.slice(50).forEach(doc => batch.delete(doc.ref));
          await batch.commit();
        }
      } catch (err) {
        console.error("Sensor Sync Error:", err);
      }
    }, 2500); // 2.5 second updates for a "live" feel

    return () => clearInterval(sensorPulse);
  }, [soldierId]);

  // 3. Real-time Firebase Sync (Reads data FROM Firebase)
  useEffect(() => {
    if (!soldierId) return;
    
    const healthHistoryRef = collection(db, "soldiers", soldierId, "healthHistory");
    const q = query(healthHistoryRef, orderBy("timestamp", "desc"), limit(1));
    
    const unsubSoldier = onSnapshot(doc(db, "soldiers", soldierId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        setOperativeData(docSnapshot.data());
      }
    });
    
    const unsubHealth = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const latestHealth = querySnapshot.docs[0].data();
        setOperativeData(prev => ({...prev, bpm: latestHealth.bpm, spo2: latestHealth.spo2, lastSync: latestHealth.timestamp}));
      }
    });

    return () => { unsubSoldier(); unsubHealth(); };
  }, [soldierId]);

  // --- TACTICAL FUNCTIONS ---

  const handleSOS = async () => {
    if (!soldierId) return;
    try {
      await updateDoc(doc(db, "soldiers", soldierId), {
        sosActive: true,
        sosTimestamp: serverTimestamp(),
      });
    } catch (error) { console.error("SOS Error:", error); }
  };

  const sendAckToHQ = async () => {
    if (!soldierId || !operativeData?.lastMessageFromHQ) return;
    try {
      const messagesRef = collection(db, "soldiers", soldierId, "messages");
      const ackText = `ACK: ${operativeData.lastMessageFromHQ}`;

      // 1. Add to persistent message history
      await addDoc(messagesRef, {
        sender: 'soldier',
        text: ackText,
        timestamp: serverTimestamp()
      });

      // 2. Clear from HQ trigger (compatible with existing logic)
      await updateDoc(doc(db, "soldiers", soldierId), {
        lastMessageFromSoldier: ackText,
        soldierMessageTime: serverTimestamp(),
        lastMessageFromHQ: "" 
      });
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

  // Define Alert States
  const isBpmAlert = (operativeData.bpm || 0) >= MAX_BPM_LIMIT;
  const isSpo2Alert = (operativeData.spo2 || 100) <= MIN_SPO2_LIMIT;
  const isGlobalAlert = isBpmAlert || isSpo2Alert || operativeData.sosActive;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0c10] font-mono select-none">
      {/* Outer Glow updates based on Alert state */}
      <div className={`relative w-[95vw] max-w-[500px] aspect-square rounded-full bg-[#12161d] border-[8px] md:border-[12px] transition-all duration-500 flex items-center justify-center
        ${isGlobalAlert ? 'border-rose-600 shadow-[0_0_60px_rgba(225,29,72,0.4)]' : 'border-[#1b222c] shadow-[0_0_50px_rgba(0,0,0,0.8)]'}`}>
        
        <div className="absolute inset-0 rounded-full border border-white/5 m-6 md:m-10" />
        <div className="absolute inset-0 rounded-full border border-white/5 m-12 md:m-20" />
        
        <div className="relative z-10 flex flex-col items-center w-full px-6 md:px-12 text-center">
          
          {/* Top Status Indicators */}
          <div className="flex flex-col items-center gap-1 mb-6">
            <div className={`flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] ${isGlobalAlert ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
              <span className="animate-pulse">●</span> {isGlobalAlert ? 'CRITICAL ALERT ACTIVE' : 'MISSION STATUS: ACTIVE'}
            </div>
            <div className="flex items-center gap-4 text-[10px] text-orange-400 font-bold uppercase">
                LINK: {operativeData.serviceId || "GS-9"}
            </div>
          </div>

          {/* Clock & NAME SECTION */}
          <div className="mb-4">
            <p className="text-emerald-500 text-[12px] font-black tracking-[0.4em] mb-1 uppercase drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">
              {operativeData.name || "UNNAMED OPERATIVE"}
            </p>
            
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] tabular-nums">
              {formatTime(time)}
            </h1>
            
            <p className="text-[#919fca] text-[10px] font-bold mt-2 tracking-widest uppercase">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} | SECTOR 7G
            </p>
          </div>

          {/* Vitals Summary Row */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            {/* Heart Rate Card */}
            <div className={`bg-[#1a2026] border rounded-lg p-2 text-left transition-colors duration-300 ${isBpmAlert ? 'border-rose-500 bg-rose-500/10' : 'border-white/10'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[8px] font-bold uppercase tracking-tighter ${isBpmAlert ? 'text-rose-500' : 'text-emerald-500'}`}>
                   Heart Rate
                </span>
                <span className={`text-white text-xs font-bold tabular-nums ${isBpmAlert ? 'animate-pulse' : ''}`}>
                    {operativeData.bpm || "--"} <span className="text-[8px] text-white/40">BPM</span>
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isBpmAlert ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                  style={{ width: `${Math.min(((operativeData.bpm || 0) / 140) * 100, 100)}%` }} 
                />
              </div>
            </div>

            {/* O2 Sat Card */}
            <div className={`bg-[#1a2026] border rounded-lg p-2 text-left transition-colors duration-300 ${isSpo2Alert ? 'border-rose-500 bg-rose-500/10' : 'border-white/10'}`}>
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[8px] font-bold uppercase tracking-tighter ${isSpo2Alert ? 'text-rose-500' : 'text-orange-400'}`}>
                  O2 Sat
                </span>
                <span className={`text-white text-xs font-bold tabular-nums ${isSpo2Alert ? 'animate-pulse' : ''}`}>{operativeData.spo2 || "--"}%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${isSpo2Alert ? 'bg-rose-500' : 'bg-orange-400'}`} 
                  style={{ width: `${operativeData.spo2 || 0}%` }} 
                />
              </div>
            </div>
          </div>

          {/* Incoming Command Section */}
          {operativeData.lastMessageFromHQ && (
            <div className="w-full bg-[#1c222d] border-l-4 border-orange-500 p-3 flex items-center justify-between rounded-r-lg mb-6 text-left animate-in fade-in zoom-in">
              <div className="flex-1 pr-2">
                <p className="text-orange-500 text-[8px] font-bold uppercase tracking-widest">Incoming Command</p>
                <p className="text-white text-[10px] italic font-medium mt-1 leading-tight">"{operativeData.lastMessageFromHQ}"</p>
              </div>
              <button onClick={sendAckToHQ} className="bg-orange-500 text-white px-3 py-2 rounded text-[10px] font-black active:scale-95 transition-transform">ACK</button>
            </div>
          )}

          {/* SOS & Grid Footer */}
          <div className="flex items-center gap-3">
            <div onClick={handleSOS} className="relative group cursor-pointer">
              <div className={`absolute inset-0 blur-md opacity-20 group-hover:opacity-40 animate-pulse ${operativeData.sosActive ? 'bg-white opacity-60' : 'bg-rose-500'}`}></div>
              <div className={`relative w-12 h-12 rounded-full flex flex-col items-center justify-center border-2 shadow-lg active:scale-95 transition-all ${operativeData.sosActive ? 'bg-white border-rose-600' : 'bg-rose-600 border-rose-400'}`}>
                <span className={`${operativeData.sosActive ? 'text-rose-600' : 'text-white'} text-[10px] font-black`}>SOS</span>
              </div>
            </div>
            <div className="text-left text-[#919fca] text-[8px] font-bold space-y-1">
              <div>GRID: {operativeData.lastLocation?.grid || "34.0522 N / 118.2437 W"}</div>
              <div className="uppercase">DEVICE: {operativeData.device || "MW-BIO-091"}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default WatchFace;