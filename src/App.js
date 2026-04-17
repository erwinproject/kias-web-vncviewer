import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Monitor, Plus, Trash2, Settings, RefreshCw, Search, Server, LogOut, Sun, Moon,
  Eye, EyeOff, Lock, Maximize2, Keyboard, Camera, X, PanelLeftClose, PanelLeftOpen,
  Loader2, AlertCircle, WifiOff, User, ShieldCheck, UserPlus, ArrowLeft, CheckCircle2
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// ==========================================
// 1. KOMPONEN AUTH (LOGIN & REGISTER)
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

      if (authMode === 'login') {
        onLoginSuccess(data.token, data.username);
      } else {
        setSuccessMsg(data.message);
        setAuthMode('login');
        setFormData({ username: '', password: '' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`h-screen w-full flex items-center justify-center font-sans ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <div className="w-full max-w-md p-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-blue-600/20">
            <Monitor size={32} className="text-white" />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter mb-1 leading-tight">PT KARYAINDAH ALAM SEJAHTERA</h1>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] opacity-80">Security System Portal</p>
        </div>

        <div className={`${theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} border p-8 rounded-[2rem] shadow-2xl`}>
          <div className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
            <h2 className="font-bold text-lg">{authMode === 'login' ? 'Login Operator' : 'Daftar Akun'}</h2>
            <button
              onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setError(null); setSuccessMsg(null); }}
              className="text-xs font-bold text-blue-500 hover:underline flex items-center gap-1"
            >
              {authMode === 'login' ? <><UserPlus size={14} /> Buat Akun</> : <><ArrowLeft size={14} /> Kembali</>}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-60">Username</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input required className={`w-full pl-12 pr-4 py-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`} placeholder="Username" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] font-bold uppercase tracking-widest ml-1 opacity-60">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input type="password" required className={`w-full pl-12 pr-4 py-4 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`} placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
              </div>
            </div>
            {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-500 flex gap-2"><AlertCircle size={14} /> {error}</div>}
            {successMsg && <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-500 flex gap-2"><CheckCircle2 size={14} /> {successMsg}</div>}
            <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (authMode === 'login' ? <ShieldCheck size={18} /> : <UserPlus size={18} />)}
              {isSubmitting ? 'Memproses...' : (authMode === 'login' ? 'MASUK KE DASHBOARD' : 'DAFTAR SEKARANG')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. KOMPONEN SIDEBAR
// ==========================================
const Sidebar = ({
  theme, isOpen, setIsOpen, servers, isLoading, isPinging, error, searchQuery, setSearchQuery,
  activeServer, setActiveServer, onAddClick, onDeleteServer, checkStatus, username, onLogout
}) => {
  const styles = {
    sidebar: theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    input: theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900',
    hover: theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    border: theme === 'dark' ? 'border-slate-800' : 'border-slate-200',
  };

  const filteredServers = useMemo(() =>
    servers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())),
    [servers, searchQuery]
  );

  return (
    <aside className={`fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r ${styles.sidebar} ${isOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 lg:border-none'}`}>
      <div className={`flex flex-col h-full w-72 transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`p-6 border-b ${styles.border} flex flex-col gap-2 relative`}>
          <button onClick={() => setIsOpen(false)} className="absolute top-6 right-4 p-1 lg:hidden text-slate-400"><X size={20} /></button>
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg"><Monitor size={20} /></div>
            <h1 className="text-xl font-bold tracking-tight text-white">VNC Cloud</h1>
          </div>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">PT KARYAINDAH ALAM SEJAHTERA</p>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Cari unit..." className={`w-full ${styles.input} border-none rounded-lg py-2 pl-10 pr-4 text-sm outline-none`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>

          <div className="flex items-center justify-between mb-3 px-2">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">HMI Units</span>
            <button onClick={checkStatus} className={`p-1 hover:bg-blue-500/10 rounded-full transition-all ${isPinging ? 'animate-spin text-blue-500' : 'text-slate-500'}`}><RefreshCw size={14} /></button>
          </div>

          <nav className="space-y-1">
            {isLoading ? <div className="flex flex-col items-center justify-center py-8 opacity-40"><Loader2 className="animate-spin mb-2" size={20} /><span className="text-xs">Loading...</span></div> :
              filteredServers.map(server => (
                <div key={server.id} onClick={() => setActiveServer(server)} className={`group p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all ${activeServer?.id === server.id ? 'bg-blue-600 text-white shadow-md' : `${styles.hover} ${styles.textMuted} hover:text-slate-100`}`}>
                  <div className="flex items-center gap-3 truncate">
                    <div className={`shrink-0 w-2 h-2 rounded-full transition-all duration-500 ${server.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : server.status === 'offline' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'bg-slate-500'}`} />
                    <div className="truncate"><p className="text-sm font-medium truncate">{server.name}</p><p className={`text-[10px] truncate ${activeServer?.id === server.id ? 'text-blue-100' : 'opacity-60'}`}>{server.host}</p></div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteServer(server.id); }} className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${activeServer?.id === server.id ? 'hover:bg-white/20 text-white' : 'hover:bg-rose-500/10 text-rose-500'}`}><Trash2 size={14} /></button>
                </div>
              ))}
            <button onClick={onAddClick} className={`w-full flex items-center justify-center gap-2 p-3 mt-4 text-[10px] font-bold border-2 border-dashed ${styles.border} rounded-xl ${styles.hover} text-slate-400 hover:text-blue-500 hover:border-blue-500/50 transition-all`}><Plus size={14} /> TAMBAH UNIT</button>
          </nav>
        </div>

        <div className={`p-4 border-t ${styles.border}`}>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 mb-2"><div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs uppercase">{username?.charAt(0)}</div><div className="flex flex-col"><span className="text-[10px] font-bold opacity-50 uppercase tracking-tighter">OPERATOR</span><span className="text-sm font-bold truncate">{username}</span></div></div>
          <button onClick={onLogout} className={`w-full flex items-center gap-3 p-3 rounded-lg ${styles.hover} text-rose-500 transition-colors active:scale-95`}><LogOut size={18} /><span className="text-sm font-bold">Logout</span></button>
        </div>
      </div>
    </aside>
  );
};

