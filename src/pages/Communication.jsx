import React, { useState } from 'react';
import { 
  Search, Bell, Lock, Settings,CircleAlert ,
  MapPin, Radar, LifeBuoy, Home, Users, 
  Phone, Video, Info, Paperclip, Smile, 
  Send, Navigation, Shield, Wifi
} from 'lucide-react';

// --- Sub-Components ---

const SidebarThread = ({ title, status, subtext, icon: Icon, type = 'normal', active = false }) => {
  const isEmergency = type === 'emergency';
  
  return (
    <div className={`flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all ${
      isEmergency ? 'bg-red-500/20 border border-red-500/30' : 
      active ? 'bg-[#0f47f0]/20 border border-[#0f47f0]/40' : 
      'hover:bg-[#1b2136] border border-transparent'
    }`}>
      <div className={isEmergency ? 'text-red-500' : active ? 'text-[#0f47f0]' : 'text-[#919fca]'}>
        <Icon size={20} fill={active || isEmergency ? "currentColor" : "none"} fillOpacity={0.2} />
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex justify-between items-center">
          <p className="text-white text-sm font-bold leading-tight">{title}</p>
          <span className={`text-[10px] font-bold ${isEmergency ? 'text-red-500' : 'text-[#919fca]'}`}>
            {status}
          </span>
        </div>
        <p className={`text-xs truncate mt-0.5 ${active ? 'text-white font-medium' : 'text-[#919fca]'}`}>
          {subtext}
        </p>
      </div>
    </div>
  );
};

const MessageBubble = ({ sender, callsign, time, text, isOperator = false, status }) => (
  <div className={`flex items-start gap-3 max-w-[80%] ${isOperator ? 'ml-auto flex-row-reverse' : ''}`}>
    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${
      isOperator ? 'bg-[#0f47f0] border-[#0f47f0]/50 text-white' : 'bg-[#1b2136] border-[#323f67] text-[#919fca]'
    }`}>
      {callsign}
    </div>
    <div className={`flex flex-col gap-1 ${isOperator ? 'items-end' : ''}`}>
      <div className={`flex items-baseline gap-2 ${isOperator ? 'flex-row-reverse' : ''}`}>
        <span className="text-xs font-bold text-white">{sender}</span>
        <span className="text-[10px] text-[#919fca]">{time}</span>
      </div>
      <div className={`p-3 rounded-lg border shadow-lg ${
        isOperator ? 'bg-[#0f47f0] border-transparent text-white rounded-tr-none' : 
        'bg-[#1b2136] border-[#323f67] text-[#e2e8f0] rounded-tl-none'
      }`}>
        <p className="text-sm leading-relaxed">{text}</p>
      </div>
      {status && (
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-[9px] font-bold uppercase tracking-tighter ${status === 'Acknowledged' ? 'text-green-500' : 'text-[#919fca]'}`}>
            {status}
          </span>
          <span className="text-[12px]">✓✓</span>
        </div>
      )}
    </div>
  </div>
);

// --- Main Page Component ---

