import React, { useState, useEffect } from "react";
import { useJobPortal } from "./JobPortalContext";
import { 
  JobPost, CompanyProfile, JobApplication, 
  WorkMode, JobType, JobStatus, ApplicationStatus, InterviewMode 
} from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building, Briefcase, Users, UserCheck, CalendarDays, LineChart, 
  Plus, Edit3, Pause, Play, Trash, Check, X, FileText, Globe, 
  UsersRound, Settings, Send, Calendar, MessageSquare, ChevronRight, Eye,
  Sliders, Award, Sparkles, CheckCircle2, GraduationCap, Bookmark, FileCode,
  TrendingUp, Zap, RotateCcw, HelpCircle, Star, MessageCircle, AlertCircle, FileSpreadsheet, User
} from "lucide-react";

export const EmployerWorkspace: React.FC = () => {
  const { 
    currentUser, 
    employerProfile, 
    updateEmployerProfile, 
    jobs, 
    createJob,
    updateJob,
    deleteJob,
    applications, 
    updateApplicationStatus,
    scheduleInterview,
    getChatThreads,
    messages,
    sendChatMessage,
    candidates
  } = useJobPortal();

  // Navigation steps: "dashboard" | "post-job" | "manage-jobs" | "applicants" | "chats" | "analytics" | "branding"
  const [activeStep, setActiveStep] = useState<"dashboard" | "post-job" | "manage-jobs" | "applicants" | "chats" | "analytics" | "branding">("dashboard");

  // Selection states for job tracking
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Advanced assessment states
  const [appEvaluations, setAppEvaluations] = useState<Record<string, {
    techScore: number;
    softScore: number;
    expScore: number;
    cultureScore: number;
    notes: string;
  }>>(() => {
    const saved = localStorage.getItem("cb_app_evaluations");
    return saved ? JSON.parse(saved) : {};
  });

  const [candidateDetailTab, setCandidateDetailTab] = useState<"dossier" | "match" | "copilot" | "scorecard">("dossier");
  const [showMatrix, setShowMatrix] = useState<boolean>(false);
  const [showSavedAlert, setShowSavedAlert] = useState<boolean>(false);

  // Target scoring values
  const [techVal, setTechVal] = useState<number>(75);
  const [softVal, setSoftVal] = useState<number>(75);
  const [expVal, setExpVal] = useState<number>(75);
  const [cultureVal, setCultureVal] = useState<number>(80);
  const [notesVal, setNotesVal] = useState<string>("");

  useEffect(() => {
    if (selectedAppId) {
      const activeEval = appEvaluations[selectedAppId];
      if (activeEval) {
        setTechVal(activeEval.techScore);
        setSoftVal(activeEval.softScore);
        setExpVal(activeEval.expScore);
        setCultureVal(activeEval.cultureScore);
        setNotesVal(activeEval.notes || "");
      } else {
        setTechVal(75);
        setSoftVal(75);
        setExpVal(75);
        setCultureVal(80);
        setNotesVal("");
      }
      // Reset to dossier when changing candidate to keep experience flawless
      setCandidateDetailTab("dossier");
    }
  }, [selectedAppId]);

  const saveEvaluation = (appId: string, data: { techScore: number; softScore: number; expScore: number; cultureScore: number; notes: string }) => {
    const next = { ...appEvaluations, [appId]: data };
    setAppEvaluations(next);
    localStorage.setItem("cb_app_evaluations", JSON.stringify(next));
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 2500);
  };

  const calculateMatchScore = (candSkills: string[] | undefined, jobSkills: string[] | undefined) => {
    const cand = candSkills || [];
    const job = jobSkills || [];
    if (job.length === 0) return 75; // Baseline matching index
    if (cand.length === 0) return 30; // low match fallback

    const candLower = cand.map(s => s.toLowerCase().trim());
    const jobLower = job.map(s => s.toLowerCase().trim());
    
    let overlaps = 0;
    jobLower.forEach(js => {
      if (candLower.some(cs => cs.includes(js) || js.includes(cs))) {
        overlaps++;
      }
    });

    const ratio = overlaps / jobLower.length;
    return Math.min(100, Math.round(30 + (ratio * 70))); // scale 30% to 100%
  };

  const getRecruiterRating = (appId: string) => {
    const evalData = appEvaluations[appId];
    if (!evalData) return null;
    const avg = (evalData.techScore + evalData.softScore + evalData.expScore + evalData.cultureScore) / 4;
    return (avg / 20).toFixed(1); // Score 1.0 to 5.0
  };

  const generateInterviewQuestions = (cand: any, job: any) => {
    const questions: { id: string; topic: string; question: string; rubric: string }[] = [];
    
    const candSkills = cand?.skills || [];
    const jobSkills = job?.skills || [];
    
    // Simple topic matching based on overlapping tags
    const overlapping = jobSkills.filter((js: string) => candSkills.some((cs: string) => cs.toLowerCase().includes(js.toLowerCase()) || js.toLowerCase().includes(cs.toLowerCase())));
    if (overlapping.length > 0) {
      const targetSkill = overlapping[0];
      questions.push({
        id: "q1",
        topic: `${targetSkill} Architecture Mastery`,
        question: `In your profile, you highlighted deep experience with ${targetSkill}. Can you detail a challenging architectural trade-off you encountered when working with ${targetSkill}, specifically looking at memory optimization, API latency, or scale under high volume?`,
        rubric: `Focus on their structural understanding. Look for mention of concurrency, caching techniques (Redis or CDN), database indexing, or state splitting. Dock points for generic, non-technical answers.`
      });
    } else {
      questions.push({
        id: "q1",
        topic: "System Scalability & State Management",
        question: `Looking at your experience, you've built complex full-stack workflows. How would you design an asset compression pipeline or cache-busting architecture in a highly distributed server environment?`,
        rubric: `The candidate should discuss memory/CPU constraints, asynchronous tasks workers, or Redis cache keys. They should outline a sensible client-server communication fallback.`
      });
    }

    const missing = jobSkills.filter((js: string) => !candSkills.some((cs: string) => cs.toLowerCase().includes(js.toLowerCase()) || js.toLowerCase().includes(cs.toLowerCase())));
    if (missing.length > 0) {
      const targetSkill = missing[0];
      questions.push({
        id: "q2",
        topic: `${targetSkill} Knowledge Transition`,
        question: `This position utilizes ${targetSkill} extensively, which is not actively listed in your core resume profile. Drawing from similar tech stacks you’ve mastered, how would you approach picking up ${targetSkill} constraints, and how does your expertise translate?`,
        rubric: `Assess learnability and fundamental analogies. Do they connect it to tools they know (e.g. comparing Tailwind to standard bootstrap, Node to Python FastAPI)? An elite candidate will explain how the underlying fundamentals are identical.`
      });
    } else {
      questions.push({
        id: "q2",
        topic: "Technical Risk Mitigation",
        question: `How do you handle production critical bugs (e.g., a memory leak or a race condition) under tight product launch timelines? Can you walk through your step-by-step diagnostic strategy?`,
        rubric: `Look for methodical diagnostic steps (profilers, telemetry logs, binary search debugging) instead of chaotic trial-and-error. They should demonstrate focus on system safety and quick rollovers.`
      });
    }

    if (cand?.roleType === "student" || cand?.roleType === "fresher") {
      questions.push({
        id: "q3",
        topic: "Ownership & Team Orchestration",
        question: `As a junior/academic track developer, can you discuss a specific project or hackathon where you had to quickly resolve a conflict of ideas or a block in performance without senior supervision?`,
        rubric: `Look for high initiative, emotional maturity, active search for peer feedback, and focus on group shipping velocity over individual ego.`
      });
    } else {
      questions.push({
        id: "q3",
        topic: "Strategic Leadership & Concurrency",
        question: `Given your advanced career track and history at technical projects, how do you handle legacy code refactoring? What metrics do you use to justify architectural migration timelines to business leaders?`,
        rubric: `Assess business empathy. Do they translate code refactoring into tangible business parameters (e.g. development speed, infrastructure billing reductions, lower churn) instead of purely aesthetic code desires?`
      });
    }

    return questions;
  };

  // Job creation form
  const [isNewJob, setIsNewJob] = useState(true);
  const [editJobId, setEditJobId] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDept, setJobDept] = useState("Engineering");
  const [jobLoc, setJobLoc] = useState("");
  const [jobMode, setJobMode] = useState<WorkMode>("hybrid");
  const [jobType, setJobType] = useState<JobType>("full-time");
  const [jobSalary, setJobSalary] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [jobReqs, setJobReqs] = useState("");
  const [jobResps, setJobResps] = useState("");
  const [jobPerks, setJobPerks] = useState("");
  const [jobElig, setJobElig] = useState("");
  const [jobOpenings, setJobOpenings] = useState(1);
  const [jobStatus, setJobStatus] = useState<JobStatus>("published");

  // Employer Branding Profile states
  const [brandName, setBrandName] = useState(employerProfile?.companyName || "");
  const [brandLogo, setBrandLogo] = useState(employerProfile?.logo || "");
  const [brandWeb, setBrandWeb] = useState(employerProfile?.website || "");
  const [brandIndustry, setBrandIndustry] = useState(employerProfile?.industry || "Technology");
  const [brandLoc, setBrandLoc] = useState(employerProfile?.location || "");
  const [brandSize, setBrandSize] = useState(employerProfile?.companySize || "11 - 50 employees");
  const [brandAbout, setBrandAbout] = useState(employerProfile?.about || "");

  // Interview scheduling modal state
  const [scheduleApp, setScheduleApp] = useState<JobApplication | null>(null);
  const [meetingTitle, setMeetingTitle] = useState("Technical Systems Round 1");
  const [meetingDate, setMeetingDate] = useState("2026-05-25");
  const [meetingTime, setMeetingTime] = useState("14:00");
  const [meetingMode, setMeetingMode] = useState<InterviewMode>("google_meet");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [meetingHost, setMeetingHost] = useState("");

  // Chats states
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState("");

  if (!employerProfile) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-lg text-center">
        <Building size={48} className="text-primary mx-auto mb-4 animate-pulse" />
        <h3 className="font-display text-lg font-bold text-secondary">Onboard Company Workspace</h3>
        <p className="font-sans text-xs text-neutral-slate-500 mt-1 mb-6">
          Specify company branding and credentials to begin posting vacancy listings and receiving applicant files.
        </p>
        <button 
          onClick={() => {
            updateEmployerProfile({
              companyName: currentUser?.email.split("@")[0].toUpperCase() || "My Startup Inc"
            });
          }}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-display text-xs font-semibold w-full transition-all cursor-pointer"
        >
          Initialize Corporate Identity
        </button>
      </div>
    );
  }

  // Derived datasets specific to this company employer profile (comp-1 ...)
  const companyJobs = jobs.filter(j => j.companyId === employerProfile.id);
  const companyJobIds = companyJobs.map(j => j.id);
  const companyApplicants = applications.filter(app => companyJobIds.includes(app.jobId));

  // Count matrices
  const countActiveJobs = companyJobs.filter(j => j.status === "published").length;
  const countShortlisted = companyApplicants.filter(app => app.status === "shortlisted").length;
  const countInterviewing = companyApplicants.filter(app => app.status.includes("interview")).length;
  const countHired = companyApplicants.filter(app => app.status === "hired").length;

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const preparedJobData = {
      title: jobTitle,
      department: jobDept,
      location: jobLoc,
      workMode: jobMode,
      type: jobType,
      salaryRange: jobSalary || "No Specified compensation",
      description: jobDesc,
      requirements: jobReqs.split("\n").map(s => s.trim()).filter(Boolean),
      responsibilities: jobResps.split("\n").map(s => s.trim()).filter(Boolean),
      perks: jobPerks.split("\n").map(s => s.trim()).filter(Boolean),
      eligibility: jobElig,
      openings: Number(jobOpenings),
      status: jobStatus,
      isFeatured: false
    };

    if (isNewJob) {
      if (currentUser && !currentUser.emailVerified) {
        alert("Verification Required: Please verify your corporate email address first to publish new slots! Inspect the floating 'Mail Sandbox' panel in the bottom-left corner to confirm your address.");
        return;
      }
      createJob(preparedJobData);
    } else {
      updateJob(editJobId, preparedJobData);
    }

    // Reset Form & Redirect
    resetJobForm();
    setActiveStep("manage-jobs");
  };

  const resetJobForm = () => {
    setIsNewJob(true);
    setEditJobId("");
    setJobTitle("");
    setJobDept("Engineering");
    setJobLoc("");
    setJobMode("hybrid");
    setJobType("full-time");
    setJobSalary("");
    setJobDesc("");
    setJobReqs("");
    setJobResps("");
    setJobPerks("");
    setJobElig("");
    setJobOpenings(1);
    setJobStatus("published");
  };

  const handleDuplicateJob = (job: JobPost) => {
    if (currentUser && !currentUser.emailVerified) {
      alert("Verification Required: Please verify your corporate email address first sequence! Inspect the floating 'Mail Sandbox' panel in the bottom-left corner.");
      return;
    }
    // Post new duplicate job with slightly updated label
    const preDupe = {
      title: `${job.title} (Duplicate)`,
      department: job.department,
      location: job.location,
      workMode: job.workMode,
      type: job.type,
      salaryRange: job.salaryRange,
      description: job.description,
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      perks: job.perks,
      eligibility: job.eligibility,
      openings: job.openings,
      status: "draft" as JobStatus, // duplicate as draft
      isFeatured: false
    };
    createJob(preDupe);
  };

  const syncCorporateBranding = (e: React.FormEvent) => {
    e.preventDefault();
    updateEmployerProfile({
      companyName: brandName,
      logo: brandLogo,
      website: brandWeb,
      industry: brandIndustry,
      location: brandLoc,
      companySize: brandSize,
      about: brandAbout
    });
    alert("Branding Profile Updated successfully on CareerBridge servers.");
    setActiveStep("dashboard");
  };

  const dispatchInterviewSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleApp) return;

    scheduleInterview({
      applicationId: scheduleApp.id,
      jobId: scheduleApp.jobId,
      candidateId: scheduleApp.candidateId,
      title: meetingTitle,
      date: meetingDate,
      time: meetingTime,
      mode: meetingMode,
      meetingLink: meetingMode === "zoom" ? "https://zoom.us/j/908231" : "https://meet.google.com/ais-rka-uu",
      notes: meetingNotes,
      interviewerName: meetingHost || "Senior Architect Coordinator"
    });

    setScheduleApp(null);
  };

  // Filter Applicants based on selected Job IDs
  const filteredApplicants = companyApplicants.filter(app => {
    if (selectedJobId !== "all" && app.jobId !== selectedJobId) return false;
    return true;
  });

  const chatThreads = getChatThreads().filter(th => th.companyId === employerProfile.id);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !typedMessage.trim()) return;

    const currentThread = chatThreads.find(th => th.chatId === activeChatId);
    if (!currentThread) return;

    sendChatMessage(
      activeChatId,
      employerProfile.id,
      employerProfile.companyName,
      "employer",
      typedMessage.trim()
    );
    setTypedMessage("");
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8">
      {/* Role Navigation controls */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-neutral-slate-200 pb-4">
        {[
          { key: "dashboard", label: "Dashboard overview" },
          { key: "applicants", label: `Applicants pool (${companyApplicants.length})` },
          { key: "manage-jobs", label: `Active Openings (${companyJobs.length})` },
          { key: "post-job", label: "Post custom vacancy" },
          { key: "branding", label: "Corporate brand specs" },
          { key: "chats", label: "Messages" },
          { key: "analytics", label: "Hiring analytics" }
        ].map(st => (
          <button
            key={st.key}
            onClick={() => {
              setActiveStep(st.key as any);
              if (st.key === "post-job") resetJobForm();
              setSelectedAppId(null);
            }}
            className={`px-5 py-2 hover:bg-neutral-slate-50 transition-all font-display text-xs sm:text-sm font-semibold rounded-lg ${
              activeStep === st.key 
                ? "bg-secondary text-white hover:opacity-90" 
                : "text-neutral-slate-600 hover:text-secondary"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full"
        >
          {/* DASHBOARD SUMMARY PANEL */}
          {activeStep === "dashboard" && (
            <div className="space-y-8">
              {/* Recruiter metric summaries */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: "Active Job Listings", val: countActiveJobs, labelSub: "Public views" },
                  { label: "Total Candidates Applications", val: companyApplicants.length, labelSub: "Active funnel" },
                  { label: "Shortlisted Candidates", val: countShortlisted, labelSub: "Stage conversions" },
                  { label: "Placements Hires Made", val: countHired, labelSub: "Goal completion" }
                ].map((st, idx) => (
                  <div key={idx} className="bg-white border border-neutral-slate-200 p-5 rounded-xl shadow-sm text-center">
                    <p className="font-display text-2xl sm:text-3xl font-extrabold text-secondary">{st.val}</p>
                    <p className="font-sans text-[11px] text-neutral-slate-500 mt-1 uppercase tracking-tight font-semibold">{st.label}</p>
                    <span className="font-sans text-[10px] text-primary font-bold">{st.labelSub}</span>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Active Job Openings Briefing */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-slate-100 mb-4">
                    <h3 className="font-display font-medium text-sm sm:text-base text-secondary">
                      Active Listings overview
                    </h3>
                    <button 
                      onClick={() => setActiveStep("post-job")}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      + Publish Opening
                    </button>
                  </div>

                  {companyJobs.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="text-neutral-slate-300 mx-auto mb-2" size={32} />
                      <p className="font-sans text-xs text-neutral-slate-500">No vacancies published yet on CareerBridge.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {companyJobs.slice(0, 4).map(job => (
                        <div key={job.id} className="flex justify-between items-center bg-neutral-slate-50 p-4 border border-neutral-slate-200/50 rounded-lg">
                          <div>
                            <p className="font-display text-xs font-bold text-secondary">{job.title}</p>
                            <p className="font-sans text-[10px] text-neutral-slate-500 mt-0.5">Location: {job.location} • Budget: {job.salaryRange}</p>
                          </div>
                          
                          <div className="text-right">
                            <span className="font-display text-xs font-extrabold text-secondary block">{job.applicationsCount} applicants</span>
                            <span className="font-sans text-[10px] text-neutral-slate-400 block mt-0.5">Views: {job.views}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Latest Applicants Funnel tracker */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-slate-100 mb-4">
                    <h3 className="font-display font-medium text-sm sm:text-base text-secondary">
                      Incoming applications Funnel
                    </h3>
                    <button 
                      onClick={() => setActiveStep("applicants")}
                      className="text-xs text-primary font-bold hover:underline"
                    >
                      Review All Pool
                    </button>
                  </div>

                  {companyApplicants.length === 0 ? (
                    <div className="text-center py-8">
                      <Users className="text-neutral-slate-300 mx-auto mb-2" size={32} />
                      <p className="font-sans text-xs text-neutral-slate-500 font-semibold">Waiting on application transmissions.</p>
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {companyApplicants.slice(0, 4).map(app => {
                        const jLinked = jobs.find(j => j.id === app.jobId);
                        return (
                          <div key={app.id} className="flex justify-between items-center bg-neutral-slate-50 p-4 rounded-lg border border-neutral-slate-200/50">
                            <div>
                              <p className="font-display text-xs font-bold text-secondary">{app.candidateName}</p>
                              <p className="font-sans text-[10px] text-neutral-slate-500 mt-0.5">Applying for: {jLinked?.title || "Role"}</p>
                            </div>
                            
                            <span className="bg-teal-50 border border-teal-100/50 text-secondary-container px-2.5 py-0.5 rounded text-[10px] font-display font-bold uppercase tracking-wider">
                              {app.status.replace(/_/g, " ")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VACANCY PUBLISHER GRID */}
          {activeStep === "post-job" && (
            <div className="bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm">
              <h3 className="font-display font-bold text-secondary text-base border-b border-neutral-slate-100 pb-3 mb-6">
                {isNewJob ? "Publish custom job vacancy opening" : `Edit vacancy: ${jobTitle}`}
              </h3>

              <form onSubmit={handlePostJobSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  <div className="col-span-2">
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Job Title / Designation</label>
                    <input 
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Lead Systems reliability Engineer"
                      className="w-full border px-3.5 py-2 rounded-lg text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200 focus:bg-white" 
                      type="text" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Functional Department</label>
                    <select 
                      value={jobDept}
                      onChange={(e) => setJobDept(e.target.value)}
                      className="w-full border px-3.5 py-2 rounded-lg text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200"
                    >
                      <option value="Engineering">Engineering & Coding</option>
                      <option value="Design">Product Design / UX</option>
                      <option value="Marketing">Growth & Marketing</option>
                      <option value="Sales">Corporate Sales</option>
                      <option value="Product">Product Management</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Office / Location details</label>
                    <input 
                      required
                      value={jobLoc}
                      onChange={(e) => setJobLoc(e.target.value)}
                      placeholder="e.g. Zurich, CH or Remote, SF"
                      className="w-full border px-3.5 py-2 rounded-lg text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200 focus:bg-white" 
                      type="text" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Budget Salary / Stipend range</label>
                    <input 
                      required
                      value={jobSalary}
                      onChange={(e) => setJobSalary(e.target.value)}
                      placeholder="e.g. $160k - $210k or $6,500/mo"
                      className="w-full border px-3.5 py-2 rounded-lg text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200 focus:bg-white" 
                      type="text" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Openings Vacancy Countdown</label>
                    <input 
                      required
                      value={jobOpenings}
                      onChange={(e) => setJobOpenings(Number(e.target.value))}
                      min={1}
                      className="w-full border px-3.5 py-2 rounded-lg text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200 focus:bg-white" 
                      type="number" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Work mode</label>
                    <select 
                      value={jobMode}
                      onChange={(e) => setJobMode(e.target.value as WorkMode)}
                      className="w-full border px-3.5 py-2 rounded-lg text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200"
                    >
                      <option value="remote">Remote (Work from Anywhere)</option>
                      <option value="hybrid">Hybrid (Custom office clusters)</option>
                      <option value="on-site">On-Site Workspace</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Employment Type</label>
                    <select 
                      value={jobType}
                      onChange={(e) => setJobType(e.target.value as JobType)}
                      className="w-full border px-3.5 py-2 rounded-lg text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200"
                    >
                      <option value="full-time">Full-Time Hire</option>
                      <option value="part-time">Part-Time Hire</option>
                      <option value="contract">Contracting Tenure</option>
                      <option value="internship">Student Internship program</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Initial Status Policy</label>
                    <select 
                      value={jobStatus}
                      onChange={(e) => setJobStatus(e.target.value as JobStatus)}
                      className="w-full border px-3.5 py-2 rounded-lg text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200"
                    >
                      <option value="published">Publish instantly publicly</option>
                      <option value="draft">Save draft initially</option>
                      <option value="paused">Hold / Pause listing</option>
                    </select>
                  </div>
                </div>

                <div className="text-left">
                  <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Role Description context</label>
                  <textarea 
                    required
                    value={jobDesc}
                    onChange={(e) => setJobDesc(e.target.value)}
                    rows={3}
                    placeholder="Provide overview details mapping parameters..."
                    className="w-full border p-3 rounded-lg text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200 focus:bg-white" 
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 text-left">
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Candidate Eligibility framework</label>
                    <input 
                      value={jobElig}
                      onChange={(e) => setJobElig(e.target.value)}
                      placeholder="e.g. MS/PhD in Computing or equivalent professional experience"
                      className="w-full border px-3 py-2 rounded text-xs bg-neutral-slate-50 outline-none border-neutral-slate-200" 
                      type="text" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Target qualifications & Skills (e.g. Go, Figma...)</label>
                    <input 
                      required
                      value={jobReqs}
                      onChange={(e) => setJobReqs(e.target.value)}
                      placeholder="One item per line representing essential skills..."
                      className="w-full border px-3 py-2 rounded text-xs bg-neutral-slate-50 outline-none border-neutral-slate-200" 
                      type="text" 
                    />
                  </div>
                </div>

                <div className="text-left flex gap-4 border-t border-neutral-slate-100 pt-6 justify-end">
                  <button 
                    type="button" 
                    onClick={() => setActiveStep("manage-jobs")}
                    className="border border-neutral-slate-300 text-neutral-slate-600 px-5 py-2 text-xs font-display font-bold rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 text-xs font-display font-bold rounded-lg cursor-pointer"
                  >
                    {isNewJob ? "Publish Vacancy Listing" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ACTIVE WORKSPACE JOBS MANAGEMENT LIST */}
          {activeStep === "manage-jobs" && (
            <div className="bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm">
              <div className="flex justify-between items-center pb-3 border-b border-neutral-slate-100 mb-6">
                <h3 className="font-display font-bold text-secondary text-base">Corporate Openings listings directory</h3>
                <button 
                  onClick={() => {
                    resetJobForm();
                    setActiveStep("post-job");
                  }}
                  className="bg-primary hover:bg-primary-hover text-white text-xs px-4 py-2 rounded-lg font-display font-bold"
                >
                  + Add job
                </button>
              </div>

              {companyJobs.length === 0 ? (
                <div className="text-center py-12 text-neutral-slate-400">
                  <p className="font-sans text-xs">No active job posts matching this company account details.</p>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left text-xs sm:text-xs">
                    <thead>
                      <tr className="border-b border-neutral-slate-200 text-neutral-slate-400 uppercase font-display font-bold">
                        <th className="py-3 px-2">Job Designation</th>
                        <th className="py-3 px-2">Work Mode</th>
                        <th className="py-3 px-2">applicants</th>
                        <th className="py-3 px-2">views</th>
                        <th className="py-3 px-2">Status</th>
                        <th className="py-3 px-2 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyJobs.map(job => (
                        <tr key={job.id} className="border-b border-neutral-slate-100 hover:bg-neutral-slate-50 transition-colors">
                          <td className="py-4.5 px-2">
                            <p className="font-display font-bold text-secondary text-xs sm:text-sm">{job.title}</p>
                            <span className="font-sans text-[10px] text-neutral-slate-400">{job.department} • {job.postedDate}</span>
                          </td>
                          <td className="py-4.5 px-2 font-semibold text-neutral-slate-600 uppercase">{job.workMode}</td>
                          <td className="py-4.5 px-2 font-display text-sm font-bold text-secondary">{job.applicationsCount}</td>
                          <td className="py-4.5 px-2 font-sans text-neutral-slate-500">{job.views}</td>
                          <td className="py-4.5 px-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold font-display ${
                              job.status === "published" ? "bg-emerald-50 text-emerald-700" :
                              job.status === "draft" ? "bg-amber-50 text-amber-700" : "bg-neutral-slate-100 text-neutral-slate-500"
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-4.5 px-2 text-right">
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => {
                                  // Seed fields for editing
                                  setIsNewJob(false);
                                  setEditJobId(job.id);
                                  setJobTitle(job.title);
                                  setJobDept(job.department);
                                  setJobLoc(job.location);
                                  setJobMode(job.workMode);
                                  setJobType(job.type);
                                  setJobSalary(job.salaryRange);
                                  setJobDesc(job.description);
                                  setJobReqs(job.requirements.join("\n"));
                                  setJobElig(job.eligibility || "");
                                  setJobOpenings(job.openings);
                                  setJobStatus(job.status);
                                  setActiveStep("post-job");
                                }}
                                className="text-secondary hover:text-primary p-2 border border-neutral-slate-200 rounded"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => handleDuplicateJob(job)}
                                className="text-secondary hover:text-indigo-600 p-2 border border-neutral-slate-200 rounded"
                              >
                                Duplicate
                              </button>
                              <button 
                                onClick={() => {
                                  if (confirm("Delete this vacancy posting and all related candidate submissions permanently?")) {
                                    deleteJob(job.id);
                                  }
                                }}
                                className="text-red-500 hover:bg-red-50 p-2 border border-transparent rounded"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* RECRUITER APPLICANTS DIRECTORY funnel COMPACT ATS */}
          {activeStep === "applicants" && (
            showMatrix ? (
              /* Talent Intelligence Matrix: Side-by-side compare grid */
              <div className="bg-white border border-neutral-slate-200 rounded-xl shadow-sm p-6 text-left space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b gap-4">
                  <div>
                    <h3 className="font-display font-extrabold text-secondary text-base sm:text-lg flex items-center gap-2">
                      <FileSpreadsheet className="text-secondary" size={18} />
                      Talent Intelligence Matrix
                    </h3>
                    <p className="font-sans text-[11px] text-neutral-slate-450 mt-1">
                      Widescreen side-by-side screening comparison dashboard. Sort on skill fit and ratings.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div>
                      <select 
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        className="border px-3 py-1.5 rounded-lg text-xs bg-neutral-slate-50 outline-none border-neutral-slate-200"
                      >
                        <option value="all">All openings ({companyApplicants.length})</option>
                        {companyJobs.map(j => (
                          <option key={j.id} value={j.id}>{j.title}</option>
                        ))}
                      </select>
                    </div>
                    <button 
                      onClick={() => setShowMatrix(false)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
                    >
                      <X size={12} />
                      Split Screen View
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto border border-neutral-slate-200/50 rounded-xl">
                  <table className="w-full text-left border-collapse font-sans text-xs">
                    <thead>
                      <tr className="bg-neutral-slate-50 border-b border-neutral-slate-200 text-neutral-slate-505 font-display font-bold text-[10px] uppercase">
                        <th className="p-4">Candidate dossier info</th>
                        <th className="p-4">Applied role</th>
                        <th className="p-4">Skill alignment fit</th>
                        <th className="p-4">Recruiter grading</th>
                        <th className="p-4">Candidate track</th>
                        <th className="p-4">Pipeline status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-slate-100">
                      {filteredApplicants.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-neutral-slate-400">
                            No candidate files matched the filter criteria in matrix view.
                          </td>
                        </tr>
                      ) : (
                        filteredApplicants.map(app => {
                          const matchedCand = candidates.find(c => c.id === app.candidateId);
                          const matchedJ = jobs.find(j => j.id === app.jobId);
                          const score = calculateMatchScore(matchedCand?.skills, matchedJ?.skills);
                          const rating = getRecruiterRating(app.id);

                          return (
                            <tr key={app.id} className="hover:bg-neutral-slate-50/50 transition-colors">
                              <td className="p-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-neutral-slate-200">
                                  <img src={app.candidatePhoto} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-display font-bold text-secondary truncate">{app.candidateName}</p>
                                  <p className="text-[10px] text-neutral-slate-450 truncate">{app.candidateEmail}</p>
                                </div>
                              </td>
                              <td className="p-4 font-semibold text-secondary min-w-[120px]">
                                {matchedJ?.title || "N/A"}
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-12 bg-neutral-slate-200 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${
                                        score > 80 ? "bg-emerald-500" : score > 60 ? "bg-amber-550" : "bg-cyan-500"
                                      }`}
                                      style={{ width: `${score}%` }}
                                    />
                                  </div>
                                  <span className="font-bold font-display text-secondary">{score}% Match</span>
                                </div>
                              </td>
                              <td className="p-4">
                                {rating ? (
                                  <div className="flex items-center gap-1 text-[11px]">
                                    <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />
                                    <span className="font-bold text-secondary">{rating}</span>
                                    <span className="text-neutral-slate-400">/ 5.0</span>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-neutral-slate-405 bg-neutral-100 px-2 py-0.5 rounded">Unscored</span>
                                )}
                              </td>
                              <td className="p-4">
                                <p className="font-sans font-medium text-indigo-750 bg-indigo-50/60 inline-block px-2.5 py-0.5 rounded capitalize leading-none text-[10px]">
                                  {matchedCand?.roleType || "experienced"}
                                </p>
                              </td>
                              <td className="p-4 font-bold uppercase tracking-wider text-[9px] font-display">
                                <span className={`px-2 py-0.5 rounded ${
                                  app.status === "hired" ? "text-emerald-750 bg-emerald-50" : 
                                  app.status === "rejected" ? "text-red-700 bg-red-50" : 
                                  app.status === "shortlisted" ? "text-purple-750 bg-purple-50" : "text-primary bg-teal-50/50"
                                }`}>
                                  {app.status.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => {
                                      setSelectedAppId(app.id);
                                      setShowMatrix(false);
                                    }}
                                    className="bg-neutral-slate-100 hover:bg-neutral-slate-200 text-secondary px-2.5 py-1 text-[10px] font-bold rounded cursor-pointer leading-tight transition-colors"
                                  >
                                    Review File
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setActiveStep("chats");
                                      const combined = `${app.candidateId}-${employerProfile.id}-${app.jobId}`;
                                      setActiveChatId(combined);
                                    }}
                                    className="border border-neutral-slate-200 hover:bg-neutral-slate-55 text-neutral-slate-650 p-1.5 rounded transition-all"
                                    title="Quick Chat"
                                  >
                                    <MessageSquare size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-8">
                {/* Left list panel */}
                <div className="lg:col-span-4 bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm h-fit">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-slate-100 mb-4">
                    <h3 className="font-display font-bold text-secondary text-sm sm:text-base">Funnel Applicants</h3>
                    <button 
                      onClick={() => setShowMatrix(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-slate-705 text-[10px] font-bold rounded cursor-pointer transition-colors"
                      title="Compare candidates dashboard"
                    >
                      <FileSpreadsheet size={12} className="text-secondary" />
                      Comparison Grid
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Target Opening</label>
                      <select 
                        value={selectedJobId}
                        onChange={(e) => setSelectedJobId(e.target.value)}
                        className="w-full border px-3 py-2 rounded-lg text-xs bg-neutral-slate-50 outline-none border-neutral-slate-200"
                      >
                        <option value="all">All openings ({companyApplicants.length})</option>
                        {companyJobs.map(j => (
                          <option key={j.id} value={j.id}>{j.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {filteredApplicants.length === 0 ? (
                        <p className="font-sans text-xs text-neutral-slate-450 py-6 text-center">No applicants found matching this filter.</p>
                      ) : (
                        filteredApplicants.map(app => {
                          const isChosen = selectedAppId === app.id;
                          const rating = getRecruiterRating(app.id);
                          const matchedCand = candidates.find(c => c.id === app.candidateId);
                          const matchedJ = jobs.find(j => j.id === app.jobId);
                          const matchScore = calculateMatchScore(matchedCand?.skills, matchedJ?.skills);

                          return (
                            <div 
                              key={app.id} 
                              onClick={() => setSelectedAppId(app.id)}
                              className={`p-3.5 border rounded-xl cursor-pointer text-left transition-all relative ${
                                isChosen ? "border-primary bg-teal-50/25 shadow-sm" : "border-neutral-slate-205 bg-neutral-slate-50 hover:bg-neutral-slate-100/40"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-9 h-9 rounded-full bg-neutral-slate-200 overflow-hidden shrink-0 border border-neutral-slate-200">
                                  <img src={app.candidatePhoto || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80"} alt={app.candidateName} className="w-full h-full object-cover" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-display text-xs font-bold text-secondary truncate">{app.candidateName}</p>
                                  <p className="font-sans text-[10px] text-neutral-slate-450 truncate mt-0.5">{matchedJ?.title || "Role applied"}</p>
                                  
                                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                    <span className="text-[8px] tracking-wider uppercase font-extrabold text-primary font-display px-1.5 py-0.5 rounded bg-teal-50 leading-none">
                                      {app.status.replace(/_/g, " ")}
                                    </span>
                                    <span className="font-display text-[9px] font-bold text-emerald-650 bg-emerald-50 px-1.5 py-0.5 rounded leading-none">
                                      {matchScore}% Match
                                    </span>
                                    {rating && (
                                      <span className="font-display text-[9px] font-bold text-amber-655 bg-amber-50 px-1.5 py-0.5 rounded leading-none flex items-center gap-0.5 font-semibold">
                                        ★ {rating}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Right panel candidate records analysis */}
                <div className="lg:col-span-8 bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm text-left">
                  {(() => {
                    const currApp = applications.find(a => a.id === selectedAppId);
                    if (!currApp) {
                      return (
                        <div className="text-center py-24 text-neutral-slate-450">
                          <Users className="mx-auto text-neutral-slate-250 mb-3" size={44} />
                          <h4 className="font-display font-medium text-sm text-secondary">Select Candidate dossier to Screen</h4>
                          <p className="font-sans text-xs text-neutral-slate-450 mt-1 max-w-xs mx-auto">
                            Analyze backgrounds, test scorecards, and custom-generated interview prep sheets.
                          </p>
                        </div>
                      );
                    }

                    const matchedCandidate = candidates.find(c => c.id === currApp.candidateId);
                    const matchedJob = jobs.find(j => j.id === currApp.jobId);
                    const matchScore = calculateMatchScore(matchedCandidate?.skills, matchedJob?.skills);
                    const activeRating = getRecruiterRating(currApp.id);

                    return (
                      <div className="space-y-6">
                        {/* Dossier Header Info */}
                        <div className="flex justify-between items-start border-b border-neutral-slate-150 pb-6 flex-wrap gap-4">
                          <div className="flex gap-4 items-center">
                            <div className="w-13 h-13 rounded-full overflow-hidden shrink-0 border border-neutral-200 shadow-sm">
                              <img src={currApp.candidatePhoto} alt={currApp.candidateName} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-display font-bold text-secondary text-base leading-snug">{currApp.candidateName}</h3>
                                <span className={`text-[9px] py-0.5 px-2 font-bold font-display rounded uppercase tracking-wider ${
                                  currApp.status === "hired" ? "text-emerald-700 bg-emerald-50" : 
                                  currApp.status === "rejected" ? "text-red-700 bg-red-50" : 
                                  "text-secondary bg-neutral-100"
                                }`}>
                                  {currApp.status.replace(/_/g, " ")}
                                </span>
                              </div>
                              <p className="font-sans text-xs text-indigo-650 font-semibold">{currApp.candidateEmail}</p>
                              {matchedCandidate?.location && (
                                <p className="font-sans text-[10px] text-neutral-slate-400 mt-0.5">{matchedCandidate.location}</p>
                              )}
                            </div>
                          </div>

                          {/* Recruiting actions pipeline buttons */}
                          <div className="flex flex-wrap gap-2">
                            {currApp.status === "applied" && (
                              <button 
                                onClick={() => updateApplicationStatus(currApp.id, "screening", "Candidate moved to screening portfolio review by recruiter.")}
                                className="bg-primary hover:bg-primary-hover text-white text-[11px] px-3.5 py-1.5 rounded font-display font-bold cursor-pointer transition-all shadow-sm"
                              >
                                Move to Screen
                              </button>
                            )}
                            {currApp.status === "screening" && (
                              <button 
                                onClick={() => updateApplicationStatus(currApp.id, "shortlisted", "Passed screening review successfully.")}
                                className="bg-primary hover:bg-primary-hover text-white text-[11px] px-3.5 py-1.5 rounded font-display font-bold cursor-pointer transition-all shadow-sm"
                              >
                                Shortlist Candidate
                              </button>
                            )}
                            {currApp.status === "shortlisted" && (
                              <button 
                                onClick={() => setScheduleApp(currApp)}
                                className="bg-primary hover:bg-primary-hover text-white text-[11px] px-3.5 py-1.5 rounded font-display font-bold flex items-center gap-1 cursor-pointer transition-all shadow-sm"
                              >
                                <Calendar size={12} /> Schedule Interview
                              </button>
                            )}
                            {currApp.status.includes("interview") && (
                              <button 
                                onClick={() => updateApplicationStatus(currApp.id, "offer", "Formulated corporate employment offer parameters.")}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] px-3.5 py-1.5 rounded font-display font-bold cursor-pointer transition-all shadow-sm"
                              >
                                Transition to Offer
                              </button>
                            )}
                            {currApp.status === "offer" && (
                              <button 
                                onClick={() => updateApplicationStatus(currApp.id, "hired", "Candidate completed signatures. Placed!")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] px-3.5 py-1.5 rounded font-display font-bold cursor-pointer transition-all shadow-sm"
                              >
                                Mark as Hired
                              </button>
                            )}

                            {currApp.status !== "rejected" && currApp.status !== "hired" && (
                              <button 
                                onClick={() => updateApplicationStatus(currApp.id, "rejected", "Declined by Recruiter team.")}
                                className="border border-red-200 text-red-500 hover:bg-red-50 text-[11px] px-3.5 py-1.5 rounded font-display font-bold cursor-pointer transition-colors"
                              >
                                Decline
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Interactive Dossier Nav tabs */}
                        <div className="flex border-b border-neutral-slate-200 py-1 mb-4 flex-wrap gap-1">
                          {[
                            { id: "dossier", label: "Profile Dossier", icon: User },
                            { id: "match", label: `Strategic fit (${matchScore}%)`, icon: Zap },
                            { id: "copilot", label: "Interview Copilot", icon: Sparkles },
                            { id: "scorecard", label: `ATS Scorecard ${activeRating ? `(${activeRating}★)` : ""}`, icon: Sliders }
                          ].map(t => {
                            const Icon = t.icon;
                            return (
                              <button
                                key={t.id}
                                onClick={() => setCandidateDetailTab(t.id as any)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 font-display text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                                  candidateDetailTab === t.id 
                                    ? "bg-secondary text-white border-secondary" 
                                    : "bg-transparent border-transparent text-neutral-slate-500 hover:text-secondary hover:bg-neutral-slate-100"
                                }`}
                              >
                                <Icon size={12} />
                                {t.label}
                              </button>
                            );
                          })}
                        </div>

                        {/* TAB CONTENT: DOSSIER */}
                        {candidateDetailTab === "dossier" && (
                          <div className="space-y-6">
                            {/* Short bio headline */}
                            {matchedCandidate && (
                              <div className="bg-gradient-to-r from-neutral-slate-50 to-indigo-50/15 p-4 rounded-xl border border-neutral-slate-205">
                                <p className="font-display text-[10px] font-bold text-primary uppercase tracking-wider">Dossier Headline Summary</p>
                                <p className="font-display text-sm font-semibold text-secondary mt-1">"{matchedCandidate.headline}"</p>
                                <p className="font-sans text-xs text-neutral-slate-600 mt-2 leading-relaxed">{matchedCandidate.about}</p>
                              </div>
                            )}

                            {/* Cover Letter */}
                            {currApp.coverLetter && (
                              <div>
                                <h4 className="font-display text-xs font-bold text-secondary mb-1.5">Recruiting Cover Note</h4>
                                <p className="font-sans text-xs text-neutral-slate-600 p-4 bg-yellow-50/10 border border-yellow-200/50 rounded-xl italic">
                                  "{currApp.coverLetter}"
                                </p>
                              </div>
                            )}

                            {/* Screening Q&A */}
                            {currApp.answers && currApp.answers.length > 0 && (
                              <div className="space-y-3">
                                <h4 className="font-display text-xs font-bold text-secondary border-b border-slate-100 pb-1">Screening QA Interview answers</h4>
                                <div className="space-y-2.5">
                                  {currApp.answers.map((ans, idx) => (
                                    <div key={idx} className="bg-neutral-slate-50 border p-3 rounded-lg text-xs">
                                      <p className="font-display text-xs font-bold text-secondary">{ans.question}</p>
                                      <p className="font-sans text-xs text-neutral-slate-600 mt-1 pl-3.5 border-l-2 border-indigo-500 italic">
                                        "{ans.answer}"
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Standard timeline history */}
                            {matchedCandidate && (
                              <div className="grid md:grid-cols-2 gap-6 pt-2">
                                {/* Experience Timeline */}
                                <div className="space-y-3 text-left">
                                  <h4 className="font-display text-xs font-bold text-secondary border-b pb-1 flex items-center gap-1">
                                    <Briefcase size={12} className="text-secondary" /> Work History
                                  </h4>
                                  {matchedCandidate.experience && matchedCandidate.experience.length > 0 ? (
                                    <div className="space-y-3 pl-2.5 border-l border-neutral-slate-205">
                                      {matchedCandidate.experience.map(exp => (
                                        <div key={exp.id} className="relative pl-4 space-y-0.5 animate-fade-in">
                                          <div className="absolute left-[-14px] top-1.5 w-2 h-2 rounded-full bg-secondary border border-white" />
                                          <p className="font-display text-xs font-bold text-secondary leading-normal">{exp.title}</p>
                                          <p className="font-sans text-[10px] text-primary">{exp.company} • {exp.location}</p>
                                          <p className="font-sans text-[9px] text-neutral-slate-400 mt-0.5">{exp.startDate} - {exp.endDate}</p>
                                          <p className="font-sans text-[10px] text-neutral-slate-500 mt-1 leading-snug line-clamp-3">{exp.description}</p>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="font-sans text-[11px] text-neutral-slate-400">No formal experience registered.</p>
                                  )}
                                </div>

                                {/* Education dossier history */}
                                <div className="space-y-4">
                                  <div className="space-y-3 text-left">
                                    <h4 className="font-display text-xs font-bold text-secondary border-b pb-1 flex items-center gap-1">
                                      <GraduationCap size={13} className="text-secondary" /> Credentials Academic Timeline
                                    </h4>
                                    {matchedCandidate.education && matchedCandidate.education.length > 0 ? (
                                      <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                                        {matchedCandidate.education.map(edu => (
                                          <div key={edu.id} className="bg-neutral-slate-50 p-3 rounded-lg border border-neutral-slate-200/50 text-xs">
                                            <p className="font-display text-xs font-bold text-secondary">{edu.degree} in {edu.fieldOfStudy}</p>
                                            <p className="font-sans text-[10px] text-neutral-slate-500 mt-0.5">{edu.school}</p>
                                            <div className="flex justify-between items-center mt-1">
                                              <span className="font-sans text-[9px] text-neutral-slate-400">{edu.startYear} - {edu.endYear}</span>
                                              {edu.grade && (
                                                <span className="font-sans font-bold text-[9px] text-indigo-750 bg-indigo-50/50 px-1 py-0.5 rounded animate-pulse">GPA: {edu.grade}</span>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="font-sans text-[11px] text-neutral-slate-400">No education entries registered.</p>
                                    )}
                                  </div>

                                  {/* Projects summary */}
                                  <div className="space-y-3 text-left">
                                    <h4 className="font-display text-xs font-bold text-secondary border-b pb-1 flex items-center gap-1">
                                      <FileCode size={13} className="text-secondary" /> Capstone Projects
                                    </h4>
                                    {matchedCandidate.projects && matchedCandidate.projects.length > 0 ? (
                                      <div className="space-y-2">
                                        {matchedCandidate.projects.map(proj => (
                                          <div key={proj.id} className="bg-neutral-slate-50 p-2.5 rounded-lg border border-neutral-slate-200 text-xs">
                                            <p className="font-display text-xs font-bold text-secondary leading-snug">{proj.title}</p>
                                            <p className="font-sans text-[10px] text-neutral-slate-500 mt-1 line-clamp-2 leading-relaxed">{proj.description}</p>
                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                              {proj.technologies.slice(0, 3).map((t, idx) => (
                                                <span key={idx} className="font-sans text-[8px] font-bold bg-neutral-200/30 text-neutral-600 px-1.5 py-0.5 rounded leading-none">{t}</span>
                                              ))}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="font-sans text-[11px] text-neutral-slate-400">No separate projects recorded.</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* TAB CONTENT: SKILL FIT ANALYSIS */}
                        {candidateDetailTab === "match" && (
                          <div className="space-y-6">
                            <div className="grid sm:grid-cols-3 gap-6 items-center">
                              {/* Radial Match gauge diagram */}
                              <div className="bg-neutral-slate-50 border p-5 rounded-2xl flex flex-col items-center justify-center text-center h-full border-neutral-slate-205">
                                <div className="relative w-24 h-24 flex items-center justify-center">
                                  <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="48" cy="48" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                                    <circle cx="48" cy="48" r="40" stroke="#008080" strokeWidth="8" fill="transparent" 
                                      strokeDasharray={`${2 * Math.PI * 40}`} 
                                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - matchScore/100)}`} 
                                      strokeLinecap="round"
                                      className="transition-all duration-300"
                                    />
                                  </svg>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="font-display text-xl font-black text-secondary leading-none">{matchScore}%</span>
                                    <span className="font-sans text-[8px] text-neutral-slate-400 uppercase mt-0.5 tracking-wider font-bold">Fit Index</span>
                                  </div>
                                </div>
                                <h5 className="font-display font-extrabold text-xs text-secondary mt-3">Dynamic Match Quotient</h5>
                                <p className="font-sans text-[9px] text-neutral-slate-400 mt-0.5">Calculated based on overlapping role requirements</p>
                              </div>

                              {/* Analytics checklist stats */}
                              <div className="col-span-2 space-y-3 text-left">
                                <h4 className="font-display text-xs font-bold text-secondary">Hiring Stack Alignment Checklist</h4>
                                <p className="font-sans text-xs text-neutral-slate-500 leading-snug">
                                  We matched core applicant tag arrays against our published criteria skills. Here is a summary of the alignment checklist:
                                </p>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                  <div className="border border-neutral-slate-200/55 p-3 rounded-xl bg-emerald-50/10">
                                    <p className="font-display text-[10px] font-bold text-emerald-800 flex items-center gap-1 uppercase tracking-wider">
                                      <CheckCircle2 size={12} className="text-emerald-600" /> Overlapping Skills
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {matchedJob?.skills.filter((sk: string) => matchedCandidate?.skills.some((csk: string) => csk.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(csk.toLowerCase()))).length === 0 ? (
                                        <p className="font-sans text-[10px] text-neutral-slate-450 italic">No skills overlap discovered</p>
                                      ) : (
                                        matchedJob?.skills.filter((sk: string) => matchedCandidate?.skills.some((csk: string) => csk.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(csk.toLowerCase()))).map((tag: string, idx: number) => (
                                          <span key={idx} className="font-sans text-[9px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded leading-none">{tag}</span>
                                        ))
                                      )}
                                    </div>
                                  </div>

                                  <div className="border border-neutral-slate-200/55 p-3 rounded-xl bg-amber-50/10">
                                    <p className="font-display text-[10px] font-bold text-amber-800 flex items-center gap-1 uppercase tracking-wider">
                                      <AlertCircle size={12} className="text-amber-600" /> Missing Stack Skills
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {matchedJob?.skills.filter((sk: string) => !matchedCandidate?.skills.some((csk: string) => csk.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(csk.toLowerCase()))).length === 0 ? (
                                        <p className="font-sans text-[10px] text-neutral-slate-405 italic">Fully matching skills set!</p>
                                      ) : (
                                        matchedJob?.skills.filter((sk: string) => !matchedCandidate?.skills.some((csk: string) => csk.toLowerCase().includes(sk.toLowerCase()) || sk.toLowerCase().includes(csk.toLowerCase()))).map((tag: string, idx: number) => (
                                          <span key={idx} className="font-sans text-[9px] font-bold bg-amber-50 text-amber-700 px-2 py-0.5 rounded leading-none">{tag}</span>
                                        ))
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Resume parser detail link */}
                            <div className="border border-indigo-200 bg-indigo-50/10 p-5 rounded-xl text-left space-y-2">
                              <h5 className="font-display font-bold text-xs text-secondary flex items-center gap-1.5 font-semibold">
                                <FileText size={14} className="text-indigo-650" /> Fully Indexed Attachment
                              </h5>
                              <p className="font-sans text-xs text-neutral-slate-600 leading-relaxed">
                                CareerBridge ATS technology indexer parsed this candidate file successfully on import. All education structures and tech attributes are cataloged in system search database indices.
                              </p>
                              {currApp.resumeName && (
                                <div className="flex justify-between items-center bg-white p-2.5 rounded-lg border text-xs mt-2">
                                  <span className="font-mono text-neutral-slate-600 truncate">{currApp.resumeName}</span>
                                  <a href="#" onClick={(e) => e.preventDefault()} className="text-primary font-bold hover:underline flex items-center gap-1 text-[11px] shrink-0">
                                    Download CV <Globe size={11} />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT: INTERVIEW COPILOT */}
                        {candidateDetailTab === "copilot" && (
                          <div className="space-y-6">
                            <div className="flex items-start gap-3 bg-teal-50 border border-teal-150 p-4 rounded-xl">
                              <Sparkles className="text-primary shrink-0 mt-0.5 animate-pulse" size={18} />
                              <div className="text-left">
                                <h4 className="font-display text-xs font-bold text-secondary">AI Screening Copilot</h4>
                                <p className="font-sans text-xs text-neutral-slate-650 mt-1 leading-relaxed">
                                  These screening interview questions have been custom synthesised specifically for **{currApp.candidateName}** and your **{matchedJob?.title}** opening. We compare their project dossier with your listing stack automatically.
                                </p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              {generateInterviewQuestions(matchedCandidate, matchedJob).map((q) => (
                                <div key={q.id} className="bg-white border rounded-xl overflow-hidden shadow-sm border-neutral-slate-205">
                                  <div className="bg-neutral-slate-50 p-3.5 border-b flex justify-between items-center bg-neutral-slate-50">
                                    <span className="font-display text-[10px] font-bold text-secondary uppercase tracking-wider bg-neutral-200/50 px-2.5 py-0.5 rounded">{q.topic}</span>
                                    <span className="text-[10px] font-mono text-neutral-slate-400 font-semibold">{q.id.toUpperCase()} • Screening Guide</span>
                                  </div>
                                  <div className="p-4 space-y-3 text-left">
                                    <p className="font-display text-xs font-bold text-secondary leading-snug">Q: {q.question}</p>
                                    <div className="bg-slate-50 p-3 rounded-lg border border-dashed border-neutral-slate-200 text-[11px]">
                                      <p className="font-display font-extrabold uppercase text-[9px] text-indigo-750 tracking-wider">Evaluation Rubric & Expectation Criteria</p>
                                      <p className="font-sans text-neutral-slate-550 mt-1 leading-relaxed">{q.rubric}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* TAB CONTENT: ATS SCORECARD */}
                        {candidateDetailTab === "scorecard" && (
                          <div className="space-y-6 text-left">
                            <div className="flex justify-between items-center border-b pb-2">
                              <div>
                                <h4 className="font-display text-xs font-bold text-secondary uppercase tracking-wider text-primary">Interactive Scorecard Engine</h4>
                                <p className="font-sans text-[11px] text-neutral-slate-400 mt-0.5 font-semibold">Submit dynamic evaluations to rank candidates on the matrix leaderboard</p>
                              </div>
                              <div className="bg-teal-50 border border-teal-150 px-3 py-1.5 rounded-xl text-center shadow-sm">
                                <span className="font-sans text-[9px] text-neutral-slate-400 uppercase font-black block font-sans tracking-wide">Calculated Grade</span>
                                <span className="font-display font-extrabold text-secondary text-base text-primary">
                                  {((techVal + softVal + expVal + cultureVal) / 20 / 4).toFixed(2)} / 5.0 ★
                                </span>
                              </div>
                            </div>

                            {showSavedAlert && (
                              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 animate-bounce font-sans">
                                <CheckCircle2 size={13} className="text-emerald-600" /> Recruiter Scorecard written in ATS Database! Leaders updated.
                              </div>
                            )}

                            <div className="grid sm:grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between font-display text-[11px] font-bold text-neutral-slate-700 mb-1">
                                    <span>Technical Skill Alignment</span>
                                    <span className="text-primary font-bold">{techVal} / 100</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={techVal} 
                                    onChange={(e) => setTechVal(Number(e.target.value))} 
                                    className="w-full accent-primary cursor-pointer h-1.5 bg-neutral-slate-200 rounded-lg"
                                  />
                                  <p className="font-sans text-[9px] text-neutral-slate-400 mt-0.5 text-[9px]">Overlap of matching coding concepts and tools</p>
                                </div>

                                <div>
                                  <div className="flex justify-between font-display text-[11px] font-bold text-neutral-slate-700 mb-1">
                                    <span>Soft Skills & Communication</span>
                                    <span className="text-primary font-bold">{softVal} / 100</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={softVal} 
                                    onChange={(e) => setSoftVal(Number(e.target.value))} 
                                    className="w-full accent-primary cursor-pointer h-1.5 bg-neutral-slate-200 rounded-lg"
                                  />
                                  <p className="font-sans text-[9px] text-neutral-slate-400 mt-0.5 text-[9px]">Vocabulary precision and structural responses</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <div className="flex justify-between font-display text-[11px] font-bold text-neutral-slate-700 mb-1">
                                    <span>Growth potential & Experience</span>
                                    <span className="text-primary font-bold">{expVal} / 100</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={expVal} 
                                    onChange={(e) => setExpVal(Number(e.target.value))} 
                                    className="w-full accent-primary cursor-pointer h-1.5 bg-neutral-slate-200 rounded-lg"
                                  />
                                  <p className="font-sans text-[9px] text-neutral-slate-400 mt-0.5 text-[9px]">Historical complexity of project portfolios</p>
                                </div>

                                <div>
                                  <div className="flex justify-between font-display text-[11px] font-bold text-neutral-slate-700 mb-1">
                                    <span>Cultural Affinity & Synergy</span>
                                    <span className="text-primary font-bold">{cultureVal} / 100</span>
                                  </div>
                                  <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={cultureVal} 
                                    onChange={(e) => setCultureVal(Number(e.target.value))} 
                                    className="w-full accent-primary cursor-pointer h-1.5 bg-neutral-slate-200 rounded-lg"
                                  />
                                  <p className="font-sans text-[9px] text-neutral-slate-400 mt-0.5 text-[9px]">Humility, alignment with startup velocity</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <label className="block text-xs font-display font-bold text-neutral-slate-600">Interviewer Private Comments & Feedback</label>
                              <textarea 
                                value={notesVal}
                                onChange={(e) => setNotesVal(e.target.value)}
                                rows={3}
                                placeholder="e.g. Demonstrated exceptional knowledge of distributed concurrency and race conditions during coding walkthrough. Fits requirements brilliantly."
                                className="w-full text-xs font-sans p-3 bg-neutral-slate-50 border border-neutral-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                              />
                            </div>

                            <button 
                              onClick={() => saveEvaluation(currApp.id, { techScore: techVal, softScore: softVal, expScore: expVal, cultureScore: cultureVal, notes: notesVal })}
                              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all w-full md:w-auto shadow-md flex items-center justify-center gap-1.5 cursor-pointer leading-none"
                            >
                              <CheckCircle2 size={13} /> Commit Scorecard and Sync Leaders
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            )
          )}

          {/* ACTIVE CANDIDATE RECRUITER MESSAGINGS */}
          {activeStep === "chats" && (
            <div className="bg-white border border-neutral-slate-200 rounded-xl shadow-sm overflow-hidden grid lg:grid-cols-12 min-h-[500px]">
              {/* Left threads */}
              <div className="lg:col-span-4 border-r border-neutral-slate-100 p-4 space-y-4">
                <h3 className="font-display text-xs sm:text-sm font-bold text-secondary uppercase tracking-wider border-b pb-2">
                  Recipient Candidates
                </h3>

                {chatThreads.length === 0 ? (
                  <p className="font-sans text-xs text-neutral-slate-400 py-4 text-center">No ongoing candidate chats generated.</p>
                ) : (
                  <div className="space-y-1.5">
                    {chatThreads.map(th => (
                      <div 
                        key={th.chatId} 
                        onClick={() => setActiveChatId(th.chatId)}
                        className={`p-3 rounded-lg cursor-pointer transition-all border text-left ${
                          activeChatId === th.chatId 
                            ? "bg-teal-50/20 border-primary" 
                            : "bg-neutral-slate-50 border-neutral-slate-200/50 hover:bg-neutral-slate-100"
                        }`}
                      >
                        <h4 className="font-display text-xs font-bold text-secondary truncate">{th.candidateName}</h4>
                        <p className="font-sans text-[11px] text-teal-600 font-semibold truncate mt-0.5">{th.jobTitle}</p>
                        <p className="font-sans text-[10px] text-neutral-slate-400 truncate mt-1">"{th.lastMessageText}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Chat Window */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                {activeChatId ? (
                  <>
                    {(() => {
                      const thAct = chatThreads.find(th => th.chatId === activeChatId);
                      const activeMessages = messages.filter(m => m.chatId === activeChatId);
                      return (
                        <>
                          <div className="p-4 border-b border-neutral-slate-100 flex items-center bg-neutral-slate-50 text-left">
                            <div>
                              <h4 className="font-display text-sm font-bold text-secondary">{thAct?.candidateName}</h4>
                              <p className="font-sans text-xs text-neutral-slate-500">Open application: {thAct?.jobTitle}</p>
                            </div>
                          </div>

                          <div className="p-6 flex-1 space-y-4 max-h-[350px] overflow-y-auto scrollbar-thin text-left">
                            {activeMessages.length === 0 ? (
                              <div className="text-center py-12 text-neutral-slate-400">
                                <MessageSquare className="mx-auto" size={32} />
                                <p className="font-sans text-xs mt-2">Initialize coordination by typing details...</p>
                              </div>
                            ) : (
                              activeMessages.map(msg => {
                                const isMe = msg.senderId === employerProfile.id;
                                return (
                                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-xs p-3 px-4 rounded-xl text-xs sm:text-xs text-left shadow-sm ${
                                      isMe ? "bg-primary text-white rounded-br-none" : "bg-neutral-slate-50 text-secondary border rounded-bl-none border-neutral-slate-200"
                                    }`}>
                                      <p className="font-sans leading-relaxed">{msg.content}</p>
                                      <span className={`block text-[8px] mt-1 text-right font-sans ${isMe ? "text-white/60" : "text-neutral-slate-400"}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-slate-100 bg-white flex gap-2">
                            <input 
                              value={typedMessage}
                              onChange={(e) => setTypedMessage(e.target.value)}
                              placeholder="Coordinate selection details..."
                              className="border outline-none focus:ring-1 focus:ring-primary focus:border-primary border-neutral-slate-200 text-xs px-3.5 py-2.5 rounded-lg flex-1 bg-neutral-slate-50" 
                              type="text" 
                            />
                            <button type="submit" className="bg-primary hover:bg-primary-hover text-white p-2.5 rounded-lg font-display text-sm font-bold flex items-center justify-center shrink-0 cursor-pointer">
                              <Send size={16} />
                            </button>
                          </form>
                        </>
                      );
                    })()}
                  </>
                ) : (
                  <div className="m-auto text-center py-16 text-neutral-slate-400">
                    <MessageSquare size={36} className="mx-auto text-neutral-slate-300" />
                    <p className="font-sans text-xs">Select candidate thread from pool to engage details.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* HIRING PERFORMANCE ANALYTICS */}
          {activeStep === "analytics" && (
            <div className="bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm space-y-8">
              <h3 className="font-display font-bold text-secondary text-base border-b border-neutral-slate-100 pb-3">Hiring Performance Analytics</h3>

              <div className="grid sm:grid-cols-3 gap-6 text-left">
                <div className="bg-neutral-slate-50 border p-5 rounded-lg">
                  <h4 className="font-display text-xs font-semibold text-neutral-slate-500 uppercase tracking-wider">Shortlist rate</h4>
                  <p className="font-display text-2xl font-extrabold text-secondary mt-1">
                    {companyApplicants.length > 0 ? Math.round((countShortlisted / companyApplicants.length) * 100) : 0}%
                  </p>
                  <p className="font-sans text-[10px] text-neutral-slate-400 mt-1">Ratio of pipeline moving from applied to screening</p>
                </div>
                <div className="bg-neutral-slate-50 border p-5 rounded-lg">
                  <h4 className="font-display text-xs font-semibold text-neutral-slate-500 uppercase tracking-wider">Hiring Conversion index</h4>
                  <p className="font-display text-2xl font-extrabold text-secondary mt-1">
                    {countShortlisted > 0 ? Math.round((countHired / countShortlisted) * 100) : 0}%
                  </p>
                  <p className="font-sans text-[10px] text-neutral-slate-400 mt-1">Percent of interviews resolving into placed signatures</p>
                </div>
                <div className="bg-neutral-slate-50 border p-5 rounded-lg">
                  <h4 className="font-display text-xs font-semibold text-neutral-slate-500 uppercase tracking-wider">Active Funnel Density</h4>
                  <p className="font-display text-2xl font-extrabold text-secondary mt-1">
                    {companyApplicants.filter(a => a.status !== "rejected" && a.status !== "hired").length}
                  </p>
                  <p className="font-sans text-[10px] text-neutral-slate-400 mt-1">Sum of candidate files moving through evaluation stages</p>
                </div>
              </div>

              {/* Custom styled vector bar representational chart metrics */}
              <div className="border border-neutral-slate-200/50 rounded-xl p-6 bg-neutral-slate-50/50 text-left space-y-4">
                <h4 className="font-display text-xs sm:text-xs font-bold text-secondary">Applications Volume per active Vacancy</h4>
                
                <div className="space-y-4">
                  {companyJobs.map(job => {
                    const ratio = Math.min((job.applicationsCount / 12) * 100, 100);
                    return (
                      <div key={job.id} className="space-y-1">
                        <div className="flex justify-between text-xs font-sans font-semibold text-neutral-slate-600">
                          <span>{job.title}</span>
                          <span>{job.applicationsCount} applicants</span>
                        </div>
                        <div className="w-full bg-neutral-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${ratio}%` }}
                            className="bg-primary h-full rounded-full transition-all"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CORPORATE BRAND SPECS AND ONBOARDING EDIT */}
          {activeStep === "branding" && (
            <div className="bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm">
              <h3 className="font-display font-medium text-sm sm:text-base text-secondary border-b border-neutral-slate-100 pb-3 mb-6">
                Corporate branding specs
              </h3>

              <form onSubmit={syncCorporateBranding} className="space-y-5 text-left">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Company Registered Name</label>
                    <input required value={brandName} onChange={(e) => setBrandName(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Company Logo URL Address</label>
                    <input required value={brandLogo} onChange={(e) => setBrandLogo(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Registered Corporate Website</label>
                    <input required value={brandWeb} onChange={(e) => setBrandWeb(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">HQ / General Location</label>
                    <input required value={brandLoc} onChange={(e) => setBrandLoc(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Operational Industry</label>
                    <input required value={brandIndustry} onChange={(e) => setBrandIndustry(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-neutral-slate-50 outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200" />
                  </div>
                  <div>
                    <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Corporate employee counts scale</label>
                    <select value={brandSize} onChange={(e) => setBrandSize(e.target.value)} className="w-full border px-3 py-1.5 rounded text-xs bg-neutral-slate-50 border-neutral-slate-200 outline-none focus:ring-1 focus:ring-primary">
                      <option value="1 - 10 employees">1 - 10 employees (Early Pods)</option>
                      <option value="11 - 50 employees">11 - 50 employees (Seed stage)</option>
                      <option value="51 - 200 employees">51 - 200 employees (Scale setups)</option>
                      <option value="200+ employees">200+ employees (Enterprise scale)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Branded About Description summary</label>
                  <textarea value={brandAbout} onChange={(e) => setBrandAbout(e.target.value)} rows={3} className="w-full border p-2.5 rounded text-xs bg-neutral-slate-50 border-neutral-slate-200 focus:bg-white outline-none focus:ring-1 focus:ring-primary" placeholder="State who your corporate team is and what values guide your culture..." />
                </div>

                <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded font-display text-xs font-bold transition-all cursor-pointer">
                  Update Branding Information
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* DETAILED INTERVIEW SCHEDULER DIALOG MODAL BOX */}
      {scheduleApp && (
        <div className="fixed inset-0 bg-secondary/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-display">
          <div className="bg-white border rounded-xl shadow-xl w-full max-w-md overflow-hidden text-left animate-in fade-in zoom-in-95 duration-100 border-neutral-slate-200">
            <div className="bg-secondary text-white p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xs">Calendar Event Setup</h4>
                <p className="text-[10px] text-neutral-slate-300">Scheduling for: {scheduleApp.candidateName}</p>
              </div>
              <button onClick={() => setScheduleApp(null)} className="text-white hover:opacity-85"><X size={18} /></button>
            </div>

            <form onSubmit={dispatchInterviewSchedule} className="p-6 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-slate-600 uppercase mb-1">Event Title / Round designation</label>
                <input required value={meetingTitle} onChange={(e) => setMeetingTitle(e.target.value)} type="text" className="w-full border px-3 py-2 rounded outline-none border-neutral-slate-200" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-slate-600 uppercase mb-1">Calendar Date</label>
                  <input required value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} type="date" className="w-full border px-3 py-2 rounded outline-none border-neutral-slate-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-slate-600 uppercase mb-1">Start Time</label>
                  <input required value={meetingTime} onChange={(e) => setMeetingTime(e.target.value)} type="time" className="w-full border px-3 py-2 rounded outline-none border-neutral-slate-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-slate-600 uppercase mb-1">Coordinator Host</label>
                  <input required value={meetingHost} onChange={(e) => setMeetingHost(e.target.value)} placeholder="e.g. Architectural Director" type="text" className="w-full border px-3 py-2 rounded outline-none border-neutral-slate-200" />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-neutral-slate-600 uppercase mb-1">Meeting Platform</label>
                  <select value={meetingMode} onChange={(e) => setMeetingMode(e.target.value as InterviewMode)} className="w-full border px-3 py-2 rounded outline-none border-neutral-slate-200 bg-white">
                    <option value="zoom">Zoom Video Channel</option>
                    <option value="google_meet">Google Meet</option>
                    <option value="phone">Direct Phone dial</option>
                    <option value="in-person">On-Site corporate office</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-neutral-slate-600 uppercase mb-1">Preparation notes for Candidate</label>
                <textarea value={meetingNotes} onChange={(e) => setMeetingNotes(e.target.value)} rows={2} placeholder="Explain expectations, tools, coding directories tests parameters..." className="w-full border p-2 rounded outline-none border-neutral-slate-200" />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-neutral-slate-100">
                <button type="button" onClick={() => setScheduleApp(null)} className="border border-neutral-slate-300 px-4 py-1.5 rounded text-xs font-semibold cursor-pointer">Cancel</button>
                <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-5 py-1.5 rounded text-xs font-semibold cursor-pointer">Post Calendar Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
