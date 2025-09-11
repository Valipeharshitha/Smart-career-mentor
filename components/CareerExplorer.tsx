
import React, { useState } from 'react';
import type { CareerPath } from '../types';
import { getCareerPaths } from '../services/geminiService';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';

const CareerExplorer: React.FC = () => {
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [goals, setGoals] = useState('');
  const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skills || !interests) {
      setError('Please fill out at least Skills and Interests.');
      return;
    }
    setLoading(true);
    setError(null);
    setCareerPaths([]);

    try {
      const paths = await getCareerPaths(skills, interests, goals);
      setCareerPaths(paths);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary-dark">Career Explorer</h1>
        <p className="mt-2 text-center text-gray-600">
          Tell us about yourself, and we'll suggest some fitting career paths.
        </p>

        <Card className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Your Skills (e.g., Python, Graphic Design, Communication)</label>
              <input
                type="text"
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="List your key skills"
              />
            </div>
            <div>
              <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Your Interests (e.g., Technology, Healthcare, Art)</label>
              <input
                type="text"
                id="interests"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="What are you passionate about?"
              />
            </div>
            <div>
              <label htmlFor="goals" className="block text-sm font-medium text-gray-700">Your Career Goals (Optional)</label>
              <input
                type="text"
                id="goals"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., leadership, remote work, work-life balance"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
              >
                {loading ? 'Discovering...' : 'Find My Career Path'}
              </button>
            </div>
          </form>
        </Card>
        
        {loading && <LoadingSpinner />}
        
        {careerPaths.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center text-primary-dark">Suggested Career Paths</h2>
            <div className="mt-6 space-y-6">
              {careerPaths.map((path, index) => (
                <Card key={index}>
                  <h3 className="text-xl font-semibold text-primary">{path.pathTitle}</h3>
                  <p className="mt-2 text-gray-600">{path.description}</p>
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-800">Key Skills:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {path.requiredSkills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 text-sm font-medium text-primary-dark bg-secondary rounded-full">{skill}</span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4">
                     <h4 className="font-semibold text-gray-800">Salary Potential:</h4>
                     <p className="text-gray-600">{path.salaryPotential}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerExplorer;
