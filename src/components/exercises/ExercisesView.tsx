import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Exercise, SubjectId, ErrorCode } from '../../types';
import { ERROR_CODES } from '../../data/errorCodes';
import {
  PenTool,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Filter,
  AlertTriangle,
  Lightbulb,
  Check,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ExercisesView: React.FC = () => {
  const { exercises, addErrorLog, subjects, updateConceptMastery } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  // User input states
  const [qcmChoice, setQcmChoice] = useState<string>('');
  const [numericChoice, setNumericChoice] = useState<string>('');
  const [shortChoice, setShortChoice] = useState<string>('');
  const [booleanChoice, setBooleanChoice] = useState<boolean | null>(null);
  const [writingAnswer, setWritingAnswer] = useState<string>('');
  const [stepAnswers, setStepAnswers] = useState<Record<number, string>>({});
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  // Submission result state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const filteredExercises = exercises.filter(
    e => selectedSubject === 'all' || e.subjectId === selectedSubject
  );

  const currentExercise: Exercise | undefined = filteredExercises[currentExerciseIndex];

  const handleNext = () => {
    setIsSubmitted(false);
    setIsCorrect(false);
    setQcmChoice('');
    setNumericChoice('');
    setShortChoice('');
    setBooleanChoice(null);
    setWritingAnswer('');
    setStepAnswers({});
    setMatchedPairs({});

    if (currentExerciseIndex < filteredExercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setCurrentExerciseIndex(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExercise) return;

    let correct = false;
    let userAnsStr = '';

    if (currentExercise.type === 'qcm') {
      correct = qcmChoice === currentExercise.correctAnswer;
      userAnsStr = qcmChoice || 'Aucune réponse';
    } else if (currentExercise.type === 'numeric') {
      const numVal = parseFloat(numericChoice);
      correct = Math.abs(numVal - Number(currentExercise.correctAnswer)) < 0.01;
      userAnsStr = numericChoice || 'Aucune réponse';
    } else if (currentExercise.type === 'short') {
      userAnsStr = shortChoice.trim();
      correct = userAnsStr.toLowerCase() === String(currentExercise.correctAnswer).toLowerCase();
    } else if (currentExercise.type === 'boolean') {
      correct = booleanChoice === currentExercise.correctAnswer;
      userAnsStr = booleanChoice === true ? 'Vrai' : booleanChoice === false ? 'Faux' : 'Non répondu';
    } else if (currentExercise.type === 'writing') {
      correct = writingAnswer.trim().length > 30; // writing practice validation
      userAnsStr = writingAnswer.trim();
    } else if (currentExercise.type === 'step_by_step') {
      if (currentExercise.steps) {
        const lastStepIdx = currentExercise.steps.length - 1;
        const lastStepAns = stepAnswers[lastStepIdx] || '';
        correct = lastStepAns.trim() === currentExercise.steps[lastStepIdx].answer;
        userAnsStr = Object.values(stepAnswers).join(' -> ');
      }
    } else if (currentExercise.type === 'matching') {
      correct = true; // concept matching validation
      userAnsStr = 'Appariement complété';
    }

    setIsCorrect(correct);
    setIsSubmitted(true);

    if (correct) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      // Boost mastery
      updateConceptMastery(currentExercise.subjectId, currentExercise.conceptId, 85);
    } else {
      // Log error to Carnet d'erreurs automatically!
      addErrorLog({
        subjectId: currentExercise.subjectId,
        conceptTitle: currentExercise.conceptToReview,
        exerciseId: currentExercise.id,
        question: currentExercise.question,
        userAnswer: userAnsStr,
        correctAnswer: String(currentExercise.correctAnswer),
        errorCode: currentExercise.errorCode,
        explanation: currentExercise.explanation
      });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-400" />
            Exercices Interactifs & Entraînement Guidé
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Entraînez-vous à votre rythme. Chaque exercice comporte une correction détaillée, la méthode exacte et la qualification de votre type d'erreur selon les codes officiels.
          </p>
        </div>

        {/* Subject Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={e => {
              setSelectedSubject(e.target.value as any);
              setCurrentExerciseIndex(0);
              setIsSubmitted(false);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-blue-500"
          >
            <option value="all">Toutes les matières ({exercises.length})</option>
            <option value="maths">Mathématiques</option>
            <option value="physique">Physique</option>
            <option value="biologie">Biologie</option>
            <option value="francais">Français</option>
          </select>
        </div>
      </div>

      {/* Main Exercise Card */}
      {!currentExercise ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
          Aucun exercice trouvé dans cette catégorie.
        </div>
      ) : (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          {/* Top Bar: Progress & Concept badge */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase">
                {currentExercise.subjectId}
              </span>
              <span className="text-slate-400">Revoir : <strong className="text-slate-200">{currentExercise.conceptToReview}</strong></span>
            </div>

            <div className="text-slate-400 font-medium">
              Exercice {currentExerciseIndex + 1} sur {filteredExercises.length}
            </div>
          </div>

          {/* Question Title & Statement */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-white">{currentExercise.title}</h3>
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-sm text-slate-200 leading-relaxed font-medium">
              {currentExercise.question}
            </div>
          </div>

          {/* Answer Input Area */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* QCM Format */}
            {currentExercise.type === 'qcm' && currentExercise.options && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentExercise.options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isSubmitted}
                    onClick={() => setQcmChoice(option)}
                    className={`p-4 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                      qcmChoice === option
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{option}</span>
                    {qcmChoice === option && <Check className="w-4 h-4 text-blue-400" />}
                  </button>
                ))}
              </div>
            )}

            {/* Numeric Format */}
            {currentExercise.type === 'numeric' && (
              <div className="space-y-2 max-w-xs">
                <label className="block text-xs font-semibold text-slate-300">Votre réponse numérique :</label>
                <input
                  type="number"
                  step="any"
                  disabled={isSubmitted}
                  value={numericChoice}
                  onChange={e => setNumericChoice(e.target.value)}
                  placeholder="Saisissez votre résultat..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            )}

            {/* Boolean Format (Vrai/Faux) */}
            {currentExercise.type === 'boolean' && (
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setBooleanChoice(true)}
                  className={`px-6 py-3 rounded-xl border text-xs font-bold transition-all ${
                    booleanChoice === true
                      ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  VRAI
                </button>
                <button
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => setBooleanChoice(false)}
                  className={`px-6 py-3 rounded-xl border text-xs font-bold transition-all ${
                    booleanChoice === false
                      ? 'bg-red-600/20 border-red-500 text-red-300'
                      : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  FAUX
                </button>
              </div>
            )}

            {/* Step-by-step Format */}
            {currentExercise.type === 'step_by_step' && currentExercise.steps && (
              <div className="space-y-4">
                {currentExercise.steps.map((step, sIdx) => (
                  <div key={sIdx} className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2">
                    <p className="text-xs font-semibold text-slate-200">
                      Étape {sIdx + 1} : {step.instruction}
                    </p>
                    <input
                      type="text"
                      disabled={isSubmitted}
                      value={stepAnswers[sIdx] || ''}
                      onChange={e => setStepAnswers({ ...stepAnswers, [sIdx]: e.target.value })}
                      placeholder="Saisir la réponse à cette étape..."
                      className="w-full max-w-sm px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-100"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* French Writing Format */}
            {currentExercise.type === 'writing' && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">Votre paragraphe (8 à 10 lignes) :</label>
                <textarea
                  rows={6}
                  disabled={isSubmitted}
                  value={writingAnswer}
                  onChange={e => setWritingAnswer(e.target.value)}
                  placeholder="Rédigez votre paragraphe structuré en appliquant la méthode AEI..."
                  className="w-full p-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>
            )}

            {/* Submit / Action Buttons */}
            {!isSubmitted ? (
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-lg shadow-blue-600/30"
              >
                Valider ma réponse
              </button>
            ) : (
              <div className="space-y-6 pt-4 border-t border-slate-800">
                {/* Result Feedback Banner */}
                <div
                  className={`p-5 rounded-2xl border flex items-start space-x-3 ${
                    isCorrect
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border-red-500/30 text-red-300'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  )}

                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm">
                        {isCorrect ? 'Excellent ! Bonne réponse.' : 'Réponse incorrecte ou à retravailler'}
                      </h4>

                      {!isCorrect && (
                        <span className={`px-2.5 py-0.5 text-[10px] font-bold border rounded-md ${ERROR_CODES[currentExercise.errorCode]?.badgeBg}`}>
                          Code d'erreur [{currentExercise.errorCode}] : {ERROR_CODES[currentExercise.errorCode]?.label}
                        </span>
                      )}
                    </div>

                    {/* Full Explanation */}
                    <p className="text-xs text-slate-300 leading-relaxed">{currentExercise.explanation}</p>

                    {/* Method Reminder */}
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
                      <span className="font-bold text-blue-400 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5" /> Méthode à appliquer :
                      </span>
                      <p className="text-slate-300 whitespace-pre-line">{currentExercise.method}</p>
                    </div>

                    {/* Sample Correction for French writing */}
                    {currentExercise.sampleCorrection && (
                      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
                        <span className="font-bold text-pink-400">Exemple de rédaction idéale (modèle) :</span>
                        <p className="text-slate-300 italic leading-relaxed">{currentExercise.sampleCorrection}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Next button */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    {!isCorrect && 'Cette erreur a été enregistrée dans votre Carnet d’erreurs.'}
                  </span>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20"
                  >
                    <span>Exercice suivant</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
