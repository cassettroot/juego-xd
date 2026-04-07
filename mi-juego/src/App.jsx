import React, { useState, useEffect } from 'react';
import { 
    User, Map as MapIcon, Zap, Settings, Briefcase, Coffee, 
    ShoppingCart, Building, Rocket, Landmark, 
    ChevronUp, Star, Edit3, TrendingUp, TrendingDown, Moon, Sun, X
} from 'lucide-react';

// Estilos inyectados: animaciones, scroll oculto y coches
const styles = `
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  @keyframes coinPop {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    100% { transform: translateY(-40px) scale(1.3); opacity: 0; }
  }
  @keyframes driveRight { 0% { left: -20%; } 100% { left: 120%; } }
  @keyframes driveLeft { 0% { left: 120%; } 100% { left: -20%; } }
  @keyframes driveDown { 0% { top: -20%; } 100% { top: 120%; } }
  @keyframes driveUp { 0% { top: 120%; } 100% { top: -20%; } }
  .animate-float { animation: float 3s ease-in-out infinite; }
  .coin-animation {
    animation: coinPop 0.8s ease-out forwards;
    position: absolute; font-weight: 900; color: #4ade80;
    text-shadow: 0 2px 4px rgba(0,0,0,0.5); pointer-events: none; z-index: 50;
  }
  .car { position: absolute; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.4); z-index: 5; }
  .car-h { width: 18px; height: 10px; }
  .car-v { width: 10px; height: 18px; }
  .windshield-h { position: absolute; top: 1px; bottom: 1px; left: 4px; right: 4px; background: rgba(0,0,0,0.5); border-radius: 2px; }
  .windshield-v { position: absolute; left: 1px; right: 1px; top: 4px; bottom: 4px; background: rgba(0,0,0,0.5); border-radius: 2px; }
`;

// --- CATÁLOGO ---
const BUSINESS_CATALOG = {
    'limonada': { name: 'Limonada', icon: Coffee, baseCost: 10, baseIncome: 1, x: '10%', y: '8%' },
    'cafeteria': { name: 'Cafetería', icon: Coffee, baseCost: 50, baseIncome: 3.5, x: '55%', y: '20%' },
    'tienda_online': { name: 'Tienda Online', icon: ShoppingCart, baseCost: 200, baseIncome: 15, x: '8%', y: '40%' },
    'bienes_raices': { name: 'Bienes Raíces', icon: Building, baseCost: 1000, baseIncome: 60, x: '52%', y: '58%' },
    'startup_tech': { name: 'Startup Tech', icon: Rocket, baseCost: 5000, baseIncome: 250, x: '5%', y: '75%' },
    'banco_central': { name: 'Banco Central', icon: Landmark, baseCost: 25000, baseIncome: 1200, x: '50%', y: '88%' }
};

const SKILLS_CATALOG = {
    'click_fuerte_1': { name: 'Click Fuerte I', desc: '+2 Poder', cost: 100 },
    'negociador': { name: 'Negociador', desc: 'Edificios -10% baratos', cost: 500 },
    'click_fuerte_2': { name: 'Click Fuerte II', desc: '+5 Poder', cost: 1500 },
    'visionario': { name: 'Visionario', desc: '+50% Ingresos Globales', cost: 5000 }
};

