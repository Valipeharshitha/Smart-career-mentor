import React from 'react';
import { AppView } from '../types';
import Card from './common/Card';

interface WelcomeScreenProps {
  setView: (view: AppView) => void;
}

const FeatureCard: React.FC<{
  title: string;
  description: string;
  // Fix: Use React.ReactNode which is a more robust type for JSX elements.
  icon: React.ReactNode;
  onClick: () => void;
}> = ({ title, description, icon, onClick }) => (
  <Card className="text-center cursor-pointer group" >
    <div onClick={onClick}>
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-secondary group-hover:bg-primary-light transition-colors duration-300">
            {icon}
        </div>
        <h3 className="mt-4 text-xl font-semibold text-primary-dark">{title}</h3>
        <p className="mt-2 text-gray-600">{description}</p>
        <span className="mt-4 inline-block text-primary font-semibold group-hover:underline">Get Started &rarr;</span>
    </div>
  </Card>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ setView }) => {
  const features = [
    {
      title: 'Career Explorer',
      description: 'Discover career paths tailored to your skills and interests.',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
      view: AppView.CAREER_EXPLORER,
    },
    {
      title: 'Resume Reviewer',
      description: 'Get instant, expert feedback to make your resume stand out.',
      view: AppView.RESUME_REVIEWER,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    },
    {
      title: 'Interview Prep',
      description: 'Practice with common questions for your target role.',
      view: AppView.INTERVIEW_PREP,
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
    },
    {
        title: 'Mock Interview',
        description: 'Engage in a live, AI-driven mock interview session.',
        view: AppView.MOCK_INTERVIEW,
        icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-primary-dark">Welcome to Your Personal Career Mentor</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
          Unlock your potential. We provide AI-powered tools to help you navigate your career path with confidence.
        </p>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} onClick={() => setView(feature.view)} />
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;