import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useMission } from '../context/MissionContext';
// 🛰️ FIREBASE IMPORTS
import { db } from '../Firebase'; 
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';

import {
  Search, Bell, Settings, CircleAlert,
  MapPin, Radar, LayoutDashboard, Users,
  Phone, Video, Info, Paperclip, Smile,
  Send, Navigation, Shield, Wifi, Activity, MessageSquare, ChevronLeft,
  X, Crosshair, Maximize2, Droplets, Heart, CheckCheck
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false, onClick, badge }) => (
  <div
    onClick={onClick}
    className={`flex items-center justify-between px-6 py-3 cursor-pointer transition-all border-l-4 ${active
      ? 'bg-blue-600/10 text-blue-400 border-blue-500'
      : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/30'
      }`}>
    <div className="flex items-center gap-3">
      <Icon size={18} />
      <span className="text-sm font-bold uppercase tracking-tight">{label}</span>
    </div>
    {badge && <span className="bg-rose-600 text-[10px] px-1.5 py-0.5 rounded font-black text-white">{badge}</span>}
  </div>
);

const CommunicationHub = ({ embedded = false }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [showLargeMap, setShowLargeMap] = useState(false);
  const [messages, setMessages] = useState([]); 
  
  const context = useOutletContext();
  const soldierFromContext = context?.soldier;
  const { squads, soldiers } = useMission();
  
  // Find the most up-to-date soldier data from our MissionContext
  const soldier = soldiers?.find(s => s.id === soldierFromContext?.id) || soldierFromContext;
  const chatEndRef = useRef(null);

  // --- 🛰️ FIREBASE REAL-TIME LISTENER ---
  useEffect(() => {
    if (!soldier?.id) return;

    const unsub = onSnapshot(doc(db, "soldiers", soldier.id), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        
        // If the soldier sends an ACK, add it to the chat stream
        if (data.lastMessageFromSoldier) {
          const incomingMsg = {
            id: Date.now(),
            sender: 'soldier',
            text: data.lastMessageFromSoldier,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          
          setMessages(prev => {
            // Prevent duplicate entries of the same ACK
            if (prev.length > 0 && prev[prev.length - 1].text === data.lastMessageFromSoldier) return prev;
            return [...prev, incomingMsg];
          });
        }
      }
    });

    return () => unsub();
  }, [soldier?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 📤 SEND COMMAND TO FIREBASE ---
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !soldier?.id) return;

    const commandText = input;
    setInput('');

    try {
      await updateDoc(doc(db, "soldiers", soldier.id), {
        lastMessageFromHQ: commandText,
        hqMessageTime: serverTimestamp(),
        lastMessageFromSoldier: "" // Clear previous ACK to prepare for new one
      });

      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'admin',
        text: commandText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error("Transmission Error:", error);
    }
  };

  // --- 🚨 RESET SOS ALERT ---
  const clearEmergency = async () => {
    if (!soldier?.id) return;
    try {
      await updateDoc(doc(db, "soldiers", soldier.id), {
        sosActive: false
      });
    } catch (error) {
      console.error("Failed to clear SOS:", error);
    }
  };

  const currentSquad = squads?.find(s => s.id === soldier?.squadId);
  const isEmergencyActive = soldier?.sosActive;

  return (
    <div className={`flex h-screen bg-[#0d101b] text-slate-200 font-sans overflow-hidden relative ${embedded ? 'h-full' : ''}`}>

      {/* 🔴 SATELLITE HUD OVERLAY */}
      {showLargeMap && (
        <div className="absolute inset-0 z-[100] bg-[#0d101b]/98 p-10 flex flex-col animate-in fade-in zoom-in duration-300">
          <div className="flex justify-between items-start mb-8">
            <div className="border-l-4 border-blue-500 pl-6">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Satellite Uplink // {currentSquad?.location || 'Unknown Sector'}</h2>
              <p className="text-blue-500 font-mono text-xs mt-1">SQUAD POSITIONING ACTIVE • TARGET {soldier?.name?.toUpperCase()} • REFRESH RATE: 0.2ms</p>
            </div>
            <button onClick={() => setShowLargeMap(false)} className="bg-slate-800 p-4 rounded-full hover:bg-rose-600 transition-colors">
              <X size={28} />
            </button>
          </div>
          <div className="flex-1 border border-blue-500/20 rounded-3xl relative overflow-hidden bg-slate-900 shadow-[0_0_100px_rgba(37,99,235,0.1)]">
            <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" className="w-full h-full object-cover grayscale opacity-20" alt="map" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <Crosshair size={40} className="text-blue-500 animate-pulse" />
              <div className="mt-4 bg-blue-600 text-white px-4 py-1 rounded-sm text-[10px] font-black uppercase tracking-widest">TARGET: {soldier?.name || 'UNKNOWN'}</div>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(37,99,235,0.05)_50%,transparent_100%)] h-1/4 w-full animate-scan" />
          </div>
        </div>
      )}

      {/* --- LEFT SIDEBAR --- */}
      {!embedded && (
        <aside className="w-72 bg-[#101422] border-r border-slate-800 flex flex-col shrink-0">
          <div className="p-8 flex items-center gap-3 border-b border-slate-800">
            <div className="bg-blue-600 p-2 rounded shadow-lg shadow-blue-900/40">
              <Shield size={20} className="text-white" />
            </div>
            <h1 className="text-md font-black uppercase tracking-tighter text-white">Mission Control</h1>
          </div>
          <nav className="flex-1 mt-6">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" onClick={() => navigate('/Dashboard')} />
            <SidebarItem icon={Activity} label="Vitals" onClick={() => navigate('/operative-status')} />
            <SidebarItem icon={MessageSquare} label="Messages" active badge={messages.filter(m => m.sender === 'soldier').length || null} />
          </nav>
        </aside>
      )}

      {/* --- CENTER CHAT STREAM --- */}
      <main className="flex-1 flex flex-col bg-[#101422]">
        
        <header className="h-20 border-b border-slate-800 px-10 flex items-center justify-between bg-[#101422]/80 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-blue-500 overflow-hidden">
                <img 
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${soldier?.name || 'default'}`} 
                  alt="avatar" 
                  className="w-8 h-8 opacity-80"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-[#101422] animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-white uppercase leading-none">
                {soldier?.name || 'Operative'} 
              </h3>
              <p className="text-[10px] text-slate-500 font-mono mt-1 uppercase tracking-widest">
                Uplink: Firebase Encrypted // {soldier?.rank || 'Field Agent'}
              </p>
            </div>
          </div>
        </header>

        {/* SOS ALERT BOX */}
        {isEmergencyActive && (
          <div className="bg-rose-600/10 border-b border-rose-600/30 px-10 py-4 flex justify-between items-center animate-pulse">
            <div className="flex items-center gap-4">
              <CircleAlert className="text-rose-600" size={24} />
              <p className="text-xs font-black text-rose-500 uppercase tracking-tight">SOS ALERT: {soldier?.name} // STATUS CRITICAL</p>
            </div>
            <div className="flex gap-3">
               <button className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded font-black text-[10px] uppercase transition-all shadow-lg shadow-rose-900/20">Dispatch Medic</button>
               <button onClick={clearEmergency} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded font-black text-[10px] uppercase">Clear Alert</button>
            </div>
          </div>
        )}

        {/* --- DYNAMIC MESSAGE STREAM --- */}
        <div className="flex-1 overflow-y-auto p-10 space-y-6 custom-scrollbar bg-[#0d101b]/30">
          {messages.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center opacity-10">
               <MessageSquare size={64} />
               <p className="text-[10px] font-black tracking-[0.4em] uppercase mt-4">Secure Stream Initialized</p>
             </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
              <div className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className={`px-5 py-3 rounded-2xl text-sm shadow-lg border ${
                  msg.sender === 'admin' 
                    ? 'bg-blue-600 border-blue-500 text-white rounded-br-none' 
                    : 'bg-[#1a2036] border-slate-800 text-slate-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-2 mt-2 px-1">
                  <span className="text-[9px] text-slate-600 font-mono uppercase">{msg.sender} • {msg.time}</span>
                  {msg.sender === 'admin' && <CheckCheck size={12} className="text-blue-500" />}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <footer className="p-8 border-t border-slate-800 bg-[#0d101b]">
          <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-4">
            <input 
              className="flex-1 bg-[#1b2136] border border-slate-800 rounded-2xl py-5 px-8 text-sm outline-none focus:border-blue-500 transition-colors text-white placeholder-slate-600" 
              placeholder={`Send command to ${soldier?.name || 'Operative'}...`} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button 
              type="submit"
              className="bg-blue-600 w-16 rounded-2xl flex items-center justify-center hover:bg-blue-500 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
            >
              <Send size={24} className="text-white" />
            </button>
          </form>
        </footer>
      </main>

      {/* --- RIGHT INFO PANEL --- */}
      <aside className="w-80 border-l border-slate-800 bg-[#101422] p-6 hidden xl:flex flex-col">
        <section className="mb-8">
          <h4 className="text-[10px] font-black text-[#919fca] uppercase tracking-[0.2em] mb-4">Unit Location</h4>
          <div
            onClick={() => setShowLargeMap(true)}
            className={`h-48 w-full rounded-lg bg-[#1b2136] border relative overflow-hidden group cursor-pointer transition-all duration-500 ${isEmergencyActive
              ? 'border-rose-500/50 shadow-[0_0_15px_rgba(225,29,72,0.2)] animate-pulse-tactical'
              : 'border-[#323f67] hover:border-blue-500'
              }`}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#0f47f0]/20 to-transparent" />
            <img className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80" alt="Map" />
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${isEmergencyActive ? 'text-rose-500' : 'text-[#0f47f0]'} animate-pulse`}>
              <Navigation fill="currentColor" size={28} />
            </div>
          </div>
          <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-800/50">
             <p className="text-xs text-blue-400 text-center font-mono font-bold uppercase tracking-widest">
               {soldier?.coordinates ? `${soldier.coordinates[1].toFixed(4)} N / ${soldier.coordinates[0].toFixed(4)} W` : 'UPLINKING...'}
             </p>
          </div>
        </section>

        <div className="p-3 bg-slate-900/40 rounded-lg border border-slate-800/50 mt-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Signal Integrity</span>
            <span className="text-[10px] font-mono text-blue-400">0.02ms</span>
          </div>
          <div className="flex items-end gap-1 h-5">
            {[30, 60, 45, 90, 75, 40, 80, 50, 95, 65].map((h, i) => (
              <div key={i} className="flex-1 bg-blue-600/40 rounded-t-[1px]" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      </aside>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan { from { top: -20%; } to { top: 120%; } }
        @keyframes pulse-tactical {
          0% { border-color: rgba(225, 29, 72, 0.3); }
          50% { border-color: rgba(225, 29, 72, 0.7); }
          100% { border-color: rgba(225, 29, 72, 0.3); }
        }
        .animate-scan { animation: scan 4s linear infinite; }
        .animate-pulse-tactical { animation: pulse-tactical 2s ease-in-out infinite; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default CommunicationHub;