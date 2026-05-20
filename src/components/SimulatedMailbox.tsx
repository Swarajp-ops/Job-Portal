import React, { useState } from "react";
import { useJobPortal } from "./JobPortalContext";
import { X, Mail, MailOpen, Trash2, Clock, CheckCircle, ExternalLink, Inbox, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SimulatedMailboxProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulatedMailbox: React.FC<SimulatedMailboxProps> = ({ isOpen, onClose }) => {
  const { simulatedEmails, verifyEmailToken, clearSimulatedEmails, currentUser } = useJobPortal();
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeEmail = simulatedEmails.find((e) => e.id === selectedEmailId) || simulatedEmails[0];

  const handleClear = () => {
    clearSimulatedEmails();
    setSelectedEmailId(null);
  };

  const copyToClipboard = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleVerifyDirectly = (token: string) => {
    const res = verifyEmailToken(token);
    if (res.success) {
      alert("Success! Account has been verified directly in sandbox storage.");
    } else {
      alert(res.message || "Failed to verify token.");
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 font-display transition-all">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="bg-slate-900 border border-slate-800 text-slate-100 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:grid md:grid-cols-12 h-[80vh]"
      >
        {/* Sidebar Email Headers index list */}
        <div className="md:col-span-4 bg-slate-950 border-r border-slate-800 flex flex-col h-full overflow-hidden">
          {/* Header area in mail app */}
          <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Mail className="text-teal-400" size={16} />
              <span className="font-bold text-xs tracking-tight text-white uppercase">Corporate Mailbox Server</span>
            </div>
            {simulatedEmails.length > 0 && (
              <button
                onClick={handleClear}
                className="text-slate-400 hover:text-red-400 p-1.5 rounded hover:bg-slate-800 transition"
                title="Wipe Outbox"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>

          {/* Email Lists */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-850/50">
            {simulatedEmails.length === 0 ? (
              <div className="py-12 px-4 text-center text-slate-550 space-y-2">
                <Inbox className="mx-auto text-slate-700" size={28} />
                <p className="font-sans text-[11px]">Mail sandbox queue is empty.</p>
                <p className="font-sans text-[9px] text-slate-500 leading-normal max-w-[180px] mx-auto">
                  New registration triggers or "Resend" requests will route verified communications payload models here.
                </p>
              </div>
            ) : (
              simulatedEmails.map((eml) => {
                const isSelected = activeEmail && eml.id === activeEmail.id;
                const date = new Date(eml.timestamp);
                return (
                  <div
                    key={eml.id}
                    onClick={() => {
                      setSelectedEmailId(eml.id);
                    }}
                    className={`p-3.5 cursor-pointer text-left transition-colors font-sans border-l-2 ${
                      isSelected
                        ? "bg-slate-900 border-teal-400"
                        : "bg-transparent border-transparent hover:bg-slate-900/50"
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-teal-400 text-[10px] uppercase tracking-wider block">
                        {eml.role === "candidate" ? "Candidate Invite" : "Employer Invite"}
                      </span>
                      <span className="text-[9px] text-slate-500 font-medium">
                        {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="font-bold text-slate-200 text-xs mt-1 truncate">{eml.subject}</p>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">To: {eml.to}</p>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="p-3 bg-slate-950 border-t border-slate-850 text-slate-500 text-[9px] font-sans">
            Connected to <code>no-reply@careerbridge.net</code> Mailer Service
          </div>
        </div>

        {/* Core Mail reading viewer */}
        <div className="md:col-span-8 flex flex-col h-full overflow-hidden bg-slate-900 relative">
          {/* Top header navigation buttons */}
          <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950">
            <span className="font-semibold text-xs text-slate-400 font-sans">Message Inspector Sandbox</span>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X size={15} />
            </button>
          </div>

          {/* Email Canvas display pane */}
          {activeEmail ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Envelope details Header segment */}
              <div className="p-5 border-b border-slate-800/80 bg-slate-950/40 space-y-2 text-left font-sans">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">From:</span>
                  <p className="text-xs font-semibold text-slate-200">
                    CareerBridge Switzerland <code className="text-[10px] text-teal-400 font-normal bg-teal-950/40 px-1.5 py-0.5 rounded border border-teal-850/30">no-reply@careerbridge.net</code>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">To:</span>
                  <p className="text-xs font-semibold text-slate-200">{activeEmail.to}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Subject:</span>
                  <p className="text-xs font-black text-white">{activeEmail.subject}</p>
                </div>
              </div>

              {/* Message Body markup block */}
              <div className="flex-1 p-6 overflow-y-auto text-left font-sans text-xs">
                {/* Visual rich card wrapper representing simulated inbox HTML template */}
                <div className="bg-white text-slate-800 p-8 rounded-xl shadow-lg max-w-xl mx-auto space-y-6 border border-neutral-200">
                  {/* Brand header */}
                  <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                    <div className="w-7 h-7 rounded bg-[#0d9488] flex items-center justify-center font-bold text-white text-xs tracking-wide">
                      CB
                    </div>
                    <span className="font-display text-sm font-extrabold text-[#0f172a] tracking-tight">
                      CareerBridge Switzerland
                    </span>
                  </div>

                  {/* Body greetings */}
                  <div className="space-y-4">
                    <p className="font-bold text-slate-800 text-xs">Verify your new email coordinates</p>
                    <p className="text-slate-600 leading-relaxed text-[11px]">
                      Your account registration was successful. Please click the button below to confirm your address and activate your CareerBridge Switzerland candidate/corporate profile.
                    </p>
                    
                    {/* BUTTON CTA */}
                    <div className="py-2.5 text-center">
                      <a
                        href={`${window.location.origin}${window.location.pathname}?verify_token=${activeEmail.token}`}
                        className="inline-flex items-center gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white text-xs font-display font-bold py-2.5 px-6 rounded-lg shadow-md hover:scale-[1.01] transition-all"
                        onClick={(e) => {
                          // Let's close the mail client tray and trigger verification logic directly so they do not absolutely need a full reload in the preview pane
                          onClose();
                        }}
                      >
                        Confirm & Activate Account <ArrowRight size={13} />
                      </a>
                    </div>

                    <p className="text-slate-500 leading-normal text-[10px] border-t border-slate-150 pt-4">
                      Can't click the CTA button? No worries! Paste this activation URL into your browser directly:
                    </p>
                    <code className="block bg-slate-50 p-2.5 text-[9px] select-all break-all rounded border text-slate-600 font-mono">
                      {`${window.location.origin}${window.location.pathname}?verify_token=${activeEmail.token}`}
                    </code>
                  </div>

                  {/* Manual token entry backup helper */}
                  <div className="bg-teal-50/50 p-3.5 rounded-lg border border-teal-100 space-y-1.5">
                    <p className="text-[10px] font-bold text-[#0d9488] uppercase tracking-wider">Manual Verification Code</p>
                    <div className="flex items-center justify-between">
                      <code className="text-slate-800 font-bold font-mono tracking-wider text-xs">
                        {activeEmail.token}
                      </code>
                      <button
                        onClick={() => copyToClipboard(activeEmail.token)}
                        className="text-[10px] font-bold text-[#0f766e] hover:underline"
                      >
                        {copiedToken === activeEmail.token ? "Copied!" : "Copy Code"}
                      </button>
                    </div>
                  </div>

                  {/* Footer details */}
                  <p className="text-[9px] text-slate-400 leading-normal border-t pt-4">
                    CareerBridge Securities and Access Auditing Services. If you did not trigger this request, please forward comments to <code>sec-ops@careerbridge.net</code>.
                  </p>
                </div>

                {/* Developer debug helper shortcuts pane */}
                <div className="mt-8 border-t border-slate-800 pt-6 max-w-xl mx-auto text-center space-y-3">
                  <div className="flex items-center justify-center gap-1 text-slate-500 text-[10px] font-medium font-sans">
                    <CheckCircle className="text-emerald-500" size={12} /> Sandbox Diagnostic Panel shortcuts
                  </div>
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleVerifyDirectly(activeEmail.token)}
                      className="bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 text-[10px] font-semibold py-1.5 px-3.5 rounded transition cursor-pointer"
                    >
                      Verify email instantly (No URL reload)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-sans space-y-2 p-8">
              <MailOpen size={36} className="text-slate-700" />
              <p className="font-bold text-xs text-slate-400">No message selected</p>
              <p className="text-[10px] text-slate-500 text-center max-w-xs">
                Select a simulated verified communication payload item from the local directory sidebar log list.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
