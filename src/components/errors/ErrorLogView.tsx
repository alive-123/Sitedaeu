import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ErrorCode, SubjectId } from '../../types';
import { ERROR_CODES } from '../../data/errorCodes';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  RotateCcw,
  Trash2,
  Calendar,
  Sparkles,
  Search,
  Check
} from 'lucide-react';

export const ErrorLogView: React.FC = () => {
  const { errorLogs, resolveErrorLog, deleteErrorLog, retryErrorLog, subjects } = useApp();

  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [codeFilter, setCodeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('unresolved');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = errorLogs.filter(err => {
    if (subjectFilter !== 'all' && err.subjectId !== subjectFilter) return false;
    if (codeFilter !== 'all' && err.errorCode !== codeFilter) return false;
    if (statusFilter === 'unresolved' && err.resolved) return false;
    if (statusFilter === 'resolved' && !err.resolved) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        err.question.toLowerCase().includes(q) ||
        err.conceptTitle.toLowerCase().includes(q) ||
        err.userAnswer.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            Carnet d'Erreurs Systématique
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Comprendre la source exacte de vos erreurs est la clé de voûte de votre réussite au DAEU B. Vos fautes sont classées selon les 9 codes pédagogiques officiels.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <span>{errorLogs.filter(e => !e.resolved).length} erreurs à retravailler</span>
        </div>
      </div>

      {/* Error Codes Classification Legend Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Classification des Erreurs</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {Object.values(ERROR_CODES).map(info => (
            <div
              key={info.code}
              onClick={() => setCodeFilter(codeFilter === info.code ? 'all' : info.code)}
              className={`p-2 rounded-xl border text-center cursor-pointer transition-all ${
                codeFilter === info.code
                  ? 'border-blue-500 bg-blue-500/20'
                  : 'border-slate-800 bg-slate-800/40 hover:bg-slate-800'
              }`}
            >
              <span className={`inline-block px-1.5 py-0.5 text-[10px] font-extrabold rounded ${info.badgeBg}`}>
                {info.code}
              </span>
              <p className="text-[10px] font-semibold text-slate-300 truncate mt-1">{info.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Rechercher une notion, question..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="unresolved">Non résolues uniquement</option>
            <option value="resolved">Résolues uniquement</option>
            <option value="all">Toutes les erreurs</option>
          </select>

          {/* Subject Filter */}
          <select
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:border-blue-500"
          >
            <option value="all">Toutes les matières</option>
            <option value="maths">Mathématiques</option>
            <option value="physique">Physique</option>
            <option value="biologie">Biologie</option>
            <option value="francais">Français</option>
          </select>
        </div>
      </div>

      {/* Error Logs List */}
      <div className="space-y-4">
        {filteredLogs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
            Aucune erreur enregistrée dans cette catégorie. Bravo !
          </div>
        ) : (
          filteredLogs.map(item => {
            const subject = subjects.find(s => s.id === item.subjectId);
            const codeInfo = ERROR_CODES[item.errorCode];

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border space-y-4 transition-all ${
                  item.resolved
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-75'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Top badges */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span
                      className="px-2.5 py-0.5 rounded font-bold uppercase text-[10px]"
                      style={{ backgroundColor: `${subject?.color}20`, color: subject?.color }}
                    >
                      {subject?.name}
                    </span>
                    <span className="text-slate-400 font-semibold">{item.conceptTitle}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md border ${codeInfo?.badgeBg}`}>
                      [{item.errorCode}] {codeInfo?.label}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    {item.repetitionCount > 1 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                        {item.repetitionCount}x
                      </span>
                    )}
                  </div>
                </div>

                {/* Question statement */}
                <p className="font-bold text-slate-100 text-sm">{item.question}</p>

                {/* Answers Comparison */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20 space-y-1">
                    <span className="font-semibold text-red-400">Ma réponse initiale :</span>
                    <p className="text-slate-200 font-medium">{item.userAnswer}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1">
                    <span className="font-semibold text-emerald-400">Réponse correcte :</span>
                    <p className="text-slate-200 font-medium">{item.correctAnswer}</p>
                  </div>
                </div>

                {/* Explanation */}
                {item.explanation && (
                  <p className="text-xs text-slate-300 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                    <strong className="text-blue-400 font-semibold">Explication : </strong>
                    {item.explanation}
                  </p>
                )}

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                  <button
                    onClick={() => resolveErrorLog(item.id)}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      item.resolved
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{item.resolved ? 'Résolue' : 'Marquer comme comprise'}</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => retryErrorLog(item.id)}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Refaire cet exercice</span>
                    </button>

                    <button
                      onClick={() => deleteErrorLog(item.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
