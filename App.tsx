
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Plus, Trash2, Edit3, LogOut, LayoutDashboard, 
  FileJson, FileSpreadsheet, FileText, Send, 
  ChevronRight, AlertCircle, CheckCircle2, Info
} from 'lucide-react';
import { 
  Transaction, Profile, AppState, User, 
  TransactionType, CalcResult 
} from './types';
import { exportToJson, exportToCsv, exportToPdf } from './services/exportService';
import { sendDiscordReport } from './services/discordService';

const ACCOUNTS = [
  { username: "admin", password: "123", display: "Administrator" },
  { username: "unicorn", password: "unicorn", display: "unicorn" },
  { username: "LSPD", password: "LSPD", display: "LSPD" },
  { username: "LSMD", password: "LSMD", display: "LSMD" },
  { username: "USMS", password: "USMS", display: "USMS" },
  { username: "LSFD", password: "LSFD", display: "LSFD" },
  { username: "DOJ", password: "DOJ", display: "DOJ" },
  { username: "Immobilien&Unterkünfte", password: "Immobilien&Unterkünfte", display: "Immobilien&Unterkünfte" },
  { username: "Benefactor", password: "Benefactor", display: "Benefactor" },
  { username: "Bennys", password: "Bennys", display: "Bennys" },
  { username: "LS-Performance", password: "LS-Performance", display: "LS-Performance" },
  { username: "RX-Performance", password: "RX-Performance", display: "RX-Performance" },
  { username: "Lost-MC", password: "Lost-MC", display: "Lost-MC" },
  { username: "RM.Group", password: "RM.Group", display: "RM.Group" },
  { username: "OpisTaxi", password: "OpisTaxi", display: "OpisTaxi" },
  { username: "Fahr&Flugschul", password: "Fahr&Flugschul", display: "Fahr&Flugschul" },
  { username: "Im-Und-Export", password: "Im-Und-Export", display: "Im-Und-Export" },
  { username: "TLH", password: "TLH", display: "TLH" },
  { username: "La.Fiamma", password: "La.Fiamma", display: "La.Fiamma" },
  { username: "Wurst.Case", password: "Wurst.Case", display: "Wurst.Case" },
  { username: "LaRueda", password: "LaRueda", display: "LaRueda" },
  { username: "UwU.Coffee", password: "UwU.Coffee", display: "UwU.Coffee" },
  { username: "White.Widow", password: "White.Widow", display: "White.Widow" },
  { username: "RumpelKammer", password: "RumpelKammer", display: "RumpelKammer" },
  { username: "Lurays.Bar", password: "Lurays.Bar", display: "Lurays.Bar" },
  { username: "Pißwasser-brauerei", password: "Pißwasser-brauerei", display: "Pißwasser-brauerei" },
  { username: "Raccon-News", password: "Raccon-News", display: "Raccon-News" },
  { username: "Club77", password: "Club77", display: "Club77" },
];

const LS_KEY = "finanz_manager_pro_v3_data";
const SESSION_KEY = "fm_user_v3";

