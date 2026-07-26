import { ErrorCode, ErrorCodeInfo } from '../types';

export const ERROR_CODES: Record<ErrorCode, ErrorCodeInfo> = {
  K: {
    code: 'K',
    label: 'Connaissance manquante',
    description: 'Une règle, formule ou définition du cours n’était pas connue ou retenue.',
    color: '#EF4444', // Red
    badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
  M: {
    code: 'M',
    label: 'Mauvaise méthode',
    description: 'La démarche utilisée n’est pas adaptée au problème posé.',
    color: '#F97316', // Orange
    badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  },
  C: {
    code: 'C',
    label: 'Erreur de calcul',
    description: 'Faute d’inattention ou d’opération numérique (addition, multiplication...).',
    color: '#F59E0B', // Amber
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  S: {
    code: 'S',
    label: 'Erreur de signe',
    description: 'Omission ou mauvaise application de la règle des signes (+ et -).',
    color: '#EAB308', // Yellow
    badgeBg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  },
  U: {
    code: 'U',
    label: 'Erreur d’unité',
    description: 'Omission de l’unité finale ou mauvaise conversion d’unités.',
    color: '#10B981', // Emerald
    badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  L: {
    code: 'L',
    label: 'Erreur de lecture',
    description: 'Mauvaise lecture ou interprétation de l’énoncé, d’une figure ou d’un tableau.',
    color: '#06B6D4', // Cyan
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  },
  V: {
    code: 'V',
    label: 'Vocabulaire mal compris',
    description: 'Incompréhension d’un terme technique ou scientifique précis.',
    color: '#6366F1', // Indigo
    badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  },
  R: {
    code: 'R',
    label: 'Rédaction / Raisonnement',
    description: 'Explication insuffisante, manque de rigueur ou démonstration incomplète.',
    color: '#8B5CF6', // Purple
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  A: {
    code: 'A',
    label: 'Manque d’attention',
    description: 'Omission d’une question, distraction rapide ou faute de frappe.',
    color: '#EC4899', // Pink
    badgeBg: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  },
};
