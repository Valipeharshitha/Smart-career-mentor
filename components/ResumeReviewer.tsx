
import React, { useState } from 'react';
import { reviewResume } from '../services/geminiService';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';

const ResumeReviewer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText || !jobTitle) {
      setError('Please provide your resume text and a target job title.');
      return;
    }
    setLoading(true);
    setError(null);
    setFeedback('');
    try {
      const result = await reviewResume(resumeText, jobTitle);
      setFeedback(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary-dark">AI Resume Reviewer</h1>
        <p className="mt-2 text-center text-gray-600">
          Get instant, actionable feedback to improve your resume.
        </p>

        <Card className="mt-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Target Job Title</label>
                <input
                    type="text"
                    id="jobTitle"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="e.g., Senior Software Engineer"
                />
            </div>
            <div>
              <label htmlFor="resumeText" className="block text-sm font-medium text-gray-700">Paste Your Resume</label>
              <textarea
                id="resumeText"
                rows={15}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary font-mono"
                placeholder="Paste the full text of your resume here..."
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
              >
                {loading ? 'Analyzing...' : 'Review My Resume'}
              </button>
            </div>
          </form>
        </Card>
        
        {loading && <LoadingSpinner message="Analyzing your resume..."/>}
        
        {feedback && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center text-primary-dark">Your Feedback</h2>
            <Card className="mt-6">
              <div className="prose prose-blue max-w-none" dangerouslySetInnerHTML={{ __html: feedback.replace(/\n/g, '<br />') }} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeReviewer;
