import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart, Activity, Shield, MapPin, History, Search, Bell, Settings, 
  ArrowDown, AlertTriangle, TrendingUp, Download, PlusSquare, 
  User, LayoutDashboard, Rocket, BarChart3, ChevronLeft,
  MessageSquare // 1. Added MessageSquare icon
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Communication from './Communication';
import { useEffect,useState} from 'react';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all border-l-4 ${
    active 
      ? 'bg-blue-600/20 text-blue-400 border-blue-500' 
      : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/30'
  }`}>
    <Icon size={18} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const StatCard = ({ label, value, subtext, icon: Icon, colorClass, trend, isAlert }) => (
  <div className="bg-[#1a2036] border border-slate-800 rounded-xl p-5 flex-1 shadow-lg relative overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{label}</span>
      <Icon size={16} className={isAlert ? "text-rose-500" : "text-blue-500"} />
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>
      {trend && <span className="text-emerald-400 text-[10px] font-bold">{trend}</span>}
    </div>
    <p className={`text-[9px] mt-1 uppercase font-bold tracking-tighter ${colorClass || 'text-slate-500'}`}>{subtext}</p>
  </div>
);

const LogEntry = ({ status, time, title, description, accentColor }) => {
  const borderMap = { caution: 'border-l-amber-500', normal: 'border-l-emerald-500', critical: 'border-l-rose-500', system: 'border-l-blue-500' };
  return (
    <div className={`bg-[#232c48]/30 border border-slate-800 border-l-4 ${borderMap[status]} p-3 rounded-r-lg transition-colors hover:bg-[#232c48]/50`}>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[8px] font-black uppercase tracking-widest ${accentColor}`}>{status === 'critical' ? 'CRITICAL ALERT' : status}</span>
        <span className="text-slate-500 text-[10px] font-mono">{time}</span>
      </div>
      <h4 className="text-white text-[11px] font-bold">{title}</h4>
      <p className="text-slate-400 text-[10px] leading-tight mt-1">{description}</p>
    </div>
  );
};

const HealthAnalyticsDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  
const [data, setBiometricData] = useState([
  { time: '14:00', bpm: 62 }, { time: '14:05', bpm: 68 }, { time: '14:15', bpm: 82 },
  { time: '14:20', bpm: 72 }, { time: '14:30', bpm: 64 }, { time: '14:35', bpm: 75 },
  { time: '14:45', bpm: 95 }, { time: '14:50', bpm: 84 }, { time: '15:00', bpm: 68 },
]);

  
  const { soldier } = location.state || { 
    soldier: { name: "UNKNOWN_UNIT", rank: "N/A", bpm: "--", status: "OFFLINE", spo2: "--" } 
  };

  useEffect(() => {
    // Interval to simulate a heart rate monitor pulse every 5 seconds
    const interval = setInterval(() => {
      const now = new Date();
      
      // Format time as HH:mm
      const currentTime = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });

      // Generate a realistic BPM (between 60 and 100)
      const randomBPM = Math.floor(Math.random() * (100 - 60 + 1)) + 60;

      const newDataPoint = { time: currentTime, bpm: randomBPM };

      setBiometricData((prevData) => {
        // Keep only the last 10 readings to prevent the chart from getting too crowded
        const updatedData = [...prevData, newDataPoint];
        return updatedData.slice(-10); 
      });

    }, 1000); // 1000ms = 1 seconds

    return () => clearInterval(interval); // Cleanup to prevent memory leaks
  }, []);

  return (
    <div className="flex h-screen bg-[#101422] text-slate-200 font-sans overflow-hidden">
      
      {/* 1. Tactical Sidebar */}
      <aside className="w-64 bg-[#101422] border-r border-slate-800 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800 mb-4">
          <div className="bg-blue-600 p-1.5 rounded shadow-[0_0_15px_rgba(37,99,235,0.4)]">
            <Shield className="text-white" size={20} />
          </div>
          <h1 className="text-sm font-black uppercase tracking-tighter text-white">Mission Control</h1>
        </div>

        <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-800 mb-2">
          <div className="relative">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${soldier.name}`} 
              className="size-10 rounded-full bg-slate-800 border-2 border-blue-500" 
              alt="Unit Avatar" 
            />
            <div className={`absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-[#101422] ${soldier.status === 'STABLE' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white uppercase">{soldier.name}</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{soldier.rank}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Overview" 
            onClick={() => navigate('/Dashboard')} 
          />
          <SidebarItem 
            icon={Activity} 
            label="Vitals" 
            active 
            onClick={() => navigate('/Card')} 
          />
          
          {/* 🟢 CHANGED: Equipment -> Communication */}
          <SidebarItem 
            icon={MessageSquare} 
            label="Communication" 
            onClick={() => navigate('/communication')} 
          />

          <SidebarItem 
            icon={MapPin} 
            label="Location" 
            onClick={() => navigate('/location')} 
          />
        </nav>
      </aside>

      {/* 2. Main Analytics Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 bg-[#101422]/90 backdrop-blur-md z-20">
           <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors">
              <ChevronLeft size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Return to Dashboard</span>
           </button>
          
          <div className="flex items-center gap-4 border-l border-slate-800 pl-8">
             <div className="text-right mr-4">
                <p className="text-[9px] text-slate-500 font-bold uppercase">Uplink Status</p>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Encrypted</p>
             </div>
             <Settings size={18} className="text-slate-400 cursor-pointer" />
          </div>
        </header>

        <div className="p-8 space-y-8 flex flex-col xl:flex-row gap-8">
          <div className="flex-1 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <span className="size-2 rounded-full bg-blue-500 animate-pulse" /> BIO-METRIC DATA ACTIVE
                </p>
                <h2 className="text-4xl font-black text-white mt-2 tracking-tighter uppercase">{soldier.name} // ANALYTICS</h2>
                <p className="text-slate-500 text-xs mt-1 font-medium tracking-tight">REAL-TIME VITALS MONITORING — {soldier.rank}</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-slate-800/50 border border-slate-700 hover:bg-slate-700 px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider">
                  <Download size={14} /> Export Report
                </button>
              </div>
            </div>

            {/* Heart Rate Area Chart */}
            <div className="bg-[#1a2036] border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-baseline gap-4">
                  <h4 className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Real-time Heart Rate (BPM)</h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white text-3xl font-black tabular-nums">{soldier.bpm} BPM</span>
                    <span className="text-emerald-500 text-xs font-black flex items-center"><TrendingUp size={12} className="mr-1"/> LIVE</span>
                  </div>
                </div>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} dy={15} />
                    <YAxis hide domain={['dataMin - 10', 'dataMax + 10']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', fontSize: '10px', color: '#fff' }} />
                    <Area type="monotone" dataKey="bpm" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorBpm)" animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard label="Current SPO2" value={`${soldier.spo2}%`} subtext="Blood Oxygen Level" icon={Activity} colorClass="text-blue-400" />
              <StatCard label="Status" value={soldier.status} subtext="Combat Readiness" icon={AlertTriangle} isAlert={soldier.status !== 'STABLE'} colorClass={soldier.status === 'STABLE' ? 'text-emerald-400' : 'text-rose-400'} />
              <StatCard label="Average BPM" value={`${soldier.bpm} BPM`} subtext="Baseline verified" icon={BarChart3} colorClass="text-blue-400" />
            </div>
          </div>

          <aside className="w-full xl:w-80 space-y-6 shrink-0">
             <div className="bg-[#1a2036] border border-slate-800 rounded-2xl flex flex-col h-full shadow-2xl overflow-hidden">
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
                   <h3 className="text-white text-xs font-black uppercase tracking-widest">Tactical Event Log</h3>
                </div>
                <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[600px]">
                  <LogEntry status="normal" accentColor="text-emerald-500" time="JUST NOW" title="Deployment Confirmed" description={`Operative ${soldier.name} has entered active mission status.`} />
                  <LogEntry status="system" accentColor="text-blue-500" time="SYNC" title="Bio-Link Established" description="AES-256 encrypted biometric synchronization active." />
                </div>
             </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default HealthAnalyticsDetail;