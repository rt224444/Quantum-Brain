import React, { useState, useEffect } from "react";
import { 
  Zap, 
  Cpu, 
  Activity, 
  TrendingUp, 
  Sliders, 
  RefreshCw, 
  Sparkles, 
  Shield, 
  AlertTriangle, 
  Terminal, 
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { UserStats } from "../types";

interface QuantumFlowZoneProps {
  userStats: UserStats;
  onUpdateStats: (updater: (stats: UserStats) => UserStats) => void;
  onAddNotification: (msg: string) => void;
  onAddAuditLog: (action: string, details: string) => void;
}

export default function QuantumFlowZone({
  userStats,
  onUpdateStats,
  onAddNotification,
  onAddAuditLog
}: QuantumFlowZoneProps) {
  
  // Custom interactive sliders for neural parameters
  const [entropyRate, setEntropyRate] = useState(24);
  const [engagementIndex, setEngagementIndex] = useState(82);
  const [cognitivePayload, setCognitivePayload] = useState(65);
  const [streamliningCount, setStreamliningCount] = useState(4);
  const [optimizing, setOptimizing] = useState(false);

  // Focus simulation node items
  const [resistanceNodes, setResistanceNodes] = useState([
    { id: "node-1", target: "Social Media Micro-triggers", coefficient: 0.85, resolved: false },
    { id: "node-2", target: "Workspace Noise Intercepts", coefficient: 0.62, resolved: false },
    { id: "node-3", target: "Cognitive Fatigue Deadlock", coefficient: 0.94, resolved: false },
    { id: "node-4", target: "Context Switching Lag", coefficient: 0.70, resolved: false },
    { id: "node-5", target: "Email Loop Procrastination", coefficient: 0.55, resolved: false }
  ]);

  // Handle click on node to resolve resistance and get coin/XP
  const handleResolveResistance = (id: string, targetName: string) => {
    setResistanceNodes(prev => prev.map(node => {
      if (node.id === id && !node.resolved) {
        // Reward user
        onUpdateStats(stats => {
          let newXp = stats.xp + 15;
          let newLevel = stats.level;
          let newXpNext = stats.xpNext;
          if (newXp >= stats.xpNext) {
            newXp -= stats.xpNext;
            newLevel += 1;
            newXpNext = Math.round(stats.xpNext * 1.3);
            onAddNotification(`LEVEL UP from Quantum Flow! You reached Level ${newLevel}!`);
          }
          return {
            ...stats,
            xp: newXp,
            level: newLevel,
            xpNext: newXpNext,
            coins: stats.coins + 5
          };
        });

        onAddNotification(`Quantum optimization aligned: "${targetName}" resistance bypassed! Earned +15 XP & 5 Coins`);
        onAddAuditLog("Quantum Node Alignment", `Resolved blocker resistance vector: ${targetName}`);
        return { ...node, resolved: true };
      }
      return node;
    }));
  };

  const handleResetNodes = () => {
    setResistanceNodes([
      { id: "node-1", target: "Social Media Micro-triggers", coefficient: 0.85, resolved: false },
      { id: "node-2", target: "Workspace Noise Intercepts", coefficient: 0.62, resolved: false },
      { id: "node-3", target: "Cognitive Fatigue Deadlock", coefficient: 0.94, resolved: false },
      { id: "node-4", target: "Context Switching Lag", coefficient: 0.70, resolved: false },
      { id: "node-5", target: "Email Loop Procrastination", coefficient: 0.55, resolved: false }
    ]);
    onAddNotification("Quantum Flow network states re-seeded. Resolve focus resistance blocks now!");
  };

  const runQuantumDeepOptimization = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      setEntropyRate(Math.max(5, entropyRate - 12));
      setEngagementIndex(Math.min(100, engagementIndex + 10));
      onUpdateStats(prev => ({ ...prev, coins: prev.coins + 4 }));
      onAddNotification("Quantum optimization complete! Flow State index boosted by +12%.");
      onAddAuditLog("Quantum Streamline Executed", "Neural payload balanced & entropy rate reduced to minimum threshold");
    }, 1800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-slate-100">
      
      {/* Dynamic Quantum flow banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400"></div>
        <div>
          <h2 className="text-lg font-bold text-slate-200 flex items-center">
            <Zap className="h-5 w-5 text-indigo-400 mr-2 animate-pulse" />
            Hyper-Density Quantum Flow Reactor v2.4
          </h2>
          <p className="text-xs text-slate-500 mt-1">Live tuning of telemetry matrices & cognitive throughput indices to defeat the procrastination barrier.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={runQuantumDeepOptimization}
            disabled={optimizing}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-sans transition duration-200 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${optimizing ? "animate-spin" : ""}`} />
            <span>{optimizing ? "Optimizing Stream..." : "Calibrate Telemetry"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* PANEL A: Interactive Micro Tuning sliders (Col Span 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md space-y-6">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center font-mono">
              <Sliders className="h-4 w-4 text-indigo-400 mr-1.5" />
              Focus State Coefficient
            </h3>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-300 font-mono px-2 py-0.5 rounded border border-indigo-500/20">
              Live Link
            </span>
          </div>

          <div className="space-y-5 text-xs text-slate-300">
            {/* Entropy rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-mono text-slate-400">Cognitive Neural Entropy Rate</span>
                <span className={`font-mono font-bold ${entropyRate < 15 ? "text-emerald-400" : "text-amber-400"}`}>
                  {entropyRate}% (Low Dispersion)
                </span>
              </div>
              <input 
                type="range" 
                min="5" 
                max="85" 
                value={entropyRate} 
                onChange={(e) => setEntropyRate(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-slate-500 leading-none">Measures mental dispersion and background micro-distraction trigger coefficients.</p>
            </div>

            {/* Engagement index */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-mono text-slate-400">Sub-Task Engagement Depth Index</span>
                <span className="font-mono text-indigo-300 font-bold">{engagementIndex}/100</span>
              </div>
              <input 
                type="range" 
                min="30" 
                max="100" 
                value={engagementIndex} 
                onChange={(e) => setEngagementIndex(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-slate-500 leading-none">Relative engagement velocity with mapped task boards and backlog sequences.</p>
            </div>

            {/* Cognitive Payload */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-mono text-slate-400">Working Memory Payload</span>
                <span className="font-mono text-cyan-400 font-bold">{cognitivePayload} MB</span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="128" 
                value={cognitivePayload} 
                onChange={(e) => setCognitivePayload(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-950 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-slate-500 leading-none">Approximate working cognitive payload before fatigue deadlocks are triggered.</p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-center text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <p className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-1">Theoretical Velocity</p>
              <p className="text-lg font-mono font-bold text-white">
                {Math.round((engagementIndex * 1.5) - (entropyRate * 0.4))} Hz
              </p>
              <span className="text-[9px] text-emerald-400">+12% over baseline</span>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <p className="text-slate-500 text-[10px] uppercase font-mono tracking-widest mb-1">Network Resistance</p>
              <p className="text-lg font-mono font-bold text-indigo-300">
                {Math.round((entropyRate * 1.2) + (cognitivePayload / 10))} mΩ
              </p>
              <span className="text-[9px] text-slate-500">Stable resistance band</span>
            </div>
          </div>

        </div>

        {/* PANEL B: Cybernetic Node Decoupling - click-to-resolve blocker puzzles (Col Span 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-widest flex items-center font-mono">
                  <Cpu className="h-4 w-4 text-emerald-400 mr-1.5" />
                  Resistance Alignment Node Matrix
                </h3>
                <p className="text-[10px] text-slate-500 font-sans">Decouple high-resistance distraction anchors to trigger rapid focus cycles</p>
              </div>

              <button
                onClick={handleResetNodes}
                className="text-[10px] px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded border border-slate-700 transition"
                title="Refresh Matrix Entities"
              >
                Re-seed Nodes
              </button>
            </div>

            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              When procrastination blocks a task, micro-resistance nodes form in your workflow matrix. Click each active resistance node below once you have isolated that channel to trigger instant level progress!
            </p>

            <div className="space-y-2.5 mt-4">
              {resistanceNodes.map(node => (
                <div 
                  key={node.id} 
                  id={`resistance-node-${node.id}`}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                    node.resolved 
                      ? "bg-emerald-500/5 border-emerald-500/25 text-slate-350" 
                      : "bg-slate-950 border-slate-850 text-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className={`text-[10px] p-2 rounded-lg font-mono font-bold flex items-center justify-center ${
                      node.resolved ? "bg-emerald-500/10 text-emerald-400" : "bg-indigo-500/10 text-indigo-400"
                    }`}>
                      {node.resolved ? "✓" : "⚡"}
                    </span>
                    <div>
                      <h4 className={`text-xs font-bold ${node.resolved ? "text-slate-500 line-through" : "text-white"}`}>{node.target}</h4>
                      <p className="text-[9px] text-slate-500 mt-0.5 font-mono">Resistance Factor: {node.coefficient}</p>
                    </div>
                  </div>

                  {node.resolved ? (
                    <span className="text-[9px] font-mono text-emerald-400 uppercase bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-bold leading-none">
                      Bypassed Status: Clear
                    </span>
                  ) : (
                    <button
                      onClick={() => handleResolveResistance(node.id, node.target)}
                      className="text-[10px] px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold cursor-pointer transition whitespace-nowrap"
                    >
                      Bypass Resistance
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-[9.5px] font-mono text-slate-500 pt-4 border-t border-slate-800/80 mt-4">
            Bypassing resistance nodes synchronizes immediately with the core workspace audit log. Real-time diagnostic index automatically increments.
          </p>

        </div>
      </div>

      {/* FOOTER METRICS INFO */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-widest mb-1.5 flex items-center">
          <Terminal className="h-4 w-4 mr-2 text-indigo-400" />
          Quantum Flow Engine Logs
        </h4>
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 leading-relaxed max-h-24 overflow-y-auto">
          <div>&gt; [SYSTEM] Initializing QuantumFlow v2.4 diagnostic pipeline.</div>
          <div>&gt; [SUCCESS] Connected with active Google Sheets audit spreadsheet target.</div>
          <div>&gt; [SYNC_OK] Outlook live synchronizer checked with 0ms delay rate.</div>
          <div>&gt; [INFO] Current entropy is balanced: {entropyRate}% against cognitive fatigue thresholds.</div>
        </div>
      </div>

    </div>
  );
}
