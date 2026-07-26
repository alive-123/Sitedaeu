import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectId } from '../../types';
import {
  Timer,
  Play,
  Pause,
  Square,
  CheckSquare,
  Square as SquareIcon,
  Plus,
  Trash2,
  Sparkles,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FocusView: React.FC = () => {
  const { logStudySession, subjects } = useApp();

  const [mode, setMode] = useState<'pomodoro' | 'free'>('pomodoro');
  const [selectedSubject, setSelectedSubject] = useState<SubjectId>('maths');
  const [timerMinutes, setTimerMinutes] = useState(25);

  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [objectives, setObjectives] = useState<{ id: string; text: string; done: boolean }[]>([
    { id: '1', text: 'Résoudre 3 exercices d’équations', done: false },
    { id: '2', text: 'Revoir la fiche méthode de physique en 6 étapes', done: false }
  ]);
  const [newObjText, setNewObjText] = useState('');

  // Session summary popup
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  useEffect(() => {
    let interval: any = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            handleFinishSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleResetTimer = (minutes: number) => {
    setIsRunning(false);
    setTimerMinutes(minutes);
    setSecondsLeft(minutes * 60);
  };

  const handleFinishSession = () => {
    setIsRunning(false);
    const actualElapsed = Math.max(1, Math.round((timerMinutes * 60 - secondsLeft) / 60));
    setElapsedMinutes(actualElapsed);

    const completedObjs = objectives.filter(o => o.done).length;

    // Log to App state
    logStudySession({
      date: new Date().toISOString().split('T')[0],
      durationMinutes: actualElapsed,
      subjectId: selectedSubject,
      type: mode,
      objectivesCompleted: completedObjs,
      totalObjectives: objectives.length
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    setShowSummaryModal(true);
  };

  const toggleObj = (id: string) => {
    setObjectives(prev =>
      prev.map(o => (o.id === id ? { ...o, done: !o.done } : o))
    );
  };

  const addObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjText.trim()) return;
    setObjectives(prev => [...prev, { id: `o_${Date.now()}`, text: newObjText.trim(), done: false }]);
    setNewObjText('');
  };

  const deleteObj = (id: string) => {
    setObjectives(prev => prev.filter(o => o.id !== id));
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins < 10 ? '0' : ''}${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Timer className="w-5 h-5 text-blue-400" />
            Espace Concentration & Pomodoro
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Éliminez les distractions. Alternez périodes d’étude intense et courtes pauses. Adapté aux séances courtes de 20-40 min ou aux sessions longues.
          </p>
        </div>

        {/* Preset Duration Buttons */}
        <div className="flex items-center gap-2">
          {[20, 25, 40, 50].map(m => (
            <button
              key={m}
              onClick={() => handleResetTimer(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                timerMinutes === m && !isRunning
                  ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timer Display Card */}
        <div className="lg:col-span-2 p-8 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center space-y-6 shadow-2xl">
          {/* Subject Selector for Session */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 font-medium">Matière étudiée :</span>
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value as SubjectId)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold focus:outline-none focus:border-blue-500"
            >
              <option value="maths">Mathématiques</option>
              <option value="physique">Physique</option>
              <option value="biologie">Biologie</option>
              <option value="francais">Français</option>
            </select>
          </div>

          {/* Big Digital Clock Display */}
          <div className="relative my-4">
            <div className="text-6xl sm:text-7xl font-black font-mono tracking-wider text-white bg-gradient-to-b from-white to-slate-300 bg-clip-text text-transparent drop-shadow-lg">
              {formatTimer(secondsLeft)}
            </div>
          </div>

          {/* Controls: Start/Pause & Finish */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleStartPause}
              className={`flex items-center space-x-2 px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95 ${
                isRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-white" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-white" />
                  <span>Démarrer le chrono</span>
                </>
              )}
            </button>

            <button
              onClick={handleFinishSession}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm transition-all"
            >
              <Square className="w-4 h-4 text-slate-400" />
              <span>Terminer la séance</span>
            </button>
          </div>
        </div>

        {/* Session Objectives Checklist */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">Objectifs de la séance</h3>

          <form onSubmit={addObj} className="flex gap-2">
            <input
              type="text"
              value={newObjText}
              onChange={e => setNewObjText(e.target.value)}
              placeholder="Ex: Refaire 2 exercices de fractions..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold"
            >
              <Plus className="w-4 h-4" />
            </button>
          </form>

          <div className="space-y-2 max-h-[220px] overflow-y-auto">
            {objectives.map(obj => (
              <div
                key={obj.id}
                className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-2 text-xs"
              >
                <div
                  onClick={() => toggleObj(obj.id)}
                  className="flex items-center space-x-2 cursor-pointer flex-1"
                >
                  {obj.done ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <SquareIcon className="w-4 h-4 text-slate-500" />
                  )}
                  <span className={obj.done ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}>
                    {obj.text}
                  </span>
                </div>

                <button
                  onClick={() => deleteObj(obj.id)}
                  className="p-1 text-slate-500 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Session Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-scaleIn">
            <Award className="w-12 h-12 text-blue-400 mx-auto" />
            <h3 className="font-bold text-lg text-slate-100">Séance enregistrée !</h3>
            <p className="text-xs text-slate-400">
              Bravo Elias ! Vous avez travaillé pendant <strong className="text-white font-bold">{elapsedMinutes} minutes</strong> en {subjects.find(s => s.id === selectedSubject)?.name}.
            </p>

            <button
              onClick={() => setShowSummaryModal(false)}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20"
            >
              Continuer mon travail
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
