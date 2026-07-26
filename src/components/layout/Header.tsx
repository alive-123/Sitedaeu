import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateDaysRemaining } from '../../utils/formatters';
import { Menu, Moon, Sun, Timer, CalendarCheck, Sparkles, Download } from 'lucide-react';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { profile, toggleDarkMode, activeTab, setActiveTab } = useApp();
  const daysLeft = calculateDaysRemaining(profile.targetExamDate);

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return { title: 'Tableau de bord', subtitle: 'Aperçu global de votre préparation au DAEU B' };
      case 'schedule':
        return { title: 'Plan de travail', subtitle: 'Programme d’études adaptable sur 3 mois' };
      case 'maths':
        return { title: 'Mathématiques', subtitle: 'Calcul, algèbre, équations et fonctions' };
      case 'francais':
        return { title: 'Français', subtitle: 'Compréhension de texte et rédaction structurée' };
      case 'physique':
        return { title: 'Physique', subtitle: 'Formules, conversions et résolution en 6 étapes' };
      case 'biologie':
        return { title: 'Biologie', subtitle: 'Organisation du vivant, organes et métabolisme' };
      case 'exercises':
        return { title: 'Exercices interactifs', subtitle: 'Entraînement guidé avec correction immédiate' };
      case 'flashcards':
        return { title: 'Flashcards', subtitle: 'Répétition espacée pour une mémorisation durable' };
      case 'errors':
        return { title: 'Carnet d’erreurs', subtitle: 'Suivi et analyse systématique des fautes' };
      case 'exams':
        return { title: 'Examens blancs', subtitle: 'Tests chronométrés et simulations d’épreuves' };
      case 'focus':
        return { title: 'Espace Concentration', subtitle: 'Minuteur Pomodoro et suivi de séance' };
      case 'stats':
        return { title: 'Statistiques & Progression', subtitle: 'Analyse détaillée des performances et temps de travail' };
      case 'notes':
        return { title: 'Mes notes & Fiches', subtitle: 'Espace personnel de synthèse de cours' };
      case 'settings':
        return { title: 'Paramètres', subtitle: 'Options de l’application et gestion des données' };
      default:
        return { title: 'Cap DAEU B', subtitle: 'Espace de progression d’Elias' };
    }
  };

  const pageInfo = getPageTitle(activeTab);

  return (
    <header className="sticky top-0 z-30 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Page titles */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 lg:hidden"
            aria-label="Ouvrir le menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
              {pageInfo.title}
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">{pageInfo.subtitle}</p>
          </div>
        </div>

        {/* Right: Exam countdown badge, Pomodoro quick action, Theme toggle */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Exam Countdown */}
          <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <CalendarCheck className="w-4 h-4 text-blue-400" />
            <span>
              <strong className="text-white font-bold">{daysLeft}</strong> jours avant l’examen
            </span>
          </div>

          {/* Quick Focus Button */}
          <button
            onClick={() => setActiveTab('focus')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-600/20 active:scale-95"
          >
            <Timer className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Session de travail</span>
          </button>

          {/* Download Center Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-emerald-400 hover:text-white hover:bg-slate-700 transition-colors"
            title="Télécharger la fiche / Exporter le projet"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            title={profile.isDarkMode ? 'Passer en mode clair' : 'Passer en mode sombre'}
          >
            {profile.isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
