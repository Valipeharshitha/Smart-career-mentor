
import React, { useState, useRef, useEffect } from 'react';
import type { Chat } from '@google/genai';
import { createMockInterviewChat } from '../services/geminiService';
import type { ChatMessage } from '../types';
import Card from './common/Card';
import LoadingSpinner from './common/LoadingSpinner';

const MessageBox: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
        <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-sm md:max-w-md lg:max-w-lg p-3 rounded-2xl ${isUser ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                <p className="text-sm leading-relaxed">{message.text}</p>
            </div>
        </div>
    );
};

const MockInterview: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const startInterview = async () => {
    if (!jobTitle.trim()) {
      setError('Please enter a job title to start.');
      return;
    }
    setError(null);
    setLoading(true);
    setMessages([]);
    try {
      const chat = createMockInterviewChat(jobTitle);
      setChatSession(chat);
      const initialResponse = await chat.sendMessage({ message: "Let's start the interview." });
      setMessages([{ sender: 'ai', text: initialResponse.text }]);
      setInterviewStarted(true);
    } catch (err) {
      setError('Failed to start the interview. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !chatSession || loading) return;

    const userMessage: ChatMessage = { sender: 'user', text: userInput };
    setMessages(prev => [...prev, userMessage]);
    setUserInput('');
    setLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userInput });
      setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
    } catch (err) {
      setError('There was an issue communicating with the mentor. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const endInterview = async () => {
    if (!chatSession) return;
    setLoading(true);
    setError(null);
    const feedbackPrompt = "The interview is now over. Please provide overall feedback on my performance, highlighting strengths and areas for improvement.";
    const userMessage: ChatMessage = { sender: 'user', text: feedbackPrompt };
    setMessages(prev => [...prev, userMessage]);
    
    try {
        const response = await chatSession.sendMessage({ message: feedbackPrompt });
        setMessages(prev => [...prev, { sender: 'ai', text: response.text }]);
        setInterviewStarted(false); // End session, show feedback
        setChatSession(null);
    } catch(err) {
        setError("Could not get feedback. Please try ending again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary-dark">Mock Interview</h1>
        <p className="mt-2 text-center text-gray-600">Practice your interview skills in a real-time simulation.</p>

        {!interviewStarted && messages.length === 0 && (
          <Card className="mt-8">
            <div className="space-y-4">
              <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">Job Title to Interview For:</label>
              <input
                type="text"
                id="jobTitle"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="e.g., Data Analyst"
                disabled={loading}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                onClick={startInterview}
                disabled={loading}
                className="w-full justify-center py-3 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400"
              >
                {loading ? 'Initializing...' : 'Start Interview'}
              </button>
            </div>
          </Card>
        )}

        {(interviewStarted || messages.length > 0) && (
            <Card className="mt-8">
                <div ref={chatContainerRef} className="h-96 overflow-y-auto pr-4 space-y-4">
                    {messages.map((msg, i) => <MessageBox key={i} message={msg} />)}
                    {loading && <div className="flex justify-start"><div className="p-3 bg-gray-200 rounded-2xl rounded-bl-none"><LoadingSpinner message="Thinking..."/></div></div>}
                </div>
                 {interviewStarted && (
                <div className="mt-6 pt-4 border-t">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-light"
                            placeholder="Type your answer..."
                            disabled={loading}
                        />
                        <button type="submit" className="px-5 py-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:bg-gray-400 font-semibold" disabled={loading}>
                            Send
                        </button>
                    </form>
                     <button onClick={endInterview} className="w-full mt-4 py-2 px-4 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-md disabled:opacity-50" disabled={loading}>
                        End Interview & Get Feedback
                    </button>
                </div>
                 )}
                 {!interviewStarted && messages.length > 0 && (
                     <p className="mt-4 text-center font-semibold text-green-700 bg-green-100 p-3 rounded-md">Interview finished. Review your feedback above.</p>
                 )}
            </Card>
        )}
      </div>
    </div>
  );
};

export default MockInterview;
