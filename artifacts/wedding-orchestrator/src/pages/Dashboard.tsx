import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bell, 
  ChevronRight,
  Calendar,
  MapPin,
  Users,
  Wallet,
  Heart,
  RefreshCcw,
  Check,
  Clock,
  CheckCircle2,
  Filter,
  ShieldCheck
} from "lucide-react";
import confetti from "canvas-confetti";
import { Layout } from "@/components/Layout";
import { RiskPanel, RiskModal } from "@/components/RiskPanel";
import { type Risk } from "@/lib/models/schema";
import { TaskDrawer } from "@/components/TaskDrawer";
import { MuhratTool } from "@/components/MuhratTool";
import { formatWeddingDate } from "@/store/useStore";
import { PersonalizedBanner } from "@/components/PersonalizedBanner";
import { WeddingGraphic, WeddingFloralRing, WeddingMandap } from "@/components/WeddingGraphics";

export default function Dashboard() {
  const tasks = useStore(state => state.tasks);
  const nextSteps = useStore(state => state.nextSteps);
  const weddingInfo = useStore(state => state.weddingInfo);
  const isAuthClaimed = useStore(state => state.isAuthClaimed);
  const signInWithGoogle = useStore(state => state.signInWithGoogle);
  const user = useStore(state => state.user);
  const syncStatus = useStore(state => state.syncStatus);
  const lastSyncedAt = useStore(state => state.lastSyncedAt);
  const risks = useStore(state => state.risks);
  const stakeholders = useStore(state => state.stakeholders);
  const phases = useStore(state => state.phases);
  const lastCompletedTaskId = useStore(state => state.lastCompletedTaskId);
  
  const getRelevantTasks = useStore(state => state.getRelevantTasks);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [activeRisk, setActiveRisk] = useState<Risk | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  // Defer Framer Motion animations until after first mount
  // to prevent the 'frame' scheduler crash
  useEffect(() => {
    setMounted(true);
  }, []);

  const relevantTasks = getRelevantTasks();
  
  const upcomingThisWeek = relevantTasks.filter(
    (t) => t.status !== "done"
  ).slice(0, 4);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    await signInWithGoogle();
    setIsLoggingIn(false);
  };

  // Success Confetti Effect
  useEffect(() => {
    if (lastCompletedTaskId && mounted) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#BE185D', '#9D174D', '#F472B6', '#E11D48']
      });
    }
  }, [lastCompletedTaskId, mounted]);


  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-8 py-8 lg:py-12">
        {/* Login Banner */}
        {!isAuthClaimed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 p-6 bg-white/40 backdrop-blur-md border border-primary/20 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 noise-bg relative overflow-hidden shadow-sm"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.5)]">
                <WeddingFloralRing className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-serif-display text-foreground leading-tight">Secure your plans.</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">Keep your roadmap synced and invite your Inner Circle to collaborate.</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogin}
              disabled={isLoggingIn}
              className="w-full sm:w-auto px-8 py-4 bg-foreground text-background text-sm font-bold rounded-2xl hover:bg-primary transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 relative z-10 border border-white/10"
            >
              {isLoggingIn ? (
                <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.90 3.16-1.94 4.12-1.16 1.16-2.96 2.4-5.9 2.4-4.72 0-8.6-3.8-8.6-8.52 0-4.72 3.88-8.52 8.6-8.52 1.76 0 3.32.48 4.6 1.48L19.52 2.76C17.64 1.04 15.28 0 12.48 0 5.64 0 0 5.48 0 12.24s5.64 12.24 12.48 12.24c3.6 0 6.32-1.16 8.44-3.32 2.2-2.2 2.92-5.32 2.92-7.88 0-.76-.08-1.52-.2-2.28H12.48z" />
                </svg>
              )}
              <span>{isLoggingIn ? "Authenticating..." : "Claim your Registry"}</span>
            </motion.button>
          </motion.div>
        )}

        {/* Greeting */}
        <motion.div 
          initial={mounted ? { opacity: 0, y: 15 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-5xl lg:text-6xl font-serif-display leading-[1.05] tracking-tight">
              {weddingInfo?.partner1Name && weddingInfo?.partner2Name ? (
                <><span className="text-serif-gradient">{weddingInfo.partner1Name.split(' ')[0]}</span> <span className="text-foreground/80 font-light">&</span> <span className="text-serif-gradient">{weddingInfo.partner2Name.split(' ')[0]}</span></>
              ) : <span className="text-serif-gradient">{user?.name ? user.name.split(' ')[0] : 'The Celebration'}</span>}.
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-6">
              <p className="text-muted-foreground text-lg">
                <span className="text-foreground font-semibold tracking-tight">{weddingInfo?.daysLeft ?? 0} days</span> to your ceremony.
              </p>
              
              {syncStatus !== 'idle' && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full text-[10px] font-bold text-primary border border-primary/10">
                  {syncStatus === 'syncing' ? <RefreshCcw size={10} className="animate-spin" /> : <ShieldCheck size={10} className="text-primary/70" />}
                  {syncStatus === 'syncing' ? 'UPDATING...' : 'PROTECTED'}
                </div>
              )}

              {weddingInfo?.lockedDates && Object.keys(weddingInfo.lockedDates).length > 1 && (
                <div className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border uppercase tracking-widest",
                  risks.some(r => r.type === 'density') 
                    ? "bg-red-50 text-red-600 border-red-100" 
                    : "bg-green-50 text-green-700 border-green-100"
                )}>
                  <div className={cn("w-1 h-1 rounded-full animate-pulse", risks.some(r => r.type === 'density') ? "bg-red-500" : "bg-green-500")} />
                  {risks.some(r => r.type === 'density') ? 'High Density' : 'Optimal Pace'}
                </div>
              )}
            </div>
          </div>
          
          {isAuthClaimed && (
            <motion.div 
              whileHover={{ y: -2 }}
              className="flex items-center gap-4 bg-white/40 backdrop-blur-md p-3 pr-6 rounded-[1.25rem] border border-white/50 shadow-sm noise-bg"
            >
              <div className="relative">
                <img src={user?.avatar} className="w-11 h-11 rounded-xl border border-white/60 shadow-sm object-cover" alt="avatar" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 font-medium tracking-wide">Last active {lastSyncedAt ? new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'just now'}</p>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Personalized Hero Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 1 }}
        >
          <PersonalizedBanner />
        </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left: Next steps + upcoming */}
          <div className="lg:col-span-2 space-y-16">
            {/* Next steps */}
            <section>
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <h2 className="text-4xl font-serif-display text-foreground leading-none tracking-tight">Priority Focus</h2>
                </div>
                <Link href="/timeline">
                  <span className="text-xs text-primary/70 font-bold hover:text-primary cursor-pointer flex items-center gap-1.5 transition-all group">
                    Master Timeline <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </div>

                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    visible: { transition: { staggerChildren: 0.08 } }
                  }}
                  className="space-y-8"
                >
                  {nextSteps.map((step, index) => (
                    <NextStepCard
                      key={step.id}
                      step={step}
                      rank={index + 1}
                      onOpen={() => setOpenTaskId(step.taskId)}
                    />
                  ))}
                </motion.div>
            </section>

            {/* Upcoming this week */}
            <section>
              <div className="flex items-center gap-3 mb-10">
                <h2 className="text-3xl font-serif-display text-foreground leading-none tracking-tight">On the Horizon</h2>
              </div>
              <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[2rem] overflow-hidden shadow-sm noise-bg divide-y divide-black/5">
                {relevantTasks
                  .filter((t) => t.status === "in_progress" || t.status === "not_started")
                  .slice(0, 4)
                  .map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setOpenTaskId(task.id)}
                      className="w-full flex items-center gap-6 px-8 py-5 hover:bg-white/60 transition-all text-left group"
                    >
                      <div className={cn(
                        "w-3 h-3 rounded-full shrink-0 transition-all duration-500",
                        task.status === "in_progress" ? "bg-primary shadow-[0_0_12px_rgba(var(--primary),0.4)] scale-110" : "bg-muted-foreground/10 border border-black/5"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-foreground/80 group-hover:text-primary transition-colors tracking-tight">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{task.owner}</span>
                           <span className="w-1 h-1 bg-muted-foreground/30 rounded-full" />
                           <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">DUE {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-black/5 flex items-center justify-center text-muted-foreground/30 group-hover:text-primary/60 group-hover:border-primary/20 group-hover:bg-primary/5 transition-all">
                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  ))}
              </div>
            </section>
          </div>

          {/* Right: Risks + mini timeline */}
          <div className="space-y-12">
            {/* Muhrat Tool */}
            <MuhratTool />

            {/* Risk strip */}
            <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[2rem] p-8 shadow-sm noise-bg relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
               <RiskPanel compact onRiskClick={(risk) => setActiveRisk(risk)} />
            </div>

            {/* Phase progress */}
            <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[2rem] p-8 shadow-sm noise-bg">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-serif-display text-foreground leading-none tracking-tight">Milestones</h3>
                <Link href="/timeline">
                  <span className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest">Audit</span>
                </Link>
              </div>
              <div className="space-y-6">
                {phases.map((phase) => {
                  const phaseTasks = tasks.filter(t => t.phaseId === phase.id);
                  const completed = phaseTasks.filter(t => t.status === "done").length;
                  const pct = phaseTasks.length > 0 ? Math.round((completed / phaseTasks.length) * 100) : 0;
                  
                  return (
                    <div key={phase.id}>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-foreground/70 leading-none tracking-tight">{phase.name}</span>
                        <span className="text-[10px] font-mono text-muted-foreground leading-none tracking-tighter">{pct}%</span>
                      </div>
                      <div className="h-1 bg-black/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                          className={cn(
                            "h-full rounded-full transition-colors duration-500", 
                            pct === 100 ? "bg-green-500" : "bg-primary"
                          )} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stakeholder summary */}
            <div className="bg-white/30 backdrop-blur-md border border-white/50 rounded-[2rem] p-8 shadow-sm noise-bg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif-display text-foreground leading-none tracking-tight">Inner Circle</h3>
                <Link href="/stakeholders">
                  <span className="text-[10px] font-bold text-primary/60 hover:text-primary transition-colors cursor-pointer uppercase tracking-widest">Connect</span>
                </Link>
              </div>
              <div className="space-y-5">
                {stakeholders.slice(0, 3).map((s) => (
                  <motion.div 
                    key={s.id} 
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 group cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-black/5 flex items-center justify-center text-primary text-xs font-bold shrink-0 shadow-xs group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300 uppercase tracking-tighter">
                      {s.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-foreground/90 truncate group-hover:text-primary transition-colors tracking-tight">{s.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">{s.role}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openTaskId && (
        <TaskDrawer taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
      )}

      {activeRisk && (
        <RiskModal risk={activeRisk} onClose={() => setActiveRisk(null)} />
      )}
    </Layout>
  );
}

function NextStepCard({
  step,
  rank,
  onOpen,
}: {
  step: any;
  rank: number;
  onOpen: () => void;
}) {
  const completeTask = useStore(state => state.completeTask);
  const snoozeTask = useStore(state => state.snoozeTask);
  
  const [isCompleting, setIsCompleting] = useState(false);
  const [isSnoozing, setIsSnoozing] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    // Short delay for the animation to feel intentional
    await new Promise(r => setTimeout(r, 600));
    completeTask(step.taskId);
  };

  const handleSnooze = async () => {
    setIsSnoozing(true);
    await new Promise(r => setTimeout(r, 600));
    snoozeTask(step.taskId, 7); // Default snooze for 7 days
    setIsSnoozing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 15 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
        y: 0,
        filter: isCompleting ? "grayscale(1) opacity(0.5)" : "none"
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.96, 
        transition: { duration: 0.2 } 
      }}
      variants={{
        hidden: { opacity: 0, y: 15, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1 }
      }}
      transition={{ 
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }}
      style={{ willChange: "transform, opacity, filter" }}
      className={cn(
        "bg-white border rounded-3xl p-8 transition-shadow duration-500 hover:shadow-xl group relative overflow-hidden",
        step.isOverdue ? "border-red-100 bg-red-50/20" : "border-card-border"
      )}
      data-testid={`next-step-${step.id}`}
    >
      <div className="flex items-start gap-6 relative z-10">
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 mt-0.5 transition-all duration-300 shadow-sm",
          step.isOverdue 
            ? "bg-red-500 text-white" 
            : "bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3"
        )}>
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h3 className="text-base font-bold text-foreground leading-tight tracking-tight group-hover:text-primary transition-colors">{step.title}</h3>
            <span className={cn(
              "text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest shrink-0 border",
              step.isOverdue
                ? "bg-red-50 text-red-600 border-red-100"
                : step.daysLeft <= 3
                ? "bg-amber-50 text-amber-700 border-amber-100"
                : "bg-muted/50 text-muted-foreground border-border/50"
            )}>
              {step.isOverdue ? `Expired ${Math.abs(step.daysLeft)}d ago` : `${step.daysLeft}d left`}
            </span>
          </div>

          <p className="text-sm text-muted-foreground mb-6 leading-relaxed font-medium">
            {step.reason}
          </p>

          <div className="flex items-center gap-5">
            <button
              onClick={onOpen}
              className="px-8 py-3 bg-foreground text-background text-xs font-bold rounded-2xl hover:bg-primary transition-all active:scale-[0.97] shadow-xl shadow-black/5 hover:shadow-primary/20 border border-white/10"
              data-testid={`btn-do-now-${step.id}`}
            >
              Take Action
            </button>
            <div className="flex items-center gap-2">
              <button 
                className={cn(
                  "p-2.5 text-muted-foreground/60 hover:bg-muted hover:text-foreground rounded-full transition-all active:scale-90",
                  isSnoozing && "text-amber-500 bg-amber-50"
                )} 
                title="Snooze"
                onClick={handleSnooze}
                disabled={isSnoozing || isCompleting}
              >
                <Clock size={16} className={cn(isSnoozing && "animate-spin-slow")} />
              </button>
              <button 
                className={cn(
                  "p-2.5 text-muted-foreground/60 hover:bg-muted hover:text-foreground rounded-full transition-all active:scale-90",
                  isCompleting && "text-green-500 bg-green-50"
                )} 
                title="Check off" 
                onClick={handleComplete}
                disabled={isSnoozing || isCompleting}
              >
                <CheckCircle2 size={16} className={cn(isCompleting && "animate-bounce")} />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-primary/2 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />
    </motion.div>
  );
}
