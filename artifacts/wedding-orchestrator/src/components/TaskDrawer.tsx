import { X, CheckCircle2, Clock, AlertTriangle, UserCircle2, ExternalLink, Check } from "lucide-react";
import { tasks, type Task } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface TaskDrawerProps {
  taskId: string | null;
  onClose: () => void;
}

const statusConfig = {
  not_started: { label: "Not started", color: "bg-muted text-muted-foreground" },
  in_progress: { label: "In progress", color: "bg-primary/10 text-primary" },
  done: { label: "Done", color: "bg-green-100 text-green-700" },
  at_risk: { label: "At risk", color: "bg-amber-100 text-amber-700" },
  overdue: { label: "Overdue", color: "bg-destructive/10 text-destructive" },
};

export function TaskDrawer({ taskId, onClose }: TaskDrawerProps) {
  const task = tasks.find((t) => t.id === taskId);

  if (!task) return null;

  const status = statusConfig[task.status];
  const prereqs = tasks.filter((t) => task.dependencies.includes(t.id));
  const blockedTasks = tasks.filter((t) => task.blocks.includes(t.id));

  return (
    <>
      {/* Backdrop (mobile only) */}
      <div
        className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        onClick={onClose}
        data-testid="drawer-backdrop"
      />

      {/* Drawer */}
      <div
        className={cn(
          "fixed z-50 bg-card border-border shadow-xl flex flex-col",
          // Mobile: bottom sheet
          "inset-x-0 bottom-0 max-h-[85vh] rounded-t-2xl border-t",
          // Desktop: right side drawer
          "lg:inset-x-auto lg:inset-y-0 lg:right-0 lg:top-0 lg:bottom-0 lg:w-[440px] lg:rounded-none lg:border-l lg:border-t-0"
        )}
        data-testid="task-drawer"
      >
        {/* Drag handle (mobile only) */}
        <div className="lg:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-4 pb-4 border-b border-border">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", status.color)}>
                {status.label}
              </span>
              {task.status === "at_risk" && (
                <AlertTriangle size={14} className="text-amber-500" />
              )}
            </div>
            <h2 className="text-base font-semibold text-foreground leading-snug">{task.title}</h2>
            <p className="text-xs text-muted-foreground mt-1">Due {new Date(task.dueDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
            data-testid="drawer-close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Why it matters */}
          <section>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Why this matters</h3>
            <p className="text-sm text-foreground leading-relaxed">{task.whyItMatters}</p>
          </section>

          {/* Owner */}
          <section>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Owner</h3>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-semibold">
                {task.ownerInitials}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{task.owner}</p>
                <p className="text-xs text-muted-foreground capitalize">{task.ownerType}</p>
              </div>
              {task.ownerType === "vendor" && task.vendorPortalLink && (
                <Link href={task.vendorPortalLink}>
                  <div className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline cursor-pointer">
                    <ExternalLink size={11} />
                    Portal
                  </div>
                </Link>
              )}
            </div>
          </section>

          {/* Dependencies */}
          <section>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Prerequisites</h3>
            {prereqs.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">No prerequisites</p>
            ) : (
              <ul className="space-y-1.5">
                {prereqs.map((dep) => (
                  <li key={dep.id} className="flex items-center gap-2 text-sm">
                    {dep.status === "done" ? (
                      <Check size={14} className="text-green-600 shrink-0" />
                    ) : (
                      <Clock size={14} className="text-muted-foreground shrink-0" />
                    )}
                    <span className={cn(dep.status === "done" ? "line-through text-muted-foreground" : "text-foreground")}>
                      {dep.title}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">This task blocks</h3>
            {blockedTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">Doesn't block anything</p>
            ) : (
              <ul className="space-y-1.5">
                {blockedTasks.map((bt) => (
                  <li key={bt.id} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {bt.title}
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Notes */}
          {task.notes && (
            <section>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">Notes</h3>
              <p className="text-sm text-foreground leading-relaxed">{task.notes}</p>
            </section>
          )}
        </div>

        {/* Action bar */}
        <div className="border-t border-border px-6 py-4 flex gap-2 flex-wrap">
          <button
            className="flex-1 min-w-[120px] px-3 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
            data-testid="btn-mark-done"
          >
            <CheckCircle2 size={14} className="inline mr-1.5 -mt-0.5" />
            Mark done
          </button>
          <button
            className="px-3 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors"
            data-testid="btn-snooze"
          >
            <Clock size={14} className="inline mr-1.5 -mt-0.5" />
            Snooze
          </button>
          <button
            className="px-3 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-md hover:bg-secondary/80 transition-colors"
            data-testid="btn-reassign"
          >
            <UserCircle2 size={14} className="inline mr-1.5 -mt-0.5" />
            Reassign
          </button>
        </div>
      </div>
    </>
  );
}
