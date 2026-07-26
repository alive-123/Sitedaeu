import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SubjectId } from '../../types';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Play,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Lightbulb,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Brain,
  Calculator,
  Zap,
  Activity
} from 'lucide-react';

interface SubjectDetailViewProps {
  subjectId: SubjectId;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({ subjectId }) => {
  const { subjects, exercises, setActiveTab, updateConceptMastery } = useApp();
  const subject = subjects.find(s => s.id === subjectId);

  const [expandedConcept, setExpandedConcept] = useState<string | null>(null);

  if (!subject) return <div>Matière introuvable</div>;

  const subjectExercises = exercises.filter(e => e.subjectId === subjectId);

  const subjectIconMap: Record<string, any> = {
    Calculator,
    Zap,
    Activity,
    BookOpen
  };

  const Icon = subjectIconMap[subject.iconName] || BookOpen;

  const toggleConcept = (id: string) => {
    setExpandedConcept(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Subject Hero Header */}
      <div
        className="p-6 sm:p-8 rounded-2xl border relative overflow-hidden"
        style={{
          backgroundColor: '#0F172A',
          borderColor: `${subject.color}40`
        }}
      >
        <div
          className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: subject.color }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ backgroundColor: `${subject.color}20`, color: subject.color }}>
              <Icon className="w-4 h-4" />
              <span>Programme DAEU B • {subject.name}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{subject.name}</h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {subject.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('exercises')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white shadow-lg transition-all active:scale-95"
              style={{ backgroundColor: subject.color }}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>S'entraîner sur cette matière</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chapters & Concepts List */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-400" />
          Chapitres et Notions de cours
        </h3>

        <div className="space-y-4">
          {subject.chapters.map(chapter => (
            <div key={chapter.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800/80 pb-3">
                <h4 className="font-bold text-slate-100 text-base">{chapter.title}</h4>
                <p className="text-xs text-slate-400">{chapter.description}</p>
              </div>

              {/* Concepts Grid */}
              <div className="space-y-3">
                {chapter.concepts.map(concept => {
                  const isExpanded = expandedConcept === concept.id;

                  return (
                    <div
                      key={concept.id}
                      className="rounded-xl bg-slate-800/50 border border-slate-700/50 overflow-hidden transition-all"
                    >
                      {/* Concept Header */}
                      <div
                        onClick={() => toggleConcept(concept.id)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/80 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: subject.color }} />
                          <div>
                            <h5 className="font-semibold text-sm text-slate-100">{concept.title}</h5>
                            <p className="text-xs text-slate-400 line-clamp-1">{concept.summary}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <span className="text-xs font-bold text-slate-200">{concept.mastery}%</span>
                            <p className="text-[10px] text-slate-400">maîtrise</p>
                          </div>

                          <div className="w-16 bg-slate-700 rounded-full h-1.5 overflow-hidden hidden sm:block">
                            <div
                              className="h-1.5 rounded-full transition-all duration-300"
                              style={{ width: `${concept.mastery}%`, backgroundColor: subject.color }}
                            />
                          </div>

                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Concept Expanded Content */}
                      {isExpanded && (
                        <div className="p-4 bg-slate-900/60 border-t border-slate-700/50 space-y-4 text-xs animate-fadeIn">
                          {/* Course Summary */}
                          <div className="space-y-1.5 p-3 rounded-xl bg-slate-800/60 border border-slate-700/40">
                            <div className="flex items-center space-x-2 text-slate-300 font-semibold">
                              <Lightbulb className="w-4 h-4 text-amber-400" />
                              <span>Résumé du cours</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed">{concept.summary}</p>
                          </div>

                          {/* Worked Examples */}
                          {concept.examples && concept.examples.length > 0 && (
                            <div className="space-y-2">
                              <h6 className="font-semibold text-slate-200 flex items-center gap-1.5">
                                <FileCheck className="w-4 h-4 text-blue-400" />
                                Exemple d'application guidé
                              </h6>
                              {concept.examples.map((ex, idx) => (
                                <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-2">
                                  <p className="font-medium text-blue-300">Énoncé : {ex.problem}</p>
                                  <p className="text-emerald-400 font-mono font-semibold bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                                    Solution : {ex.solution}
                                  </p>
                                  <p className="text-slate-400 text-[11px] italic">Méthode : {ex.method}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Adjust Mastery Level controls */}
                          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800">
                            <span className="text-slate-400 text-[11px]">Évaluer ma maîtrise de cette notion :</span>
                            <div className="flex items-center gap-2">
                              {[25, 50, 75, 100].map(val => (
                                <button
                                  key={val}
                                  onClick={() => updateConceptMastery(subjectId, concept.id, val)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all ${
                                    concept.mastery === val
                                      ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                                  }`}
                                >
                                  {val}%
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