const INITIAL_STATE: AppState = {
  activeProfileId: "default",
  profiles: {
    default: {
      id: "default",
      name: "Standard Firma",
      taxId: "LS-&RX-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "",
      entries: []
    },
    unicorn: {
      id: "unicorn",
      name: "unicorn",
      taxId: "LS-35841-06",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462497313842004243/YVQJuskeh4l_l8tuwyTWKetkdVa5d1LKD0okfB0aTrJJmWDLqj5wbvk72nL23elTQmh-",
      entries: []
    },
    LSPD: {
      id: "LSPD",
      name: "LSPD",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462497071088144546/iNsovl8r0thxQD0Z1L3eZg6X3n6UBYi6PWq0pOklkrCbew4macoCnFTp2W88tPZABQMZ",
      entries: []
    },
    LSMD: {
      id: "LSMD",
      name: "LSMD",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462494745845567599/H5uIW7jXD7YLHA-AgVF516TrlVV725iN8GZDzGX8fdc3f7PnmaJctuWG_SsYw5WOkIiI",
      entries: []
    },
    USMS: {
      id: "USMS",
      name: "USMS",
      taxId: "Ls-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462624020993282270/ntwKK3QzGbxKpbeB9VQ0O-dxwnaNeHFMevVx6fkw58PfxhB5GNdNI9stX8gKH6PQmfXj",
      entries: []
    },
    LSFD: {
      id: "LSFD",
      name: "LSFD",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462494515280478311/267S5K_DgHX8p90_AGPuvc-0Ptq4MW96xUiEyg9x5vWxrtizUtSwNlLCxWfH7D1KM0Xc",
      entries: []
    },
    DOJ: {
      id: "DOJ",
      name: "DOJ",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462494419658735791/CEAzScWVr0UAHcVmUF_6qG2FYSu896FKvuANk4vD1fecXGk6XtUw9bTWIBYRN5VOmaY6",
      entries: []
    },
    "Immobilien&Unterkünfte": {
      id: "Immobilien&Unterkünfte",
      name: "Immobilien&Unterkünfte",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462494324255363368/FaK3dVwpUaeuLSveeE-A-0UztkMq8eUAedE3KV9qhZattGNInxVFtoLe9SfesWQ8i_pu",
      entries: []
    },
    Benefactor: {
      id: "Benefactor",
      name: "Benefactor",
      taxId: "RX-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462494226460967181/UbuHL8iXeaxcSDVstqUaeo_Wg94Ttch2K3cna4tZHscw30_0N7z4oMsFheHBtnyF26Ij",
      entries: []
    },
    Bennys: {
      id: "Bennys",
      name: "Bennys",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462494094986182910/bTPdOgoAw-V9cZrFkahcT55YoaD6Q7JNJkyp08ekk0yWVmfiB_TQgBLmk8L-n1VxXLTa",
      entries: []
    },
     "LS-Performance": {
      id: "LS-Performance",
      name: "LS-Performance",
      taxId: "LS-739204-02",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462493991068106844/yVbqAy7Ld4YkEUReCSKKdyA4Tb2wuTWEPclUF4MiilbmJ_a8fe3ICeXEJsxv_tpXTDQI",
      entries: []
    },
     "Lost-MC": {
      id: "Lost-MC",
      name: "Lost-MC",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462493880611110922/7qvyHgqNBijTufdM_2ZEwxE0ugZf9pF98p0GH2eZdf2vQe7e-gKYyr2kENT9i5NUd063",
      entries: []
    },
     "RM.Group": {
      id: "RM.Group",
      name: "RM.Group",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462493787166212236/r2pAwtgdighNjOii4Qp5Qi_gf1j6RvFQc0J40SRnFoRnCkwFcWd68YTcjzwjAjni_xYa",
      entries: []
    },
     OpisTaxi: {
      id: "OpisTaxi",
      name: "OpisTaxi",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462493663887102084/8F_KRJjhi6IToBka85T7suOtM6UB_sjDe2EnDeBnMabA2hFgSE8NAd3c-z7BoyseFCuz",
      entries: []
    },
     "Fahr&Flugschul": {
      id: "Fahr&Flugschul",
      name: "Fahr&Flugschul",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462493519813021741/jk94qMssLh3Ty3eB9lkg7aoHYV89IuZbkQxKjJ_91Llw7lNzlS_D_ysf3aS7giVXLe0t",
      entries: []
    },
     "Im-Und-Export": {
      id: "Im-Und-Export",
      name: "Im-Und-Export",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462493385276522539/rSFWNXfJd_zX2KrRVkzwsiSBOWCmk_Z03ehX4Gm-9CZ7nQtpipUWm5SN_anNW6m4_E7b",
      entries: []
    },
     TLH: {
      id: "TLH",
      name: "TLH",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462493210742886443/mWXhOjqbR_Wl2ifohvk0Xmh5-2tCBWEUWOtTXtLyIE0JNQK9io_6vSjAuFy1hVQAVICv",
      entries: []
    },
     "La.Fiamma": {
      id: "La.Fiamma",
      name: "La.Fiamma",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462492641613844603/sT38WOtyRcqn-Z75D1QnyD5Dsns6wEyRSLd8BAD4sEM7JPsnSK4muPCuZmNIglUUnNY6",
      entries: []
    },
     "Wurst.Case": {
      id: "Wurst.Case",
      name: "Wurst.Case",
      taxId: "LS-RX-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462492471165714573/mFKiA5DhPqnm8Y9rjbw-kEQLgPW8K9vAEKPXiWObcgnzSYTaRFD0WJZ_vKRqrh38zPGi",
      entries: []
    },
     LaRueda: {
      id: "LaRueda",
      name: "LaRueda",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462492331583344889/fBpwUUUQr_U9Pz2AB9U5sxsX8MtyUSAc8pNlR2uPEhv-i5R-tjR-nF863rxZKCx4aXRh",
      entries: []
    },
     "UwU.Coffee": {
      id: "UwU.Coffee",
      name: "UwU.Coffee",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462492074095018222/cQndpz-0b6YayOPhpvQ6cwEvuVhqxDVAikFIfTXzMNtkNdGS6SIASAV3SOz7j5jIZsae",
      entries: []
    },
     "White.Widow": {
      id: "White.Widow",
      name: "White.Widow",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462489453259001917/qR1ZmdBqJCI-22xpU2_yqUWvw6abW0iEruFo0TYJT4Roybp0td2or40EIjigZC9cMAmo",
      entries: []
    },
     RumpelKammer: {
      id: "RumpelKammer",
      name: "RumpelKammer",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462488819856310527/wUKaBnQK85KE8ccigb6aXN2mo4IH36FVM8i-4eIvw5lTTVPCu-6F5fnloUiQ8935-t0d",
      entries: []
    },
     "Lurays.Bar": {
      id: "Lurays.Bar",
      name: "Lurays.Bar",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462488510081663120/FA4iHIUdsBtFtcsdixVkHKmYt4DQqkYXod7lys5drQUs18w2Ln86cXnn2683Qe_py9o2",
      entries: []
    },
     "Pißwasser-brauerei": {
      id: "Pißwasser-brauerei",
      name: "Pißwasser-brauerei",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462488258649915542/zPLmf-RWS_icnAq9f_30_SrScwRfbYlFgJgLb4rRJyBBe4njc9ypdl-Xm52mIZofwPO7",
      entries: []
    },
     "Raccon-News": {
      id: "Raccon-News",
      name: "Raccon-News",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462487761545199753/-XUv8AEjdO_O-_IPOzryhnuI2Qf8rN6z6uqcRnog5z73l-ZQPbi36p2RbftWyAbCwu0a",
      entries: []
    },
     Club77: {
      id: "Club77",
      name: "Club77",
      taxId: "LS-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462487287064559698/KDczkzdph9QX1GO_ZiLqMQcyD6-8HeVk_JClnJxq9lyBS8GxWdJZkOUIkEUqigpqvM5H",
      entries: []
    },
     "RX-Performance": {
      id: "RX-Performance",
      name: "RX-Performance",
      taxId: "RX-",
      responsible: "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "https://discord.com/api/webhooks/1462971660373197016/_9qDOO-5lw9XvLxMz64fr3DOySIvVYsoKmb23aq12eXokDN-q2R-koKDGA2PXFMTJL_D",
      entries: []
    }
  }
};

