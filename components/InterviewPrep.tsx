
import React, { useState } from 'react';
import type { InterviewQuestion } from '../types';
import { getInterviewQuestions } from '../services/geminiService';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';

const InterviewPrep: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle) {
      setError('Please enter a job title.');
      return;
    }
    setLoading(true);
    setError(null);
    setQuestions([]);
    try {
      const results = await getInterviewQuestions(jobTitle);
      setQuestions(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary-dark">Interview Prep</h1>
        <p className="mt-2 text-center text-gray-600">
          Generate common interview questions for your target role and get ready to shine.
        </p>

        <Card className="mt-8">
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow">
              <label htmlFor="jobTitle" className="sr-only">Job Title</label>
              <input
                type="text"
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., Product Manager"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex-shrink-0 justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
            >
              {loading ? 'Generating...' : 'Get Questions'}
            </button>
          </form>
           {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </Card>

        {loading && <LoadingSpinner message="Generating questions..." />}
        
        {questions.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center text-primary-dark">
              Practice Questions for '{jobTitle}'
            </h2>
            <div className="mt-6 space-y-4">
              {questions.map((q, index) => (
                <Card key={index}>
                  <p className="font-semibold text-lg text-primary-dark">{index + 1}. {q.question}</p>
                  <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-md">
                      <p className="text-sm font-semibold text-blue-800">💡 Interviewer Tip:</p>
                      <p className="text-sm text-blue-700 mt-1">{q.tip}</p>
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

export default InterviewPrep;
