export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
}

export type TaskStatus = "not_started" | "in_progress" | "done" | "at_risk" | "overdue";
export type PlanningPace = "serene" | "steady" | "brisk" | "sprint" | "final_countdown";
export type BudgetPhase = "dreaming" | "tracking";

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: TaskStatus;
  phase: string;
  phaseId: string;
  owner: string;
  ownerInitials: string;
  ownerType: "couple" | "vendor" | "family";
  category: string;
  dependencies: string[];
  blocks: string[];
  whyItMatters: string;
  notes: string;
  vendorPortalLink?: string;
  // Extended risk metadata
  priority: "high" | "medium" | "low";
  effort: 1 | 2 | 3 | 4 | 5; // 1 = easy, 5 = burnout risk
  estimatedCost?: number;
  actualCost?: number;
  isMilestone?: boolean;
  budgetCategoryId?: string;
  customActionType?: "guest_count" | "venue_shortlist" | "invitation_designs";
  customActionData?: any;
}

export interface BudgetScenario {
  id: string;
  name: string;
  totalBudget: number;
  categories: Record<string, number>; // categoryId -> planned amount
  description?: string;
  isLocked?: boolean;
  vibeId?: string; // Link to a Vibe from Phase 4
  visionTags?: string[];
  thumbnailUrl?: string;
  createdAt: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  planned: number;
  forecast: number;
  actual: number;
  confidence: "high" | "medium" | "low";
  notes?: string;
  trend?: "up" | "down" | "stable";
  driftAmount?: number;
  priority?: "must_have" | "nice_to_have" | "luxury";
  customEstimate?: number;
  suggestedRange?: { min: number; max: number };
  isLocked?: boolean; // For Tracking phase
}

export interface BudgetUpdate {
  id: string;
  categoryName: string;
  amount: number;
  date: string;
  description: string;
  type: "increase" | "decrease" | "reallocation";
}

export interface BudgetWatchout {
  id: string;
  title: string;
  description: string;
  severity: "high" | "medium";
}

export interface Phase {
  id: string;
  name: string;
  dateRange: string;
  taskCount: number;
  atRisk: number;
  color: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  type: "vendor" | "family";
  initials: string;
  taskCount: number;
  overdue: number;
  waitingOn: number;
  progress: number;
  nextTask: string;
  nextTaskDue: string;
  email: string;
  tasks: string[];
}

export interface Reminder {
  id: string;
  recipient: string;
  role: string;
  channel: "email" | "whatsapp" | "sms";
  task: string;
  status: "scheduled" | "sent" | "viewed" | "responded";
  scheduledFor: string;
}

export interface Activity {
  id: string;
  timestamp: string;
  description: string;
  icon: "vendor" | "couple" | "system" | "family" | "stakeholder" | "reminder";
  actor: string;
}

export interface RiskAssistance {
  text: string;
  link?: string;
  linkText?: string;
}

export interface Risk {
  id: string;
  title: string;
  explanation: string;
  impact: string;
  cta: string;
  severity: "high" | "medium";
  type: "burnout" | "budget" | "density" | "general";
  suggestedAssistance?: string[];
  assistanceResources?: RiskAssistance[];
}

export interface WeddingInfo {
  coupleName: string;
  partner1Name: string;
  partner2Name: string;
  weddingDate: string;
  city: string;
  location: string;
  daysLeft: number;
  budget: string;
  guests: string;
  planningPace: PlanningPace;
  budgetPhase: BudgetPhase;
  activeScenarioId?: string;
}
