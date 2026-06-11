import React from "react";
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
  Zap
} from "lucide-react";
import { UserStats } from "../types";

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userStats: UserStats;
  pendingNotifications: number;
  onClearNotifications: () => void;
}

export default function Navigation({ 
  activeTab, 
  setActiveTab, 
  userStats,
  pendingNotifications,
  onClearNotifications
}: NavigationProps) {
  
  const xpPercentage = Math.min(100, Math.round((userStats.xp / userStats.xpNext) * 100));

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart2 },
    { id: "quests", label: "Quest Logs", icon: CheckSquare },
    { id: "focus", label: "Focus Zone", icon: Timer },
    { id: "quantumflow", label: "Quantum Flow", icon: Zap },
    { id: "payments", label: "Remediation Panel", icon: CreditCard },
    { id: "support", label: "Support Desk", icon: HelpCircle },
  ];

  return (
    <header className="bg-slate-800 border-b border-slate-700 text-slate-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="bg-indigo-650 p-1.5 rounded border border-indigo-400/30 text-white shadow-md flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-amber-300" />
            </div>
            <div>
              <h1 className="text-md font-bold tracking-tight text-white flex items-center">
                FocusQuest <span className="text-[9px] text-slate-400 font-mono font-medium ml-1.5 bg-slate-900 border border-slate-700 px-1 py-0.2 rounded">v2.4</span>
              </h1>
              <span className="text-[9px] text-indigo-400 font-mono uppercase tracking-wider block">Conquer Procrastination</span>
            </div>
          </div>

          {/* Gamification Stats bar */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Live Sync Badge - matches QuantumFlow high density style */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded border border-slate-700 text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-mono text-slate-400 tracking-wider">SYNC ACTIVE</span>
            </div>

            {/* Level & XP */}
            <div className="flex items-center space-x-2.5 bg-slate-900 px-3 py-1 rounded border border-slate-700">
              <Trophy className="h-3.5 w-3.5 text-indigo-400" />
              <div className="text-xs">
                <div className="flex justify-between items-center whitespace-nowrap mb-0.5">
                  <span className="font-bold text-white text-[10px] uppercase font-mono">LVL {userStats.level}</span>
                  <span className="text-[9px] text-indigo-300 ml-2 font-mono">{userStats.xp}/{userStats.xpNext} XP</span>
                </div>
                <div className="w-20 bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-1 transition-all duration-300" 
                    style={{ width: `${xpPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Streak */}
            <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-750">
              <Flame className="h-3.5 w-3.5 text-orange-500" />
              <div className="text-xs">
                <div className="font-bold text-amber-400 text-[10px] font-mono">{userStats.streak} DAYS</div>
              </div>
            </div>

            {/* Coins / Rewards */}
            <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded border border-slate-750">
              <Coins className="h-3.5 w-3.5 text-yellow-500" />
              <div className="text-xs">
                <div className="font-bold text-yellow-400 text-[10px] font-mono">{userStats.coins} COINS</div>
              </div>
            </div>

            {/* Notification alert */}
            <div className="relative">
              <button 
                id="notification-bell-btn"
                onClick={onClearNotifications}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded border border-slate-750 transition duration-150 relative"
                title={`${pendingNotifications} Alerts`}
              >
                <Bell className="h-4 w-4" />
                {pendingNotifications > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stats Summary for Mobile */}
          <div className="flex md:hidden items-center space-x-2 text-xs bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
            <span className="font-bold text-indigo-400 text-[10px] font-mono">LVL {userStats.level}</span>
            <span className="flex items-center text-yellow-400 font-bold text-[10px] font-mono"><Coins className="h-2.5 w-2.5 mr-0.5" />{userStats.coins}</span>
          </div>
        </div>
      </div>

      {/* Tabs View selector */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-750 bg-slate-900/50">
        <nav className="flex justify-start space-x-1 py-1 overflow-x-auto scrollbar-none animate-slide-in" aria-label="Tabs" style={{ animationDelay: "100ms" }}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}-tab`}
                onClick={() => setActiveTab(item.id)}
                className={`py-1.5 px-3 rounded text-xs font-semibold flex items-center space-x-1.5 transition duration-150 whitespace-nowrap cursor-pointer uppercase tracking-tight ${
                  isActive 
                    ? "bg-slate-800 text-indigo-400 border border-slate-700/60" 
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <IconComponent className={`h-3.5 w-3.5 ${isActive ? "text-indigo-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
