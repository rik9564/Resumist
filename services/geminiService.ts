import { GoogleGenAI, Type } from "@google/genai";
import type { ResumeData } from '../types';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

const resumeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: "Candidate's full name." },
        email: { type: Type.STRING, description: "Candidate's email address." },
        phone: { type: Type.STRING, description: "Candidate's phone number." },
        summary: { type: Type.STRING, description: "Professional summary or objective." },
        workExperience: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                 required: ["company", "role", "startDate", "endDate", "responsibilities"]
            }
        },
        education: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                },
                 required: ["institution", "degree", "startDate", "endDate"]
            }
        },
        skills: {
            type: Type.ARRAY,
            items: {
                type: Type.STRING
            }
        },
    },
    required: ["name", "email", "phone", "summary", "workExperience", "education", "skills"]
};

export const extractResumeDetails = async (
    resumeFile: File,
    onProgress: (message: string) => void
): Promise<ResumeData> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
  }
  
  onProgress("Reading and encoding file...");
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const base64Data = await fileToBase64(resumeFile);

  const prompt = `Analyze the provided resume document and extract the key information. Structure the output as a JSON object that strictly adheres to the provided schema. Information to extract includes: the candidate's full name, email address, phone number, a professional summary or objective, a list of work experiences (each with company name, job title, start and end dates, and a list of key responsibilities), a list of educational qualifications (each with the institution name, degree or qualification, and start and end dates), and a list of skills. If a piece of information is not found, use an empty string or an empty array.`;

  onProgress("Communicating with Gemini AI...");
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: {
        parts: [
            { text: prompt },
            {
                inlineData: {
                    mimeType: resumeFile.type,
                    data: base64Data,
                },
            },
        ],
    },
    config: {
        responseMimeType: 'application/json',
        responseSchema: resumeSchema,
    }
  });

  onProgress("Parsing AI response...");
  const text = response.text.trim();
  try {
    const parsedData = JSON.parse(text) as ResumeData;
    onProgress("Finalizing data structure...");
    return parsedData;
  } catch (e) {
    console.error("Failed to parse Gemini response:", text);
    throw new Error("The AI returned an invalid format. Please try again.");
  }
};