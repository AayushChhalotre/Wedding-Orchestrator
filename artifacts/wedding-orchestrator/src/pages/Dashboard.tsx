import { useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, ChevronRight, Bell, UserCircle2, Link2 } from "lucide-react";
import { Layout } from "@/components/Layout";
import { TaskDrawer } from "@/components/TaskDrawer";
import { RiskPanel } from "@/components/RiskPanel";
import { nextSteps, tasks, weddingInfo } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Dashboard() {
  const [openTaskId, setOpenTaskId] = useState<string | null>(null);

  const upcomingThisWeek = tasks.filter(
    (t) => t.status !== "done" && (t.status === "in_progress" || t.daysUntilDue !== undefined)
  ).slice(0, 4);

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground">
            Hi Priya & Arjun,{" "}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            here's what to focus on this week.{" "}
            <span className="text-foreground font-medium">{weddingInfo.daysLeft} days</span> until{" "}
            {weddingInfo.weddingDate}.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left: Next steps + upcoming */}
          <div className="lg:col-span-2 space-y-6">
            {/* Next steps */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-foreground">Your top 3 next steps</h2>
                <Link href="/timeline">
                  <span className="text-xs text-primary hover:underline cursor-pointer flex items-center gap-1">
                    Full timeline <ChevronRight size={12} />
                  </span>
                </Link>
              </div>

              <div className="space-y-3">
                {nextSteps.map((step, index) => (
                  <NextStepCard
                    key={step.id}
                    step={step}
                    rank={index + 1}
                    onOpen={() => setOpenTaskId(step.taskId)}
                  />
                ))}
              </div>
            </section>

            {/* Upcoming this week */}
            <section>
              <h2 className="text-base font-semibold text-foreground mb-3">Upcoming this week</h2>
              <div className="bg-card border border-card-border rounded-xl divide-y divide-border">
                {tasks
                  .filter((t) => t.status === "in_progress" || t.status === "not_started")
                  .slice(0, 4)
                  .map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setOpenTaskId(task.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors text-left first:rounded-t-xl last:rounded-b-xl"
                      data-testid={`upcoming-task-${task.id}`}
                    >
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0",
                        task.status === "in_progress" ? "bg-primary" : "bg-muted-foreground/30"
                      )} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                        <p className="text-xs text-muted-foreground">{task.owner} · Due {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                      </div>
                      <ChevronRight size={14} className="text-muted-foreground shrink-0" />
                    </button>
                  ))}
              </div>
            </section>
          </div>

          {/* Right: Risks + mini timeline */}
          <div className="space-y-6">
            {/* Risk strip */}
            <div className="bg-card border border-card-border rounded-xl p-5">
              <RiskPanel compact />
            </div>

            {/* Timeline summary */}
            <div className="bg-card border border-card-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-foreground">Phase progress</h3>
                <Link href="/timeline">
                  <span className="text-xs text-primary hover:underline cursor-pointer">View all</span>
                </Link>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Foundation", pct: 35, color: "bg-primary" },
                  { name: "Vendor Locking", pct: 8, color: "bg-primary/60" },
                  { name: "Guest Mgmt", pct: 0, color: "bg-muted-foreground/30" },
                  { name: "Ceremony", pct: 0, color: "bg-muted-foreground/30" },
                  { name: "Finalization", pct: 0, color: "bg-muted-foreground/30" },
                ].map((phase) => (
                  <div key={phase.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-foreground">{phase.name}</span>
                      <span className="text-xs text-muted-foreground">{phase.pct}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", phase.color)} style={{ width: `${phase.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stakeholder summary */}
            <div className="bg-card border border-card-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">Stakeholders</h3>
                <Link href="/stakeholders">
                  <span className="text-xs text-primary hover:underline cursor-pointer">View all</span>
                </Link>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Suresh Catering", initials: "SC", status: "Awaiting menu approval" },
                  { name: "Mama Sharma", initials: "MS", status: "1 task overdue" },
                  { name: "Rishi Photography", initials: "RK", status: "Contract pending" },
                ].map((s) => (
                  <div key={s.name} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                      {s.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-[11px] text-muted-foreground">{s.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openTaskId && (
        <TaskDrawer taskId={openTaskId} onClose={() => setOpenTaskId(null)} />
      )}
    </Layout>
  );
}

function NextStepCard({
  step,
  rank,
  onOpen,
}: {
  step: typeof nextSteps[0];
  rank: number;
  onOpen: () => void;
}) {
  return (
    <div
      className={cn(
        "bg-card border rounded-xl p-5",
        step.isOverdue ? "border-destructive/30" : "border-card-border"
      )}
      data-testid={`next-step-${step.id}`}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5",
          step.isOverdue ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
        )}>
          {rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-semibold text-foreground leading-snug">{step.title}</h3>
            <span className={cn(
              "text-[11px] px-2 py-0.5 rounded-full font-medium shrink-0",
              step.isOverdue
                ? "bg-destructive/10 text-destructive"
                : step.daysLeft <= 3
                ? "bg-amber-100 text-amber-700"
                : "bg-muted text-muted-foreground"
            )}>
              {step.isOverdue ? `${Math.abs(step.daysLeft)}d overdue` : `Due in ${step.daysLeft}d`}
            </span>
          </div>

          <p className="text-xs text-muted-foreground mb-2 leading-relaxed">{step.reason}</p>

          {step.blocks.length > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <Link2 size={11} className="text-muted-foreground" />
              <p className="text-[11px] text-muted-foreground">
                Blocks: {step.blocks.join(", ")}
              </p>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onOpen}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:opacity-90 transition-opacity"
              data-testid={`btn-do-now-${step.id}`}
            >
              Do this now
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Snooze" data-testid={`btn-snooze-${step.id}`}>
              <Clock size={14} />
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Assign" data-testid={`btn-assign-${step.id}`}>
              <UserCircle2 size={14} />
            </button>
            <button className="p-1.5 text-muted-foreground hover:text-foreground transition-colors" title="Mark done" data-testid={`btn-done-${step.id}`}>
              <CheckCircle2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
