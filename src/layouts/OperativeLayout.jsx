import React from 'react';
import { Outlet, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMission } from '../context/MissionContext';
import { Shield, Activity, MapPin, MessageSquare, ChevronLeft } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
    <div
        onClick={onClick}
        className={`flex items-center gap-3 px-6 py-3 cursor-pointer transition-all border-l-4 ${active
                ? 'bg-blue-600/20 text-blue-400 border-blue-500'
                : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800/30'
            }`}>
        <Icon size={18} />
        <span className="text-sm font-medium">{label}</span>
    </div>
);

const OperativeLayout = () => {
    const { soldierId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { getSoldierById, loading } = useMission();

    const soldier = getSoldierById(soldierId);
    const globalAlert = soldier?.status === 'CRITICAL';

    if (loading) return <div className="h-screen bg-[#101422] flex items-center justify-center text-blue-500">INITIALIZING UPLINK...</div>;
    if (!soldier) return <div className="h-screen bg-[#101422] flex items-center justify-center text-red-500">OPERATIVE NOT FOUND // SIGNAL LOST</div>;

    const isActive = (path) => location.pathname.includes(path);

    return (
        <div className={`flex h-screen bg-[#101422] text-slate-200 font-sans overflow-hidden transition-all duration-500 ${globalAlert ? 'shadow-[inset_0_0_80px_rgba(225,29,72,0.1)]' : ''}`}>

            {/* GLOBAL SIDEBAR */}
            <aside className="w-64 bg-[#101422] border-r border-slate-800 flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-3 border-b border-slate-800 mb-4">
                    <div className="bg-blue-600 p-1.5 rounded shadow-[0_0_15px_rgba(37,99,235,0.4)]">
                        <Shield className="text-white" size={20} />
                    </div>
                    <h1 className="text-sm font-black uppercase tracking-tighter text-white">Mission Control</h1>
                </div>

                <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-800 mb-2">
                    <div className="relative">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${soldier.name}`} className={`size-10 rounded-full bg-slate-800 border-2 ${globalAlert ? 'border-rose-500' : 'border-blue-500'}`} alt="Avatar" />
                        <div className={`absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-[#101422] ${globalAlert ? 'bg-rose-500 animate-ping' : 'bg-emerald-500'}`} />
                    </div>
                    <div>
                        <h2 className="text-xs font-bold text-white uppercase">{soldier.name}</h2>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">{soldier.rank}</p>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    <SidebarItem
                        icon={Activity}
                        label="Vitals"
                        active={isActive('vitals')}
                        onClick={() => navigate(`/operative/${soldierId}/vitals`)}
                    />
                    <SidebarItem
                        icon={MessageSquare}
                        label="Communication"
                        active={isActive('communication')}
                        onClick={() => navigate(`/operative/${soldierId}/communication`)}
                    />
                    <SidebarItem
                        icon={MapPin}
                        label="Location"
                        active={isActive('location')}
                        onClick={() => navigate(`/operative/${soldierId}/location`)}
                    />
                </nav>

                <div className="p-6 border-t border-slate-800">
                    <button onClick={() => navigate('/Dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors w-full justify-center">
                        <ChevronLeft size={16} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Return to Dashboard</span>
                    </button>
                </div>
            </aside>

            {/* CONTENT AREA */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                <Outlet context={{ soldier, globalAlert }} />
            </main>
        </div>
    );
};

export default OperativeLayout;
