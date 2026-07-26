import React from 'react';
import { useApp } from '../../context/AppContext';
import { getSubjectMastery, getErrorCodeDistribution } from '../../utils/formatters';
import { ERROR_CODES } from '../../data/errorCodes';
import {
  BarChart2,
  TrendingUp,
  PieChart,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export const StatsView: React.FC = () => {
  const { subjects, studySessions, errorLogs, examAttempts, profile, setActiveTab } = useApp();

  const handlePrintFullReport = () => {
    const reportWindow = window.open('', '_blank');
    if (!reportWindow) {
      alert("Veuillez autoriser les fenêtres surgissantes pour ouvrir le rapport.");
      return;
    }

    reportWindow.document.write(`
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Bilan de Progression DAEU B - ${profile.name}</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #1e293b; background: #f8fafc; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center; }
          h1 { color: #1e3a8a; margin: 0 0 5px 0; font-size: 24px; }
          .subtitle { color: #64748b; font-size: 14px; }
          .card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
          h2 { color: #2563eb; font-size: 16px; margin-top: 0; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px; }
          ul { margin: 0; padding-left: 20px; }
          li { margin-bottom: 6px; font-size: 13px; }
          .btn-print { background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: bold; cursor: pointer; float: right; }
          @media print { .btn-print { display: none; } body { padding: 0; background: white; } }
        </style>
      </head>
      <body>
        <button class="btn-print" onclick="window.print()">🖨️ Imprimer / Sauvegarder en PDF</button>
        <div class="header">
          <div>
            <h1>CAP DAEU B — Rapport Global de Progression</h1>
            <div class="subtitle">Candidat: <strong>${profile.name}</strong> • Bilan de Révision</div>
          </div>
          <span>${new Date().toLocaleDateString('fr-FR')}</span>
        </div>

        <div class="card">
          <h2>📊 Maîtrise par Matière</h2>
          <ul>
            ${subjects.map(s => `<li><strong>${s.name} :</strong> ${getSubjectMastery(s)}% de maîtrise</li>`).join('')}
          </ul>
        </div>

        <div class="card">
          <h2>📝 Historique des Examens Blancs</h2>
          <ul>
            ${examAttempts.length === 0 ? '<li>Aucun examen effectué.</li>' : examAttempts.map(att => `
              <li><strong>${att.examTitle} (${att.date}) :</strong> Note ${att.score} / 20 (${att.correctCount}/${att.totalQuestions} réussies)</li>
            `).join('')}
          </ul>
        </div>
      </body>
      </html>
    `);
    reportWindow.document.close();
  };

  // Subject mastery data for bar chart
  const subjectChartData = subjects.map(s => ({
    name: s.name,
    maitrise: getSubjectMastery(s),
    fill: s.color
  }));

  // Error code distribution for pie chart
  const errorDist = getErrorCodeDistribution(errorLogs);
  const pieChartData = Object.entries(errorDist)
    .filter(([_, count]) => count > 0)
    .map(([code, count]) => ({
      name: `[${code}] ${ERROR_CODES[code as keyof typeof ERROR_CODES]?.label || code}`,
      value: count,
      color: ERROR_CODES[code as keyof typeof ERROR_CODES]?.color || '#3B82F6'
    }));

  // Exam scores line chart
  const examLineData = examAttempts.map(att => ({
    date: att.date,
    score: att.score,
    title: att.examTitle
  }));

  // Work time per day (from studySessions)
  const sessionDaysMap: Record<string, number> = {};
  studySessions.forEach(s => {
    sessionDaysMap[s.date] = (sessionDaysMap[s.date] || 0) + s.durationMinutes;
  });

  const timeChartData = Object.entries(sessionDaysMap).map(([date, minutes]) => ({
    date,
    minutes
  }));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-400" />
            Statistiques & Analyse de Progression
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Des métriques claires pour piloter vos révisions. Visualisez la répartition de vos erreurs, vos heures de travail effectives et vos résultats d'examen.
          </p>
        </div>

        <button
          onClick={handlePrintFullReport}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/20 shrink-0"
        >
          <span>🖨️ Télécharger le Bilan PDF</span>
        </button>
      </div>

      {/* Grid of Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Subject Mastery Level */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Niveau de maîtrise par matière (%)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="maitrise" radius={[8, 8, 0, 0]}>
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Distribution of Error Codes */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Répartition des Types d'Erreurs
            </h3>
          </div>

          {pieChartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-xs text-slate-500">
              Aucune donnée d'erreur disponible.
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, value }) => `${name} (${value})`}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Chart 3: Exam Scores Trend */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              Évolution des notes d'examen (/20)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={examLineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                <YAxis domain={[0, 20]} stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="score" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5, fill: '#3B82F6' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Daily Study Minutes */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Temps de travail quotidien (minutes)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={timeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} />
                <YAxis stroke="#94A3B8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="minutes" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
