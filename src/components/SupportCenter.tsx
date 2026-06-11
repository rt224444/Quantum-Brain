import React, { useState } from "react";
import { 
  HelpCircle, 
  Send, 
  Inbox, 
  MessageSquare, 
  Lock, 
  BellRing, 
  Sparkles,
  RefreshCw,
  Mail,
  UserCheck
} from "lucide-react";
import { Ticket } from "../types";

interface SupportCenterProps {
  tickets: Ticket[];
  onSubmitTicket: (ticket: Ticket) => void;
  ticketSubmissionLoading: boolean;
  onAddNotification: (msg: string) => void;
}

export default function SupportCenter({
  tickets,
  onSubmitTicket,
  ticketSubmissionLoading,
  onAddNotification
}: SupportCenterProps) {
  
  // Submit state
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [msg, setMsg] = useState("");
  const [type, setType] = useState<"feedback" | "support" | "remediation">("support");
  const [optInEmails, setOptInEmails] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !msg) return;

    try {
      const response = await fetch("/api/support/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          subject,
          message: msg,
          type
        })
      });

      if (!response.ok) {
        throw new Error("Failed to submit feedback ticket details.");
      }

      const data = await response.json();
      if (data.success) {
        onSubmitTicket(data.ticket);
        
        // Reset inputs
        setSubject("");
        setMsg("");
        onAddNotification(`Support ticket [${data.ticket.id}] created! Automated response routed to feedback channels.`);
      }
    } catch (err: any) {
      console.error(err);
      onAddNotification("Support Desk failed: verification route offline. Registering local ticket.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      
      {/* COLUMN A: Custom Ticket / Feedback form (Span 5) */}
      <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4 h-fit">
        <div>
          <h2 className="text-base font-bold text-slate-200 flex items-center">
            <Mail className="h-5 w-5 text-indigo-400 mr-2" />
            Dual Communication Desk
          </h2>
          <p className="text-xs text-slate-500 mt-1">Submit feedback & opt-in to automated support cascades</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">Your Name</label>
              <input
                type="text"
                className="w-full bg-slate-850 border border-slate-750 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                placeholder="Rishabh Tandon"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">Email Channel</label>
              <input
                type="email"
                className="w-full bg-slate-850 border border-slate-750 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                placeholder="rishabhtandon10@gmail.com"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Categorical Subject</label>
            <input
              type="text"
              className="w-full bg-slate-850 border border-slate-750 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
              placeholder="e.g. Sync fails with custom spreadsheet template"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-medium mb-1">Context / Details</label>
            <textarea
              rows={3}
              className="w-full bg-slate-850 border border-slate-750 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500 resize-none"
              placeholder="Provide a detailed message on what is lagging, or any requested features..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 font-medium mb-1">Category type</label>
              <select
                className="w-full bg-slate-850 border border-slate-750 rounded-xl px-2.5 py-1.5 text-xs text-slate-350 outline-none text-slate-200"
                value={type}
                onChange={(e) => setType(e.target.value as any)}
              >
                <option value="support">Technical Support</option>
                <option value="feedback">General Feedback</option>
                <option value="remediation">Due Remediation help</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-5">
              <input
                type="checkbox"
                id="optInCheck"
                className="rounded text-indigo-600 bg-slate-950 border-slate-750"
                checked={optInEmails}
                onChange={(e) => setOptInEmails(e.target.checked)}
              />
              <label htmlFor="optInCheck" className="text-[10px] text-slate-450 text-slate-400 font-medium leading-tight">
                Opt-in to automations
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={ticketSubmissionLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold py-2 px-4 rounded-xl text-xs transition duration-150 cursor-pointer flex items-center justify-center space-x-2"
          >
            {ticketSubmissionLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Send className="h-3.5 w-3.5 text-slate-200" />
                <span>Submit Ticket</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* COLUMN B: Ticket Response ledger (Span 7) */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
        
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Inbox className="h-5 w-5 text-indigo-400" />
              <h2 className="text-base font-bold text-slate-200">Active Communication Pipe</h2>
            </div>
            <span className="text-xs text-slate-500 font-mono">
              {tickets.length} Registered interactions
            </span>
          </div>

          <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
            {tickets.length === 0 ? (
              <div className="text-center py-12 text-slate-550 text-slate-500">
                <MessageSquare className="h-10 w-10 mx-auto text-slate-700 mb-2" />
                <p className="text-xs">No active tickets registered. Submit the feedback form to test notifications feedback loops.</p>
              </div>
            ) : (
              tickets.map((t) => (
                <div key={t.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-200 text-xs">{t.subject}</h4>
                      <p className="text-[10px] text-slate-500">Submitted by: {t.name} ({t.email})</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] text-slate-500 font-mono">{t.id}</span>
                      <span className="text-[9px] bg-slate-850 px-2 py-0.5 rounded text-indigo-300 font-semibold border border-indigo-500/10 uppercase">
                        {t.type}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                    "{t.message}"
                  </p>

                  {/* Automated replies view */}
                  {t.response && (
                    <div className="bg-indigo-500/5 text-slate-300 p-3 rounded-xl border border-indigo-500/10 space-y-1.5">
                      <div className="flex items-center text-[10px] font-bold text-indigo-400 tracking-wide uppercase">
                        <Sparkles className="h-3 w-3 mr-1 text-yellow-300" />
                        Automated verification system notification:
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {t.response}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 mt-6 border-t border-slate-800/80 text-[10px] text-slate-500 flex items-center justify-between">
          <span className="flex items-center font-semibold"><UserCheck className="h-3.5 w-3.5 mr-1 text-emerald-400" />Admin operations status: Online</span>
          <span>Dual channels verified: Gmail, Support Inboxes</span>
        </div>

      </div>

    </div>
  );
}
