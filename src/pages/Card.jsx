import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import {
  Heart, Droplets, Shield
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const HealthAnalyticsDetail = () => {
  const navigate = useNavigate();
  // Get soldier data from Layout context or fallback
  const { soldier, globalAlert } = useOutletContext() || {};

  const [activeView, setActiveView] = useState('BPM');
  const MAX_BPM_LIMIT = 100;
  const MIN_SPO2_LIMIT = 92;

  // Safety check handled by Layout mostly, but kept for robustness
  if (!soldier) return null;

  const [data, setBiometricData] = useState([
    { time: '20:40', bpm: 72, spo2: 98 },
    { time: '20:41', bpm: 75, spo2: 97 },
    { time: '20:42', bpm: 72, spo2: 98 }
  ]);

  const currentBpm = data[data.length - 1]?.bpm || 72;
  const currentSpo2 = data[data.length - 1]?.spo2 || 98;
  const isBpmAlert = currentBpm >= MAX_BPM_LIMIT;
  const isSpo2Alert = currentSpo2 <= MIN_SPO2_LIMIT;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      setBiometricData(prev => {
        const newData = [...prev, {
          time: timeStr,
          bpm: Math.floor(Math.random() * (110 - 65 + 1)) + 65,
          spo2: Math.floor(Math.random() * (100 - 89 + 1)) + 89
        }];
        return newData.slice(-50);
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`flex flex-col h-full bg-[#101422] text-slate-200 font-sans overflow-hidden`}>
      {/* Sidebar REMOVED - handled by Layout */}

      <div className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 bg-[#101422]/90 backdrop-blur-md z-20">
          {/* Back button logic moved to Sidebar/Layout */}
          <div></div>
          <div className={`text-[10px] font-black uppercase tracking-widest ${globalAlert ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}`}>
            {globalAlert ? 'CRITICAL ALERT ACTIVE' : 'Uplink Secure'}
          </div>
        </header>

        <div className="p-8 space-y-6">
          <h2 className="text-4xl font-black text-white mt-1 uppercase tracking-tighter">{soldier.name} // {activeView} ANALYTICS</h2>

          {/* DYNAMIC GRAPH AREA */}
          <div className={`bg-[#1a2036] border transition-all duration-500 ${((activeView === 'BPM' && isBpmAlert) || (activeView === 'SPO2' && isSpo2Alert)) ? 'border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.2)]' : 'border-slate-800'} rounded-2xl p-8`}>

            <div className="flex justify-between items-center mb-8">
              <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{activeView === 'BPM' ? 'Pulse Rate' : 'Blood Oxygen'} Monitoring</h4>
              <span className={`text-4xl font-black tabular-nums ${((activeView === 'BPM' && isBpmAlert) || (activeView === 'SPO2' && isSpo2Alert)) ? 'text-rose-500 animate-pulse' : 'text-white'}`}>
                {activeView === 'BPM' ? `${currentBpm} BPM` : `${currentSpo2}%`}
              </span>
            </div>

            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeView === 'SPO2' ? (
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorSpo2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isSpo2Alert ? "#f43f5e" : "#2dd4bf"} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={isSpo2Alert ? "#f43f5e" : "#2dd4bf"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis domain={[85, 105]} hide />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#fff' }} />
                    <ReferenceLine y={MIN_SPO2_LIMIT} stroke="#f43f5e" strokeDasharray="5 5" label={{ position: 'top', value: `MIN: ${MIN_SPO2_LIMIT}`, fill: '#f43f5e', fontSize: 10 }} />
                    <Area
                      type="monotone"
                      dataKey="spo2"
                      stroke={isSpo2Alert ? "#f43f5e" : "#2dd4bf"}
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorSpo2)"
                    />
                  </AreaChart>
                ) : (
                  /* --- UPDATED BPM AREA CHART --- */
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={isBpmAlert ? "#f43f5e" : "#3b82f6"} stopOpacity={0.4} />
                        <stop offset="95%" stopColor={isBpmAlert ? "#f43f5e" : "#3b82f6"} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 140]} hide />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                    <ReferenceLine
                      y={MAX_BPM_LIMIT}
                      stroke="#f43f5e"
                      strokeDasharray="5 5"
                      label={{ position: 'top', value: `MAX: ${MAX_BPM_LIMIT}`, fill: '#f43f5e', fontSize: 10 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="bpm"
                      stroke={isBpmAlert ? "#f43f5e" : "#3b82f6"}
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorBpm)"
                      animationBegin={0}
                      animationDuration={1500}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* STAT CARDS - WITH ADDED ICONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SPO2 Card */}
            <div onClick={() => setActiveView('SPO2')} className={`cursor-pointer p-5 rounded-xl border transition-all ${activeView === 'SPO2' ? 'border-teal-500 bg-teal-500/5 ring-1 ring-teal-500/50' : isSpo2Alert ? 'border-rose-500 bg-rose-500/10' : 'border-slate-800 bg-[#1a2036]'}`}>
              <div className="flex justify-between mb-4">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Blood Oxygen</span>
                <Droplets size={16} className={isSpo2Alert ? "text-rose-500 animate-pulse" : "text-teal-400"} />
              </div>
              <h3 className="text-2xl font-bold text-white">{currentSpo2}%</h3>
              <p className={`text-[9px] mt-1 font-bold ${isSpo2Alert ? 'text-rose-400' : 'text-teal-500'}`}>SENSORS ACTIVE</p>
            </div>

            {/* BPM Card */}
            <div onClick={() => setActiveView('BPM')} className={`cursor-pointer p-5 rounded-xl border transition-all ${activeView === 'BPM' ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/50' : isBpmAlert ? 'border-rose-500 bg-rose-500/10' : 'border-slate-800 bg-[#1a2036]'}`}>
              <div className="flex justify-between mb-4">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Heart Rate</span>
                <Heart size={16} className={isBpmAlert ? "text-rose-500 animate-pulse" : "text-blue-500"} />
              </div>
              <h3 className="text-2xl font-bold text-white">{currentBpm} BPM</h3>
              <p className={`text-[9px] mt-1 font-bold ${isBpmAlert ? 'text-rose-400' : 'text-blue-500'}`}>PULSE SYNCED</p>
            </div>

            {/* Readiness/Status Card */}
            <div className="bg-[#1a2036] border border-slate-800 p-5 rounded-xl shadow-lg">
              <div className="flex justify-between mb-4">
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Unit Status</span>
                <Shield size={16} className={globalAlert ? "text-rose-500 animate-pulse" : "text-emerald-500"} />
              </div>
              <h3 className={`text-2xl font-black uppercase ${globalAlert ? 'text-rose-500' : 'text-emerald-500'}`}>{globalAlert ? 'Alert' : 'Stable'}</h3>
              <p className="text-[9px] mt-1 text-slate-500 font-bold uppercase">COMBAT READINESS: {globalAlert ? 'LOW' : 'HIGH'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalyticsDetail;