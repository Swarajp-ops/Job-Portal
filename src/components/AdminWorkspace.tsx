import React, { useState } from "react";
import { useJobPortal } from "./JobPortalContext";
import { JobPost, CompanyProfile, CandidateProfile, SupportTicket } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, Users, Building, Briefcase, FileSpreadsheet, Percent, 
  Search, Flag, CheckCircle, Ban, Award, Trash2, Mail, MapPin, Globe, 
  ExternalLink, Sparkles, MessageCircle, AlertTriangle, X 
} from "lucide-react";

export const AdminWorkspace: React.FC = () => {
  const { 
    candidates, 
    companies, 
    jobs, 
    applications, 
    tickets, 
    resolveTicket, 
    verifyCompany, 
    moderateJob,
    deleteJob
  } = useJobPortal();

  // Active side-menu: "dashboard" | "jobs" | "companies" | "candidates" | "tickets"
  const [activeStep, setActiveStep] = useState<"dashboard" | "jobs" | "companies" | "candidates" | "tickets">("dashboard");

  // Filter & Search Keywords States
  const [jobSearch, setJobSearch] = useState("");
  const [compSearch, setCompSearch] = useState("");
  const [candSearch, setCandSearch] = useState("");
  const [ticketFilter, setTicketFilter] = useState<"all" | "open" | "resolved">("all");

  // Moderate Job popup/alert state
  const [moderatingJobId, setModeratingJobId] = useState<string | null>(null);
  const [flagReasonText, setFlagReasonText] = useState("");

  // Aggregate Metrics Computation
  const activePlacedJobs = applications.filter(a => a.status === "hired").length;
  const hiringSuccessRate = Math.round((activePlacedJobs / Math.max(1, applications.length)) * 100);

  // Filter lists based on target inputs
  const filteredJobsList = jobs.filter(j => {
    const term = jobSearch.toLowerCase();
    return j.title.toLowerCase().includes(term) || j.companyName.toLowerCase().includes(term) || j.department.toLowerCase().includes(term);
  });

  const filteredCompsList = companies.filter(c => {
    const term = compSearch.toLowerCase();
    return c.companyName.toLowerCase().includes(term) || c.industry.toLowerCase().includes(term) || c.location.toLowerCase().includes(term);
  });

  const filteredCandsList = candidates.filter(cand => {
    const term = candSearch.toLowerCase();
    return cand.fullName.toLowerCase().includes(term) || cand.headline.toLowerCase().includes(term) || cand.skills.some(s => s.toLowerCase().includes(term));
  });

  const filteredTicketsList = tickets.filter(t => {
    if (ticketFilter === "all") return true;
    return t.status === ticketFilter;
  });

  const handleModerationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moderatingJobId) return;

    // Toggle Flagging
    const matchedJob = jobs.find(job => job.id === moderatingJobId);
    if (matchedJob) {
      const isCurrentlyFlagged = !!matchedJob.isFlagged;
      moderateJob(moderatingJobId, !isCurrentlyFlagged, flagReasonText.trim());
    }

    setModeratingJobId(null);
    setFlagReasonText("");
  };

  return (
    <div className="max-w-container-max mx-auto px-gutter py-8">
      {/* Admin header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-slate-200 pb-4 mb-8">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-indigo-600" size={24} />
            <h2 className="font-display text-lg sm:text-xl font-bold text-secondary">
               CareerBridge Platform Management Board
            </h2>
          </div>
          <p className="font-sans text-xs text-neutral-slate-500 mt-1">
            System Administrator workspace. Manage jobs metadata, verify partner organizations, and audit support requests.
          </p>
        </div>
      </div>

      {/* Sub menu controls */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-neutral-slate-200 pb-4">
        {[
          { key: "dashboard", label: "Overview panel" },
          { key: "jobs", label: `Moderation directory (${jobs.length})` },
          { key: "companies", label: `Partner Employers (${companies.length})` },
          { key: "candidates", label: `Registered Candidates (${candidates.length})` },
          { key: "tickets", label: `Pending Support tickets (${tickets.filter(t => t.status === "open").length})` }
        ].map(st => (
          <button
            key={st.key}
            onClick={() => setActiveStep(st.key as any)}
            className={`px-5 py-2 hover:bg-neutral-slate-50 transition-all font-display text-xs sm:text-sm font-semibold rounded-lg ${
              activeStep === st.key 
                ? "bg-indigo-600 text-white hover:opacity-90" 
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
          {/* DASHBOARD GENERAL PANEL */}
          {activeStep === "dashboard" && (
            <div className="space-y-8">
              {/* Primary aggregate stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {[
                  { label: "Total Candidates", val: candidates.length, icon: Users, color: "text-primary" },
                  { label: "Total Employers", val: companies.length, icon: Building, color: "text-amber-500" },
                  { label: "Total Open Jobs", val: jobs.length, icon: Briefcase, color: "text-indigo-600" },
                  { label: "Applications Pool", val: applications.length, icon: FileSpreadsheet, color: "text-secondary" },
                  { label: "Hiring Success Rate", val: `${hiringSuccessRate}%`, icon: Percent, color: "text-emerald-500" }
                ].map((st, sIdx) => {
                  const IconComp = st.icon;
                  return (
                    <div key={sIdx} className="bg-white border border-neutral-slate-200 p-5 rounded-xl shadow-sm text-center flex flex-col justify-between">
                      <IconComp size={20} className={`${st.color} mx-auto mb-2`} />
                      <div>
                        <p className="font-display text-2xl sm:text-3xl font-extrabold text-secondary leading-none">{st.val}</p>
                        <p className="font-sans text-[11px] text-neutral-slate-500 mt-2 uppercase tracking-tight">{st.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action alert box for Admin */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Tickets alert */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="font-display font-medium text-sm sm:text-base text-secondary">
                      Active Customer Support Logs
                    </h3>
                    <button 
                      onClick={() => setActiveStep("tickets")} 
                      className="text-xs text-indigo-650 font-bold hover:underline"
                    >
                      Process Queue
                    </button>
                  </div>

                  {tickets.filter(t => t.status === "open").length === 0 ? (
                    <p className="font-sans text-xs text-neutral-slate-400 py-6 text-center">All support logs are cleared!</p>
                  ) : (
                    <div className="space-y-3">
                      {tickets.filter(t => t.status === "open").map(ticket => (
                        <div key={ticket.id} className="bg-neutral-slate-50 border p-4 rounded-lg flex items-start gap-3.5 text-left">
                          <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="font-display text-xs font-bold text-secondary">{ticket.subject}</p>
                            <p className="font-sans text-[10px] text-neutral-slate-500 mt-0.5">Author: {ticket.fullName} ({ticket.email})</p>
                            <p className="font-sans text-xs text-neutral-slate-600 mt-1 line-clamp-1">"{ticket.message}"</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Company verification logs */}
                <div className="bg-white border border-neutral-slate-200 p-6 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="font-display font-medium text-sm sm:text-base text-secondary">
                      Employer Verification requests
                    </h3>
                    <button 
                      onClick={() => setActiveStep("companies")} 
                      className="text-xs text-indigo-650 font-bold hover:underline"
                    >
                      Approve Partners
                    </button>
                  </div>

                  {companies.filter(c => !c.isVerified && !c.verificationRejected).length === 0 ? (
                    <p className="font-sans text-xs text-neutral-slate-400 py-6 text-center">No pending verifications found.</p>
                  ) : (
                    <div className="space-y-3">
                      {companies.filter(c => !c.isVerified && !c.verificationRejected).map(comp => (
                        <div key={comp.id} className="flex justify-between items-center bg-neutral-slate-50 p-4 border rounded-lg">
                          <div className="text-left truncate pr-2">
                            <p className="font-display text-xs font-bold text-secondary truncate">{comp.companyName}</p>
                            <p className="font-sans text-[10px] text-neutral-slate-405 truncate">Website: {comp.website} • Industry: {comp.industry}</p>
                          </div>
                          
                          <button 
                            onClick={() => verifyCompany(comp.id, true)}
                            className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded text-[11px] font-display font-semibold transition-all shrink-0 hover:bg-emerald-100/50"
                          >
                            Approve Verify
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* JOB MODERATION PANEL */}
          {activeStep === "jobs" && (
            <div className="bg-white border border-neutral-slate-200 p-8 rounded-xl shadow-sm text-left">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-display font-bold text-secondary text-base">All Published Vacancy directory</h3>
                  <p className="font-sans text-xs text-neutral-slate-500 mt-1">
                    Audit community listings parameters. Flag listings contradicting general legal boundaries or target scopes.
                  </p>
                </div>

                <div className="relative max-w-xs text-xs">
                  <Search className="absolute left-3 top-2.5 text-neutral-slate-405" size={14} />
                  <input 
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Search titles, departments, or companies..." 
                    type="text" 
                    className="border outline-none pl-9 pr-4 py-2 bg-neutral-slate-50 rounded-lg text-xs w-full focus:bg-white"
                  />
                </div>
              </div>

              {filteredJobsList.length === 0 ? (
                <p className="font-sans text-xs text-neutral-slate-400 py-6 text-center">No listings matching search bounds.</p>
              ) : (
                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b uppercase font-display font-bold text-neutral-slate-400">
                        <th className="py-2.5 px-1.5 text-left">Company & Job Title</th>
                        <th className="py-2.5 px-1.5 text-left">Location / Budget</th>
                        <th className="py-2.5 px-1.5 text-left">Status Badge</th>
                        <th className="py-2.5 px-1.5 text-left">Moderation alerts</th>
                        <th className="py-2.5 px-1.5 text-center">Featured status</th>
                        <th className="py-2.5 px-1.5 text-right">Operation Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobsList.map(job => (
                        <tr key={job.id} className="border-b hover:bg-neutral-slate-50 transition-colors">
                          <td className="py-4.5 px-1.5">
                            <div>
                              <p className="font-display font-bold text-secondary text-sm leading-tight">{job.title}</p>
                              <span className="font-sans text-[10px] text-neutral-slate-400">{job.companyName} • {job.department}</span>
                            </div>
                          </td>
                          <td className="py-4.5 px-1.5">
                            <p className="font-semibold text-neutral-slate-650">{job.location}</p>
                            <span className="font-sans text-[10px] text-neutral-slate-400">{job.salaryRange}</span>
                          </td>
                          <td className="py-4.5 px-1.5">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold font-display ${
                              job.status === "published" ? "bg-emerald-50 text-emerald-700" :
                              job.status === "draft" ? "bg-amber-50 text-amber-700" : "bg-neutral-slate-100 text-neutral-slate-500"
                            }`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="py-4.5 px-1.5">
                            {job.isFlagged ? (
                              <div className="flex items-center gap-1.5 text-red-650 bg-red-50 p-1 px-2 border rounded border-red-105 select-none w-fit">
                                <Flag size={12} className="fill-current" />
                                <span className="font-sans font-bold text-[9px] uppercase">Suspended</span>
                              </div>
                            ) : (
                              <span className="text-neutral-slate-400 text-[10px]">Secure / Clear</span>
                            )}
                          </td>
                          <td className="py-4.5 px-1.5 text-center">
                            {job.isFeatured ? (
                              <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 font-display font-bold px-2 py-0.5 rounded text-[9px] uppercase">Featured</span>
                            ) : (
                              <span className="text-neutral-slate-400">-</span>
                            )}
                          </td>
                          <td className="py-4.5 px-1.5 text-right">
                            <div className="flex gap-2 justify-end">
                              <button 
                                onClick={() => {
                                  if (job.isFlagged) {
                                    // Direct Unflag call
                                    moderateJob(job.id, false);
                                  } else {
                                    setModeratingJobId(job.id);
                                  }
                                }}
                                className={`text-[10px] font-display font-bold uppercase py-1 px-2 border rounded ${
                                  job.isFlagged 
                                    ? "bg-emerald-50 border-emerald-200 text-emerald-705 hover:bg-emerald-100" 
                                    : "bg-red-50 border-red-100 text-red-650 hover:bg-red-100"
                                }`}
                              >
                                {job.isFlagged ? "Restore" : "Suspend"}
                              </button>
                              
                              <button 
                                onClick={() => {
                                  if (confirm("Permanently delete this vacancy and all candidate submissions?")) {
                                    deleteJob(job.id);
                                  }
                                }}
                                className="text-red-550 hover:bg-red-100/50 p-2 border border-transparent rounded cursor-pointer"
                              >
                                <Trash2 size={13} />
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

          {/* PARTNER COMPANIES AUDITING PANEL */}
          {activeStep === "companies" && (
            <div className="bg-white border rounded-xl p-8 shadow-sm text-left font-display">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-neutral-slate-100 mb-6">
                <div>
                  <h3 className="font-bold text-secondary text-base">Partner Organization Credentials</h3>
                  <p className="font-sans text-xs text-neutral-slate-500 mt-1">Audit company identities and verify official credentials for secure hiring.</p>
                </div>

                <div className="relative text-xs">
                  <Search className="absolute left-3 top-2.5 text-neutral-slate-400" size={14} />
                  <input 
                    value={compSearch} 
                    onChange={(e) => setCompSearch(e.target.value)} 
                    placeholder="Search industries, names, scopes..." 
                    type="text" 
                    className="border outline-none pl-9 pr-4 py-2 bg-neutral-slate-50 rounded-lg text-xs focus:bg-white w-full" 
                  />
                </div>
              </div>

              {filteredCompsList.length === 0 ? (
                <p className="font-sans text-xs text-neutral-slate-400 py-6 text-center">No corporate entities match this query.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCompsList.map(comp => (
                    <div key={comp.id} className="border border-neutral-slate-200 p-5 rounded-xl bg-neutral-slate-50/50 shadow-sm flex flex-col justify-between">
                      <div className="space-y-3 text-left">
                        <div className="flex justify-between items-start">
                          <div className="w-10 h-10 rounded bg-white overflow-hidden border border-neutral-slate-200 text-secondary font-bold flex items-center justify-center">
                            {comp.logo ? <img src={comp.logo} alt={comp.companyName} className="w-full h-full object-cover" /> : comp.companyName.charAt(0)}
                          </div>

                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider ${
                            comp.isVerified ? "bg-emerald-50 border border-emerald-100 text-emerald-700" :
                            comp.verificationRejected ? "bg-red-50 border border-red-100 text-red-650" : "bg-amber-50 border border-amber-100 text-amber-700"
                          }`}>
                            {comp.isVerified ? "Verified" : comp.verificationRejected ? "Rejected" : "Pending"}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-secondary text-sm">{comp.companyName}</h4>
                          <p className="font-sans text-xs text-neutral-slate-500">{comp.industry} • {comp.location}</p>
                          <a href={comp.website} target="_blank" rel="referrer noopener" className="text-secondary hover:underline inline-flex items-center gap-1 text-[11px] font-semibold mt-1 font-sans">
                            <Globe size={11} /> {comp.website.replace("https://", "")} <ExternalLink size={10} />
                          </a>
                        </div>

                        <p className="font-sans text-xs text-neutral-slate-600 line-clamp-3 italic">
                          "{comp.about || "No profile bio available."}"
                        </p>
                      </div>

                      <div className="flex gap-2 border-t pt-3 mt-4 justify-end">
                        {!comp.isVerified && (
                          <button 
                            onClick={() => verifyCompany(comp.id, true)} 
                            className="bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1 rounded text-[11px] font-semibold"
                          >
                            Verify Badge
                          </button>
                        )}
                        {comp.isVerified && (
                          <button 
                            onClick={() => verifyCompany(comp.id, false)} 
                            className="border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1 rounded text-[11px] font-semibold"
                          >
                            Revoke Verify
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CANDIDATES MODERATION DIRECTORY */}
          {activeStep === "candidates" && (
            <div className="bg-white border rounded-xl p-8 shadow-sm text-left">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-display font-bold text-secondary text-base">Registered Candidates directory</h3>
                  <p className="font-sans text-xs text-neutral-slate-500 mt-1">Audit active profiles databases, expertise tiers, and skills directories.</p>
                </div>

                <div className="relative text-xs">
                  <Search className="absolute left-3 top-2.5 text-neutral-slate-400" size={14} />
                  <input 
                    value={candSearch} 
                    onChange={(e) => setCandSearch(e.target.value)} 
                    placeholder="Search candidate profiles, skills..." 
                    type="text" 
                    className="border outline-none pl-9 pr-4 py-2 bg-neutral-slate-50 rounded-lg text-xs focus:bg-white w-full" 
                  />
                </div>
              </div>

              {filteredCandsList.length === 0 ? (
                <p className="font-sans text-xs text-neutral-slate-400 py-6 text-center">No candidate credentials match search parameters.</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCandsList.map(cand => (
                    <div key={cand.id} className="border border-neutral-slate-200 p-5 rounded-xl bg-neutral-slate-50/50 hover:border-gray-300 transition-all flex flex-col justify-between shadow-sm text-left">
                      <div className="space-y-3">
                        <div className="flex gap-3.5 items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden border">
                            <img src={cand.photo} alt={cand.fullName} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <h4 className="font-display font-bold text-secondary text-sm">{cand.fullName}</h4>
                            <p className="font-sans text-[11px] text-neutral-slate-400 capitalize">{cand.roleType} tier</p>
                          </div>
                        </div>

                        <div>
                          <p className="font-display text-xs font-bold text-indigo-650">{cand.headline}</p>
                          <span className="font-sans text-[11px] text-neutral-slate-500 mt-0.5 block flex items-center gap-1">
                            <MapPin size={11} /> {cand.location} • <Mail size={11} /> {cand.email}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mt-1">
                          {cand.skills.slice(0, 4).map((s, idx) => (
                            <span key={idx} className="bg-white px-2 py-0.5 border border-neutral-slate-200 rounded text-[9px] text-neutral-slate-500 font-sans font-bold">
                              {s}
                            </span>
                          ))}
                          {cand.skills.length > 4 && (
                            <span className="text-[9px] text-neutral-slate-400 pl-1">+{cand.skills.length - 4} more</span>
                          )}
                        </div>
                      </div>

                      <div className="border-t pt-3.5 mt-4 flex justify-between items-center bg-white p-2.5 rounded">
                        <span className="font-sans text-[10px] text-neutral-slate-405 font-medium">Completion: {cand.profileCompletion}%</span>
                        <button 
                          onClick={() => alert(`Reviewing candidate files: ${cand.email}. Direct database changes only via administrative DB consoles.`)}
                          className="bg-neutral-slate-50 border border-neutral-slate-200 text-neutral-slate-500 px-3 py-1 hover:text-indigo-600 rounded text-[11px] font-semibold"
                        >
                          Audit Document
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ACTIVE SUPPORT TICKETS CORRESPONDENCE */}
          {activeStep === "tickets" && (
            <div className="bg-white border rounded-xl p-8 shadow-sm text-left">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-neutral-slate-100 mb-6">
                <div>
                  <h3 className="font-display font-bold text-secondary text-base">Security & Community Support Tickets</h3>
                  <p className="font-sans text-xs text-neutral-slate-500 mt-1">Resolve flagged user correspondence, technical tickets, and feedback logs.</p>
                </div>

                <div className="flex gap-2 text-xs">
                  {["all", "open", "resolved"].map(st => (
                    <button 
                      key={st}
                      onClick={() => setTicketFilter(st as any)}
                      className={`px-3 py-1 rounded capitalize font-display font-bold ${
                        ticketFilter === st ? "bg-indigo-605 text-white bg-indigo-650" : "bg-neutral-slate-50 text-neutral-slate-500 hover:bg-neutral-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTicketsList.length === 0 ? (
                <p className="font-sans text-xs text-neutral-slate-400 py-6 text-center">No support ticket logs found matching this status filter.</p>
              ) : (
                <div className="space-y-4">
                  {filteredTicketsList.map(t => (
                    <div key={t.id} className="border border-neutral-slate-200 p-5 rounded-xl bg-neutral-slate-50/50 flex flex-col sm:flex-row justify-between sm:items-start gap-4 shadow-sm text-left">
                      <div className="space-y-2 text-left">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold font-display ${
                            t.status === "open" ? "bg-amber-50 text-amber-705 border border-amber-100" : "bg-emerald-50 text-emerald-705 border border-emerald-100"
                          }`}>
                            {t.status}
                          </span>
                          <span className="font-sans text-[10px] text-neutral-slate-400 font-semibold">{t.timestamp}</span>
                        </div>

                        <div>
                          <h4 className="font-display font-bold text-secondary text-sm">{t.subject}</h4>
                          <p className="font-sans text-xs text-indigo-650 font-semibold">{t.fullName} • {t.email}</p>
                        </div>

                        <p className="font-sans text-xs text-neutral-slate-600 bg-white p-3 rounded-lg border leading-relaxed">
                          "{t.message}"
                        </p>
                      </div>

                      {t.status === "open" && (
                        <button 
                          onClick={() => resolveTicket(t.id)} 
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 font-display text-xs font-bold rounded-lg shrink-0 transition-colors"
                        >
                          Resolve ticket
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* SUSPEND DIALOG POPUP MODAL */}
      {moderatingJobId && (
        <div className="fixed inset-0 bg-secondary/35 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-display">
          <div className="bg-white border rounded-xl shadow-xl w-full max-w-md overflow-hidden text-left animate-in fade-in zoom-in-95 duration-100 border-neutral-slate-200">
            <div className="bg-red-650 bg-red-600 text-white p-4 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xs">Moderate / Suspend Listing</h4>
                <p className="text-[10px] text-red-101 text-red-200">Flag ID: {moderatingJobId}</p>
              </div>
              <button onClick={() => setModeratingJobId(null)} className="text-white hover:opacity-85"><X size={18} /></button>
            </div>

            <form onSubmit={handleModerationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-semibold text-neutral-slate-600 uppercase mb-1">Suspension / Reporting Reason</label>
                <textarea 
                  required 
                  value={flagReasonText} 
                  onChange={(e) => setFlagReasonText(e.target.value)} 
                  rows={3} 
                  placeholder="State violation coordinates, community guidelines infractions..." 
                  className="w-full border p-2.5 rounded text-xs outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-neutral-slate-50" 
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-neutral-slate-100">
                <button type="button" onClick={() => setModeratingJobId(null)} className="border border-neutral-slate-305 text-neutral-slate-500 px-4 py-1.5 rounded text-xs font-semibold">Cancel</button>
                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-5 py-1.5 rounded text-xs font-bold shadow-md">Flag Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
