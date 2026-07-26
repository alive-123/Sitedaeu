import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Moon,
  Sun,
  RotateCcw,
  Download,
  Upload,
  User,
  Calendar,
  AlertTriangle,
  Check,
  Database,
  Sparkles
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    toggleDarkMode,
    resetData,
    exportDataJSON,
    importDataJSON
  } = useApp();

  const [targetDate, setTargetDate] = useState(profile.targetExamDate);
  const [goodDayHours, setGoodDayHours] = useState(profile.dailyGoalMinutesGoodDay / 60);
  const [toughDayMins, setToughDayMins] = useState(profile.dailyGoalMinutesToughDay);

  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      targetExamDate: targetDate,
      dailyGoalMinutesGoodDay: Math.round(goodDayHours * 60),
      dailyGoalMinutesToughDay: Number(toughDayMins)
    });
    alert('Paramètres enregistrés avec succès !');
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cap_daeu_b_elias_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGeneratePrintableReport = () => {
    const jsonStr = exportDataJSON();
    let data;
    try {
      data = JSON.parse(jsonStr);
    } catch {
      alert("Erreur lors de la lecture des données.");
      return;
    }

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert("Veuillez autoriser les fenêtres surgissantes (popups) pour afficher le rapport.");
      return;
    }

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Cap DAEU B - Bilan de Révision de ${profile.name}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          h1 { color: #1e3a8a; margin: 0 0 5px 0; font-size: 24px; }
          .subtitle { color: #64748b; font-size: 14px; }
          .card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          h2 { color: #2563eb; font-size: 16px; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
          ul { margin: 0; padding-left: 20px; }
          li { margin-bottom: 6px; font-size: 13px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .badge { display: inline-block; padding: 3px 8px; background: #dbeafe; color: #1e40af; border-radius: 6px; font-size: 12px; font-weight: bold; }
          .btn-print { background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; float: right; }
          @media print { .btn-print { display: none; } body { padding: 0; background: white; } }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">🖨️ Imprimer / Enregistrer en PDF</button>
        <div class="header">
          <div>
            <h1>CAP DAEU B — Rapport & Fiche de Progression</h1>
            <div class="subtitle">Étudiant: <strong>${profile.name}</strong> • Préparation Examen Octobre 2026</div>
          </div>
          <span class="badge">Exporté le ${new Date().toLocaleDateString('fr-FR')}</span>
        </div>

        <div class="grid">
          <div class="card">
            <h2>🎯 Profil & Objectifs</h2>
            <ul>
              <li><strong>Série :</strong> DAEU B Scientifique</li>
              <li><strong>Série de révision :</strong> 7 jours consécutifs</li>
              <li><strong>Objectif bon jour :</strong> ${profile.dailyGoalMinutesGoodDay / 60}h/jour</li>
              <li><strong>Objectif jour chargé :</strong> ${profile.dailyGoalMinutesToughDay} min/jour</li>
            </ul>
          </div>
          <div class="card">
            <h2>📚 Statistiques Générales</h2>
            <ul>
              <li><strong>Session totale :</strong> ${data.studyLogs ? data.studyLogs.length : 0} séances enregistrées</li>
              <li><strong>Notes de cours :</strong> ${data.notes ? data.notes.length : 0} fiches créées</li>
              <li><strong>Cartes Mémoire (Flashcards) :</strong> ${data.flashcards ? data.flashcards.length : 0} cartes</li>
              <li><strong>Carnet d'Erreurs :</strong> ${data.errorLogs ? data.errorLogs.length : 0} erreurs enregistrées</li>
            </ul>
          </div>
        </div>

        <div class="card">
          <h2>📝 Carnet des Erreurs Fréquentes à Réviser</h2>
          <ul>
            ${(data.errorLogs || []).slice(0, 8).map((err: any) => `
              <li><strong>[${err.subjectId?.toUpperCase()}] ${err.title || 'Erreur'} :</strong> ${err.solution || 'Analyse en cours'}</li>
            `).join('') || '<li>Aucune erreur enregistrée pour le moment.</li>'}
          </ul>
        </div>

        <div class="card">
          <h2>📌 Notes & Fiches Récents</h2>
          <ul>
            ${(data.notes || []).slice(0, 6).map((note: any) => `
              <li><strong>[${note.subjectId?.toUpperCase()}] ${note.title} :</strong> ${note.content.substring(0, 100)}...</li>
            `).join('') || '<li>Aucune note personnelle enregistrée.</li>'}
          </ul>
        </div>
      </body>
      </html>
    `);
    reportWindow.document.close();
  };

  const handleImportBackup = () => {
    if (!importText.trim()) return;
    const success = importDataJSON(importText);
    if (success) {
      setImportStatus('Données importées avec succès !');
      setImportText('');
    } else {
      setImportStatus('Erreur : Format JSON invalide.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-400" />
          Paramètres & Gestion de l'Application
        </h2>
        <p className="text-xs text-slate-400 max-w-xl">
          Personnalisez vos objectifs de travail quotidien, l'apparence visuelle et gérez la sauvegarde ou réinitialisation de vos données.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile & Goals Settings */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" />
            Profil & Objectifs d'Échéance
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Prénom & Nom</label>
              <input
                type="text"
                disabled
                value={profile.name}
                className="w-full px-3 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Date visée de l'examen DAEU B</label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Objectif bon jour (heures)</label>
                <input
                  type="number"
                  step="0.5"
                  min={1}
                  max={12}
                  value={goodDayHours}
                  onChange={e => setGoodDayHours(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Objectif jour chargé (minutes)</label>
                <input
                  type="number"
                  step="5"
                  min={10}
                  max={120}
                  value={toughDayMins}
                  onChange={e => setToughDayMins(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold shadow-md shadow-blue-600/20"
            >
              Sauvegarder mes modifications
            </button>
          </form>
        </div>

        {/* Theme & Display Mode */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            {profile.isDarkMode ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
            Thème Visuel
          </h3>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-200">Mode Sombre Immertif (Recommandé)</p>
              <p className="text-[11px] text-slate-400">Fond bleu nuit élégant et repose-yeux pour les longues séances.</p>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                profile.isDarkMode
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-700 text-slate-300'
              }`}
            >
              {profile.isDarkMode ? 'Activé' : 'Désactivé'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-2">
            <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-blue-400" />
              Architecture Évolutive (Supabase & IA)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Votre plateforme enregistre actuellement votre progression localement (localStorage). L'architecture est pré-structurée pour connecter ultérieurement une base Supabase, un système d'authentification et une IA de génération d'exercices.
            </p>
          </div>
        </div>

        {/* Export / Import Data & Printable Report */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
          <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-400" />
            Centre de Téléchargement & Exportation
          </h3>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                1. Télécharger la Fiche de Bilan (PDF / Imprimable)
              </h4>
              <p className="text-[11px] text-slate-400">
                Générez un document récapitulatif complet de vos notes, votre carnet d'erreurs et votre assiduité prêt à être imprimé ou sauvegardé en PDF.
              </p>
              <button
                onClick={handleGeneratePrintableReport}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Générer le Bilan PDF / Imprimable</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Database className="w-4 h-4 text-emerald-400" />
                2. Sauvegarde Complète des Données (.JSON)
              </h4>
              <p className="text-[11px] text-slate-400">
                Téléchargez un fichier de sauvegarde brute de l'ensemble de vos statistiques, notes, flashcards et carnet d'erreurs.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger la Sauvegarde JSON</span>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-2">
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <Upload className="w-4 h-4 text-purple-400" />
                3. Télécharger / Exporter le Code Source complet du Projet
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Pour récupérer tout le code source complet de cette application (React, Vite, TypeScript, Tailwind) :
              </p>
              <ul className="text-[11px] text-slate-300 list-disc list-inside space-y-1 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <li>Cliquez sur le menu <strong>Options / Paramètres de la plateforme</strong> en haut à droite.</li>
                <li>Sélectionnez <strong>"Exporter vers ZIP"</strong> pour télécharger l'archive complète.</li>
                <li>Ou sélectionnez <strong>"Exporter vers GitHub"</strong> pour pousser le projet sur votre dépôt personnel.</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 space-y-2">
            <label className="block text-xs font-medium text-slate-300">Restaurer à partir d'une sauvegarde JSON :</label>
            <textarea
              rows={2}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder="Collez ici le contenu de votre fichier de sauvegarde JSON..."
              className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500 font-mono"
            />
            <button
              onClick={handleImportBackup}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold"
            >
              Restaurer les données
            </button>
            {importStatus && <p className="text-xs font-medium text-amber-400">{importStatus}</p>}
          </div>
        </div>

        {/* Reset Data Danger Zone */}
        <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 space-y-4">
          <h3 className="font-bold text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Zone de Danger
          </h3>

          <p className="text-xs text-slate-400">
            Réinitialise l'ensemble de votre progression, vos flashcards, notes et carnet d'erreurs aux données de démonstration initiales.
          </p>

          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Réinitialiser toutes les données</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 space-y-3">
              <p className="text-xs font-bold text-red-300">Êtes-vous absolument sûr ? Cette action est irrémédiable.</p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    resetData();
                    setShowResetConfirm(false);
                    alert('Données réinitialisées avec succès.');
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Oui, tout effacer
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