const Communication = () => {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#101422] text-white font-sans selection:bg-[#0f47f0]/30">
      
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#323f67] bg-[#101422] px-10 py-3 shrink-0 z-10">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="size-5 text-[#0f47f0]">
              <Shield fill="currentColor" fillOpacity={0.2} />
            </div>
            <h2 className="text-lg font-bold tracking-tight">Mission Control</h2>
          </div>
          <div className="relative flex items-center w-64">
            <Search className="absolute left-3 text-[#919fca]" size={18} />
            <input 
              className="w-full bg-[#1b2136] border-none rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-[#0f47f0] placeholder:text-[#919fca]" 
              placeholder="Search mission logs..." 
            />
          </div>
        </div>
        
        <nav className="flex items-center gap-9">
          {['Dashboard', 'Surveillance', 'Messages', 'Logistics'].map((item) => (
            <a 
              key={item} 
              href={`#${item.toLowerCase()}`}
              className={`text-sm font-medium transition-colors ${item === 'Messages' ? 'text-white border-b-2 border-[#0f47f0] pb-1' : 'text-[#919fca] hover:text-white'}`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {[Bell, Lock, Settings].map((Icon, i) => (
              <button key={i} className="p-2 rounded-lg bg-[#1b2136] border border-[#323f67] text-white hover:bg-[#323f67] transition-colors">
                <Icon size={18} />
              </button>
            ))}
          </div>
          <div className="size-10 rounded-full border-2 border-[#0f47f0] bg-slate-700 bg-[url('https://i.pravatar.cc/100?u=operator')] bg-cover" />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar */}
        <aside className="w-80 border-r border-[#323f67] flex flex-col shrink-0 bg-[#101422]">
          <div className="p-4 border-b border-[#323f67]">
            <h1 className="text-sm font-bold uppercase tracking-widest text-white">Communication Hub</h1>
            <p className="text-[#919fca] text-xs mt-1">12 Units Active • 2 Alerts</p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar">
            <section>
              <p className="px-3 py-2 text-[#919fca] text-[10px] font-black uppercase tracking-widest">Priority Threads</p>
              <SidebarThread 
                title="Bravo Squad" 
                status="EMERGENCY" 
                subtext="Medical assistance required..." 
                icon={CircleAlert} 
                type="emergency" 
              />
            </section>
            
            <section className="space-y-1">
              <p className="px-3 py-2 text-[#919fca] text-[10px] font-black uppercase tracking-widest">Active Squads</p>
              <SidebarThread title="Alpha Team" status="2m ago" subtext="Objective secured. Awaiting extraction." icon={MapPin} active />
              <SidebarThread title="Delta Unit" status="15m ago" subtext="En-route to Waypoint Charlie." icon={Radar} />
              <SidebarThread title="Logistic Support" status="3h ago" subtext="Resupply drop scheduled for 0400." icon={LifeBuoy} />
            </section>
          </div>

          <div className="p-4 border-t border-[#323f67] flex items-center justify-between bg-[#0d101b]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-[#919fca] uppercase">System Online</span>
            </div>
            <span className="text-[10px] text-[#919fca] font-mono">v2.4.1-A</span>
          </div>
        </aside>

        {/* Center Chat Area */}
        <section className="flex-1 flex flex-col bg-[#101422]">
          
          {/* SOS Banner */}
          <div className="bg-red-500/10 border-b border-red-500/30 p-3">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="bg-red-500/20 text-red-500 p-2 rounded-full animate-bounce">
                  <Home size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-white uppercase">SOS ALERT: SQUAD BRAVO</p>
                  <p className="text-red-500 text-xs font-mono tracking-tighter">Sector 7 • 34.0522° N, 118.2437° W</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider transition-colors">Dispatch Medic</button>
                <button className="bg-[#1b2136] border border-red-500/30 px-4 py-1.5 rounded text-[10px] font-black uppercase tracking-wider hover:bg-[#252d4a] transition-colors">View Map</button>
              </div>
            </div>
          </div>

          {/* Chat Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#323f67] bg-[#101422]/60 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0f47f0]/20 border border-[#0f47f0]/30 flex items-center justify-center text-[#0f47f0]">
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white">Alpha Team Channel</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] text-[#919fca] font-bold uppercase tracking-widest">4 Personnel Connected</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 text-[#919fca]">
              <button className="p-2 hover:text-white transition-colors"><Phone size={20} /></button>
              <button className="p-2 hover:text-white transition-colors"><Video size={20} /></button>
              <button className="p-2 hover:text-white transition-colors"><Info size={20} /></button>
            </div>
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            <MessageBubble sender="Sgt. Miller" callsign="S-01" time="14:20:05" text="Proceeding to extraction point Delta. Alpha squad currently in high cover. No hostiles detected in immediate 200m radius." />
            <MessageBubble sender="Mission Control" callsign="MC" time="14:21:12" text="Copy that, Alpha. Extraction ETA is 14:35. Maintain current position. Do not engage unless fired upon." isOperator status="Acknowledged" />
            <MessageBubble sender="Sgt. Miller" callsign="S-01" time="14:22:45" text="Objective Alpha-1 secured. Secure drive recovered and encrypted. Ready for exfil." />
            <MessageBubble sender="Mission Control" callsign="MC" time="14:23:10" text="Understood. Standby for LZ coordinates. Monitoring regional activity." isOperator status="Delivered" />
          </div>

          {/* Chat Input */}
          <footer className="p-4 border-t border-[#323f67] bg-[#0d101b]">
            <div className="max-w-5xl mx-auto space-y-3">
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {['Status Report', 'Hold Position', 'Evac Initiate', 'Confirm Intel', 'RTB'].map(cmd => (
                  <button key={cmd} className="shrink-0 px-3 py-1.5 rounded-lg bg-[#1b2136] border border-[#323f67] text-[9px] font-black text-[#919fca] uppercase hover:border-[#0f47f0] hover:text-white transition-all">
                    [CMD] {cmd}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <div className="flex-1 relative flex items-center">
                  <input 
                    className="w-full bg-[#1b2136] border border-[#323f67] rounded-xl py-3.5 px-5 text-sm text-white placeholder:text-[#919fca] focus:ring-1 focus:ring-[#0f47f0] focus:border-[#0f47f0] outline-none"
                    placeholder="Type command or message to Alpha Team..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <div className="absolute right-4 flex gap-3 text-[#919fca]">
                    <button className="hover:text-white"><Paperclip size={20} /></button>
                    <button className="hover:text-white"><Smile size={20} /></button>
                  </div>
                </div>
                <button className="bg-[#0f47f0] hover:bg-[#0f47f0]/80 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-[#0f47f0]/20 transition-all">
                  <Send size={20} className="ml-1" />
                </button>
              </div>
            </div>
          </footer>
        </section>

        {/* Right Info Panel */}
        <aside className="w-72 border-l border-[#323f67] bg-[#101422] p-4 hidden xl:flex flex-col gap-6">
          <section>
            <h4 className="text-[10px] font-black text-[#919fca] uppercase tracking-[0.2em] mb-3">Unit Location</h4>
            <div className="h-40 w-full rounded-lg bg-[#1b2136] border border-[#323f67] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0f47f0]/20 to-transparent" />
              <img className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" src="https://api.placeholder.com/400/300?text=Satelitte+Map" alt="Map" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#0f47f0] animate-pulse">
                <Navigation fill="currentColor" size={24} />
              </div>
            </div>
            <p className="text-[10px] text-[#919fca] mt-2 text-center font-mono">34.0522° N, 118.2437° W • 248m ALT</p>
          </section>

          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-[#919fca] uppercase tracking-[0.2em] mb-1">Squad Status</h4>
            {[
              { name: "Sgt. Miller (LDR)", status: "STABLE", color: "bg-green-500", val: 92 },
              { name: "Cpl. Davis (MED)", status: "STABLE", color: "bg-green-500", val: 88 },
              { name: "Pvt. Chen (COM)", status: "CAUTION", color: "bg-yellow-500", val: 65 }
            ].map(unit => (
              <div key={unit.name} className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-white">{unit.name}</span>
                  <span className={unit.color.replace('bg-', 'text-')}>{unit.status}</span>
                </div>
                <div className="w-full h-1 bg-[#1b2136] rounded-full overflow-hidden">
                  <div className={`h-full ${unit.color} transition-all duration-1000`} style={{ width: `${unit.val}%` }} />
                </div>
              </div>
            ))}
          </section>

          <div className="mt-auto p-4 bg-[#1b2136] rounded-xl border border-[#323f67] shadow-inner">
            <p className="text-[10px] font-black text-[#919fca] uppercase tracking-widest mb-3">Signal Strength</p>
            <div className="flex items-end gap-1.5 h-8">
              {[30, 50, 70, 90, 40].map((h, i) => (
                <div key={i} className={`w-2 rounded-t-sm transition-all duration-500 ${i === 4 ? 'bg-[#323f67]' : 'bg-[#0f47f0] shadow-[0_0_10px_rgba(15,71,240,0.4)]'}`} style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="text-[10px] text-[#0f47f0] font-black mt-3 flex items-center gap-2">
              <Wifi size={12} /> ENCRYPTED L-BAND 80%
            </p>
          </div>
        </aside>

      </main>

      {/* Global CSS for scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #111522; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #323f67; border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}} />
    </div>
  );
};

export default Communication;