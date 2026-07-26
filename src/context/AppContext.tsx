import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  Subject,
  Exercise,
  ErrorLogItem,
  Flashcard,
  StudyTask,
  Note,
  ExamAttempt,
  StudySessionLog,
  SubjectId,
  ErrorCode
} from '../types';
import {
  INITIAL_PROFILE,
  SUBJECTS,
  INITIAL_EXERCISES,
  INITIAL_ERROR_LOGS,
  INITIAL_FLASHCARDS,
  INITIAL_SCHEDULE,
  INITIAL_NOTES,
  INITIAL_EXAM_ATTEMPTS
} from '../data/initialData';

interface AppContextType {
  profile: UserProfile;
  subjects: Subject[];
  exercises: Exercise[];
  errorLogs: ErrorLogItem[];
  flashcards: Flashcard[];
  schedule: StudyTask[];
  notes: Note[];
  examAttempts: ExamAttempt[];
  studySessions: StudySessionLog[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  toggleDarkMode: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addTask: (task: Omit<StudyTask, 'id'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  addErrorLog: (error: Omit<ErrorLogItem, 'id' | 'date' | 'repetitionCount' | 'resolved'>) => void;
  resolveErrorLog: (id: string) => void;
  deleteErrorLog: (id: string) => void;
  retryErrorLog: (id: string) => void;
  addFlashcard: (card: Omit<Flashcard, 'id' | 'box' | 'nextReviewDate'>) => void;
  reviewFlashcard: (id: string, result: 'easy' | 'medium' | 'hard' | 'again') => void;
  deleteFlashcard: (id: string) => void;
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  logStudySession: (session: Omit<StudySessionLog, 'id' | 'timestamp'>) => void;
  recordExamAttempt: (attempt: Omit<ExamAttempt, 'id' | 'date'>) => void;
  updateConceptMastery: (subjectId: SubjectId, conceptId: string, masteryValue: number) => void;
  resetData: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
}

const STORAGE_KEY = 'cap_daeu_b_elias_data_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_subjects`);
    return saved ? JSON.parse(saved) : SUBJECTS;
  });

  const [exercises] = useState<Exercise[]>(INITIAL_EXERCISES);

  const [errorLogs, setErrorLogs] = useState<ErrorLogItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_errorLogs`);
    return saved ? JSON.parse(saved) : INITIAL_ERROR_LOGS;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_flashcards`);
    return saved ? JSON.parse(saved) : INITIAL_FLASHCARDS;
  });

  const [schedule, setSchedule] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_schedule`);
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_notes`);
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [examAttempts, setExamAttempts] = useState<ExamAttempt[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_examAttempts`);
    return saved ? JSON.parse(saved) : INITIAL_EXAM_ATTEMPTS;
  });

  const [studySessions, setStudySessions] = useState<StudySessionLog[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_studySessions`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'sess_1',
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        durationMinutes: 120,
        subjectId: 'maths',
        type: 'pomodoro',
        objectivesCompleted: 2,
        totalObjectives: 2,
      },
      {
        id: 'sess_2',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        durationMinutes: 45,
        subjectId: 'physique',
        type: 'free',
        objectivesCompleted: 1,
        totalObjectives: 1,
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_errorLogs`, JSON.stringify(errorLogs));
  }, [errorLogs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_flashcards`, JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_schedule`, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_notes`, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_examAttempts`, JSON.stringify(examAttempts));
  }, [examAttempts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_studySessions`, JSON.stringify(studySessions));
  }, [studySessions]);

  // Dark mode HTML root handler
  useEffect(() => {
    if (profile.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.isDarkMode]);

  const toggleDarkMode = () => {
    setProfile(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...newProfile }));
  };

  // Schedule management
  const addTask = (task: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...task,
      id: `task_${Date.now()}`
    };
    setSchedule(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setSchedule(prev =>
      prev.map(task => (task.id === id ? { ...task, completed: !task.completed } : task))
    );
  };

  const deleteTask = (id: string) => {
    setSchedule(prev => prev.filter(task => task.id !== id));
  };

  // Error Log management
  const addErrorLog = (error: Omit<ErrorLogItem, 'id' | 'date' | 'repetitionCount' | 'resolved'>) => {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if error already exists for same question/concept
    const existingIndex = errorLogs.findIndex(
      e => e.subjectId === error.subjectId && e.question.trim().toLowerCase() === error.question.trim().toLowerCase()
    );

    if (existingIndex >= 0) {
      setErrorLogs(prev => {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          userAnswer: error.userAnswer,
          repetitionCount: updated[existingIndex].repetitionCount + 1,
          resolved: false,
          date: today
        };
        return updated;
      });
    } else {
      const newErrorItem: ErrorLogItem = {
        ...error,
        id: `err_${Date.now()}`,
        date: today,
        repetitionCount: 1,
        resolved: false
      };
      setErrorLogs(prev => [newErrorItem, ...prev]);

      // Automatically create a flashcard from error!
      const autoCard: Flashcard = {
        id: `fc_auto_${Date.now()}`,
        subjectId: error.subjectId,
        front: `[Erreur ${error.errorCode}] ${error.conceptTitle} : ${error.question}`,
        back: `Réponse correcte : ${error.correctAnswer}\n\nExplication / Méthode : ${error.explanation}`,
        box: 1,
        nextReviewDate: today,
        fromError: true
      };
      setFlashcards(prev => [autoCard, ...prev]);
    }
  };

  const resolveErrorLog = (id: string) => {
    setErrorLogs(prev =>
      prev.map(e => (e.id === id ? { ...e, resolved: !e.resolved } : e))
    );
  };

  const deleteErrorLog = (id: string) => {
    setErrorLogs(prev => prev.filter(e => e.id !== id));
  };

  const retryErrorLog = (id: string) => {
    // Navigate to exercises or retry
    setActiveTab('exercises');
  };

  // Flashcards management
  const addFlashcard = (card: Omit<Flashcard, 'id' | 'box' | 'nextReviewDate'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newCard: Flashcard = {
      ...card,
      id: `fc_${Date.now()}`,
      box: 1,
      nextReviewDate: today
    };
    setFlashcards(prev => [newCard, ...prev]);
  };

  const reviewFlashcard = (id: string, result: 'easy' | 'medium' | 'hard' | 'again') => {
    const today = new Date();
    
    setFlashcards(prev =>
      prev.map(card => {
        if (card.id !== id) return card;

        let newBox = card.box;
        let daysToAdd = 1;

        if (result === 'easy') {
          newBox = Math.min(5, card.box + 1);
          daysToAdd = newBox * 3;
        } else if (result === 'medium') {
          daysToAdd = Math.max(1, newBox * 2);
        } else if (result === 'hard') {
          newBox = Math.max(1, card.box - 1);
          daysToAdd = 1;
        } else {
          // 'again'
          newBox = 1;
          daysToAdd = 1;
        }

        const nextDate = new Date(today);
        nextDate.setDate(nextDate.getDate() + daysToAdd);

        const history = card.difficultyHistory || [];

        return {
          ...card,
          box: newBox,
          lastReviewed: today.toISOString().split('T')[0],
          nextReviewDate: nextDate.toISOString().split('T')[0],
          difficultyHistory: [...history, result]
        };
      })
    );
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(c => c.id !== id));
  };

  // Notes management
  const addNote = (note: Omit<Note, 'id' | 'updatedAt'>) => {
    const newNote: Note = {
      ...note,
      id: `note_${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (id: string, updatedFields: Partial<Note>) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id
          ? {
              ...n,
              ...updatedFields,
              updatedAt: new Date().toISOString().split('T')[0]
            }
          : n
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // Study session & timer logs
  const logStudySession = (session: Omit<StudySessionLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const newSession: StudySessionLog = {
      ...session,
      id: `sess_${Date.now()}`,
      timestamp: now.toISOString()
    };
    setStudySessions(prev => [newSession, ...prev]);
  };

  // Exam attempts
  const recordExamAttempt = (attempt: Omit<ExamAttempt, 'id' | 'date'>) => {
    const today = new Date().toISOString().split('T')[0];
    const newAttempt: ExamAttempt = {
      ...attempt,
      id: `att_${Date.now()}`,
      date: today
    };
    setExamAttempts(prev => [newAttempt, ...prev]);
  };

  // Mastery update for concepts
  const updateConceptMastery = (subjectId: SubjectId, conceptId: string, masteryValue: number) => {
    setSubjects(prev =>
      prev.map(s => {
        if (s.id !== subjectId) return s;
        const updatedChapters = s.chapters.map(ch => ({
          ...ch,
          concepts: ch.concepts.map(c =>
            c.id === conceptId ? { ...c, mastery: Math.min(100, Math.max(0, masteryValue)), worked: true } : c
          )
        }));
        return {
          ...s,
          chapters: updatedChapters
        };
      })
    );
  };

  // Reset to initial demo data
  const resetData = () => {
    setProfile(INITIAL_PROFILE);
    setSubjects(SUBJECTS);
    setErrorLogs(INITIAL_ERROR_LOGS);
    setFlashcards(INITIAL_FLASHCARDS);
    setSchedule(INITIAL_SCHEDULE);
    setNotes(INITIAL_NOTES);
    setExamAttempts(INITIAL_EXAM_ATTEMPTS);
    setStudySessions([]);
    localStorage.clear();
  };

  // JSON Export / Import
  const exportDataJSON = () => {
    const fullData = {
      profile,
      subjects,
      errorLogs,
      flashcards,
      schedule,
      notes,
      examAttempts,
      studySessions,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(fullData, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) setProfile(data.profile);
      if (data.subjects) setSubjects(data.subjects);
      if (data.errorLogs) setErrorLogs(data.errorLogs);
      if (data.flashcards) setFlashcards(data.flashcards);
      if (data.schedule) setSchedule(data.schedule);
      if (data.notes) setNotes(data.notes);
      if (data.examAttempts) setExamAttempts(data.examAttempts);
      if (data.studySessions) setStudySessions(data.studySessions);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        subjects,
        exercises,
        errorLogs,
        flashcards,
        schedule,
        notes,
        examAttempts,
        studySessions,
        activeTab,
        setActiveTab,
        toggleDarkMode,
        updateProfile,
        addTask,
        toggleTask,
        deleteTask,
        addErrorLog,
        resolveErrorLog,
        deleteErrorLog,
        retryErrorLog,
        addFlashcard,
        reviewFlashcard,
        deleteFlashcard,
        addNote,
        updateNote,
        deleteNote,
        logStudySession,
        recordExamAttempt,
        updateConceptMastery,
        resetData,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
