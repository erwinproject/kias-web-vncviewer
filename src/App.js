import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Plus, 
  Trash2, 
  Settings, 
  RefreshCw,
  Search,
  Server,
  LogOut,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Lock,
  Maximize2,
  Keyboard,
  Camera,
  X,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';

const App = () => {
  const [theme, setTheme] = useState('dark');
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [servers, setServers] = useState([
    { id: 1, name: 'PLC FILLING', host: '192.168.47.42', proxy_port: '6080', password: 'password', status: 'online' },
  ]);
  
  const [activeServer, setActiveServer] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [connectionKey, setConnectionKey] = useState(0);

  const [newServer, setNewServer] = useState({ 
    name: '', 
    host: '192.168.47.42', 
    proxy_port: '6080', 
    password: '' 
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else if (!activeServer) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeServer]);

  const styles = {
    bg: theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50',
    sidebar: theme === 'dark' ? 'bg-slate-900' : 'bg-white',
    header: theme === 'dark' ? 'bg-slate-900' : 'bg-white',
    text: theme === 'dark' ? 'text-slate-100' : 'text-slate-900',
    textMuted: theme === 'dark' ? 'text-slate-400' : 'text-slate-500',
    border: theme === 'dark' ? 'border-slate-800' : 'border-slate-200',
    input: theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900',
    hover: theme === 'dark' ? 'hover:bg-slate-800' : 'hover:bg-slate-100',
    card: theme === 'dark' ? 'bg-slate-900' : 'bg-white shadow-sm',
  };

  const handleAddServer = (e) => {
    e.preventDefault();
    const id = Date.now();
    setServers([...servers, { ...newServer, id, status: 'unknown' }]);
    setIsAddModalOpen(false);
  };

  const deleteServer = (id) => {
    setServers(servers.filter(s => s.id !== id));
    if (activeServer?.id === id) setActiveServer(null);
  };

  const getVncUrl = (server) => {
    const baseUrl = `${window.location.origin}/novnc/vnc.html`;
    const params = new URLSearchParams({
      autoconnect: 'true',
      reconnect: 'true',
      encrypt: '0',
      host: window.location.hostname,
      port: server.proxy_port,
      path: 'websockify',
      logging: 'warn',
      cursor: 'true',
      show_dot: 'true',
      scale: 'true',
      resize: 'scale'
    });
    
    if (server.password) {
      params.append('password', server.password);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const toggleFullScreen = () => {
    const elem = document.querySelector('iframe');
    if (elem) {
      if (elem.requestFullscreen) elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    }
  };

  return (
    <div className={`flex h-screen w-full ${styles.bg} ${styles.text} font-sans overflow-hidden transition-colors duration-300`}>
      
      {/* Sidebar Overlay Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r
        ${styles.sidebar} ${styles.border}
        ${isSidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full lg:translate-x-0 lg:w-0 lg:border-none'}
      `}>
        {/* Konten Sidebar dibungkus agar tidak meluber saat width 0 */}
        <div className={`flex flex-col h-full w-72 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <div className={`p-6 border-b ${styles.border} flex flex-col gap-2 relative`}>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-6 right-4 p-1 lg:hidden text-slate-400 hover:text-rose-500 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg">
                <Monitor size={20} />
              </div>
              <h1 className="text-xl font-bold tracking-tight">VNC Cloud</h1>
            </div>
            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider leading-tight">
              PT KARYAINDAH ALAM SEJAHTERA
            </p>
          </div>

          <div className="p-4 flex-1 overflow-y-auto">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Cari server..." 
                className={`w-full ${styles.input} border-none rounded-lg py-2 pl-10 pr-4 text-sm outline-none transition-all`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <nav className="space-y-1">
              {servers.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map(server => (
                <div 
                  key={server.id}
                  onClick={() => setActiveServer(server)}
                  className={`group p-3 rounded-xl cursor-pointer flex items-center justify-between transition-all ${
                    activeServer?.id === server.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : `${styles.hover} ${styles.textMuted} hover:${styles.text}`
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`shrink-0 w-2 h-2 rounded-full ${server.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                    <div className="truncate">
                      <p className="text-sm font-medium truncate">{server.name}</p>
                      <p className={`text-[10px] truncate ${activeServer?.id === server.id ? 'text-blue-100' : 'opacity-60'}`}>
                        {server.host}:{server.proxy_port}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteServer(server.id); }}
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${activeServer?.id === server.id ? 'hover:bg-white/20' : 'hover:bg-rose-500/10 text-rose-500'}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className={`w-full flex items-center justify-center gap-2 p-3 mt-4 text-xs font-bold border-2 border-dashed ${styles.border} rounded-xl ${styles.hover} transition-all text-slate-400 hover:text-blue-500 hover:border-blue-500/50`}
              >
                <Plus size={14} /> TAMBAH HMI
              </button>
            </nav>
          </div>

          <div className={`p-4 border-t ${styles.border}`}>
            <button className={`w-full flex items-center gap-3 p-3 rounded-lg ${styles.hover} transition-colors ${styles.textMuted} hover:${styles.text}`}>
              <Settings size={18} />
              <span className="text-sm">Pengaturan</span>
            </button>
            <button className={`w-full flex items-center gap-3 p-3 rounded-lg ${styles.hover} transition-colors ${styles.textMuted} hover:${styles.text}`}>
              <LogOut size={18} />
              <span className="text-sm">Keluar</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0 h-full overflow-hidden">
        <header className={`h-16 ${styles.header} border-b flex items-center justify-between px-4 md:px-6 z-30 transition-all duration-300`}>
          <div className="flex items-center gap-4 min-w-0">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-lg transition-colors ${!isSidebarOpen ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500'}`}
              title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            
            <div className="flex flex-col min-w-0">
              {activeServer ? (
                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                  <h2 className="text-sm font-bold truncate leading-none">{activeServer.name}</h2>
                  <p className="text-[10px] text-slate-500 truncate uppercase tracking-tighter mt-1">
                    {activeServer.host} • PT KARYAINDAH ALAM SEJAHTERA
                  </p>
                </div>
              ) : (
                <div className="hidden sm:block overflow-hidden">
                   <p className="text-[10px] font-black text-blue-600 tracking-[0.2em] uppercase opacity-80 truncate">
                    PT KARYAINDAH ALAM SEJAHTERA
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3 shrink-0">
             <div className={`flex items-center gap-1 ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-200'} p-1 rounded-full`}>
              <button onClick={() => setTheme('light')} className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-white text-orange-500 shadow-sm' : 'text-slate-500'}`}><Sun size={14} /></button>
              <button onClick={() => setTheme('dark')} className={`p-1.5 rounded-full transition-all ${theme === 'dark' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'}`}><Moon size={14} /></button>
            </div>
            
            {activeServer && (
              <div className="flex items-center gap-1 md:gap-2 ml-1 md:ml-4 border-l pl-2 md:pl-4 border-slate-700/50">
                <button className={`hidden sm:flex p-2 ${styles.hover} rounded-lg text-slate-400 hover:text-blue-500 transition-colors`} title="Virtual Keyboard">
                  <Keyboard size={16} />
                </button>
                <button onClick={toggleFullScreen} className={`p-2 ${styles.hover} rounded-lg text-slate-400 hover:text-blue-500 transition-colors`} title="Layar Penuh">
                  <Maximize2 size={16} />
                </button>
                <button onClick={() => setConnectionKey(k => k + 1)} className={`p-2 ${styles.hover} rounded-lg text-slate-400 hover:text-blue-500 transition-colors`} title="Muat Ulang">
                  <RefreshCw size={16} />
                </button>
                <button 
                  onClick={() => setActiveServer(null)}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-[10px] md:text-xs font-bold py-2 px-3 md:px-4 rounded-lg transition-all shadow-lg shadow-rose-600/20 ml-1"
                >
                   {window.innerWidth < 640 ? <LogOut size={14} /> : 'Disconnect'}
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center">
          {activeServer ? (
            <iframe 
              key={`${activeServer.id}-${connectionKey}`}
              src={getVncUrl(activeServer)}
              className="w-full h-full border-none bg-black"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-700">
              <div className={`${styles.card} p-10 md:p-14 rounded-[3rem] w-full max-w-lg border ${styles.border} flex flex-col items-center text-center transition-all duration-500 shadow-2xl relative overflow-hidden group`}>
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                
                <div className="bg-blue-600/10 w-24 h-24 rounded-[2.5rem] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                    <Server size={44} className="text-blue-500" />
                </div>
                
                <h2 className="text-xl md:text-2xl font-black mb-2 uppercase tracking-tighter text-blue-600">
                  PT KARYAINDAH ALAM SEJAHTERA
                </h2>
                <div className="h-px w-12 bg-slate-700 mb-4 mx-auto"></div>
                <h3 className="text-[11px] font-bold text-slate-500 mb-8 uppercase tracking-[0.3em] opacity-80">
                  VNC Manager Control Center
                </h3>
                
                <p className="text-xs md:text-sm text-slate-500 mb-12 px-6 leading-relaxed max-w-xs mx-auto">
                    Pilih unit HMI di sidebar untuk memulai monitoring real-time. Layar akan otomatis menyesuaikan area kerja.
                </p>
                
                <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/10 text-emerald-500 text-[10px] md:text-[11px] font-mono w-full flex items-center justify-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    OPERATIONAL SYSTEM READY
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Tambah Server */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className={`${styles.card} rounded-[2rem] w-full max-w-md shadow-2xl p-8 border ${styles.border} animate-in slide-in-from-bottom-4 duration-300`}>
              <h3 className="text-xl font-bold mb-8 flex items-center gap-3 text-blue-500">
                <div className="p-2 bg-blue-500/10 rounded-lg"><Plus size={20} /></div>
                Tambah HMI Baru
              </h3>
              <form onSubmit={handleAddServer} className="space-y-6">
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest opacity-70">Nama Unit</label>
                  <input required className={`w-full ${styles.input} border ${styles.border} rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} placeholder="HMI FILLING LINE 1" value={newServer.name} onChange={(e) => setNewServer({...newServer, name: e.target.value})} />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 text-left">
                  <div className="flex-1 space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest opacity-70">IP Address</label>
                    <input required className={`w-full ${styles.input} border ${styles.border} rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} placeholder="192.168.47.42" value={newServer.host} onChange={(e) => setNewServer({...newServer, host: e.target.value})} />
                  </div>
                  <div className="w-full sm:w-32 space-y-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest opacity-70">Port</label>
                    <input required className={`w-full ${styles.input} border ${styles.border} rounded-xl p-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} placeholder="6080" value={newServer.proxy_port} onChange={(e) => setNewServer({...newServer, proxy_port: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 tracking-widest opacity-70">VNC Password</label>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      className={`w-full ${styles.input} border ${styles.border} rounded-xl p-4 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`} 
                      placeholder="Masukkan password" 
                      value={newServer.password} 
                      onChange={(e) => setNewServer({...newServer, password: e.target.value})} 
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-500 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setIsAddModalOpen(false)} className={`flex-1 p-4 rounded-xl font-bold ${styles.hover} transition-all border ${styles.border} ${styles.textMuted}`}>Batal</button>
                  <button type="submit" className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl p-4 shadow-lg shadow-blue-600/30 transition-all active:scale-95">Simpan Unit</button>
                </div>
              </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;