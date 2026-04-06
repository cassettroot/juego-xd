import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Briefcase, 
  BookOpen, 
  ShieldCheck, 
  Zap, 
  AlertTriangle,
  PieChart,
  Building,
  Coffee,
  ShoppingBag,
  Globe,
  User,
  Crown,
  Lock,
  LineChart,
  Cpu,
  Shield,
  HardHat,
  Monitor,
  HeartPulse,
  Wrench,
  Utensils,
  Plane,
  FlaskConical
} from 'lucide-react';

// --- CONFIGURACIÓN INICIAL ---
const INITIAL_BUSINESSES = [
  { id: 'coffee', name: 'Cafetería', baseCost: 15, baseIncome: 1, level: 0, icon: Coffee, description: 'Tu primer emprendimiento local.' },
  { id: 'store', name: 'Tienda Online', baseCost: 100, baseIncome: 5, level: 0, icon: ShoppingBag, description: 'Ventas digitales 24/7.' },
  { id: 'realestate', name: 'Bienes Raíces', baseCost: 1100, baseIncome: 20, level: 0, icon: Building, description: 'Rentas pasivas estables.' },
  { id: 'tech', name: 'Startup Tech', baseCost: 12000, baseIncome: 90, level: 0, icon: Globe, description: 'Escalabilidad masiva global.' },
];

// --- ÁRBOL DE HABILIDADES ---
const INITIAL_SKILLS = [
  { id: 'fin_edu', name: 'Ahorro Básico', cost: 50, level: 0, maxLevel: 5, icon: BookOpen, description: 'Base para todo. Desbloquea nuevas ramas.', requires: null, color: 'text-slate-200', border: 'border-slate-500', bg: 'bg-slate-800' },
  { id: 'risk_appetite', name: 'Apetito de Riesgo', cost: 150, level: 0, maxLevel: 5, icon: TrendingUp, description: '+20% de valor por cada clic.', requires: 'fin_edu', color: 'text-red-400', border: 'border-red-600', bg: 'bg-red-950' },
  { id: 'trading', name: 'Trading Activo', cost: 600, level: 0, maxLevel: 5, icon: LineChart, description: '+50% de valor por clic.', requires: 'risk_appetite', color: 'text-red-400', border: 'border-red-600', bg: 'bg-red-950' },
  { id: 'marketing', name: 'Marketing', cost: 150, level: 0, maxLevel: 10, icon: Zap, description: '+10% de valor por clic.', requires: 'fin_edu', color: 'text-yellow-400', border: 'border-yellow-600', bg: 'bg-yellow-950' },
  { id: 'automation', name: 'Automatización', cost: 800, level: 0, maxLevel: 5, icon: Cpu, description: '+10% ingresos pasivos totales.', requires: 'marketing', color: 'text-yellow-400', border: 'border-yellow-600', bg: 'bg-yellow-950' },
  { id: 'emergency_fund', name: 'Fondo Emergencia', cost: 150, level: 0, maxLevel: 5, icon: Shield, description: 'Aumenta Estabilidad Financiera.', requires: 'fin_edu', color: 'text-cyan-400', border: 'border-cyan-600', bg: 'bg-cyan-950' },
  { id: 'risk_mgmt', name: 'Gestión Riesgos', cost: 750, level: 0, maxLevel: 5, icon: AlertTriangle, description: 'Protege contra crisis.', requires: 'emergency_fund', color: 'text-cyan-400', border: 'border-cyan-600', bg: 'bg-cyan-950' },
];

const SKILL_LAYOUT = {
  'fin_edu': { x: 50, y: 85 },
  'risk_appetite': { x: 20, y: 65 },
  'trading': { x: 15, y: 30 },
  'marketing': { x: 50, y: 55 },
  'automation': { x: 50, y: 20 },
  'emergency_fund': { x: 80, y: 65 },
  'risk_mgmt': { x: 85, y: 30 },
};

const SKILL_LINES = [
  { from: 'fin_edu', to: 'risk_appetite', color: 'stroke-red-900' },
  { from: 'risk_appetite', to: 'trading', color: 'stroke-red-900' },
  { from: 'fin_edu', to: 'marketing', color: 'stroke-yellow-900' },
  { from: 'marketing', to: 'automation', color: 'stroke-yellow-900' },
  { from: 'fin_edu', to: 'emergency_fund', color: 'stroke-cyan-900' },
  { from: 'emergency_fund', to: 'risk_mgmt', color: 'stroke-cyan-900' },
];

