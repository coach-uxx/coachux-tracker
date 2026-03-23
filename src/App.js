import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams, useNavigate } from "react-router-dom";

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const getTodayIndex = () => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; };
const getWeekStart = () => {
  const today = new Date();
  const mon = new Date(today);
  mon.setDate(today.getDate() - getTodayIndex());
  mon.setHours(0,0,0,0);
  return mon;
};
const getWeekDates = (ws) => DAYS.map((_, i) => { const d = new Date(ws); d.setDate(ws.getDate()+i); return d; });
const fmt = (d) => `${d.getDate()}/${d.getMonth()+1}`;
const fmtWeek = (ws) => {
  const e = new Date(ws); e.setDate(ws.getDate()+6);
  return `${ws.getDate()} ${ws.toLocaleString("default",{month:"short"})} – ${e.getDate()} ${e.toLocaleString("default",{month:"short"})}`;
};

const DEFAULT_CATEGORIES = [
  { id:"financial", label:"Financial", color:"#AA0000" },
  { id:"health", label:"Health & Fitness", color:"#AA0000" },
  { id:"relationships", label:"Relationships", color:"#AA0000" },
  { id:"mindset", label:"Mindset & Personal Growth", color:"#AA0000" },
];

const DEFAULT_HABITS = [
  { id:1, name:"Track daily expenses", cat:"financial" },
  { id:2, name:"Review budget", cat:"financial" },
  { id:3, name:"Save 10% of income", cat:"financial" },
  { id:4, name:"No impulse purchases", cat:"financial" },
  { id:5, name:"Morning workout", cat:"health" },
  { id:6, name:"Drink 8 glasses of water", cat:"health" },
  { id:7, name:"Sleep 7–8 hours", cat:"health" },
  { id:8, name:"Eat a nutritious meal", cat:"health" },
  { id:9, name:"Text a friend or family member", cat:"relationships" },
  { id:10, name:"Quality time (no screens)", cat:"relationships" },
  { id:11, name:"Express gratitude to someone", cat:"relationships" },
  { id:12, name:"Morning journaling", cat:"mindset" },
  { id:13, name:"Read for 20 minutes", cat:"mindset" },
  { id:14, name:"10 min meditation", cat:"mindset" },
];

const red = "#AA0000"; const bg = "#0A0A0A"; const surface = "#130000"; const border = "#2A0000";

const CoachUxLogo = () => (
  <svg width="180" height="68" viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="400" height="200" rx="4" fill="#0D0D0D" stroke="#3A0000" strokeWidth="1"/>
    <text x="200" y="45" textAnchor="middle" fontSize="26" fontWeight="900" fill="#FFFFFF" letterSpacing="5">COACH UX</text>
    <line x1="60" y1="52" x2="340" y2="52" stroke="#3A0000" strokeWidth="0.5"/>
    <rect x="20" y="90" width="360" height="12" rx="2" fill="#C0C0C0"/>
    <rect x="14" y="73" width="28" height="46" rx="3" fill="#AA0000" stroke="#880000" strokeWidth="0.5"/>
    <rect x="6" y="67" width="14" height="58" rx="2" fill="#880000" stroke="#660000" strokeWidth="0.5"/>
    <rect x="358" y="73" width="28" height="46" rx="3" fill="#AA0000" stroke="#880000" strokeWidth="0.5"/>
    <rect x="380" y="67" width="14" height="58" rx="2" fill="#880000" stroke="#660000" strokeWidth="0.5"/>
    <rect x="42" y="82" width="10" height="28" rx="1" fill="#888"/>
    <rect x="348" y="82" width="10" height="28" rx="1" fill="#888"/>
    <line x1="60" y1="138" x2="340" y2="138" stroke="#3A0000" strokeWidth="0.5"/>
    <text x="200" y="162" textAnchor="middle" fontSize="16" fill="#AA0000" letterSpacing="4">MASTER YOUR MINDSET</text>
  </svg>
);

