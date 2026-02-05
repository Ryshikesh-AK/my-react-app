import React, { useState, useEffect } from 'react';

const WatchFace = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format: HH:MM:SS
  const formatTime = (date) => date.toTimeString().split(' ')[0];

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0c10] font-mono select-none">
      {/* Outer Watch Case */}
      <div className="relative w-[500px] h-[500px] rounded-full bg-[#12161d] border-[12px] border-[#1b222c] shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
        
        {/* Subtle Radar/Grid Background Lines */}
        <div className="absolute inset-0 rounded-full border border-white/5 m-10" />
        <div className="absolute inset-0 rounded-full border border-white/5 m-20" />
        
        {/* Side Hardware Buttons */}
        <div className="absolute -right-3 top-1/3 w-4 h-10 bg-[#232c38] rounded-r-md border-y border-r border-white/10" />
        <div className="absolute -right-3 top-1/2 w-4 h-12 bg-[#232c38] rounded-r-md border-y border-r border-white/10" />
        <div className="absolute -right-3 top-[60%] w-4 h-10 bg-[#232c38] rounded-r-md border-y border-r border-white/10" />

        {/* Watch Face Content */}
        <div className="relative z-10 flex flex-col items-center w-full px-12 text-center">
          
          {/* Top Status Indicators */}
          <div className="flex flex-col items-center gap-1 mb-6">
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 tracking-[0.2em]">
              <span className="animate-pulse">●</span> MISSION STATUS: ACTIVE
            </div>
            <div className="flex items-center gap-4 text-[10px] text-orange-400 font-bold">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">signal_cellular_alt</span> HQ LINK
              </span>
              <span className="flex items-center gap-1 text-white/40">
                <span className="material-symbols-outlined text-xs">battery_charging_full</span> 84%
              </span>
            </div>
          </div>

          {/* Clock Section */}
          <div className="mb-4">
            <p className="text-[#919fca] text-[10px] font-bold tracking-[0.3em] mb-1">T-STANDARD</p>
            <h1 className="text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              {formatTime(time)}
            </h1>
            <p className="text-[#919fca] text-[10px] font-bold mt-2">OCT 24, 2023 | SECTOR 7G</p>
          </div>

          {/* Vitals Summary Row */}
          <div className="grid grid-cols-2 gap-3 w-full mb-6">
            <div className="bg-[#1a2026] border border-white/10 rounded-lg p-2 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">favorite</span> Heart Rate
                </span>
                <span className="text-white text-xs font-bold">82 <span className="text-[8px] text-white/40">BPM</span></span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[60%]" />
              </div>
            </div>
            <div className="bg-[#1a2026] border border-white/10 rounded-lg p-2 text-left">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[8px] font-bold text-orange-400 uppercase tracking-tighter flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">air</span> O2 Sat
                </span>
                <span className="text-white text-xs font-bold">98.4%</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 w-[90%]" />
              </div>
            </div>
          </div>

          {/* Incoming Command Notification */}
          <div className="w-full bg-[#1c222d] border-l-4 border-orange-500 p-3 flex items-center justify-between rounded-r-lg mb-6">
            <div className="text-left">
              <p className="text-orange-500 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="material-symbols-outlined text-[10px]">chat_bubble</span> Incoming Command
              </p>
              <p className="text-white text-[10px] italic font-medium mt-1 leading-tight">
                "Proceed to Extraction Point Bravo. ETA 0500."
              </p>
            </div>
            <button className="bg-orange-500/20 text-orange-500 border border-orange-500/40 px-2 py-1 rounded text-[10px] font-bold hover:bg-orange-500 hover:text-white transition-colors">
              ACK
            </button>
          </div>

          {/* Bottom SOS & Telemetry */}
         <div class="flex items-center gap-3">
  
  
  <div class="relative group cursor-pointer">
    <div class="absolute inset-0 bg-rose-500 blur-md opacity-20 group-hover:opacity-40 animate-pulse"></div>
    <div class="relative w-12 h-12 bg-rose-600 rounded-full flex flex-col items-center justify-center border-2 border-rose-400 shadow-lg">
      <span class="material-symbols-outlined text-white text-lg">error</span>
      <span class="text-white text-[8px] font-black">SOS</span>
    </div>
  </div>

  <div class="text-left text-[#919fca] text-[8px] font-bold space-y-1">
    <div class="flex items-center gap-1">
      <span class="material-symbols-outlined text-[10px]">location_on</span>
      GRID: 34.0522 N / 118.2437 W
    </div>
    <div class="flex items-center gap-1">
      <span class="material-symbols-outlined text-[10px]">footprint</span>
      STEPS: 18,245 / 20K
    </div>
  </div>

</div>


        </div>
      </div>
    </div>
  );
};

export default WatchFace;