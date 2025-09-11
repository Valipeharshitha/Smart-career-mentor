
export enum AppView {
  WELCOME,
  CAREER_EXPLORER,
  RESUME_REVIEWER,
  INTERVIEW_PREP,
  MOCK_INTERVIEW,
}

export interface CareerPath {
  pathTitle: string;
  description: string;
  requiredSkills: string[];
  salaryPotential: string;
}

export interface InterviewQuestion {
  question: string;
  tip: string;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    text: string;
}
