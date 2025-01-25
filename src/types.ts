export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  website: string;
  linkedin: string;
  summary: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: {
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    graduationDate: string;
    description: string;
  }[];
  skills: string[];
}