const fmtUSD = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [store, setStore] = useState<AppState>(INITIAL_STATE);
  const [status, setStatus] = useState<{ text: string; type: 'info' | 'success' | 'error' | 'warning' }>({
    text: "Initialisierung...",
    type: "info"
  });

  // Login Form States
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // New Transaction Form States
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDesc, setNewDesc] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [newType, setNewType] = useState<TransactionType>(TransactionType.INCOME);

  // Load User from Session
  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  // Load Store from LocalStorage
  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed?.profiles) setStore(parsed);
      } catch (e) { console.error(e); }
    }
    showStatus("System Bereit", "success");
  }, []);

  // Persistence
  useEffect(() => {
    if (store !== INITIAL_STATE) {
      localStorage.setItem(LS_KEY, JSON.stringify(store));
    }
  }, [store]);

  const showStatus = useCallback((text: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setStatus({ text, type });
    if (type === 'success') {
      setTimeout(() => setStatus({ text: "System Bereit", type: "info" }), 3000);
    }
  }, []);

  const handleLogin = () => {
    const hit = ACCOUNTS.find(a => a.username === loginUser && a.password === loginPass);
    if (!hit) {
      setLoginError("Zugangsdaten ungültig.");
      return;
    }
    const userData = { username: hit.username, display: hit.display };
    setUser(userData);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(userData));
    setLoginError("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setUser(null);
  };

  const activeProfile = useMemo(() => {
    return store.profiles[store.activeProfileId] || Object.values(store.profiles)[0];
  }, [store]);

  const calculations = useMemo((): CalcResult => {
    const mf = activeProfile.monthFilter || "";
    const filtered = (activeProfile.entries || [])
      .filter(e => !mf || String(e.date || "").startsWith(mf))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    let inc = 0, exp = 0;
    filtered.forEach(e => {
      if (e.type === TransactionType.INCOME) inc += e.amount;
      else exp += e.amount;
    });

    const rate = activeProfile.taxRate / 100;
    const tax = Math.max(0, (inc - exp) * rate);
    const net = inc - exp - tax;

    return { inc, exp, tax, net, filteredEntries: filtered };
  }, [activeProfile]);

  const updateProfileField = (field: keyof Profile, value: any) => {
    setStore(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [prev.activeProfileId]: {
          ...prev.profiles[prev.activeProfileId],
          [field]: value
        }
      }
    }));
    showStatus("Änderung gespeichert", "success");
  };

  const addTransaction = () => {
    const amt = parseFloat(newAmount);
    if (!newDate || !newDesc || isNaN(amt)) {
      showStatus("Daten unvollständig", "warning");
      return;
    }

    const newEntry: Transaction = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: newDate,
      desc: newDesc,
      amount: amt,
      type: newType
    };

    setStore(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [prev.activeProfileId]: {
          ...prev.profiles[prev.activeProfileId],
          entries: [...prev.profiles[prev.activeProfileId].entries, newEntry]
        }
      }
    }));

    setNewDesc("");
    setNewAmount("");
    showStatus("Transaktion hinzugefügt", "success");
  };

  const deleteTransaction = (id: string) => {
    setStore(prev => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [prev.activeProfileId]: {
          ...prev.profiles[prev.activeProfileId],
          entries: prev.profiles[prev.activeProfileId].entries.filter(e => e.id !== id)
        }
      }
    }));
    showStatus("Transaktion gelöscht", "info");
  };

  const addProfile = () => {
    const n = prompt("Name des neuen Profils:");
    if (!n) return;
    const id = `p_${Date.now()}`;
    const newProf: Profile = {
      id,
      name: n,
      taxId: "",
      responsible: user?.display || "",
      taxRate: 5.0,
      monthFilter: "",
      webhook1: "",
      webhook2: "",
      entries: []
    };
    setStore(prev => ({
      ...prev,
      activeProfileId: id,
      profiles: { ...prev.profiles, [id]: newProf }
    }));
    showStatus(`Profil ${n} erstellt`, "success");
  };

  const deleteProfile = () => {
    if (Object.keys(store.profiles).length <= 1) {
      showStatus("Mindestens ein Profil muss erhalten bleiben.", "warning");
      return;
    }
    if (confirm("Dieses Profil wirklich löschen? Alle Daten gehen verloren.")) {
      const nextId = Object.keys(store.profiles).find(id => id !== store.activeProfileId)!;
      setStore(prev => {
        const nextProfiles = { ...prev.profiles };
        delete nextProfiles[prev.activeProfileId];
        return {
          activeProfileId: nextId,
          profiles: nextProfiles
        };
      });
      showStatus("Profil gelöscht", "info");
    }
  };

  const handleDiscordSend = async (all: boolean) => {
    showStatus("Sende Bericht...", "warning");
    const hooks = all ? [activeProfile.webhook1, activeProfile.webhook2] : [activeProfile.webhook1];
    const success = await sendDiscordReport(hooks, activeProfile, calculations, user?.display || "System");
    if (success) showStatus("Bericht gesendet", "success");
    else showStatus("Senden fehlgeschlagen", "error");
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.entries) {
          updateProfileField('entries', [...activeProfile.entries, ...parsed.entries]);
          showStatus("Daten importiert", "success");
        } else {
          showStatus("Ungültiges Format", "error");
        }
      } catch (err) {
        showStatus("Import-Fehler", "error");
      }
    };
    reader.readAsText(file);
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 bg-slate-900 text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Finanz-Manager Login</h2>
            <p className="text-slate-400 text-sm mt-2">v3 Pro Enterprise Edition</p>
          </div>
          <div className="p-8 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Benutzername</label>
              <input 
                value={loginUser}
                onChange={e => setLoginUser(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition" 
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Passwort</label>
              <input 
                type="password" 
                value={loginPass}
                onChange={e => setLoginPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none transition" 
                placeholder="••••••••"
              />
            </div>
            {loginError && <div className="text-sm font-medium text-red-500 text-center flex items-center justify-center gap-1"><AlertCircle size={14}/> {loginError}</div>}
            <button 
              onClick={handleLogin}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-black transition transform active:scale-[0.98] shadow-lg"
            >
              Einloggen
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-slate-900 rounded-xl text-white shadow-md">
              <LayoutDashboard size={24} />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Finanz-Manager <span className="text-indigo-600">Pro</span>
            </h1>
          </div>
          <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
            <span>Eingeloggt als: <b>{user.display}</b></span>
            <span className="text-slate-300">|</span>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-700 flex items-center gap-1 transition">
              <LogOut size={14} /> Logout
            </button>
          </p>
        </div>
        
        <div className={`px-5 py-2.5 rounded-full text-xs font-bold border border-slate-200 shadow-sm flex items-center gap-3 transition-all duration-300 bg-white ${
          status.type === 'success' ? 'text-emerald-700 border-emerald-100 bg-emerald-50' : 
          status.type === 'error' ? 'text-red-700 border-red-100 bg-red-50' : 
          'text-slate-700'
        }`}>
          <span className={`w-2.5 h-2.5 rounded-full ${
            status.type === 'info' ? 'bg-blue-400' :
            status.type === 'success' ? 'bg-emerald-500' :
            status.type === 'warning' ? 'bg-yellow-400 animate-pulse' :
            'bg-red-500'
          }`}></span>
          {status.text}
        </div>
      </header>

      {/* Profile & Settings Bar */}
      <div className="bg-white rounded-3xl p-6 md:p-8 mb-8 border border-slate-200 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Edit3 size={100} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end relative">
          <div className="md:col-span-4">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Profil auswählen</label>
            <div className="flex gap-2.5">
              <select 
                value={store.activeProfileId}
                onChange={e => setStore(prev => ({ ...prev, activeProfileId: e.target.value }))}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none font-semibold text-slate-700 cursor-pointer"
              >
                {Object.values(store.profiles).map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <button 
                onClick={addProfile}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-black transition shadow-md hover:scale-105 active:scale-95" 
                title="Neues Profil"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Steuerdaten</label>
            <div className="grid grid-cols-2 gap-2.5">
              <input 
                value={activeProfile.taxId}
                onChange={e => updateProfileField('taxId', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 transition text-sm font-medium" 
                placeholder="Steuernummer"
              />
              <div className="relative">
                <input 
                  type="number" 
                  step="0.1" 
                  value={activeProfile.taxRate}
                  onChange={e => updateProfileField('taxRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 transition text-sm font-medium pr-8" 
                  placeholder="Rate"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5">Verantwortung & Filter</label>
            <div className="grid grid-cols-2 gap-2.5">
              <input 
                value={activeProfile.responsible}
                onChange={e => updateProfileField('responsible', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 transition text-sm font-medium" 
                placeholder="Inhaber"
              />
              <input 
                type="month" 
                value={activeProfile.monthFilter}
                onChange={e => updateProfileField('monthFilter', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 transition text-sm font-medium" 
              />
            </div>
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button 
              onClick={() => {
                const n = prompt("Profil umbenennen:", activeProfile.name);
                if (n) updateProfileField('name', n);
              }}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-200 transition text-[10px] uppercase tracking-wider"
            >
              Rename
            </button>
            <button 
              onClick={deleteProfile}
              className="flex-1 bg-red-50 text-red-600 border border-red-100 font-bold py-3 rounded-xl hover:bg-red-100 transition text-[10px] uppercase tracking-wider"
            >
              Delete
            </button>
          </div>

          <div className="md:col-span-12 pt-6 mt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-2 tracking-widest flex items-center gap-1.5">
                <Send size={10} /> Discord Webhook Primary
              </label>
              <input 
                type="password" 
                value={activeProfile.webhook1}
                onChange={e => updateProfileField('webhook1', e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition text-slate-600" 
                placeholder="https://discord.com/api/webhooks/..."
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-extrabold text-slate-400 mb-2 tracking-widest flex items-center gap-1.5">
                <Send size={10} /> Discord Webhook Secondary
              </label>
              <input 
                type="password" 
                value={activeProfile.webhook2}
                onChange={e => updateProfileField('webhook2', e.target.value)}
                className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition text-slate-600" 
                placeholder="Optionaler Zweit-Webhook"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form & Actions */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm lg:sticky lg:top-8 overflow-hidden relative">
             <div className="absolute -top-4 -right-4 w-24 h-24 bg-slate-50 rounded-full opacity-50 flex items-center justify-center p-8">
                <Plus className="text-slate-200" size={60} />
             </div>
            <h2 className="text-xl font-extrabold mb-8 text-slate-900 flex items-center gap-3 relative">
              <span className="w-1.5 h-6 bg-slate-900 rounded-full"></span>
              Neuer Eintrag
            </h2>

            <div className="space-y-6 relative">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Datum</label>
                <input 
                  type="date" 
                  value={newDate}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none font-medium" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Beschreibung</label>
                <input 
                  type="text" 
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none font-medium" 
                  placeholder="z.B. Materialeinkauf"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Betrag ($)</label>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none font-bold" 
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Typ</label>
                  <select 
                    value={newType}
                    onChange={e => setNewType(e.target.value as TransactionType)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none font-bold text-slate-700 cursor-pointer"
                  >
                    <option value={TransactionType.INCOME}>Einnahme</option>
                    <option value={TransactionType.EXPENSE}>Ausgabe</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={addTransaction}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-black transition transform active:scale-[0.98] shadow-lg flex items-center justify-center gap-2.5 group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform" />
                Hinzufügen
              </button>

              <div className="pt-8 border-t border-slate-100 grid grid-cols-3 gap-3">
                <button 
                  onClick={() => exportToJson(activeProfile)}
                  className="bg-slate-50 text-slate-600 p-3 rounded-2xl text-[10px] font-bold uppercase hover:bg-slate-100 transition flex flex-col items-center gap-1 border border-slate-100"
                >
                  <FileJson size={14}/> JSON
                </button>
                <button 
                  onClick={() => exportToCsv(activeProfile)}
                  className="bg-slate-50 text-slate-600 p-3 rounded-2xl text-[10px] font-bold uppercase hover:bg-slate-100 transition flex flex-col items-center gap-1 border border-slate-100"
                >
                  <FileSpreadsheet size={14}/> CSV
                </button>
                <div className="relative overflow-hidden bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase flex flex-col items-center gap-1 p-3 cursor-pointer hover:bg-black transition shadow-sm">
                  <Plus size={14}/> Import
                  <input 
                    type="file" 
                    accept=".json" 
                    onChange={handleImport}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>

              <button 
                onClick={() => exportToPdf(activeProfile, calculations, user.display)}
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-2xl hover:bg-emerald-700 transition transform active:scale-[0.98] shadow-md flex items-center justify-center gap-2.5"
              >
                <FileText size={18} />
                PDF Exportieren
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Dashboard & List */}
        <div className="lg:col-span-8 space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition hover:shadow-md border-b-4 border-b-emerald-400">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <ChevronRight size={10} /> Einnahmen
              </p>
              <p className="text-2xl font-black text-emerald-600">{fmtUSD(calculations.inc)}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition hover:shadow-md border-b-4 border-b-red-400">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <ChevronRight size={10} /> Ausgaben
              </p>
              <p className="text-2xl font-black text-red-500">{fmtUSD(calculations.exp)}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition hover:shadow-md border-b-4 border-b-indigo-400">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <ChevronRight size={10} /> Steuerlast
              </p>
              <p className="text-2xl font-black text-slate-700">{fmtUSD(calculations.tax)}</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-3xl shadow-xl transition hover:scale-[1.02] border-b-4 border-b-indigo-600">
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                <ChevronRight size={10} /> Netto-Gewinn
              </p>
              <p className="text-2xl font-black text-white">{fmtUSD(calculations.net)}</p>
            </div>
          </div>

          {/* List Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h2 className="font-extrabold text-slate-800 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Transaktionsverlauf
              </h2>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold">
                  {calculations.filteredEntries.length} EINTRÄGE
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <th className="px-8 py-5">Datum</th>
                    <th className="px-8 py-5">Information</th>
                    <th className="px-8 py-5 text-right">Betrag</th>
                    <th className="px-8 py-5 text-center">Aktion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {calculations.filteredEntries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                          <Info className="h-8 w-8 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Keine Daten für diesen Zeitraum</p>
                      </td>
                    </tr>
                  ) : (
                    calculations.filteredEntries.map(e => (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition group">
                        <td className="px-8 py-5 text-sm text-slate-500 whitespace-nowrap font-semibold">{e.date}</td>
                        <td className="px-8 py-5 text-sm font-bold text-slate-800">{e.desc}</td>
                        <td className={`px-8 py-5 text-right font-black whitespace-nowrap ${e.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-red-500'}`}>
                          {e.type === TransactionType.INCOME ? '+' : '-'}{fmtUSD(e.amount)}
                        </td>
                        <td className="px-8 py-5 text-center">
                          <button 
                            onClick={() => deleteTransaction(e.id)}
                            className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => handleDiscordSend(true)}
              className="flex-1 bg-indigo-600 text-white px-8 py-5 rounded-3xl font-black hover:bg-indigo-700 transition flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95"
            >
              <Send size={20} />
              BERICHT AN BEIDE WEBHOOKS
            </button>
            <button 
              onClick={() => handleDiscordSend(false)}
              className="sm:w-1/3 bg-slate-800 text-white px-8 py-5 rounded-3xl font-bold hover:bg-slate-900 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Send size={16} /> WEBHOOK #1
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
