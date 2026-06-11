import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  CheckCircle, 
  Sparkles, 
  HelpCircle, 
  Brain, 
  FileSpreadsheet, 
  Clock, 
  Calendar,
  AlertCircle,
  TrendingUp,
  Tag,
  Share2
} from "lucide-react";
import { Quest, SubTask } from "../types";

interface QuestBoardProps {
  quests: Quest[];
  onAddQuest: (quest: Quest) => void;
  onCompleteQuest: (id: string) => void;
  onToggleSubTask: (questId: string, subtaskId: string) => void;
  onDeleteQuest: (id: string) => void;
  isSheetsConnected: boolean;
  onSyncToSheets: (questsToSync: Quest[]) => void;
  auditSyncInProgress: boolean;
  unlimitedAIAccess: boolean;
}

export default function QuestBoard({
  quests,
  onAddQuest,
  onCompleteQuest,
  onToggleSubTask,
  onDeleteQuest,
  isSheetsConnected,
  onSyncToSheets,
  auditSyncInProgress,
  unlimitedAIAccess
}: QuestBoardProps) {
  // Simple Quest Creation State
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
  const [newCategory, setNewCategory] = useState("Work");
  const [newDeadline, setNewDeadline] = useState("");

  // AI Breakdown State
  const [aiGoal, setAiGoal] = useState("");
  const [aiCategory, setAiCategory] = useState("Learn");
  const [aiStepCount, setAiStepCount] = useState(5);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");
  const [generatedSteps, setGeneratedSteps] = useState<{ title: string; xpReward: number; estimatedMinutes: number }[]>([]);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "backlog" | "completed">("active");

  const categories = ["Work", "Study", "Administrative", "Creative", "Health", "Other"];

  // Handle standard manual quest creation
  const handleCreateQuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const coinReward = newPriority === "high" ? 15 : newPriority === "medium" ? 8 : 4;
    const xpReward = newPriority === "high" ? 35 : newPriority === "medium" ? 20 : 10;

    const quest: Quest = {
      id: `quest-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || "No extra detailed quest instructions.",
      priority: newPriority,
      status: "active",
      category: newCategory,
      xpReward,
      coinReward,
      deadline: newDeadline || new Date(Date.now() + 86400000).toISOString().split("T")[0],
      isAIGenerated: false,
      subTasks: []
    };

    onAddQuest(quest);
    setNewTitle("");
    setNewDesc("");
    setNewPriority("medium");
    setNewDeadline("");
  };

  // Call server-side Gemini decomposition endpoint
  const handleAIBreakdown = async () => {
    if (!aiGoal.trim()) {
      setAiError("Please supply a complex project goal or topic to decompose.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    setGeneratedSteps([]);

    try {
      const response = await fetch("/api/project/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: aiGoal.trim(),
          category: aiCategory,
          subtaskCount: aiStepCount
        })
      });

      if (!response.ok) {
        throw new Error("Failure generating breakdown from the model.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGeneratedSteps(data.tasks || []);
    } catch (e: any) {
      setAiError(e.message || "Failed to parse API project breakdown. Please check your Gemini credentials.");
    } finally {
      setAiLoading(false);
    }
  };

  // Convert the Gemini steps into an active Quest structure with Subtasks
  const handleAcceptAISteps = () => {
    if (generatedSteps.length === 0) return;

    // Create a parent Quest representing the complex project
    const parentQuestId = `ai-quest-${Date.now()}`;
    const totalXP = generatedSteps.reduce((acc, step) => acc + (step.xpReward || 15), 0);
    const coinReward = Math.ceil(totalXP / 5);

    // Form subtasks array for this Quest
    const subTasks: SubTask[] = generatedSteps.map((step, idx) => ({
      id: `${parentQuestId}-sub-${idx}`,
      title: step.title,
      completed: false,
      xpReward: Math.round((step.xpReward || 15) * 0.4), // xp for completing this subtask
      estimatedMinutes: step.estimatedMinutes || 25
    }));

    const parentQuest: Quest = {
      id: parentQuestId,
      title: aiGoal,
      description: `Actionable breakdown of complex goal decomposed by Gemini. Category: ${aiCategory}`,
      priority: "high",
      status: "active",
      category: aiCategory,
      xpReward: totalXP, 
      coinReward,
      deadline: new Date(Date.now() + 172800000).toISOString().split("T")[0], // 2 days from now
      isAIGenerated: true,
      subTasks
    };

    onAddQuest(parentQuest);
    
    // Clear state
    setGeneratedSteps([]);
    setAiGoal("");
    setActiveFilter("active");
  };

  // Grouped counts
  const filteredQuests = quests.filter((q) => {
    if (activeFilter === "all") return true;
    return q.status === activeFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-slate-100">
      
      {/* LEFT COLUMN: Quest Management & Creator (Span 4) */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Simple Procrastination Tip Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-900/60 to-slate-900 border border-indigo-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Brain className="h-20 w-20" />
          </div>
          <div className="flex items-center space-x-2 text-indigo-400 mb-2">
            <Brain className="h-5 w-5" />
            <h3 className="font-semibold text-sm uppercase tracking-wider">Beat Abstract Quests</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Procrastination happens when tasks feel too abstract. If you find yourself delaying, split files/tasks into 10-minute slots. Use the <strong>Gemini Decimator</strong> below to instantly map complex items.
          </p>
        </div>

        {/* AI Decomposer Form */}
        <div className="bg-slate-900 border border-indigo-500/10 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-400 animate-pulse" />
              <h2 className="text-md font-bold text-slate-200">Gemini AI Decimator</h2>
            </div>
            {!unlimitedAIAccess && (
              <span className="text-[10px] bg-red-500/15 text-red-500 px-2 py-0.5 rounded-full border border-red-500/30">
                Remediation Limit
              </span>
            )}
          </div>

          <p className="text-xs text-slate-400">
            Conquer abstraction. Enter a giant task or complex goal and watch artificial intelligence convert it into bite-sized quests.
          </p>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Complex Project or Abstract Goal</label>
              <textarea 
                rows={2} 
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200 resize-none"
                placeholder="e.g. Write a 10-page thesis paper on astrophysics"
                value={aiGoal}
                onChange={(e) => setAiGoal(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Sub-Steps Requested</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
                  value={aiStepCount}
                  onChange={(e) => setAiStepCount(Number(e.target.value))}
                >
                  <option value={3}>3 Steps (Short)</option>
                  <option value={5}>5 Steps (Standard)</option>
                  <option value={7}>7 Steps (Deepwork)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tag Focus</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-100/10 rounded-xl px-3 py-1.5 text-xs text-slate-300 outline-none"
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {aiError && (
              <div className="flex items-start space-x-2 bg-rose-900/10 border border-rose-500/30 text-rose-400 p-2.5 rounded-xl text-xs">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{aiError}</span>
              </div>
            )}

            <button
              onClick={handleAIBreakdown}
              disabled={aiLoading}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-semibold py-2 px-4 rounded-xl shadow-md disabled:opacity-50 transition duration-150 cursor-pointer flex items-center justify-center space-x-2"
            >
              {aiLoading ? (
                <>
                  <div className="h-3.5 w-3.5 border-2 border-indigo-200 border-t-transparent rounded-full animate-spin"></div>
                  <span>Thinking & Break-down...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                  <span>Decimate abstract Project</span>
                </>
              )}
            </button>
          </div>

          {/* AI Previews */}
          {generatedSteps.length > 0 && (
            <div className="mt-4 bg-slate-950 p-3 rounded-xl border border-indigo-500/20 space-y-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-indigo-400">Decomposed Action Plan</span>
                <span className="text-[10px] text-slate-500">{generatedSteps.length} segments found</span>
              </div>
              <div className="divide-y divide-slate-800/60 max-h-48 overflow-y-auto pr-1">
                {generatedSteps.map((step, sIdx) => (
                  <div key={sIdx} className="py-2 text-xs flex items-start space-x-2.5">
                    <span className="w-4 h-4 rounded-full bg-slate-800 text-[9px] text-indigo-300 flex items-center justify-center font-bold">
                      {sIdx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-slate-200 font-mono text-[11px] leading-tight">{step.title}</p>
                      <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1">
                        <span className="flex items-center text-teal-400">+{step.xpReward} XP</span>
                        <span className="flex items-center"><Clock className="h-3 w-3 mr-0.5 text-slate-500" />{step.estimatedMinutes}m</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAcceptAISteps}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-1.5 px-3 rounded-lg shadow transition duration-150 cursor-pointer"
              >
                Accept and Map to active Quests
              </button>
            </div>
          )}
        </div>

        {/* Manual Quest Creator Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
            <Plus className="h-5 w-5 text-slate-400" />
            <h2 className="text-md font-bold text-slate-200">Issue New Quest</h2>
          </div>

          <form onSubmit={handleCreateQuest} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Quest Title / Objective</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                placeholder="e.g. Format final bibliography"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Quest Purpose (Notes)</label>
              <input
                type="text"
                className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                placeholder="Key resource links or micro criteria..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Category</label>
                <select
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Difficulty/Priority</label>
                <select
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 outline-none"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                >
                  <option value="low">Low (10 XP / $4)</option>
                  <option value="medium">Medium (20 XP / $8)</option>
                  <option value="high">High (35 XP / $15)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Deadline Date</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-slate-100 text-xs font-semibold py-2 px-4 rounded-xl transition duration-150 cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>Map to Board</span>
            </button>
          </form>
        </div>

      </div>

      {/* RIGHT COLUMN: Interactive Quest Board (Span 8) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Board Filtering Controls & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 px-6 py-4 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-1.5">
            {["active", "completed", "backlog", "all"].map((f) => (
              <button
                key={f}
                id={`filter-${f}-btn`}
                onClick={() => setActiveFilter(f as any)}
                className={`text-xs px-3.5 py-1.5 rounded-xl capitalize transition duration-150 cursor-pointer text-slate-300 ${
                  activeFilter === f 
                    ? "bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-500/20" 
                    : "bg-slate-800/80 border border-slate-700/40 hover:bg-slate-800"
                }`}
              >
                {f === "active" ? "Active Quests" : f === "completed" ? "Completed" : f === "backlog" ? "Backlog" : "All Tasks"}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3">
            {/* Sheets audit toggle action */}
            <button
              id="sync-sheets-audit-btn"
              onClick={() => onSyncToSheets(quests)}
              disabled={auditSyncInProgress}
              className={`flex items-center space-x-1.5 text-xs px-3.5 py-1.5 rounded-xl border font-mono transition duration-150 cursor-pointer ${
                isSheetsConnected 
                  ? "bg-emerald-800/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-800/20"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-300"
              }`}
              title={isSheetsConnected ? "Save audit snapshot to connected Sheet" : "Link Sheets in Dashboard to export audits"}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>{auditSyncInProgress ? "Syncing..." : "Sheet Audit Sync"}</span>
            </button>
          </div>
        </div>

        {/* Quest List */}
        <div className="space-y-4">
          {filteredQuests.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-12 text-center text-slate-400">
              <CheckCircle className="h-12 w-12 mx-auto text-slate-600 mb-3" />
              <h3 className="font-semibold text-slate-300">No Quests matching "{activeFilter}"</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                Add an outline manually or trigger a <strong>Gemini Decimation breakdown</strong> to assemble structural action sets.
              </p>
            </div>
          ) : (
            filteredQuests.map((quest) => {
              const difficultyColor = quest.priority === "high" ? "text-rose-400 bg-rose-500/10 border border-rose-500/25" : quest.priority === "medium" ? "text-amber-400 bg-amber-500/10 border border-amber-500/25" : "text-emerald-400 bg-emerald-500/10 border border-emerald-500/25";
              const progressCount = quest.subTasks.filter(t => t.completed).length;
              const hasSubtasks = quest.subTasks.length > 0;
              const subtaskPercent = hasSubtasks 
                ? Math.round((progressCount / quest.subTasks.length) * 100)
                : 0;

              return (
                <div 
                  key={quest.id} 
                  id={`quest-card-${quest.id}`}
                  className={`bg-slate-900 border transition duration-200 rounded-2xl p-6 ${
                    quest.status === "completed" 
                      ? "border-emerald-500/20 bg-slate-950/80 opacity-75" 
                      : "border-slate-800/85 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      {/* Priority Tag & Category */}
                      <div className="flex items-center space-x-2">
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase leading-none ${difficultyColor}`}>
                          {quest.priority} Priority
                        </span>
                        <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider bg-slate-800 px-2 py-0.5 rounded leading-none">
                          <Tag className="h-2.5 w-2.5 inline mr-1" />
                          {quest.category}
                        </span>
                        {quest.isAIGenerated && (
                          <span className="text-[10px] text-indigo-400 uppercase font-mono bg-indigo-500/10 px-2 py-0.5 rounded flex items-center leading-none">
                            <Sparkles className="h-2.5 w-2.5 inline mr-1 text-yellow-300 animate-pulse" />
                            AI Decomposed
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className={`text-base font-bold ${quest.status === "completed" ? "line-through text-slate-500 text-slate-400" : "text-white"}`}>
                        {quest.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                        {quest.description}
                      </p>
                    </div>

                    {/* Completion/XP Section */}
                    <div className="text-right space-y-1">
                      <div className="text-xs font-semibold text-teal-400">+{quest.xpReward} XP</div>
                      <div className="text-[10px] text-yellow-400 font-bold flex items-center justify-end">
                        <span>{quest.coinReward} Coins</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono mt-1 block">
                        <Calendar className="h-3 w-3 inline mr-1 text-slate-600" />
                        Due: {quest.deadline}
                      </div>
                    </div>
                  </div>

                  {/* Subtask Section */}
                  {hasSubtasks && (
                    <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span className="font-semibold tracking-wide text-slate-300">Action Steps Breakdown Progress</span>
                        <span className="font-mono text-indigo-300 font-bold">{progressCount} of {quest.subTasks.length} ({subtaskPercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${subtaskPercent}%` }}
                        ></div>
                      </div>

                      <div className="space-y-2 mt-2">
                        {quest.subTasks.map((subtask) => (
                          <div 
                            key={subtask.id} 
                            onClick={() => onToggleSubTask(quest.id, subtask.id)}
                            className={`p-2.5 rounded-xl text-xs flex items-center justify-between border cursor-pointer select-none transition duration-150 ${
                              subtask.completed 
                                ? "bg-slate-950/40 border-slate-800/40 text-slate-500 line-through" 
                                : "bg-slate-800/50 border-slate-700/40 text-slate-200 hover:bg-slate-800"
                            }`}
                          >
                            <div className="flex items-center space-x-2.5">
                              <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${subtask.completed ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400" : "border-slate-600"}`}>
                                {subtask.completed && "✓"}
                              </span>
                              <span>{subtask.title}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-[10px] text-slate-400">
                              <span className="flex items-center text-emerald-400 font-semibold text-[9px]">+{subtask.xpReward} XP</span>
                              <span className="flex items-center font-mono"><Clock className="h-3 w-3 mr-0.5 text-slate-600" />{subtask.estimatedMinutes}m</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-slate-800/50 flex justify-between items-center text-xs">
                    <button
                      onClick={() => onDeleteQuest(quest.id)}
                      className="text-slate-500 hover:text-rose-400 transition flex items-center space-x-1 font-semibold p-1 cursor-pointer"
                      title="Abort and Delete Quest"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Discard</span>
                    </button>

                    {quest.status !== "completed" && (
                      <button
                        onClick={() => onCompleteQuest(quest.id)}
                        disabled={hasSubtasks && progressCount < quest.subTasks.length}
                        className={`font-semibold py-1 px-3.5 rounded-lg transition duration-150 cursor-pointer text-xs ${
                          hasSubtasks && progressCount < quest.subTasks.length
                            ? "bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow shadow-indigo-500/10"
                        }`}
                        title={hasSubtasks && progressCount < quest.subTasks.length ? "Complete all actionable steps first" : "Claim Quest rewards!"}
                      >
                        Claim Reward
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
