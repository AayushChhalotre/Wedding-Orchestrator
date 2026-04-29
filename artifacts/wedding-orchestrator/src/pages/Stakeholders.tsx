import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { TaskDrawer } from "@/components/TaskDrawer";
import { type Stakeholder } from "@/lib/models/schema";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { X, Bell, ChevronRight, MessageSquare, Eye, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { CommunicationComposer } from "@/components/CommunicationComposer";
import { Button } from "@/components/ui/button";

const tabs = ["All", "Vendors", "Family & Friends"];

export default function Stakeholders() {
  const stakeholders = useStore(state => state.stakeholders);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filtered = stakeholders.filter((s) => {
    if (activeTab === "Vendors") return s.type === "vendor";
    if (activeTab === "Family & Friends") return s.type === "family";
    return true;
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Header */}
        <motion.div 
          initial={mounted ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-serif-display text-serif-gradient leading-tight">
            Stakeholder Hub
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">
            Everyone responsible for something, in one place.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-testid={`tab-${tab.toLowerCase().replace(/[^a-z]/g, "")}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((stakeholder) => (
            <StakeholderCard
              key={stakeholder.id}
              stakeholder={stakeholder}
              onOpen={() => setSelectedStakeholder(stakeholder)}
            />
          ))}
        </div>
      </div>

      {/* Stakeholder detail panel */}
      {selectedStakeholder && (
        <StakeholderDetail
          stakeholder={selectedStakeholder}
          onClose={() => setSelectedStakeholder(null)}
          onOpenTask={(id) => setOpenTaskId(id)}
          onOpenComposer={() => setIsComposerOpen(true)}
        />
      )}

      {openTaskId && (
        <TaskDrawer taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
      )}

      {selectedStakeholder && (
        <CommunicationComposer
          stakeholder={selectedStakeholder}
          isOpen={isComposerOpen}
          onClose={() => setIsComposerOpen(false)}
        />
      )}
    </Layout>
  );
}

function StakeholderCard({ stakeholder, onOpen }: { stakeholder: Stakeholder; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="bg-card border border-card-border rounded-xl p-5 text-left hover:border-primary/30 hover:shadow-sm transition-all"
      data-testid={`stakeholder-card-${stakeholder.id}`}
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-3 mb-4">
        <div className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0",
          stakeholder.type === "vendor" ? "bg-primary/15 text-primary" : "bg-accent/60 text-accent-foreground"
        )}>
          {stakeholder.initials}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{stakeholder.name}</p>
          <p className="text-xs text-muted-foreground truncate">{stakeholder.role}</p>
        </div>
        <span className={cn(
          "ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
          stakeholder.type === "vendor"
            ? "bg-primary/10 text-primary"
            : "bg-accent/40 text-accent-foreground"
        )}>
          {stakeholder.type === "vendor" ? "Vendor" : "Family"}
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{stakeholder.taskCount}</p>
          <p className="text-[10px] text-muted-foreground">tasks</p>
        </div>
        <div className="text-center">
          <p className={cn("text-lg font-bold", stakeholder.overdue > 0 ? "text-destructive" : "text-foreground")}>
            {stakeholder.overdue}
          </p>
          <p className="text-[10px] text-muted-foreground">overdue</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-amber-600">{stakeholder.waitingOn}</p>
          <p className="text-[10px] text-muted-foreground">waiting</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-[11px] text-muted-foreground">Progress</span>
          <span className="text-[11px] text-muted-foreground">{stakeholder.progress}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all"
            style={{ width: `${stakeholder.progress}%` }}
          />
        </div>
      </div>

      {/* Next task */}
      <p className="text-[11px] text-muted-foreground">
        <span className="font-medium text-foreground">Next:</span> {stakeholder.nextTask}
      </p>
    </button>
  );
}

function StakeholderDetail({
  stakeholder,
  onClose,
  onOpenTask,
  onOpenComposer,
}: {
  stakeholder: Stakeholder;
  onClose: () => void;
  onOpenTask: (id: string) => void;
  onOpenComposer: () => void;
}) {
  const tasks = useStore(state => state.tasks);
  const stakeholderTasks = tasks.filter((t) => stakeholder.tasks.includes(t.id));
  const [isHandoffPreviewOpen, setIsHandoffPreviewOpen] = useState(false);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={onClose} />
      <div className={cn(
        "fixed z-50 bg-card border-border shadow-xl flex flex-col",
        "inset-x-0 bottom-0 max-h-[80vh] rounded-t-2xl border-t",
        "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:bottom-0 lg:w-[400px] lg:rounded-none lg:border-l lg:border-t-0"
      )}
        data-testid="stakeholder-detail"
      >
        <div className="lg:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="flex items-center justify-between px-6 pt-4 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary text-sm font-semibold">
              {stakeholder.initials}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">{stakeholder.name}</h2>
              <p className="text-xs text-muted-foreground">{stakeholder.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" data-testid="stakeholder-detail-close">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-foreground">{stakeholder.taskCount}</p>
              <p className="text-[10px] text-muted-foreground">Tasks</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className={cn("text-xl font-bold", stakeholder.overdue > 0 ? "text-destructive" : "text-foreground")}>
                {stakeholder.overdue}
              </p>
              <p className="text-[10px] text-muted-foreground">Overdue</p>
            </div>
            <div className="bg-muted rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-amber-600">{stakeholder.waitingOn}</p>
              <p className="text-[10px] text-muted-foreground">Waiting</p>
            </div>
          </div>

          <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">Their tasks</h3>
          <div className="space-y-2">
            {stakeholderTasks.map((task) => (
              <div key={task.id} className="group relative">
                <button
                  onClick={() => onOpenTask(task.id)}
                  className="w-full flex items-center gap-2.5 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                  data-testid={`stakeholder-task-${task.id}`}
                >
                  <div className={cn(
                    "w-2 h-2 rounded-full shrink-0",
                    task.status === "done" ? "bg-green-500" :
                    task.status === "in_progress" ? "bg-primary" :
                    task.status === "overdue" ? "bg-destructive" :
                    task.status === "at_risk" ? "bg-amber-500" :
                    "bg-muted-foreground/40"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                    <p className="text-xs text-muted-foreground">Due {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
                
                {task.status !== "done" && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      useStore.getState().snoozeTask(task.id, 7);
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-amber-600 rounded-md transition-all text-[10px] font-bold uppercase tracking-wider"
                  >
                    Snooze
                  </button>
                )}
              </div>
            ))}

            {stakeholderTasks.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No tasks assigned yet.</p>
            )}
          </div>
        </div>

        <div className="border-t border-border px-6 py-4 space-y-3">
          {stakeholder.type === "vendor" && (
            <button
              onClick={() => setIsHandoffPreviewOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-border text-foreground text-xs font-bold rounded-xl hover:bg-muted transition-all shadow-sm"
              data-testid="btn-preview-handoff"
            >
              <Eye size={14} />
              Preview Handoff
            </button>
          )}
          <button
            onClick={onOpenComposer}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
            data-testid="btn-open-composer"
          >
            <MessageSquare size={16} />
            Message {stakeholder.name.split(" ")[0]}
          </button>
        </div>
      </div>

      {isHandoffPreviewOpen && (
        <HandoffPreviewModal 
          stakeholder={stakeholder} 
          onClose={() => setIsHandoffPreviewOpen(false)} 
          onSend={onOpenComposer}
        />
      )}
    </>
  );
}

function HandoffPreviewModal({ stakeholder, onClose, onSend }: { stakeholder: Stakeholder, onClose: () => void, onSend: () => void }) {
  const weddingInfo = useStore(state => state.weddingInfo);
  const events = useStore(state => state.events);
  const tasks = useStore(state => state.tasks);
  const generateVisionSummary = useStore(state => state.generateVisionSummary);
  const stakeholderTasks = tasks.filter(t => stakeholder.tasks.includes(t.id));

  // Auto-generate summaries for events if they don't exist
  useEffect(() => {
    events.forEach(e => {
      if (!e.visionSummary) {
        generateVisionSummary(e.id);
      }
    });
  }, [events, generateVisionSummary]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-card border border-border rounded-[2rem] shadow-2xl overflow-hidden noise-bg"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-serif-display text-serif-gradient">Handoff Dossier</h2>
              <p className="text-xs text-muted-foreground mt-1 font-medium italic">What {stakeholder.name} will see</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
            <section className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">The Foundation</h4>
              <p className="text-sm font-bold">{weddingInfo.coupleName}</p>
              <p className="text-xs text-muted-foreground mt-1">{weddingInfo.weddingDate ? new Date(weddingInfo.weddingDate).toLocaleDateString() : 'Date TBD'} • {weddingInfo.city}</p>
            </section>

            <section>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Scope of Work</h4>
              <div className="space-y-2">
                {stakeholderTasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2 text-xs font-medium">
                    <CheckCircle2 size={12} className="text-primary" />
                    <span>{t.title}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3">Event Vision</h4>
              <div className="space-y-3">
                {events.slice(0, 2).map(e => (
                  <div key={e.id} className="p-4 rounded-xl bg-muted border border-border/50">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold">{e.name}</p>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase">{e.vibe || 'Serene'}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-relaxed italic">
                      "{e.visionSummary || e.vibe || "A unique celebration tailored to our story."}"
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="p-4 rounded-2xl border border-dashed border-border flex items-center justify-center">
              <p className="text-[10px] text-muted-foreground font-medium italic">+ Dynamic timeline & moodboard links included</p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-border flex gap-3">
             <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-muted text-foreground text-xs font-bold rounded-xl hover:bg-muted/80 transition-all"
            >
              Back to Edit
            </button>
            <button
              onClick={() => {
                onClose();
                onSend();
              }}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
            >
              Approve & Message
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
