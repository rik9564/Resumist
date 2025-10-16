
export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  responsibilities: string[];
}

export interface Education {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
}

export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  summary: string;
  workExperience: WorkExperience[];
  education: Education[];
  skills: string[];
}
