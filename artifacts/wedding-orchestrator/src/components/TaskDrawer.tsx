import { X, CheckCircle2, Clock, AlertTriangle, UserCircle2, ExternalLink, Check, Calendar as CalendarIcon, UserPlus, FileUp, ShieldCheck, IndianRupee, Tags, Users, TrendingUp, DollarSign, Heart, Music, Truck, Utensils, Palette, Plus, Trash2 } from "lucide-react";
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

function SummaryCard({ task }: { task: Task }) {
  const budgetCategories = useStore(state => state.budgetCategories);
  const weddingInfo = useStore(state => state.weddingInfo);
  
  const category = budgetCategories.find(c => c.id === task.budgetCategoryId);
  
  if (!task.customActionType) return null;

  const renderImpact = () => {
    switch (task.customActionType) {
      case 'catering_details':
        const drift = category?.driftAmount || 0;
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                <Utensils size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Budget Impact</p>
                <p className={cn("text-xs font-bold", drift > 0 ? "text-red-600" : "text-green-600")}>
                  {drift > 0 ? `+${formatCurrency(drift)} drift` : "On track"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Guests</p>
              <p className="text-xs font-bold text-foreground">{weddingInfo.guests} pax</p>
            </div>
          </div>
        );
      case 'decor_concept':
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
                <Palette size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Vision Sync</p>
                <p className="text-xs font-bold text-purple-700">
                  {task.customActionData?.theme ? "Theme Locked" : "Defining Vibe"}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Confidence</p>
              <p className="text-xs font-bold text-foreground">{category?.confidence || 'Low'}</p>
            </div>
          </div>
        );
      case 'logistics_pickups':
        const arrivals = task.customActionData?.totalArrivals || 0;
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                <Truck size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Arrivals</p>
                <p className="text-xs font-bold text-blue-700">{arrivals} Guests</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</p>
              <p className="text-xs font-bold text-foreground">{arrivals > 0 ? "Fleet Ready" : "Pending List"}</p>
            </div>
          </div>
        );
      case 'sangeet_setlist':
        const songCount = task.customActionData?.songs?.length || 0;
        return (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center text-pink-600">
                <Music size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Program Length</p>
                <p className="text-xs font-bold text-pink-700">{songCount * 4} mins approx.</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Items</p>
              <p className="text-xs font-bold text-foreground">{songCount} Performances</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const impactContent = renderImpact();
  if (!impactContent) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-border/40 rounded-2xl p-4 shadow-sm"
    >
      {impactContent}
    </motion.div>
  );
}



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
  const [isLogbookOpen, setIsLogbookOpen] = useState(false);
  const weddingInfo = useStore(state => state.weddingInfo);
  const [snoozeDays, setSnoozeDays] = useState(1);
  const [logbookData, setLogbookData] = useState({
    amount: "",
    docName: "Booking Keepsake",
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

              {/* Requirements */}
              {task.requirements && task.requirements.length > 0 && (
                <section>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold mb-4">What's required?</h3>
                  <div className="space-y-3">
                    {task.requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-muted/10 border border-border/20 group/req hover:bg-muted/20 transition-all duration-300">
                        <div className="w-6 h-6 rounded-lg bg-white border border-border/40 flex items-center justify-center text-[10px] font-bold text-muted-foreground group-hover/req:border-primary group-hover/req:text-primary transition-colors">
                          {i + 1}
                        </div>
                        <span className="text-sm font-medium text-foreground/80 leading-snug">{req.text}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

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
                <div className="space-y-4">
                  {/* Summary Card for Impact Visualization */}
                  <SummaryCard task={task} />
                  
                  <section className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                  
                  {task.customActionType === 'guest_count' && (
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Balanced Guest Estimator</h3>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                          <Users size={10} className="text-primary" />
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Estimate Phase</span>
                        </div>
                      </div>

                      <div className="space-y-5">
                        {[
                          { key: 'partner1Guests', label: `${partner1Name || 'P1'}'s Side`, icon: <UserCircle2 size={14} /> },
                          { key: 'partner2Guests', label: `${partner2Name || 'P2'}'s Side`, icon: <UserCircle2 size={14} /> },
                          { key: 'mutualGuests', label: 'Mutual Friends', icon: <Heart size={14} /> }
                        ].map((side) => (
                          <div key={side.key} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className="text-primary/60">{side.icon}</div>
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{side.label}</span>
                              </div>
                              <span className="text-xs font-bold text-primary">{task.customActionData?.[side.key] || 0}</span>
                            </div>
                            <input 
                              type="range" 
                              min="0" 
                              max="300" 
                              step="5"
                              className="w-full h-1.5 bg-primary/10 rounded-full appearance-none cursor-pointer accent-primary"
                              value={task.customActionData?.[side.key] || 0}
                              onChange={e => updateTaskCustomData(task.id, { ...task.customActionData, [side.key]: parseInt(e.target.value) })}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="pt-5 border-t border-primary/10">
                        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-primary/5">
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-0.5">Total Crowd Size</p>
                            <p className="text-2xl font-serif-display text-primary">
                              {(task.customActionData?.partner1Guests || 0) + 
                               (task.customActionData?.partner2Guests || 0) + 
                               (task.customActionData?.mutualGuests || 0)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-widest mb-1">Impact Level</p>
                            <span className={cn(
                              "text-[9px] px-2 py-1 rounded-lg font-bold uppercase",
                              ((task.customActionData?.partner1Guests || 0) + (task.customActionData?.partner2Guests || 0) + (task.customActionData?.mutualGuests || 0)) > 250 
                                ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"
                            )}>
                              {((task.customActionData?.partner1Guests || 0) + (task.customActionData?.partner2Guests || 0) + (task.customActionData?.mutualGuests || 0)) > 250 
                                ? "High (Grand)" : "Low (Intimate)"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {task.customActionType === 'overall_budget' && (
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Total Wedding Budget</h3>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                          <IndianRupee size={10} className="text-primary" />
                          <span className="text-[9px] font-bold text-primary uppercase tracking-wider">Global Sync</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {[
                          { id: 'tier-1', label: 'Intimate', range: '15L - 25L', amount: 2000000 },
                          { id: 'tier-2', label: 'Classic', range: '25L - 50L', amount: 3500000 },
                          { id: 'tier-3', label: 'Grand', range: '50L+', amount: 6000000 },
                        ].map(tier => (
                          <button
                            key={tier.id}
                            onClick={() => updateTaskCustomData(task.id, { ...task.customActionData, amount: tier.amount })}
                            className={cn(
                              "flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all active:scale-95",
                              task.customActionData?.amount === tier.amount 
                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                                : "bg-white border-primary/10 text-muted-foreground hover:border-primary/30"
                            )}
                          >
                            <span className="text-[9px] font-bold uppercase tracking-tighter leading-none">{tier.label}</span>
                            <span className="text-[8px] opacity-80 font-medium">{tier.range}</span>
                          </button>
                        ))}
                      </div>

                      <div className="relative">
                        <IndianRupee size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                        <input 
                          type="number" 
                          className="w-full bg-white border border-primary/20 rounded-xl pl-11 pr-4 py-4 text-lg font-bold focus:ring-4 focus:ring-primary/5 focus:border-primary/40 focus:outline-none transition-all shadow-sm"
                          placeholder="Custom amount..."
                          value={task.customActionData?.amount || ""}
                          onChange={e => updateTaskCustomData(task.id, { ...task.customActionData, amount: parseInt(e.target.value) || 0 })}
                        />
                      </div>

                      {task.customActionData?.amount > 0 && (
                        <div className="space-y-3">
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Standard Allocation Preview</p>
                          <div className="flex h-3 w-full rounded-full overflow-hidden border border-white/40 shadow-inner">
                            <div className="bg-primary w-[50%] h-full" title="Venue & Food: 50%" />
                            <div className="bg-primary/60 w-[20%] h-full border-l border-white/20" title="Decor: 20%" />
                            <div className="bg-primary/40 w-[15%] h-full border-l border-white/20" title="Photo/Video: 15%" />
                            <div className="bg-primary/20 w-[15%] h-full border-l border-white/20" title="Misc: 15%" />
                          </div>
                          <div className="flex justify-between text-[8px] font-bold text-primary/60 uppercase">
                            <span>Venue (50%)</span>
                            <span>Other (50%)</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {task.customActionType === 'venue_shortlist' && (
                    <div className="space-y-5 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Priority Venue Shortlist</h3>
                      </div>

                      <div className="space-y-3">
                        {[1, 2, 3].map(priority => (
                          <div key={priority} className="group flex gap-3 items-center bg-white/50 p-2 rounded-2xl border border-primary/5 hover:bg-white transition-all">
                            <div className={cn(
                              "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold border shrink-0 transition-colors",
                              priority === 1 ? "bg-primary text-white border-primary" : "bg-primary/5 text-primary border-primary/10"
                            )}>
                              #{priority}
                            </div>
                            <input 
                              type="text" 
                              className="flex-1 bg-transparent border-none px-1 py-2 text-sm font-bold focus:outline-none placeholder:text-muted-foreground/30"
                              placeholder={`Name of venue ${priority}...`}
                              value={task.customActionData?.[`venue${priority}`] || ''}
                              onChange={e => updateTaskCustomData(task.id, { ...task.customActionData, [`venue${priority}`]: e.target.value })}
                            />
                            <button className="w-10 h-10 flex items-center justify-center text-primary/40 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" title="Upload brochure/photos">
                              <FileUp size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.customActionType === 'invitation_designs' && (
                    <div className="space-y-5 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Choose Theme Direction</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
                          <Check size={10} className="text-primary" />
                          <span className="text-[8px] font-bold text-primary uppercase">No AI costs</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-2">
                        {[
                          { id: 1, name: 'Traditional Red', style: 'border-red-200 bg-red-50/30' },
                          { id: 2, name: 'Royal Gold', style: 'border-amber-200 bg-amber-50/30' },
                          { id: 3, name: 'Modern Minimal', style: 'border-slate-200 bg-slate-50/30' },
                          { id: 4, name: 'Floral Garden', style: 'border-emerald-200 bg-emerald-50/30' },
                        ].map(choice => (
                          <div 
                            key={choice.id} 
                            className={cn(
                              "aspect-[4/3] rounded-2xl border-2 p-4 flex flex-col justify-end cursor-pointer transition-all active:scale-[0.98]",
                              choice.style,
                              task.customActionData?.selectedDesign === choice.id 
                                ? "border-primary bg-white shadow-lg ring-2 ring-primary/20" 
                                : "hover:border-primary/40"
                            )}
                            onClick={() => updateTaskCustomData(task.id, { ...task.customActionData, selectedDesign: choice.id })}
                          >
                            <span className="text-[10px] font-bold text-foreground leading-tight">{choice.name}</span>
                            {task.customActionData?.selectedDesign === choice.id && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                <Check size={14} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.customActionType === 'catering_details' && (
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Catering & Menu Details</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
                          <Utensils size={10} className="text-primary" />
                          <span className="text-[8px] font-bold text-primary uppercase">Auto-Calc</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Price Per Plate</span>
                            <span className="text-sm font-bold text-primary">₹{task.customActionData?.perPlate || 0}</span>
                          </div>
                          <input 
                            type="range" 
                            min="500" 
                            max="5000" 
                            step="100"
                            className="w-full h-1.5 bg-primary/10 rounded-full appearance-none cursor-pointer accent-primary"
                            value={task.customActionData?.perPlate || 1500}
                            onChange={e => updateTaskCustomData(task.id, { ...task.customActionData, perPlate: parseInt(e.target.value) })}
                          />
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Cuisine Style</span>
                          <div className="flex flex-wrap gap-2">
                            {['Traditional', 'Fusion', 'Global', 'Organic'].map(style => (
                              <button
                                key={style}
                                onClick={() => updateTaskCustomData(task.id, { ...task.customActionData, cuisine: style })}
                                className={cn(
                                  "px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all",
                                  task.customActionData?.cuisine === style
                                    ? "bg-primary border-primary text-white"
                                    : "bg-white border-primary/10 text-primary hover:bg-primary/5"
                                )}
                              >
                                {style}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {task.customActionType === 'decor_concept' && (
                    <div className="space-y-6 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Decor & Vibe Theme</h3>
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full">
                          <Palette size={10} className="text-primary" />
                          <span className="text-[8px] font-bold text-primary uppercase">Moodboard</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { name: 'Royal Rajputana', mood: 'Regal, Gold, Red' },
                          { name: 'Tropical Paradise', mood: 'Green, Fresh, Floral' },
                          { name: 'Ethereal White', mood: 'Minimal, Elegant, Glass' },
                          { name: 'Boho Chic', mood: 'Vibrant, Warm, Earthy' }
                        ].map(theme => (
                          <button
                            key={theme.name}
                            onClick={() => updateTaskCustomData(task.id, { ...task.customActionData, theme: theme.name, mood: theme.mood })}
                            className={cn(
                              "p-4 rounded-2xl border-2 text-left transition-all",
                              task.customActionData?.theme === theme.name
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                                : "bg-white border-primary/10 text-muted-foreground hover:border-primary/20"
                            )}
                          >
                            <p className="text-[10px] font-bold uppercase mb-1">{theme.name}</p>
                            <p className="text-[8px] opacity-80">{theme.mood}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {task.customActionType === 'sangeet_setlist' && (
                    <div className="space-y-5 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Sangeet Setlist</h3>
                        <button 
                          onClick={() => {
                            const songs = task.customActionData?.songs || [];
                            updateTaskCustomData(task.id, { 
                              ...task.customActionData, 
                              songs: [...songs, { id: Date.now(), title: '', performers: '' }] 
                            });
                          }}
                          className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg hover:bg-primary/20 transition-all"
                        >
                          <Plus size={12} className="text-primary" />
                          <span className="text-[10px] font-bold text-primary uppercase">Add Song</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(task.customActionData?.songs || []).map((song: any, idx: number) => (
                          <div key={song.id} className="flex gap-2 items-start bg-white/50 p-3 rounded-xl border border-primary/10">
                            <div className="flex-1 space-y-2">
                              <input 
                                type="text"
                                placeholder="Song Title (e.g. Kala Chashma)"
                                className="w-full bg-transparent border-none text-xs font-bold focus:outline-none placeholder:text-primary/20"
                                value={song.title}
                                onChange={e => {
                                  const songs = [...task.customActionData.songs];
                                  songs[idx].title = e.target.value;
                                  updateTaskCustomData(task.id, { ...task.customActionData, songs });
                                }}
                              />
                              <input 
                                type="text"
                                placeholder="Performers (e.g. Bride's Friends)"
                                className="w-full bg-transparent border-none text-[10px] font-medium text-muted-foreground focus:outline-none placeholder:text-muted-foreground/30"
                                value={song.performers}
                                onChange={e => {
                                  const songs = [...task.customActionData.songs];
                                  songs[idx].performers = e.target.value;
                                  updateTaskCustomData(task.id, { ...task.customActionData, songs });
                                }}
                              />
                            </div>
                            <button 
                              onClick={() => {
                                const songs = task.customActionData.songs.filter((_: any, i: number) => i !== idx);
                                updateTaskCustomData(task.id, { ...task.customActionData, songs });
                              }}
                              className="text-red-300 hover:text-red-500 p-1"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                        {(!task.customActionData?.songs || task.customActionData.songs.length === 0) && (
                          <div className="text-center py-6 border-2 border-dashed border-primary/10 rounded-xl">
                            <Music size={24} className="mx-auto text-primary/20 mb-2" />
                            <p className="text-[10px] font-bold text-primary/40 uppercase">No songs added yet</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {task.customActionType === 'logistics_pickups' && (
                    <div className="space-y-5 relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold">Airport/Station Pickups</h3>
                        <button 
                          onClick={() => {
                            const pickups = task.customActionData?.pickups || [];
                            updateTaskCustomData(task.id, { 
                              ...task.customActionData, 
                              pickups: [...pickups, { id: Date.now(), time: '', guests: 1, name: '' }] 
                            });
                          }}
                          className="flex items-center gap-1 px-2 py-1 bg-primary/10 rounded-lg hover:bg-primary/20 transition-all"
                        >
                          <Plus size={12} className="text-primary" />
                          <span className="text-[10px] font-bold text-primary uppercase">Add Pickup</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {(task.customActionData?.pickups || []).map((p: any, idx: number) => (
                          <div key={p.id} className="grid grid-cols-12 gap-2 bg-white/50 p-3 rounded-xl border border-primary/10 items-center">
                            <div className="col-span-3">
                              <input 
                                type="text"
                                placeholder="Time"
                                className="w-full bg-transparent border-none text-xs font-bold focus:outline-none"
                                value={p.time}
                                onChange={e => {
                                  const pickups = [...task.customActionData.pickups];
                                  pickups[idx].time = e.target.value;
                                  updateTaskCustomData(task.id, { ...task.customActionData, pickups });
                                }}
                              />
                            </div>
                            <div className="col-span-6 border-l border-primary/10 pl-2">
                              <input 
                                type="text"
                                placeholder="Guest Name"
                                className="w-full bg-transparent border-none text-xs font-medium focus:outline-none"
                                value={p.name}
                                onChange={e => {
                                  const pickups = [...task.customActionData.pickups];
                                  pickups[idx].name = e.target.value;
                                  updateTaskCustomData(task.id, { ...task.customActionData, pickups });
                                }}
                              />
                            </div>
                            <div className="col-span-2 flex items-center gap-1 border-l border-primary/10 pl-2">
                              <Users size={10} className="text-primary/40" />
                              <input 
                                type="number"
                                className="w-full bg-transparent border-none text-xs font-bold focus:outline-none"
                                value={p.guests}
                                onChange={e => {
                                  const pickups = [...task.customActionData.pickups];
                                  pickups[idx].guests = parseInt(e.target.value) || 0;
                                  updateTaskCustomData(task.id, { ...task.customActionData, pickups });
                                }}
                              />
                            </div>
                            <div className="col-span-1 text-right">
                              <button 
                                onClick={() => {
                                  const pickups = task.customActionData.pickups.filter((_: any, i: number) => i !== idx);
                                  updateTaskCustomData(task.id, { ...task.customActionData, pickups });
                                }}
                                className="text-red-300 hover:text-red-500"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {task.customActionData?.totalArrivals > 0 && (
                          <div className="flex justify-between items-center px-4 py-3 bg-primary/10 rounded-xl border border-primary/20">
                            <span className="text-[10px] font-bold text-primary uppercase">Total Arrivals Planned</span>
                            <span className="text-sm font-bold text-primary">{task.customActionData.totalArrivals} guests</span>
                          </div>
                        )}
                        {(!task.customActionData?.pickups || task.customActionData.pickups.length === 0) && (
                          <div className="text-center py-6 border-2 border-dashed border-primary/10 rounded-xl">
                            <Truck size={24} className="mx-auto text-primary/20 mb-2" />
                            <p className="text-[10px] font-bold text-primary/40 uppercase">No pickups scheduled</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  </section>
                </div>
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

              {/* Documentation & Logbook */}
              <button 
                onClick={() => setIsLogbookOpen(true)}
                className="w-full py-5 px-6 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 flex items-center justify-center gap-3 text-xs font-bold text-primary hover:bg-primary/10 hover:border-primary/50 transition-all active:scale-[0.98] group"
              >
                <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
                  <ShieldCheck size={18} />
                </div>
                {task.customActionType === 'guest_count' ? 'Finalize Guest Numbers' : (task.category === 'Finance' || task.estimatedCost) ? 'Record Payment & Save Keepsake' : 'Add Update to Logbook'}
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

              {isLogbookOpen && (
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
                        <h4 className="text-xl font-serif-display tracking-tight">{task.customActionType === 'guest_count' ? 'Confirm Final Numbers' : 'Add to Wedding Logbook'}</h4>
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em]">Memory & Evidence</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsLogbookOpen(false)}
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
                          value={logbookData.amount}
                          onChange={(e) => setLogbookData({...logbookData, amount: e.target.value})}
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
                              value={logbookData.amount}
                              onChange={(e) => setLogbookData({...logbookData, amount: e.target.value})}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Date</label>
                          <input 
                            type="date" 
                            className="w-full bg-muted/30 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                            value={logbookData.date}
                            onChange={(e) => setLogbookData({...logbookData, date: e.target.value})}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Date of Action</label>
                        <input 
                          type="date" 
                          className="w-full bg-muted/30 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                          value={logbookData.date}
                          onChange={(e) => setLogbookData({...logbookData, date: e.target.value})}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Documentation Type</label>
                      <select 
                        className="w-full bg-muted/30 border-none rounded-2xl px-5 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                        value={logbookData.docName}
                        onChange={(e) => setLogbookData({...logbookData, docName: e.target.value})}
                      >
                        {(task.category === 'Finance' || task.estimatedCost) ? (
                          <>
                            <option>Booking Keepsake</option>
                            <option>Signed Contract</option>
                            <option>Booking Confirmation</option>
                            <option>Invoice</option>
                          </>
                        ) : task.customActionType === 'guest_count' ? (
                          <>
                            <option>Final Guest List</option>
                            <option>RSVP Export</option>
                          </>
                        ) : (
                          <>
                            <option>Menu Selection</option>
                            <option>Moodboard Link</option>
                            <option>Email Confirmation</option>
                            <option>General Update</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Any extra details?</label>
                      <textarea 
                        placeholder="Add notes, terms, or things to remember..."
                        className="w-full bg-muted/30 border-none rounded-2xl p-5 text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all resize-none h-40"
                        value={logbookData.notes}
                        onChange={(e) => setLogbookData({...logbookData, notes: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    disabled={!logbookData.docName}
                    onClick={() => {
                      addProofToTask(task.id, { 
                        docName: logbookData.docName,
                        amount: logbookData.amount ? parseFloat(logbookData.amount) : undefined,
                        date: logbookData.date,
                        notes: logbookData.notes
                      });
                      if (logbookData.amount) {
                        updateTaskActualCost(task.id, parseFloat(logbookData.amount));
                      }
                      setIsLogbookOpen(false);
                      setLogbookData({
                        amount: "",
                        docName: "Booking Keepsake",
                        notes: "",
                        date: new Date().toISOString().split('T')[0]
                      });
                    }}
                    className="w-full h-16 mt-10 bg-primary text-white font-bold rounded-2xl shadow-2xl shadow-primary/20 disabled:opacity-50 active:scale-[0.97] transition-all flex items-center justify-center gap-3 border border-white/20"
                  >
                    <Check size={20} strokeWidth={3} />
                    Commit to Celebration Log
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