export default function App() {
    // --- ESTADOS ---
    const [money, setMoney] = useState(0);
    const [clickPower, setClickPower] = useState(1);
    const [businesses, setBusinesses] = useState({});
    const [skills, setSkills] = useState({});
    const [activeTab, setActiveTab] = useState('ciudad');
    const [player, setPlayer] = useState({ name: 'Novato', avatarColor: 'bg-blue-500', level: 1, xp: 0 });
    const [clicks, setClicks] = useState([]);
    
    // Nuevos Estados: Ajustes, Tema y Bolsa
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [stockTrend, setStockTrend] = useState(0);

    // --- LÓGICA DE INGRESOS Y BOLSA ---
    const basePassiveIncome = Object.keys(businesses).reduce((sum, key) => {
        return sum + (BUSINESS_CATALOG[key].baseIncome * businesses[key].level);
    }, 0);

    // El ingreso real se ve afectado por la bolsa de valores (+% o -%)
    const activePassiveIncome = basePassiveIncome * (1 + stockTrend / 100);

    useEffect(() => {
        const interval = setInterval(() => {
            if (activePassiveIncome > 0) {
                setMoney(prev => prev + activePassiveIncome);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [activePassiveIncome]);

    // Simulador de Bolsa de Valores (Cambia cada 4 segundos para testing)
    useEffect(() => {
        const stockInterval = setInterval(() => {
            // Genera un valor entre -5.0% y +5.0%
            const newTrend = (Math.random() * 10 - 5).toFixed(1);
            setStockTrend(parseFloat(newTrend));
        }, 4000);
        return () => clearInterval(stockInterval);
    }, []);

    // --- ACCIONES ---
    const handleWork = (e) => {
        setMoney(prev => prev + clickPower);
        const newClick = {
            id: Date.now(),
            x: Math.random() * 60 - 30, 
            y: Math.random() * 20 - 10, 
            val: clickPower
        };
        setClicks(prev => [...prev, newClick]);
        setTimeout(() => setClicks(prev => prev.filter(c => c.id !== newClick.id)), 800);
    };

    const buyBusiness = (key) => {
        const currentLevel = businesses[key]?.level || 0;
        const cost = Math.floor(BUSINESS_CATALOG[key].baseCost * Math.pow(1.15, currentLevel));
        if (money >= cost) {
            setMoney(prev => prev - cost);
            setBusinesses(prev => ({ ...prev, [key]: { level: currentLevel + 1 } }));
        }
    };

    const buySkill = (key) => {
        const cost = SKILLS_CATALOG[key].cost;
        if (money >= cost && !skills[key]) {
            setMoney(prev => prev - cost);
            setSkills(prev => ({ ...prev, [key]: true }));
            if (key === 'click_fuerte_1') setClickPower(prev => prev + 2);
            if (key === 'click_fuerte_2') setClickPower(prev => prev + 5);
        }
    };

    // --- CLASES DE TEMA (DARK/LIGHT) ---
    const theme = {
        appBg: isDarkMode ? 'bg-slate-900' : 'bg-slate-200',
        contentBg: isDarkMode ? 'bg-slate-800' : 'bg-slate-100',
        text: isDarkMode ? 'text-white' : 'text-slate-900',
        textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
        card: isDarkMode ? 'bg-black/20' : 'bg-white shadow-sm',
        border: isDarkMode ? 'border-white/20' : 'border-gray-300',
        navBg: isDarkMode ? 'bg-slate-900 border-t border-slate-700' : 'bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.1)]',
        headerBg: isDarkMode ? 'from-indigo-950 to-blue-900' : 'from-blue-600 to-blue-500'
    };

    // --- COMPONENTES UI ---
    const renderSettingsModal = () => {
        if (!showSettings) return null;
        return (
            <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className={`${isDarkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900 border-gray-200'} w-full max-w-xs rounded-2xl p-5 border-2 shadow-2xl relative`}>
                    <button onClick={() => setShowSettings(false)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500">
                        <X size={20} />
                    </button>
                    <h2 className="text-xl font-black mb-4 flex items-center gap-2">
                        <Settings size={20}/> Ajustes
                    </h2>
                    
                    <div className={`p-3 rounded-xl flex items-center justify-between mb-4 ${theme.card}`}>
                        <span className="font-bold text-sm">Modo Visual</span>
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-bold text-xs transition-colors ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-yellow-400 text-yellow-900'}`}
                        >
                            {isDarkMode ? <Moon size={14}/> : <Sun size={14}/>}
                            {isDarkMode ? 'Oscuro' : 'Claro'}
                        </button>
                    </div>

                    <div className={`p-3 rounded-xl mb-4 ${theme.card}`}>
                        <p className="font-bold text-sm mb-1">Estado de la Bolsa</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Afecta tus ganancias pasivas.</p>
                        <div className={`flex items-center justify-center gap-2 py-2 rounded-lg font-black ${stockTrend >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                            {stockTrend >= 0 ? <TrendingUp size={18}/> : <TrendingDown size={18}/>}
                            {stockTrend >= 0 ? '+' : ''}{stockTrend}%
                        </div>
                    </div>

                    <button onClick={() => setShowSettings(false)} className="w-full bg-blue-500 text-white font-bold py-2 rounded-xl mt-2 active:scale-95 transition-transform">
                        Cerrar
                    </button>
                </div>
            </div>
        );
    };

    const renderCity = () => (
        // Contenedor principal del mapa CON SCROLL VERTICAL
        <div className="relative w-full h-full bg-[#8fd175] overflow-y-auto overflow-x-hidden hide-scrollbar shadow-inner">
            
            {/* Contenedor interno MÁS ALTO (800px) para permitir el desplazamiento */}
            <div className="relative w-full h-[800px]">
                
                {/* Carreteras Verticales */}
                <div className="absolute top-0 bottom-0 left-[45%] w-10 bg-gray-600 shadow-md">
                    <div className="w-0.5 h-full mx-auto bg-dashed bg-white opacity-50" style={{backgroundImage: 'linear-gradient(to bottom, transparent 50%, white 50%)', backgroundSize: '100% 20px'}}></div>
                    {/* Coches Verticales */}
                    <div className="car car-v bg-red-500 left-1" style={{animation: 'driveDown 7s linear infinite'}}>
                        <div className="windshield-v"></div>
                    </div>
                    <div className="car car-v bg-yellow-400 right-1" style={{animation: 'driveUp 6s linear infinite 2.5s'}}>
                        <div className="windshield-v"></div>
                    </div>
                </div>

                {/* Carreteras Horizontales Principales */}
                <div className="absolute left-0 right-0 top-[28%] h-10 bg-gray-600 shadow-md">
                     <div className="h-0.5 w-full my-auto mt-[19px] bg-dashed bg-white opacity-50" style={{backgroundImage: 'linear-gradient(to right, transparent 50%, white 50%)', backgroundSize: '20px 100%'}}></div>
                     {/* Coches Horizontales */}
                    <div className="car car-h bg-blue-500 top-1" style={{animation: 'driveRight 8s linear infinite 1s'}}>
                        <div className="windshield-h"></div>
                    </div>
                    <div className="car car-h bg-purple-500 bottom-1" style={{animation: 'driveLeft 7s linear infinite'}}>
                        <div className="windshield-h"></div>
                    </div>
                </div>

                {/* Segunda Carretera Horizontal para el sur de la ciudad */}
                <div className="absolute left-0 right-0 top-[68%] h-10 bg-gray-600 shadow-md">
                     <div className="h-0.5 w-full my-auto mt-[19px] bg-dashed bg-white opacity-50" style={{backgroundImage: 'linear-gradient(to right, transparent 50%, white 50%)', backgroundSize: '20px 100%'}}></div>
                    <div className="car car-h bg-orange-500 top-1" style={{animation: 'driveRight 6s linear infinite 3s'}}>
                        <div className="windshield-h"></div>
                    </div>
                </div>

                {/* Negocios en el mapa */}
                {Object.entries(BUSINESS_CATALOG).map(([key, data], index) => {
                    const currentLevel = businesses[key]?.level || 0;
                    const cost = Math.floor(data.baseCost * Math.pow(1.15, currentLevel));
                    const currentIncome = currentLevel * data.baseIncome;
                    const canAfford = money >= cost;
                    const Icon = data.icon;
                    const floatDelay = `${index * 0.4}s`;

                    return (
                        <div key={key} style={{ left: data.x, top: data.y }} className="absolute flex flex-col items-center group w-[35%] max-w-[100px]">
                            <div className="relative mb-1 animate-float" style={{ animationDelay: floatDelay }}>
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-[3px] ${currentLevel > 0 ? 'bg-gradient-to-br from-blue-400 to-blue-600 border-blue-200' : 'bg-gray-400 border-gray-300 grayscale'} shadow-[0_6px_12px_rgba(0,0,0,0.3)] flex items-center justify-center transition-transform transform group-hover:scale-110`}>
                                    <Icon size={24} className="text-white drop-shadow-md" />
                                </div>
                                {currentLevel > 0 && (
                                    <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-yellow-900 font-bold text-[9px] px-1.5 py-0.5 rounded-full border border-white shadow-md">
                                        Lv.{currentLevel}
                                    </div>
                                )}
                            </div>

                            <div className={`backdrop-blur rounded-lg p-1.5 shadow-lg w-full text-center border-b-[3px] ${isDarkMode ? 'bg-white/95 border-gray-300' : 'bg-white/90 border-gray-300'}`}>
                                <h3 className="font-bold text-slate-800 text-[10px] truncate">{data.name}</h3>
                                {currentLevel > 0 ? (
                                    <div className="text-green-600 font-black text-[10px] my-0.5 drop-shadow-sm">+${currentIncome.toFixed(1)}/s</div>
                                ) : (
                                    <div className="text-gray-500 font-semibold text-[9px] my-0.5">No construido</div>
                                )}
                                
                                <button 
                                    onClick={() => buyBusiness(key)}
                                    disabled={!canAfford}
                                    className={`w-full py-0.5 rounded-md font-bold text-[10px] flex items-center justify-center gap-0.5 transition-all 
                                        ${canAfford ? 'bg-green-500 hover:bg-green-400 text-white border-b-2 border-green-700 active:translate-y-0.5 active:border-b-0 animate-pulse' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                >
                                    <ChevronUp size={10} /> ${cost}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const renderPersona = () => (
        <div className={`p-4 h-full overflow-y-auto transition-colors ${theme.contentBg} ${theme.text}`}>
            <h2 className="text-xl font-black mb-4 text-center text-blue-500 drop-shadow-sm">Tu Personaje</h2>
            <div className={`rounded-2xl p-4 mb-4 border text-center transition-colors ${theme.card} ${theme.border}`}>
                <div className={`w-20 h-20 mx-auto rounded-full ${player.avatarColor} border-[3px] border-white shadow-xl flex items-center justify-center mb-3 transition-colors duration-300`}>
                    <User size={36} className="text-white" />
                </div>
                <div className="flex items-center justify-center gap-1.5 mb-2">
                    <input 
                        type="text" 
                        value={player.name}
                        onChange={(e) => setPlayer({...player, name: e.target.value})}
                        className={`bg-transparent text-xl font-bold text-center w-40 border-b focus:outline-none transition-colors ${theme.text} ${isDarkMode ? 'border-white/30 focus:border-blue-400' : 'border-gray-300 focus:border-blue-500'}`}
                    />
                    <Edit3 size={16} className={theme.textMuted} />
                </div>
                <p className="text-blue-500 font-semibold uppercase tracking-wider text-xs mb-3">Nivel {player.level}</p>
                <div className="w-full bg-black/20 rounded-full h-3 mb-1">
                    <div className="bg-gradient-to-r from-blue-400 to-indigo-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className={`text-[10px] text-right ${theme.textMuted}`}>XP: 450 / 1000</p>
            </div>
            <h3 className={`font-bold text-sm mb-2 ${theme.textMuted}`}>Estadísticas Base</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`p-3 rounded-xl transition-colors ${theme.card}`}>
                    <p className={`text-[10px] uppercase mb-1 ${theme.textMuted}`}>Poder Trabajo</p>
                    <p className="text-lg font-black text-blue-500">+${clickPower}/click</p>
                </div>
                <div className={`p-3 rounded-xl transition-colors ${theme.card}`}>
                    <p className={`text-[10px] uppercase mb-1 ${theme.textMuted}`}>Ingreso Total</p>
                    <p className="text-lg font-black text-green-500">+${activePassiveIncome.toFixed(1)}/s</p>
                </div>
            </div>
            <h3 className={`font-bold text-sm mt-4 mb-2 ${theme.textMuted}`}>Cambiar Color</h3>
            <div className="flex justify-between px-2">
                {['bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'].map(color => (
                    <button 
                        key={color} 
                        onClick={() => setPlayer({...player, avatarColor: color})}
                        className={`w-10 h-10 rounded-full ${color} ${player.avatarColor === color ? `border-[3px] scale-110 ${isDarkMode ? 'border-white' : 'border-slate-900'}` : 'border-2 border-transparent'} transition-transform`}
                    />
                ))}
            </div>
        </div>
    );

    const renderSkills = () => (
        <div className={`p-4 h-full overflow-y-auto transition-colors ${theme.contentBg} ${theme.text}`}>
            <div className="text-center mb-5">
                <Zap size={32} className="mx-auto text-yellow-500 mb-2" />
                <h2 className="text-xl font-black text-yellow-500 drop-shadow-sm">Habilidades</h2>
                <p className={`text-xs ${theme.textMuted}`}>Mejora tus capacidades globales</p>
            </div>
            <div className="space-y-3">
                {Object.entries(SKILLS_CATALOG).map(([key, data]) => {
                    const isUnlocked = skills[key];
                    const canAfford = money >= data.cost;
                    return (
                        <div key={key} className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${isUnlocked ? (isDarkMode ? 'bg-yellow-900/30 border-yellow-500' : 'bg-yellow-100 border-yellow-400') : (theme.card + ' ' + theme.border)}`}>
                            <div>
                                <h3 className={`font-bold text-sm sm:text-base ${isUnlocked ? 'text-yellow-600 dark:text-yellow-400' : theme.text}`}>{data.name}</h3>
                                <p className={`text-[11px] ${theme.textMuted}`}>{data.desc}</p>
                            </div>
                            {isUnlocked ? (
                                <div className="bg-yellow-500 text-white font-bold px-2 py-1 rounded-md text-[10px] uppercase">Adquirida</div>
                            ) : (
                                <button 
                                    onClick={() => buySkill(key)}
                                    disabled={!canAfford}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${canAfford ? 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95' : 'bg-gray-400 text-gray-200 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'}`}
                                >
                                    ${data.cost}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className={`flex flex-col h-screen max-w-md mx-auto overflow-hidden font-sans shadow-2xl relative sm:border-x sm:border-slate-800 transition-colors ${theme.appBg}`}>
            <style>{styles}</style>
            
            {renderSettingsModal()}

            {/* HEADER PRINCIPAL - AHORA MUCHO MÁS PEQUEÑO Y COMPACTO */}
            <div className={`bg-gradient-to-r ${theme.headerBg} p-2 rounded-b-[1.5rem] shadow-md z-20 shrink-0 transition-colors`}>
                
                {/* Fila Superior: Dinero, Stats y Ajustes */}
                <div className="flex justify-between items-center mb-1.5 px-1">
                    
                    {/* Perfil y Dinero */}
                    <div className="flex items-center gap-1.5 bg-black/20 rounded-full pr-2 p-0.5 shadow-sm">
                        <div className={`w-6 h-6 rounded-full ${player.avatarColor} border border-white flex items-center justify-center`}>
                            <User size={12} className="text-white" />
                        </div>
                        <div className="text-lg font-black text-white leading-none">${Math.floor(money)}</div>
                    </div>

                    {/* Stats Derecha (Ingresos y Bolsa) */}
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                            {/* Ingreso Pasivo */}
                            <div className="bg-green-900/80 border border-green-500/30 text-green-300 font-bold px-1.5 py-0.5 rounded-full text-[10px] flex items-center shadow-sm">
                                +${activePassiveIncome.toFixed(1)}/s
                            </div>
                            {/* Botón de Ajustes */}
                            <button onClick={() => setShowSettings(true)} className="bg-black/20 p-1 rounded-full text-blue-100 hover:text-white transition-colors">
                                <Settings size={14} />
                            </button>
                        </div>
                        
                        {/* El indicador de la Bolsa de Valores */}
                        <div className={`font-bold px-1.5 py-0.5 rounded-full text-[9px] flex items-center gap-0.5 shadow-sm border ${stockTrend >= 0 ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'}`}>
                            {stockTrend >= 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>}
                            Bolsa: {stockTrend >= 0 ? '+' : ''}{stockTrend}%
                        </div>
                    </div>
                </div>

                {/* BOTÓN TRABAJAR - MÁS COMPACTO Y DELGADO */}
                <div className="relative w-full flex justify-center px-1">
                    <button onClick={handleWork} className="w-full relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-xl blur opacity-30 group-hover:opacity-60 transition duration-200"></div>
                        <div className="relative w-full bg-gradient-to-b from-blue-400 to-blue-600 border-b-2 border-blue-800 rounded-xl py-1.5 flex flex-col items-center justify-center shadow-sm active:border-b-0 active:translate-y-[2px] transition-all">
                            <div className="flex items-center gap-1.5">
                                <Briefcase size={14} className="text-white" />
                                <span className="text-white font-black text-sm tracking-wider">TRABAJAR</span>
                                <span className="text-blue-100 font-bold text-[9px] bg-blue-800/40 px-1.5 py-0.5 rounded-full uppercase ml-1">
                                    +${clickPower} / clk
                                </span>
                            </div>
                        </div>
                    </button>

                    {/* Animación Monedas Flotantes */}
                    {clicks.map(click => (
                        <div key={click.id} className="coin-animation text-sm" style={{ left: `calc(50% + ${click.x}px)`, top: `${click.y + 10}px` }}>
                            +${click.val}
                        </div>
                    ))}
                </div>
            </div>

            {/* ÁREA DE CONTENIDO (Pestañas) */}
            <div className="flex-1 relative z-10 overflow-hidden">
                {activeTab === 'ciudad' && renderCity()}
                {activeTab === 'persona' && renderPersona()}
                {activeTab === 'habilidades' && renderSkills()}
            </div>

            {/* BARRA DE NAVEGACIÓN INFERIOR */}
            <div className={`z-20 shrink-0 p-1 pb-4 px-4 transition-colors ${theme.navBg}`}>
                <div className="flex justify-between items-center relative">
                    <button onClick={() => setActiveTab('persona')} className={`flex flex-col items-center p-2 flex-1 transition-colors ${activeTab === 'persona' ? 'text-blue-500' : theme.textMuted}`}>
                        <User size={20} className={activeTab === 'persona' ? 'fill-current' : ''} />
                        <span className="text-[10px] font-bold mt-1">Persona</span>
                    </button>
                    <button onClick={() => setActiveTab('ciudad')} className={`flex flex-col items-center p-2 flex-1 transition-colors ${activeTab === 'ciudad' ? 'text-blue-500' : theme.textMuted}`}>
                        <div className={`p-2.5 rounded-xl mb-0.5 transition-all ${activeTab === 'ciudad' ? (isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600') + ' scale-110' : 'bg-transparent'}`}>
                            <MapIcon size={24} className={activeTab === 'ciudad' ? 'fill-current opacity-20' : ''} />
                        </div>
                        <span className="text-[10px] font-bold -mt-1">Ciudad</span>
                    </button>
                    <button onClick={() => setActiveTab('habilidades')} className={`flex flex-col items-center p-2 flex-1 transition-colors ${activeTab === 'habilidades' ? 'text-blue-500' : theme.textMuted}`}>
                        <Zap size={20} className={activeTab === 'habilidades' ? 'fill-current' : ''} />
                        <span className="text-[10px] font-bold mt-1">Habilidades</span>
                    </button>
                </div>
            </div>
            
        </div>
    );
}