// ==========================================
// 3. KOMPONEN MODAL TAMBAH UNIT
// ==========================================
const AddServerModal = ({ theme, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({ name: '', host: '', proxy_port: '6080', password: '' });
  const [showPass, setShowPass] = useState(false);

  if (!isOpen) return null;

  const styles = {
    card: theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    input: theme === 'dark' ? 'bg-slate-800 text-white border-slate-700' : 'bg-slate-100 text-slate-900 border-slate-200',
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className={`${styles.card} rounded-[2rem] w-full max-w-md shadow-2xl p-8 border animate-in slide-in-from-bottom-4 duration-300`}>
        <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-blue-500"><div className="p-2 bg-blue-500/10 rounded-lg"><Plus size={20} /></div>Tambah HMI</h3>
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6 text-left">
          <div className="space-y-2"><label className="text-[10px] font-bold opacity-70">Nama Unit</label><input required className={`w-full ${styles.input} border rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} placeholder="Filling Line 1" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} /></div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2"><label className="text-[10px] font-bold opacity-70">IP Address</label><input required className={`w-full ${styles.input} border rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} placeholder="192.168.x.x" value={formData.host} onChange={(e) => setFormData({ ...formData, host: e.target.value })} /></div>
            <div className="w-full sm:w-32 space-y-2"><label className="text-[10px] font-bold opacity-70">Port Proxy</label><input required className={`w-full ${styles.input} border rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} value={formData.proxy_port} onChange={(e) => setFormData({ ...formData, proxy_port: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><label className="text-[10px] font-bold opacity-70">VNC Password</label><div className="relative"><input type={showPass ? "text" : "password"} className={`w-full ${styles.input} border rounded-xl p-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} placeholder="Password VNC" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} /><button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500">{showPass ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
          <div className="flex gap-4 pt-4"><button type="button" onClick={onClose} className="flex-1 p-4 rounded-xl font-bold text-slate-500 hover:bg-slate-800 transition-all border border-slate-700">Batal</button><button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl p-4 shadow-lg active:scale-95 uppercase text-xs tracking-widest">Simpan Unit</button></div>
        </form>
      </div>
    </div>
  );
};

