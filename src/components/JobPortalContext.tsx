import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  UserRole, UserSession, CandidateProfile, CompanyProfile, 
  JobPost, JobApplication, InterviewSchedule, Message, 
  PortalNotification, SupportTicket, ApplicationStatus, WorkMode, JobType, JobStatus, ActivityLog, ChatThread, InterviewMode,
  SimulatedEmail
} from "../types";
import { 
  INITIAL_COMPANIES, INITIAL_JOBS, MOCK_CANDIDATE_PROFILE, 
  INITIAL_CANDIDATE_EXPLORER, INITIAL_APPLICATIONS, 
  INITIAL_NOTIFICATIONS, INITIAL_TICKETS 
} from "../data";

interface JobPortalContextType {
  currentUser: UserSession | null;
  candidateProfile: CandidateProfile | null;
  employerProfile: CompanyProfile | null;
  jobs: JobPost[];
  companies: CompanyProfile[];
  applications: JobApplication[];
  candidates: CandidateProfile[];
  notifications: PortalNotification[];
  tickets: SupportTicket[];
  interviews: InterviewSchedule[];
  messages: Message[];
  bookmarkedJobs: string[];
  
  // Actions
  login: (email: string, password?: string, forceRole?: UserRole) => { success: boolean; error?: string };
  signup: (email: string, fullName: string, role: UserRole, roleType?: "student" | "fresher" | "experienced") => void;
  logout: () => void;
  updateCandidateProfile: (profile: Partial<CandidateProfile>) => void;
  updateEmployerProfile: (profile: Partial<CompanyProfile>) => void;
  createJob: (job: Omit<JobPost, "id" | "companyId" | "companyName" | "companyLogo" | "views" | "applicationsCount" | "postedDate">) => void;
  updateJob: (jobId: string, updated: Partial<JobPost>) => void;
  deleteJob: (jobId: string) => void;
  applyToJob: (jobId: string, data: { coverLetter?: string; resumeName: string; answers?: { question: string; answer: string }[] }) => void;
  updateApplicationStatus: (applicationId: string, nextStatus: ApplicationStatus, notes?: string) => void;
  scheduleInterview: (appointment: Omit<InterviewSchedule, "id" | "companyName" | "jobTitle">) => void;
  sendChatMessage: (chatId: string, senderId: string, senderName: string, role: "candidate" | "employer", content: string) => void;
  getChatMessages: (chatId: string) => Message[];
  getChatThreads: () => ChatThread[];
  toggleBookmark: (jobId: string) => void;
  createTicket: (ticket: Omit<SupportTicket, "id" | "status" | "timestamp">) => void;
  resolveTicket: (ticketId: string) => void;
  verifyCompany: (companyId: string, approve: boolean) => void;
  moderateJob: (jobId: string, flag: boolean, reason?: string) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  simulateResumeParse: (fileName: string) => Promise<{ parsed: boolean; skills: string[]; headline: string; experience: string }>;
  incrementJobViews: (jobId: string) => void;
  
  // Simulated Email Verification flow fields
  simulatedEmails: SimulatedEmail[];
  sendVerificationEmail: (email: string, fullName: string, role: UserRole, token: string) => void;
  verifyEmailToken: (token: string) => { success: boolean; message?: string; role?: UserRole };
  resendVerificationEmail: () => void;
  clearSimulatedEmails: () => void;
}

const JobPortalContext = createContext<JobPortalContextType | undefined>(undefined);

export const useJobPortal = () => {
  const context = useContext(JobPortalContext);
  if (!context) {
    throw new Error("useJobPortal must be used within a JobPortalProvider");
  }
  return context;
};

