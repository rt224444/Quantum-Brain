import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Coins, 
  Flame, 
  Heart, 
  Activity,
  Smile,
  Zap,
  Coffee,
  Volume2
} from "lucide-react";
import { BlockerShield, UserStats } from "../types";

interface FocusZoneProps {
  userStats: UserStats;
  onUpdateStats: (updater: (stats: UserStats) => UserStats) => void;
  onAddNotification: (msg: string) => void;
  shields: BlockerShield[];
  onToggleShield: (id: string, activeState: boolean) => void;
  onBuyShield: (id: string, cost: number) => void;
}

export default function FocusZone({
  userStats,
  onUpdateStats,
  onAddNotification,
  shields,
  onToggleShield,
  onBuyShield
}: FocusZoneProps) {
  // Timer State
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [timerType, setTimerType] = useState<"focus" | "shortBreak" | "longBreak">("focus");

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);

  // Audio simulation state
  const [soundEnabled, setSoundEnabled] = useState(false);

  // Trigger sound simulation
  const playSoundEffect = (type: string) => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      
      if (type === "tick") {
        osc.frequency.setValueAtTime(600, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
      } else if (type === "complete") {
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
        
        setTimeout(() => {
          const osc2 = audioCtx.createOscillator();
          const gain2 = audioCtx.createGain();
          osc2.connect(gain2);
          gain2.connect(audioCtx.destination);
          osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
          gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
          osc2.start();
          osc2.stop(audioCtx.currentTime + 0.3);
        }, 200);
      }
    } catch (e) {
      console.warn("WebAudio context not accessible on this agent iframe yet.");
    }
  };

  // Timer run loop
  useEffect(() => {
    if (isActive) {
      intervalIdRef.current = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
          // Play micro tick sound every 5 seconds for immersive effect
          if ((seconds - 1) % 5 === 0) playSoundEffect("tick");
        } else if (seconds === 0) {
          if (minutes > 0) {
            setMinutes(minutes - 1);
            setSeconds(59);
          } else {
            // Timer expired!
            handleTimerComplete();
          }
        }
      }, 1000);
    } else {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    }

    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, [isActive, seconds, minutes]);

  // Expired action coordinator
  const handleTimerComplete = () => {
    setIsActive(false);
    playSoundEffect("complete");

    if (timerType === "focus") {
      const rewardCoins = 12;
      const rewardedXP = 25;

      onUpdateStats((prev) => {
        let newXp = prev.xp + rewardedXP;
        let newLevel = prev.level;
        let newXpNext = prev.xpNext;
        
        if (newXp >= prev.xpNext) {
          newXp = newXp - prev.xpNext;
          newLevel += 1;
          newXpNext = Math.round(prev.xpNext * 1.3);
          onAddNotification(`LEVEL UP! You reached Level ${newLevel}! Earned +50 Bonus Coins.`);
          prev.coins += 50;
        }

        // Boost pet level as well
        let newPetExp = prev.petExp + 30;
        let newPetLvl = prev.petLevel;
        if (newPetExp >= 100) {
          newPetExp = 0;
          newPetLvl += 1;
          onAddNotification(`CONGRATS! Your Focus Beast ${prev.petName} evolved to Level ${newPetLvl}!`);
        }

        return {
          ...prev,
          xp: newXp,
          level: newLevel,
          xpNext: newXpNext,
          coins: prev.coins + rewardCoins,
          petExp: newPetExp,
          petLevel: newPetLvl,
          petHappiness: Math.min(100, prev.petHappiness + 20)
        };
      });

      onAddNotification(`Timer Complete! You logged 25 Deep Work minutes safely. Gained +${rewardedXP} XP, +${rewardCoins} Coins!`);
      // Restore back and prompt break
      setTimerType("shortBreak");
      setMinutes(5);
      setSeconds(0);
    } else {
      // Break absolute complete
      onAddNotification("Break over! Ready to map new Quests into our Active Log?");
      setTimerType("focus");
      setMinutes(25);
      setSeconds(0);
    }
  };

  // Switch timer options manually
  const selectTimerChoice = (type: "focus" | "shortBreak" | "longBreak") => {
    setIsActive(false);
    setTimerType(type);
    if (type === "focus") {
      setMinutes(25);
    } else if (type === "shortBreak") {
      setMinutes(5);
    } else {
      setMinutes(15);
    }
    setSeconds(0);
  };

  const handleReset = () => {
    setIsActive(false);
    selectTimerChoice(timerType);
  };

  // Feed focus beast
  const feedBeast = (type: "herb" | "elixir") => {
    const cost = type === "herb" ? 4 : 10;
    if (userStats.coins < cost) {
      onAddNotification("Insufficient coins! Complete active Quests on the main Board first.");
      return;
    }

    onUpdateStats((prev) => ({
      ...prev,
      coins: prev.coins - cost,
      petHappiness: Math.min(100, prev.petHappiness + (type === "herb" ? 25 : 55)),
      petExp: type === "elixir" ? Math.min(prev.petExp + 45, 99) : prev.petExp
    }));

    onAddNotification(`Successfully fed ${userStats.petName}! Happiness levels restored.`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      
      {/* LEFT PANEL: Pomodoro Focus clock (Span 7) */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-between shadow-lg relative overflow-hidden">
        
        {/* Dynamic Abstract Matrix design */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-indigo-500 to-teal-500"></div>

        <div className="w-full flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-bold text-slate-200 flex items-center">
              <Zap className="h-5 w-5 text-indigo-400 mr-2 animate-pulse" />
              Immersion Screen
            </h2>
            <p className="text-xs text-slate-400">Lock out distractions & watch shields activate</p>
          </div>

          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border text-xs flex items-center space-x-1 transition duration-150 cursor-pointer ${
              soundEnabled ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-400" : "bg-slate-800 border-slate-700 text-slate-500"
            }`}
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>{soundEnabled ? "Audio On" : "Audio Off"}</span>
          </button>
        </div>

        {/* Timer Option selectors */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-8 max-w-sm">
          {[
            { id: "focus", label: "Deepwork", duration: 25 },
            { id: "shortBreak", label: "Short Break", duration: 5 },
            { id: "longBreak", label: "Long Break", duration: 15 }
          ].map((theme) => (
            <button
              key={theme.id}
              onClick={() => selectTimerChoice(theme.id as any)}
              className={`text-xs px-4 py-1.5 rounded-lg font-medium transition duration-150 cursor-pointer ${
                timerType === theme.id 
                  ? "bg-slate-800 text-indigo-300 shadow-sm border border-slate-700" 
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {theme.label}
            </button>
          ))}
        </div>

        {/* Big visual clock ring */}
        <div className="my-10 relative flex items-center justify-center p-12 bg-slate-950 rounded-full border border-slate-800 shadow-inner w-64 h-64">
          <div className="absolute inset-2 rounded-full border border-dashed border-indigo-500/10 animate-spin" style={{ animationDuration: "120s" }}></div>
          <div className="text-center z-10">
            <div className="text-5xl font-mono font-bold tracking-tight text-white mb-1">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 text-indigo-400/85">
              {timerType === "focus" ? "Locked Focus Mode" : "Relax Break"}
            </div>
          </div>
        </div>

        {/* Play Controls */}
        <div className="flex items-center space-x-4 mb-2">
          <button
            onClick={handleReset}
            className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-300 transition duration-150 cursor-pointer flex items-center justify-center"
            title="Reset Clock State"
          >
            <RotateCcw className="h-5 w-5" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            className={`p-4 rounded-full text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 select-none cursor-pointer scale-110 flex items-center justify-center ${
              isActive 
                ? "bg-red-600 hover:bg-red-500 hover:scale-105" 
                : "bg-indigo-600 hover:bg-indigo-500 hover:scale-105"
            }`}
          >
            {isActive ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 fill-current ml-0.5" />
            )}
          </button>
        </div>

        {/* Notice of active shielding */}
        <div className="mt-6 flex items-center space-x-2 text-xs bg-indigo-500/5 text-indigo-400 px-4 py-2 rounded-xl border border-indigo-500/10 w-full justify-center">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Active distraction blocker shields are filtering workspace interrupts: <strong>Shield Online</strong></span>
        </div>

      </div>

      {/* RIGHT COLUMN: Virtual Pet & Blocker shop (Span 5) */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Virtual Focus Beast Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500 fill-current animate-pulse" />
              <h2 className="text-md font-bold text-slate-200">Focus Beast</h2>
            </div>
            <span className="text-[11px] font-mono text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded">
              LVL {userStats.petLevel} Hatchling
            </span>
          </div>

          {/* Interactive visual beast avatar */}
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/80 flex flex-col items-center py-8 relative">
            
            {/* Ambient indicator circles */}
            <div className={`absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full flex items-center space-x-1 ${
              userStats.petHappiness > 60 ? "bg-emerald-500/10 text-emerald-400" : "bg-orange-500/10 text-orange-400"
            }`}>
              <Smile className="h-3.5 w-3.5" />
              <span>{userStats.petHappiness > 60 ? "Happy" : "Sluggish"}</span>
            </div>

            {/* Simulated Animated Beast Avatar (ASCII character or minimalist design in high visual styling) */}
            <div className="text-center space-y-3 my-2">
              <div className="text-4xl select-none animate-bounce" style={{ animationDuration: isActive ? "1s" : "3s" }}>
                🦖
              </div>
              <p className="font-bold font-mono text-slate-200 text-sm tracking-wide">
                {userStats.petName}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                {isActive ? "🔥 Deep Working with you" : "💤 Sleeping in local memory"}
              </p>
            </div>

            {/* Stats bars */}
            <div className="w-full space-y-2 mt-4 text-xs">
              {/* Pet XP */}
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                  <span>Growth progress</span>
                  <span>{userStats.petExp}/100 XP</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-1.5 rounded-full" style={{ width: `${userStats.petExp}%` }}></div>
                </div>
              </div>

              {/* Happiness */}
              <div>
                <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                  <span>Happiness aura</span>
                  <span>{userStats.petHappiness}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-teal-400 h-1.5 rounded-full" style={{ width: `${userStats.petHappiness}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feed Beast Treat actions */}
          <div className="mt-4 pt-3 grid grid-cols-2 gap-3">
            <button
              onClick={() => feedBeast("herb")}
              className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl py-2 px-3 text-[11px] font-bold text-slate-300 transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>🌿 Feed Herb (4 Coins)</span>
            </button>

            <button
              onClick={() => feedBeast("elixir")}
              className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 rounded-xl py-2 px-3 text-[11px] font-bold text-slate-300 transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>🧪 Feed Elixir (10 Coins)</span>
            </button>
          </div>
        </div>

        {/* Blocker Shield Shop */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="h-5 w-5 text-indigo-400" />
              <h2 className="text-md font-bold text-slate-200">Shield Armoury</h2>
            </div>
            <span className="text-xs text-yellow-500 font-bold flex items-center">
              <Coins className="h-3.5 w-3.5 mr-1" />
              {userStats.coins}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4 leading-relaxed">
            Exchange your earned Quest completion coins for study-shield power-ups that lock out distraction channels!
          </p>

          <div className="space-y-3">
            {shields.map((she) => (
              <div 
                key={she.id} 
                id={`shield-item-${she.id}`}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all duration-150 ${
                  she.active 
                    ? "bg-indigo-500/5 border-indigo-500/30 text-slate-200" 
                    : "bg-slate-950/60 border-slate-800/80 text-slate-400"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl text-lg ${she.active ? "bg-indigo-500/10 text-indigo-400" : "bg-slate-800/60 text-slate-600"}`}>
                    <span>{she.icon}</span>
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold leading-snug ${she.active ? "text-slate-100" : "text-slate-400"}`}>{she.name}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{she.description}</p>
                  </div>
                </div>

                {she.active ? (
                  <button
                    onClick={() => onToggleShield(she.id, false)}
                    className="p-1 px-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Mute
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (userStats.coins >= she.cost) {
                        onBuyShield(she.id, she.cost);
                      } else {
                        onAddNotification("Insufficient coins! Complete quests to stockpile shields.");
                      }
                    }}
                    className="p-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 cursor-pointer"
                  >
                    <span>{she.cost} Coins</span>
                  </button>
                )}
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
}
