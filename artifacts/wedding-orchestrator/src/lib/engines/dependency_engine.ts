import { Task } from "@/data/mockData";

export type TaskStatus = "not_started" | "in_progress" | "done" | "at_risk" | "overdue" | "blocked";

export interface DependencyExplanation {
  taskId: string;
  blockedBy: string[];
  explanation: string;
}

export class DependencyEngine {
  private tasks: Task[];

  constructor(tasks: Task[]) {
    this.tasks = tasks;
  }

  /**
   * Returns whether a task is blocked by any of its dependencies.
   */
  isBlocked(taskId: string): boolean {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task || task.dependencies.length === 0) return false;

    return task.dependencies.some((depId) => {
      const depTask = this.tasks.find((t) => t.id === depId);
      return depTask && depTask.status !== "done";
    });
  }

  /**
   * Returns the dynamic status of a task, considering its dependencies.
   */
  getDynamicStatus(taskId: string): TaskStatus {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return "not_started";

    if (task.status === "done") return "done";
    if (this.isBlocked(taskId)) return "blocked";

    return task.status;
  }

  /**
   * Returns an explanation of why a task is blocked.
   */
  getBlockingExplanation(taskId: string): DependencyExplanation | null {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task || !this.isBlocked(taskId)) return null;

    const blockingTasks = task.dependencies
      .map((depId) => this.tasks.find((t) => t.id === depId))
      .filter((t): t is Task => !!t && t.status !== "done");

    const explanation = blockingTasks.length > 0
      ? `This task is waiting on ${blockingTasks.map(t => `'${t.title}'`).join(", ")} before it can be started.`
      : "";

    return {
      taskId,
      blockedBy: blockingTasks.map(t => t.id),
      explanation
    };
  }

  /**
   * Identifies the "Critical Path" (simplified version: tasks that block the most downstream tasks).
   */
  getCriticalTasks(): Task[] {
    // Sort tasks by how many other tasks they block (directly or indirectly)
    const blockCounts: Record<string, number> = {};

    const countBlocks = (id: string): number => {
      const task = this.tasks.find((t) => t.id === id);
      if (!task) return 0;
      
      let count = task.blocks.length;
      task.blocks.forEach(blockedId => {
        count += countBlocks(blockedId);
      });
      return count;
    };

    this.tasks.forEach(t => {
      blockCounts[t.id] = countBlocks(t.id);
    });

    return [...this.tasks].sort((a, b) => (blockCounts[b.id] || 0) - (blockCounts[a.id] || 0));
  }
}
