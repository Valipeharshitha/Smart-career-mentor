
import React from 'react';
import { AppView } from '../types';

interface HeaderProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const NavLink: React.FC<{
  view: AppView;
  currentView: AppView;
  setView: (view: AppView) => void;
  children: React.ReactNode;
}> = ({ view, currentView, setView, children }) => {
  const isActive = view === currentView;
  return (
    <button
      onClick={() => setView(view)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
        isActive
          ? 'bg-primary text-white shadow-sm'
          : 'text-gray-600 hover:bg-secondary hover:text-primary-dark'
      }`}
    >
      {children}
    </button>
  );
};

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView(AppView.WELCOME)}>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v2h-2zm0 4h2v6h-2z"/>
            </svg>
            <span className="text-xl font-bold text-primary-dark">Career Mentor AI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
            <NavLink view={AppView.CAREER_EXPLORER} currentView={currentView} setView={setView}>Career Explorer</NavLink>
            <NavLink view={AppView.RESUME_REVIEWER} currentView={currentView} setView={setView}>Resume Review</NavLink>
            <NavLink view={AppView.INTERVIEW_PREP} currentView={currentView} setView={setView}>Interview Prep</NavLink>
            <NavLink view={AppView.MOCK_INTERVIEW} currentView={currentView} setView={setView}>Mock Interview</NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
