import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskType, StudyTask, SubjectId } from '../../types';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle2,
  Circle,
  Trash2,
  CalendarDays,
  Filter,
  Sparkles,
  MoveRight,
  Flame
} from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const { schedule, addTask, toggleTask, deleteTask, subjects, setActiveTab } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterSubject, setFilterSubject] = useState<string>('all');

  // Form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectId>('maths');
  const [newDuration, setNewDuration] = useState(60);
  const [newType, setNewType] = useState<TaskType>('normal');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newNotes, setNewNotes] = useState('');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addTask({
      title: newTitle.trim(),
      subjectId: newSubject,
      durationMinutes: Number(newDuration),
      type: newType,
      date: newDate,
      completed: false,
      notes: newNotes.trim() || undefined
    });

    setNewTitle('');
    setNewNotes('');
    setShowAddModal(false);
  };

  const filteredSchedule = schedule.filter(task => {
    if (filterType !== 'all' && task.type !== filterType) return false;
    if (filterSubject !== 'all' && task.subjectId !== filterSubject) return false;
    return true;
  });

  const getTaskTypeBadge = (type: TaskType) => {
    switch (type) {
      case 'normal':
        return <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">Session normale (2-4h)</span>;
      case 'short':
        return <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md">Session courte (20-40 min)</span>;
      case 'revision':
        return <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-md">Révision</span>;
      case 'test':
        return <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-md">Test rapide</span>;
      case 'exam':
        return <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-red-500/10 text-red-400 border border-red-500/20 rounded-md">Examen blanc</span>;
      case 'recovery':
        return <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-md">Récupération active</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-400" />
            Programme de travail sur 3 mois
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Un emploi du temps réaliste et flexible. Basculez entre de longues séances studieuses (4-5h) lors de vos bonnes journées et des mini-séances ciblées (20-40 min) les jours plus chargés.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter une séance</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Filter className="w-4 h-4 text-slate-500" />
          <span>Filtrer par :</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Toutes les matières</option>
            <option value="maths">Mathématiques</option>
            <option value="physique">Physique</option>
            <option value="biologie">Biologie</option>
            <option value="francais">Français</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Tous les types</option>
            <option value="normal">Session normale (2-4h)</option>
            <option value="short">Session courte (20-40 min)</option>
            <option value="revision">Révision</option>
            <option value="test">Test</option>
            <option value="exam">Examen blanc</option>
            <option value="recovery">Récupération</option>
          </select>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-3">
        {filteredSchedule.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs space-y-2">
            <p>Aucune séance ne correspond aux filtres sélectionnés.</p>
          </div>
        ) : (
          filteredSchedule.map(task => {
            const subject = subjects.find(s => s.id === task.subjectId);

            return (
              <div
                key={task.id}
                className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  task.completed
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded uppercase"
                        style={{ backgroundColor: `${subject?.color}20`, color: subject?.color }}
                      >
                        {subject?.name}
                      </span>
                      {getTaskTypeBadge(task.type)}
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5" />
                        {task.date}
                      </span>
                    </div>

                    <h4
                      className={`font-semibold text-sm ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-100'
                      }`}
                    >
                      {task.title}
                    </h4>

                    {task.notes && <p className="text-xs text-slate-400">{task.notes}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <div className="text-xs text-slate-300 font-medium flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/50">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {task.durationMinutes} min
                  </div>

                  {!task.completed && (
                    <button
                      onClick={() => setActiveTab('focus')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold border border-blue-500/30 transition-colors"
                    >
                      Lancer chrono
                    </button>
                  )}

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Supprimer la tâche"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <h3 className="font-bold text-lg text-slate-100">Ajouter une séance de travail</h3>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Titre de la séance</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Équations complexes & Factorisation"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Matière</label>
                  <select
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value as SubjectId)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="maths">Mathématiques</option>
                    <option value="physique">Physique</option>
                    <option value="biologie">Biologie</option>
                    <option value="francais">Français</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Type de séance</label>
                  <select
                    value={newType}
                    onChange={e => setNewType(e.target.value as TaskType)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="normal">Normale (2-4h)</option>
                    <option value="short">Courte (20-40m)</option>
                    <option value="revision">Révision</option>
                    <option value="test">Test</option>
                    <option value="exam">Examen blanc</option>
                    <option value="recovery">Récupération</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Durée (minutes)</label>
                  <input
                    type="number"
                    min={10}
                    max={360}
                    value={newDuration}
                    onChange={e => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Notes / Objectifs spé (optionnel)</label>
                <textarea
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="Formules à revoir, exercices à faire..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500 h-20"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20"
                >
                  Ajouter au programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