export const JobPortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to load initial values from localStorage or fallback to mock data
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem("cb_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [simulatedEmails, setSimulatedEmails] = useState<SimulatedEmail[]>(() => {
    const saved = localStorage.getItem("cb_simulated_emails");
    return saved ? JSON.parse(saved) : [];
  });

  const [companies, setCompanies] = useState<CompanyProfile[]>(() => {
    const saved = localStorage.getItem("cb_companies");
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [jobs, setJobs] = useState<JobPost[]>(() => {
    const saved = localStorage.getItem("cb_jobs");
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [candidates, setCandidates] = useState<CandidateProfile[]>(() => {
    const saved = localStorage.getItem("cb_candidates");
    return saved ? JSON.parse(saved) : INITIAL_CANDIDATE_EXPLORER;
  });

  const [applications, setApplications] = useState<JobApplication[]>(() => {
    const saved = localStorage.getItem("cb_applications");
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [notifications, setNotifications] = useState<PortalNotification[]>(() => {
    const saved = localStorage.getItem("cb_notifications");
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem("cb_tickets");
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [interviews, setInterviews] = useState<InterviewSchedule[]>(() => {
    const saved = localStorage.getItem("cb_interviews");
    return saved ? JSON.parse(saved) : [];
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem("cb_messages");
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>(() => {
    const saved = localStorage.getItem("cb_bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  // Keep derived state for profiles in sync
  const [candidateProfile, setCandidateProfile] = useState<CandidateProfile | null>(null);
  const [employerProfile, setEmployerProfile] = useState<CompanyProfile | null>(null);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem("cb_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("cb_companies", JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem("cb_jobs", JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem("cb_candidates", JSON.stringify(candidates));
  }, [candidates]);

  useEffect(() => {
    localStorage.setItem("cb_applications", JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem("cb_notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("cb_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("cb_interviews", JSON.stringify(interviews));
  }, [interviews]);

  useEffect(() => {
    localStorage.setItem("cb_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("cb_bookmarks", JSON.stringify(bookmarkedJobs));
  }, [bookmarkedJobs]);

  useEffect(() => {
    localStorage.setItem("cb_simulated_emails", JSON.stringify(simulatedEmails));
  }, [simulatedEmails]);

  // Sync profile details
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === "candidate" && currentUser.candidateId) {
        const found = candidates.find(c => c.id === currentUser.candidateId);
        setCandidateProfile(found || null);
      } else {
        setCandidateProfile(null);
      }

      if (currentUser.role === "employer" && currentUser.employerId) {
        const found = companies.find(comp => comp.id === currentUser.employerId);
        setEmployerProfile(found || null);
      } else {
        setEmployerProfile(null);
      }
    } else {
      setCandidateProfile(null);
      setEmployerProfile(null);
    }
  }, [currentUser, candidates, companies]);

  // Authenticate simulated users
  const login = (email: string, password?: string, forceRole?: UserRole) => {
    const lowerEmail = email.toLowerCase().trim();
    
    // Quick admin check
    if (lowerEmail === "admin@careerbridge.net" || forceRole === "admin") {
      const session: UserSession = {
        id: "usr-admin",
        email: "admin@careerbridge.net",
        role: "admin",
        emailVerified: true
      };
      setCurrentUser(session);
      return { success: true };
    }

    // Recruiter check for Google
    if (lowerEmail === "recruiter@google.com" || lowerEmail === "employer@example.com" || forceRole === "employer") {
      // Find or create an employer profile linked to comp-1 (Google)
      const targetComp = companies.find(c => c.companyName === "Google") || companies[0];
      const session: UserSession = {
        id: targetComp.userId,
        email: lowerEmail,
        role: "employer",
        employerId: targetComp.id,
        emailVerified: targetComp.emailVerified !== undefined ? targetComp.emailVerified : true,
        verificationToken: targetComp.verificationToken
      };
      setCurrentUser(session);
      return { success: true };
    }

    // Default student/candidate check
    // If exact mail exists in loaded candidates list, log in as them:
    const existingCand = candidates.find(c => c.email.toLowerCase() === lowerEmail);
    if (existingCand) {
      const session: UserSession = {
        id: existingCand.userId,
        email: existingCand.email,
        role: "candidate",
        candidateId: existingCand.id,
        emailVerified: existingCand.emailVerified !== undefined ? existingCand.emailVerified : true,
        verificationToken: existingCand.verificationToken
      };
      setCurrentUser(session);
      return { success: true };
    }

    // Create a new candidate profile if first time
    const newCandId = `cand-${Date.now()}`;
    const newUserId = `usr-${Date.now()}`;
    const token = `cb-verify-${Math.random().toString(36).substr(2, 7)}`;
    const newProfile: CandidateProfile = {
      id: newCandId,
      userId: newUserId,
      email: lowerEmail,
      fullName: lowerEmail.split("@")[0].toUpperCase(),
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80",
      headline: "Aspirational Professional",
      location: "San Francisco, CA",
      about: "Eager developer interested in exploring multiple corporate openings.",
      roleType: "experienced",
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      portfolioLinks: [],
      skills: ["React", "JavaScript"],
      profileCompletion: 30,
      emailVerified: false,
      verificationToken: token
    };

    setCandidates(prev => [...prev, newProfile]);
    setCurrentUser({
      id: newUserId,
      email: lowerEmail,
      role: "candidate",
      candidateId: newCandId,
      emailVerified: false,
      verificationToken: token
    });

    sendVerificationEmail(lowerEmail, newProfile.fullName, "candidate", token);

    return { success: true };
  };

  // User Signup
  const signup = (
    email: string, 
    fullName: string, 
    role: UserRole, 
    roleType: "student" | "fresher" | "experienced" = "experienced"
  ) => {
    const idSeed = Date.now();
    const newUserId = `usr-${idSeed}`;
    const token = `cb-verify-${Math.random().toString(36).substr(2, 7)}`;
    
    if (role === "candidate") {
      const newCandId = `cand-${idSeed}`;
      const newCand: CandidateProfile = {
        id: newCandId,
        userId: newUserId,
        email: email.toLowerCase(),
        fullName,
        photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80",
        headline: roleType === "student" ? "Computer Science Student" : roleType === "fresher" ? "Aspiring Developer" : "Software Professional",
        location: "United States",
        about: "Gladly onboarded to CareerBridge. Looking to contribute skills and find high-growth settings.",
        roleType,
        education: [],
        experience: [],
        projects: [],
        certifications: [],
        portfolioLinks: [],
        skills: ["TypeScript", "React"],
        profileCompletion: 40,
        emailVerified: false,
        verificationToken: token
      };

      setCandidates(prev => [newCand, ...prev]);
      setCurrentUser({
        id: newUserId,
        email: email.toLowerCase(),
        role: "candidate",
        candidateId: newCandId,
        emailVerified: false,
        verificationToken: token
      });

      sendVerificationEmail(email.toLowerCase(), fullName, "candidate", token);

      // Welcome Notification
      addNotification(newUserId, "Welcome to CareerBridge!", "Complete your onboarding information, add your education and experience to raise your hiring chances.", "profile_nudge");
    } else if (role === "employer") {
      const newCompId = `comp-${idSeed}`;
      const newComp: CompanyProfile = {
        id: newCompId,
        userId: newUserId,
        companyName: fullName, // Treated as Company Name contextually
        logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&q=80",
        website: `https://${fullName.toLowerCase().replace(/\s/g, "")}.com`,
        industry: "Technology",
        location: "Remote / Global",
        companySize: "10 - 50 employees",
        about: `Onboarded company. Complete company culture descriptions to attract premium designers and coders.`,
        isVerified: false, // Needs verification
        emailVerified: false,
        verificationToken: token
      };

      setCompanies(prev => [newComp, ...prev]);
      setCurrentUser({
        id: newUserId,
        email: email.toLowerCase(),
        role: "employer",
        employerId: newCompId,
        emailVerified: false,
        verificationToken: token
      });

      sendVerificationEmail(email.toLowerCase(), fullName, "employer", token);

      // Support ticket for verification automatically opened so admins can see & action it
      const newTicket: SupportTicket = {
        id: `tick-${idSeed}`,
        fullName: `${fullName} Representative`,
        email: email.toLowerCase(),
        subject: "Company Account Verification Request",
        message: `Our corporate platform ${fullName} was recently created. Please review our files and verify our company profile at earliest convenience. Thanks!`,
        status: "open",
        timestamp: new Date().toISOString()
      };
      setTickets(prev => [newTicket, ...prev]);
    } else {
      // Admin signup fallback
      setCurrentUser({
        id: newUserId,
        email: email.toLowerCase(),
        role: "admin",
        emailVerified: true
      });
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Helper notification dispatcher
  const addNotification = (userId: string, title: string, message: string, type: PortalNotification["type"]) => {
    const newNot: PortalNotification = {
      id: `not-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      userId,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type
    };
    setNotifications(prev => [newNot, ...prev]);
  };

  // Candidate Profile Updater
  const updateCandidateProfile = (profile: Partial<CandidateProfile>) => {
    if (!currentUser || !currentUser.candidateId) return;
    
    setCandidates(prev => prev.map(cand => {
      if (cand.id === currentUser.candidateId) {
        const next = { ...cand, ...profile };
        // Recalculate completeness score dynamically based on filled indicators
        let score = 20; // base score for registering
        if (next.fullName) score += 10;
        if (next.about && next.about.length > 30) score += 15;
        if (next.education && next.education.length > 0) score += 20;
        if (next.experience && next.experience.length > 0) score += 20;
        if (next.resumeUrl) score += 15;
        score = Math.min(score, 100);
        next.profileCompletion = score;
        return next;
      }
      return cand;
    }));
  };

  // Employer Company Profile Updater
  const updateEmployerProfile = (profile: Partial<CompanyProfile>) => {
    if (!currentUser || !currentUser.employerId) return;
    setCompanies(prev => prev.map(comp => {
      if (comp.id === currentUser.employerId) {
        return { ...comp, ...profile };
      }
      return comp;
    }));
    // Sync the local representation of company logo/names in active jobs
    setJobs(prev => prev.map(j => {
      if (j.companyId === currentUser.employerId) {
        return {
          ...j,
          companyName: profile.companyName || j.companyName,
          companyLogo: profile.logo || j.companyLogo,
          location: profile.location || j.location
        };
      }
      return j;
    }));
  };

  // Recruiter: Create Job Opening
  const createJob = (job: Omit<JobPost, "id" | "companyId" | "companyName" | "companyLogo" | "views" | "applicationsCount" | "postedDate">) => {
    if (!currentUser || !currentUser.employerId || !employerProfile) return;
    
    const newJob: JobPost = {
      ...job,
      id: `job-${Date.now()}`,
      companyId: employerProfile.id,
      companyName: employerProfile.companyName,
      companyLogo: employerProfile.logo,
      views: 0,
      applicationsCount: 0,
      postedDate: new Date().toISOString().split("T")[0]
    };

    setJobs(prev => [newJob, ...prev]);
    // System announcement notify
    addNotification("usr-admin", "New Job Posted", `${employerProfile.companyName} created a new position: ${job.title}.`, "announcement");
  };

  // Recruiter: Edit Job Post
  const updateJob = (jobId: string, updated: Partial<JobPost>) => {
    setJobs(prev => prev.map(j => (j.id === jobId ? { ...j, ...updated } as JobPost : j)));
  };

  // Recruiter: Delete Job Post
  const deleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(j => j.id !== jobId));
    // Clean up applications
    setApplications(prev => prev.filter(app => app.jobId !== jobId));
  };

  // Candidate: Apply To Job
  const applyToJob = (
    jobId: string, 
    data: { coverLetter?: string; resumeName: string; answers?: { question: string; answer: string }[] }
  ) => {
    if (!currentUser || !currentUser.candidateId || !candidateProfile) return;
    
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    const appId = `app-${Date.now()}`;
    const newApp: JobApplication = {
      id: appId,
      jobId,
      candidateId: candidateProfile.id,
      candidateName: candidateProfile.fullName,
      candidateEmail: candidateProfile.email,
      candidatePhoto: candidateProfile.photo,
      candidateHeadline: candidateProfile.headline,
      resumeName: data.resumeName || candidateProfile.resumeName || "Uploaded_CV.pdf",
      coverLetter: data.coverLetter,
      answers: data.answers,
      portfolioLinks: candidateProfile.portfolioLinks,
      status: "applied",
      appliedDate: new Date().toISOString().split("T")[0],
      activityLog: [
        {
          id: `act-${Date.now()}`,
          status: "applied",
          changedBy: "Candidate",
          timestamp: new Date().toISOString(),
          notes: "Application submitted securely via CareerBridge."
        }
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    
    // Increment applicant count inside jobs list
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, applicationsCount: j.applicationsCount + 1 };
      }
      return j;
    }));

    // Trigger employer notification
    const employerProfileLinked = companies.find(c => c.id === targetJob.companyId);
    if (employerProfileLinked) {
      addNotification(
        employerProfileLinked.userId,
        "New Job Application",
        `${candidateProfile.fullName} applied to your '${targetJob.title}' opening.`,
        "new_applicant"
      );
    }
  };

  // Recruiter Workspace: Update recruiting pipelines and stages
  const updateApplicationStatus = (applicationId: string, nextStatus: ApplicationStatus, notes?: string) => {
    setApplications(prev => prev.map(app => {
      if (app.id === applicationId) {
        const logItem: ActivityLog = {
          id: `act-${Date.now()}`,
          status: nextStatus,
          changedBy: currentUser?.role === "employer" ? employerProfile?.companyName || "Employer" : "System",
          timestamp: new Date().toISOString(),
          notes: notes || `Hiring stage updated to: ${nextStatus.replace(/_/g, " ").toUpperCase()}`
        };
        const nextApp = {
          ...app,
          status: nextStatus,
          activityLog: [...app.activityLog, logItem]
        };

        // Notify candidate of update
        const candidateLinked = candidates.find(c => c.id === app.candidateId);
        if (candidateLinked) {
          const jobLinked = jobs.find(j => j.id === app.jobId);
          addNotification(
            candidateLinked.userId,
            "Application Status Updated",
            `Your application for '${jobLinked?.title || "Role"}' was moved to ${nextStatus.replace(/_/g, " ").toUpperCase()}.`,
            "application_update"
          );
        }

        return nextApp;
      }
      return app;
    }));
  };

  // Recruiter Workspace: Schedule Interviews
  const scheduleInterview = (appointment: Omit<InterviewSchedule, "id" | "companyName" | "jobTitle">) => {
    const jobLinked = jobs.find(j => j.id === appointment.jobId);
    const companyLinked = companies.find(c => c.id === jobLinked?.companyId);

    const newInterview: InterviewSchedule = {
      ...appointment,
      id: `int-${Date.now()}`,
      jobTitle: jobLinked?.title || "Software Specialist",
      companyName: companyLinked?.companyName || "Employer"
    };

    setInterviews(prev => [newInterview, ...prev]);

    // Move application to interview stage automatically
    updateApplicationStatus(
      appointment.applicationId,
      "interview_round_1",
      `Interview Scheduled: ${appointment.title} on ${appointment.date} at ${appointment.time} via ${appointment.mode.toUpperCase()}`
    );

    // Send Notification to candidate
    const candidateLinked = candidates.find(c => c.id === appointment.candidateId);
    if (candidateLinked) {
      addNotification(
        candidateLinked.userId,
        "New Interview Scheduled",
        `You have been invited to an interview for ${jobLinked?.title} with ${companyLinked?.companyName}. Mode: ${appointment.mode.toUpperCase()}.`,
        "interview_invite"
      );
    }
  };

  // Messaging channels
  const sendChatMessage = (chatId: string, senderId: string, senderName: string, role: "candidate" | "employer", content: string) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId,
      senderName,
      senderRole: role,
      content,
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const getChatMessages = (chatId: string) => {
    return messages.filter(m => m.chatId === chatId);
  };

  const getChatThreads = (): ChatThread[] => {
    // Generate derived chat threads based on existing applications
    const activeChats: ChatThread[] = [];
    applications.forEach(app => {
      const jobLinked = jobs.find(j => j.id === app.jobId);
      if (!jobLinked) return;
      
      const chatId = `${app.candidateId}-${jobLinked.companyId}-${app.jobId}`;
      const threadMessages = messages.filter(m => m.chatId === chatId);
      const lastMsg = threadMessages[threadMessages.length - 1];
      
      activeChats.push({
        chatId,
        jobId: app.jobId,
        jobTitle: jobLinked.title,
        candidateId: app.candidateId,
        candidateName: app.candidateName,
        companyId: jobLinked.companyId,
        companyName: jobLinked.companyName,
        lastMessageText: lastMsg ? lastMsg.content : "No messages yet. Initiate coordination!",
        lastMessageTime: lastMsg ? lastMsg.timestamp : app.appliedDate
      });
    });
    return activeChats;
  };

  // Save/Bookmark Job
  const toggleBookmark = (jobId: string) => {
    setBookmarkedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  // Support System
  const createTicket = (ticket: Omit<SupportTicket, "id" | "status" | "timestamp">) => {
    const newT: SupportTicket = {
      ...ticket,
      id: `tick-${Date.now()}`,
      status: "open",
      timestamp: new Date().toISOString()
    };
    setTickets(prev => [newT, ...prev]);
  };

  const resolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: "resolved" } as SupportTicket : t));
  };

  // Administration Panel: Verify Company accounts
  const verifyCompany = (companyId: string, approve: boolean) => {
    setCompanies(prev => prev.map(comp => {
      if (comp.id === companyId) {
        return approve ? { ...comp, isVerified: true, verificationRejected: false } : { ...comp, isVerified: false, verificationRejected: true };
      }
      return comp;
    }));

    // Notify Company Admin
    const targetComp = companies.find(c => c.id === companyId);
    if (targetComp) {
      addNotification(
        targetComp.userId,
        approve ? "Company Profile Verified" : "Verification Declined",
        approve 
          ? "CareerBridge administrators audited and approved your company profile! A green verified checkbadge is now active."
          : "Verification declined. Please make sure website URLs and corporate email addresses represent active operations.",
        "announcement"
      );
    }
  };

  // Administration Panel: Moderate Job flagging
  const moderateJob = (jobId: string, flag: boolean, reason?: string) => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return {
          ...j,
          isFlagged: flag,
          flagReason: reason || "Flagged in reports moderation.",
          status: flag ? "closed" : "published" // immediately suspend if flagged
        };
      }
      return j;
    }));

    // Notify Employer
    const targetJob = jobs.find(j => j.id === jobId);
    if (targetJob) {
      const companyLinked = companies.find(c => c.id === targetJob.companyId);
      if (companyLinked) {
        addNotification(
          companyLinked.userId,
          flag ? "Job Posting Closed by Moderator" : "Job Restored by Moderator",
          flag
            ? `Your job posting '${targetJob.title}' was flagged as suspicious or violating guidelines. Reason: ${reason}.`
            : `Your job posting '${targetJob.title}' was reviewed and restored to the public board.`,
          "announcement"
        );
      }
    }
  };

  // Quick read controllers
  const markNotificationRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  };

  // Simulated AI parse resume workflow
  const simulateResumeParse = async (fileName: string): Promise<{ parsed: boolean; skills: string[]; headline: string; experience: string }> => {
    // Artificial 1 second delay to simulate intelligence
    await new Promise(resolve => setTimeout(resolve, 1400));
    
    // Intelligent heuristic parsing based on typical resume files
    if (fileName.toLowerCase().includes("designer") || fileName.toLowerCase().includes("ux") || fileName.toLowerCase().includes("portfolio")) {
      return {
        parsed: true,
        skills: ["Figma", "Design Systems", "Tailwind CSS", "UI/UX Strategy", "Wireframing"],
        headline: "Lead UI/UX Architect & Visual Designer",
        experience: "Lead Design Strategist specializing in structuring high-fidelity customer dashboards and clean style assets."
      };
    }

    if (fileName.toLowerCase().includes("student") || fileName.toLowerCase().includes("junior") || fileName.toLowerCase().includes("fresher")) {
      return {
        parsed: true,
        skills: ["React", "TypeScript", "Node.js", "Express", "Docker", "Git"],
        headline: "Junior Full Stack Developer",
        experience: "Computer Science graduate with hands-on labs training building container-ready task channels and REST APIs."
      };
    }

    // Default robust parser
    return {
      parsed: true,
      skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Docker", "AWS", "Go", "SQL"],
      headline: "Senior Engineering Generalist",
      experience: "Proven systems engineer with 5+ years building modular web applications and deploying containerized automation runners."
    };
  };

  const incrementJobViews = (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, views: j.views + 1 } : j));
  };

  const sendVerificationEmail = (email: string, fullName: string, role: UserRole, token: string) => {
    const verificationLink = `${window.location.origin}${window.location.pathname}?verify_token=${token}`;
    const plainTextBody = `
Dear ${fullName},

Welcome to CareerBridge Switzerland! We are excited to have you onboard Zurich's premium professional hiring ecosystem.

To activate your account and fully unlock all workspace capabilities (including posting jobs, applying for open positions, and messaging recruiters), please verify your email address by clicking the link below:

${verificationLink}

If you are asked for a manual authorization check, enter your 8-digit verification code below:
Activation Code Sequence: ${token}

Warm regards,
CareerBridge Security Team
Zurich, Switzerland
    `.trim();

    const newEmail: SimulatedEmail = {
      id: `eml-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      to: email.toLowerCase(),
      subject: "🛡️ Action required: Please activate your CareerBridge account email address",
      body: plainTextBody,
      timestamp: new Date().toISOString(),
      token,
      role
    };

    setSimulatedEmails(prev => [newEmail, ...prev]);
  };

  const verifyEmailToken = (token: string) => {
    let verifiedEmail = "";
    let foundRole: UserRole | undefined = undefined;

    setCandidates(prev => {
      const idx = prev.findIndex(c => c.verificationToken === token);
      if (idx !== -1) {
        verifiedEmail = prev[idx].email;
        foundRole = "candidate";
        const copy = [...prev];
        copy[idx] = { ...copy[idx], emailVerified: true };
        return copy;
      }
      return prev;
    });

    setCompanies(prev => {
      const idx = prev.findIndex(c => c.verificationToken === token);
      if (idx !== -1) {
        verifiedEmail = prev[idx].email;
        foundRole = "employer";
        const copy = [...prev];
        copy[idx] = { ...copy[idx], emailVerified: true };
        return copy;
      }
      return prev;
    });

    if (foundRole) {
      // Find and update current user if matches
      setCurrentUser(prev => {
        if (prev && prev.email.toLowerCase() === verifiedEmail.toLowerCase()) {
          return { ...prev, emailVerified: true };
        }
        return prev;
      });

      return { success: true, role: foundRole };
    }

    return { success: false, message: "Invalid or expired token sequence." };
  };

  const resendVerificationEmail = () => {
    if (!currentUser) return;
    
    let fullName = "";
    let token = currentUser.verificationToken || `cb-verify-${Math.random().toString(36).substr(2, 7)}`;
    
    if (currentUser.role === "candidate" && currentUser.candidateId) {
      const cand = candidates.find(c => c.id === currentUser.candidateId);
      if (cand) {
        fullName = cand.fullName;
        if (!cand.verificationToken) {
          setCandidates(prev => prev.map(c => c.id === cand.id ? { ...c, verificationToken: token, emailVerified: false } : c));
        }
      }
    } else if (currentUser.role === "employer" && currentUser.employerId) {
      const comp = companies.find(c => c.id === currentUser.employerId);
      if (comp) {
        fullName = comp.companyName;
        if (!comp.verificationToken) {
          setCompanies(prev => prev.map(c => c.id === comp.id ? { ...c, verificationToken: token, emailVerified: false } : c));
        }
      }
    }

    // Update active currentUser context session
    setCurrentUser(prev => {
      if (prev) {
        return { ...prev, emailVerified: false, verificationToken: token };
      }
      return prev;
    });

    sendVerificationEmail(currentUser.email, fullName || currentUser.email.split("@")[0].toUpperCase(), currentUser.role, token);
  };

  const clearSimulatedEmails = () => {
    setSimulatedEmails([]);
  };

  return (
    <JobPortalContext.Provider value={{
      currentUser,
      candidateProfile,
      employerProfile,
      jobs,
      companies,
      applications,
      candidates,
      notifications: notifications.filter(n => currentUser && n.userId === currentUser.id),
      tickets,
      interviews,
      messages,
      bookmarkedJobs,
      
      login,
      signup,
      logout,
      updateCandidateProfile,
      updateEmployerProfile,
      createJob,
      updateJob,
      deleteJob,
      applyToJob,
      updateApplicationStatus,
      scheduleInterview,
      sendChatMessage,
      getChatMessages,
      getChatThreads,
      toggleBookmark,
      createTicket,
      resolveTicket,
      verifyCompany,
      moderateJob,
      markNotificationRead,
      markAllNotificationsRead,
      simulateResumeParse,
      incrementJobViews,

      simulatedEmails,
      sendVerificationEmail,
      verifyEmailToken,
      resendVerificationEmail,
      clearSimulatedEmails
    }}>
      {children}
    </JobPortalContext.Provider>
  );
};
