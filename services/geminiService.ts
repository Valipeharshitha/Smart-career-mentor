import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { CareerPath, InterviewQuestion } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;


if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function getCareerPaths(skills: string, interests: string, goals: string): Promise<CareerPath[]> {
  const prompt = `Based on the following user profile, suggest 3 diverse and relevant career paths.
  
  Skills: ${skills}
  Interests: ${interests}
  Career Goals: ${goals}
  
  For each path, provide a title, a brief description, a list of key required skills, and the typical salary potential.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            pathTitle: {
              type: Type.STRING,
              description: "The title of the career path.",
            },
            description: {
              type: Type.STRING,
              description: "A brief description of the career path.",
            },
            requiredSkills: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of key skills required for this career.",
            },
            salaryPotential: {
              type: Type.STRING,
              description: "The typical salary range or potential for this career.",
            },
          },
          // Fix: Removed 'required' and added 'propertyOrdering' to align with documentation.
          propertyOrdering: ["pathTitle", "description", "requiredSkills", "salaryPotential"],
        },
      },
    },
  });

  // Fix: Trim whitespace from the response before parsing JSON.
  const jsonString = response.text.trim();
  try {
    return JSON.parse(jsonString) as CareerPath[];
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonString, e);
    throw new Error("The AI returned an unexpected response. Please try again.");
  }
}

export async function reviewResume(resumeText: string, jobTitle: string): Promise<string> {
  const prompt = `Act as an expert career coach. Review the following resume for a "${jobTitle}" position. Provide constructive feedback with clear sections for "Strengths", "Areas for Improvement", and "Actionable Suggestions". Focus on quantifying achievements, using strong action verbs, and tailoring the resume to the job title. The feedback should be encouraging and professional.
  
  Resume:
  ---
  ${resumeText}
  ---`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

export async function getInterviewQuestions(jobTitle: string): Promise<InterviewQuestion[]> {
  const prompt = `Generate 5 common interview questions for a "${jobTitle}" role. Include a mix of behavioral and technical questions if applicable. For each question, provide a brief tip on what the interviewer is looking for in a good answer.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: {
              type: Type.STRING,
              description: "The interview question.",
            },
            tip: {
              type: Type.STRING,
              description: "A tip for answering the question effectively.",
            },
          },
          // Fix: Removed 'required' and added 'propertyOrdering' to align with documentation.
          propertyOrdering: ["question", "tip"],
        },
      },
    },
  });
  
  // Fix: Trim whitespace from the response before parsing JSON.
  const jsonString = response.text.trim();
  try {
    return JSON.parse(jsonString) as InterviewQuestion[];
  } catch (e) {
    console.error("Failed to parse JSON response:", jsonString, e);
    throw new Error("The AI returned an unexpected response. Please try again.");
  }
}

export function createMockInterviewChat(jobTitle: string): Chat {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: `You are a friendly but professional interviewer for a "${jobTitle}" role. Your goal is to conduct a mock interview. Start by greeting the candidate and then ask one question at a time. Keep your questions relevant to the role. After the user says they want to end the interview, provide comprehensive feedback.`,
        }
    });
    return chat;
}