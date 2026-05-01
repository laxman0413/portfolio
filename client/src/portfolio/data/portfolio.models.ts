export interface PortfolioData {
  personal: PersonalDetails;
  summary: string;
  detailedSummary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  skills: Skills[];
  achievements: AchievementEntry[];
  meta: PortfolioMeta;
}

export interface PersonalDetails {
  name: string;
  email: string;
  phone: string;
  location: LocationDetails;
  github: string;
  linkedin: string;
  role: string;
}

export interface LocationDetails {
  city: string;
  state: string;
  country: string;
}

export interface EducationEntry {
  institution: string;
  degree: string;
  field: string;
  gpa: string;
  distinction: string;
  location: string;
  start: string;
  end: string;
}

export interface ExperienceEntry {
  title: string;
  company: string;
  type: string;
  logo?: string;
  location: string;
  start: string;
  end: string;
  description?: string;
  responsibilities?: string[];
  tech_stack?: string[];
  impact?: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  tech_stack?: string[];
  highlights?: string[];
  type?: string;
  github?: string | null;
  image?: string;
}
export interface Skills {
  name: string;
  icon: string;
  isDark?: boolean;
}

export interface AchievementEntry {
  title: string;
  description: string;
  year: number;
}

export interface PortfolioMeta {
  current_role: string;
  current_company: string;
  total_experience_years: number;
  domain_focus: string[];
  open_to: string[];
  target_roles: string[];
  target_companies: string[];
  profile_generated: string;
}

export interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}