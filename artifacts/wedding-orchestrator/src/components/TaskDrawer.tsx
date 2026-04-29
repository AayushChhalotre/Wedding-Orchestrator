import { X, CheckCircle2, Clock, AlertTriangle, UserCircle2, ExternalLink, Check, Calendar as CalendarIcon, UserPlus, FileUp, ShieldCheck, IndianRupee, Tags } from "lucide-react";
import { type Task } from "@/lib/models/schema";
import { useStore } from "@/store/useStore";
import { cn, formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface TaskDrawerProps {
  taskId: string | null;
  onClose: () => void;
}

const statusConfig = {
  not_started: { label: "Not started", color: "bg-muted/50 text-muted-foreground border-border/50" },
  in_progress: { label: "In progress", color: "bg-primary/10 text-primary border-primary/20" },
  done: { label: "Done", color: "bg-green-50 text-green-700 border-green-100" },
  at_risk: { label: "At risk", color: "bg-amber-50 text-amber-700 border-amber-100" },
  overdue: { label: "Overdue", color: "bg-red-50 text-red-600 border-red-100" },
  blocked: { label: "Blocked", color: "bg-slate-100 text-slate-600 border-slate-200" },
};

export function TaskDrawer({ taskId, onClose }: TaskDrawerProps) {
  const tasks = useStore(state => state.tasks);
  const completeTask = useStore(state => state.completeTask);
  const snoozeTask = useStore(state => state.snoozeTask);
  const reassignTask = useStore(state => state.reassignTask);
  const addProofToTask = useStore(state => state.addProofToTask);
  const partner1Name = useStore(state => state.weddingInfo.partner1Name);
  const partner2Name = useStore(state => state.weddingInfo.partner2Name);
  const updateTaskCustomData = useStore(state => state.updateTaskCustomData);
  const budgetCategories = useStore(state => state.budgetCategories);
  const linkTaskToBudgetCategory = useStore(state => state.linkTaskToBudgetCategory);
  const completeTaskWithBudget = useStore(state => state.completeTaskWithBudget);
  const updateTaskActualCost = useStore(state => state.updateTaskActualCost);

  const [isSnoozeOpen, setIsSnoozeOpen] = useState(false);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [isProofOpen, setIsProofOpen] = useState(false);
  const [snoozeDays, setSnoozeDays] = useState(3);
  const [proofData, setProofData] = useState({
    amount: "",
    docName: "Payment Receipt",
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });

  const task = tasks.find((t) => t.id === taskId);

  if (!task) return null;

  const status = statusConfig[task.status];
  const prereqs = tasks.filter((t) => task.dependencies.includes(t.id));
  const blockedTasks = tasks.filter((t) => task.blocks.includes(t.id));

  return (
    <AnimatePresence>
      {taskId && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={onClose}
            data-testid="drawer-backdrop"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className={cn(
              "fixed z-50 bg-white border-border shadow-2xl flex flex-col overflow-hidden",
              // Mobile: full screen-ish
              "inset-x-0 bottom-0 top-0 lg:left-auto lg:right-0 lg:w-[480px] lg:border-l"
            )}
            data-testid="task-drawer"
          >
            {/* Header */}
            <div className="flex items-start justify-between px-8 pt-10 pb-6 border-b border-border/40 bg-white/80 backdrop-blur-md sticky top-0 z-20">
              <div className="flex-1 pr-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={cn("text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest border", status.color)}>
                    {status.label}
                  </span>
                  {task.status === "at_risk" && (
                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-full border border-amber-100">
                      <AlertTriangle size={12} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Priority Attention</span>
                    </div>
                  )}
                </div>
                <h2 className="text-2xl font-serif-display text-foreground leading-tight tracking-tight">{task.title}</h2>
                <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                  <CalendarIcon size={13} className="stroke-[2.5px]" />
                  <p className="text-xs font-semibold">Due {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center text-muted-foreground/60 hover:text-foreground hover:bg-muted rounded-full transition-all active:scale-90"
                data-testid="drawer-close"
              >
                <X size={22} />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">

              {/* Why it matters */}
              <section className="relative pl-6">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary/20 rounded-full" />
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" title="Ready for action" />
                </div>
                <p className="text-lg text-foreground leading-snug font-medium italic serif-gradient">"{task.whyItMatters}"</p>
              </section>

              {/* Owner */}
              <section>
                <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4">Who's handling this?</h3>
                <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/40">
                  <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20">
                    {task.ownerInitials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{task.owner}</p>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{task.ownerType}</p>
                  </div>
                  {task.ownerType === "vendor" && (
                    <Link href={`/vendor-portal/${task.id}`}>
                      <div className="ml-auto flex items-center gap-2 text-xs font-bold text-primary hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-all cursor-pointer">
                        <ExternalLink size={14} />
                        Vendor Portal
                      </div>
                    </Link>
                  )}
                </div>
              </section>

              {/* Dependencies & Blockers */}
              <div className="grid grid-cols-1 gap-8">
                <section>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4">What's needed first?</h3>
                  {prereqs.length === 0 ? (
                    <p className="text-sm text-muted-foreground/60 italic font-medium">Clear to start!</p>
                  ) : (
                    <ul className="space-y-3">
                      {prereqs.map((dep) => (
                        <li key={dep.id} className="flex items-center gap-3 p-3 rounded-xl border border-border/40 bg-white/50">
                          {dep.status === "done" ? (
                            <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                              <Check size={12} strokeWidth={4} />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-muted text-muted-foreground/60 flex items-center justify-center shrink-0">
                              <Clock size={12} />
                            </div>
                          )}
                          <span className={cn("text-xs font-semibold", dep.status === "done" ? "line-through text-muted-foreground/60" : "text-foreground")}>
                            {dep.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4">What follows this step?</h3>
                  {blockedTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground/60 italic font-medium">No future steps waiting on this</p>
                  ) : (
                    <ul className="space-y-3">
                      {blockedTasks.map((bt) => (
                        <li key={bt.id} className="flex items-center gap-3 p-3 rounded-xl border border-primary/10 bg-primary/5">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span className="text-xs font-bold text-foreground">
                            {bt.title}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </div>

              {/* Custom Action Areas */}
              {task.customActionType && (
                <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  
                  {task.customActionType === 'guest_count' && (
                    <>
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4 relative z-10">Estimated Guest Count</h3>
                      <div className="flex gap-3 relative z-10">
                        <input 
                          type="number" 
                          className="flex-1 bg-white border border-primary/20 rounded-xl px-4 py-4 text-base font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:outline-none transition-all shadow-sm"
                          placeholder="e.g. 150"
                          value={task.customActionData?.count || ''}
                          onChange={e => updateTaskCustomData(task.id, { ...task.customActionData, count: e.target.value })}
                        />
                      </div>
                    </>
                  )}

                  {task.customActionType === 'venue_shortlist' && (
                    <>
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4 relative z-10">Top Venue Choices</h3>
                      <div className="space-y-4 relative z-10">
                        {[1, 2, 3].map(priority => (
                          <div key={priority} className="flex gap-3 items-center">
                            <span className="text-xs font-bold text-primary/40 w-5">{priority}</span>
                            <input 
                              type="text" 
                              className="flex-1 bg-white border border-primary/20 rounded-xl px-4 py-3 text-sm font-bold focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all"
                              placeholder={`Preferred Venue ${priority}`}
                              value={task.customActionData?.[`venue${priority}`] || ''}
                              onChange={e => updateTaskCustomData(task.id, { ...task.customActionData, [`venue${priority}`]: e.target.value })}
                            />
                            <button className="p-3 text-primary/60 hover:text-primary hover:bg-primary/10 bg-white border border-primary/20 rounded-xl transition-all active:scale-90" title={`Upload photos for choice ${priority}`}>
                              <FileUp size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {task.customActionType === 'invitation_designs' && (
                    <>
                      <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4 relative z-10">Choose a Design</h3>
                      <div className="grid grid-cols-2 gap-3 mb-4 relative z-10">
                        {[1, 2, 3, 4].map(idx => (
                          <div 
                            key={idx} 
                            className={cn(
                              "aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden",
                              task.customActionData?.selectedDesign === idx 
                                ? "border-primary bg-white shadow-lg shadow-primary/10 scale-[1.02]" 
                                : "border-primary/20 hover:border-primary/50 hover:bg-white/50"
                            )}
                            onClick={() => updateTaskCustomData(task.id, { ...task.customActionData, selectedDesign: idx })}
                          >
                            {task.customActionData?.designs?.[idx] ? (
                               <div className="absolute inset-0 bg-muted flex items-center justify-center text-xs text-muted-foreground">Choice {idx}</div>
                            ) : (
                              <>
                                <FileUp size={20} className="text-primary/30 mb-2 group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest text-center px-2">Upload {idx}</span>
                              </>
                            )}
                            {task.customActionData?.selectedDesign === idx && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md">
                                <Check size={12} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest text-center">Tap to select your favorite</p>
                    </>
                  )}
                </section>
              )}

              {/* Financial Context */}
              {(task.estimatedCost || task.budgetCategoryId) && (
                <section className="bg-green-50/50 border border-green-100 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] uppercase tracking-[0.2em] text-green-700 font-bold">Financial tracking</h3>
                    <div className="p-1.5 bg-green-100 rounded-lg text-green-700">
                      <IndianRupee size={14} />
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] text-green-600/70 font-bold uppercase tracking-wider mb-1">Estimated Budget</p>
                        <p className="text-xl font-bold text-green-900">{formatCurrency(task.estimatedCost || 0)}</p>
                      </div>
                      {task.actualCost && (
                        <div className="text-right">
                          <p className="text-[10px] text-green-600/70 font-bold uppercase tracking-wider mb-1">Actual Paid</p>
                          <p className="text-xl font-bold text-foreground">{formatCurrency(task.actualCost)}</p>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-green-100">
                      <p className="text-[10px] text-green-600/70 font-bold uppercase tracking-wider mb-3">Linked Category</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 relative">
                          <Tags size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-green-600/40" />
                          <select 
                            className="w-full bg-white border border-green-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-green-900 focus:ring-2 focus:ring-green-500/20 focus:outline-none appearance-none cursor-pointer"
                            value={task.budgetCategoryId || ""}
                            onChange={(e) => linkTaskToBudgetCategory(task.id, e.target.value)}
                          >
                            <option value="">Select a category...</option>
                            {budgetCategories.map(cat => (
                              <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* Notes */}
              {task.notes && (
                <section>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4">Thoughts & Details</h3>
                  <div className="p-5 bg-muted/20 rounded-2xl text-sm font-medium text-foreground/80 leading-relaxed whitespace-pre-wrap border border-border/40">
                    {task.notes}
                  </div>
                </section>
              )}

              {/* Proof Upload Area */}
              <button 
                onClick={() => setIsProofOpen(true)}
                className="w-full py-5 px-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center gap-3 text-xs font-bold text-primary hover:bg-primary/10 hover:border-primary/50 transition-all active:scale-[0.98] group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
                  <ShieldCheck size={18} />
                </div>
                Save Progress & Proof
              </button>
            </div>

            {/* Action bar */}
            <div className="border-t border-border/40 px-8 py-8 bg-white/80 backdrop-blur-md sticky bottom-0 z-20 flex gap-4">
              <button
                className="flex-[2] h-14 bg-foreground text-background text-sm font-bold rounded-2xl hover:bg-primary transition-all active:scale-[0.97] shadow-xl shadow-foreground/5 flex items-center justify-center gap-2 group border border-white/10"
                data-testid="btn-mark-done"
                onClick={async () => {
                  if (task) {
                    if (task.budgetCategoryId || task.actualCost) {
                      completeTaskWithBudget(task.id, task.actualCost || task.estimatedCost || 0);
                    } else {
                      completeTask(task.id);
                    }
                  }
                  onClose();
                }}
              >
                <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />
                Done & Dusted
              </button>
              <div className="flex flex-1 gap-2">
                <button
                  onClick={() => setIsSnoozeOpen(!isSnoozeOpen)}
                  className={cn(
                    "flex-1 h-14 bg-muted hover:bg-muted/80 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center",
                    isSnoozeOpen && "ring-2 ring-primary bg-white"
                  )}
                  title="Reschedule"
                >
                  <Clock size={20} className="text-foreground/60" />
                </button>
                <button
                  onClick={() => setIsReassignOpen(!isReassignOpen)}
                  className={cn(
                    "flex-1 h-14 bg-muted hover:bg-muted/80 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center",
                    isReassignOpen && "ring-2 ring-primary bg-white"
                  )}
                  title="Handover"
                >
                  <UserPlus size={20} className="text-foreground/60" />
                </button>
              </div>
            </div>

            {/* Overlays (Snooze, Reassign, Proof) */}
            <AnimatePresence>
              {isSnoozeOpen && (
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="absolute bottom-0 left-0 right-0 bg-white border-t border-border shadow-[0_-20px_50px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] p-8 pb-12 z-30"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Need more time?</h4>
                    <button onClick={() => setIsSnoozeOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {[1, 3, 7].map(d => (
                      <button 
                        key={d}
                        onClick={() => setSnoozeDays(d)}
                        className={cn(
                          "py-4 rounded-2xl border-2 font-bold text-sm transition-all",
                          snoozeDays === d 
                            ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                            : "border-muted bg-muted/20 text-muted-foreground hover:border-primary/30"
                        )}
                      >
                        +{d}d
                      </button>
                    ))}
                  </div>
                  
                  <div className="mb-10">
                    <label className="text-[10px] uppercase font-bold text-muted-foreground mb-3 block tracking-widest">Or pick exactly how many days</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={snoozeDays}
                        onChange={(e) => setSnoozeDays(parseInt(e.target.value) || 0)}
                        className="w-full bg-muted/30 border-none rounded-2xl px-5 py-4 text-base font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">days</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      snoozeTask(task.id, snoozeDays);
                      setIsSnoozeOpen(false);
                    }}
                    className="w-full h-14 bg-foreground text-background text-sm font-bold rounded-2xl hover:bg-primary transition-all active:scale-[0.98] shadow-xl shadow-foreground/5"
                  >
                    Update Due Date
                  </button>
                </motion.div>
              )}

              {isReassignOpen && (
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="absolute bottom-0 left-0 right-0 bg-white border-t border-border shadow-[0_-20px_50px_rgba(0,0,0,0.1)] rounded-t-[2.5rem] p-8 pb-12 z-30"
                >
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Handover this task</h4>
                    <button onClick={() => setIsReassignOpen(false)} className="text-muted-foreground hover:text-foreground">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {[
                      { name: partner1Name || "Partner 1", type: "couple" },
                      { name: partner2Name || "Partner 2", type: "couple" },
                      { name: "Vendor Team", type: "vendor" }
                    ].map(owner => (
                      <button 
                        key={owner.name}
                        onClick={() => {
                          reassignTask(task.id, owner.name, owner.type as any);
                          setIsReassignOpen(false);
                        }}
                        className="w-full p-5 text-left bg-muted/20 border-2 border-transparent rounded-2xl hover:border-primary/30 hover:bg-white transition-all flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{owner.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{owner.type}</p>
                        </div>
                        <CheckCircle2 size={18} className="text-muted-foreground/40 group-hover:text-primary transition-all" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {isProofOpen && (
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  className="absolute bottom-0 left-0 right-0 top-0 bg-white z-[70] p-8 pb-12 flex flex-col overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-10 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary/10 rounded-xl text-primary shadow-sm">
                        <ShieldCheck size={22} />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif-display tracking-tight">Record Progress</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em]">Wedding Logbook</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsProofOpen(false)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-muted rounded-full transition-all"
                    >
                      <X size={22} />
                    </button>
                  </div>
                  
                  <div className="space-y-8 mb-auto">
                    {task.customActionType === 'guest_count' ? (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Confirmed Guest Count</label>
                        <input 
                          type="number" 
                          placeholder="Final number..."
                          className="w-full bg-muted/30 border border-transparent rounded-2xl px-5 py-5 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
                          value={proofData.amount}
                          onChange={(e) => setProofData({...proofData, amount: e.target.value})}
                        />
                      </div>
                    ) : (task.category === 'Finance' || (task.estimatedCost && !task.customActionType)) ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Amount Paid</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-[10px]">INR</span>
                            <input 
                              type="number" 
                              placeholder="0.00"
                              className="w-full bg-muted/30 border border-transparent rounded-2xl pl-10 pr-4 py-5 text-sm font-bold focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all"
                              value={proofData.amount}
                              onChange={(e) => setProofData({...proofData, amount: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Date</label>
                          <input 
                            type="date" 
                            className="w-full bg-muted/30 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            value={proofData.date}
                            onChange={(e) => setProofData({...proofData, date: e.target.value})}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Date of Action</label>
                        <input 
                          type="date" 
                          className="w-full bg-muted/30 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                          value={proofData.date}
                          onChange={(e) => setProofData({...proofData, date: e.target.value})}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Attachment Type</label>
                      <select 
                        className="w-full bg-muted/30 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                        value={proofData.docName}
                        onChange={(e) => setProofData({...proofData, docName: e.target.value})}
                      >
                        <option>Payment Receipt</option>
                        <option>Signed Contract</option>
                        <option>Final Guest List</option>
                        <option>Menu Selection</option>
                        <option>Booking Confirmation</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Any extra details?</label>
                      <textarea 
                        placeholder="Add notes, terms, or things to remember..."
                        className="w-full bg-muted/30 border-none rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all resize-none h-40"
                        value={proofData.notes}
                        onChange={(e) => setProofData({...proofData, notes: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    disabled={!proofData.docName}
                    onClick={() => {
                      addProofToTask(task.id, { 
                        docName: proofData.docName,
                        amount: proofData.amount ? parseFloat(proofData.amount) : undefined,
                        date: proofData.date,
                        notes: proofData.notes
                      });
                      if (proofData.amount) {
                        updateTaskActualCost(task.id, parseFloat(proofData.amount));
                      }
                      setIsProofOpen(false);
                      setProofData({
                        amount: "",
                        docName: "Payment Receipt",
                        notes: "",
                        date: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="w-full h-16 mt-10 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/20 disabled:opacity-50 active:scale-[0.97] transition-all flex items-center justify-center gap-3 border border-white/20"
                  >
                    <Check size={20} strokeWidth={3} />
                    Commit to Logbook
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
