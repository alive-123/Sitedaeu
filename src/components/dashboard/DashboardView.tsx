import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  calculateDaysRemaining,
  calculateTodayStudyMinutes,
  calculateWeeklyStudyMinutes,
  calculateOverallProgress,
  formatMinutesToHours,
  getSubjectMastery
} from '../../utils/formatters';
import {
  Sparkles,
  Timer,
  TrendingUp,
  Target,
  Calendar,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  GraduationCap,
  CheckCircle2,
  Clock,
  Zap,
  BookOpen,
  Calculator,
  Activity,
  Flame,
  Plus
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    profile,
    subjects,
    schedule,
    studySessions,
    errorLogs,
    setActiveTab,
    toggleTask
  } = useApp();

  const daysLeft = calculateDaysRemaining(profile.targetExamDate);
  const todayMinutes = calculateTodayStudyMinutes(studySessions);
  const weeklyMinutes = calculateWeeklyStudyMinutes(studySessions);
  const overallProgress = calculateOverallProgress(subjects);

  // Calculate subject mastery levels
  const subjectMasteries = subjects.map(s => ({
    ...s,
    mastery: getSubjectMastery(s)
  })).sort((a, b) => a.mastery - b.mastery);

  const weakestSubject = subjectMasteries[0];
  const topSubject = subjectMasteries[subjectMasteries.length - 1];

  // Get today's pending schedule tasks
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayTasks = schedule.filter(t => t.date === todayDateStr);
  const nextTask = todayTasks.find(t => !t.completed) || schedule.find(t => !t.completed);

  // Unresolved errors count
  const pendingErrorsCount = errorLogs.filter(e => !e.resolved).length;

  const subjectIconMap: Record<string, any> = {
    Calculator,
    Zap,
    Activity,
    BookOpen
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Welcome Banner with Sci Banner Image */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1E293B] border border-slate-800 shadow-2xl group">
        <img
          src="/src/assets/images/daeu_sci_banner_1785088437910.jpg"
          alt="Science & Technology Background"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover opacity-25 group-hover:scale-105 transition-transform duration-700 pointer-events-none"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A] via-[#0F172A]/90 to-[#0F172A]/60" />
        
        <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              <span>Espace Interactif Cap DAEU B • Examen Octobre 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bonjour <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">{profile.name}</span> 👋
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
              Il reste environ <strong className="text-blue-400 font-bold">{daysLeft} jours</strong> de préparation intensive avant votre examen. Suivez vos objectifs quotidiens, révisez vos fiches et entraînez-vous aux épreuves !
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('focus')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95"
            >
              <Timer className="w-4 h-4" />
              <span>Lancer une séance Pomodoro</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-semibold backdrop-blur-sm transition-all"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Télécharger / Exporter</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Days Remaining */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Jours restants</p>
            <p className="text-2xl font-extrabold text-white">{daysLeft} <span className="text-xs font-normal text-slate-400">jours</span></p>
            <p className="text-[11px] text-blue-400 font-medium">Échéance mi-octobre 2026</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Calendar className="w-6 h-6" />
          </div>
        </div>

        {/* Global Progress */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Progression globale</p>
            <p className="text-2xl font-extrabold text-white">{overallProgress}%</p>
            <div className="w-32 bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Work Time Today */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Travail aujourd'hui</p>
            <p className="text-2xl font-extrabold text-white">{formatMinutesToHours(todayMinutes)}</p>
            <p className="text-[11px] text-slate-400">
              Objectif bon jour : <strong className="text-slate-300">4h30</strong>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Work Time Weekly */}
        <div className="p-5 rounded-2xl bg-[#1E293B] border border-slate-800 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-400">Travail cette semaine</p>
            <p className="text-2xl font-extrabold text-white">{formatMinutesToHours(weeklyMinutes)}</p>
            <p className="text-[11px] text-amber-400 font-medium flex items-center gap-1">
              <Flame className="w-3 h-3 fill-amber-400" /> Assiduité constante
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Next Recommended Session & Today's Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Recommended Session Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#1E293B] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Target className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">Prochaine séance recommandée</h3>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
              Optimisé pour votre niveau
            </span>
          </div>

          {nextTask ? (
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 uppercase tracking-wider">
                  {nextTask.subjectId === 'maths' ? 'Mathématiques' : nextTask.subjectId === 'physique' ? 'Physique' : nextTask.subjectId === 'biologie' ? 'Biologie' : 'Français'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {nextTask.durationMinutes} min
                </span>
              </div>
              <div>
                <h4 className="font-bold text-slate-100 text-base">{nextTask.title}</h4>
                {nextTask.notes && <p className="text-xs text-slate-400 mt-1">{nextTask.notes}</p>}
              </div>
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('focus')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20"
                >
                  <Timer className="w-4 h-4" />
                  <span>Démarrer ce chrono ({nextTask.durationMinutes} min)</span>
                </button>
                <button
                  onClick={() => toggleTask(nextTask.id)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700"
                >
                  Marquer comme faite
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/40 text-center text-slate-400 text-xs">
              Toutes vos séances prévues aujourd'hui sont terminées ! Félicitations Elias.
            </div>
          )}

          {/* Weakest vs Most Progressing Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-red-400">
                <span>Matière à renforcer</span>
                <AlertTriangle className="w-4 h-4" />
              </div>
              <p className="font-bold text-slate-200 text-sm">{weakestSubject?.name}</p>
              <p className="text-xs text-slate-400">Maîtrise actuelle : {weakestSubject?.mastery}%</p>
              <button
                onClick={() => setActiveTab(weakestSubject?.id || 'maths')}
                className="text-xs text-red-400 hover:underline inline-flex items-center gap-1 font-medium pt-1"
              >
                Travailler les notions <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                <span>Matière la plus forte</span>
                <TrendingUp className="w-4 h-4" />
              </div>
              <p className="font-bold text-slate-200 text-sm">{topSubject?.name}</p>
              <p className="text-xs text-slate-400">Maîtrise actuelle : {topSubject?.mastery}%</p>
              <button
                onClick={() => setActiveTab(topSubject?.id || 'maths')}
                className="text-xs text-emerald-400 hover:underline inline-flex items-center gap-1 font-medium pt-1"
              >
                Revoir le cours <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions & Daily Summary */}
        <div className="p-6 rounded-2xl bg-[#1E293B] border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">Actions rapides du jour</h3>

          <div className="space-y-2.5">
            <button
              onClick={() => setActiveTab('exercises')}
              className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white">S'entraîner aux exercices</p>
                  <p className="text-[11px] text-slate-400">Maths, Physique, Bio, Français</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              onClick={() => setActiveTab('flashcards')}
              className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white">Réviser mes flashcards</p>
                  <p className="text-[11px] text-slate-400">Répétition espacée Leitner</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              onClick={() => setActiveTab('errors')}
              className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white">Refaire mes erreurs</p>
                  <p className="text-[11px] text-slate-400">{pendingErrorsCount} erreurs non résolues</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </button>

            <button
              onClick={() => setActiveTab('exams')}
              className="w-full p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200 group-hover:text-white">Mini-test / Examen blanc</p>
                  <p className="text-[11px] text-slate-400">Simulation d'épreuve chronométrée</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress per subject cards */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-100 text-sm">Progression par matière</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectMasteries.map(sub => {
            const Icon = subjectIconMap[sub.iconName] || BookOpen;

            return (
              <div
                key={sub.id}
                onClick={() => setActiveTab(sub.id)}
                className="p-5 rounded-2xl bg-[#1E293B] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: `${sub.color}20`, color: sub.color }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-200">{sub.mastery}%</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-100 text-sm group-hover:text-blue-400 transition-colors">
                    {sub.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{sub.description}</p>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${sub.mastery}%`, backgroundColor: sub.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
