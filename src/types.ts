export type SubjectId = 'maths' | 'francais' | 'physique' | 'biologie';

export type ErrorCode = 'K' | 'M' | 'C' | 'S' | 'U' | 'L' | 'V' | 'R' | 'A';

export interface ErrorCodeInfo {
  code: ErrorCode;
  label: string;
  description: string;
  color: string;
  badgeBg: string;
}

export type ExerciseType = 'qcm' | 'numeric' | 'short' | 'step_by_step' | 'writing' | 'boolean' | 'matching';

export interface StepExercise {
  instruction: string;
  answer: string;
  explanation: string;
  hint?: string;
}

export interface MatchingPair {
  left: string;
  right: string;
}

export interface Exercise {
  id: string;
  subjectId: SubjectId;
  chapterId: string;
  conceptId: string;
  title: string;
  type: ExerciseType;
  question: string;
  options?: string[]; // for QCM
  correctAnswer: string | number | boolean;
  explanation: string;
  method: string;
  errorCode: ErrorCode;
  conceptToReview: string;
  steps?: StepExercise[]; // for step_by_step
  matchingPairs?: MatchingPair[]; // for matching
  sampleCorrection?: string; // for French writing practice
}

export interface Concept {
  id: string;
  title: string;
  mastery: number; // 0 to 100
  worked: boolean;
  summary: string;
  examples?: { problem: string; solution: string; method: string }[];
}

export interface Chapter {
  id: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  concepts: Concept[];
}

export interface Subject {
  id: SubjectId;
  name: string;
  iconName: string;
  color: string;
  bgGradient: string;
  description: string;
  chapters: Chapter[];
  workedConceptsCount?: number;
  totalConceptsCount?: number;
}

export interface ErrorLogItem {
  id: string;
  subjectId: SubjectId;
  conceptTitle: string;
  exerciseId?: string;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  errorCode: ErrorCode;
  date: string;
  repetitionCount: number;
  resolved: boolean;
  explanation: string;
}

export interface Flashcard {
  id: string;
  subjectId: SubjectId;
  front: string;
  back: string;
  box: number; // 1 to 5 (Leitner system)
  nextReviewDate: string; // YYYY-MM-DD
  lastReviewed?: string;
  difficultyHistory?: ('easy' | 'medium' | 'hard' | 'again')[];
  fromError?: boolean;
}

export type TaskType = 'normal' | 'short' | 'revision' | 'test' | 'exam' | 'recovery';

export interface StudyTask {
  id: string;
  date: string; // YYYY-MM-DD
  subjectId: SubjectId;
  title: string;
  durationMinutes: number;
  type: TaskType;
  completed: boolean;
  notes?: string;
}

export interface StudySessionLog {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string;
  durationMinutes: number;
  subjectId: SubjectId;
  type: 'pomodoro' | 'free';
  objectivesCompleted: number;
  totalObjectives: number;
}

export interface Note {
  id: string;
  subjectId: SubjectId;
  title: string;
  content: string;
  updatedAt: string;
  isImportant: boolean;
  tags?: string[];
}

export interface ExamQuestion {
  id: string;
  subjectId: SubjectId;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  errorCode: ErrorCode;
}

export interface Exam {
  id: string;
  title: string;
  subjectId?: SubjectId; // null or undefined for multidisciplinary
  type: 'mini' | 'chapter' | 'subject' | 'blank';
  durationMinutes: number;
  questions: ExamQuestion[];
  description: string;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  examTitle: string;
  type: 'mini' | 'chapter' | 'subject' | 'blank';
  score: number; // out of 20
  totalQuestions: number;
  correctCount: number;
  date: string;
  durationMinutes: number;
  errorsSummary: Record<ErrorCode, number>;
  userAnswers: Record<string, string>;
}

export interface UserProfile {
  name: string;
  age: number;
  location: string;
  targetExamDate: string; // YYYY-MM-DD e.g. 2026-10-15
  dailyGoalMinutesGoodDay: number;
  dailyGoalMinutesToughDay: number;
  isDarkMode: boolean;
}
