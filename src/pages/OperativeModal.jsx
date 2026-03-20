import React, { useState, useEffect } from 'react';
import { X, User, Cpu, ShieldCheck, Bluetooth } from 'lucide-react';

const OperativeModal = ({ isOpen, onClose, onAddAgent, initialData }) => {
  const [formData, setFormData] = useState({
    name: '', // Changed callsign to name to match your Dashboard/Firebase
    serviceId: '',
    rank: '',
    device: 'MW-BIO-091'
  });

  // CRITICAL: Sync form data when editing or opening for a new agent
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        serviceId: initialData.serviceId || '',
        rank: initialData.rank || '',
        device: initialData.device || 'MW-BIO-091'
      });
    } else {
      // Reset for new deployment
      setFormData({ name: '', serviceId: '', rank: '', device: 'MW-BIO-091' });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Pass the data to the handleSaveOperative in Dashboard
    onAddAgent({
      ...formData,
      // Keep existing vitals if editing, or set defaults if new
      bpm: initialData?.bpm || 72,
      spo2: initialData?.spo2 || 98,
      status: initialData?.status || 'STABLE'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#0a0f1a] border border-cyan-500/30 rounded-lg shadow-[0_0_50px_rgba(6,182,212,0.15)] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-cyan-500/20 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-tighter">
              {initialData ? 'Update Operative' : 'Operative Enrollment'}
            </h2>
            <p className="text-[10px] text-cyan-500/60 font-bold uppercase tracking-widest mt-1">
              {initialData ? `Patching Link // ${initialData.id}` : 'Secure Protocol // Unit-7 Synchronization'}
            </p>
          </div>
          <button onClick={onClose} className="text-cyan-500/50 hover:text-cyan-400 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          
          {/* Section 1: Personal Identity */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest">
              <User size={14} className="text-cyan-400" /> Personal Identity
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-cyan-500 font-black uppercase">Callsign</label>
                <input 
                  required
                  name="name" // Matches soldier.name
                  value={formData.name}
                  onChange={handleChange}
                  type="text" 
                  placeholder="e.g. GHOST-1"
                  className="w-full bg-[#111827] border border-cyan-500/20 rounded p-3 text-sm text-white focus:border-cyan-400 outline-none transition-all placeholder:text-cyan-900"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-cyan-500 font-black uppercase">Service ID</label>
                <input 
                  required
                  name="serviceId"
                 value={initialData ? formData.serviceId : "PENDING DEPLOYMENT..."}
                  onChange={handleChange}
                  type="text" 
                  readOnly={true}
                  placeholder="ID-XXXXX"
                  className="w-full bg-[#111827] border border-cyan-500/20 rounded p-3 text-sm text-white focus:border-cyan-400 outline-none transition-all placeholder:text-cyan-900"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-cyan-500 font-black uppercase">Rank</label>
              <select 
                required
                name="rank"
                value={formData.rank}
                onChange={handleChange}
                className="w-full bg-[#111827] border border-cyan-500/20 rounded p-3 text-sm text-white focus:border-cyan-400 outline-none appearance-none cursor-pointer"
              >
                <option value="">Select Rank</option>
                <option value="Sergeant">Sergeant</option>
                <option value="Lieutenant">Lieutenant</option>
                <option value="Captain">Captain</option>
              </select>
            </div>
          </section>

          {/* Section 2: Device Pairing */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-white/90 text-xs font-bold uppercase tracking-widest">
              <Bluetooth size={14} className="text-cyan-400" /> Device Pairing
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-cyan-500/5 border border-cyan-400/40 rounded group cursor-pointer">
                <div className="flex items-center gap-4">
                  <Cpu className="text-cyan-400" size={20} />
                  <div>
                    <p className="text-xs font-black text-white uppercase tracking-tight">{formData.device}</p>
                    <p className="text-[9px] text-cyan-600 font-bold uppercase">Secure Mesh Node</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3].map(i => <div key={i} className={`w-1 h-3 ${i < 3 ? 'bg-cyan-400' : 'bg-cyan-950'} rounded-full`} />)}
                  </div>
                  <div className="size-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                </div>
              </div>
            </div>
          </section>

          {/* Footer Actions */}
          <div className="pt-6 border-t border-cyan-500/10 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-8 py-2 border border-cyan-500/30 text-cyan-500 text-[11px] font-black uppercase tracking-widest hover:bg-cyan-500/10 transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-8 py-2 bg-cyan-400 text-black text-[11px] font-black uppercase tracking-widest hover:bg-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all flex items-center gap-2"
            >
              <ShieldCheck size={14} /> {initialData ? 'Update & Sync' : 'Sync & Deploy'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OperativeModal;