import React, { useState, useEffect } from "react";
import { 
  Trophy, 
  Flame, 
  Coins, 
  Sparkles, 
  CheckSquare, 
  Timer, 
  BarChart2, 
  CreditCard, 
  HelpCircle,
  Bell,
  AlertTriangle,
  X
} from "lucide-react";
import { 
  Quest, 
  SyncedCalendarEvent, 
  BlockerShield, 
  Ticket, 
  UserStats, 
  PaymentProfile, 
  AuditLogEntry,
  Invoice
} from "./types";
import Navigation from "./components/Navigation";
import QuestBoard from "./components/QuestBoard";
import FocusZone from "./components/FocusZone";
import Dashboard from "./components/Dashboard";
import BillingManager from "./components/BillingManager";
import SupportCenter from "./components/SupportCenter";
import QuantumFlowZone from "./components/QuantumFlowZone";

export default function App() {
  
  // Tab control
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // State initialization with deep LocalStorage caching support
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const cached = localStorage.getItem("fq_stats");
    if (cached) return JSON.parse(cached);
    return {
      level: 1,
      xp: 40,
      xpNext: 100,
      coins: 20,
      streak: 3,
      petLevel: 1,
      petExp: 35,
      petName: "Aura Pandar",
      petHappiness: 80
    };
  });

  const [quests, setQuests] = useState<Quest[]>(() => {
    const cached = localStorage.getItem("fq_quests");
    if (cached) return JSON.parse(cached);
    
    // Default High-procrastination seeded tasks
    return [
      {
        id: "quest-seed-1",
        title: "Break down astrophysic thesis body paragraphs",
        description: "Large complex project showing high procrastination barriers.",
        priority: "high",
        status: "active",
        category: "Study",
        xpReward: 90,
        coinReward: 25,
        deadline: new Date(Date.now() + 172800000).toISOString().split("T")[0], // in 2 days
        isAIGenerated: true,
        subTasks: [
          { id: "sub-1-1", title: "Write introduction hypothesis", completed: false, xpReward: 15, estimatedMinutes: 20 },
          { id: "sub-1-2", title: "Analyze 3 source telescope charts", completed: false, xpReward: 20, estimatedMinutes: 40 },
          { id: "sub-1-3", title: "Detail conclusion telemetry summaries", completed: false, xpReward: 25, estimatedMinutes: 30 }
        ]
      },
      {
        id: "quest-seed-2",
        title: "Structure quarterly revenue spreadsheet audit",
        description: "Submit tax alignment templates immediately.",
        priority: "medium",
        status: "backlog",
        category: "Administrative",
        xpReward: 35,
        coinReward: 12,
        deadline: new Date(Date.now() + 86400000).toISOString().split("T")[0], // tomorrow
        isAIGenerated: false,
        subTasks: []
      },
      {
        id: "quest-seed-3",
        title: "Clean workstation setup",
        description: "Increase productivity by setting up dual visual screens.",
        priority: "low",
        status: "completed",
        category: "Other",
        xpReward: 10,
        coinReward: 4,
        deadline: new Date(Date.now() - 86450000).toISOString().split("T")[0], // yesterday
        isAIGenerated: false,
        subTasks: []
      }
    ];
  });

  const [shields, setShields] = useState<BlockerShield[]>(() => {
    const cached = localStorage.getItem("fq_shields");
    if (cached) return JSON.parse(cached);
    return [
      { id: "shield-1", name: "Social Blocker Dome", description: "Blocks access to Instagram/TikTok triggers", cost: 10, active: false, icon: "🛡️", durationMinutes: 25 },
      { id: "shield-2", name: "Phone Vibe Jammer", description: "Hides mobile push visual overlays", cost: 15, active: false, icon: "📴", durationMinutes: 50 },
      { id: "shield-3", name: "Slack Focus Railing", description: "Silences work workspaces channels ping", cost: 20, active: false, icon: "💬", durationMinutes: 60 }
    ];
  });

  const [calendarEvents, setCalendarEvents] = useState<SyncedCalendarEvent[]>(() => {
    const cached = localStorage.getItem("fq_events");
    if (cached) return JSON.parse(cached);
    return [
      { id: "cal-1", title: "Astro thesis draft final deadline", source: "google", start: new Date(Date.now() + 172800000).toISOString(), end: "", syncedAt: new Date().toISOString(), importedAsQuest: true },
      { id: "cal-2", title: "Quarterly review with audit board", source: "google", start: new Date(Date.now() + 86400000).toISOString(), end: "", syncedAt: new Date().toISOString(), importedAsQuest: false },
      { id: "cal-3", title: "Marketing Strategy Deliverables", source: "outlook", start: new Date(Date.now() + 259200000).toISOString(), end: "", syncedAt: new Date().toISOString(), importedAsQuest: false }
    ];
  });

  const [paymentProfile, setPaymentProfile] = useState<PaymentProfile>(() => {
    const cached = localStorage.getItem("fq_payment");
    if (cached) return JSON.parse(cached);
    return {
      status: "remediation_required",
      reason: "Outstanding Cloud Sheets sync fee invoice failed key renewal.",
      balanceDue: 45,
      paymentMethod: "Visa Premium Token",
      lastRenewalDate: "2026-05-11",
      nextRenewalDate: "2026-07-11",
      unlimitedAIAccess: false,
      invoiceHistory: [
        { id: "INV-902", date: "2026-06-01", amount: 45, status: "failed", description: "Cloud Sync License Tier renewal" },
        { id: "INV-801", date: "2026-05-01", amount: 15, status: "paid", description: "Initial setup support license fee" }
      ]
    };
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const cached = localStorage.getItem("fq_tickets");
    if (cached) return JSON.parse(cached);
    return [];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const cached = localStorage.getItem("fq_audits");
    if (cached) return JSON.parse(cached);
    return [
      { id: "aud-1", timestamp: new Date(Date.now() - 3600000).toISOString(), action: "Initialized Workspace", details: "Local database tables authenticated successfully", syncedToSheets: false }
    ];
  });

  // Simple integrations status
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [isOutlookConnected, setIsOutlookConnected] = useState(false);
  const [isSheetsConnected, setIsSheetsConnected] = useState(false);
  const [sheetsUrl, setSheetsUrl] = useState("");
  const [syncCalendarLoading, setSyncCalendarLoading] = useState(false);
  const [auditSyncInProgress, setAuditSyncInProgress] = useState(false);
  const [ticketSubmissionLoading, setTicketSubmissionLoading] = useState(false);

  // Notifications drawer state
  const [notifications, setNotifications] = useState<string[]>([
    "Welcome to FocusQuest! Map your calendars and trigger Gemini to crush procrastination today."
  ]);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);

  // Write changes to localstorage to avoid lose states on reload
  useEffect(() => {
    localStorage.setItem("fq_stats", JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem("fq_quests", JSON.stringify(quests));
  }, [quests]);

  useEffect(() => {
    localStorage.setItem("fq_shields", JSON.stringify(shields));
  }, [shields]);

  useEffect(() => {
    localStorage.setItem("fq_events", JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem("fq_payment", JSON.stringify(paymentProfile));
  }, [paymentProfile]);

  useEffect(() => {
    localStorage.setItem("fq_tickets", JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem("fq_audits", JSON.stringify(auditLogs));
  }, [auditLogs]);


  // Helpers
  const addNotification = (msg: string) => {
    setNotifications((prev) => [msg, ...prev]);
    setShowNotificationPopup(true);
  };

  const addAuditLog = (action: string, details: string) => {
    const entry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      syncedToSheets: false
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Quests management handlers
  const handleAddQuest = (quest: Quest) => {
    setQuests((prev) => [quest, ...prev]);
    addNotification(`New Quest mapped successfully: "${quest.title}"`);
    addAuditLog("Quest Created", `User created "${quest.title}" under category ${quest.category}`);
  };

  const handleCompleteQuest = (id: string) => {
    const quest = quests.find(q => q.id === id);
    if (!quest) return;

    // Award rewards
    const coinsReward = quest.coinReward;
    const xpReward = quest.xpReward;

    setUserStats((prev) => {
      let newXp = prev.xp + xpReward;
      let newLevel = prev.level;
      let newXpNext = prev.xpNext;

      if (newXp >= prev.xpNext) {
        newXp = newXp - prev.xpNext;
        newLevel += 1;
        newXpNext = Math.round(prev.xpNext * 1.3);
        addNotification(`LEVEL UP! You reached Level ${newLevel}! +50 Bonus Coins awarded.`);
        prev.coins += 50;
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpNext: newXpNext,
        coins: prev.coins + coinsReward,
        streak: prev.streak + 1
      };
    });

    setQuests((prev) => prev.map(q => q.id === id ? { ...q, status: "completed" } : q));
    addNotification(`Quest Completed! Claimed +${xpReward} XP, +${coinsReward} Coins!`);
    addAuditLog("Quest Terminated", `Mapped quest "${quest.title}" completed perfectly.`);
  };

  const handleToggleSubTask = (questId: string, subtaskId: string) => {
    // 10 XP instantly awarded on matching micro action loop! Crucial micro reward loop
    let awardedMinutes = 10;
    
    setQuests((prev) => prev.map((q) => {
      if (q.id === questId) {
        const updatedSubs = q.subTasks.map((st) => {
          if (st.id === subtaskId) {
            const newState = !st.completed;
            if (newState) {
              // Award immediate tick reward
              setUserStats(prevStats => {
                let currentXp = prevStats.xp + st.xpRewardZone; // st.xpReward is usually undefined, fallbacks to 5
                let stXp = st.xpReward || 5;
                let currentLevel = prevStats.level;
                let nextXpThresh = prevStats.xpNext;

                let sumXp = prevStats.xp + stXp;
                if (sumXp >= nextXpThresh) {
                  sumXp = sumXp - nextXpThresh;
                  currentLevel += 1;
                  nextXpThresh = Math.round(nextXpThresh * 1.3);
                }
                return {
                  ...prevStats,
                  xp: sumXp,
                  level: currentLevel,
                  xpNext: nextXpThresh,
                  coins: prevStats.coins + 1
                };
              });
              addNotification(`Micro Step Complete! Gained +${st.xpReward || 5} XP`);
            }
            return { ...st, completed: newState };
          }
          return st;
        });
        return { ...q, subTasks: updatedSubs };
      }
      return q;
    }));
  };

  const handleDeleteQuest = (id: string) => {
    setQuests((prev) => prev.filter(q => q.id !== id));
    addNotification("Quest discarded from board.");
  };

  // Google Sheets integration Handler
  const handleSyncToSheets = async (questsToSync: Quest[]) => {
    setAuditSyncInProgress(true);
    
    // Prepare table headers and values represent our workspace state
    const headers = ["Quest ID", "Title", "Category", "Priority", "Status", "XP Reward", "Coins Reward", "Deadline"];
    const rows = questsToSync.map(q => [
      q.id,
      q.title,
      q.category,
      q.priority,
      q.status,
      q.xpReward.toString(),
      q.coinReward.toString(),
      q.deadline
    ]);

    const finalValues = [headers, ...rows];

    try {
      const response = await fetch("/api/sheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spreadsheetId: sheetsUrl || "1GoogleSheetsAuditSimulationId",
          range: "FocusQuestAudit!A1",
          values: finalValues
        })
      });

      if (!response.ok) {
        throw new Error("Proxy error while exporting logs database.");
      }

      const data = await response.json();
      
      // Update our audit lines stating "Synced to Sheets"
      setAuditLogs(prev => prev.map(log => ({ ...log, syncedToSheets: true })));
      addNotification("Workspace audit completed! Mapped Quests synced safely into Google Sheets workbook.");
      addAuditLog("Google Sheets Sync", "Executed spreadsheet pipeline cell insertions.");
    } catch (e: any) {
      addNotification("Sheets Export failed: Simulated sync recorded in local log.");
    } finally {
      setAuditSyncInProgress(false);
    }
  };

  // Connect Sheets
  const handleConnectSheets = () => {
    if (!sheetsUrl.trim()) {
      addNotification("Specify a Google spreadsheet URL/ID first.");
      return;
    }
    setIsSheetsConnected(true);
    addNotification("Google Sheets target spreadsheet mapped successfully.");
    addAuditLog("Establish Sheets Connection", `Target spreadsheets mapped: ${sheetsUrl}`);
  };

  // Calendar Sync Handlers
  const handleSyncCalendar = () => {
    setSyncCalendarLoading(true);
    setTimeout(() => {
      setSyncCalendarLoading(false);
      addNotification("Synced deadlines pulled successfully! 3 events synced into timeline.");
      addAuditLog("Calendar Sync executed", "Refreshed Google & Outlook Calendar deadline markers");
    }, 1500);
  };

  const handleConnectCalendar = (source: "google" | "outlook") => {
    if (source === "google") {
      setIsGoogleConnected(true);
      addNotification("Connected to Google Calendar API! Milestones mapped.");
      addAuditLog("Connected Google Calendar", "Linked primary calendar feed");
    } else {
      setIsOutlookConnected(true);
      addNotification("Connected Outlook Calendar milestones safely.");
      addAuditLog("Connected Outlook Calendar", "Linked Enterprise Exchange milestones");
    }
  };

  // Outlook email to sheets sync simulator
  const handleTriggerMockOutlookSync = () => {
    addNotification("Outlook emails syncing automatically to Google Sheets!");
    addAuditLog("Email communications synced", "Routed communication channels directly to active Google Sheet logs");
  };

  // Conversion of calendar milestones directly to quest logs
  const handleImportEventAsQuest = (event: SyncedCalendarEvent) => {
    const parentQuestId = `imported-quest-${Date.now()}`;
    const quest: Quest = {
      id: parentQuestId,
      title: `Event Sync: ${event.title}`,
      description: `Mapped calendar deadline sync to coordinate stakeholders automatically. Source: ${event.source}`,
      priority: "medium",
      status: "active",
      category: "Administrative",
      xpReward: 30,
      coinReward: 8,
      deadline: event.start.split("T")[0],
      isAIGenerated: false,
      subTasks: []
    };

    setQuests((prev) => [quest, ...prev]);
    setCalendarEvents((prev) => prev.map((evt) => evt.id === event.id ? { ...evt, importedAsQuest: true } : evt));
    addNotification(`Imported milestone event: "${event.title}" converted into Active Quest!`);
    addAuditLog("Deadline Imported", `Mapped event ID ${event.id} to Board`);
  };

  // Payment Remediation settle
  const handleRemediatePayment = () => {
    setPaymentProfile((prev) => ({
      ...prev,
      status: "active",
      balanceDue: 0,
      unlimitedAIAccess: true,
      invoiceHistory: prev.invoiceHistory.map(inv => inv.status === "failed" ? { ...inv, status: "paid" } : inv)
    }));
    addNotification("Payment Remediation verified! Unrestricted Gemini AI access unlocked!");
  };

  // Buy Shields
  const handleBuyShield = (id: string, cost: number) => {
    setUserStats((prev) => ({ ...prev, coins: prev.coins - cost }));
    setShields((prev) => prev.map(s => s.id === id ? { ...s, active: true } : s));
    addNotification(`Purchased Blocker Shield! Active for matching Work session.`);
    addAuditLog("Purchased Shield", `Active focus blocker shield purchased for ${cost} Coins.`);
  };

  const handleToggleShield = (id: string, state: boolean) => {
    setShields((prev) => prev.map(s => s.id === id ? { ...s, active: state } : s));
    addNotification(`Blocker shield status toggled.`);
  };

  // Add Support ticket
  const handleAddTicket = (ticket: Ticket) => {
    setTickets((prev) => [ticket, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      
      {/* Alert Banner for Payment Remediation when required */}
      {paymentProfile.status === "remediation_required" && (
        <div className="bg-rose-600 text-white py-1 px-4 text-xs font-semibold flex items-center justify-between z-50">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 animate-bounce" />
            <span>Remediation required: Outstanding invoices must be settled to guarantee unlimited API sync access keys.</span>
          </div>
          <button 
            onClick={() => setActiveTab("payments")}
            className="bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase transition"
          >
            Settle Now
          </button>
        </div>
      )}

      {/* Navigation */}
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userStats={userStats}
        pendingNotifications={notifications.length}
        onClearNotifications={() => setNotifications([])}
      />

      {/* Main Container */}
      <main className="flex-1 bg-gradient-to-b from-slate-900/50 to-slate-950">
        {activeTab === "dashboard" && (
          <Dashboard 
            quests={quests} 
            calendarEvents={calendarEvents}
            onSyncCalendar={handleSyncCalendar}
            syncCalendarLoading={syncCalendarLoading}
            isGoogleConnected={isGoogleConnected}
            isOutlookConnected={isOutlookConnected}
            onConnectCalendar={handleConnectCalendar}
            sheetsUrl={sheetsUrl}
            onSheetsUrlChange={setSheetsUrl}
            isSheetsConnected={isSheetsConnected}
            onConnectSheets={handleConnectSheets}
            auditLogs={auditLogs}
            onTriggerMockOutlookSync={handleTriggerMockOutlookSync}
            onImportEventAsQuest={handleImportEventAsQuest}
          />
        )}

        {activeTab === "quests" && (
          <QuestBoard 
            quests={quests}
            onAddQuest={handleAddQuest}
            onCompleteQuest={handleCompleteQuest}
            onToggleSubTask={handleToggleSubTask}
            onDeleteQuest={handleDeleteQuest}
            isSheetsConnected={isSheetsConnected}
            onSyncToSheets={handleSyncToSheets}
            auditSyncInProgress={auditSyncInProgress}
            unlimitedAIAccess={paymentProfile.status === "active"}
          />
        )}

        {activeTab === "focus" && (
          <FocusZone 
            userStats={userStats}
            onUpdateStats={setUserStats}
            onAddNotification={addNotification}
            shields={shields}
            onToggleShield={handleToggleShield}
            onBuyShield={handleBuyShield}
          />
        )}

        {activeTab === "quantumflow" && (
          <QuantumFlowZone 
            userStats={userStats}
            onUpdateStats={setUserStats}
            onAddNotification={addNotification}
            onAddAuditLog={addAuditLog}
          />
        )}

        {activeTab === "payments" && (
          <BillingManager 
            paymentProfile={paymentProfile}
            onRemediatePayment={handleRemediatePayment}
            onToggleAISyncAccess={(status) => setPaymentProfile(prev => ({ ...prev, unlimitedAIAccess: status }))}
            onAddNotification={addNotification}
            onAddAuditLog={addAuditLog}
          />
        )}

        {activeTab === "support" && (
          <SupportCenter 
            tickets={tickets}
            onSubmitTicket={handleAddTicket}
            ticketSubmissionLoading={ticketSubmissionLoading}
            onAddNotification={addNotification}
          />
        )}
      </main>

      {/* Custom Responsive Notification alert modal popup */}
      {showNotificationPopup && notifications.length > 0 && (
        <div className="fixed bottom-6 right-6 max-w-sm w-full bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 flex items-start space-x-3 text-xs text-slate-100 animate-slide-in">
          <div className="bg-indigo-600/10 p-1.5 rounded-full text-indigo-400">
            <Bell className="h-4 w-4" />
          </div>
          <div className="flex-1 space-y-1">
            <span className="font-bold text-slate-300">Workspace Update</span>
            <p className="text-slate-400 leading-relaxed text-[11px]">{notifications[0]}</p>
          </div>
          <button 
            onClick={() => setShowNotificationPopup(false)}
            className="text-slate-500 hover:text-slate-300 transition"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      )}

      {/* High Density Status Rail */}
      <footer className="h-9 px-6 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400 select-none">
        <div className="flex gap-6">
          <span>MEM: 142MB</span>
          <span>SYNC_ID: QF-9921-X</span>
          <span className={`uppercase font-bold ${paymentProfile.status === "remediation_required" ? "text-rose-500 animate-pulse underline" : "text-emerald-500 underline"}`}>
            Payment Remediation: {paymentProfile.status === "remediation_required" ? "Pending" : "Clear"}
          </span>
        </div>
        <div className="hidden sm:flex gap-4 items-center">
          <span>OUTLOOK: <span className={isOutlookConnected ? "text-emerald-400 font-bold" : "text-slate-500"}>{isOutlookConnected ? "CONNECTED" : "DISCONNECTED"}</span></span>
          <span>G-SHEETS: <span className={isSheetsConnected ? "text-emerald-400 font-bold" : "text-slate-500"}>{isSheetsConnected ? "MAPPED" : "UNMAPPED"}</span></span>
          <span className="text-slate-500 italic">Workflow streamlined: +12% Efficiency Today</span>
        </div>
      </footer>

    </div>
  );
}