// --- APARIENCIAS (SKINS) ---
const SKINS = [
  { id: 'novato', name: 'Básico', cost: 0, icon: User, color: 'text-slate-600', bg: 'bg-slate-100', border: 'border-slate-200' },
  { id: 'constructor', name: 'Obrero', cost: 50, icon: HardHat, color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
  { id: 'chef', name: 'Chef', cost: 150, icon: Utensils, color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200' },
  { id: 'freelancer', name: 'Freelancer', cost: 400, icon: Monitor, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
  { id: 'medico', name: 'Médico', cost: 1000, icon: HeartPulse, color: 'text-teal-600', bg: 'bg-teal-100', border: 'border-teal-200' },
  { id: 'ingeniero', name: 'Ingeniero', cost: 2500, icon: Wrench, color: 'text-indigo-600', bg: 'bg-indigo-100', border: 'border-indigo-200' },
  { id: 'cientifico', name: 'Científico', cost: 5000, icon: FlaskConical, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
  { id: 'empresario', name: 'Ejecutivo', cost: 10000, icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
  { id: 'piloto', name: 'Piloto', cost: 15000, icon: Plane, color: 'text-sky-600', bg: 'bg-sky-100', border: 'border-sky-200' },
  { id: 'magnate', name: 'Magnate', cost: 50000, icon: Crown, color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
];

const SKIN_TONES = [
  '#FFDBAC', '#F1C27D', '#E0AC69', '#C68642', '#8D5524', '#3D2218'
];

const EVENTS = [
  { id: 'inflation', title: 'Inflación Alta', description: 'Los precios suben. El valor de tu efectivo disminuye un 5%.', type: 'negative', impact: (state) => ({ ...state, balance: state.balance * 0.95 }) },
  { id: 'bull_market', title: 'Mercado Alcista', description: 'Oportunidades en la bolsa. Recibes un bono de tus activos.', type: 'positive', impact: (state) => ({ ...state, balance: state.balance + (state.passiveIncome * 10) }) },
  { id: 'crisis', title: 'Crisis Económica', description: 'Caída del consumo. Pierdes algo de liquidez.', type: 'negative', impact: (state) => ({ ...state, balance: state.balance * 0.9 }) },
];

export default function App() {
  // --- ESTADO ---
  const [balance, setBalance] = useState(0);
  const [businesses, setBusinesses] = useState(INITIAL_BUSINESSES);
  const [skills, setSkills] = useState(INITIAL_SKILLS);
  const [activeTab, setActiveTab] = useState('personaje');
  const [currentEvent, setCurrentEvent] = useState(null);
  const [selectedSkillId, setSelectedSkillId] = useState('fin_edu');
  
  // Estado del Personaje
  const [equippedSkin, setEquippedSkin] = useState('novato');
  const [ownedSkins, setOwnedSkins] = useState(['novato']);
  const [previewSkin, setPreviewSkin] = useState('novato');
  const [currentTone, setCurrentTone] = useState(SKIN_TONES[1]);

  // --- CÁLCULOS DERIVADOS ---
  const passiveIncome = useMemo(() => {
    let base = businesses.reduce((acc, b) => acc + (b.level * b.baseIncome), 0);
    const automationLevel = skills.find(s => s.id === 'automation').level;
    return base * (1 + (automationLevel * 0.1)); 
  }, [businesses, skills]);

  const clickValue = useMemo(() => {
    const marketingBonus = skills.find(s => s.id === 'marketing').level * 0.1;
    const riskBonus = skills.find(s => s.id === 'risk_appetite').level * 0.2;
    const tradingBonus = skills.find(s => s.id === 'trading').level * 0.5;
    return 1 + marketingBonus + riskBonus + tradingBonus;
  }, [skills]);

  const financialStability = useMemo(() => {
    const eduLevel = skills.find(s => s.id === 'fin_edu').level;
    const emergencyLevel = skills.find(s => s.id === 'emergency_fund').level;
    const riskMgmtLevel = skills.find(s => s.id === 'risk_mgmt').level;
    return Math.min(100, 20 + (eduLevel * 5) + (emergencyLevel * 10) + (riskMgmtLevel * 8));
  }, [skills]);

  const currentAvatar = useMemo(() => {
    return SKINS.find(s => s.id === equippedSkin);
  }, [equippedSkin]);

  const previewAvatarInfo = useMemo(() => {
    return SKINS.find(s => s.id === previewSkin);
  }, [previewSkin]);

  // --- LÓGICA DEL JUEGO ---
  useEffect(() => {
    const timer = setInterval(() => {
      if (passiveIncome > 0) {
        setBalance(prev => prev + (passiveIncome / 10)); 
      }
    }, 100);
    return () => clearInterval(timer);
  }, [passiveIncome]);

  useEffect(() => {
    const eventTimer = setInterval(() => {
      if (Math.random() < 0.20) { 
        const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
        setCurrentEvent(randomEvent);
        setBalance(prev => randomEvent.impact({ balance: prev, passiveIncome }).balance);
        setTimeout(() => setCurrentEvent(null), 6000); 
      }
    }, 20000);
    return () => clearInterval(eventTimer);
  }, [passiveIncome]);

  const handleTap = () => {
    setBalance(prev => prev + clickValue);
  };

  const buyBusiness = (id) => {
    setBusinesses(prev => prev.map(b => {
      if (b.id === id) {
        const cost = Math.floor(b.baseCost * Math.pow(1.15, b.level));
        if (balance >= cost) {
          setBalance(prevB => prevB - cost);
          return { ...b, level: b.level + 1 };
        }
      }
      return b;
    }));
  };

  const upgradeSkill = (id) => {
    setSkills(prev => prev.map(s => {
      if (s.id === id && s.level < s.maxLevel) {
        const cost = Math.floor(s.cost * Math.pow(2, s.level));
        if (balance >= cost) {
          setBalance(prevB => prevB - cost);
          return { ...s, level: s.level + 1 };
        }
      }
      return s;
    }));
  };

  const isSkillUnlocked = (skill) => {
    if (!skill.requires) return true;
    const requiredSkill = skills.find(s => s.id === skill.requires);
    return requiredSkill && requiredSkill.level > 0;
  };

  const handleBuySkin = () => {
    if (!ownedSkins.includes(previewSkin) && balance >= previewAvatarInfo.cost) {
      setBalance(prev => prev - previewAvatarInfo.cost);
      setOwnedSkins(prev => [...prev, previewSkin]);
      setEquippedSkin(previewSkin);
    }
  };

  // --- COMPONENTES DE UI ---
  const FormatCurrency = ({ value }) => (
    <span className="font-mono font-bold">
      ${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
    </span>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-8">
      {/* HEADER / WALLET STATUS */}
      <header className="bg-white border-b sticky top-0 z-50 p-4 shadow-sm">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div 
                className={`p-2 rounded-full border-2 ${currentAvatar.border}`}
                style={{ backgroundColor: currentTone }}
            >
              <currentAvatar.icon className={`w-6 h-6 ${currentAvatar.color}`} />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Tu Balance</p>
              <h1 className="text-2xl font-extrabold text-slate-800">
                <FormatCurrency value={balance} />
              </h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Flujo</p>
            <p className="text-sm font-bold text-green-600">
              +<FormatCurrency value={passiveIncome} />/s
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-6">
        {/* EVENT ALERT */}
        {currentEvent && (
          <div className={`p-4 rounded-xl border-l-4 shadow-md animate-bounce ${
            currentEvent.type === 'positive' ? 'bg-green-50 border-green-500 text-green-800' : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            <div className="flex items-start gap-3">
              {currentEvent.type === 'positive' ? <TrendingUp className="mt-1" /> : <AlertTriangle className="mt-1" />}
              <div>
                <h3 className="font-bold text-sm">{currentEvent.title}</h3>
                <p className="text-xs opacity-90">{currentEvent.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* METRICS DASHBOARD */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase">Estabilidad</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full transition-all duration-500" 
                style={{ width: `${financialStability}%` }}
              />
            </div>
            <p className="text-right text-[10px] mt-1 font-bold text-slate-400">{financialStability}%</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-semibold text-slate-500 uppercase">Nivel de Vida</span>
            </div>
            <p className="text-lg font-bold text-slate-700 truncate">{currentAvatar.name}</p>
          </div>
        </section>

        {/* MAIN INTERACTION AREA (THE TAPPER) */}
        <section className="flex flex-col items-center py-4">
          <button 
            onClick={handleTap}
            className="group relative flex flex-col items-center justify-center w-32 h-32 bg-white rounded-full shadow-xl border-4 border-blue-50 active:scale-95 transition-transform overflow-hidden"
          >
            <div className="absolute inset-0 bg-blue-500 opacity-0 group-active:opacity-10 transition-opacity" />
            <Zap className="w-10 h-10 text-blue-600 mb-1" />
            <span className="text-xs font-black text-blue-600">TRABAJAR</span>
            <span className="text-[10px] text-slate-400">+${clickValue.toFixed(1)}</span>
          </button>
        </section>

        {/* TABS CONTENT */}
        <section className="space-y-4">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            {['ciudad', 'habilidades', 'personaje'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-colors ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* TAB: CIUDAD */}
          {activeTab === 'ciudad' && (
            <div className="relative bg-[#74C365] p-6 rounded-3xl border-4 border-[#5E9B51] overflow-hidden shadow-inner h-[400px] flex flex-col justify-between mb-4">
              <div className="absolute top-1/2 left-0 w-full h-16 bg-[#5A5A5A] -translate-y-1/2 z-0 flex items-center justify-center border-y-4 border-[#4A4A4A]">
                <div className="w-full border-t-4 border-dashed border-[#8A8A8A] opacity-80"></div>
              </div>
              <div className="absolute left-1/2 top-0 h-full w-16 bg-[#5A5A5A] -translate-x-1/2 z-0 flex flex-col justify-center border-x-4 border-[#4A4A4A]">
                <div className="h-full border-l-4 border-dashed border-[#8A8A8A] opacity-80"></div>
              </div>

              <div className="grid grid-cols-2 grid-rows-2 gap-8 relative z-10 h-full w-full place-items-center">
                {businesses.map((b) => {
                  const cost = Math.floor(b.baseCost * Math.pow(1.15, b.level));
                  const canAfford = balance >= cost;
                  const isOwned = b.level > 0;

                  return (
                    <div key={b.id} className="relative flex flex-col items-center justify-center w-full h-full max-h-32">
                      <div className={`w-full h-full max-w-[120px] rounded-xl border-b-[6px] flex flex-col items-center justify-center p-2 shadow-lg transition-all ${isOwned ? 'bg-[#8CE07A] border-[#66A857]' : 'bg-[#4B8B3D] border-[#36662B]'}`}>
                        {isOwned ? (
                          <>
                            <div className="absolute -top-3 right-0 bg-white text-slate-800 text-[11px] font-black w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-200 shadow-md z-20">
                              {b.level}
                            </div>
                            <div className="bg-[#E6F3FF] p-3 rounded-xl shadow-md border-b-[4px] border-[#B3D9FF] mb-2 transform hover:-translate-y-1 transition-transform relative">
                               <b.icon className="w-8 h-8 text-blue-600" />
                               <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full w-3 h-3 border border-yellow-600 animate-pulse"></div>
                            </div>
                            <button
                              onClick={() => buyBusiness(b.id)}
                              disabled={!canAfford}
                              className={`text-[9px] leading-tight font-black px-3 py-1.5 rounded-full shadow-md transition-colors ${canAfford ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95' : 'bg-slate-300 text-slate-500 cursor-not-allowed'}`}
                            >
                              ▲ MEJORAR<br/>${cost}
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="bg-[#8B4513] text-[#FFE4B5] text-[9px] font-black px-2 py-1 rounded border-2 border-[#5C2E0B] shadow-md rotate-[-8deg] mb-2 z-10">
                              SE VENDE
                            </div>
                            <button
                              onClick={() => buyBusiness(b.id)}
                              disabled={!canAfford}
                              className={`text-[10px] leading-tight font-black px-4 py-1.5 rounded-full shadow-md transition-colors ${canAfford ? 'bg-yellow-400 text-yellow-900 border-b-2 border-yellow-600 hover:bg-yellow-300 active:scale-95' : 'bg-slate-600 text-slate-400 border-b-2 border-slate-800 cursor-not-allowed'}`}
                            >
                              COMPRAR<br/>${cost}
                            </button>
                          </>
                        )}
                        <div className="absolute -bottom-7 flex flex-col items-center z-20">
                          <span className="text-[10px] font-bold text-white bg-slate-900/80 px-2 py-0.5 rounded-t-md backdrop-blur-sm whitespace-nowrap shadow-sm">
                            {b.name}
                          </span>
                          {isOwned && (
                            <span className="text-[9px] font-bold text-green-300 bg-slate-900/90 px-2 pb-0.5 rounded-b-md whitespace-nowrap w-full text-center">
                              +${b.level * b.baseIncome}/s
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: HABILIDADES */}
          {activeTab === 'habilidades' && (
            <div className="space-y-4">
              <div className="relative bg-[#0b1121] rounded-3xl h-[420px] overflow-hidden shadow-inner border-2 border-slate-800">
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {SKILL_LINES.map((line, idx) => {
                    const fromPos = SKILL_LAYOUT[line.from];
                    const toPos = SKILL_LAYOUT[line.to];
                    const toSkill = skills.find(s => s.id === line.to);
                    const isLineActive = toSkill.level > 0;

                    return (
                      <line 
                        key={idx}
                        x1={`${fromPos.x}%`} 
                        y1={`${fromPos.y}%`} 
                        x2={`${toPos.x}%`} 
                        y2={`${toPos.y}%`} 
                        className={`${isLineActive ? line.color : 'stroke-slate-800'} transition-colors duration-500`}
                        strokeWidth={isLineActive ? "4" : "2"}
                      />
                    );
                  })}
                </svg>

                {skills.map(skill => {
                  const pos = SKILL_LAYOUT[skill.id];
                  const isUnlocked = isSkillUnlocked(skill);
                  const isMaxed = skill.level >= skill.maxLevel;
                  const isSelected = selectedSkillId === skill.id;
                  
                  return (
                    <button
                      key={skill.id}
                      onClick={() => setSelectedSkillId(skill.id)}
                      className={`absolute z-10 w-12 h-12 -ml-6 -mt-6 rounded-full border-4 flex items-center justify-center transition-all duration-300
                        ${isSelected ? 'scale-125 shadow-[0_0_15px_rgba(255,255,255,0.3)] ring-2 ring-white' : 'hover:scale-110'}
                        ${isUnlocked ? `${skill.bg} ${skill.border} ${skill.color}` : 'bg-slate-900 border-slate-800 text-slate-700 opacity-80'}
                      `}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      {isUnlocked ? (
                        <skill.icon className="w-5 h-5" />
                      ) : (
                        <Lock className="w-4 h-4" />
                      )}

                      {isUnlocked && (
                        <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-700">
                          {isMaxed ? 'M' : skill.level}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {(() => {
                const selected = skills.find(s => s.id === selectedSkillId);
                const cost = Math.floor(selected.cost * Math.pow(2, selected.level));
                const isUnlocked = isSkillUnlocked(selected);
                const canAfford = balance >= cost && selected.level < selected.maxLevel;
                const isMaxed = selected.level >= selected.maxLevel;

                return (
                  <div className="bg-[#0b1121] p-4 rounded-2xl border border-slate-800 text-slate-200 flex items-center gap-4">
                    <div className={`p-3 rounded-xl border-2 ${isUnlocked ? `${selected.bg} ${selected.color} ${selected.border}` : 'bg-slate-900 text-slate-700 border-slate-800'}`}>
                      {isUnlocked ? <selected.icon className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm">{isUnlocked ? selected.name : 'Bloqueado'}</h3>
                        {isUnlocked && (
                          <span className="text-[10px] font-black bg-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase">
                            {selected.level}/{selected.maxLevel}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-tight">
                        {isUnlocked ? selected.description : 'Mejora la habilidad anterior para desbloquear esta rama.'}
                      </p>
                    </div>

                    {isUnlocked && !isMaxed && (
                      <button
                        onClick={() => upgradeSkill(selected.id)}
                        disabled={!canAfford}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
                          canAfford 
                            ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-[0_0_10px_rgba(37,99,235,0.5)]' 
                            : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        }`}
                      >
                        MEJORAR<br />
                        <FormatCurrency value={cost} />
                      </button>
                    )}
                    {isUnlocked && isMaxed && (
                      <div className="px-4 py-2 rounded-xl text-[10px] font-black bg-slate-800 text-slate-500 border border-slate-700">
                        NIVEL<br/>MÁXIMO
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB: PERSONAJE (CREADOR DE PERSONAJES) */}
          {activeTab === 'personaje' && (
            <div className="space-y-4 pb-4">
              
              {/* ÁREA DE VISTA PREVIA */}
              <div className="bg-slate-100 p-6 rounded-3xl border-2 border-slate-200 flex flex-col items-center justify-center relative overflow-hidden h-56 shadow-inner">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="w-full h-full grid grid-cols-3 grid-rows-2 gap-1 p-2">
                    {[...Array(6)].map((_, i) => <div key={i} className="bg-slate-400 rounded"></div>)}
                  </div>
                </div>

                <div 
                    className={`w-32 h-32 rounded-full flex items-center justify-center shadow-lg border-4 z-10 transition-colors duration-300 ${previewAvatarInfo.border}`}
                    style={{ backgroundColor: currentTone }}
                >
                  <previewAvatarInfo.icon className={`w-16 h-16 ${previewAvatarInfo.color}`} />
                </div>
                
                <div className="z-10 mt-4 text-center">
                   <h2 className="text-xl font-bold text-slate-800">{previewAvatarInfo.name}</h2>
                   <p className="text-xs text-slate-500 font-medium">Aspecto seleccionado</p>
                </div>
              </div>

              {/* PANEL DE PERSONALIZACIÓN */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                
                {/* Tonos de piel */}
                <div className="mb-6">
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Tono de piel</h4>
                  <div className="flex gap-3 overflow-x-auto pb-2 px-1">
                    {SKIN_TONES.map(tone => (
                      <button 
                        key={tone}
                        onClick={() => setCurrentTone(tone)} 
                        className={`w-8 h-8 rounded-full border-2 shrink-0 transition-transform ${currentTone === tone ? 'border-slate-800 scale-125' : 'border-transparent hover:scale-110'}`}
                        style={{ backgroundColor: tone }}
                      />
                    ))}
                  </div>
                </div>

                {/* Cuadrícula de Aspectos / Profesiones */}
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">Aspecto / Profesión</h4>
                  <div className="grid grid-cols-4 gap-3 max-h-64 overflow-y-auto pr-1">
                    {SKINS.map((skin) => {
                      const isOwned = ownedSkins.includes(skin.id);
                      const isSelected = previewSkin === skin.id;
                      const isEquipped = equippedSkin === skin.id;

                      return (
                        <button
                          key={skin.id}
                          onClick={() => setPreviewSkin(skin.id)}
                          className={`relative aspect-square rounded-2xl border-2 flex items-center justify-center transition-all ${
                            isSelected ? 'border-slate-800 bg-slate-50 shadow-md scale-105' : 'border-slate-100 bg-white hover:border-slate-300'
                          } ${!isOwned ? 'opacity-60 grayscale' : ''}`}
                        >
                          <div 
                              className={`p-2 rounded-full border ${skin.border}`}
                              style={{ backgroundColor: isOwned ? currentTone : '#e2e8f0' }}
                          >
                            <skin.icon className={`w-6 h-6 ${isOwned ? skin.color : 'text-slate-400'}`} />
                          </div>
                          
                          {isEquipped && (
                             <div className="absolute -top-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                          )}
                          {!isOwned && (
                             <div className="absolute bottom-1 right-1 bg-slate-800 rounded-full p-0.5">
                                <Lock className="w-2.5 h-2.5 text-white" />
                             </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Botón de Acción (Abajo) */}
                <div className="mt-6 border-t border-slate-100 pt-4">
                  {equippedSkin === previewSkin ? (
                    <button disabled className="w-full py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm">
                      EN USO
                    </button>
                  ) : ownedSkins.includes(previewSkin) ? (
                    <button 
                      onClick={() => setEquippedSkin(previewSkin)} 
                      className="w-full py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 active:scale-95 transition-all"
                    >
                      EQUIPAR ESTE ASPECTO
                    </button>
                  ) : (
                    <button 
                      onClick={handleBuySkin}
                      disabled={balance < previewAvatarInfo.cost}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                        balance >= previewAvatarInfo.cost 
                          ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95 shadow-md' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-4 h-4" />
                      DESBLOQUEAR POR  <FormatCurrency value={previewAvatarInfo.cost} />
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}

        </section>
      </main>
    </div>
  );
}