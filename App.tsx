
import React, { useState } from 'react';
import { AppView } from './types';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import CareerExplorer from './components/CareerExplorer';
import ResumeReviewer from './components/ResumeReviewer';
import InterviewPrep from './components/InterviewPrep';
import MockInterview from './components/MockInterview';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.WELCOME);

  const renderCurrentView = () => {
    switch (currentView) {
      case AppView.WELCOME:
        return <WelcomeScreen setView={setCurrentView} />;
      case AppView.CAREER_EXPLORER:
        return <CareerExplorer />;
      case AppView.RESUME_REVIEWER:
        return <ResumeReviewer />;
      case AppView.INTERVIEW_PREP:
        return <InterviewPrep />;
      case AppView.MOCK_INTERVIEW:
        return <MockInterview />;
      default:
        return <WelcomeScreen setView={setCurrentView} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-text">
      <Header currentView={currentView} setView={setCurrentView} />
      <main className="flex-grow">
        {renderCurrentView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
