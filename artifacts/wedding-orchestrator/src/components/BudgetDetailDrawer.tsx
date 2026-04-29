import { X, History, TrendingDown, Target, Lightbulb, ChevronRight, IndianRupee, AlertCircle, CheckCircle2, Circle, Plus, Lock, Unlock, Trash2, Calendar, Flag, Pencil, Compass, Activity, FileText, Zap } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn, formatCurrency } from "@/lib/utils";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { BudgetRefinementModal } from "./BudgetRefinementModal";

interface BudgetDetailDrawerProps {
  categoryId: string | null;
  onClose: () => void;
}

export function BudgetDetailDrawer({ categoryId, onClose }: BudgetDetailDrawerProps) {
  const { budgetCategories, updateBudgetEstimate, getCategoryTips, getSuggestedBudget, getCategoryTasks, weddingInfo, completeTask, completeTaskWithBudget, toggleCategoryLock, addTask, removeTask, updateTask } = useStore();
  const category = budgetCategories.find(c => c.id === categoryId);
  const tasks = categoryId ? getCategoryTasks(categoryId) : [];
  
  const [isRefinementOpen, setIsRefinementOpen] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskCost, setNewTaskCost] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<"low" | "medium" | "high">("medium");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [newTaskNotes, setNewTaskNotes] = useState("");
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newEstimate, setNewEstimate] = useState("");

  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'done').length, [tasks]);
  const progress = useMemo(() => tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0, [completedTasks, tasks.length]);

  if (!category) return null;

  const handleAddTask = () => {
    if (!newTaskTitle.trim()) {
      setFormError("Task title is required");
      return;
    }
    
    if (editingTaskId) {
      updateTask(editingTaskId, {
        title: newTaskTitle.trim(),
        estimatedCost: newTaskCost ? parseFloat(newTaskCost) : 0,
        priority: newTaskPriority,
        dueDate: newTaskDueDate,
        notes: newTaskNotes,
      });
    } else {
      addTask({
        title: newTaskTitle.trim(),
        category: category.name,
        budgetCategoryId: category.id,
        estimatedCost: newTaskCost ? parseFloat(newTaskCost) : 0,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        notes: newTaskNotes,
        phaseId: "custom"
      });
    }
    
    resetForm();
  };

  const resetForm = () => {
    setNewTaskTitle("");
    setNewTaskCost("");
    setNewTaskPriority("medium");
    setNewTaskDueDate("");
    setNewTaskNotes("");
    setFormError("");
    setEditingTaskId(null);
    setIsAddingTask(false);
  };

  const startEditing = (task: any) => {
    setNewTaskTitle(task.title);
    setNewTaskCost(task.estimatedCost?.toString() || "");
    setNewTaskPriority(task.priority);
    setNewTaskDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    setNewTaskNotes(task.notes || "");
    setEditingTaskId(task.id);
    setIsAddingTask(true);
  };

  const { title, tips, potentialSavings } = getCategoryTips(category.id);
  const suggestedRange = getSuggestedBudget(category.name);

  const handleUpdateEstimate = () => {
    const val = parseFloat(newEstimate);
    if (!isNaN(val)) {
      updateBudgetEstimate(category.id, val);
      setIsEditing(false);
      setNewEstimate("");
    }
  };

  const handleTaskToggle = (task: any) => {
    if (task.status === 'done') {
      completeTask(task.id);
    } else {
      const costInput = window.prompt(`Final cost for "${task.title}"?`, (task.estimatedCost ?? 0).toString());
      if (costInput !== null) {
        const actual = parseFloat(costInput) || 0;
        completeTaskWithBudget(task.id, actual);
      }
    }
  };

  return (
    <AnimatePresence>
      {categoryId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
              "fixed z-50 bg-[#FDFCFB] border-l border-orange-100 shadow-2xl flex flex-col overflow-hidden",
              "inset-y-0 right-0 w-full sm:w-[420px]"
            )}
          >
            {/* Header */}
            <div className="relative h-48 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-rose-50 opacity-60" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] opacity-20" />
              
              <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/80 backdrop-blur-sm border border-orange-100 text-orange-400 hover:text-orange-600 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    weddingInfo.budgetPhase === 'dreaming' ? "bg-indigo-100 text-indigo-600" : "bg-emerald-100 text-emerald-600"
                  )}>
                    {weddingInfo.budgetPhase === 'dreaming' ? "The Dreamer's Voyage" : "Execution Map"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-3xl font-serif-display text-slate-800 leading-none">{category.name}</h2>
                  <button
                    onClick={() => toggleCategoryLock(category.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm border",
                      category.isLocked 
                        ? "bg-slate-100 text-slate-600 border-slate-200" 
                        : "bg-white text-slate-400 border-orange-100 hover:text-primary hover:border-primary/30"
                    )}
                  >
                    {category.isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    {category.isLocked ? "Locked" : "Unlocked"}
                  </button>
                </div>
                <p className="text-slate-500 mt-2 text-sm italic">
                  {weddingInfo.budgetPhase === 'dreaming' ? "Exploring possibilities for our vision." : "Making our dreams a reality, step by step."}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
              {/* Phase-Specific Status Section */}
              <section className="grid grid-cols-2 gap-4">
                {weddingInfo.budgetPhase === 'dreaming' ? (
                  <>
                    <div className="p-4 rounded-2xl bg-white border border-indigo-50 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Our Vision</p>
                      <p className="text-lg font-semibold text-slate-700">{formatCurrency(category.planned)}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-indigo-50 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Vision Alignment</p>
                      <div className="flex items-center gap-1.5">
                        <div className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          category.confidence === 'high' ? "bg-emerald-400" :
                          category.confidence === 'medium' ? "bg-amber-400" : "bg-rose-400"
                        )} />
                        <p className="text-lg font-semibold text-slate-700 capitalize">{category.confidence || 'Stable'}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="p-4 rounded-2xl bg-white border border-emerald-50 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Paid So Far</p>
                      <p className="text-lg font-semibold text-emerald-600">{formatCurrency(category.actual)}</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white border border-emerald-50 shadow-sm">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Remaining</p>
                      <p className={cn(
                        "text-lg font-semibold",
                        (category.forecast - category.actual) > 0 ? "text-slate-700" : "text-emerald-600"
                      )}>
                        {formatCurrency(Math.max(0, category.forecast - category.actual))}
                      </p>
                    </div>
                  </>
                )}
              </section>

              {/* Dreaming: Vision & Tiers / Tracking: Settlement Progress */}
              {weddingInfo.budgetPhase === 'dreaming' ? (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Compass size={18} className="text-indigo-500" />
                      <h3 className="font-semibold text-slate-800">Room for Magic</h3>
                    </div>
                    {!category.isLocked && (
                      <button 
                        onClick={() => setIsRefinementOpen(true)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1 group"
                      >
                        Explore Tiers
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'standard', label: 'Modest', color: 'bg-slate-50 text-slate-600 border-slate-100' },
                      { id: 'premium', label: 'Balanced', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                      { id: 'luxury', label: 'Elevated', color: 'bg-purple-50 text-purple-700 border-purple-100' }
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        disabled={category.isLocked}
                        onClick={() => updateBudgetEstimate(category.id, (suggestedRange as any)[tier.id], tier.id as any)}
                        className={cn(
                          "flex flex-col items-center p-3 rounded-2xl border transition-all relative overflow-hidden group",
                          tier.color,
                          category.priority === tier.id ? "ring-2 ring-indigo-200 border-transparent shadow-sm" : "border-transparent",
                          category.isLocked ? "cursor-not-allowed opacity-50" : "hover:scale-[1.02] active:scale-95"
                        )}
                      >
                        <span className="text-[10px] font-bold uppercase tracking-tight mb-1 opacity-70">{tier.label}</span>
                        <span className="text-xs font-bold">{formatCurrency((suggestedRange as any)[tier.id])}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-100 shadow-sm">
                    <div className="flex items-baseline justify-between">
                      <div className="space-y-1">
                        <span className="text-3xl font-serif-display text-slate-800">{formatCurrency(category.planned)}</span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Our Shared Vision</p>
                      </div>
                      <div className="h-10 w-10 rounded-2xl bg-indigo-100/50 flex items-center justify-center text-indigo-500">
                        <Zap size={20} />
                      </div>
                    </div>
                  </div>
                </section>
              ) : (
                <section className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Activity size={18} className="text-emerald-500" />
                    <h3 className="font-semibold text-slate-800">Spending Pace</h3>
                  </div>
                  
                  <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, (category.actual / (category.forecast || 1)) * 100)}%` }}
                      className={cn(
                        "h-full transition-all duration-1000",
                        category.actual > category.planned ? "bg-rose-400" : "bg-emerald-400"
                      )}
                    />
                    {category.actual < category.forecast && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                          {Math.round((category.actual / (category.forecast || 1)) * 100)}% Settled
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 rounded-3xl bg-gradient-to-br from-white to-emerald-50/30 border border-emerald-100 shadow-sm relative overflow-hidden">
                    <div className="flex items-baseline justify-between">
                      <div className="space-y-1">
                        <span className={cn(
                          "text-3xl font-serif-display",
                          category.forecast > category.planned ? "text-rose-500" : "text-slate-800"
                        )}>
                          {formatCurrency(category.forecast)}
                        </span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {category.forecast > category.planned ? "Adjusted Reality" : "Current Commitment"}
                        </p>
                      </div>
                      <div className={cn(
                        "h-10 w-10 rounded-2xl flex items-center justify-center",
                        category.forecast > category.planned ? "bg-rose-100 text-rose-500" : "bg-emerald-100 text-emerald-500"
                      )}>
                        {category.forecast > category.planned ? <TrendingDown size={20} /> : <FileText size={20} />}
                      </div>
                    </div>
                  </div>
                </section>
              )}
              
              {/* Tasks Section */}
              {tasks.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} className={cn(weddingInfo.budgetPhase === 'dreaming' ? "text-indigo-500" : "text-emerald-500")} />
                      <h3 className="font-semibold text-slate-800">
                        {weddingInfo.budgetPhase === 'dreaming' ? "Dream Checklist" : "Action Steps"}
                      </h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {tasks.filter(t => t.status === 'done').length}/{tasks.length} Completed
                    </span>
                  </div>
                  <div className="space-y-3">
                    {tasks.map(task => (
                      <motion.div 
                        key={task.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-100 hover:border-orange-100 hover:shadow-md hover:shadow-orange-500/5 transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleTaskToggle(task)}
                            className={cn(
                              "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all",
                              task.status === 'done' 
                                ? "bg-emerald-500 border-emerald-500 text-white" 
                                : "border-slate-200 text-transparent group-hover:border-orange-300"
                            )}
                          >
                            <CheckCircle2 size={14} className={task.status === 'done' ? "opacity-100" : "opacity-0"} />
                          </button>
                          <div className="flex flex-col">
                            <span className={cn(
                              "text-sm font-medium transition-all",
                              task.status === 'done' ? "text-slate-400 line-through" : "text-slate-700"
                            )}>
                              {task.title}
                            </span>
                            <div className="flex items-center gap-2 mt-1">
                              {(task.estimatedCost ?? 0) > 0 && task.status !== 'done' && (
                                <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-1.5 py-0.5 rounded-md border border-slate-100">
                                  Est. {formatCurrency(task.estimatedCost ?? 0)}
                                </span>
                              )}
                              {task.status === 'done' && task.actualCost !== undefined && (
                                <span className={cn(
                                  "text-[10px] font-bold px-1.5 py-0.5 rounded-md border",
                                  (task.actualCost ?? 0) > (task.estimatedCost ?? 0) 
                                    ? "bg-rose-50 border-rose-100 text-rose-600"
                                    : (task.actualCost ?? 0) < (task.estimatedCost ?? 0)
                                      ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                      : "bg-slate-50 border-slate-100 text-slate-500"
                                )}>
                                  Spent {formatCurrency(task.actualCost ?? 0)}
                                  {(task.actualCost ?? 0) > (task.estimatedCost ?? 0) && " (Over)"}
                                  {(task.actualCost ?? 0) < (task.estimatedCost ?? 0) && " (Saved)"}
                                </span>
                              )}
                              <span className={cn(
                                "text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-md border",
                                task.priority === 'high' ? "bg-rose-50 border-rose-100 text-rose-600" :
                                task.priority === 'medium' ? "bg-orange-50 border-orange-100 text-orange-600" :
                                "bg-blue-50 border-blue-100 text-blue-600"
                              )}>
                                {task.priority}
                              </span>
                              {task.dueDate && (
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
                                  <Calendar size={10} />
                                  {format(new Date(task.dueDate), "MMM d")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => startEditing(task)}
                            className="p-2 text-slate-300 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            onClick={() => removeTask(task.id)}
                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}

                    <AnimatePresence>
                      {isAddingTask ? (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="p-4 rounded-2xl bg-orange-50/30 border border-orange-100 space-y-3"
                        >
                          <input 
                            type="text"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                              <input 
                                type="number"
                                value={newTaskCost}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val === "" || parseFloat(val) >= 0) {
                                    setNewTaskCost(val);
                                  }
                                }}
                                placeholder="Est. Cost"
                                className="w-full bg-white border border-orange-100 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                              />
                            </div>
                            <div className="relative flex-1">
                              <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400" />
                              <input 
                                type="date"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                                className="w-full bg-white border border-orange-100 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-4 py-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Priority:</span>
                            <div className="flex gap-2">
                              {(['low', 'medium', 'high'] as const).map((p) => (
                                <button
                                  key={p}
                                  onClick={() => setNewTaskPriority(p)}
                                  className={cn(
                                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all border",
                                    newTaskPriority === p 
                                      ? "bg-orange-100 border-orange-200 text-orange-700" 
                                      : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
                                  )}
                                >
                                  {p}
                                </button>
                              ))}
                            </div>
                          </div>

                          <textarea 
                            value={newTaskNotes}
                            onChange={(e) => setNewTaskNotes(e.target.value)}
                            placeholder="Add some notes or details..."
                            className="w-full bg-white border border-orange-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[60px] resize-none"
                          />

                          {formError && (
                            <p className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                              <AlertCircle size={10} />
                              {formError}
                            </p>
                          )}

                          <div className="flex gap-2 pt-2">
                            <button 
                              onClick={handleAddTask}
                              className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200"
                            >
                              {editingTaskId ? "Save Changes" : "Create Task"}
                            </button>
                            <button 
                              onClick={resetForm}
                              className="px-6 py-2.5 bg-white text-slate-500 border border-orange-100 rounded-xl text-sm font-bold hover:bg-orange-50 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <button 
                          onClick={() => setIsAddingTask(true)}
                          className="w-full py-4 border-2 border-dashed border-slate-100 rounded-2xl text-xs font-bold text-slate-400 hover:border-orange-200 hover:bg-orange-50/30 hover:text-orange-500 transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={14} />
                          Add a specific {category.name} task
                        </button>
                      )}
                    </AnimatePresence>
                  </div>
                </section>
              )}

              {/* Tips Section */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb size={18} className="text-yellow-500" />
                  <h3 className="font-semibold text-slate-800">Wisdom for Our Journey</h3>
                </div>
                <motion.div 
                  variants={{
                    show: { transition: { staggerChildren: 0.1 } }
                  }}
                  initial="hidden"
                  animate="show"
                  className="space-y-3"
                >
                  {tips.map((tip, idx) => (
                    <motion.div 
                      key={idx} 
                      variants={{
                        hidden: { opacity: 0, x: 10 },
                        show: { opacity: 1, x: 0 }
                      }}
                      className="flex gap-3 p-4 rounded-xl bg-white border border-slate-50 shadow-sm hover:border-orange-100 transition-colors group"
                    >
                      <div className="mt-1 h-5 w-5 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-100 transition-colors">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </section>

              {/* Savings Opportunity */}
              {potentialSavings && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex gap-4">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-emerald-500 shadow-sm flex-shrink-0">
                    <TrendingDown size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-800">Saving Opportunity</h4>
                    <p className="text-xs text-emerald-700/80 mt-1">{potentialSavings}</p>
                  </div>
                </div>
              )}

              {/* Insight Note */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex gap-3">
                <AlertCircle size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-blue-800 uppercase tracking-tight">Why these numbers?</p>
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    These estimates are personalized for a <strong>{category.name}</strong> for <strong>{weddingInfo.guests} guests</strong> in <strong>{weddingInfo.city}</strong>. We've anchored these based on {weddingInfo.weddingType ? `your ${weddingInfo.weddingType} traditions and ` : ""}current market trends to help you feel confident in your choices.
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-8 bg-white border-t border-slate-100">
              <button 
                onClick={onClose}
                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
              >
                {weddingInfo.budgetPhase === 'dreaming' ? "Save My Vision" : "Keep on Track"}
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          <BudgetRefinementModal 
            isOpen={isRefinementOpen}
            onClose={() => setIsRefinementOpen(false)}
            category={category}
          />
        </>
      )}
    </AnimatePresence>
  );
}
