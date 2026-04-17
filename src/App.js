import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Monitor, Plus, Trash2, Settings, RefreshCw, Search, Server, LogOut, Sun, Moon, 
  Eye, EyeOff, Lock, Maximize2, Keyboard, Camera, X, PanelLeftClose, PanelLeftOpen, 
  Loader2, AlertCircle, WifiOff, User, ShieldCheck, UserPlus, ArrowLeft, CheckCircle2, KeyRound,
  Activity, Cpu, ShieldAlert, Database
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// ==========================================
// 1. KOMPONEN AUTH (CYBER LOGIN)
// ==========================================
const AuthView = ({ theme, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState('login');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMsg(null);
    try {
      const endpoint = authMode === 'login' ? '/login' : '/register';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Proses gagal');
      if (authMode === 'login') onLoginSuccess(data.token, data.username);
      else {
        setSuccessMsg(data.message);
        setAuthMode('login');
        setFormData({ username: '', password: '' });
      }
    } catch (err) { setError(err.message); } finally { setIsSubmitting(false); }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`relative h-screen w-full flex items-center justify-center font-sans overflow-hidden p-4 transition-colors duration-500 ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      {/* Grid Background */}
      <div className={`absolute inset-0 pointer-events-none z-0 opacity-30 ${isDark ? 'bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]'} bg-[size:40px_40px]`}></div>
      
      {/* Scanline Effect - Hanya di mode gelap */}
      {isDark && <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] z-0 opacity-20"></div>}
      
      <div className="relative w-full max-w-md z-10 animate-in fade-in zoom-in duration-700">
        <div className="text-center mb-8">
          <div className="relative inline-block">
             <div className={`absolute inset-0 blur-2xl opacity-20 animate-pulse ${isDark ? 'bg-blue-500' : 'bg-blue-400'}`}></div>
             <div className={`relative p-4 rounded-2xl border mb-6 inline-flex shadow-xl ${isDark ? 'bg-slate-900 border-blue-500/50' : 'bg-white border-blue-200'}`}>
                <ShieldCheck size={40} className="text-blue-500" />
             </div>
          </div>
          <h1 className={`text-2xl font-black uppercase tracking-tighter mb-1 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
            PT KARYAINDAH ALAM SEJAHTERA
          </h1>
          <div className="flex items-center justify-center gap-2 opacity-60">
             <span className={`h-px w-8 ${isDark ? 'bg-blue-500/50' : 'bg-blue-300'}`}></span>
             <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Industrial Access Point</p>
             <span className={`h-px w-8 ${isDark ? 'bg-blue-500/50' : 'bg-blue-300'}`}></span>
          </div>
        </div>

        <div className={`backdrop-blur-md border p-8 rounded-3xl shadow-2xl relative transition-all ${isDark ? 'bg-slate-900/80 border-slate-800 border-t-blue-500/50' : 'bg-white/90 border-slate-200 border-t-blue-400'}`}>
          <div className="flex justify-between items-center mb-8">
            <h2 className={`font-bold text-sm uppercase tracking-widest font-mono ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
               {authMode === 'login' ? '>> System_Login' : '>> Account_Registration'}
            </h2>
            <button 
              type="button"
              onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(null); setSuccessMsg(null); }} 
              className={`text-[10px] font-bold transition-colors uppercase cursor-pointer relative z-20 ${isDark ? 'text-slate-500 hover:text-blue-400' : 'text-slate-400 hover:text-blue-600'}`}
            >
              {authMode === 'login' ? '[ Create Account ]' : '[ Back ]'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Auth_UID</label>
              <div className="relative group">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${isDark ? 'text-slate-600 group-focus-within:text-blue-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={16} />
                <input 
                  required 
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none border transition-all font-mono ${isDark ? 'border-slate-800 bg-slate-950/50 focus:border-blue-500/50 text-white' : 'border-slate-200 bg-slate-50 focus:border-blue-400 text-slate-900'}`} 
                  placeholder="Username" 
                  value={formData.username} 
                  onChange={e => setFormData({...formData, username: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 ml-1">Auth_Passkey</label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${isDark ? 'text-slate-600 group-focus-within:text-blue-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={16} />
                <input 
                  type="password" 
                  required 
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl text-sm outline-none border transition-all font-mono ${isDark ? 'border-slate-800 bg-slate-950/50 focus:border-blue-500/50 text-white' : 'border-slate-200 bg-slate-50 focus:border-blue-400 text-slate-900'}`} 
                  placeholder="••••••••" 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
              </div>
            </div>
            {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[11px] text-rose-500 flex gap-2 animate-shake"><AlertCircle size={14}/> {error}</div>}
            {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-600 flex gap-2"><CheckCircle2 size={14}/> {successMsg}</div>}
            
            <button disabled={isSubmitting} type="submit" className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] cursor-pointer relative z-30 ${isDark ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'}`}>
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Activity size={16} />}
              {isSubmitting ? 'Accessing...' : 'Initialize_System'}
            </button>
          </form>
        </div>
        <p className="text-center mt-8 text-[9px] text-slate-500 font-bold tracking-[0.3em] uppercase">
          Authorization required • Terminal node: 0x24 • PT KAS © 2026
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 2. KOMPONEN SIDEBAR (INDUSTRIAL TECH)
// ==========================================
const Sidebar = ({ 
  theme, isOpen, setIsOpen, servers, isLoading, isPinging, searchQuery, setSearchQuery, 
  activeServer, setActiveServer, onAddClick, onDeleteServer, checkStatus, username, onLogout, onSettingsClick 
}) => {
  const isDark = theme === 'dark';
  const filteredServers = useMemo(() => 
    servers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [servers, searchQuery]
  );

  return (
    <aside className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'} ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 lg:border-none'}`}>
      <div className={`flex flex-col h-full w-72 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Header Sidebar */}
        <div className={`p-6 border-b relative overflow-hidden text-left ${isDark ? 'border-slate-800 bg-slate-900/30' : 'border-slate-100 bg-slate-50/50'}`}>
          <div className={`absolute -right-4 -top-4 opacity-5 rotate-12 pointer-events-none ${isDark ? 'text-white' : 'text-slate-900'}`}><Cpu size={100} /></div>
          <button onClick={() => setIsOpen(false)} className="absolute top-6 right-4 p-1 lg:hidden text-slate-500 hover:text-rose-500"><X size={20}/></button>
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg"><Monitor size={20}/></div>
            <h1 className={`text-lg font-black tracking-tighter font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>VNC_CLOUD</h1>
          </div>
          <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest leading-none">PT KARYAINDAH ALAM SEJAHTERA</p>
        </div>

        {/* Content Sidebar */}
        <div className="p-4 flex-1 overflow-y-auto text-left space-y-6 custom-scrollbar">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14}/>
            <input type="text" placeholder="Search Node..." className={`w-full border rounded-lg py-2.5 pl-9 pr-4 text-[11px] outline-none transition-all font-mono ${isDark ? 'bg-slate-900/50 border-slate-800 focus:border-blue-500/50 text-slate-300' : 'bg-slate-50 border-slate-200 focus:border-blue-400 text-slate-900'}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Activity size={12} className="text-blue-500" /> Control_Nodes
              </span>
              <button onClick={checkStatus} className={`p-1.5 border rounded-md transition-all ${isDark ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-blue-600'} ${isPinging ? 'animate-spin text-blue-500' : ''}`}><RefreshCw size={12}/></button>
            </div>

            <nav className="space-y-1.5">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 opacity-40">
                  <Loader2 className="animate-spin mb-2" size={16}/><span className="text-[10px] uppercase font-bold tracking-widest">Scanning...</span>
                </div>
              ) : (
                filteredServers.map(server => (
                  <div key={server.id} onClick={() => setActiveServer(server)} className={`group relative p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all overflow-hidden border ${activeServer?.id === server.id ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-600/20' : isDark ? 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700 hover:bg-slate-900' : 'bg-slate-50 border-slate-100 hover:border-slate-300 hover:bg-white'}`}>
                    {activeServer?.id === server.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-white pointer-events-none"></div>}
                    <div className="flex items-center gap-3 truncate relative z-10 pointer-events-none">
                      <div className={`shrink-0 w-2 h-2 rounded-full transition-all duration-1000 ${
                        server.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                        server.status === 'offline' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-slate-400'
                      }`} />
                      <div className="truncate">
                        <p className={`text-xs font-bold truncate ${activeServer?.id === server.id ? 'text-white' : isDark ? 'text-slate-300' : 'text-slate-800'}`}>{server.name}</p>
                        <p className={`text-[9px] font-mono truncate ${activeServer?.id === server.id ? 'text-blue-100' : isDark ? 'text-slate-600' : 'text-slate-500'}`}>{server.host}</p>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onDeleteServer(server.id); }} className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity relative z-20 ${activeServer?.id === server.id ? 'hover:bg-white/20 text-white' : 'hover:bg-rose-500/10 text-rose-500'}`}><Trash2 size={13}/></button>
                  </div>
                ))
              )}
              <button onClick={onAddClick} className={`w-full flex items-center justify-center gap-2 p-3 mt-4 text-[10px] font-black border border-dashed rounded-xl transition-all uppercase tracking-widest ${isDark ? 'border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/5' : 'border-slate-200 text-slate-400 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50'}`}>[+] Add_New_Node</button>
            </nav>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className={`p-4 border-t ${isDark ? 'border-slate-800 bg-slate-950/80' : 'border-slate-100 bg-slate-50'}`}>
          <div className={`flex items-center gap-3 p-3 rounded-xl border mb-3 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-500 font-black text-sm uppercase">{username?.charAt(0)}</div>
            <div className="flex flex-col text-left truncate">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter leading-none mb-1">Authenticated</span>
              <span className={`text-xs font-bold truncate font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{username}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onSettingsClick} className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border transition-all active:scale-95 ${isDark ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-white hover:border-slate-700' : 'bg-white border-slate-200 text-slate-500 hover:text-blue-600 hover:border-blue-200'}`}>
              <Settings size={14} /> <span className="text-[10px] font-bold uppercase">Config</span>
            </button>
            <button onClick={onLogout} className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border transition-all active:scale-95 ${isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' : 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white'}`}>
              <LogOut size={14} /> <span className="text-[10px] font-bold uppercase">Exit</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

// ==========================================
// 3. KOMPONEN MODAL (TECH MODALS)
// ==========================================
const AddServerModal = ({ theme, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', host: '', proxy_port: '6080', password: '' });
  const [showPass, setShowPass] = useState(false);
  const isDark = theme === 'dark';
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className={`border rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in slide-in-from-bottom-8 overflow-hidden relative ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className={`absolute top-0 right-0 p-8 opacity-5 -mr-8 -mt-8 rotate-12 pointer-events-none ${isDark ? 'text-white' : 'text-slate-900'}`}><Plus size={150} /></div>
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3 text-blue-500 uppercase tracking-tighter"><Plus size={20} className="p-1 bg-blue-500/20 rounded"/> Initialize_New_HMI</h3>
          <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6 text-left relative z-10">
            <div className="space-y-1.5"><label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Node_Label</label><input required className={`w-full border rounded-xl p-3.5 text-sm outline-none transition-all font-mono ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'}`} placeholder="e.g. Filling_Line_01" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5"><label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Network_IP</label><input required className={`w-full border rounded-xl p-3.5 text-sm outline-none transition-all font-mono ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'}`} placeholder="192.168.x.x" value={formData.host} onChange={(e) => setFormData({...formData, host: e.target.value})} /></div>
              <div className="space-y-1.5"><label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Proxy_P</label><input required className={`w-full border rounded-xl p-3.5 text-sm outline-none transition-all font-mono ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'}`} value={formData.proxy_port} onChange={(e) => setFormData({...formData, proxy_port: e.target.value})} /></div>
            </div>
            <div className="space-y-1.5"><label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">VNC_Secret</label><div className="relative"><input type={showPass ? "text" : "password"} className={`w-full border rounded-xl p-3.5 text-sm outline-none transition-all font-mono ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'}`} placeholder="Password VNC" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-500 z-20">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button></div></div>
            <div className="flex gap-4 pt-4"><button type="button" onClick={onClose} className={`flex-1 p-4 rounded-xl font-bold transition-all border uppercase text-[10px] tracking-widest ${isDark ? 'text-slate-500 hover:bg-slate-800 border-slate-800' : 'text-slate-400 hover:bg-slate-50 border-slate-200'}`}>Abort</button><button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl p-4 shadow-lg active:scale-95 uppercase text-[10px] tracking-[0.2em]">Deploy_Node</button></div>
          </form>
      </div>
    </div>
  );
};

const SettingsModal = ({ theme, isOpen, onClose, onSave }) => {
  const [data, setData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const isDark = theme === 'dark';
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.newPassword !== data.confirmPassword) return setError('Mismatch in key confirmation');
    setError(null);
    setIsSaving(true);
    const success = await onSave(data.oldPassword, data.newPassword);
    setIsSaving(false);
    if (success) setData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    else setError('Update failed. Verification mismatch.');
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
      <div className={`border rounded-[2rem] w-full max-w-md shadow-2xl p-8 animate-in zoom-in ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`flex justify-between items-center mb-8 border-b pb-4 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <h3 className={`text-md font-bold flex items-center gap-3 text-blue-500 uppercase font-mono`}>
            <KeyRound size={18} /> Account_Security
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5 text-left relative z-20">
          <div className="space-y-1.5"><label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Current_Key</label><input type="password" required className={`w-full border rounded-xl p-3.5 text-sm outline-none transition-all font-mono ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'}`} value={data.oldPassword} onChange={e => setData({...data, oldPassword: e.target.value})} /></div>
          <div className={`h-px my-2 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}></div>
          <div className="space-y-1.5"><label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">New_Access_Key</label><input type="password" required className={`w-full border rounded-xl p-3.5 text-sm outline-none transition-all font-mono ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'}`} value={data.newPassword} onChange={e => setData({...data, newPassword: e.target.value})} /></div>
          <div className="space-y-1.5"><label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Confirm_New_Key</label><input type="password" required className={`w-full border rounded-xl p-3.5 text-sm outline-none transition-all font-mono ${isDark ? 'bg-slate-950 border-slate-800 text-slate-200 focus:border-blue-500/50' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-blue-400'}`} value={data.confirmPassword} onChange={e => setData({...data, confirmPassword: e.target.value})} /></div>
          {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[10px] text-rose-500">{error}</div>}
          <button disabled={isSaving} type="submit" className={`w-full font-bold py-4 rounded-xl border transition-all active:scale-95 flex items-center justify-center gap-2 mt-4 uppercase text-[10px] tracking-widest cursor-pointer ${isDark ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' : 'bg-slate-900 hover:bg-black text-white border-slate-800'}`}>
            {isSaving ? <Loader2 className="animate-spin" size={16}/> : <ShieldCheck size={16}/>}
            {isSaving ? 'Syncing...' : 'Update_Security_Protocol'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. KOMPONEN UTAMA (APP - TECH CORE)
// ==========================================
const App = () => {
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [error, setError] = useState(null);
  
  const [token, setToken] = useState(localStorage.getItem('kas_vnc_token'));
  const [username, setUsername] = useState(localStorage.getItem('kas_vnc_user'));

  const [activeServer, setActiveServer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectionKey, setConnectionKey] = useState(0);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('kas_vnc_token');
    localStorage.removeItem('kas_vnc_user');
    setToken(null);
    setUsername(null);
    setServers([]);
    setActiveServer(null);
  }, []);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('kas_vnc_token', newToken);
    localStorage.setItem('kas_vnc_user', newUser);
    setToken(newToken);
    setUsername(newUser);
  };

  const authenticatedFetch = useCallback(async (endpoint, options = {}) => {
    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
    if (response.status === 401 || response.status === 403) {
      handleLogout();
      throw new Error('Sesi berakhir atau akses ditolak');
    }
    return response;
  }, [token, handleLogout]);

  const checkServerStatus = useCallback(async () => {
    if (!token || servers.length === 0) return;
    setIsPinging(true);
    try {
      const response = await authenticatedFetch('/servers/status');
      if (response.ok) {
        const statuses = await response.json();
        setServers(prev => prev.map(s => {
          const update = statuses.find(u => u.id === s.id);
          return update ? { ...s, status: update.status } : s;
        }));
      }
    } catch (err) { console.error(err); } finally { setIsPinging(false); }
  }, [servers.length, token, authenticatedFetch]);

  const fetchServers = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await authenticatedFetch('/servers');
      const data = await response.json();
      const serverList = data.map(s => ({ ...s, status: s.status || 'unknown' }));
      setServers(serverList);
      if (serverList.length > 0) setTimeout(() => checkServerStatus(), 500);
    } catch (err) { setError(err.message); } finally { setIsLoading(false); }
  }, [token, authenticatedFetch, checkServerStatus]);

  const deleteServer = async (id) => {
    if (!window.confirm('Delete Node?')) return;
    try {
      await authenticatedFetch(`/servers/${id}`, { method: 'DELETE' });
      setServers(prev => prev.filter(s => s.id !== id));
      if (activeServer?.id === id) setActiveServer(null);
    } catch (err) { alert(err.message); }
  };

  const saveNewServer = async (serverData) => {
    try {
      const response = await authenticatedFetch('/servers', {
        method: 'POST',
        body: JSON.stringify(serverData)
      });
      const saved = await response.json();
      setServers(prev => [...prev, { ...saved, status: 'unknown' }]);
      setIsAddModalOpen(false);
      checkServerStatus();
    } catch (err) { alert(err.message); }
  };

  const handleUpdatePassword = async (oldPassword, newPassword) => {
    try {
      const response = await authenticatedFetch('/users/change-password', {
        method: 'PUT',
        body: JSON.stringify({ oldPassword, newPassword })
      });
      if (response.ok) {
        alert('Credentials Updated Successfully');
        setIsSettingsOpen(false);
        return true;
      }
      return false;
    } catch (err) { return false; }
  };

  useEffect(() => { if (token) fetchServers(); }, [token, fetchServers]);
  useEffect(() => {
    if (!token || servers.length === 0) return;
    const timer = setInterval(() => checkServerStatus(), 30000);
    return () => clearInterval(timer);
  }, [checkServerStatus, token, servers.length]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setIsSidebarOpen(false);
      else if (!activeServer) setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeServer]);

  if (!token) return <AuthView theme={theme} onLoginSuccess={handleLoginSuccess} />;

  const vncUrl = activeServer ? 
    `${window.location.origin}/novnc/vnc.html?autoconnect=true&reconnect=true&host=${window.location.hostname}&port=${activeServer.proxy_port}&path=?target=${activeServer.host}:5900&logging=warn&cursor=true&show_dot=true&scale=true&resize=scale${activeServer.password ? `&password=${activeServer.password}` : ''}` 
    : '';

  const isDark = theme === 'dark';

  return (
    <div className={`flex h-screen w-full font-sans overflow-hidden transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}
      
      <Sidebar 
        theme={theme}
        isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} 
        servers={servers} isLoading={isLoading} isPinging={isPinging}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        activeServer={activeServer} setActiveServer={setActiveServer}
        onAddClick={() => setIsAddModalOpen(true)}
        onSettingsClick={() => setIsSettingsOpen(true)}
        onDeleteServer={deleteServer} checkStatus={checkServerStatus}
        username={username} onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden text-left">
        {/* Header Dashboard */}
        <header className={`h-16 border-b flex items-center justify-between px-4 md:px-6 z-30 backdrop-blur-xl transition-all ${isDark ? 'bg-slate-950/50 border-slate-900' : 'bg-white/70 border-slate-200'}`}>
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg border transition-all ${!isSidebarOpen ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/20' : isDark ? 'text-slate-500 border-slate-800 hover:text-white' : 'text-slate-400 border-slate-200 hover:text-slate-900'}`}>
              {isSidebarOpen ? <PanelLeftClose size={18}/> : <PanelLeftOpen size={18}/>}
            </button>
            <div className="flex flex-col min-w-0">
              {activeServer ? (
                <div className="animate-in fade-in slide-in-from-left-2 flex items-center gap-3">
                  <div className="flex flex-col">
                    <h2 className={`text-sm font-bold truncate leading-none mb-1 font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeServer.name.toUpperCase()}</h2>
                    <p className={`text-[9px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{activeServer.host} // SECURE_CON</p>
                  </div>
                  <div className={`px-2 py-0.5 rounded border text-[8px] font-black uppercase animate-pulse ${activeServer.status === 'online' ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500' : 'bg-rose-500/10 border-rose-500/50 text-rose-500'}`}>
                    {activeServer.status === 'online' ? 'Connected' : 'Offline'}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="hidden sm:block text-[10px] font-black text-blue-500 tracking-[0.2em] uppercase opacity-80 truncate leading-none">PT KARYAINDAH ALAM SEJAHTERA</p>
                  <span className={`hidden sm:block h-3 w-px ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}></span>
                  <p className={`text-[10px] font-mono uppercase ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Command_Center_v2.4</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {activeServer && (
              <div className={`flex items-center gap-1.5 md:gap-3 border-r pr-4 mr-2 ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
                <button className={`hidden sm:flex p-2 rounded-lg transition-all ${isDark ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-900' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}`} title="Keyboard Mapping"><Keyboard size={16}/></button>
                <button onClick={() => document.querySelector('iframe')?.requestFullscreen()} className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-900' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}`} title="Enter Fullscreen"><Maximize2 size={16}/></button>
                <button onClick={() => setConnectionKey(k => k + 1)} className={`p-2 rounded-lg transition-all ${isDark ? 'text-slate-500 hover:text-blue-400 hover:bg-slate-900' : 'text-slate-400 hover:text-blue-600 hover:bg-slate-100'}`} title="Re-initialize Signal"><RefreshCw size={16}/></button>
                <button onClick={() => setActiveServer(null)} className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black py-2 px-3 rounded-lg transition-all uppercase tracking-widest ml-1 shadow-lg shadow-rose-600/20">Terminate</button>
              </div>
            )}
            <div className={`flex items-center gap-1 p-1 rounded-full border transition-colors ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
               <button onClick={() => setTheme('light')} className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Sun size={12}/></button>
               <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}><Moon size={12}/></button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={`flex-1 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-slate-950' : 'bg-slate-100'}`}>
          {/* Grid Background */}
          <div className={`absolute inset-0 pointer-events-none opacity-30 ${isDark ? 'bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)]' : 'bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)]'} bg-[size:40px_40px]`}></div>
          
          {/* Decorative Corner Borders */}
          <div className={`absolute top-0 left-0 w-8 h-8 border-t border-l pointer-events-none ${isDark ? 'border-slate-800' : 'border-slate-300'}`}></div>
          <div className={`absolute top-0 right-0 w-8 h-8 border-t border-r pointer-events-none ${isDark ? 'border-slate-800' : 'border-slate-300'}`}></div>
          <div className={`absolute bottom-0 left-0 w-8 h-8 border-b border-l pointer-events-none ${isDark ? 'border-slate-800' : 'border-slate-300'}`}></div>
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-b border-r pointer-events-none ${isDark ? 'border-slate-800' : 'border-slate-300'}`}></div>

          {activeServer ? (
            <div className="w-full h-full relative group p-1">
               <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700"></div>
               <iframe key={`${activeServer.id}-${connectionKey}`} src={vncUrl} className="w-full h-full border-none bg-black rounded-sm shadow-2xl" allowFullScreen />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8 animate-in fade-in duration-1000">
              <div className={`p-14 rounded-[3rem] w-full max-w-xl flex flex-col items-center text-center relative overflow-hidden group shadow-2xl border backdrop-blur-md transition-all ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 opacity-50 pointer-events-none"></div>
                <div className={`absolute -bottom-20 -right-20 opacity-5 rotate-12 pointer-events-none ${isDark ? 'text-white' : 'text-slate-900'}`}><Database size={300} /></div>
                
                <div className={`w-28 h-28 rounded-[2.5rem] border flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700 shadow-inner relative ${isDark ? 'bg-blue-600/10 border-blue-500/20' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-10 animate-pulse pointer-events-none"></div>
                    <Server size={50} className="text-blue-500 relative z-10" />
                </div>
                
                <h2 className={`text-3xl font-black mb-2 uppercase tracking-tighter leading-tight drop-shadow-md ${isDark ? 'text-white' : 'text-slate-900'}`}>SYSTEM_READY</h2>
                <h3 className="text-[11px] font-bold text-blue-500 mb-10 uppercase tracking-[0.4em] opacity-80">PT KARYAINDAH ALAM SEJAHTERA</h3>
                
                <div className="grid grid-cols-2 gap-6 w-full mb-10 relative z-10">
                  <div className={`p-6 rounded-2xl border transition-colors text-left ${isDark ? 'bg-slate-950/80 border-slate-800 group-hover:border-blue-500/30' : 'bg-white border-slate-100 group-hover:border-blue-200'}`}>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">active_nodes</p>
                    <p className={`text-4xl font-bold font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{servers.length}</p>
                  </div>
                  <div className={`p-6 rounded-2xl border transition-colors text-left ${isDark ? 'bg-slate-950/80 border-slate-800 group-hover:border-emerald-500/30' : 'bg-white border-slate-100 group-hover:border-emerald-200'}`}>
                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">online_status</p>
                    <p className="text-4xl font-bold text-emerald-500 font-mono">{servers.filter(s => s.status === 'online').length}</p>
                  </div>
                </div>

                <button onClick={fetchServers} className={`group flex items-center gap-3 border text-[10px] font-black py-4 px-10 rounded-full transition-all active:scale-95 uppercase tracking-[0.2em] cursor-pointer ${isDark ? 'bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 text-white' : 'bg-white border-slate-200 hover:border-blue-400 text-slate-700 shadow-sm'}`}>
                    <RefreshCw size={14} className={isLoading ? 'animate-spin text-blue-500' : 'group-hover:rotate-180 transition-transform duration-700'} />
                    {isLoading ? 'Synchronizing...' : 'Initialize_Data_Link'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AddServerModal theme={theme} isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={saveNewServer} />
      <SettingsModal theme={theme} isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onSave={handleUpdatePassword} />

      {/* Global CSS for Customizations */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ${isDark ? '.custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }' : ''}
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default App;