import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_EXAMS } from '../../data/initialData';
import { Exam, ExamQuestion, ErrorCode, ExamAttempt } from '../../types';
import { ERROR_CODES } from '../../data/errorCodes';
import {
  GraduationCap,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  Play,
  RotateCcw,
  Sparkles,
  BarChart,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExamsView: React.FC = () => {
  const { examAttempts, recordExamAttempt, subjects, profile } = useApp();

  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  const [isFinished, setIsFinished] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [lastAttemptId, setLastAttemptId] = useState<string | null>(null);
  const [errorsBreakdown, setErrorsBreakdown] = useState<Record<ErrorCode, number>>({
    K: 0, M: 0, C: 0, S: 0, U: 0, L: 0, V: 0, R: 0, A: 0
  });

  const handlePrintExamReport = (attempt?: ExamAttempt) => {
    const attemptsToPrint = attempt ? [attempt] : examAttempts;

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert("Veuillez autoriser les fenêtres surgissantes pour ouvrir le relevé de notes.");
      return;
    }

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Relevé de Résultats DAEU B - ${profile.name}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
          .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          h1 { color: #065f46; margin: 0 0 5px 0; font-size: 24px; }
          .subtitle { color: #64748b; font-size: 14px; }
          .card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          .score { font-size: 24px; font-weight: 800; color: #2563eb; }
          .badge { display: inline-block; padding: 4px 10px; background: #ecfdf5; color: #047857; border-radius: 6px; font-size: 12px; font-weight: bold; }
          .btn-print { background: #10b981; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; float: right; }
          @media print { .btn-print { display: none; } body { padding: 0; background: white; } }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">🖨️ Imprimer / Sauvegarder en PDF</button>
        <div class="header">
          <div>
            <h1>CAP DAEU B — Relevé Officiel de Résultats</h1>
            <div class="subtitle">Candidat: <strong>${profile.name}</strong> • Préparation Examen Octobre 2026</div>
          </div>
          <span class="badge">Généré le ${new Date().toLocaleDateString('fr-FR')}</span>
        </div>

        ${attemptsToPrint.length === 0 ? '<p style="color: #64748b;">Aucun résultat d\'examen enregistré pour le moment. Réalisez un premier test dans l\'application !</p>' : attemptsToPrint.map(att => `
          <div class="card">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <h2 style="margin: 0; font-size: 16px; color: #1e293b;">${att.examTitle}</h2>
                <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Date: ${att.date} • Durée effectuation: ${att.durationMinutes} min • Type: ${att.type === 'mini' ? 'Mini-test' : 'Examen blanc'}</p>
              </div>
              <div class="score">${att.score} / 20</div>
            </div>
            <div style="margin-top: 12px; font-size: 13px; color: #334155;">
              <strong>Questions réussies :</strong> ${att.correctCount} sur ${att.totalQuestions}
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `);
    reportWindow.document.close();
  };

  // Timer countdown hook
  useEffect(() => {
    if (!activeExam || isFinished) return;

    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeExam, isFinished]);

  const startExam = (exam: Exam) => {
    setActiveExam(exam);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setSecondsRemaining(exam.durationMinutes * 60);
    setIsFinished(false);
  };

  const handleSelectAnswer = (qId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const finishExam = () => {
    if (!activeExam) return;

    let correctCount = 0;
    const errorsMap: Record<ErrorCode, number> = {
      K: 0, M: 0, C: 0, S: 0, U: 0, L: 0, V: 0, R: 0, A: 0
    };

    activeExam.questions.forEach(q => {
      const uAns = userAnswers[q.id];
      if (uAns === q.correctAnswer) {
        correctCount++;
      } else {
        errorsMap[q.errorCode]++;
      }
    });

    const scoreOut20 = Math.round((correctCount / activeExam.questions.length) * 20);

    setFinalScore(scoreOut20);
    setErrorsBreakdown(errorsMap);
    setIsFinished(true);

    // Save attempt log
    recordExamAttempt({
      examId: activeExam.id,
      examTitle: activeExam.title,
      type: activeExam.type,
      score: scoreOut20,
      totalQuestions: activeExam.questions.length,
      correctCount,
      durationMinutes: Math.round((activeExam.durationMinutes * 60 - secondsRemaining) / 60) || 1,
      errorsSummary: errorsMap,
      userAnswers
    });

    if (scoreOut20 >= 12) {
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Active Exam Mode */}
      {activeExam && !isFinished ? (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          {/* Top Bar: Title & Live Countdown Timer */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                {activeExam.type === 'mini' ? 'Mini-test' : 'Examen blanc'}
              </span>
              <h3 className="text-lg font-bold text-white">{activeExam.title}</h3>
            </div>

            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono font-bold text-sm">
              <Timer className="w-4 h-4 animate-pulse" />
              <span>{formatTimer(secondsRemaining)}</span>
            </div>
          </div>

          {/* Current Question */}
          {activeExam.questions[currentQuestionIdx] && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Question {currentQuestionIdx + 1} sur {activeExam.questions.length}</span>
                <span>Chronomètre actif</span>
              </div>

              <p className="text-sm sm:text-base font-bold text-slate-100 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                {activeExam.questions[currentQuestionIdx].question}
              </p>

              {/* Options */}
              {activeExam.questions[currentQuestionIdx].options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {activeExam.questions[currentQuestionIdx].options!.map((opt, idx) => {
                    const qId = activeExam.questions[currentQuestionIdx].id;
                    const isSelected = userAnswers[qId] === opt;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectAnswer(qId, opt)}
                        className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                            : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Navigation controls */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-800">
                <button
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium disabled:opacity-40"
                >
                  Question précédente
                </button>

                {currentQuestionIdx < activeExam.questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
                  >
                    Question suivante
                  </button>
                ) : (
                  <button
                    onClick={finishExam}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20"
                  >
                    Terminer et soumettre l'épreuve
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ) : activeExam && isFinished ? (
        /* Exam Finished Results View */
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <Award className="w-12 h-12 text-amber-400 mx-auto" />
            <h3 className="text-xl font-extrabold text-white">Résultat de l'épreuve</h3>
            <p className="text-xs text-slate-400">{activeExam.title}</p>

            <div className="inline-block p-4 rounded-2xl bg-slate-800 border border-slate-700 my-3">
              <span className="text-3xl font-black text-blue-400">{finalScore} / 20</span>
              <p className="text-[11px] text-slate-400 mt-1">
                {finalScore >= 14 ? 'Niveau très solide !' : finalScore >= 10 ? 'Niveau correct, à approfondir.' : 'Notions à revoir urgemment.'}
              </p>
            </div>
          </div>

          {/* Detailed Question Correction */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm">Correction détaillée par question</h4>
            {activeExam.questions.map((q, qIdx) => {
              const uAns = userAnswers[q.id];
              const isCorrect = uAns === q.correctAnswer;

              return (
                <div key={q.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-200">Q{qIdx + 1} : {q.question}</span>
                    {isCorrect ? (
                      <span className="text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Correct</span>
                    ) : (
                      <span className="text-red-400 flex items-center gap-1"><XCircle className="w-4 h-4" /> Code [{q.errorCode}]</span>
                    )}
                  </div>

                  <p className="text-slate-300">Votre réponse : <strong className="text-white">{uAns || 'Non répondu'}</strong></p>
                  <p className="text-emerald-400">Bonne réponse : <strong className="text-emerald-300">{q.correctAnswer}</strong></p>
                  <p className="text-slate-400 italic">{q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            <button
              onClick={() => handlePrintExamReport()}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20"
            >
              <span>🖨️ Télécharger / Imprimer mon résultat (PDF)</span>
            </button>
            <button
              onClick={() => setActiveExam(null)}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20"
            >
              Retour à la liste des examens
            </button>
          </div>
        </div>
      ) : (
        /* Exams Directory List & Past Attempts */
        <>
          {/* Header Banner */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                Tests & Examens Blancs Chronométrés
              </h2>
              <p className="text-xs text-slate-400 max-w-xl">
                Simulez les conditions réelles du DAEU B. Évaluez votre niveau avec gestion rigoureuse du temps et calcul automatique de vos notes sur 20.
              </p>
            </div>

            <button
              onClick={() => handlePrintExamReport()}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 shrink-0"
            >
              <span>🖨️ Télécharger tous mes résultats (PDF)</span>
            </button>
          </div>

          {/* Exam List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_EXAMS.map(exam => (
              <div key={exam.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {exam.type === 'mini' ? 'Mini-test (15m)' : 'Examen blanc complet'}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Timer className="w-3.5 h-3.5" />
                    {exam.durationMinutes} min
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-100 text-base">{exam.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{exam.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400">{exam.questions.length} questions</span>
                  <button
                    onClick={() => startExam(exam)}
                    className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Lancer l'épreuve</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Past Attempts History */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-400" />
                Historique de vos résultats ({examAttempts.length})
              </h3>
              {examAttempts.length > 0 && (
                <button
                  onClick={() => handlePrintExamReport()}
                  className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline flex items-center gap-1"
                >
                   Imprimer le relevé complet
                </button>
              )}
            </div>

            <div className="space-y-3">
              {examAttempts.length === 0 ? (
                <p className="text-xs text-slate-500">Aucun examen effectué pour le moment. Cliquez sur "Lancer l'épreuve" ci-dessus pour réaliser votre premier test.</p>
              ) : (
                examAttempts.map(att => (
                  <div key={att.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-100">{att.examTitle}</h4>
                      <p className="text-slate-400 flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> {att.date} • Durée : {att.durationMinutes} min
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <span className="text-base font-extrabold text-blue-400">{att.score} / 20</span>
                        <p className="text-[10px] text-slate-400">{att.correctCount} / {att.totalQuestions} correctes</p>
                      </div>
                      <button
                        onClick={() => handlePrintExamReport(att)}
                        className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium text-[11px] transition-colors"
                        title="Imprimer / Télécharger la fiche de ce résultat"
                      >
                        📄 Relevé PDF
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
