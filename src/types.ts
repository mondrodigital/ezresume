export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  summary: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  graduationDate: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: string[];
}

export interface ValidationErrors {
  [key: string]: string;
}