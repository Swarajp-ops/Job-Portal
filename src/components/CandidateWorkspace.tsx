import React, { useState } from "react";
import { useJobPortal } from "./JobPortalContext";
import { 
  CandidateProfile, JobApplication, JobPost, 
  Education, Experience, Project, PortfolioLink, InterviewSchedule, CandidateRoleType 
} from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, Briefcase, GraduationCap, Link2, Award, FileSpreadsheet, 
  CheckCircle2, AlertCircle, Clock, Calendar, Check, X, Edit, Plus, Trash2, 
  ExternalLink, Mail, MessageSquare, Phone, MapPin, Sparkles, UploadCloud, ChevronRight, UserCircle, Send 
} from "lucide-react";
import { CAREER_RESOURCES } from "../data";

export const CandidateWorkspace: React.FC = () => {
  const { 
    currentUser, 
    candidateProfile, 
    updateCandidateProfile, 
    applications, 
    jobs,
    companies,
    bookmarkedJobs,
    toggleBookmark,
    interviews,
    getChatThreads,
    messages,
    sendChatMessage,
    simulateResumeParse
  } = useJobPortal();

  // Active view: "dashboard" | "profile" | "applications" | "interviews" | "messages" | "onboarding"
  const [activeStep, setActiveStep] = useState<"dashboard" | "profile" | "applications" | "interviews" | "messages">("dashboard");

  // Profile Edit Modal / Form states
  const [isEditingHeader, setIsEditingHeader] = useState(false);
  const [editFullName, setEditFullName] = useState(candidateProfile?.fullName || "");
  const [editHeadline, setEditHeadline] = useState(candidateProfile?.headline || "");
  const [editLocation, setEditLocation] = useState(candidateProfile?.location || "");
  const [editAbout, setEditAbout] = useState(candidateProfile?.about || "");
  const [editPhone, setEditPhone] = useState(candidateProfile?.phone || "");
  const [editRoleType, setEditRoleType] = useState(candidateProfile?.roleType || "experienced");

  // Education Editor
  const [showEduForm, setShowEduForm] = useState(false);
  const [eduSchool, setEduSchool] = useState("");
  const [eduDegree, setEduDegree] = useState("");
  const [eduField, setEduField] = useState("");
  const [eduStart, setEduStart] = useState("2022");
  const [eduEnd, setEduEnd] = useState("2026");
  const [eduGrade, setEduGrade] = useState("");

  // Experience Editor
  const [showExpForm, setShowExpForm] = useState(false);
  const [expCompany, setExpCompany] = useState("");
  const [expTitle, setExpTitle] = useState("");
  const [expLoc, setExpLoc] = useState("");
  const [expStart, setExpStart] = useState("2024-01");
  const [expEnd, setExpEnd] = useState("Present");
  const [expCurrent, setExpCurrent] = useState(true);
  const [expDesc, setExpDesc] = useState("");

  // Project Editor
  const [showProjForm, setShowProjForm] = useState(false);
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projSecTechs, setProjSecTechs] = useState("");
  const [projLink, setProjLink] = useState("");

  // Skills input state
  const [newSkillText, setNewSkillText] = useState("");
  // Cert input state
  const [newCertText, setNewCertText] = useState("");

  // States for Editing existing Individual Records (Education, Experience, Projects)
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [editEduSchool, setEditEduSchool] = useState("");
  const [editEduDegree, setEditEduDegree] = useState("");
  const [editEduField, setEditEduField] = useState("");
  const [editEduStart, setEditEduStart] = useState("");
  const [editEduEnd, setEditEduEnd] = useState("");
  const [editEduGrade, setEditEduGrade] = useState("");

  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [editExpCompany, setEditExpCompany] = useState("");
  const [editExpTitle, setEditExpTitle] = useState("");
  const [editExpLoc, setEditExpLoc] = useState("");
  const [editExpStart, setEditExpStart] = useState("");
  const [editExpEnd, setEditExpEnd] = useState("");
  const [editExpCurrent, setEditExpCurrent] = useState(false);
  const [editExpDesc, setEditExpDesc] = useState("");

  const [editingProjId, setEditingProjId] = useState<string | null>(null);
  const [editProjTitle, setEditProjTitle] = useState("");
  const [editProjDesc, setEditProjDesc] = useState("");
  const [editProjSecTechs, setEditProjSecTechs] = useState("");
  const [editProjLink, setEditProjLink] = useState("");

  // Resume Parsing Drag Drop State
  const [dragActive, setDragActive] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsingDone, setParsingDone] = useState(false);
  const [parsedName, setParsedName] = useState("");

  // Active Application Tracker
  const [trackedAppId, setTrackedAppId] = useState<string | null>(null);

  // Chat window state
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [typedMessage, setTypedMessage] = useState("");

  if (!candidateProfile) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-lg text-center">
        <UserCircle size={48} className="text-primary mx-auto mb-4" />
        <h3 className="font-display text-lg font-bold text-secondary">Initiate Candidate Profile Setup</h3>
        <p className="font-sans text-xs text-neutral-slate-500 mt-1 mb-6">
          Establish your credentials and experience parameters to begin discovering certified corporate listings.
        </p>
        <button 
          onClick={() => {
            // Trigger profile generation with seed details
            updateCandidateProfile({
              fullName: currentUser?.email.split("@")[0].toUpperCase() || "Candidate FullName"
            });
          }}
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-display text-xs font-semibold w-full transition-all"
        >
          Initialize Account Workspace
        </button>
      </div>
    );
  }

  // Handle Drag / Drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await handleFileParsing(file.name);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await handleFileParsing(file.name);
    }
  };

  const handleFileParsing = async (fileName: string) => {
    setIsParsing(true);
    setParsingDone(false);
    setParsedName(fileName);
    
    try {
      const results = await simulateResumeParse(fileName);
      setIsParsing(false);
      setParsingDone(true);
      
      // Update state with parsed elements
      updateCandidateProfile({
        resumeName: fileName,
        resumeUrl: `uploads/${fileName}`,
        skills: [...new Set([...candidateProfile.skills, ...results.skills])],
        headline: results.headline,
        about: results.experience
      });

      // Show success notice for 3 seconds
      setTimeout(() => setParsingDone(false), 3000);
    } catch {
      setIsParsing(false);
    }
  };

  const syncHeaderChanges = (e: React.FormEvent) => {
    e.preventDefault();
    updateCandidateProfile({
      fullName: editFullName,
      headline: editHeadline,
      location: editLocation,
      about: editAbout,
      phone: editPhone,
      roleType: editRoleType
    });
    setIsEditingHeader(false);
  };

  const triggerAddEducation = (e: React.FormEvent) => {
    e.preventDefault();
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      school: eduSchool,
      degree: eduDegree,
      fieldOfStudy: eduField,
      startYear: eduStart,
      endYear: eduEnd,
      grade: eduGrade
    };
    updateCandidateProfile({
      education: [...candidateProfile.education, newEdu]
    });
    setShowEduForm(false);
    // Reset Form
    setEduSchool("");
    setEduDegree("");
    setEduField("");
    setEduGrade("");
  };

  const triggerAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: expCompany,
      title: expTitle,
      location: expLoc,
      startDate: expStart,
      endDate: expCurrent ? "Present" : expEnd,
      current: expCurrent,
      description: expDesc
    };
    updateCandidateProfile({
      experience: [...candidateProfile.experience, newExp]
    });
    setShowExpForm(false);
    // Reset Form
    setExpCompany("");
    setExpTitle("");
    setExpLoc("");
    setExpDesc("");
  };

  const triggerAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: projTitle,
      description: projDesc,
      technologies: projSecTechs.split(",").map(s => s.trim()).filter(Boolean),
      link: projLink
    };
    updateCandidateProfile({
      projects: [...candidateProfile.projects, newProj]
    });
    setShowProjForm(false);
    setProjTitle("");
    setProjDesc("");
    setProjSecTechs("");
    setProjLink("");
  };

  const triggerUpdateEducation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEduId) return;
    const updated = candidateProfile.education.map(edu => {
      if (edu.id === editingEduId) {
        return {
          ...edu,
          school: editEduSchool,
          degree: editEduDegree,
          fieldOfStudy: editEduField,
          startYear: editEduStart,
          endYear: editEduEnd,
          grade: editEduGrade
        };
      }
      return edu;
    });
    updateCandidateProfile({ education: updated });
    setEditingEduId(null);
  };

  const triggerUpdateExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExpId) return;
    const updated = candidateProfile.experience.map(exp => {
      if (exp.id === editingExpId) {
        return {
          ...exp,
          company: editExpCompany,
          title: editExpTitle,
          location: editExpLoc,
          startDate: editExpStart,
          endDate: editExpCurrent ? "Present" : editExpEnd,
          current: editExpCurrent,
          description: editExpDesc
        };
      }
      return exp;
    });
    updateCandidateProfile({ experience: updated });
    setEditingExpId(null);
  };

  const triggerUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProjId) return;
    const updated = candidateProfile.projects.map(proj => {
      if (proj.id === editingProjId) {
        return {
          ...proj,
          title: editProjTitle,
          description: editProjDesc,
          technologies: editProjSecTechs.split(",").map(s => s.trim()).filter(Boolean),
          link: editProjLink
        };
      }
      return proj;
    });
    updateCandidateProfile({ projects: updated });
    setEditingProjId(null);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const s = newSkillText.trim();
    if (s && !candidateProfile.skills.includes(s)) {
      updateCandidateProfile({
        skills: [...candidateProfile.skills, s]
      });
      setNewSkillText("");
    }
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    const cert = newCertText.trim();
    if (cert && !candidateProfile.certifications.includes(cert)) {
      updateCandidateProfile({
        certifications: [...candidateProfile.certifications, cert]
      });
      setNewCertText("");
    }
  };

  const removeItem = <T extends { id: string }>(list: T[], itemId: string, key: "education" | "experience" | "projects") => {
    updateCandidateProfile({
      [key]: list.filter(item => item.id !== itemId)
    });
  };

  const candidateApplieds = applications.filter(app => app.candidateId === candidateProfile.id);
  const bookmarkListings = jobs.filter(j => bookmarkedJobs.includes(j.id) && j.status === "published");
  const chatThreadsList = getChatThreads();

  const handleChatTrigger = (threadId: string) => {
    setActiveChatId(threadId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatId || !typedMessage.trim()) return;

    const currentThread = chatThreadsList.find(th => th.chatId === activeChatId);
    if (!currentThread) return;

    sendChatMessage(
      activeChatId,
      candidateProfile.id,
      candidateProfile.fullName,
      "candidate",
      typedMessage.trim()
    );
    setTypedMessage("");
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8">
      {/* Candidate Navigation Header */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-neutral-slate-200 pb-4">
        {[
          { key: "dashboard", label: "My Hub" },
          { key: "profile", label: "My Credentials" },
          { key: "applications", label: "Applications Tracker" },
          { key: "interviews", label: "Schedules calendar" },
          { key: "messages", label: "Recruiter chats" }
        ].map(st => (
          <button
            key={st.key}
            onClick={() => {
              setActiveStep(st.key as any);
              setTrackedAppId(null);
            }}
            className={`px-5 py-2 hover:bg-neutral-slate-50 transition-all font-display text-xs sm:text-sm font-semibold rounded-lg ${
              activeStep === st.key 
                ? "bg-primary text-white hover:bg-primary-hover" 
                : "text-neutral-slate-600 hover:text-secondary"
            }`}
          >
            {st.label}
          </button>
        ))}
      </div>

      {/* RENDER ACTIVE STEP */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="w-full"
        >
          {/* DASHBOARD SUMMARY VIEW */}
          {activeStep === "dashboard" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column stats & notices */}
              <div className="lg:col-span-2 space-y-8">
                {/* Profile Completion Card */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div>
                      <h3 className="font-display font-bold text-secondary text-base">Profile Completeness Rate</h3>
                      <p className="font-sans text-xs text-neutral-slate-500 mt-0.5">
                        Completed credentials raise placement chances on Google matching filters.
                      </p>
                    </div>
                    <span className="font-display text-lg font-extrabold text-primary">{candidateProfile.profileCompletion}%</span>
                  </div>

                  <div className="w-full bg-neutral-slate-100 h-2 rounded-full overflow-hidden mb-5">
                    <div 
                      style={{ width: `${candidateProfile.profileCompletion}%` }} 
                      className="bg-primary h-full transition-all duration-500"
                    />
                  </div>

                  {candidateProfile.profileCompletion < 80 && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={16} />
                      <div>
                        <p className="font-display text-xs font-bold text-amber-800">Add Experiences to unlock Spark AI audits!</p>
                        <p className="font-sans text-[11px] text-amber-700 mt-0.5 leading-snug">
                          Your profile currently misses verified experience blocks. Completing your profile credentials unlocks a 4x recruiter view coefficient.
                        </p>
                        <button 
                          onClick={() => setActiveStep("profile")} 
                          className="text-primary hover:underline font-display text-[11px] font-bold mt-2"
                        >
                          Complete Credentials Now
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Stat Grid Widgets */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Submitted applications", val: candidateApplieds.length },
                    { label: "Saved jobs list", val: bookmarkListings.length },
                    { label: "Active interviews", val: interviews.filter(i => i.candidateId === candidateProfile.id).length },
                    { label: "Unread chats", val: messages.filter(
  m => m.senderRole === "employer" && m.chatId.includes(candidateProfile.id)
).length }
                  ].map((stat, sIdx) => (
                    <div key={sIdx} className="bg-white border border-neutral-slate-200 p-5 rounded-xl shadow-sm text-center">
                      <p className="font-display text-2xl font-extrabold text-secondary">{stat.val}</p>
                      <p className="font-sans text-[11px] text-neutral-slate-500 mt-1 uppercase tracking-tight">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Short view of Submitted applications */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <h3 className="font-display font-medium text-sm sm:text-base text-secondary border-b border-neutral-slate-100 pb-3 mb-4">
                    Active Application tracking
                  </h3>
                  
                  {candidateApplieds.length === 0 ? (
                    <div className="text-center py-8">
                      <Briefcase className="text-neutral-slate-300 mx-auto mb-2" size={32} />
                      <p className="font-sans text-xs text-neutral-slate-500">You haven't applied to any job openings yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {candidateApplieds.slice(0, 3).map(app => {
                        const j = jobs.find(job => job.id === app.jobId);
                        return (
                          <div 
                            key={app.id} 
                            onClick={() => {
                              setSelectedApp(app.id);
                            }}
                            className="flex justify-between items-center bg-neutral-slate-50 p-4 border border-neutral-slate-200/50 rounded-lg hover:border-primary/20 cursor-pointer"
                          >
                            <div>
                              <p className="font-display text-xs font-bold text-secondary">{j?.title || "Role"}</p>
                              <p className="font-sans text-[11px] text-neutral-slate-500 mt-0.5">{j?.companyName || "Employer"} • Applied: {app.appliedDate}</p>
                            </div>
                            <span className={`px-2.5 py-1 text-[10px] uppercase font-bold font-display rounded-full ${
                              app.status === "hired" ? "bg-emerald-50 text-emerald-700" :
                              app.status === "rejected" ? "bg-slate-100 text-slate-500" :
                              app.status === "offer" ? "bg-pink-50 text-pink-700" : "bg-teal-50 text-primary"
                            }`}>
                              {app.status.replace(/_/g, " ")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column Saved opportunities & Learning suggestions */}
              <div className="space-y-8">
                {/* Bookmarks Section widget */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm text-left">
                  <h3 className="font-display font-medium text-sm sm:text-base text-secondary border-b border-neutral-slate-100 pb-3 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">bookmark</span> Saved Offerings
                  </h3>
                  
                  {bookmarkListings.length === 0 ? (
                    <div className="text-center py-6 text-neutral-slate-400">
                      <p className="font-sans text-xs">No saved jobs yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookmarkListings.map(bk => (
                        <div key={bk.id} className="flex justify-between items-center bg-neutral-slate-50 p-3 rounded border border-neutral-slate-200/40">
                          <div className="truncate pr-2">
                            <p className="font-display text-xs font-bold text-secondary truncate">{bk.title}</p>
                            <p className="font-sans text-[10px] text-neutral-slate-400 truncate">{bk.companyName}</p>
                          </div>
                          
                          <button 
                            onClick={() => toggleBookmark(bk.id)}
                            className="bg-transparent text-red-500 p-1.5 hover:bg-neutral-slate-100 rounded text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customized learning matches recommendations */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <h3 className="font-display font-medium text-sm sm:text-base text-secondary border-b border-neutral-slate-100 pb-3 mb-4 flex items-center gap-1.5">
                    <Sparkles size={16} className="text-primary" /> Personalized Matches
                  </h3>

                  <div className="space-y-3.5">
                    {CAREER_RESOURCES.slice(0, 2).map((ca, idx) => (
                      <div key={idx} className="bg-teal-50/20 border border-teal-100/50 p-4 rounded-lg">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-primary font-display">Targeted Resource</span>
                        <h4 className="font-display text-xs font-bold text-secondary mt-1">{ca.title}</h4>
                        <p className="font-sans text-[10px] text-neutral-slate-500 mt-1 line-clamp-2">{ca.about}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CREDENTIALS SECTION */}
          {activeStep === "profile" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Form: Personal Bio Headers */}
              <div className="lg:col-span-2 space-y-8">
                {/* Header overview Card */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm relative">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-display font-bold text-secondary text-base">Candidate Profile overview</h3>
                    <button 
                      onClick={() => {
                        setEditFullName(candidateProfile.fullName);
                        setEditHeadline(candidateProfile.headline);
                        setEditLocation(candidateProfile.location);
                        setEditAbout(candidateProfile.about);
                        setEditPhone(candidateProfile.phone || "");
                        setEditRoleType(candidateProfile.roleType);
                        setIsEditingHeader(!isEditingHeader);
                      }}
                      className="text-primary hover:text-primary-hover flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                    >
                      <Edit size={14} /> {isEditingHeader ? "Cancel" : "Edit Bio"}
                    </button>
                  </div>

                  {isEditingHeader ? (
                    <form onSubmit={syncHeaderChanges} className="space-y-4 bg-neutral-slate-50 p-4 rounded-lg border border-neutral-slate-200/50">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Full Name</label>
                          <input 
                            required
                            type="text" 
                            value={editFullName}
                            onChange={(e) => setEditFullName(e.target.value)}
                            className="w-full border border-neutral-slate-200 px-3 py-1.5 rounded text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Headline Accent</label>
                          <input 
                            required
                            type="text" 
                            value={editHeadline}
                            onChange={(e) => setEditHeadline(e.target.value)}
                            className="w-full border border-neutral-slate-200 px-3 py-1.5 rounded text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Location Details</label>
                          <input 
                            required
                            type="text" 
                            value={editLocation}
                            onChange={(e) => setEditLocation(e.target.value)}
                            className="w-full border border-neutral-slate-200 px-3 py-1.5 rounded text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Contact Phone</label>
                          <input 
                            type="text" 
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                            className="w-full border border-neutral-slate-200 px-3 py-1.5 rounded text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Expertise Tier Selection</label>
                          <select 
                            value={editRoleType}
                            onChange={(e) => setEditRoleType(e.target.value as CandidateRoleType)}
                            className="border border-neutral-slate-200 px-3 py-1.5 rounded text-xs focus:ring-1 focus:ring-primary bg-white outline-none"
                          >
                            <option value="student">Student / Academic</option>
                            <option value="fresher">Fresher (Looking for Entry listings)</option>
                            <option value="experienced">Experienced professional</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Professional About Summary</label>
                        <textarea 
                          rows={3}
                          value={editAbout}
                          onChange={(e) => setEditAbout(e.target.value)}
                          className="w-full border border-neutral-slate-200 p-2.5 rounded text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary bg-white"
                        />
                      </div>
                      <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded font-display text-xs font-bold">
                        Save Changes
                      </button>
                    </form>
                  ) : (
                    <div className="flex gap-4.5 items-start">
                      <div className="w-14 h-14 rounded-full bg-neutral-slate-100 overflow-hidden shrink-0 border border-neutral-slate-200">
                        <img src={candidateProfile.photo} alt={candidateProfile.fullName} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-display font-bold text-secondary text-base">{candidateProfile.fullName}</h4>
                        <p className="font-sans text-xs text-primary font-bold">{candidateProfile.headline}</p>
                        <p className="font-sans text-[11px] text-neutral-slate-400 flex items-center gap-1">
                          <MapPin size={12} /> {candidateProfile.location} • <Mail size={12} /> {candidateProfile.email}
                        </p>
                        <p className="font-sans text-xs text-neutral-slate-600 pt-2 leading-relaxed italic border-t border-neutral-slate-100">
                          "{candidateProfile.about || "State something elegant representing your target careers..."}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* WORK EXPERIENCES LISTING */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-slate-100 mb-4">
                    <h3 className="font-display font-bold text-secondary text-sm sm:text-base flex items-center gap-2">
                      <Briefcase size={16} className="text-neutral-slate-500" /> Work Experience History
                    </h3>
                    <button 
                      onClick={() => setShowExpForm(!showExpForm)}
                      className="text-primary hover:text-primary-hover flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <Plus size={14} className="mt-0.5" /> Add Job
                    </button>
                  </div>

                  {showExpForm && (
                    <form onSubmit={triggerAddExperience} className="mb-6 bg-neutral-slate-50 p-4 rounded-lg border border-neutral-slate-200/55 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Company Name</label>
                          <input required value={expCompany} onChange={(e) => setExpCompany(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Title Designation</label>
                          <input required value={expTitle} onChange={(e) => setExpTitle(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Job Location</label>
                          <input required value={expLoc} onChange={(e) => setExpLoc(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Start Date</label>
                          <input required value={expStart} onChange={(e) => setExpStart(e.target.value)} type="month" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-xs font-semibold text-neutral-slate-600 cursor-pointer mb-1 pt-1">
                            <input type="checkbox" checked={expCurrent} onChange={(e) => setExpCurrent(e.target.checked)} className="text-primary rounded" />
                            Still Active currently
                          </label>
                          {!expCurrent && (
                            <input value={expEnd} onChange={(e) => setExpEnd(e.target.value)} type="month" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none mt-1" />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Responsibilities / Scope achievements</label>
                        <textarea required value={expDesc} onChange={(e) => setExpDesc(e.target.value)} rows={3} className="w-full border p-2 rounded text-xs bg-white outline-none" />
                      </div>
                      <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded font-display text-xs font-bold cursor-pointer">
                        Add to Profile
                      </button>
                    </form>
                  )}

                  {candidateProfile.experience.length === 0 ? (
                    <p className="font-sans text-xs text-neutral-slate-400 text-center py-4">No work experience histories added. Add jobs to increase candidate score!</p>
                  ) : (
                    <div className="space-y-5">
                      {candidateProfile.experience.map(exp => (
                        <div key={exp.id} className="relative group border-l-2 border-neutral-slate-100 pl-4 pb-2">
                          {editingExpId === exp.id ? (
                            <form onSubmit={triggerUpdateExperience} className="mt-2 space-y-3 bg-neutral-slate-50 p-3.5 rounded-lg border border-neutral-slate-200/50">
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Company Name</label>
                                  <input required value={editExpCompany} onChange={(e) => setEditExpCompany(e.target.value)} type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Title Designation</label>
                                  <input required value={editExpTitle} onChange={(e) => setEditExpTitle(e.target.value)} type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Job Location</label>
                                  <input required value={editExpLoc} onChange={(e) => setEditExpLoc(e.target.value)} type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Start Date</label>
                                  <input required value={editExpStart} onChange={(e) => setEditExpStart(e.target.value)} type="month" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                                <div className="sm:col-span-2">
                                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-slate-600 cursor-pointer mb-1 pt-1">
                                    <input type="checkbox" checked={editExpCurrent} onChange={(e) => setEditExpCurrent(e.target.checked)} className="text-primary rounded" />
                                    Still Active currently
                                  </label>
                                  {!editExpCurrent && (
                                    <input required value={editExpEnd === "Present" ? "" : editExpEnd} onChange={(e) => setEditExpEnd(e.target.value)} type="month" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none mt-1" />
                                  )}
                                </div>
                              </div>
                              <div>
                                <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Responsibilities / Scope achievements</label>
                                <textarea required value={editExpDesc} onChange={(e) => setEditExpDesc(e.target.value)} rows={3} className="w-full border p-2 rounded text-xs bg-white outline-none" />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <button type="button" onClick={() => setEditingExpId(null)} className="border px-3 py-1 rounded text-xs text-neutral-slate-600 hover:bg-neutral-slate-100 font-sans font-medium">
                                  Cancel
                                </button>
                                <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-3.5 py-1 rounded text-xs font-sans font-semibold">
                                  Save Change
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-all">
                                <button 
                                  onClick={() => {
                                    setEditingExpId(exp.id);
                                    setEditExpCompany(exp.company);
                                    setEditExpTitle(exp.title);
                                    setEditExpLoc(exp.location);
                                    setEditExpStart(exp.startDate);
                                    setEditExpEnd(exp.endDate);
                                    setEditExpCurrent(exp.endDate === "Present" || exp.current === true);
                                    setEditExpDesc(exp.description);
                                  }}
                                  className="text-primary hover:bg-neutral-slate-50 p-1.5 rounded transition-all bg-white border border-neutral-slate-105 shadow-xs"
                                >
                                  <Edit size={13} />
                                </button>
                                <button 
                                  onClick={() => removeItem(candidateProfile.experience, exp.id, "experience")}
                                  className="text-red-500 hover:bg-neutral-slate-50 p-1.5 rounded transition-all bg-white border border-neutral-slate-105 shadow-xs"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                              
                              <h4 className="font-display font-bold text-secondary text-sm">{exp.title}</h4>
                              <p className="font-sans text-xs text-indigo-600 font-semibold">{exp.company} • {exp.location}</p>
                              <p className="font-sans text-[10px] text-neutral-slate-400 mt-0.5">{exp.startDate} - {exp.endDate}</p>
                              <p className="font-sans text-xs text-neutral-slate-600 mt-2 leading-relaxed">
                                {exp.description}
                              </p>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* EDUCATION SECTIONS */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-slate-100 mb-4">
                    <h3 className="font-display font-bold text-secondary text-sm sm:text-base flex items-center gap-2">
                      <GraduationCap size={16} className="text-neutral-slate-500" /> Education Background
                    </h3>
                    <button 
                      onClick={() => setShowEduForm(!showEduForm)}
                      className="text-primary hover:text-primary-hover flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <Plus size={14} /> Add Degree
                    </button>
                  </div>

                  {showEduForm && (
                    <form onSubmit={triggerAddEducation} className="mb-6 bg-neutral-slate-50 p-4 rounded-lg border border-neutral-slate-200/55 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">School / University</label>
                          <input required value={eduSchool} onChange={(e) => setEduSchool(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none animate-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Degree Title</label>
                          <input required value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Field of Study</label>
                          <input required value={eduField} onChange={(e) => setEduField(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Grade / GPA Details</label>
                          <input value={eduGrade} onChange={(e) => setEduGrade(e.target.value)} placeholder="e.g. 3.9 GPA" type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Start Year</label>
                          <input required value={eduStart} onChange={(e) => setEduStart(e.target.value)} maxLength={4} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">End Year (Graduation)</label>
                          <input required value={eduEnd} onChange={(e) => setEduEnd(e.target.value)} maxLength={4} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                      </div>
                      <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded font-display text-xs font-bold cursor-pointer">
                        Add Academic Degree
                      </button>
                    </form>
                  )}

                  {candidateProfile.education.length === 0 ? (
                    <p className="font-sans text-xs text-neutral-slate-400 text-center py-4">No educational history declared yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {candidateProfile.education.map(edu => (
                        <div key={edu.id} className="relative group bg-neutral-slate-50 p-4 border border-neutral-slate-200/50 rounded-lg">
                          {editingEduId === edu.id ? (
                            <form onSubmit={triggerUpdateEducation} className="space-y-3">
                              <div className="grid sm:grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">School / University</label>
                                  <input required value={editEduSchool} onChange={(e) => setEditEduSchool(e.target.value)} type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Degree Title</label>
                                  <input required value={editEduDegree} onChange={(e) => setEditEduDegree(e.target.value)} type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Field of Study</label>
                                  <input required value={editEduField} onChange={(e) => setEditEduField(e.target.value)} type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Grade / GPA Details</label>
                                  <input value={editEduGrade} onChange={(e) => setEditEduGrade(e.target.value)} placeholder="e.g. 3.9 GPA" type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Start Year</label>
                                  <input required value={editEduStart} onChange={(e) => setEditEduStart(e.target.value)} maxLength={4} type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">End Year (Graduation)</label>
                                  <input required value={editEduEnd} onChange={(e) => setEditEduEnd(e.target.value)} maxLength={4} type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setEditingEduId(null)} className="border px-3 py-1 rounded text-xs text-neutral-slate-600 hover:bg-neutral-slate-100 font-sans font-medium bg-white">
                                  Cancel
                                </button>
                                <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-3.5 py-1 rounded text-xs font-sans font-semibold">
                                  Save Change
                                </button>
                              </div>
                            </form>
                          ) : (
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-display font-bold text-secondary text-xs sm:text-sm">{edu.degree} inside {edu.fieldOfStudy}</h4>
                                <p className="font-sans text-xs text-neutral-slate-500 font-semibold">{edu.school}</p>
                                <p className="font-sans text-[10px] text-neutral-slate-400 mt-0.5">Years: {edu.startYear} - {edu.endYear}</p>
                                {edu.grade && (
                                  <span className="inline-block px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-indigo-700 font-sans text-[10px] font-bold mt-1.5">
                                    {edu.grade}
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all shrink-0 ml-4">
                                <button 
                                  onClick={() => {
                                    setEditingEduId(edu.id);
                                    setEditEduSchool(edu.school);
                                    setEditEduDegree(edu.degree);
                                    setEditEduField(edu.fieldOfStudy);
                                    setEditEduStart(edu.startYear);
                                    setEditEduEnd(edu.endYear);
                                    setEditEduGrade(edu.grade || "");
                                  }}
                                  className="text-primary hover:bg-white p-1.5 rounded border border-neutral-slate-200 bg-white shadow-xs"
                                  title="Edit Education"
                                >
                                  <Edit size={13} />
                                </button>
                                <button 
                                  onClick={() => removeItem(candidateProfile.education, edu.id, "education")}
                                  className="text-red-500 hover:bg-white p-1.5 rounded border border-neutral-slate-200 bg-white shadow-xs"
                                  title="Delete Education"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PROJECTS LISTING */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center pb-3 border-b border-neutral-slate-100 mb-4">
                    <h3 className="font-display font-bold text-secondary text-sm sm:text-base flex items-center gap-2">
                       Personal Ventures & Projects
                    </h3>
                    <button 
                      onClick={() => setShowProjForm(!showProjForm)}
                      className="text-primary hover:text-primary-hover flex items-center gap-1 text-xs font-bold cursor-pointer"
                    >
                      <Plus size={14} /> Add Project
                    </button>
                  </div>

                  {showProjForm && (
                    <form onSubmit={triggerAddProject} className="mb-6 bg-neutral-slate-50 p-4 rounded-lg border border-neutral-slate-200/55 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Project Title</label>
                          <input required value={projTitle} onChange={(e) => setProjTitle(e.target.value)} type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Github / Live Link</label>
                          <input value={projLink} onChange={(e) => setProjLink(e.target.value)} placeholder="https://github.com/..." type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Technologies (Comma separated)</label>
                          <input required value={projSecTechs} onChange={(e) => setProjSecTechs(e.target.value)} placeholder="React, Go, CSS" type="text" className="w-full border px-3 py-1.5 rounded text-xs bg-white outline-none" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Brief Description of Project scope</label>
                        <textarea required value={projDesc} onChange={(e) => setProjDesc(e.target.value)} rows={2} className="w-full border p-2 rounded text-xs bg-white outline-none" />
                      </div>
                      <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-4 py-1.5 rounded font-display text-xs font-semibold cursor-pointer">
                        Add Project
                      </button>
                    </form>
                  )}

                  {candidateProfile.projects.length === 0 ? (
                    <p className="font-sans text-xs text-neutral-slate-400 text-center py-4">No project credentials listed yet.</p>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-4">
                      {candidateProfile.projects.map(p => (
                        <div key={p.id} className="relative group bg-neutral-slate-50 p-4 border border-neutral-slate-200/50 rounded-lg flex flex-col justify-between">
                          {editingProjId === p.id ? (
                            <form onSubmit={triggerUpdateProject} className="space-y-3 w-full text-left">
                              <div>
                                <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Project Title</label>
                                <input required value={editProjTitle} onChange={(e) => setEditProjTitle(e.target.value)} type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Github / Live Link</label>
                                <input value={editProjLink} onChange={(e) => setEditProjLink(e.target.value)} placeholder="https://github.com/..." type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Technologies (Comma separated)</label>
                                <input required value={editProjSecTechs} onChange={(e) => setEditProjSecTechs(e.target.value)} placeholder="React, Go, CSS" type="text" className="w-full border px-2 py-1 rounded text-xs bg-white outline-none" />
                              </div>
                              <div>
                                <label className="block text-[10px] font-display font-semibold text-neutral-slate-600 mb-0.5">Brief Description of Project scope</label>
                                <textarea required value={editProjDesc} onChange={(e) => setEditProjDesc(e.target.value)} rows={2} className="w-full border p-2 rounded text-xs bg-white outline-none" />
                              </div>
                              <div className="flex gap-2 justify-end pt-1">
                                <button type="button" onClick={() => setEditingProjId(null)} className="border px-3 py-1 rounded text-xs text-neutral-slate-600 hover:bg-neutral-slate-100 font-sans font-medium bg-white">
                                  Cancel
                                </button>
                                <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-3.5 py-1 rounded text-xs font-sans font-semibold">
                                  Save Change
                                </button>
                              </div>
                            </form>
                          ) : (
                            <>
                              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 flex items-center gap-1.5 transition-all">
                                <button 
                                  onClick={() => {
                                    setEditingProjId(p.id);
                                    setEditProjTitle(p.title);
                                    setEditProjDesc(p.description);
                                    setEditProjSecTechs(p.technologies.join(", "));
                                    setEditProjLink(p.link || "");
                                  }}
                                  className="text-primary hover:bg-white p-1 rounded border border-neutral-slate-200 bg-white shadow-xs"
                                  title="Edit Project"
                                >
                                  <Edit size={12} />
                                </button>
                                <button 
                                  onClick={() => removeItem(candidateProfile.projects, p.id, "projects")}
                                  className="text-red-500 hover:bg-white p-1 rounded border border-neutral-slate-200 bg-white shadow-xs"
                                  title="Delete Project"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                              
                              <div>
                                <h4 className="font-display font-bold text-secondary text-xs sm:text-sm flex items-center gap-1">
                                  {p.title}
                                  {p.link && (
                                    <a href={p.link} target="_blank" rel="referrer noopener" className="text-primary hover:underline">
                                      <ExternalLink size={12} />
                                    </a>
                                  )}
                                </h4>
                                <p className="font-sans text-xs text-neutral-slate-600 mt-1 lines-clamp-3">
                                  {p.description}
                                </p>
                              </div>

                              <div className="flex flex-wrap gap-1 mt-3">
                                {p.technologies.map((t, idx) => (
                                  <span key={idx} className="bg-white px-2 py-0.5 border border-neutral-slate-200 text-neutral-slate-500 font-sans text-[9px] font-bold rounded">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column Skills inputs & AI Resume parser simulation */}
              <div className="space-y-8">
                {/* Simulated drag drop file upload & parse integration */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex items-center gap-1.5 border-b border-neutral-slate-100 pb-2 mb-4">
                    <Sparkles size={16} className="text-primary" />
                    <h3 className="font-display text-sm font-bold text-secondary">
                      Spark AI Resume Parser
                    </h3>
                  </div>

                  {candidateProfile.resumeName && (
                    <div className="bg-teal-50 border border-teal-100/50 p-4 rounded-lg mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 shrink overflow-hidden">
                        <FileSpreadsheet className="text-primary shrink-0" size={18} />
                        <div className="truncate text-left">
                          <p className="font-display text-xs font-bold text-secondary truncate">Active CV Document</p>
                          <p className="font-sans text-[10px] text-neutral-slate-500 truncate">{candidateProfile.resumeName}</p>
                        </div>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-primary font-display bg-white px-2 py-0.5 rounded">Loaded</span>
                    </div>
                  )}

                  {/* Drag drop zone representing custom file selector */}
                  <div 
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed p-6 rounded-xl text-center cursor-pointer transition-all ${
                      dragActive ? "border-primary bg-teal-50/10" : "border-neutral-slate-200 hover:border-primary/50"
                    }`}
                  >
                    {isParsing ? (
                      <div className="space-y-2 py-4">
                        <div className="w-8 h-8 rounded-full border-4 border-teal-400 border-t-transparent animate-spin mx-auto"></div>
                        <p className="font-display text-xs font-bold text-secondary">Parsing structure, mapping skills...</p>
                      </div>
                    ) : parsingDone ? (
                      <div className="space-y-1.5 py-4 text-primary">
                        <CheckCircle2 className="mx-auto" size={28} />
                        <p className="font-display text-xs font-bold">Autofill Completed successfully!</p>
                      </div>
                    ) : (
                      <label className="cursor-pointer space-y-1 block py-2">
                        <UploadCloud className="mx-auto text-neutral-slate-400" size={28} />
                        <p className="font-display text-xs font-bold text-secondary">Drag or browse PDF CV</p>
                        <p className="font-sans text-[10px] text-neutral-slate-400">Trigger smart autofill mapping</p>
                        <input onChange={handleFileChange} className="hidden" type="file" accept=".pdf,.doc,.docx" />
                      </label>
                    )}
                  </div>
                </div>

                {/* SKILLS ADDER */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <h3 className="font-display text-sm font-bold text-secondary border-b border-neutral-slate-100 pb-2 mb-4">
                     Skills Tag directory
                  </h3>
                  <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
                    <input 
                      value={newSkillText}
                      onChange={(e) => setNewSkillText(e.target.value)}
                      placeholder="e.g. Docker, Python..."
                      className="border outline-none border-neutral-slate-200 rounded px-3 py-1.5 text-xs flex-1 bg-white" 
                      type="text" 
                    />
                    <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 rounded font-display text-xs font-bold leading-none">
                      Add
                    </button>
                  </form>
                  <div className="flex flex-wrap gap-1.5">
                    {candidateProfile.skills.map((skill, sIdx) => (
                      <span key={sIdx} className="bg-neutral-slate-100 border border-neutral-slate-200 text-neutral-slate-600 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                        {skill}
                        <button 
                          type="button" 
                          onClick={() => {
                            updateCandidateProfile({
                              skills: candidateProfile.skills.filter(s => s !== skill)
                            });
                          }}
                          className="hover:text-red-500 font-bold ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* CERTIFICATIONS ADDER */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <h3 className="font-display text-sm font-bold text-secondary border-b border-neutral-slate-100 pb-2 mb-4 flex items-center gap-1.5">
                    <Award size={15} /> Diplomas & Certifications
                  </h3>
                  <form onSubmit={handleAddCert} className="flex gap-2 mb-4">
                    <input 
                      value={newCertText}
                      onChange={(e) => setNewCertText(e.target.value)}
                      placeholder="AWS Practitioner..."
                      className="border outline-none border-neutral-slate-200 rounded px-3 py-1.5 text-xs flex-1 bg-white" 
                      type="text" 
                    />
                    <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 rounded font-display text-xs font-bold leading-none">
                      Add
                    </button>
                  </form>
                  <ul className="space-y-2">
                    {candidateProfile.certifications.map((ct, cIdx) => (
                      <li key={cIdx} className="bg-neutral-slate-50 px-3 py-2 border border-neutral-slate-200/50 rounded flex justify-between items-center text-xs text-neutral-slate-600">
                        <span>{ct}</span>
                        <button 
                          type="button" 
                          onClick={() => {
                            updateCandidateProfile({
                              certifications: candidateProfile.certifications.filter(c => c !== ct)
                            });
                          }}
                          className="text-neutral-slate-400 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* APPLICATION TIMELINE TRACKER */}
          {activeStep === "applications" && (
            <div className="space-y-6">
              {candidateApplieds.length === 0 ? (
                <div className="bg-white border rounded-xl p-12 text-center max-w-md mx-auto">
                  <Briefcase size={40} className="mx-auto text-neutral-slate-300 mb-3" />
                  <h3 className="font-display font-bold text-secondary">No Applications Submitted</h3>
                  <p className="font-sans text-xs text-neutral-slate-500 mt-1">
                    Explore active job vacancies on the directory board and apply to initialize tracking histories.
                  </p>
                </div>
              ) : (
                <div className="grid lg:grid-cols-12 gap-8">
                  {/* Left Column listings lists */}
                  <div className="lg:col-span-5 bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm h-fit">
                    <h3 className="font-display font-bold text-secondary border-b border-neutral-slate-100 pb-3 mb-4 text-sm sm:text-base">
                      Submitted Applications ({candidateApplieds.length})
                    </h3>
                    <div className="space-y-2.5">
                      {candidateApplieds.map(app => {
                        const j = jobs.find(job => job.id === app.jobId);
                        const isSelected = trackedAppId === app.id || (!trackedAppId && candidateApplieds[0].id === app.id);
                        
                        return (
                          <div 
                            key={app.id} 
                            onClick={() => {
                              setSelectedApp(app.id);
                            }}
                            className={`p-4 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${
                              isSelected 
                                ? "bg-teal-50/20 border-primary" 
                                : "bg-neutral-slate-50 border-neutral-slate-200 hover:border-neutral-slate-300"
                            }`}
                          >
                            <div className="overflow-hidden pr-2">
                              <p className={`font-display text-xs font-bold truncate ${isSelected ? "text-primary" : "text-secondary"}`}>
                                {j?.title || "Role"}
                              </p>
                              <p className="font-sans text-[10px] text-neutral-slate-400 truncate">
                                {j?.companyName} • Applied: {app.appliedDate}
                              </p>
                            </div>

                            <span className={`px-2.5 py-0.5 rounded-full font-display text-[9px] uppercase tracking-wider font-bold select-none shrink-0 ${
                              app.status === "hired" ? "bg-emerald-50 text-emerald-700" :
                              app.status === "rejected" ? "bg-red-50 text-red-650" : "bg-primary-light text-primary"
                            }`}>
                              {app.status.replace(/_/g, " ")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column Status Timeline details */}
                  <div className="lg:col-span-7 bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm">
                    {(() => {
                      const activeApp = applications.find(a => a.id === (trackedAppId || candidateApplieds[0]?.id));
                      if (!activeApp) return <p className="font-sans text-xs text-neutral-slate-400">Select an application to explore stages.</p>;
                      
                      const job = jobs.find(j => j.id === activeApp.jobId);
                      const comp = companies.find(c => c.id === job?.companyId);

                      // Define linear hiring milestones for the candidate
                      const stages: { label: string; statusMatch: string; desc: string }[] = [
                        { label: "Applied", statusMatch: "applied", desc: "Your application structure was routed to the employer database." },
                        { label: "Screening", statusMatch: "screening", desc: "Recruiters are comparing credentials and qualifications metrics." },
                        { label: "Shortlisted", statusMatch: "shortlisted", desc: "Credentials verified. Added to active recruiting sprint lists." },
                        { label: "Interview Rounds", statusMatch: "interview_round_1", desc: "Automated schedule notifications trigger in calendar tab." },
                        { label: "Hired Offer", statusMatch: "hired", desc: "Employment offer parameters transmitted. Complete signatures!" }
                      ];

                      // Compute active indexing to colorize timeline bullets
                      const getCurrentActiveIndex = () => {
                        if (activeApp.status === "rejected") return -1;
                        if (activeApp.status === "hired") return 4;
                        if (activeApp.status === "offer") return 4;
                        if (activeApp.status.includes("interview")) return 3;
                        if (activeApp.status === "shortlisted") return 2;
                        if (activeApp.status === "screening") return 1;
                        return 0;
                      };

                      const currentIdx = getCurrentActiveIndex();

                      return (
                        <div className="space-y-8">
                          <div className="border-b border-neutral-slate-100 pb-4">
                            <div className="flex gap-3.5 items-center">
                              <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center font-bold text-primary font-display overflow-hidden shrink-0">
                                {comp?.logo ? (
                                  <img src={comp.logo} alt={comp.companyName} className="w-full h-full object-cover" />
                                ) : (
                                  comp?.companyName.charAt(0)
                                )}
                              </div>
                              <div className="text-left">
                                <h3 className="font-display font-bold text-secondary text-sm sm:text-base leading-snug">
                                  {job?.title}
                                </h3>
                                <p className="font-sans text-xs text-neutral-slate-500 mt-0.5">
                                  {job?.companyName} • {job?.location} • Timeline overview
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Linear visual timeline */}
                          <div className="space-y-6">
                            {activeApp.status === "rejected" && (
                              <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-2.5">
                                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                                <div>
                                  <p className="font-display text-xs font-bold text-red-800">Application Closed</p>
                                  <p className="font-sans text-[11px] text-red-700 mt-0.5">
                                    The employer has completed hiring and closed this opening. Don't worry! Explore our similar recommendations below.
                                  </p>
                                </div>
                              </div>
                            )}

                            {stages.map((st, idx) => {
                              const isCompleted = idx < currentIdx || activeApp.status === "hired";
                              const isActive = idx === currentIdx && activeApp.status !== "rejected";
                              
                              return (
                                <div key={idx} className="flex gap-4 relative">
                                  {idx < stages.length - 1 && (
                                    <div className={`absolute left-2.5 top-6 -bottom-6 w-0.5 ${
                                      isCompleted ? "bg-primary" : "bg-neutral-slate-100"
                                    }`} />
                                  )}

                                  <div className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center z-10 ${
                                    isCompleted ? "bg-primary text-white" :
                                    isActive ? "border-2 border-primary bg-white text-primary" : "bg-neutral-slate-100 border text-neutral-slate-400"
                                  }`}>
                                    {isCompleted ? <Check size={11} /> : <span className="text-[9px] font-display font-extrabold">{idx + 1}</span>}
                                  </div>

                                  <div className="pb-1 text-left">
                                    <h4 className={`font-display text-xs sm:text-sm font-bold ${isActive ? "text-primary" : "text-secondary"}`}>
                                      {st.label}
                                    </h4>
                                    <p className="font-sans text-[11px] text-neutral-slate-500 leading-snug mt-0.5">
                                      {st.desc}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Recruiter Activity Log */}
                          <div className="bg-neutral-slate-50 p-5 rounded-lg border border-neutral-slate-200/50 text-left">
                            <h4 className="font-display text-xs font-bold text-secondary mb-3">Recruiter Activity Log</h4>
                            <div className="space-y-3.5">
                              {activeApp.activityLog.map((log) => (
                                <div key={log.id} className="text-xs space-y-0.5 border-l border-neutral-slate-200 pl-3.5 relative">
                                  <div className="w-1.5 h-1.5 bg-neutral-slate-300 rounded-full absolute-left-1 top-1.5" />
                                  <div className="flex justify-between text-[10px] text-neutral-slate-400 font-sans">
                                    <span>{log.changedBy}</span>
                                    <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                                  </div>
                                  <p className="font-sans font-semibold text-neutral-slate-700">{log.notes}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ACTIVE INTERVIEWS CALENDAR VIEW */}
          {activeStep === "interviews" && (
            <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
              <h3 className="font-display font-medium text-sm sm:text-base text-secondary border-b border-neutral-slate-100 pb-3 mb-6">
                Scheduled Interviews calendar
              </h3>

              {interviews.filter(i => i.candidateId === candidateProfile.id).length === 0 ? (
                <div className="text-center py-16 max-w-sm mx-auto">
                  <Calendar size={40} className="text-neutral-slate-300 mx-auto mb-3" />
                  <h4 className="font-display font-bold text-secondary">No Interviews Scheduled</h4>
                  <p className="font-sans text-xs text-neutral-slate-500 mt-1">
                    Your active applications are not in interview states. Keep profiles audited so recruiters reach out!
                  </p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {interviews.filter(i => i.candidateId === candidateProfile.id).map(appointment => (
                    <div key={appointment.id} className="border border-neutral-slate-200 p-5 rounded-xl shadow-sm text-left relative flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <span className="px-2 py-0.5 bg-teal-50 border border-teal-100 text-primary font-display text-[10px] font-bold rounded uppercase">
                            {appointment.mode.replace("_", " ")}
                          </span>
                          <span className="font-sans text-[10px] text-neutral-slate-400 font-semibold">{appointment.date} @ {appointment.time}</span>
                        </div>

                        <div>
                          <h4 className="font-display text-sm font-bold text-secondary">{appointment.title}</h4>
                          <p className="font-sans text-xs text-indigo-600 font-semibold">
                            {appointment.companyName} • {appointment.jobTitle}
                          </p>
                        </div>

                        {appointment.notes && (
                          <p className="font-sans text-xs text-neutral-slate-500 bg-neutral-slate-50 p-2.5 rounded border border-neutral-slate-200/40">
                            Notes from Recruiter: "{appointment.notes}"
                          </p>
                        )}
                      </div>

                      <div className="mt-4 pt-4 border-t border-neutral-slate-100 flex justify-between items-center bg-teal-50/20 p-2.5 rounded">
                        <span className="font-sans text-[10px] text-neutral-slate-500">Host: {appointment.interviewerName}</span>
                        <a 
                          href={appointment.meetingLink || "https://meet.google.com"} 
                          target="_blank" 
                          rel="referrer noopener"
                          className="bg-primary hover:bg-primary-hover text-white text-xs px-3 py-1.5 rounded font-display font-bold tracking-tight inline-flex items-center gap-1 cursor-pointer"
                        >
                          Join meeting <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE RECRUITER CHAT MESSAGES */}
          {activeStep === "messages" && (
            <div className="bg-white border border-neutral-slate-200 rounded-xl shadow-sm overflow-hidden grid lg:grid-cols-12min-h-125">
              {/* Left threads list */}
              <div className="lg:col-span-4 border-r border-neutral-slate-100 p-4 space-y-4">
                <h3 className="font-display text-xs sm:text-sm font-bold text-secondary uppercase tracking-wider border-b border-slate-100 pb-2">
                  Hiring chats
                </h3>

                {chatThreadsList.length === 0 ? (
                  <p className="font-sans text-xs text-neutral-slate-400 py-4 text-center">No messaging threads established yet.</p>
                ) : (
                  <div className="space-y-1.5">
                    {chatThreadsList.map(th => (
                      <div 
                        key={th.chatId} 
                        onClick={() => handleChatTrigger(th.chatId)}
                        className={`p-3 rounded-lg cursor-pointer transition-all border text-left ${
                          activeChatId === th.chatId 
                            ? "bg-teal-50/20 border-primary" 
                            : "bg-neutral-slate-50 border-neutral-slate-200/50 hover:bg-neutral-slate-100"
                        }`}
                      >
                        <h4 className="font-display text-xs font-bold text-secondary truncate">{th.companyName}</h4>
                        <p className="font-sans text-[11px] text-teal-600 font-semibold truncate mt-0.5">{th.jobTitle}</p>
                        <p className="font-sans text-[10px] text-neutral-slate-400 truncate mt-1">"{th.lastMessageText}"</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right messages window */}
              <div className="lg:col-span-8 flex flex-col justify-between">
                {activeChatId ? (
                  <>
                    {/* Chat header details */}
                    {(() => {
                      const thAct = chatThreadsList.find(th => th.chatId === activeChatId);
                      const activeMessages = messages.filter(m => m.chatId === activeChatId);
                      
                      return (
                        <>
                          <div className="p-4 border-b border-neutral-slate-100 flex items-center bg-neutral-slate-50 text-left">
                            <div>
                              <h4 className="font-display text-sm font-bold text-secondary">{thAct?.companyName} Recruiter Team</h4>
                              <p className="font-sans text-xs text-neutral-slate-500">Coordinating role: {thAct?.jobTitle}</p>
                            </div>
                          </div>

                          {/* Message bubble scroll box */}
                       <div className="p-6 flex-1 space-y-4 max-h-87.5 overflow-y-auto scrollbar-thin text-left bg-neutral-slate-50/50">
                            {activeMessages.length === 0 ? (
                              <div className="text-center py-12 text-neutral-slate-400">
                                <MessageSquare className="mx-auto text-neutral-slate-300" size={32} />
                                <p className="font-sans text-xs mt-2">Initialize coordination by typing an update message!</p>
                              </div>
                            ) : (
                              activeMessages.map(msg => {
                                const isMe = msg.senderId === candidateProfile.id;
                                return (
                                  <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-xs p-3.5 rounded-xl text-xs sm:text-xs text-left shadow-sm ${
                                      isMe ? "bg-primary text-white rounded-br-none" : "bg-white text-secondary rounded-bl-none border border-neutral-slate-200"
                                    }`}>
                                      <p className="font-sans leading-relaxed">{msg.content}</p>
                                      <span className={`block text-[8px] mt-1.5 text-right font-sans ${isMe ? "text-white/60" : "text-neutral-slate-400"}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Message input field */}
                          <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-slate-100 bg-white flex gap-2">
                            <input 
                              value={typedMessage}
                              onChange={(e) => setTypedMessage(e.target.value)}
                              placeholder="Type brief response to the employer..."
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
                  <div className="m-auto text-center space-y-2 py-16 text-neutral-slate-400">
                    <MessageSquare size={36} className="mx-auto text-neutral-slate-300" />
                    <p className="font-sans text-xs">Select active hiring threads to coordinate and explore details.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  // Quick navigation helper
  function setSelectedApp(appId: string) {
    setTrackedAppId(appId);
    setActiveStep("applications");
  }
};
