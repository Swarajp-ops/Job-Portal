import React, { useState } from "react";
import { useJobPortal } from "./JobPortalContext";
import { JobPost, UserRole, CandidateRoleType, WorkMode, JobType } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, MapPin, Search, ArrowRight, ShieldCheck, 
  ChevronRight, ChevronLeft, Calendar, FileText, Send, 
  HelpCircle, Sparkles, LogIn, UserPlus, X, Check, Building, ArrowLeft 
} from "lucide-react";
import { CAREER_RESOURCES, FAQS } from "../data";
import { IndiaJobsFinder } from "./IndiaJobsFinder";

interface PublicPortalProps {
  onOpenAuthModal?: (role: UserRole, initialTab?: "signin" | "signup") => void;
  hideHero?: boolean;
}

export const PublicPortal: React.FC<PublicPortalProps> = ({ 
  onOpenAuthModal,
  hideHero = false
}) => {
  const { 
    jobs, 
    companies, 
    currentUser, 
    login, 
    applyToJob, 
    candidateProfile,
    bookmarkedJobs,
    toggleBookmark,
    incrementJobViews
  } = useJobPortal();

  // Active view states: "landing" | "jobs-list" | "internships-list" | "job-details" | "learning-hub" | "faq" | "terms" | "india-api-jobs"
  const [activeTab, setActiveTab] = useState<"landing" | "jobs-list" | "internships-list" | "learning-hub" | "faq" | "terms" | "india-api-jobs">(
    hideHero ? "jobs-list" : "landing"
  );

  React.useEffect(() => {
    if (hideHero && activeTab === "landing") {
      setActiveTab("jobs-list");
    }
  }, [hideHero]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  
  // Search parameters
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  
  // Advanced filters state
  const [filterWorkMode, setFilterWorkMode] = useState<WorkMode | "all">("all");
  const [filterJobType, setFilterJobType] = useState<JobType | "all">("all");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  // Apply Modal state
  const [applyJob, setApplyJob] = useState<JobPost | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [screeningAnswers, setScreeningAnswers] = useState<string[]>(["", ""]);
  const [customResumeName, setCustomResumeName] = useState("");
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Active help support ticket form state
  const [supportName, setSupportName] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMsg, setSupportMsg] = useState("");
  const [supportSuccess, setSupportSuccess] = useState(false);

  // Quick landing search submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterKeyword(keyword);
    setFilterLocation(location);
    setActiveTab("jobs-list");
  };

  const handleOpenJobDetails = (jobId: string) => {
    setSelectedJobId(jobId);
    incrementJobViews(jobId);
  };

  // Safe apply launcher
  const handleQuickApplyClick = (job: JobPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      // Prompt signin
      onOpenAuthModal?.("candidate", "signup");
      return;
    }
    if (currentUser.role !== "candidate") {
      alert("Please login using a Candidate profile to apply to jobs.");
      return;
    }
    if (currentUser && !currentUser.emailVerified) {
      alert("Verification Required: Please verify your candidate email address first to apply for positions! Inspect the floating 'Mail Sandbox' panel in the bottom-left corner to confirm your address.");
      return;
    }
    setApplyJob(job);
    setCoverLetter("");
    setScreeningAnswers(["", ""]);
    setCustomResumeName(candidateProfile?.resumeName || "My_CareerBridge_Resume.pdf");
    setApplicationSuccess(false);
  };

  const handleApplySubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyJob) return;

    const formattedAnswers = applyJob.requirements.slice(0, 2).map((req, idx) => ({
      question: req,
      answer: screeningAnswers[idx] || "Refer to attached professional credentials."
    }));

    applyToJob(applyJob.id, {
      coverLetter,
      resumeName: customResumeName || "Standard_Hiring_Bio.pdf",
      answers: formattedAnswers
    });

    setApplicationSuccess(true);
    setTimeout(() => {
      setApplyJob(null);
      setApplicationSuccess(false);
    }, 2000);
  };

  // Filter logic
  const filteredJobs = jobs.filter(j => {
    if (j.status !== "published") return false;
    // Check main keywords
    const matchesKeyword = j.title.toLowerCase().includes(filterKeyword.toLowerCase()) || 
                           j.companyName.toLowerCase().includes(filterKeyword.toLowerCase()) ||
                           j.skills.some(s => s.toLowerCase().includes(filterKeyword.toLowerCase())) ||
                           j.description.toLowerCase().includes(filterKeyword.toLowerCase());
    const matchesLocation = j.location.toLowerCase().includes(filterLocation.toLowerCase());
    const matchesMode = filterWorkMode === "all" || j.workMode === filterWorkMode;
    const matchesType = filterJobType === "all" || j.type === filterJobType;
    
    return matchesKeyword && matchesLocation && matchesMode && matchesType;
  });

  const featuredJobs = jobs.filter(j => j.isFeatured && j.status === "published");

  return (
    <div className="w-full">
      {/* Search Header helper when inside sub-pages */}
      {activeTab !== "landing" && (
        <div className="bg-secondary text-white py-12 px-gutter">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary-light text-sm font-semibold mb-1 uppercase tracking-wider">
                <span className="w-2 h-2 bg-primary-light rounded-full" />
                CareerBridge Directory
              </div>
              <h1 className="text-3xl font-display font-medium tracking-tight">
                {activeTab === "jobs-list" ? "Explore Job Vacancies" :
                 activeTab === "internships-list" ? "Trending Internships" :
                 activeTab === "learning-hub" ? "Career Advancement resources" :
                 activeTab === "india-api-jobs" ? "Pan-India Careers Aggregator" :
                 activeTab === "faq" ? "Knowledge Base & FAQs" : "Terms & Privacy Policy"}
              </h1>
            </div>
            
            <button 
              onClick={() => {
                setActiveTab("landing");
                setSelectedJobId(null);
              }}
              className="text-white/80 hover:text-white flex items-center gap-2 text-sm font-medium"
            >
              <ArrowLeft size={16} /> Back to Homepage
            </button>
          </div>
        </div>
      )}

      {/* Main viewport */}
      <AnimatePresence mode="wait">
        {selectedJobId ? (
          /* Job details Page rendering */
          <JobDetailsPage 
            jobId={selectedJobId} 
            onBack={() => setSelectedJobId(null)} 
            onApply={(j, e) => handleQuickApplyClick(j, e)}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeTab === "landing" && (
              <>
                {/* HERO SECTION MATCHING SCREENSHOT EXACTLY */}
                <section className="relative px-gutter max-w-container-max mx-auto py-16 md:py-24">
                  <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col gap-6 z-10">
                      <div className="inline-flex items-center gap-2 bg-teal-50 text-primary border border-teal-120 px-3 py-1 rounded-full w-fit">
                        <ShieldCheck size={14} className="text-primary" />
                        <span className="font-display text-[12px] font-semibold uppercase tracking-wider">
                          Trusted by 50,000+ Professionals
                        </span>
                      </div>
                      <h1 className="font-display text-4xl md:text-[56px] font-medium leading-none tracking-tight text-secondary">
                        Your path to <span className="text-primary font-semibold">professional excellence</span> starts here
                      </h1>
                      <p className="font-sans text-body-lg text-neutral-slate-600 max-w-xl">
                        Connect with global industry leaders and find high-impact career opportunities tailored to your unique professional journey and aspirations.
                      </p>

                      {/* Integrated Smart Search Input */}
                      <form onSubmit={handleSearchSubmit} className="mt-4 bg-white border border-neutral-slate-200 p-2.5 rounded-xl shadow-md flex flex-col md:flex-row gap-2 max-w-3xl">
                        <div className="flex-1 flex items-center px-3 border-b md:border-b-0 md:border-r border-neutral-slate-200 py-1.5 focus-within:ring-2 focus-within:ring-teal-500 rounded">
                          <Search size={18} className="text-neutral-slate-400 mr-2.5" />
                          <input 
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-sm text-secondary placeholder:text-neutral-slate-400" 
                            placeholder="Job title, skills, or company" 
                            type="text"
                          />
                        </div>
                        <div className="flex-1 flex items-center px-3 py-1.5 focus-within:ring-2 focus-within:ring-teal-500 rounded">
                          <MapPin size={18} className="text-neutral-slate-400 mr-2.5" />
                          <input 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-sm text-secondary placeholder:text-neutral-slate-400" 
                            placeholder="City, state, or remote" 
                            type="text"
                          />
                        </div>
                        <button type="submit" className="bg-primary text-white hover:bg-primary-hover px-8 py-3 rounded-lg font-display text-sm font-semibold transition-all active:scale-95 cursor-pointer">
                          Search
                        </button>
                      </form>

                      {/* CTA Toggles */}
                      <div className="flex flex-wrap gap-3.5 mt-2">
                        <button 
                          onClick={() => {
                            setFilterJobType("all");
                            setActiveTab("jobs-list");
                          }}
                          className="bg-secondary hover:bg-neutral-800 text-white px-5 py-2.5 rounded-lg font-display text-xs font-semibold hover-lift inline-flex items-center gap-1.5 group cursor-pointer"
                        >
                          Find Jobs 
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                          onClick={() => {
                            setFilterJobType("internship");
                            setActiveTab("jobs-list");
                          }}
                          className="border border-neutral-slate-300 hover:bg-neutral-slate-100 text-secondary px-5 py-2.5 rounded-lg font-display text-xs font-semibold transition-all cursor-pointer"
                        >
                          Find Internships
                        </button>
                        <button 
                          onClick={() => {
                            setActiveTab("india-api-jobs");
                            // Trigger smooth scroll
                            const finderEl = document.getElementById("external-jobs-finder");
                            if (finderEl) {
                              finderEl.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-display text-xs font-semibold hover-lift inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Sparkles size={13} className="text-amber-100 animate-pulse" />
                          India API Jobs (Live)
                        </button>
                      </div>
                    </div>

                    {/* Left image layout with glass indicators */}
                  <div className="relative hidden lg:block h-125">
                      <div className="absolute inset-0 bg-teal-50 rounded-[36px] rotate-2 -z-10 translate-x-6 translate-y-4"></div>
                      <img 
                        className="w-full h-full object-cover rounded-[36px] shadow-xl relative z-10 transition-all duration-700 hover:scale-[1.01]" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJrk1Mke4YNLgvo3N0L22kb114QwgBv-DWztLhZFGp9IOd9-qJyJ5043Q4CoyxSOyCSgfVJz6lFq2uwppkWjA2I6awCAgRLxW_gNsfuWGOXWjap7PYWE_IRezqu2dGs_ro2EAIEpyte0nJiZWqY9ymMeSCFz7ei2snuP1Qv9kl2Ssb-b-ln5PCAONt8W6iDCGfVbyIX7NdkW5-_9vT5PB0qT9etFalmwgZQSlW0FM2XInenCz-3EAcWQ9cDDGsoS8axOcLM5Dw_J4" 
                        alt="Hiring Excellence"
                      />
                      
                      {/* Floating achievement statistics indicator card */}
                      <div className="absolute -bottom-6 -left-6 bg-white border border-neutral-slate-200/60 p-4.5 rounded-2xl shadow-xl z-20 flex items-center gap-3.5">
                        <div className="w-11 h-11 bg-teal-50 rounded-full flex items-center justify-center text-primary">
                          <Sparkles size={20} />
                        </div>
                        <div>
                          <p className="font-display text-sm font-bold text-secondary">12k+ New Vacancies</p>
                          <p className="font-sans text-xs text-neutral-slate-500">Updated 2 mins ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* TRUST LOGO STRIP */}
                <section className="bg-white py-16 border-y border-neutral-slate-200/50">
                  <div className="max-w-container-max mx-auto px-gutter text-center">
                    <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-neutral-slate-400 mb-10">
                      Top companies hiring now
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-70">
                      <div className="flex items-center gap-2 select-none group hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center font-bold text-red-600">G</div>
                        <span className="font-display font-bold text-xl text-neutral-700">Google</span>
                      </div>
                      <div className="flex items-center gap-2 select-none group hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center font-bold text-rose-500">A</div>
                        <span className="font-display font-bold text-xl text-neutral-700">Airbnb</span>
                      </div>
                      <div className="flex items-center gap-2 select-none group hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">S</div>
                        <span className="font-display font-bold text-xl text-neutral-700">Stripe</span>
                      </div>
                      <div className="flex items-center gap-2 select-none group hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-800">T</div>
                        <span className="font-display font-bold text-xl text-neutral-700">Tesla</span>
                      </div>
                      <div className="flex items-center gap-2 select-none group hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center font-bold text-purple-600">D</div>
                        <span className="font-display font-bold text-xl text-neutral-700">Datadog</span>
                      </div>
                    </div>
                    
                    <div className="mt-12 flex justify-center">
                      <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-slate-50 border border-neutral-slate-200/60 rounded-full">
                        <ShieldCheck size={15} className="text-primary" />
                        <span className="font-display text-xs font-semibold text-neutral-slate-600">
                          1,200+ Verified Company Badges Issued
                        </span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* TRENDING OPPORTUNITIES SEGMENT */}
                <section className="py-20 px-gutter max-w-container-max mx-auto">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
                    <div>
                      <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-secondary">
                        Trending Opportunities
                      </h2>
                      <p className="font-sans text-sm text-neutral-slate-500 mt-1">
                        Curated roles from market-leading tech companies and innovative startups.
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => setActiveTab("jobs-list")}
                      className="text-primary hover:text-primary-hover font-display text-sm font-semibold inline-flex items-center gap-1.5"
                    >
                      Browse All Vacancies <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredJobs.map(j => (
                      <div 
                        key={j.id}
                        onClick={() => handleOpenJobDetails(j.id)}
                        className="group bg-white border border-neutral-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-5">
                            <div className="w-12 h-12 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center font-bold text-primary font-display overflow-hidden">
                              {j.companyLogo ? (
                                <img src={j.companyLogo} alt={j.companyName} className="w-full h-full object-cover" />
                              ) : (
                                j.companyName.charAt(0)
                              )}
                            </div>
                            <span className={`px-2.5 py-1 rounded-full font-display text-xs font-semibold ${
                              j.type === "internship" ? "bg-teal-50 text-teal-700" : "bg-neutral-slate-100 text-neutral-slate-700"
                            }`}>
                              {j.type.replace("-", " ").toUpperCase()}
                            </span>
                          </div>
                          
                          <h3 className="font-display text-lg font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">
                            {j.title}
                          </h3>
                          <p className="font-sans text-sm text-neutral-slate-500 mb-3 block">
                            {j.companyName} • {j.location}
                          </p>
                          
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {j.skills.slice(0, 3).map((skill, sIdx) => (
                              <span 
                                key={sIdx}
                                className="px-2 py-0.5 bg-neutral-slate-50 text-neutral-slate-500 font-sans text-xs rounded border border-neutral-slate-200/60"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-slate-100">
                          <span className="font-display text-sm font-bold text-secondary">
                            {j.salaryRange}
                          </span>
                          <button 
                            onClick={(e) => handleQuickApplyClick(j, e)}
                            className="bg-transparent hover:bg-teal-50 text-primary border border-primary px-4 py-1.5 rounded-lg font-display text-xs font-semibold tracking-tight transition-all"
                          >
                            Quick Apply
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* EMPOWER VALUE HUB SECTION */}
                <section className="py-20 px-gutter bg-secondary text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
                  
                  <div className="max-w-container-max mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                      <img 
                        className="rounded-2xl shadow-2xl w-full h-90 object-cover filter grayscale-15 hover:grayscale-0 transition-all duration-300" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFBP7ndKBoHLDTOs6b_5WxiM36XsFcErP0G3U-S5WmWomc_jJJBO4dUbmGMB7isoVdRgUBUJc51xLh1eUpKKbWZQLi89V75HyyMEbFv7aAsA64SgwI14rIka77CNJ71VJndwjaEuD0qfG8ZihJeacpME1pkCYUzW_-f0LhB-hl81FSgbKsgXHAZvzAyic98ga4eJKT3fYiOm2tMKI10La4ZAgbJ2_A6hp9Hh7i9R2ylfnPppVPTo4pamIdzTZab8XhwdouEtIrXdw" 
                        alt="Collaborative Training"
                      />
                    </div>
                    
                    <div>
                      <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight text-white mb-4">
                        Empower your career growth
                      </h2>
                      <p className="font-sans text-neutral-slate-300 text-body-md mb-8">
                        Unlock exclusive resources designed to help you stand out. From simulated resume feedback audits to tactical guidance from industry veterans.
                      </p>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div 
                          onClick={() => setActiveTab("learning-hub")}
                          className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                        >
                          <FileText className="text-teal-400 mb-3" size={24} />
                          <h4 className="font-display text-sm font-semibold text-white mb-1 group-hover:text-teal-300">Resume Advice</h4>
                          <p className="font-sans text-xs text-neutral-slate-400">Craft a CV that matches corporate ATS scanners cleanly.</p>
                        </div>
                        <div 
                          onClick={() => setActiveTab("learning-hub")}
                          className="bg-white/5 border border-white/10 p-5 rounded-xl hover:bg-white/10 transition-all cursor-pointer group"
                        >
                          <Calendar className="text-teal-400 mb-3" size={24} />
                          <h4 className="font-display text-sm font-semibold text-white mb-1 group-hover:text-teal-300">Interview Prep</h4>
                          <p className="font-sans text-xs text-neutral-slate-400">Master hard backend architectures and behavioral loops.</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => setActiveTab("learning-hub")}
                        className="inline-flex items-center gap-2 font-display text-sm font-semibold text-teal-400 hover:text-teal-300 mt-8 group cursor-pointer"
                      >
                        Browse all learning assets 
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </section>

                {/* HELP SUPPORT SECTION */}
                <section className="bg-neutral-slate-50 py-16 px-gutter border-t border-neutral-slate-200/45">
                  <div className="max-w-4xl mx-auto text-center mb-10">
                    <h2 className="font-display text-2xl font-bold text-secondary">
                      Need Technical Support?
                    </h2>
                    <p className="font-sans text-sm text-neutral-slate-500 mt-1">
                      Our customer support team resolves any verification queries or spam flags in under 12 hours.
                    </p>
                  </div>

                  <div className="max-w-2xl mx-auto bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm">
                    {supportSuccess ? (
                      <div className="text-center py-8">
                        <div className="w-12 h-12 bg-teal-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check size={24} />
                        </div>
                        <h3 className="font-display text-lg font-bold text-secondary">Ticket Submitted Successfully</h3>
                        <p className="font-sans text-sm text-neutral-slate-500 mt-1">
                          Our administrators have received your inquiry and will respond to your email shortly.
                        </p>
                        <button 
                          onClick={() => setSupportSuccess(false)}
                          className="text-primary hover:underline text-xs mt-4 font-semibold"
                        >
                          Submit another query
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        setSupportSuccess(true);
                        setSupportName("");
                        setSupportEmail("");
                        setSupportSubject("");
                        setSupportMsg("");
                      }} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Full Name</label>
                            <input 
                              required
                              value={supportName}
                              onChange={(e) => setSupportName(e.target.value)}
                              className="w-full border border-neutral-slate-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              placeholder="Marcus Aurelius"
                              type="text" 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Email Address</label>
                            <input 
                              required
                              value={supportEmail}
                              onChange={(e) => setSupportEmail(e.target.value)}
                              className="w-full border border-neutral-slate-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                              placeholder="marcus@careers.com"
                              type="email" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Subject</label>
                          <input 
                            required
                            value={supportSubject}
                            onChange={(e) => setSupportSubject(e.target.value)}
                            className="w-full border border-neutral-slate-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                            placeholder="Employer account verification delay"
                            type="text" 
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1">Message Content</label>
                          <textarea 
                            required
                            rows={3}
                            value={supportMsg}
                            onChange={(e) => setSupportMsg(e.target.value)}
                            className="w-full border border-neutral-slate-200 px-3.5 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" 
                            placeholder="Enter the details of your inquiry here..."
                          />
                        </div>
                        <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-lg font-display text-sm font-semibold transition-all cursor-pointer">
                          Submit Support Ticket
                        </button>
                      </form>
                    )}
                  </div>
                </section>
              </>
            )}

            {/* JOBS & INTERNSHIPS SELECTION TABLE */}
            {activeTab === "jobs-list" && (
              <div className="max-w-container-max mx-auto px-gutter py-12">
                <div className="grid lg:grid-cols-4 gap-8">
                  {/* Left Column Filters */}
                  <div className="lg:col-span-1 bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm h-fit space-y-6">
                    <h2 className="font-display text-sm font-bold text-secondary uppercase tracking-wider pb-3 border-b border-neutral-slate-100">
                      Search Filters
                    </h2>
                    
                    <div>
                      <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1.5">Keywords</label>
                      <input 
                        value={filterKeyword}
                        onChange={(e) => setFilterKeyword(e.target.value)}
                        className="w-full border border-neutral-slate-200 px-3 py-1.5 rounded text-sm placeholder:text-neutral-400 focus:outline-primary"
                        placeholder="Go, Kubernetes, Stripe..." 
                        type="text" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-1.5">Location</label>
                      <input 
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="w-full border border-neutral-slate-200 px-3 py-1.5 rounded text-sm placeholder:text-neutral-400 focus:outline-primary"
                        placeholder="Zurich, Remote..." 
                        type="text" 
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-2">Work Arrangement</label>
                      <div className="space-y-1.5">
                        {["all", "remote", "hybrid", "on-site"].map((mode) => (
                          <label key={mode} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-slate-600 hover:text-secondary whitespace-nowrap">
                            <input 
                              type="radio"
                              name="workmode"
                              checked={filterWorkMode === mode}
                              onChange={() => setFilterWorkMode(mode as WorkMode | "all")}
                              className="text-primary focus:ring-primary border-neutral-slate-200"
                            />
                            {mode.replace("-", " ").toUpperCase()}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-display font-semibold text-neutral-slate-600 mb-2">Role Type</label>
                      <div className="space-y-1.5">
                        {["all", "full-time", "part-time", "contract", "internship"].map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-neutral-slate-600 hover:text-secondary whitespace-nowrap">
                            <input 
                              type="radio"
                              name="jobtype"
                              checked={filterJobType === type}
                              onChange={() => setFilterJobType(type as JobType | "all")}
                              className="text-primary focus:ring-primary border-neutral-slate-200"
                            />
                            {type.replace("-", " ").toUpperCase()}
                          </label>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        setFilterKeyword("");
                        setFilterLocation("");
                        setFilterWorkMode("all");
                        setFilterJobType("all");
                      }}
                      className="w-full bg-neutral-slate-100 hover:bg-neutral-slate-200 text-secondary py-2 rounded font-display text-xs font-bold transition-all"
                    >
                      Reset Filters
                    </button>
                  </div>

                  {/* Listings Table */}
                  <div className="lg:col-span-3 space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-neutral-slate-200">
                      <p className="font-sans text-sm text-neutral-slate-500 font-semibold">
                        Found <span className="text-secondary font-bold">{filteredJobs.length}</span> active vacancies
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3.5 bg-teal-50 border border-teal-100/80 rounded-xl gap-3 text-left">
                      <div className="space-y-0.5">
                        <p className="font-display font-bold text-xs text-secondary flex items-center gap-1.5">
                          <Sparkles size={14} className="text-primary animate-pulse" /> Live Pan-India Job Board API Available
                        </p>
                        <p className="font-sans text-[11px] text-neutral-slate-500">
                          Looking for active careers across Bengaluru, Gurugram, Mumbai, Hyderabad, and Pune? Search real-time tech hub listings.
                        </p>
                      </div>
                      <button 
                        onClick={() => {
                          setActiveTab("india-api-jobs");
                          setSelectedJobId(null);
                        }}
                        className="bg-primary hover:bg-primary-hover text-white px-3.5 py-1.5 rounded-lg font-display text-[11px] font-bold shrink-0 shadow-xs cursor-pointer"
                      >
                        Launch Aggregator
                      </button>
                    </div>

                    {filteredJobs.length === 0 ? (
                      <div className="text-center py-16 bg-white border border-neutral-slate-100 rounded-xl">
                        <Briefcase size={40} className="text-neutral-slate-300 mx-auto mb-3" />
                        <h3 className="font-display text-lg font-bold text-secondary">No openings match filters</h3>
                        <p className="font-sans text-xs text-neutral-slate-500 mt-1 max-w-sm mx-auto">
                          Try general keywords, or resetting filter specifications to discover wider offerings.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredJobs.map(j => (
                          <div 
                            key={j.id}
                            onClick={() => handleOpenJobDetails(j.id)}
                            className="bg-white border border-neutral-slate-200/70 p-5 rounded-xl hover:shadow-md transition-all cursor-pointer flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-primary/30"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center font-bold text-primary text-sm font-display overflow-hidden shrink-0">
                                {j.companyLogo ? (
                                  <img src={j.companyLogo} alt={j.companyName} className="w-full h-full object-cover" />
                                ) : (
                                  j.companyName.charAt(0)
                                )}
                              </div>
                              <div>
                                <h3 className="font-display font-semibold text-secondary leading-snug hover:text-primary transition-colors text-sm sm:text-base">
                                  {j.title}
                                </h3>
                                <p className="font-sans text-xs text-neutral-slate-500">
                                  {j.companyName} • {j.location} • <span className="font-medium text-neutral-slate-600 uppercase text-[10px] bg-neutral-slate-100 px-1.5 py-0.5 rounded">{j.workMode}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                              <div className="text-right hidden sm:block">
                                <p className="font-display text-sm font-bold text-secondary">{j.salaryRange}</p>
                                <p className="font-sans text-[10px] text-neutral-slate-400">Deadline: {j.deadline}</p>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleBookmark(j.id);
                                  }}
                                  className={`p-2 border rounded-lg transition-all ${
                                    bookmarkedJobs.includes(j.id) 
                                      ? "bg-amber-50 text-amber-500 border-amber-200" 
                                      : "border-neutral-slate-200 text-neutral-slate-400 hover:text-secondary hover:bg-neutral-slate-50"
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-[18px] block" style={{ fontVariationSettings: bookmarkedJobs.includes(j.id) ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                                </button>
                                
                                <button 
                                  onClick={(e) => handleQuickApplyClick(j, e)}
                                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-display text-xs font-semibold cursor-pointer whitespace-nowrap"
                                >
                                  Quick Apply
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* CAREER RESOURCES (LEARNING HUB) */}
            {activeTab === "learning-hub" && (
              <div className="max-w-container-max mx-auto px-gutter py-12">
                <div className="grid md:grid-cols-3 gap-8">
                  {CAREER_RESOURCES.map(res => (
                    <div key={res.id} className="bg-white border border-neutral-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="px-2 py-0.5 bg-teal-50 text-primary border border-teal-100 rounded text-[10px] font-bold font-display uppercase">
                          {res.category}
                        </span>
                        <h3 className="font-display font-bold text-secondary text-base mt-2.5 mb-2 line-clamp-2">
                          {res.title}
                        </h3>
                        <p className="font-sans text-xs text-neutral-slate-500 mb-4">
                          {res.about}
                        </p>
                        
                        <div className="space-y-3 mt-4">
                          <p className="text-xs font-bold text-secondary uppercase tracking-wider border-b border-neutral-slate-100 pb-1">Recommended steps:</p>
                          {res.steps.map((st, sIdx) => (
                            <div key={sIdx} className="flex gap-2 items-start">
                              <span className="w-4 h-4 bg-teal-50 text-primary rounded-full font-display text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {sIdx + 1}
                              </span>
                              <p className="font-sans text-xs text-neutral-slate-600">{st}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-neutral-slate-100 flex justify-between items-center">
                        <span className="font-sans text-xs text-neutral-slate-400">{res.readTime}</span>
                        <button className="text-xs font-bold text-primary hover:underline">Download Guide Toolkit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KNOWLEDGE BASE FAQ */}
            {activeTab === "faq" && (
              <div className="max-w-3xl mx-auto px-gutter py-12">
                <div className="space-y-4">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="bg-white border border-neutral-slate-200 rounded-xl p-6 shadow-sm">
                      <h3 className="font-display font-bold text-secondary text-sm sm:text-base flex gap-2 items-start">
                        <HelpCircle className="text-primary shrink-0 mt-0.5" size={18} />
                        {faq.question}
                      </h3>
                      <p className="font-sans text-xs sm:text-sm text-neutral-slate-500 mt-2 ml-7 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TERMS & CONDITIONS */}
            {activeTab === "terms" && (
              <div className="max-w-3xl mx-auto px-gutter py-12 bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm space-y-6">
                <div>
                  <h2 className="font-display text-lg font-bold text-secondary">1. Community Trust & Guidelines</h2>
                  <p className="font-sans text-xs text-neutral-slate-600 mt-1 leading-relaxed">
                    CareerBridge upholds extreme professional standards of hiring trust. All recruiters must represent certified operating structures. False postings representing non-existent internships, or soliciting credential processing charges remain strictly forbidden, causing immediate admin suspension.
                  </p>
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-secondary">2. Candidate Data Ownership</h2>
                  <p className="font-sans text-xs text-neutral-slate-600 mt-1 leading-relaxed">
                    Resumes and portfolios uploaded are strictly channeled to specified employer listings. Candidates maintain full rights to edit profiles, revoke application states, or close records securely through dashboard options.
                  </p>
                </div>
                <p className="text-right font-display text-[11px] text-neutral-slate-400">Published: May 20, 2026</p>
              </div>
            )}

            {/* LIVE INDIA API JOBS FINDER */}
            {activeTab === "india-api-jobs" && (
              <IndiaJobsFinder />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="w-full mt-24 border-t border-neutral-slate-200/60 bg-white">
        <div className="max-w-container-max mx-auto px-gutter py-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex flex-col gap-1 text-left sm:max-w-xs">
            <span className="font-display text-lg font-bold text-primary">CareerBridge</span>
            <p className="font-sans text-xs text-neutral-slate-500 leading-snug">
              Professional Precision in Recruitment. Connecting premier talent networks internationally.
            </p>
          </div>
          
          <div className="flex flex-col md:items-end gap-3.5">
            <div className="flex flex-wrap gap-5">
              <button onClick={() => setActiveTab("learning-hub")} className="font-display text-xs text-neutral-slate-500 hover:text-primary font-semibold">Resources</button>
              <button onClick={() => setActiveTab("india-api-jobs")} className="font-display text-xs text-primary font-bold flex items-center gap-1">India Jobs Aggregator LIVE <span className="w-1.5 h-1.5 bg-rose-550 rounded-full animate-pulse" /></button>
              <button onClick={() => setActiveTab("faq")} className="font-display text-xs text-neutral-slate-500 hover:text-primary font-semibold">FAQ</button>
              <button onClick={() => setActiveTab("terms")} className="font-display text-xs text-neutral-slate-500 hover:text-primary font-semibold">Terms & Privacy</button>
              <button onClick={() => {
                const element = document.getElementById("support");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                } else {
                  setActiveTab("landing");
                }
              }} className="font-display text-xs text-neutral-slate-500 hover:text-primary font-semibold">Contact Help</button>
            </div>
            <p className="font-sans text-[11px] text-neutral-slate-400">
              © 2024 CareerBridge. Professional Precision in Recruitment.
            </p>
          </div>
        </div>
      </footer>

      {/* QUICK APPLY MODAL TIMELINE BOX */}
      {applyJob && (
        <div className="fixed inset-0 bg-secondary/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-neutral-slate-200 w-full max-w-lg rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="bg-secondary text-white p-4 flex justify-between items-center">
              <div>
                <h3 className="font-display font-medium text-sm">Secure Application</h3>
                <p className="font-sans text-xs text-neutral-slate-300">Applying to: {applyJob.title}</p>
              </div>
              <button onClick={() => setApplyJob(null)} className="text-white/80 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleApplySubmission} className="p-6 space-y-4">
              {applicationSuccess ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-teal-50 border border-teal-100 text-primary rounded-full flex items-center justify-center mx-auto mb-3">
                    <Check size={24} />
                  </div>
                  <h4 className="font-display font-bold text-secondary">Application Outbound!</h4>
                  <p className="font-sans text-xs text-neutral-slate-500">
                    Transmitting files and answers to {applyJob.companyName} recruiter.
                  </p>
                </div>
              ) : (
                <>
                  <div className="bg-neutral-slate-50 p-3 rounded-lg border border-neutral-slate-200/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <FileText className="text-primary" size={18} />
                      <div className="text-left">
                        <p className="font-display text-xs font-bold text-secondary">Active Resume Selected</p>
                        <p className="font-sans text-[10px] text-neutral-slate-400">
                          {customResumeName || "Standard_CareerBridge_CV.pdf"}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-primary font-display bg-teal-50 px-2 py-0.5 rounded">Ready</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-display font-bold text-neutral-slate-600 uppercase mb-1">
                      Brief Cover Note (Optional)
                    </label>
                    <textarea 
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      className="w-full border border-neutral-slate-200 p-2.5 rounded text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                      rows={3}
                      placeholder="Why do you think you are the perfect fit for this specific vacancy?"
                    />
                  </div>

                  {applyJob.requirements.slice(0, 2).map((req, idx) => (
                    <div key={idx}>
                      <label className="block text-[11px] font-display font-bold text-neutral-slate-600 uppercase mb-1">
                        Screening Question: {req}
                      </label>
                      <input 
                        required
                        value={screeningAnswers[idx]}
                        onChange={(e) => {
                          const next = [...screeningAnswers];
                          next[idx] = e.target.value;
                          setScreeningAnswers(next);
                        }}
                        className="w-full border border-neutral-slate-200 px-3 py-1.5 rounded text-xs outline-none focus:ring-1 focus:ring-primary focus:border-primary" 
                        placeholder="State your exact tenure or experience matches..."
                        type="text" 
                      />
                    </div>
                  ))}

                  <div className="flex gap-2 justify-end pt-4 border-t border-neutral-slate-100">
                    <button 
                      type="button"
                      onClick={() => setApplyJob(null)}
                      className="border border-neutral-slate-300 text-neutral-slate-600 hover:bg-neutral-slate-50 px-4 py-2 rounded text-xs font-display font-bold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="bg-primary hover:bg-primary-hover text-white px-5 py-2' rounded text-xs font-display font-bold"
                    >
                      Transmit Application
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* INNER COMPONENT: DETAILED JOB PAGE */
interface JobDetailsPageProps {
  jobId: string;
  onBack: () => void;
  onApply: (job: JobPost, e: React.MouseEvent) => void;
}

const JobDetailsPage: React.FC<JobDetailsPageProps> = ({ jobId, onBack, onApply }) => {
  const { jobs, companies, bookmarkedJobs, toggleBookmark, incrementJobViews } = useJobPortal();
  const job = jobs.find(j => j.id === jobId);
  
  if (!job) {
    return (
      <div className="max-w-container-max mx-auto py-12 px-gutter text-center">
        <h3 className="font-display text-lg font-bold text-secondary">Job post not found</h3>
        <button onClick={onBack} className="text-primary hover:underline mt-2">Back to Listings</button>
      </div>
    );
  }

  const company = companies.find(c => c.id === job.companyId);
  const similarJobs = jobs.filter(j => j.id !== job.id && j.department === job.department && j.status === "published").slice(0, 3);

  return (
    <div className="max-w-container-max mx-auto px-gutter py-12">
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-display font-bold text-neutral-slate-500 hover:text-secondary mb-6"
      >
        <ArrowLeft size={14} /> Back to Directory list
      </button>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left main content */}
        <div className="lg:col-span-2 space-y-8 bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center font-bold text-primary font-display text-lg overflow-hidden shrink-0">
                {job.companyLogo ? (
                  <img src={job.companyLogo} alt={job.companyName} className="w-full h-full object-cover" />
                ) : (
                  job.companyName.charAt(0)
                )}
              </div>
              <div>
                <h1 className="font-display font-bold text-secondary text-xl sm:text-2xl leading-tight">
                  {job.title}
                </h1>
                <p className="font-sans text-xs sm:text-sm text-neutral-slate-500 mt-0.5">
                  {job.companyName} • {job.location} • <span className="font-display font-bold uppercase tracking-wider text-[10px] bg-neutral-slate-100 px-1.5 py-0.5 rounded text-neutral-600">{job.type.replace("-", " ")}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleBookmark(job.id)}
                className={`p-2.5 border rounded-lg transition-all ${
                  bookmarkedJobs.includes(job.id) 
                    ? "bg-amber-50 text-amber-500 border-amber-200" 
                    : "border-neutral-slate-200 text-neutral-slate-400 hover:text-secondary hover:bg-neutral-slate-50"
                }`}
              >
                <span className="material-symbols-outlined text-[18px] block" style={{ fontVariationSettings: bookmarkedJobs.includes(job.id) ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
              </button>
              
              <button 
                onClick={(e) => onApply(job, e)}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-display text-xs font-bold leading-none cursor-pointer hover-lift"
              >
                Apply to this Job
              </button>
            </div>
          </div>

          <div className="border-t border-neutral-slate-100 pt-6 space-y-4">
            <div>
              <h3 className="font-display font-bold text-secondary text-sm sm:text-base mb-2">Role Overview</h3>
              <p className="font-sans text-xs sm:text-sm text-neutral-slate-600 leading-relaxed">
                {job.description}
              </p>
            </div>

            {job.eligibility && (
              <div>
                <h3 className="font-display font-bold text-secondary text-sm sm:text-base mb-1.5">Eligibility Framework</h3>
                <p className="font-sans text-xs sm:text-sm text-neutral-slate-600 leading-relaxed bg-neutral-slate-50 px-4 py-3 rounded-lg border border-neutral-slate-200/50">
                  {job.eligibility}
                </p>
              </div>
            )}

            <div>
              <h3 className="font-display font-bold text-secondary text-sm sm:text-base mb-2">Required Qualifications</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="font-sans text-xs sm:text-sm text-neutral-slate-600 leading-relaxed">
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-display font-bold text-secondary text-sm sm:text-base mb-2">Core Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-1.5">
                {job.responsibilities.map((resp, idx) => (
                  <li key={idx} className="font-sans text-xs sm:text-sm text-neutral-slate-600 leading-relaxed">
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            {job.perks && job.perks.length > 0 && (
              <div>
               <h3 className="font-display font-semibold text-secondary text-sm sm:text-base mb-2">
  Compensation & Perks
</h3>
<ul className="list-disc pl-5 space-y-1.5">
                  {job.perks.map((p, idx) => (
                    <li key={idx} className="font-sans text-xs sm:text-sm text-neutral-slate-600 leading-relaxed">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right side widgets column */}
        <div className="space-y-6">
          {/* Job Overview Metadata Card */}
          <div className="bg-white border border-neutral-slate-200 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="font-display text-sm font-bold text-secondary border-b border-neutral-slate-100 pb-2">
              Posting Overview
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-display text-[10px] font-semibold text-neutral-slate-400 uppercase tracking-wider block">Compensation</span>
                <span className="font-display text-sm font-bold text-secondary block mt-0.5">{job.salaryRange}</span>
              </div>
              <div>
                <span className="font-display text-[10px] font-semibold text-neutral-slate-400 uppercase tracking-wider block">Work mode</span>
                <span className="font-display text-xs font-semibold text-neutral-600 uppercase block mt-0.5">{job.workMode}</span>
              </div>
              <div>
                <span className="font-display text-[10px] font-semibold text-neutral-slate-400 uppercase tracking-wider block">Applicants</span>
                <span className="font-display text-xs font-bold text-secondary block mt-0.5">{job.applicationsCount} submitted</span>
              </div>
              <div>
                <span className="font-display text-[10px] font-semibold text-neutral-slate-400 uppercase tracking-wider block">Openings</span>
                <span className="font-display text-xs font-bold text-secondary block mt-0.5">{job.openings} active</span>
              </div>
              <div className="col-span-2">
                <span className="font-display text-[10px] font-semibold text-neutral-slate-400 uppercase tracking-wider block">Application Deadline</span>
                <span className="font-display text-xs font-medium text-neutral-slate-600 block mt-0.5">{job.deadline}</span>
              </div>
            </div>
            
            <div className="pt-2">
              <button 
                onClick={(e) => onApply(job, e)}
                className="w-full bg-primary hover:bg-primary-hover text-white py-2 rounded-lg font-display text-xs font-bold transition-all cursor-pointer text-center block"
              >
                Apply Instantly
              </button>
            </div>
          </div>

          {/* Company Brief Card */}
          {company && (
            <div className="bg-white border border-neutral-slate-200 rounded-xl p-6 shadow-sm space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center font-bold text-primary font-display overflow-hidden shrink-0">
                  {company.logo ? (
                    <img src={company.logo} alt={company.companyName} className="w-full h-full object-cover" />
                  ) : (
                    company.companyName.charAt(0)
                  )}
                </div>
                <div>
                  <h4 className="font-display font-bold text-secondary text-sm">About {company.companyName}</h4>
                  <a href={company.website} target="_blank" rel="referrer noopener" className="font-sans text-[11px] text-teal-600 hover:underline">
                    Company Website
                  </a>
                </div>
              </div>
              <p className="font-sans text-xs text-neutral-slate-500 leading-relaxed">
                {company.about}
              </p>
              <div className="border-t border-neutral-slate-100 pt-3 flex items-center justify-between text-[11px] font-display font-semibold text-neutral-slate-400">
                <span>Industry: {company.industry}</span>
                <span>Size: {company.companySize}</span>
              </div>
            </div>
          )}

          {/* Similar Opportunities Widget */}
          {similarJobs.length > 0 && (
            <div className="bg-white border border-neutral-slate-200 rounded-xl p-6 shadow-sm space-y-3">
              <h4 className="font-display text-sm font-bold text-secondary border-b border-neutral-slate-100 pb-2">
                Similar Openings
              </h4>
              <div className="space-y-3.5">
                {similarJobs.map(sj => (
                  <div 
                    key={sj.id}
                    onClick={() => {
                      onBack();
                      setTimeout(() => incrementJobViews(sj.id), 20);
                    }}
                    className="group cursor-pointer flex justify-between items-center bg-neutral-slate-50 p-2.5 rounded hover:bg-neutral-slate-100 border border-neutral-slate-200/40 relative"
                  >
                    <div>
                      <h5 className="font-display text-xs font-bold text-secondary group-hover:text-primary transition-colors">
                        {sj.title}
                      </h5>
                      <p className="font-sans text-[10px] text-neutral-slate-500">
                        {sj.companyName} • {sj.location}
                      </p>
                    </div>
                    <ChevronRight size={14} className="text-neutral-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