const PowerCard = ({ label, fraction, total, pct }) => {
  const full = pct === 100;
  return (
    <div style={{ background:surface, border:`0.5px solid ${border}`, borderRadius:10, padding:"12px 14px", flex:1 }}>
      <div style={{ fontSize:12, color:"#FFFFFF", marginBottom:4 }}>{label}</div>
      <div style={{ fontSize:22, fontWeight:500, color:"#FFFFFF", marginBottom:10 }}>{fraction}/{total}</div>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
        <span style={{ fontSize:11, color:"#FFFFFF", fontWeight:500, letterSpacing:1 }}>{label.toUpperCase()} PROGRESS</span>
        <span style={{ fontSize:11, color:full?"#FF4444":red, fontWeight:700 }}>{pct}%</span>
      </div>
      <div style={{ width:"100%", height:12, background:"#1A1A1A", borderRadius:6, border:"1px solid #333", overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:full?"#FF4444":red, borderRadius:6, transition:"width 0.4s ease" }} />
      </div>
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const [clients, setClients] = useState(() => JSON.parse(localStorage.getItem("cux_clients") || "[]"));
  const [newClient, setNewClient] = useState("");
  const [copied, setCopied] = useState(null);

  const addClient = () => {
    const name = newClient.trim().toLowerCase().replace(/\s+/g, "-");
    if (!name || clients.includes(name)) return;
    const updated = [...clients, name];
    setClients(updated);
    localStorage.setItem("cux_clients", JSON.stringify(updated));
    setNewClient("");
  };

  const removeClient = (name) => {
    const updated = clients.filter(c => c !== name);
    setClients(updated);
    localStorage.setItem("cux_clients", JSON.stringify(updated));
    localStorage.removeItem(`cux_${name}`);
  };

  const copyLink = (name) => {
    const url = `${window.location.origin}/client/${name}`;
    navigator.clipboard.writeText(url);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div style={{ background:bg, minHeight:"100vh", padding:"24px 20px", fontFamily:"system-ui, sans-serif", color:"#FFFFFF" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
        <CoachUxLogo />
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11, color:red, letterSpacing:1 }}>COACH DASHBOARD</div>
        </div>
      </div>

      <div style={{ background:surface, border:`0.5px solid ${border}`, borderRadius:10, padding:"14px 16px", marginBottom:20 }}>
        <div style={{ fontSize:12, color:red, letterSpacing:1, marginBottom:10 }}>ADD NEW CLIENT</div>
        <div style={{ display:"flex", gap:8 }}>
          <input
            style={{ flex:1, background:bg, border:`0.5px solid ${border}`, borderRadius:8, padding:"8px 12px", color:"#FFFFFF", fontSize:14, outline:"none" }}
            placeholder="Client name e.g. john"
            value={newClient}
            onChange={e => setNewClient(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addClient()}
          />
          <button style={{ padding:"8px 16px", background:red, border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer" }} onClick={addClient}>
            Add
          </button>
        </div>
      </div>

      <div style={{ fontSize:12, color:red, letterSpacing:1, marginBottom:12 }}>YOUR CLIENTS</div>
      {clients.length === 0 && <div style={{ fontSize:13, color:"#444", padding:"20px 0" }}>No clients yet. Add one above.</div>}
      {clients.map(name => (
        <div key={name} style={{ background:surface, border:`0.5px solid ${border}`, borderRadius:10, padding:"12px 16px", marginBottom:8, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:15, fontWeight:500, color:"#FFFFFF", textTransform:"capitalize", marginBottom:4 }}>{name.replace(/-/g," ")}</div>
            <div style={{ fontSize:11, color:"#555" }}>{window.location.origin}/client/{name}</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ padding:"6px 12px", background:"none", border:`0.5px solid ${border}`, borderRadius:6, color:copied===name?"#44AA44":"#FFFFFF", fontSize:11, cursor:"pointer" }} onClick={() => copyLink(name)}>
              {copied === name ? "Copied!" : "Copy link"}
            </button>
            <button style={{ padding:"6px 12px", background:"none", border:`0.5px solid ${border}`, borderRadius:6, color:"#FFFFFF", fontSize:11, cursor:"pointer" }} onClick={() => navigate(`/client/${name}`)}>
              View
            </button>
            <button style={{ padding:"6px 12px", background:"none", border:`0.5px solid ${border}`, borderRadius:6, color:"#441111", fontSize:11, cursor:"pointer" }} onClick={() => removeClient(name)}>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function ClientTracker() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const storageKey = `cux_${clientId}`;

  const load = () => JSON.parse(localStorage.getItem(storageKey) || "null");
  const save = (data) => localStorage.setItem(storageKey, JSON.stringify(data));

  const initial = load() || { categories:DEFAULT_CATEGORIES, habits:DEFAULT_HABITS, checked:{}, nextId:20, nextCatId:100 };

  const [categories, setCategories] = useState(initial.categories);
  const [habits, setHabits] = useState(initial.habits);
  const [checked, setChecked] = useState(initial.checked);
  const [nextId, setNextId] = useState(initial.nextId);
  const [nextCatId, setNextCatId] = useState(initial.nextCatId);
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("financial");
  const [adding, setAdding] = useState(false);
  const [addingCat, setAddingCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const todayIdx = getTodayIndex();
  const weekStart = getWeekStart();
  const weekDates = getWeekDates(weekStart);

  useEffect(() => { save({ categories, habits, checked, nextId, nextCatId }); }, [categories, habits, checked]);

  const toggle = (habitId, dayIdx) => {
    const key = `${habitId}-${weekDates[dayIdx].toDateString()}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const isChecked = (habitId, dayIdx) => !!checked[`${habitId}-${weekDates[dayIdx].toDateString()}`];
  const isFuture = (i) => i > todayIdx;
  const isToday = (i) => i === todayIdx;

  const completedToday = habits.filter(h => isChecked(h.id, todayIdx)).length;
  const totalCompletions = habits.reduce((sum,h) => sum + DAYS.filter((_,i) => !isFuture(i) && isChecked(h.id,i)).length, 0);
  const maxPossible = habits.length * (todayIdx+1);
  const dailyPct = habits.length > 0 ? Math.round((completedToday/habits.length)*100) : 0;
  const weeklyPct = maxPossible > 0 ? Math.round((totalCompletions/maxPossible)*100) : 0;

  const addHabit = () => {
    if (!newName.trim()) return;
    const id = nextId+1; setNextId(id);
    setHabits(prev => [...prev, { id, name:newName.trim(), cat:newCat }]);
    setNewName(""); setAdding(false);
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const id = `cat_${nextCatId+1}`; setNextCatId(nextCatId+1);
    setCategories(prev => [...prev, { id, label:newCatName.trim(), color:red }]);
    setNewCatName(""); setAddingCat(false);
  };

  const removeCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    setHabits(prev => prev.filter(h => h.cat !== catId));
    if (activeTab === catId) setActiveTab("all");
  };

  const removeHabit = (id) => setHabits(prev => prev.filter(h => h.id !== id));
  const filteredHabits = activeTab === "all" ? habits : habits.filter(h => h.cat === activeTab);
  const grouped = categories.map(cat => ({ ...cat, habits:filteredHabits.filter(h => h.cat===cat.id) })).filter(g => g.habits.length > 0);

  const s = {
    wrap: { background:bg, minHeight:"100vh", padding:"20px 20px 32px", fontFamily:"system-ui, sans-serif", color:"#FFFFFF" },
    gridRow: { display:"grid", gridTemplateColumns:"1fr repeat(7, 36px)", gap:6, alignItems:"center", marginBottom:6 },
    box: (done,today,future) => ({ width:36, height:36, borderRadius:8, border:today?`2px solid ${red}`:"1px solid #333", background:done?red:"#2A2A2A", cursor:future?"default":"pointer", opacity:future?0.4:1, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }),
    addBtn: { flex:1, padding:10, background:"none", border:`0.5px dashed ${border}`, borderRadius:10, color:"#FFFFFF", fontSize:13, cursor:"pointer" },
    addForm: { background:surface, border:`0.5px solid ${border}`, borderRadius:10, padding:"14px 16px", marginTop:8 },
    input: { width:"100%", background:bg, border:`0.5px solid ${border}`, borderRadius:8, padding:"8px 12px", color:"#FFFFFF", fontSize:14, outline:"none", boxSizing:"border-box", marginBottom:10 },
    select: { width:"100%", background:bg, border:`0.5px solid ${border}`, borderRadius:8, padding:"8px 12px", color:"#FFFFFF", fontSize:13, outline:"none", boxSizing:"border-box", marginBottom:12 },
    saveBtn: { flex:1, padding:8, background:red, border:"none", borderRadius:8, color:"#fff", fontSize:13, fontWeight:500, cursor:"pointer" },
    cancelBtn: { flex:1, padding:8, background:"none", border:`0.5px solid ${border}`, borderRadius:8, color:"#FFFFFF", fontSize:13, cursor:"pointer" },
  };

  const DayHeaders = () => (
    <div style={s.gridRow}>
      <div />
      {DAYS.map((day,i) => (
        <div key={i} style={{ textAlign:"center" }}>
          <div style={{ fontSize:11, color:"#FFFFFF", fontWeight:isToday(i)?600:400 }}>{day}</div>
          <div style={{ fontSize:10, color:isToday(i)?"#FF6666":"#666", marginTop:1 }}>{fmt(weekDates[i])}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={s.wrap}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke={red} strokeWidth="1.5" fill="none"/>
            <line x1="10" y1="11" x2="22" y2="11" stroke={red} strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="16" x2="22" y2="16" stroke={red} strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="10" y1="21" x2="18" y2="21" stroke={red} strokeWidth="1.5" strokeLinecap="round"/>
            <polyline points="18,19 20,22 25,17" fill="none" stroke={red} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ fontSize:18, fontWeight:500 }}>Habit Tracker</span>
        </div>
        <CoachUxLogo />
      </div>

      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, background:surface, border:`0.5px solid ${border}`, borderRadius:10, padding:"10px 14px" }}>
        <div>
          <div style={{ fontSize:11, color:red, letterSpacing:1, marginBottom:2 }}>CLIENT</div>
          <div style={{ fontSize:15, fontWeight:500, textTransform:"capitalize" }}>{clientId.replace(/-/g," ")}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:11, color:red, letterSpacing:1, marginBottom:2 }}>WEEK</div>
          <div style={{ fontSize:12 }}>{fmtWeek(weekStart)}</div>
        </div>
        <button style={{ background:"none", border:`0.5px solid ${border}`, borderRadius:6, color:"#884444", fontSize:11, cursor:"pointer", padding:"4px 10px" }} onClick={() => navigate("/")}>
          Dashboard
        </button>
      </div>

      <div style={{ display:"flex", gap:10, marginBottom:20 }}>
        <PowerCard label="Today" fraction={completedToday} total={habits.length} pct={dailyPct} />
        <PowerCard label="Weekly" fraction={totalCompletions} total={maxPossible} pct={weeklyPct} />
      </div>

      <div style={{ display:"flex", gap:6, marginBottom:20, flexWrap:"wrap" }}>
        {["all", ...categories.map(c=>c.id)].map(id => {
          const label = id === "all" ? "All" : categories.find(c=>c.id===id)?.label;
          const isCustom = !["all","financial","health","relationships","mindset"].includes(id);
          return (
            <div key={id} style={{ padding:"5px 12px", borderRadius:20, fontSize:12, fontWeight:500, cursor:"pointer", border:activeTab===id?`1px solid ${red}`:`0.5px solid ${border}`, background:activeTab===id?`${red}33`:"none", color:"#FFFFFF", display:"flex", alignItems:"center", gap:6 }} onClick={() => setActiveTab(id)}>
              {label}
              {isCustom && <span style={{ fontSize:13, color:"#661111", cursor:"pointer" }} onClick={e => { e.stopPropagation(); removeCategory(id); }}>×</span>}
            </div>
          );
        })}
      </div>

      {grouped.map((group,gi) => (
        <div key={group.id} style={{ marginBottom:24 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:red, flexShrink:0 }} />
            <span style={{ fontSize:13, fontWeight:500 }}>{group.label}</span>
            <span style={{ fontSize:12, marginLeft:"auto" }}>{group.habits.filter(h=>isChecked(h.id,todayIdx)).length}/{group.habits.length} today</span>
          </div>
          <DayHeaders />
          {group.habits.map(habit => (
            <div key={habit.id} style={s.gridRow}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingRight:4 }}>
                <span style={{ fontSize:13 }}>{habit.name}</span>
                <button style={{ background:"none", border:"none", color:"#441111", fontSize:15, cursor:"pointer", padding:0 }} onClick={() => removeHabit(habit.id)}>×</button>
              </div>
              {DAYS.map((_,i) => {
                const done = isChecked(habit.id,i);
                return (
                  <div key={i} style={s.box(done,isToday(i),isFuture(i))} onClick={() => !isFuture(i) && toggle(habit.id,i)}>
                    {done && <span style={{ color:"#fff", fontSize:14, fontWeight:700 }}>✓</span>}
                  </div>
                );
              })}
            </div>
          ))}
          {gi < grouped.length-1 && <div style={{ borderTop:`0.5px solid ${border}`, margin:"16px 0" }} />}
        </div>
      ))}

      {adding ? (
        <div style={s.addForm}>
          <input style={s.input} placeholder="Habit name..." value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addHabit()} autoFocus />
          <select style={s.select} value={newCat} onChange={e=>setNewCat(e.target.value)}>
            {categories.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
          <div style={{ display:"flex", gap:8 }}>
            <button style={s.saveBtn} onClick={addHabit}>Add habit</button>
            <button style={s.cancelBtn} onClick={()=>setAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : addingCat ? (
        <div style={s.addForm}>
          <input style={s.input} placeholder="Category name..." value={newCatName} onChange={e=>setNewCatName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCategory()} autoFocus />
          <div style={{ display:"flex", gap:8 }}>
            <button style={s.saveBtn} onClick={addCategory}>Add category</button>
            <button style={s.cancelBtn} onClick={()=>{ setAddingCat(false); setNewCatName(""); }}>Cancel</button>
          </div>
        </div>
      ) : (
        <div style={{ display:"flex", gap:8, marginTop:4 }}>
          <button style={s.addBtn} onClick={()=>setAdding(true)}>+ Add habit</button>
          <button style={s.addBtn} onClick={()=>setAddingCat(true)}>+ Add category</button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/client/:clientId" element={<ClientTracker />} />
      </Routes>
    </BrowserRouter>
  );
}