// ==========================================
// 4. KOMPONEN UTAMA (APP)
// ==========================================
const App = () => {
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [servers, setServers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [error, setError] = useState(null);

  // Auth Routing States
  const [token, setToken] = useState(localStorage.getItem('kias_vnc_token'));
  const [username, setUsername] = useState(localStorage.getItem('kias_vnc_user'));

  // Dashboard States
  const [activeServer, setActiveServer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [connectionKey, setConnectionKey] = useState(0);

  // --- LOGIKA AUTH ---
  const handleLogout = useCallback(() => {
    localStorage.removeItem('kias_vnc_token');
    localStorage.removeItem('kias_vnc_user');
    setToken(null);
    setUsername(null);
    setServers([]);
    setActiveServer(null);
  }, []);

  const handleLoginSuccess = (newToken, newUser) => {
    localStorage.setItem('kias_vnc_token', newToken);
    localStorage.setItem('kias_vnc_user', newUser);
    setToken(newToken);
    setUsername(newUser);
  };

  // --- LOGIKA DATA ---
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

  // Fungsi Ping Status
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
    } catch (err) {
      console.error("Status check failed:", err);
    } finally {
      setIsPinging(false);
    }
  }, [servers.length, token, authenticatedFetch]);

  // Ambil data server
  const fetchServers = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await authenticatedFetch('/servers');
      const data = await response.json();
      const serverList = data.map(s => ({ ...s, status: s.status || 'unknown' }));
      setServers(serverList);
      // Pemicu ping langsung setelah data diterima
      if (serverList.length > 0) {
        setTimeout(() => {
          // Kita panggil ping manual di sini karena state servers mungkin belum terupdate di closure checkServerStatus
          fetch(`${API_URL}/servers/status`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }).then(res => res.json()).then(statuses => {
            setServers(prev => prev.map(s => {
              const update = statuses.find(u => u.id === s.id);
              return update ? { ...s, status: update.status } : s;
            }));
          });
        }, 500);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, authenticatedFetch]);

  const deleteServer = async (id) => {
    if (!window.confirm('Hapus unit HMI ini?')) return;
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
      checkServerStatus(); // Ping ulang setelah tambah
    } catch (err) { alert(err.message); }
  };

  // --- EFFECTS ---
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

  // --- VIEW RENDERING (ROUTING) ---
  if (!token) {
    return <AuthView theme={theme} onLoginSuccess={handleLoginSuccess} />;
  }

  const styles = {
    bg: theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900',
    header: theme === 'dark' ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200',
    card: theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
  };

  const vncUrl = activeServer ?
    `${window.location.origin}/novnc/vnc.html?autoconnect=true&reconnect=true&host=${window.location.hostname}&port=${activeServer.proxy_port}&path=?target=${activeServer.host}:5900&logging=warn&cursor=true&show_dot=true&scale=true&resize=scale${activeServer.password ? `&password=${activeServer.password}` : ''}`
    : '';

  return (
    <div className={`flex h-screen w-full ${styles.bg} font-sans overflow-hidden transition-colors duration-300`}>
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />}

      <Sidebar
        theme={theme} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}
        servers={servers} isLoading={isLoading} isPinging={isPinging} error={error}
        searchQuery={searchQuery} setSearchQuery={setSearchQuery}
        activeServer={activeServer} setActiveServer={setActiveServer}
        onAddClick={() => setIsAddModalOpen(true)}
        onDeleteServer={deleteServer} checkStatus={checkServerStatus}
        username={username} onLogout={handleLogout}
      />

      <main className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
        <header className={`h-16 ${styles.header} border-b flex items-center justify-between px-4 md:px-6 z-30 backdrop-blur-md`}>
          <div className="flex items-center gap-4 min-w-0">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={`p-2 rounded-lg transition-colors ${!isSidebarOpen ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500'}`}>{isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}</button>
            <div className="flex flex-col min-w-0">
              {activeServer ? (
                <div className="animate-in fade-in slide-in-from-left-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold truncate">{activeServer.name}</h2>
                    <div className={`w-1.5 h-1.5 rounded-full ${activeServer.status === 'online' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  </div>
                  <p className="text-[10px] text-slate-500 truncate">{activeServer.host} • PT KIAS</p>
                </div>
              ) : (
                <p className="hidden sm:block text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase opacity-80 truncate">PT KARYAINDAH ALAM SEJAHTERA</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className={`flex items-center gap-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} p-1 rounded-full`}><button onClick={() => setTheme('light')} className={`p-1.5 rounded-full ${theme === 'light' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500'}`}><Sun size={14} /></button><button onClick={() => setTheme('dark')} className={`p-1.5 rounded-full ${theme === 'dark' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}><Moon size={14} /></button></div>
            {activeServer && <div className="flex items-center gap-1 md:gap-2 border-l pl-2 md:pl-4 border-slate-700/50"><button className="hidden sm:flex p-2 text-slate-400 hover:text-blue-500"><Keyboard size={16} /></button><button onClick={() => document.querySelector('iframe')?.requestFullscreen()} className="p-2 text-slate-400 hover:text-blue-500"><Maximize2 size={16} /></button><button onClick={() => setConnectionKey(k => k + 1)} className="p-2 text-slate-400 hover:text-blue-500"><RefreshCw size={16} /></button><button onClick={() => setActiveServer(null)} className="bg-rose-600 text-white text-[10px] font-bold py-2 px-3 rounded-lg ml-1">Disconnect</button></div>}
          </div>
        </header>

        <div className="flex-1 bg-slate-950 flex flex-col items-center justify-center">
          {activeServer ? (
            <iframe key={`${activeServer.id}-${connectionKey}`} src={vncUrl} className="w-full h-full border-none bg-black" allowFullScreen />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-8 animate-in fade-in duration-700">
              <div className={`${styles.card} p-14 rounded-[3rem] w-full max-w-lg border flex flex-col items-center text-center shadow-2xl relative overflow-hidden group`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600 opacity-50"></div>
                <div className="bg-blue-600/10 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10"><Server size={44} className="text-blue-500" /></div>
                <h2 className="text-2xl font-black mb-2 uppercase text-blue-600 leading-tight">SISTEM MONITORING VNC</h2>
                <h3 className="text-[11px] font-bold text-slate-500 mb-8 uppercase tracking-[0.3em] opacity-80">PT KARYAINDAH ALAM SEJAHTERA</h3>
                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                  <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50"><p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Total Unit</p><p className="text-2xl font-bold text-white">{servers.length}</p></div>
                  <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10"><p className="text-[10px] text-emerald-500/70 uppercase font-bold mb-1">Online</p><p className="text-2xl font-bold text-emerald-500">{servers.filter(s => s.status === 'online').length}</p></div>
                </div>
                <button onClick={fetchServers} className="bg-slate-800 hover:bg-slate-700 text-[10px] font-bold py-3 px-8 rounded-full flex items-center gap-2 transition-all active:scale-95 text-white"><RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} /> RE-SYNC DATABASE</button>
              </div>
            </div>
          )}
        </div>
      </main>

      <AddServerModal
        theme={theme}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={saveNewServer}
      />
    </div>
  );
};

export default App;