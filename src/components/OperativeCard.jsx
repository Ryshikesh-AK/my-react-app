import React from 'react';

const OperativeCard = ({ soldier, onClick, onEdit, onDelete }) => {
    const isCritical = soldier.status === 'CRITICAL';
    return (
        <div
            onClick={onClick}
            className={`bg-[#0a0f1e]/90 backdrop-blur-md border p-3 transition-all cursor-pointer group rounded ${isCritical ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)] animate-pulse' : 'border-[#1a2238] hover:border-blue-500/50'
                }`}
        >
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`size-1.5 rounded-full ${isCritical ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-blue-400'}`}></div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-300">{soldier.name}</span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span onClick={(e) => { e.stopPropagation(); onEdit(); }} className="material-symbols-outlined text-[14px] hover:text-blue-400">edit</span>
                    <span onClick={(e) => { e.stopPropagation(); onDelete(); }} className="material-symbols-outlined text-[14px] hover:text-red-500">delete</span>
                </div>
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <p className="text-[8px] text-[#4a5578] uppercase font-black">{soldier.rank}</p>
                    <p className="text-xl font-mono font-bold text-white leading-none">{soldier.bpm}<span className="text-[9px] ml-1 text-blue-500 font-normal">BPM</span></p>
                </div>
            </div>
        </div>
    );
};

export default OperativeCard;
