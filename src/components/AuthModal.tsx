import React, { useState } from "react";
import { useJobPortal } from "./JobPortalContext";
import { UserRole } from "../types";
import { motion } from "motion/react";
import { X, Mail, Shield, User, Building, UserCircle } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialRole?: UserRole;
  initialTab?: "signin" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialRole = "candidate",
  initialTab = "signin"
}) => {
  const { login, signup } = useJobPortal();

  const [activeTab, setActiveTab] = useState<"signin" | "signup">(initialTab);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  
  // Sign In values
  const [signInEmail, setSignInEmail] = useState("");
  const [errorText, setErrorText] = useState("");

  // Sign Up values
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpFullName, setSignUpFullName] = useState("");
  const [signUpRoleType, setSignUpRoleType] = useState<"student" | "fresher" | "experienced">("experienced");

  React.useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setSelectedRole(initialRole);
      setErrorText("");
    }
  }, [isOpen, initialTab, initialRole]);

  // Quick sandbox accounts seed profiles
  const sandboxes = [
    { name: "Diana Prince (Candidate)", email: "diana.prince@gmail.com", role: "candidate" as UserRole, desc: "Technical system architect portfolio" },
    { name: "Bruce Wayne (Employer)", email: "bruce@wayne.corp", role: "employer" as UserRole, desc: "Wayne Enterprises hiring pipeline" },
    { name: "Amanda Waller (Platform Admin)", email: "amanda@careerbridge.gov", role: "admin" as UserRole, desc: "Censors, flags & verifications dashboard" }
  ];

  if (!isOpen) return null;

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    const response = login(signInEmail.trim(), undefined, selectedRole);
    if (response.success) {
      onClose();
    } else {
      setErrorText(response.error || "Authentication parameters rejected.");
    }
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!signUpEmail.trim() || !signUpFullName.trim()) {
      setErrorText("Provide both unique email and fullName details.");
      return;
    }

    signup(signUpEmail.trim(), signUpFullName.trim(), selectedRole, selectedRole === "candidate" ? signUpRoleType : undefined);
    onClose();
  };

  const triggerQuickLogin = (email: string, role: UserRole) => {
    setSelectedRole(role);
    const res = login(email, undefined, role);
    if (res.success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-secondary/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-display">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.15 }}
        className="bg-white border text-left rounded-xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col md:grid md:grid-cols-12 max-h-[90vh] md:max-h-none overflow-y-auto border-neutral-slate-200"
      >
        {/* Left Column information sidebar */}
        <div className="bg-secondary text-white p-6 md:col-span-4 flex flex-col justify-between">
          <div className="space-y-4 text-left">
            <h3 className="font-extrabold text-lg sm:text-xl tracking-tight leading-none">CareerBridge</h3>
            <p className="font-sans text-[11px] text-neutral-slate-350 leading-relaxed">
              Verify credentials, engage direct chats, and coordinate active ATS stages on Zurich's modern hiring ecosystem.
            </p>
          </div>

          {/* Quick seeded shortcut logins */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5">
            <span className="text-[9px] uppercase font-bold text-primary tracking-wider block">Sandbox Quick Swaps</span>
            {sandboxes.map((sb, sbIdx) => (
              <div 
                key={sbIdx}
                onClick={() => triggerQuickLogin(sb.email, sb.role)}
                className="bg-white/5 border border-white/10 hover:bg-white/10 p-2.5 rounded-lg text-left cursor-pointer transition-all space-y-0.5"
              >
                <p className="font-semibold text-[11px] truncate">{sb.name}</p>
                <p className="font-sans text-[9px] text-neutral-slate-400 truncate leading-none">{sb.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Tab signin / signup */}
        <div className="p-8 md:col-span-8 flex flex-col justify-between relative">
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 text-neutral-slate-400 hover:text-secondary cursor-pointer"
          >
            <X size={18} />
          </button>

          <div className="space-y-6">
            {/* Tabs */}
            <div className="flex border-b border-neutral-slate-100">
              <button 
                onClick={() => { setActiveTab("signin"); setErrorText(""); }}
                className={`pb-2.5 font-bold text-xs sm:text-sm mr-4 tracking-tight border-b-2 transition-all ${
                  activeTab === "signin" ? "border-primary text-secondary" : "border-transparent text-neutral-slate-400"
                }`}
              >
                Authenticate Identity
              </button>
              <button 
                onClick={() => { setActiveTab("signup"); setErrorText(""); }}
                className={`pb-2.5 font-bold text-xs sm:text-sm tracking-tight border-b-2 transition-all ${
                  activeTab === "signup" ? "border-primary text-secondary" : "border-transparent text-neutral-slate-400"
                }`}
              >
                Register profile
              </button>
            </div>

            {/* Role select indicators */}
            <div className="space-y-1.5 text-left">
              <label className="block text-[10px] font-bold text-neutral-slate-500 uppercase tracking-wider">Access Scope Selection</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: "candidate" as UserRole, label: "Candidate", icon: User },
                  { role: "employer" as UserRole, label: "Employer", icon: Building },
                  { role: "admin" as UserRole, label: "Platform Admin", icon: Shield }
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.role}
                      type="button"
                      onClick={() => setSelectedRole(item.role)}
                      className={`py-2 px-1 text-center rounded border transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${
                        selectedRole === item.role 
                          ? "border-primary bg-teal-50/10 text-primary font-bold" 
                          : "border-neutral-slate-200 bg-neutral-slate-50 text-neutral-slate-600 hover:bg-neutral-slate-100"
                      }`}
                    >
                      <Icon size={14} />
                      <span className="font-sans text-[10px] sm:text-[10px] truncate w-full">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {errorText && (
              <p className="bg-red-50 border border-red-200 text-red-650 p-2.5 rounded font-sans text-xs font-semibold text-center leading-tight">
                {errorText}
              </p>
            )}

            {/* TAB: SIGN IN FORM */}
            {activeTab === "signin" ? (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div className="text-left font-sans">
                  <label className="block text-xs font-bold text-neutral-slate-600 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-neutral-slate-400" size={14} />
                    <input 
                      required
                      type="email" 
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. email@careerbridge.gov"
                      className="border outline-none pl-9 pr-4 py-2 bg-neutral-slate-50 rounded-lg text-xs w-full focus:bg-white focus:ring-1 focus:ring-primary border-neutral-slate-200"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-display font-semibold py-2.5 rounded-lg w-full transition-all cursor-pointer shadow-sm"
                >
                  Verify Access Clearance
                </button>
              </form>
            ) : (
              /* TAB: SIGN UP FORM */
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4 text-left font-sans">
                  <div>
                    <label className="block text-xs font-bold text-neutral-slate-600 mb-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      value={signUpFullName}
                      onChange={(e) => setSignUpFullName(e.target.value)}
                      placeholder="e.g. Diana Prince"
                      className="border outline-none px-3.5 py-2 bg-neutral-slate-50 rounded-lg text-xs w-full focus:bg-white focus:ring-1 focus:ring-primary border-neutral-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-slate-600 mb-1">Email Address</label>
                    <input 
                      required
                      type="email" 
                      value={signUpEmail}
                      onChange={(e) => setSignUpEmail(e.target.value)}
                      placeholder="e.g. prince@gmail.com"
                      className="border outline-none px-3.5 py-2 bg-neutral-slate-50 rounded-lg text-xs w-full focus:bg-white focus:ring-1 focus:ring-primary border-neutral-slate-200"
                    />
                  </div>
                </div>

                {selectedRole === "candidate" && (
                  <div className="text-left font-sans">
                    <label className="block text-xs font-bold text-neutral-slate-600 mb-1">Candidate Profile Track</label>
                    <select 
                      value={signUpRoleType}
                      onChange={(e) => setSignUpRoleType(e.target.value as any)}
                      className="w-full border px-3.5 py-2 bg-neutral-slate-50 rounded-lg text-xs outline-none focus:ring-1 focus:ring-primary border-neutral-slate-200"
                    >
                      <option value="student">Student / Academic Track</option>
                      <option value="fresher">Entry/Fresher Track</option>
                      <option value="experienced">Experienced professional track</option>
                    </select>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="bg-primary hover:bg-primary-hover text-white text-xs font-display font-semibold py-2.5 rounded-lg w-full transition-all cursor-pointer shadow-sm"
                >
                  Create & Initialize account
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
