export type UserRole = "candidate" | "employer" | "admin";

export interface UserSession {
  id: string;
  email: string;
  role: UserRole;
  candidateId?: string;
  employerId?: string;
  emailVerified?: boolean;
  verificationToken?: string;
}

export type CandidateRoleType = "student" | "fresher" | "experienced";

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
  grade?: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface PortfolioLink {
  platform: string;
  url: string;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  email: string;
  fullName: string;
  photo: string;
  headline: string;
  location: string;
  about: string;
  roleType: CandidateRoleType;
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: string[];
  portfolioLinks: PortfolioLink[];
  skills: string[];
  resumeUrl?: string;
  resumeName?: string;
  phone?: string;
  profileCompletion: number; // 0 - 100
  emailVerified?: boolean;
  verificationToken?: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;
  companyName: string;
   email: string;
  logo: string;
  website: string;
  industry: string;
  location: string;
  companySize: string;
  about: string;
  isVerified: boolean;
  verificationRejected?: boolean;
  emailVerified?: boolean;
  verificationToken?: string;
}

export type WorkMode = "remote" | "on-site" | "hybrid";
export type JobType = "full-time" | "part-time" | "internship" | "contract";
export type JobStatus = "draft" | "published" | "paused" | "closed";

export interface JobPost {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  title: string;
  department: string;
  location: string;
  workMode: WorkMode;
  type: JobType;
  salaryRange: string; // e.g. "$120k - $160k" or "$6,500/mo"
  description: string;
  requirements: string[];
  responsibilities: string[];
  perks: string[];
  eligibility?: string;
  skills: string[];
  deadline: string;
  openings: number;
  status: JobStatus;
  postedDate: string;
  views: number;
  applicationsCount: number;
  isFeatured: boolean;
  isFlagged?: boolean;
  flagReason?: string;
}

export type ApplicationStatus =
  | "applied"
  | "screening"
  | "shortlisted"
  | "interview_round_1"
  | "interview_round_2"
  | "offer"
  | "hired"
  | "rejected";

export interface ActivityLog {
  id: string;
  status: ApplicationStatus;
  changedBy: string;
  timestamp: string;
  notes?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhoto?: string;
  candidateHeadline?: string;
  resumeName: string;
  coverLetter?: string;
  answers?: { question: string; answer: string }[];
  portfolioLinks?: PortfolioLink[];
  status: ApplicationStatus;
  appliedDate: string;
  activityLog: ActivityLog[];
}

export type InterviewMode = "zoom" | "google_meet" | "phone" | "in-person";

export interface InterviewSchedule {
  id: string;
  applicationId: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  candidateId: string;
  title: string;
  date: string;
  time: string;
  mode: InterviewMode;
  meetingLink?: string;
  notes?: string;
  interviewerName: string;
}

export interface Message {
  id: string;
  chatId: string; // combination of candidateId-companyId-jobId
  senderId: string;
  senderName: string;
  senderRole: "candidate" | "employer";
  content: string;
  timestamp: string;
}

export interface ChatThread {
  chatId: string;
  jobId: string;
  jobTitle: string;
  candidateId: string;
  candidateName: string;
  companyId: string;
  companyName: string;
  lastMessageText: string;
  lastMessageTime: string;
}

export type NotificationType =
  | "application_update"
  | "interview_invite"
  | "saved_job_reminder"
  | "profile_nudge"
  | "new_applicant"
  | "announcement";

export interface PortalNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: NotificationType;
}

export interface PlatformStats {
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  totalApplications: number;
  totalHires: number;
  activeAnnouncements: number;
}

export interface SupportTicket {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: "open" | "resolved";
  timestamp: string;
}

export interface SimulatedEmail {
  id: string;
  to: string;
  subject: string;
  body: string;
  timestamp: string;
  token: string;
  role: UserRole;
}
