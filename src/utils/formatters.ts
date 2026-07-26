import { Subject, StudySessionLog, ErrorLogItem, ErrorCode } from '../types';

export const calculateDaysRemaining = (targetDateStr: string): number => {
  const target = new Date(targetDateStr).getTime();
  const today = new Date().getTime();
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const formatMinutesToHours = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
};

export const calculateTodayStudyMinutes = (sessions: StudySessionLog[]): number => {
  const today = new Date().toISOString().split('T')[0];
  return sessions
    .filter(s => s.date === today)
    .reduce((acc, s) => acc + s.durationMinutes, 0);
};

export const calculateWeeklyStudyMinutes = (sessions: StudySessionLog[]): number => {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return sessions
    .filter(s => new Date(s.date) >= sevenDaysAgo)
    .reduce((acc, s) => acc + s.durationMinutes, 0);
};

export const calculateOverallProgress = (subjects: Subject[]): number => {
  let totalMastery = 0;
  let conceptCount = 0;

  subjects.forEach(sub => {
    sub.chapters.forEach(chap => {
      chap.concepts.forEach(conc => {
        totalMastery += conc.mastery;
        conceptCount++;
      });
    });
  });

  if (conceptCount === 0) return 0;
  return Math.round(totalMastery / conceptCount);
};

export const getSubjectMastery = (subject: Subject): number => {
  let total = 0;
  let count = 0;
  subject.chapters.forEach(chap => {
    chap.concepts.forEach(conc => {
      total += conc.mastery;
      count++;
    });
  });
  return count > 0 ? Math.round(total / count) : 0;
};

export const getSubjectErrorStats = (errors: ErrorLogItem[]) => {
  const stats: Record<string, number> = {
    maths: 0,
    physique: 0,
    biologie: 0,
    francais: 0
  };
  errors.forEach(err => {
    if (stats[err.subjectId] !== undefined) {
      stats[err.subjectId]++;
    }
  });
  return stats;
};

export const getErrorCodeDistribution = (errors: ErrorLogItem[]) => {
  const dist: Record<ErrorCode, number> = {
    K: 0, M: 0, C: 0, S: 0, U: 0, L: 0, V: 0, R: 0, A: 0
  };
  errors.forEach(err => {
    if (dist[err.errorCode] !== undefined) {
      dist[err.errorCode]++;
    }
  });
  return dist;
};
