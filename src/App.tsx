import React, { useState } from "react";
import { JobPortalProvider, useJobPortal } from "./components/JobPortalContext";
import { PublicPortal } from "./components/PublicPortal";
import { CandidateWorkspace } from "./components/CandidateWorkspace";
import { EmployerWorkspace } from "./components/EmployerWorkspace";
import { AdminWorkspace } from "./components/AdminWorkspace";
import { AuthModal } from "./components/AuthModal";
import { SimulatedMailbox } from "./components/SimulatedMailbox";
import { UserRole } from "./types";
import { motion, AnimatePresence } from "motion/react";
import {
  Bell, LogOut, ShieldAlert, Kanban, Mail, Check, X
} from "lucide-react";

const AppContent: React.FC = () => {
  const {
    currentUser,
    logout,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    verifyEmailToken,
    resendVerificationEmail,
    simulatedEmails
  } = useJobPortal();

  const [candidateView, setCandidateView] = useState<"workspace" | "browse">("workspace");
  const [authOpen, setAuthOpen] = useState(false);
  const [authRole, setAuthRole] = useState<UserRole>("candidate");
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [notifOpen, setNotifOpen] = useState(false);
  const [mailboxOpen, setMailboxOpen] = useState(false);
  const [activationResult, setActivationResult] = useState<{ success: boolean; message: string } | null>(null);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("verify_token");
    if (token) {
      const response = verifyEmailToken(token);
      if (response.success) {
        setActivationResult({
          success: true,
          message: "Your email coordinates have been successfully authorized. Your CareerBridge profile privileges are fully unlocked."
        });
      } else {
        setActivationResult({
          success: false,
          message: response.message || "The verification token you provided is invalid, broken, or has expired."
        });
      }
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [verifyEmailToken]);

  const unreadNotifications = notifications.filter(n => !n.read);

  const handleTriggerAuth = (role: UserRole, initialTab: "signin" | "signup" = "signin") => {
    setAuthRole(role);
    setAuthTab(initialTab);
    setAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans transition-colors relative antialiased selection:bg-primary selection:text-white">
      <header className="sticky top-0 bg-white border-b border-neutral-slate-200/80 z-40 backdrop-blur-md">
        <div className="max-w-container-max mx-auto px-gutter h-16 flex items-center justify-between">
          <div
            onClick={() => setCandidateView("workspace")}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white font-display text-sm tracking-wide shadow-md group-hover:scale-105 transition-transform">
              CB
            </div>
            <span className="font-display text-base font-extrabold tracking-tight text-secondary">
              CareerBridge
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs">
            {currentUser && currentUser.role === "candidate" && (
              <>
                <button
                  onClick={() => setCandidateView("workspace")}
                  className={`font-semibold transition-all cursor-pointer ${
                    candidateView === "workspace"
                      ? "text-primary border-b-2 border-primary pb-1 mt-0.5"
                      : "text-neutral-slate-600 hover:text-secondary"
                  }`}
                >
                  My Career Hub
                </button>
                <button
                  onClick={() => setCandidateView("browse")}
                  className={`font-semibold transition-all cursor-pointer ${
                    candidateView === "browse"
                      ? "text-primary border-b-2 border-primary pb-1 mt-0.5"
                      : "text-neutral-slate-600 hover:text-secondary"
                  }`}
                >
                  Discover Openings
                </button>
              </>
            )}

            {currentUser && currentUser.role === "employer" && (
              <div className="flex items-center gap-1 bg-teal-50 border border-teal-100/50 px-3 py-1 rounded text-primary text-[10px] font-display font-medium tracking-tight">
                <Kanban size={10} /> Corporate Talent Admin Area
              </div>
            )}

            {currentUser && currentUser.role === "admin" && (
              <div className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded text-indigo-700 text-[10px] font-display font-medium tracking-tight">
                <ShieldAlert size={10} /> System Auditor Console
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen(!notifOpen)}
                    className="p-2 text-neutral-slate-500 hover:text-secondary hover:bg-neutral-slate-100 rounded-lg transition-all relative cursor-pointer"
                  >
                    <Bell size={18} />
                    {unreadNotifications.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border border-white" />
                    )}
                  </button>

                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.12 }}
                        className="absolute right-0 mt-2.5 w-72 bg-white border border-neutral-slate-200 shadow-xl rounded-xl overflow-hidden text-left font-sans z-50 p-2"
                      >
                        <div className="p-3 border-b border-neutral-slate-100 flex justify-between items-center bg-neutral-slate-50 rounded-t-lg">
                          <span className="font-display text-[11px] font-bold text-secondary uppercase tracking-wider">
                            Alert Feed
                          </span>
                          {unreadNotifications.length > 0 && (
                            <button
                              onClick={markAllNotificationsRead}
                              className="text-[9px] text-primary hover:underline font-semibold"
                            >
                              Dismiss all
                            </button>
                          )}
                        </div>

                        <div className="max-h-60 overflow-y-auto divide-y divide-neutral-slate-100 scrollbar-thin py-1 my-1">
                          {notifications.length === 0 ? (
                            <p className="font-sans text-[11px] text-neutral-slate-400 py-6 text-center">
                              No alerts in inbox index.
                            </p>
                          ) : (
                            notifications.map(notif => (
                              <div
                                key={notif.id}
                                onClick={() => markNotificationRead(notif.id)}
                                className={`p-2.5 text-[11px] leading-snug cursor-pointer transition-colors hover:bg-neutral-slate-50 flex items-start gap-2 relative ${
                                  !notif.read ? "bg-teal-50/10 font-medium" : ""
                                }`}
                              >
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 shrink-0" />
                                )}
                                <div>
                                  <p className="font-bold text-secondary text-xs">{notif.title}</p>
                                  <p className="text-neutral-slate-500 mt-0.5">{notif.message}</p>
                                  <p className="text-[9px] text-neutral-slate-400 mt-1 font-sans font-semibold">
                                    {new Date(notif.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="hidden sm:flex flex-col text-right">
                  <span className="font-display text-xs font-bold text-secondary leading-none">
                    {currentUser.email.split("@")[0]}
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-neutral-slate-400 mt-1">
                    {currentUser.role} Account
                  </span>
                </div>

                <button
                  onClick={() => {
                    logout();
                    setCandidateView("workspace");
                  }}
                  className="p-2 border border-neutral-slate-200 text-neutral-slate-500 hover:text-red-500 hover:bg-neutral-slate-50 rounded-lg transition-all cursor-pointer"
                  title="Logout Session"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTriggerAuth("employer", "signin")}
                  className="hidden sm:inline-flex hover:bg-neutral-slate-100 text-neutral-slate-600 px-3 py-2 font-display text-xs font-bold rounded-lg transition-all cursor-pointer"
                >
                  Recruiter Entrance
                </button>
                <button
                  onClick={() => handleTriggerAuth("candidate", "signin")}
                  className="hover:bg-neutral-slate-100 text-neutral-slate-700 px-3.5 py-2 font-display text-xs font-bold rounded-lg transition-all cursor-pointer border border-neutral-slate-200"
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleTriggerAuth("candidate", "signup")}
                  className="bg-primary hover:bg-primary-hover text-white px-4 py-2 font-display text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm"
                >
                  Register Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {currentUser && !currentUser.emailVerified && currentUser.role !== "admin" && (
        <div className="bg-amber-50 border-b border-amber-200 py-3.5 px-gutter text-left">
          <div className="max-w-container-max mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-750 shrink-0">
                <ShieldAlert size={14} className="text-amber-800" />
              </div>
              <div>
                <p className="font-display font-bold text-amber-950 leading-tight">
                  Verify your email address (<span className="underline font-mono font-semibold">{currentUser.email}</span>)
                </p>
                <p className="font-sans text-[11px] text-amber-700 mt-0.5 leading-snug">
                  Please click the link inside the verification email we've sent to activate your account and unlock high-level platform privileges.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={resendVerificationEmail}
                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-display font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer shadow-xs"
              >
                Resend Activation Email
              </button>
              <button
                onClick={() => setMailboxOpen(true)}
                className="bg-white hover:bg-amber-100/40 border border-amber-200 text-amber-800 text-[10px] font-display font-bold py-1.5 px-3 rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1"
              >
                <Mail size={12} /> Open Demo Webmail
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 bg-slate-50 w-full">
        {(() => {
          if (!currentUser) {
            return <PublicPortal onOpenAuthModal={handleTriggerAuth} />;
          }

          if (currentUser.role === "candidate") {
            return candidateView === "workspace"
              ? <CandidateWorkspace />
              : <div className="space-y-4">
                  <div className="bg-primary text-white py-6">
                    <div className="max-w-container-max mx-auto px-gutter text-left">
                      <h3 className="font-display text-lg sm:text-xl font-extrabold tracking-tight">
                        Active Opportunity Directory
                      </h3>
                      <p className="font-sans text-xs text-teal-100 mt-1 leading-tight">
                        Bookmark and apply instantly utilizing your pre-seeded account profile.
                      </p>
                    </div>
                  </div>
                  <PublicPortal onOpenAuthModal={handleTriggerAuth} hideHero={true} />
                </div>;
          }

          if (currentUser.role === "employer") {
            return <EmployerWorkspace />;
          }

          if (currentUser.role === "admin") {
            return <AdminWorkspace />;
          }

          return <PublicPortal onOpenAuthModal={handleTriggerAuth} />;
        })()}
      </main>

      <footer className="bg-white border-t border-neutral-slate-200/60 py-8">
        <div className="max-w-container-max mx-auto px-gutter text-center space-y-4">
          <div className="flex justify-center items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center font-bold text-white font-display text-xs tracking-wide">
              CB
            </div>
            <span className="font-display text-xs font-extrabold text-secondary">
              CareerBridge India Private Limited
            </span>
          </div>
          <p className="font-sans text-[11px] text-neutral-slate-400 leading-relaxed max-w-sm mx-auto">
            India's premier digital talent matching portal connecting engineering graduates, developers, and high-growth startups.
          </p>
        </div>
      </footer>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialRole={authRole}
        initialTab={authTab}
      />

      <div className="fixed bottom-4 left-4 z-40">
        <button
          onClick={() => setMailboxOpen(true)}
          className="bg-slate-900 border border-slate-850 hover:bg-slate-800 text-slate-100 py-2.5 px-4 rounded-xl shadow-2xl flex items-center gap-2 text-xs font-display font-bold cursor-pointer transition-all hover:scale-105 active:scale-95"
        >
          <div className="relative">
            <Mail size={13} className="text-teal-400" />
            {simulatedEmails && simulatedEmails.length > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-teal-400 border border-slate-900 animate-pulse" />
            )}
          </div>
          <span>Mail Sandbox ({simulatedEmails ? simulatedEmails.length : 0})</span>
        </button>
      </div>

      <AnimatePresence>
        {mailboxOpen && (
          <SimulatedMailbox
            isOpen={mailboxOpen}
            onClose={() => setMailboxOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activationResult && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-display">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border rounded-xl shadow-2xl p-6 max-w-sm w-full text-center space-y-4 border-neutral-slate-200"
            >
              <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white ${
                activationResult.success ? "bg-primary" : "bg-red-500"
              }`}>
                {activationResult.success ? <Check size={22} /> : <X size={22} />}
              </div>
              <h3 className="font-extrabold text-lg text-slate-800">
                {activationResult.success ? "Email Confirmed!" : "Verification Failed"}
              </h3>
              <p className="font-sans text-[11px] text-slate-500 leading-relaxed">
                {activationResult.message}
              </p>
              <button
                onClick={() => setActivationResult(null)}
                className="bg-primary hover:bg-primary-hover text-white text-xs font-display font-semibold py-2 rounded-lg transition-all cursor-pointer shadow-sm w-full"
              >
                Enter Workspace
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  return (
    <JobPortalProvider>
      <AppContent />
    </JobPortalProvider>
  );
}