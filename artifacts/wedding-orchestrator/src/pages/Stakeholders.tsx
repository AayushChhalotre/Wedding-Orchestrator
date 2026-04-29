import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { TaskDrawer } from "@/components/TaskDrawer";
import { type Stakeholder } from "@/lib/models/schema";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { X, Bell, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const tabs = ["All", "Vendors", "Family & Friends"];

export default function Stakeholders() {
  const stakeholders = useStore(state => state.stakeholders);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);
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
        />
      )}

      {openTaskId && (
        <TaskDrawer taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
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
}: {
  stakeholder: Stakeholder;
  onClose: () => void;
  onOpenTask: (id: string) => void;
}) {
  const tasks = useStore(state => state.tasks);
  const stakeholderTasks = tasks.filter((t) => stakeholder.tasks.includes(t.id));

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
              <button
                key={task.id}
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
                <ChevronRight size={14} className="text-muted-foreground shrink-0" />
              </button>
            ))}

            {stakeholderTasks.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No tasks assigned yet.</p>
            )}
          </div>
        </div>

        <div className="border-t border-border px-6 py-4">
          <button
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            data-testid="btn-send-reminder"
          >
            <Bell size={14} />
            Send reminder
          </button>
        </div>
      </div>
    </>
  );
}
