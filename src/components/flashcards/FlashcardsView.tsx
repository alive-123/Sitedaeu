import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Flashcard, SubjectId } from '../../types';
import {
  BrainCircuit,
  RotateCw,
  Plus,
  Trash2,
  Check,
  Sparkles,
  Download,
  Copy,
  Layers,
  CheckCircle2,
  Filter
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const FlashcardsView: React.FC = () => {
  const { flashcards, reviewFlashcard, addFlashcard, deleteFlashcard, subjects } = useApp();

  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New card modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newSubject, setNewSubject] = useState<SubjectId>('maths');

  // Export notification state
  const [copiedExport, setCopiedExport] = useState(false);

  const filteredCards = flashcards.filter(
    c => selectedSubject === 'all' || c.subjectId === selectedSubject
  );

  const currentCard: Flashcard | undefined = filteredCards[currentCardIndex];

  const handleReview = (result: 'easy' | 'medium' | 'hard' | 'again') => {
    if (!currentCard) return;

    reviewFlashcard(currentCard.id, result);
    setIsFlipped(false);

    if (result === 'easy') {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.8 } });
    }

    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    addFlashcard({
      subjectId: newSubject,
      front: newFront.trim(),
      back: newBack.trim()
    });

    setNewFront('');
    setNewBack('');
    setShowAddModal(false);
  };

  // Export to Question ; Réponse format
  const getExportText = () => {
    return filteredCards.map(c => `${c.front.replace(/[\r\n]+/g, ' ')} ; ${c.back.replace(/[\r\n]+/g, ' ')}`).join('\n');
  };

  const handleCopyToClipboard = () => {
    const text = getExportText();
    navigator.clipboard.writeText(text);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2000);
  };

  const handleDownloadCSV = () => {
    const text = getExportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards_elias_${selectedSubject}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-purple-400" />
            Flashcards & Répétition Espacée (Leitner)
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Mémorisez durablement vos cours. Les cartes réussies reviennent moins souvent, tandis que vos points faibles sont revus fréquemment.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>Créer une carte</span>
          </button>

          <button
            onClick={handleCopyToClipboard}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
            title="Exporter sous format Question ; Réponse"
          >
            {copiedExport ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedExport ? 'Copié !' : 'Exporter (Question;Réponse)'}</span>
          </button>
        </div>
      </div>

      {/* Leitner Box Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5].map(boxNum => {
          const count = flashcards.filter(c => c.box === boxNum).length;
          return (
            <div key={boxNum} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400">Boîte Leitner {boxNum}</span>
              <p className="text-xl font-extrabold text-slate-100">{count} <span className="text-xs font-normal text-slate-400">cartes</span></p>
            </div>
          );
        })}
      </div>

      {/* Subject Filter Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <Filter className="w-4 h-4" />
          <span>Matière :</span>
          <select
            value={selectedSubject}
            onChange={e => {
              setSelectedSubject(e.target.value as any);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold focus:outline-none focus:border-purple-500"
          >
            <option value="all">Toutes les matières ({flashcards.length})</option>
            <option value="maths">Mathématiques</option>
            <option value="physique">Physique</option>
            <option value="biologie">Biologie</option>
            <option value="francais">Français</option>
          </select>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
        >
          <Download className="w-3.5 h-3.5" /> Télécharger fichier texte (.txt)
        </button>
      </div>

      {/* Flashcard Card Experience */}
      {!currentCard ? (
        <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs space-y-2">
          <p>Aucune flashcard trouvée dans cette catégorie.</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Card Component */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[280px] p-8 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between shadow-2xl relative select-none ${
              isFlipped
                ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500/40 shadow-indigo-500/10'
                : 'bg-gradient-to-br from-slate-900 to-slate-950 border-slate-800 hover:border-slate-700'
            }`}
          >
            {/* Card Badge */}
            <div className="flex items-center justify-between text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20 font-bold uppercase">
                {currentCard.subjectId}
              </span>

              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                Boîte Leitner {currentCard.box}
                {currentCard.fromError && (
                  <span className="ml-1 text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded border border-red-500/30">
                    Issue d'une erreur
                  </span>
                )}
              </span>
            </div>

            {/* Card Text Content */}
            <div className="my-auto py-6 text-center space-y-3">
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                {isFlipped ? 'VERSO (RÉPONSE)' : 'RECTO (QUESTION)'}
              </span>
              <p className="text-base sm:text-lg font-bold text-slate-100 whitespace-pre-line leading-relaxed">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            {/* Tap instruction */}
            <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Cliquez sur la carte pour retourner</span>
            </div>
          </div>

          {/* Rating Buttons (Visible when flipped) */}
          {isFlipped && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 animate-fadeIn">
              <p className="text-center text-xs font-semibold text-slate-300">Évaluez la difficulté de cette carte :</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleReview('again')}
                  className="px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-bold text-xs transition-colors"
                >
                  À revoir (1j)
                </button>
                <button
                  onClick={() => handleReview('hard')}
                  className="px-3 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs transition-colors"
                >
                  Difficile
                </button>
                <button
                  onClick={() => handleReview('medium')}
                  className="px-3 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold text-xs transition-colors"
                >
                  Moyen
                </button>
                <button
                  onClick={() => handleReview('easy')}
                  className="px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs transition-colors"
                >
                  Facile !
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Flashcard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-scaleIn">
            <h3 className="font-bold text-lg text-slate-100">Créer une nouvelle Flashcard</h3>

            <form onSubmit={handleCreateCard} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Matière</label>
                <select
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value as SubjectId)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
                >
                  <option value="maths">Mathématiques</option>
                  <option value="physique">Physique</option>
                  <option value="biologie">Biologie</option>
                  <option value="francais">Français</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Recto (Question)</label>
                <textarea
                  required
                  rows={3}
                  value={newFront}
                  onChange={e => setNewFront(e.target.value)}
                  placeholder="Ex: Formule du poids d'un corps sur Terre ?"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Verso (Réponse explicative)</label>
                <textarea
                  required
                  rows={3}
                  value={newBack}
                  onChange={e => setNewBack(e.target.value)}
                  placeholder="Ex: P = m × g (Poids en Newtons, masse en kg, g ≈ 9,8 N/kg)"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-purple-500"
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
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow-md shadow-purple-600/20"
                >
                  Créer la carte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
