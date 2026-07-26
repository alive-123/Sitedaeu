import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Calendar,
  Calculator,
  BookOpen,
  Zap,
  Activity,
  PenTool,
  BrainCircuit,
  AlertTriangle,
  GraduationCap,
  Timer,
  BarChart2,
  FileText,
  Settings,
  X,
  Sparkles,
  Flame
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, profile, errorLogs } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Accueil', icon: LayoutDashboard },
    { id: 'schedule', label: 'Mon programme', icon: Calendar },
    { id: 'maths', label: 'Mathématiques', icon: Calculator, color: 'text-blue-400' },
    { id: 'francais', label: 'Français', icon: BookOpen, color: 'text-pink-400' },
    { id: 'physique', label: 'Physique', icon: Zap, color: 'text-purple-400' },
    { id: 'biologie', label: 'Biologie', icon: Activity, color: 'text-emerald-400' },
    { id: 'exercises', label: 'Exercices', icon: PenTool },
    { id: 'flashcards', label: 'Flashcards', icon: BrainCircuit },
    {
      id: 'errors',
      label: 'Carnet d’erreurs',
      icon: AlertTriangle,
      badge: errorLogs.filter(e => !e.resolved).length || undefined
    },
    { id: 'exams', label: 'Examens blancs', icon: GraduationCap },
    { id: 'focus', label: 'Concentration', icon: Timer },
    { id: 'stats', label: 'Statistiques', icon: BarChart2 },
    { id: 'notes', label: 'Mes notes', icon: FileText },
    { id: 'settings', label: 'Paramètres', icon: Settings },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0B1120] border-r border-slate-800 text-slate-100 flex flex-col shrink-0 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-xs opacity-75 group-hover:opacity-100 transition duration-300 animate-pulse" />
              <img
                src="/src/assets/images/daeu_sci_badge_1785088450890.jpg"
                alt="DAEU B Sci Badge"
                referrerPolicy="no-referrer"
                className="relative w-10 h-10 rounded-xl object-cover border border-blue-400/30 shadow-md"
              />
            </div>
            <div>
              <h1 className="text-lg font-extrabold bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
                Cap DAEU B
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                Espace Elias
              </p>
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isSubject = ['maths', 'francais', 'physique', 'biologie'].includes(item.id);

            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-colors ${
                  isActive
                    ? 'bg-slate-800/60 text-blue-400 font-semibold border border-blue-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 font-medium'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-400' : 'bg-transparent'}`} />
                  <Icon className={`w-4 h-4 ${item.color || (isActive ? 'text-blue-400' : 'text-slate-400')}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Card */}
        <div className="p-4 border-t border-slate-800 bg-[#0B1120]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow-sm">
              E
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-100 truncate">{profile.name} (24 ans)</p>
              <p className="text-[10px] text-slate-500 truncate">Montigny-lès-Cormeilles</p>
            </div>
            <div className="flex items-center text-amber-400 text-[11px] font-bold bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
              <Flame className="w-3 h-3 mr-0.5 fill-amber-400" />
              7j
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
