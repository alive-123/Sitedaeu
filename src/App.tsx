import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MainLayout } from './components/layout/MainLayout';
import { DashboardView } from './components/dashboard/DashboardView';
import { ScheduleView } from './components/schedule/ScheduleView';
import { SubjectDetailView } from './components/subjects/SubjectDetailView';
import { ExercisesView } from './components/exercises/ExercisesView';
import { FlashcardsView } from './components/flashcards/FlashcardsView';
import { ErrorLogView } from './components/errors/ErrorLogView';
import { ExamsView } from './components/exams/ExamsView';
import { FocusView } from './components/focus/FocusView';
import { StatsView } from './components/stats/StatsView';
import { NotesView } from './components/notes/NotesView';
import { SettingsView } from './components/settings/SettingsView';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'schedule':
        return <ScheduleView />;
      case 'maths':
        return <SubjectDetailView subjectId="maths" />;
      case 'francais':
        return <SubjectDetailView subjectId="francais" />;
      case 'physique':
        return <SubjectDetailView subjectId="physique" />;
      case 'biologie':
        return <SubjectDetailView subjectId="biologie" />;
      case 'exercises':
        return <ExercisesView />;
      case 'flashcards':
        return <FlashcardsView />;
      case 'errors':
        return <ErrorLogView />;
      case 'exams':
        return <ExamsView />;
      case 'focus':
        return <FocusView />;
      case 'stats':
        return <StatsView />;
      case 'notes':
        return <NotesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return <MainLayout>{renderActiveView()}</MainLayout>;
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
