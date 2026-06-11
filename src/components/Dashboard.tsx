import React, { useState } from "react";
import { 
  BarChart2, 
  Calendar, 
  CheckCircle2, 
  FileSpreadsheet, 
  AlertTriangle,
  Mail,
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  Check
} from "lucide-react";
import { Quest, SyncedCalendarEvent, AuditLogEntry } from "../types";

interface DashboardProps {
  quests: Quest[];
  calendarEvents: SyncedCalendarEvent[];
  onSyncCalendar: () => void;
  syncCalendarLoading: boolean;
  isGoogleConnected: boolean;
  isOutlookConnected: boolean;
  onConnectCalendar: (source: "google" | "outlook") => void;
  sheetsUrl: string;
  onSheetsUrlChange: (url: string) => void;
  isSheetsConnected: boolean;
  onConnectSheets: () => void;
  auditLogs: AuditLogEntry[];
  onTriggerMockOutlookSync: () => void;
  onImportEventAsQuest: (event: SyncedCalendarEvent) => void;
}

export default function Dashboard({
  quests,
  calendarEvents,
  onSyncCalendar,
  syncCalendarLoading,
  isGoogleConnected,
  isOutlookConnected,
  onConnectCalendar,
  sheetsUrl,
  onSheetsUrlChange,
  isSheetsConnected,
  onConnectSheets,
  auditLogs,
  onTriggerMockOutlookSync,
  onImportEventAsQuest
}: DashboardProps) {
  
  const [outlookMailSyncActive, setOutlookMailSyncActive] = useState(false);
  const [spreadsheetId, setSpreadsheetId] = useState("");

  // Compute stats
  const totalQuests = quests.length;
  const completedQuests = quests.filter((q) => q.status === "completed").length;
  const percentCompleted = totalQuests > 0 ? Math.round((completedQuests / totalQuests) * 100) : 0;
  
  const aiGeneratedCount = quests.filter((q) => q.isAIGenerated).length;
  
  // Total XP currently in board
  const totalXPEarned = quests
    .filter((q) => q.status === "completed")
    .reduce((acc, q) => acc + q.xpReward, 0);

  // Check Bottlenecks: Uncompleted quests due in less than 48 hours
  const upcomingBottlenecks = quests.filter((q) => {
    if (q.status === "completed") return false;
    const dueDate = new Date(q.deadline);
    const timeDiff = dueDate.getTime() - Date.now();
    const daysDiff = timeDiff / (1000 * 3605 * 24);
    
    // Bottleneck if deadline is close (less than 2.5 days) and has uncompleted subtasks (or priority is high)
    const hasUncompletedSubtasks = q.subTasks.length > 0 && q.subTasks.some(t => !t.completed);
    return daysDiff >= 0 && daysDiff <= 2.5 && (hasUncompletedSubtasks || q.priority === "high");
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* SECTION 1: Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Card 1: Completed Quests */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Completed Quests</span>
            <div className="text-2xl font-bold font-mono text-white">{completedQuests}/{totalQuests}</div>
            <div className="text-[10px] text-indigo-400 font-mono font-medium flex items-center">
              <TrendingUp className="h-3 w-3 mr-0.5" />
              <span>{percentCompleted}% Completion Rate</span>
            </div>
          </div>
          <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>

        {/* Card 2: Cumulative Experience gained */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium font-sans">Total Wealth Earned</span>
            <div className="text-2xl font-bold font-mono text-emerald-400">{totalXPEarned} XP</div>
            <div className="text-[10px] text-emerald-400/85 font-mono">Accumulated from mapped actions</div>
          </div>
          <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400">
            <Clock className="h-6 w-6" />
          </div>
        </div>

        {/* Card 3: AI Decompositions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">AI Project Cascades</span>
            <div className="text-2xl font-bold font-mono text-indigo-300">{aiGeneratedCount} Goals</div>
            <div className="text-[10px] text-slate-500">Decomposed through Gemini 3.5</div>
          </div>
          <div className="bg-slate-800 p-3 rounded-xl text-indigo-300">
            <Sparkles className="h-6 w-6" />
          </div>
        </div>

        {/* Card 4: Daily Work streak */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-medium">Workspace Audit logs</span>
            <div className="text-2xl font-bold font-mono text-indigo-400">{auditLogs.length} Records</div>
            <div className="text-[10px] text-indigo-400">Registered and queued to sheet</div>
          </div>
          <div className="bg-indigo-500/10 p-3 rounded-xl text-indigo-400">
            <FileSpreadsheet className="h-6 w-6" />
          </div>
        </div>

      </div>

      {/* High Density Performance Meter & Flow State Analyzer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-slide-in" style={{ animationDelay: "150ms" }}>
        <div className="md:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest flex items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-450 mr-2 animate-pulse"></span>
                Action Flow State Velocity
              </h4>
              <p className="text-[10px] text-slate-500 font-sans">Active daily task milestones & deep engagement indexing</p>
            </div>
            <span className="text-[10px] font-mono font-bold text-indigo-400 bg-indigo-550/10 px-2.5 py-1 rounded border border-indigo-500/30">
              OPTIMUM WORKFLOW: +12% RESISTANCE REDUCTION
            </span>
          </div>

          <div className="h-28 flex items-end justify-between gap-2.5 mb-2 px-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
            <div className="w-full bg-slate-800 rounded-t h-[20%] transition-all duration-300 hover:bg-slate-700" title="Monday: 20% Focus"></div>
            <div className="w-full bg-indigo-500/30 rounded-t h-[45%] transition-all duration-300 hover:bg-indigo-500/50" title="Tuesday: 45% Focus"></div>
            <div className="w-full bg-slate-800 rounded-t h-[30%] transition-all duration-300 hover:bg-slate-700" title="Wednesday: 30% Focus"></div>
            <div className="w-full bg-indigo-500/60 rounded-t h-[65%] transition-all duration-300 hover:bg-indigo-500/80" title="Thursday: 65% Focus"></div>
            <div className="w-full bg-indigo-500 rounded-t h-[80%] transition-all duration-300 hover:bg-indigo-400" title="Friday: 80% Focus"></div>
            <div className="w-full bg-indigo-400 rounded-t h-[95%] transition-all duration-300 hover:bg-indigo-300" title="Saturday: 95% Focus"></div>
            <div className="w-full bg-emerald-500 rounded-t h-[100%] transition-all duration-300 hover:bg-emerald-400 animate-pulse" title="Sunday: 100% Ultimate Focus"></div>
          </div>
          <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-wider px-2">
            <span>MON (20xp)</span>
            <span>TUE (45xp)</span>
            <span>WED (30xp)</span>
            <span>THU (65xp)</span>
            <span>FRI (80xp)</span>
            <span>SAT (95xp)</span>
            <span>SUN ({totalXPEarned}xp max)</span>
          </div>
        </div>

        <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest">
              DIAGNOSTICS & TELEMETRY
            </h4>
            <p className="text-[10px] text-slate-500">Live operational diagnostics summary</p>
          </div>
          <div className="space-y-2.5 font-mono text-[10px] text-slate-400">
            <div className="flex justify-between">
              <span>PROCRASTINATION LEVEL:</span>
              <span className="text-emerald-400 font-bold">LOW (14%)</span>
            </div>
            <div className="flex justify-between">
              <span>WORKFLOW SYNC LATENCY:</span>
              <span className="text-indigo-400 font-bold">1.2ms (IDEAL)</span>
            </div>
            <div className="flex justify-between">
              <span>ACTIVE SHIELD BUFFER:</span>
              <span className="text-amber-400 font-bold">DEPLOYED</span>
            </div>
            <div className="flex justify-between">
              <span>FEEDBACK COMS:</span>
              <span className="text-cyan-400 font-bold">ONLINE</span>
            </div>
          </div>
          <div className="text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-800 flex items-center justify-between">
            <span>UPTIME: 99.98%</span>
            <span>ID: {quests[0]?.id || "WORK-ID"}</span>
          </div>
        </div>
      </div>

      {/* SECTION 2: Grid Content (Bottlenecks, Calendar Link, Sheets Reporting) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMN A: Calendar dead-lines & Milestones Sync (Span 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-200 flex items-center">
                <Calendar className="h-5 w-5 text-indigo-400 mr-2" />
                Deadlines & Calendar Sync
              </h3>
              <p className="text-xs text-slate-500">Import milestones instantly from Google/Outlook</p>
            </div>

            <button
              onClick={onSyncCalendar}
              disabled={syncCalendarLoading || (!isGoogleConnected && !isOutlookConnected)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-1.5 transition duration-150 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${syncCalendarLoading ? "animate-spin" : ""}`} />
              <span>{syncCalendarLoading ? "Retrieving..." : "Sync Platforms"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Google Calendar Linker */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Google Calendar
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  {isGoogleConnected ? "✓ Connected & Synced" : "OAuth permission loaded"}
                </p>
              </div>

              {!isGoogleConnected ? (
                <button
                  onClick={() => onConnectCalendar("google")}
                  className="p-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition duration-150 cursor-pointer"
                >
                  Connect Active
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Linked
                </span>
              )}
            </div>

            {/* Outlook Calendar Linker */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 mr-2"></span>
                  Outlook Platform
                </h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  {isOutlookConnected ? "✓ Syncing Events" : "Establish manual synchronization"}
                </p>
              </div>

              {!isOutlookConnected ? (
                <button
                  onClick={() => onConnectCalendar("outlook")}
                  className="p-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg transition duration-150 cursor-pointer"
                >
                  Authorize Check
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Linked
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">Active Synced Timeline</h4>
            
            {calendarEvents.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-slate-950 p-4 rounded-xl text-center border border-dashed border-slate-800">
                No events loaded. Grant workspace access or activate synchers above to load real milestones.
              </p>
            ) : (
              <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800 max-h-56 overflow-y-auto">
                {calendarEvents.map((evt) => (
                  <div key={evt.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-900/50 transition">
                    <div className="space-y-1">
                      <div className="font-semibold text-slate-200 flex items-center">
                        <span className={`w-2 h-2 rounded-full mr-2 ${evt.source === "google" ? "bg-blue-500" : "bg-cyan-500"}`}></span>
                        {evt.title}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Date: {evt.start.split("T")[0]} | Platform: <span className="capitalize">{evt.source}</span>
                      </div>
                    </div>

                    {!evt.importedAsQuest ? (
                      <button
                        onClick={() => onImportEventAsQuest(evt)}
                        className="text-[10px] px-2.5 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded hover:bg-indigo-500 hover:text-white transition cursor-pointer font-semibold"
                      >
                        Map to Board
                      </button>
                    ) : (
                      <span className="text-[9px] text-slate-500 flex items-center font-mono">
                        <Check className="h-3 w-3 text-emerald-400 mr-0.5" />
                        Mapped
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMN B: Upcoming Bottlenecks & Potential Delays (Span 5) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Bottlenecks Warning Panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-200 flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                Bottleneck Radar
              </h3>
              <p className="text-xs text-slate-500 font-sans">Automated AI diagnostics tracking delay trends</p>
            </div>

            {upcomingBottlenecks.length === 0 ? (
              <div className="bg-emerald-950/10 border border-emerald-500/10 text-emerald-400 p-4 rounded-xl text-xs flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2 shrink-0 text-emerald-500" />
                <span>Looking great! No upcoming deadlines are flagged as high risk for bottleneck parameters.</span>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {upcomingBottlenecks.map((bq) => (
                  <div key={bq.id} className="bg-rose-950/10 border border-rose-500/20 text-rose-300 p-3.5 rounded-xl text-xs space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="font-bold leading-snug">{bq.title}</span>
                      <span className="text-[9px] shrink-0 font-mono text-rose-400 uppercase tracking-widest bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded leading-none">
                        CRITICAL DUE
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      Target deadline is slated for {bq.deadline}. Zero sub-tasks are currently recorded as complete. Procrastination mitigation suggested.
                    </p>
                    <div className="flex justify-between items-center text-[9px] text-rose-400 font-mono font-bold">
                      <span>Action Recommended</span>
                      <span>Estimated {bq.xpReward} XP Lost if neglected</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connect Sheets, Outlook to Sheets Sync config */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-200 flex items-center">
                <FileSpreadsheet className="h-4.5 w-4.5 text-emerald-400 mr-2" />
                Audit Logs setup
              </h3>
              <p className="text-xs text-slate-500">Automate syncing workspace state of communications</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-1">Spreadsheet Target Id</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-300 outline-none placeholder-slate-700 focus:border-emerald-500/55"
                    placeholder="e.g. 1uK9P9o8gQj_S61YshvL_m683..."
                    value={sheetsUrl}
                    onChange={(e) => onSheetsUrlChange(e.target.value)}
                  />
                  <button
                    onClick={onConnectSheets}
                    className={`px-3 bg-emerald-700 hover:bg-emerald-600 rounded-lg font-bold transition duration-150 cursor-pointer ${
                      isSheetsConnected ? "bg-emerald-800 border border-emerald-500/30 text-white" : ""
                    }`}
                  >
                    {isSheetsConnected ? "Connected" : "Apply"}
                  </button>
                </div>
              </div>

              {/* Outlook email to sheets sync trigger */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-300 flex items-center">
                    <Mail className="h-3.5 w-3.5 text-cyan-400 mr-1.5" />
                    Mail-Communications Sync
                  </h4>
                  <p className="text-[9px] text-slate-500 mt-1">
                    Route incoming Outlook communications directly into Google Sheets workbooks
                  </p>
                </div>

                <button
                  onClick={() => {
                    setOutlookMailSyncActive(!outlookMailSyncActive);
                    onTriggerMockOutlookSync();
                  }}
                  className={`p-1 px-3 rounded-lg text-[10px] font-bold transition ${
                    outlookMailSyncActive 
                      ? "bg-purple-600/20 border border-purple-500/30 text-purple-300" 
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                  }`}
                >
                  {outlookMailSyncActive ? "Synced Live" : "Connect Sync"}
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION 3: Workspace Audit Stream */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
        <h3 className="text-base font-bold text-slate-200 mb-2 flex items-center">
          <Sliders className="h-5 w-5 text-indigo-400 mr-2" />
          Workspace Audit Log Stream
        </h3>
        <p className="text-xs text-slate-500 mb-4">Every gamified advancement, level increment, and sync trigger logged securely for independent audits</p>

        <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-800 max-h-48 overflow-y-auto">
          {auditLogs.length === 0 ? (
            <p className="text-xs text-slate-600 italic text-center py-6 leading-relaxed">No actions logged in current runtime frame yet.</p>
          ) : (
            auditLogs.map((log) => (
              <div key={log.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-900/30">
                <div className="space-y-1">
                  <div className="text-slate-300 font-mono text-[11px]">{log.action}</div>
                  <div className="text-[10px] text-slate-500">{log.details}</div>
                </div>
                <div className="text-right space-y-1">
                  <span className="text-[10px] text-slate-500 block font-mono">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`text-[9px] leading-none px-2 py-0.5 rounded-full font-mono uppercase inline-block border ${
                    log.syncedToSheets 
                      ? "bg-emerald-500/5 border-emerald-500/35 text-emerald-400" 
                      : "bg-slate-800 border-slate-700 text-slate-500"
                  }`}>
                    {log.syncedToSheets ? "Synced to Sheets" : "Local State Only"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
