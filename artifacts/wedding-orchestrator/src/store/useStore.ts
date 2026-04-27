import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import { differenceInDays, parseISO, isValid } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { 
  Task, 
  Phase, 
  Stakeholder, 
  Reminder, 
  Risk, 
  Activity,
  WeddingInfo,
  TaskStatus,
  BudgetCategory,
  BudgetUpdate,
  BudgetWatchout,
  BudgetScenario,
  PlanningPace,
  BudgetPhase
} from "@/lib/models/schema";
import { 
  weddingInfo as initialWeddingInfo,
  phases as initialPhases,
  tasks as initialTasks,
  nextSteps as initialNextSteps,
  stakeholders as initialStakeholders,
  reminders as initialReminders,
  activities as initialActivities,
  risks as initialRisks,
  budgetCategories as initialBudgetCategories,
  budgetUpdates as initialBudgetUpdates,
  budgetWatchouts as initialBudgetWatchouts,
  budgetScenarios as initialBudgetScenarios
} from "@/data/mockData";
import { type Rashi } from "@/data/muhrats";
import { DependencyEngine, DependencyExplanation } from "@/lib/engines/dependency_engine";
import { TimelineGenerator } from "@/lib/engines/timeline_generator";
import { WhatsAppAnalyzer } from "@/lib/engines/WhatsAppAnalyzer";


export interface AppWeddingInfo extends WeddingInfo {
  weddingType?: string;
  partner1Rashi?: Rashi;
  partner2Rashi?: Rashi;
  lockedDate?: string;
  weddingDuration: number;
  lockedDates: Record<string, string>;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export interface EventInfo {
  id: string;
  name: string;
  theme: string;
  duration: string;
  date?: string;
  guestCount: number | string;
  vibe: string;
  colors?: string[];
  gallery?: string[];
  locationType?: string;
  visionSummary?: string;
  atmosphere?: string;
  dressCode?: string;
  musicStyle?: string;
}

export interface AppState {
  user: User | null;
  weddingInfo: AppWeddingInfo;
  events: EventInfo[];
  phases: Phase[];
  tasks: Task[];
  nextSteps: typeof initialNextSteps;
  stakeholders: Stakeholder[];
  reminders: Reminder[];
  activities: Activity[];
  risks: Risk[];
  budgetCategories: BudgetCategory[];
  budgetUpdates: BudgetUpdate[];
  budgetWatchouts: BudgetWatchout[];
  budgetScenarios: BudgetScenario[];
  statusTracking?: {
    venueBooked: boolean;
    catererBooked: boolean;
    plannerHired: boolean;
    photoBooked: boolean;
    multiDay?: boolean;
    destination?: boolean;
  };
  
  // Phase 3 State
  lastSyncedAt: string | null;
  syncStatus: 'idle' | 'syncing' | 'saved';
  
  // New WhatsApp Features
  leadershipModel: "couple" | "family" | null;
  potentialGuestList: string[];
  whatsAppAnalysisStatus: "idle" | "analyzing" | "completed" | "error";
  whatsAppErrorMessage: string | null;
  whatsAppSummary: string | null;
  lastWhatsAppUpload: number | null; // Timestamp
  
  // Lazy Auth
  sessionId: string;
  isAuthClaimed: boolean;
  
  lastCompletedTaskId: string | null;
  
  // Actions
  updateWeddingInfo: (info: Partial<WeddingInfo>) => void;
  completeTask: (taskId: string) => void;
  snoozeTask: (taskId: string, days: number) => void;
  reassignTask: (taskId: string, newOwner: string, newOwnerType: "couple" | "family" | "vendor") => void;
  addProofToTask: (taskId: string, proof: { amount?: number, docName: string, notes?: string, date: string }) => void;
  submitVendorData: (taskId: string) => void;
  sendReminder: (reminderId: string) => void;
  
  updateBudgetCategory: (categoryId: string, updates: Partial<BudgetCategory>) => void;
  updateBudgetEstimate: (categoryId: string, estimate: number, priority?: BudgetCategory["priority"]) => void;
  addBudgetUpdate: (update: Omit<BudgetUpdate, 'id'>) => void;
  recalculateBudget: () => void;
  getSuggestedBudget: (categoryName: string) => { min: number; max: number };
  logExpense: (categoryId: string, amount: number, description: string) => void;
  updateTaskActualCost: (taskId: string, amount: number) => void;
  reallocateBudget: (fromCategoryId: string, toCategoryId: string, amount: number) => void;
  completeTaskWithBudget: (taskId: string, actualCost: number, proofUrl?: string) => void;
  linkTaskToBudgetCategory: (taskId: string, categoryId: string) => void;
  
  // Vibe & Vision Features
  addEvent: (event: EventInfo) => void;
  removeEvent: (eventId: string) => void;
  updateEvent: (eventId: string, event: Partial<EventInfo>) => void;
  updateTaskCustomData: (taskId: string, data: any) => void;
  recalculateNextSteps: () => void;
  generateTimeline: (data: any) => void;
  setLeadershipModel: (model: "couple" | "family") => void;
  analyzeWhatsApp: (file: File) => Promise<void>;
  claimAuth: () => void;
  signInWithGoogle: () => Promise<void>;
  lockInDate: (date: string) => void;
  lockEventDate: (eventName: string, date: string) => void;
  setWeddingDuration: (days: number) => void;
  detectAdvancedRisks: () => void;
  addTask: (taskData: Partial<Task>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  removeTask: (taskId: string) => void;
  
  // Pace & Scenario Actions
  setPlanningPace: (pace: PlanningPace) => void;
  setBudgetPhase: (phase: BudgetPhase) => void;
  saveBudgetScenario: (name: string, description?: string, vibeId?: string) => void;
  switchBudgetScenario: (scenarioId: string) => void;
  deleteBudgetScenario: (scenarioId: string) => void;
  toggleCategoryLock: (categoryId: string) => void;
  
  // Helper for UI
  getCategoryTasks: (categoryId: string) => Task[];
  getTaskStatus: (taskId: string) => TaskStatus;
  getBlockingExplanation: (taskId: string) => DependencyExplanation | null;
  getRelevantTasks: () => Task[];
  getBudgetInsights: () => {
    type: "warning" | "suggestion" | "success" | "info";
    title: string;
    message: string;
    action?: string;
  }[];
  getScenarioComparison: () => {
    id: string;
    name: string;
    totalBudget: number;
    difference: number;
    vibeName?: string;
    visionTags?: string[];
    thumbnailUrl?: string;
    isCurrent: boolean;
  }[];
  getPlanningMaturity: () => {
    percentage: number;
    lockedAmount: number;
    estimatedAmount: number;
    status: "vibe_check" | "planning" | "solidified";
  };
  getBudgetActionables: () => {
    id: string;
    category: string;
    title: string;
    description: string;
    type: "saving" | "locking" | "exploring";
    potentialSaving?: number;
  }[];
  getAIAssistance: (riskId: string) => Promise<void>;
  getCategoryTips: (categoryId: string) => {
    title: string;
    tips: string[];
    potentialSavings?: string;
  };
  generateVisionSummary: (eventId: string) => void;
  suggestPlanningPace: (daysLeft: number) => PlanningPace;
}

/**
 * Calculate days remaining from an ISO date string to today.
 * Returns 0 if the date is invalid or in the past.
 */
export function calculateDaysLeft(dateStr: string | undefined | null): number {
  if (!dateStr) return 0;
  try {
    const target = typeof dateStr === 'string' && dateStr.includes('T')
      ? parseISO(dateStr)
      : new Date(dateStr);
    if (!isValid(target)) return 0;
    const diff = differenceInDays(target, new Date());
    return Math.max(0, diff);
  } catch {
    return 0;
  }
}

/**
 * Format an ISO date string for display.
 */
export function formatWeddingDate(dateStr: string | undefined | null): string {
  if (!dateStr) return 'Date TBD';
  try {
    const d = typeof dateStr === 'string' && dateStr.includes('T')
      ? parseISO(dateStr)
      : new Date(dateStr);
    if (!isValid(d)) return 'Date TBD';
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return 'Date TBD';
  }
}

/**
 * Parse a budget string (e.g., "₹30L", "₹15-20L") into a numeric value.
 */
export function parseBudget(budgetStr: string | undefined | null): number {
  if (!budgetStr) return 0;
  // Remove currency symbol and handle ranges by picking the upper limit
  const clean = budgetStr.replace(/[₹\s,]/g, "");
  const parts = clean.split(/[-–]/);
  const target = parts[parts.length - 1];
  
  const num = parseFloat(target.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return 0;
  
  const unit = target.toLowerCase();
  if (unit.includes('cr')) return num * 10000000;
  if (unit.includes('l')) return num * 100000;
  if (unit.includes('k')) return num * 1000;
  
  return num;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
  user: null,
  weddingInfo: { 
    ...initialWeddingInfo,
    daysLeft: calculateDaysLeft(initialWeddingInfo.weddingDate),
    weddingDuration: 3,
    lockedDates: {}
  },
  events: [],
  phases: [...initialPhases],
  tasks: [...initialTasks],
  nextSteps: [...initialNextSteps],
  stakeholders: [...initialStakeholders],
  reminders: [...initialReminders],
  activities: [...initialActivities],
  risks: [...initialRisks],
  budgetCategories: [...initialBudgetCategories],
  budgetUpdates: [...initialBudgetUpdates],
  budgetWatchouts: [...initialBudgetWatchouts],
  budgetScenarios: [...initialBudgetScenarios],
  lastSyncedAt: null,
  syncStatus: 'idle',
  leadershipModel: null,
  potentialGuestList: [],
  whatsAppAnalysisStatus: "idle",
  whatsAppErrorMessage: null,
  whatsAppSummary: null,
  lastWhatsAppUpload: null,
  statusTracking: {
    venueBooked: false,
    catererBooked: false,
    plannerHired: false,
    photoBooked: false,
    multiDay: false,
    destination: false,
  },
  sessionId: localStorage.getItem("wedding_session_id") || (() => {
    const id = uuidv4();
    localStorage.setItem("wedding_session_id", id);
    return id;
  })(),
  isAuthClaimed: false,
  lastCompletedTaskId: null,

  detectAdvancedRisks: () => {
    const { tasks, weddingInfo, stakeholders, budgetCategories } = get();
    const newRisks: Risk[] = [];
    
    // 1. Burnout Risk: Check for high-effort clusters
    const today = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(today.getDate() + 14);
    
    const upcomingHighEffortTasks = tasks.filter(t => {
      const d = new Date(t.dueDate);
      return t.status !== "done" && d >= today && d <= twoWeeksLater && (t.effort >= 4 || t.priority === "high");
    });
    
    if (upcomingHighEffortTasks.length >= 3) {
      // Find a family member to delegate to
      const potentialDelegates = stakeholders.filter(s => s.type === "family" && s.taskCount < 3);
      const delegateName = potentialDelegates.length > 0 ? potentialDelegates[0].name : "a family member";

      newRisks.push({
        id: "burnout-risk-1",
        type: "burnout",
        title: "Breathe: A Big Week is Coming",
        explanation: `You've got ${upcomingHighEffortTasks.length} important tasks coming up in the next two weeks. It's a lot to handle alone!`,
        impact: "Continuing at this pace might lead to decision fatigue before the big day.",
        cta: "Delegate for some breathing room",
        severity: "high",
        suggestedAssistance: [
          "Snooze non-critical tasks for 1 week",
          `Delegate 2 tasks to ${delegateName}`
        ],
        assistanceResources: [
          {
            text: `Share the load: Pass a task to ${delegateName}`,
            link: "/stakeholders",
            linkText: "Delegate Now"
          },
          {
            text: "Take 5: Schedule a 'No-Wedding' evening",
            link: "/calendar",
            linkText: "Block Time"
          }
        ]
      });
    }
    
    // 2. Budget Risk: Check for cost overruns
    const totalSpent = tasks.filter(t => t.status === "done").reduce((acc, t) => acc + (t.actualCost || t.estimatedCost || 0), 0);
    const totalEstimated = tasks.filter(t => t.status !== "done").reduce((acc, t) => acc + (t.estimatedCost || 0), 0);
    const budgetValue = parseBudget(weddingInfo.budget);
    
    if ((totalSpent + totalEstimated) > budgetValue * 1.05) {
      const overAmount = (totalSpent + totalEstimated) - budgetValue;
      newRisks.push({
        id: "budget-risk-1",
        type: "budget",
        title: "Budget Reality Check",
        explanation: `Current plans are ${formatCurrency(overAmount)} over your original ${weddingInfo.budget} goal.`,
        impact: "This may require compromising on secondary details to keep the primary vision intact.",
        cta: "Rebalance the Budget",
        severity: "high",
        suggestedAssistance: [
          "Review 'Nice-to-Have' categories",
          "Compare vendor quotes for Venue/Decor"
        ],
        assistanceResources: [
          {
            text: "Find the drift: Review budget categories",
            link: "/budget",
            linkText: "Analyze Budget"
          },
          {
            text: "Trim the list: Identify guest count impacts",
            link: "/basics",
            linkText: "Review Guests"
          }
        ]
      });
    }

    // 2b. Sync Budget Watchouts
    const newWatchouts: BudgetWatchout[] = [];
    budgetCategories.forEach(cat => {
      if (cat.forecast > cat.planned * 1.1) {
        newWatchouts.push({
          id: `bw-${cat.id}`,
          title: `${cat.name} needs a look`,
          description: `Our ${cat.name} plans are ${Math.round((cat.forecast / cat.planned - 1) * 100)}% above our original dream.`,
          severity: "high"
        });
      }
    });
    set({ budgetWatchouts: newWatchouts });

    // 3. Event Density Risk
    const eventDates = Object.values(weddingInfo.lockedDates || {}).map(d => new Date(d)).filter(d => isValid(d));
    eventDates.sort((a,b) => a.getTime() - b.getTime());
    
    for (let i = 0; i < eventDates.length - 1; i++) {
      const diffHrs = (eventDates[i+1].getTime() - eventDates[i].getTime()) / (1000 * 60 * 60);
      if (diffHrs < 18) {
        newRisks.push({
          id: "density-risk-1",
          type: "density",
          title: "Tight Turnaround Detected",
          explanation: "You have two major events scheduled within 18 hours of each other.",
          impact: "Exhaustion for you and logistics hurdles for your guests.",
          cta: "Adjust Timeline",
          severity: "high",
          suggestedAssistance: [
            "Push back the start time of the second event",
            "Pre-arrange guest transportation"
          ],
          assistanceResources: [
            {
              text: "Create breathing room: Edit event times",
              link: "/timeline",
              linkText: "Update Timeline"
            },
            {
              text: "Simplify: Combine morning rituals",
              link: "/timeline",
              linkText: "Refine Flow"
            }
          ]
        });
        break;
      }
    }

    // 4. Fragmentation Risk (Event Gap)
    if (eventDates.length > 1) {
      for (let i = 0; i < eventDates.length - 1; i++) {
        const diffDays = (eventDates[i+1].getTime() - eventDates[i].getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > 2) {
          newRisks.push({
            id: "fragmentation-risk-1",
            type: "general",
            title: "Bridging the Gap",
            explanation: `There's a ${Math.round(diffDays)} day gap between your events.`,
            impact: "Out-of-town guests may have empty days during their stay.",
            cta: "Plan Guest Experience",
            severity: "medium",
            suggestedAssistance: [
              "Send local sightseeing tips",
              "Organize a casual lunch"
            ],
            assistanceResources: [
              {
                text: "Keep them engaged: Share local tips",
                link: "/stakeholders",
                linkText: "Message Guests"
              }
            ]
          });
          break;
        }
      }
    }

    // 5. NEW: Spending Velocity Risk
    const totalSpentVelocity = budgetCategories.reduce((acc, cat) => acc + cat.actual, 0);
    const totalForecast = budgetCategories.reduce((acc, cat) => acc + cat.forecast, 0);
    const daysLeft = weddingInfo.daysLeft;
    
    // Assume a 270-day (9 month) planning cycle if we don't have a start date
    const estimatedTotalDays = 270; 
    const timeElapsedPercent = Math.min(1, (estimatedTotalDays - daysLeft) / estimatedTotalDays);
    const budgetSpentPercent = totalSpentVelocity / budgetValue;

    if (budgetSpentPercent > timeElapsedPercent + 0.15 && timeElapsedPercent > 0.1) {
      newRisks.push({
        id: "velocity-risk-1",
        type: "budget",
        title: "Check Your Speed",
        explanation: `You've spent ${Math.round(budgetSpentPercent * 100)}% of your budget, but you're only ${Math.round(timeElapsedPercent * 100)}% through the timeline.`,
        impact: "At this rate, you might run out of funds for the final 'home stretch' details.",
        cta: "Adjust Spending Pace",
        severity: "high",
        suggestedAssistance: [
          "Lock remaining big-ticket items",
          "Re-evaluate upcoming 'Nice-to-Have' tasks"
        ]
      });
    }

    // 6. NEW: Budget Fragmentation Risk
    const overPlannedCount = budgetCategories.filter(cat => cat.forecast > cat.planned).length;
    if (overPlannedCount >= 4 && totalForecast > budgetValue) {
      newRisks.push({
        id: "fragmentation-risk-budget",
        type: "budget",
        title: "Budget Fragmentation",
        explanation: `You have ${overPlannedCount} different categories drifting over their planned amounts.`,
        impact: "Multiple small leaks can sink a big ship. It's getting harder to track where the money is going.",
        cta: "Consolidate & Rebalance",
        severity: "medium",
        suggestedAssistance: [
          "Consolidate 'Misc' tasks into specific categories",
          "Perform a top-down rebalance of all categories"
        ]
      });
    }
    
    set({ risks: [...newRisks] });
  },

  getAIAssistance: async (riskId: string) => {
    // Simulating deep analysis
    await new Promise(r => setTimeout(r, 2500));
    
    set(state => {
      const risk = state.risks.find(r => r.id === riskId);
      if (!risk) return state;
      
      let additionalResources: RiskAssistance[] = [];
      
      if (risk.type === "burnout") {
        additionalResources = [
          {
            text: "Deep Analysis: 40% of your upcoming load is 'Visual Decor' which can be delegated to your sibling.",
            link: "/stakeholders",
            linkText: "Delegate to Sibling"
          },
          {
            text: "Strategy: Batch all vendor callbacks into a single 1-hour window on Saturday morning.",
            link: "/calendar",
            linkText: "Block Hour"
          }
        ];
      } else if (risk.type === "budget") {
        additionalResources = [
          {
            text: "Savings Opportunity: Switching to seasonal flowers in your 'Decor' category could save ₹45k.",
            link: "/budget",
            linkText: "Review Decor"
          },
          {
            text: "Insight: Your 'Guest Experience' cost per head is 20% higher than average for this city.",
            link: "/basics",
            linkText: "Review Guest List"
          }
        ];
      } else if (risk.type === "density") {
        additionalResources = [
          {
            text: "Logistics Pro-tip: Hire a dedicated shuttle for the 18-hour window to avoid guest delays.",
            link: "/stakeholders",
            linkText: "Find Transport"
          }
        ];
      } else {
        additionalResources = [
          {
            text: "AI Suggestion: Standardize vendor communication templates to save time.",
            link: "/stakeholders",
            linkText: "View Templates"
          }
        ];
      }
      
      const updatedAssistance = [
        ...(risk.suggestedAssistance || []),
        "⚡ Analysis Complete: Actionable resources added below."
      ];
      
      const updatedResources = [
        ...(risk.assistanceResources || []),
        ...additionalResources
      ];
      
      return {
        risks: state.risks.map(r => r.id === riskId ? { 
          ...r, 
          suggestedAssistance: updatedAssistance,
          assistanceResources: updatedResources
        } : r)
      };
    });
  },

  updateWeddingInfo: (info) =>
    set((state) => ({
      weddingInfo: { ...state.weddingInfo, ...info },
    })),

  completeTask: (taskId) => {
    set((state) => {
      // Mark this task as done
      const newTasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: "done" as const } : t
      );
      
      // Update Budget if task has cost
      const completedTask = state.tasks.find(t => t.id === taskId);
      if (completedTask && completedTask.budgetCategoryId && completedTask.estimatedCost) {
        const actualCost = completedTask.actualCost || completedTask.estimatedCost;
        
        // Update category actuals
        return {
          tasks: newTasks,
          lastCompletedTaskId: taskId,
          budgetCategories: state.budgetCategories.map(cat => 
            cat.id === completedTask.budgetCategoryId 
              ? { ...cat, actual: cat.actual + actualCost }
              : cat
          ),
          budgetUpdates: [
            {
              id: `bu-${Date.now()}`,
              categoryName: state.budgetCategories.find(c => c.id === completedTask.budgetCategoryId)?.name || "Unknown",
              amount: actualCost,
              date: new Date().toISOString().split('T')[0],
              description: `Successfully checked off: ${completedTask.title}`,
              type: "reallocation" as const
            },
            ...state.budgetUpdates
          ]
        };
      }

      return { tasks: newTasks, lastCompletedTaskId: taskId };
    });
    
    // Also record activity and recalculate dashboard
    set((state) => ({
      activities: [
        {
          id: `a${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          description: `Checked off a milestone`,
          icon: "couple",
          actor: "Couple",
        },
        ...state.activities,
      ]
    }));
    get().recalculateNextSteps();
  },

  submitVendorData: (taskId) => {
    get().completeTask(taskId);
    set((state) => ({
      activities: [
        {
          id: `a${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          description: `Heard back from our vendor partner`,
          icon: "vendor",
          actor: "Vendor",
        },
        ...state.activities,
      ]
    }));
  },

  sendReminder: (reminderId) => {
    set((state) => {
      const newReminders = state.reminders.map((r) =>
        r.id === reminderId ? { ...r, status: "sent" as const } : r
      );
      return { reminders: newReminders };
    });
  },

  snoozeTask: (taskId, days) => {
    set((state) => ({
      tasks: state.tasks.map((t) => {
        if (t.id === taskId) {
          const newDate = new Date(t.dueDate);
          newDate.setDate(newDate.getDate() + days);
          return { ...t, dueDate: newDate.toISOString() };
        }
        return t;
      }),
      activities: [
        {
          id: `a${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          description: `Added a little more time for: ${days} days`,
          icon: "reminder",
          actor: "System",
        },
        ...state.activities,
      ]
    }));
  },

  reassignTask: (taskId, newOwner, newOwnerType) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { 
          ...t, 
          owner: newOwner, 
          ownerType: newOwnerType,
          ownerInitials: newOwner.split(' ').map(n => n[0]).join('').toUpperCase()
        } : t
      ),
      activities: [
        {
          id: `a${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          description: `Passed the baton to ${newOwner}`,
          icon: "stakeholder",
          actor: "Couple",
        },
        ...state.activities,
      ]
    }));
  },

  addProofToTask: (taskId, proof) => {
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { 
          ...t, 
          notes: t.notes 
            ? `${t.notes}\n\n[Payment Proof]: ${proof.docName} - ${proof.amount ? formatCurrency(proof.amount) : 'Payment recorded'} (${proof.date})\n${proof.notes || ''}`
            : `[Payment Proof]: ${proof.docName} - ${proof.amount ? formatCurrency(proof.amount) : 'Payment recorded'} (${proof.date})\n${proof.notes || ''}`
        } : t
      )
    }));
  },

  generateTimeline: (data) => {
    const generator = new TimelineGenerator();
    const currentInfo = get().weddingInfo;
    const result = generator.generate({
      partner1: data.partner1 || "Partner 1",
      partner2: data.partner2 || "Partner 2",
      weddingDate: data.weddingDate || currentInfo.weddingDate,
      tradition: data.tradition || "Traditional Hindu Wedding",
      guests: data.guests || currentInfo.guests,
      budget: data.budget || currentInfo.budget,
      city: data.city || currentInfo.city
    });

    set((state) => {
      const partner1Short = (data.partner1 || '').split(' ')[0] || "Partner 1";
      const partner2Short = (data.partner2 || '').split(' ')[0] || "Partner 2";
      const coupleName = `${partner1Short} & ${partner2Short}`;
      
      const resolvedDate = data.weddingDate || state.weddingInfo.weddingDate;
      const isoDate = resolvedDate
        ? new Date(resolvedDate).toISOString()
        : state.weddingInfo.weddingDate;

      const newWeddingInfo: AppWeddingInfo = {
        ...state.weddingInfo,
        coupleName,
        partner1Name: data.partner1 || state.weddingInfo.partner1Name,
        partner2Name: data.partner2 || state.weddingInfo.partner2Name,
        weddingDate: isoDate,
        daysLeft: calculateDaysLeft(isoDate),
        weddingType: data.tradition || state.weddingInfo.weddingType,
        partner1Rashi: data.partner1Rashi,
        partner2Rashi: data.partner2Rashi,
      };

      return {
        weddingInfo: newWeddingInfo,
        tasks: result.tasks,
        phases: result.phases
      };
    });
    get().recalculateNextSteps();
  },

  signInWithGoogle: async () => {
    set({ syncStatus: 'syncing' });
    // Mock delay
    await new Promise(r => setTimeout(r, 1200));
    set((state) => ({
      user: {
        name: state.weddingInfo.partner1Name || "Partner 1",
        email: "couple@example.com",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${state.weddingInfo.partner1Name || "Partner1"}`
      },
      isAuthClaimed: true,
      syncStatus: 'saved',
      lastSyncedAt: new Date().toISOString()
    }));
  },
  lockInDate: (date) => {
    const isoDate = new Date(date).toISOString();
    const daysLeft = calculateDaysLeft(isoDate);
    const suggestedPace = get().suggestPlanningPace(daysLeft);
    
    set((state) => ({
      weddingInfo: {
        ...state.weddingInfo,
        lockedDate: date,
        weddingDate: isoDate,
        daysLeft,
        planningPace: suggestedPace,
        lockedDates: { ...(state.weddingInfo.lockedDates || {}), "Main Ritual": date }
      }
    }));
    get().detectAdvancedRisks();
  },

  lockEventDate: (eventName, date) => {
    set((state) => ({
      weddingInfo: {
        ...state.weddingInfo,
        lockedDates: { ...(state.weddingInfo.lockedDates || {}), [eventName]: date }
      }
    }));
    get().detectAdvancedRisks();
  },

  setWeddingDuration: (days) => {
    set((state) => ({
      weddingInfo: { ...state.weddingInfo, weddingDuration: days }
    }));
    get().detectAdvancedRisks();
  },

  updateBudgetCategory: (categoryId, updates) => {
    set((state) => ({
      budgetCategories: state.budgetCategories.map(cat => 
        cat.id === categoryId ? { ...cat, ...updates } : cat
      )
    }));
    get().detectAdvancedRisks();
  },

  updateBudgetEstimate: (categoryId, estimate, priority) => {
    set((state) => ({
      budgetCategories: state.budgetCategories.map(cat => 
        cat.id === categoryId 
          ? { 
              ...cat, 
              customEstimate: estimate, 
              forecast: cat.actual + estimate,
              priority: priority || cat.priority || "must_have",
              trend: (cat.actual + estimate) > cat.planned ? "up" : (cat.actual + estimate) < cat.planned ? "down" : "stable"
            } 
          : cat
      )
    }));
    get().detectAdvancedRisks();
  },

  getSuggestedBudget: (categoryName) => {
    const { weddingInfo } = get();
    const totalBudget = parseBudget(weddingInfo.budget);
    const guests = parseInt(weddingInfo.guests) || 200;
    
    // Tiered multipliers for different styles
    const tiers = {
      standard: 1.0,
      premium: 1.4,
      luxury: 2.2
    };
    
    // Base allocation percentages (Standard tier)
    const baseAllocations: Record<string, number> = {
      "Venue": 0.22,
      "Catering": 0.28,
      "Decor": 0.12,
      "Photography": 0.08,
      "Attire": 0.06,
      "Invitations": 0.02,
      "Entertainment": 0.05,
      "Transport": 0.04,
      "Misc": 0.04,
    };
    
    const baseAlloc = baseAllocations[categoryName] || 0.08;
    
    // City factor
    let cityFactor = 1.0;
    const city = weddingInfo.city.toLowerCase();
    if (city === "mumbai" || city === "delhi" || city === "bangalore" || city === "gurgaon") {
      cityFactor = 1.3;
    } else if (city === "jaipur" || city === "udaipur" || city === "goa" || city === "jodhpur") {
      cityFactor = 1.5; // Destination/Premium cities
    } else if (city === "pune" || city === "hyderabad" || city === "chennai") {
      cityFactor = 1.15;
    }
    
    // Tradition multiplier
    let traditionFactor = 1.0;
    const tradition = (weddingInfo.weddingType || "").toLowerCase();
    if (tradition.includes("punjabi") || tradition.includes("marwari")) {
      if (categoryName === "Catering" || categoryName === "Decor") traditionFactor = 1.2;
    } else if (tradition.includes("south indian")) {
      if (categoryName === "Attire") traditionFactor = 1.1;
    }
    
    // Catering is special (per plate)
    if (categoryName === "Catering") {
      const perPlate = {
        standard: 1000 * cityFactor * traditionFactor,
        premium: 1800 * cityFactor * traditionFactor,
        luxury: 3500 * cityFactor * traditionFactor
      };
      return {
        standard: Math.round(guests * perPlate.standard),
        premium: Math.round(guests * perPlate.premium),
        luxury: Math.round(guests * perPlate.luxury),
        min: Math.round(guests * perPlate.standard),
        max: Math.round(guests * perPlate.premium)
      };
    }

    // Default tiered calculation
    const standard = totalBudget * baseAlloc * cityFactor * traditionFactor;
    return {
      standard: Math.round(standard),
      premium: Math.round(standard * tiers.premium),
      luxury: Math.round(standard * tiers.luxury),
      min: Math.round(standard),
      max: Math.round(standard * tiers.premium)
    };
  },

  addBudgetUpdate: (update) => {
    set((state) => ({
      budgetUpdates: [
        { ...update, id: `bu-${Date.now()}` },
        ...state.budgetUpdates
      ]
    }));
  },

  recalculateBudget: () => {
    const { tasks, budgetCategories } = get();
    
    set((state) => {
      const newCategories = budgetCategories.map(cat => {
        // Calculate new forecast based on uncompleted tasks linked to this category
        // If it's the 'Misc' category, also include tasks with no category assigned
        const pendingTasks = tasks.filter(t => {
          if (t.status === "done") return false;
          if (t.budgetCategoryId === cat.id) return true;
          if (cat.name === "Misc" && !t.budgetCategoryId && t.estimatedCost) return true;
          return false;
        });

        const pendingEstimate = pendingTasks.reduce((acc, t) => acc + (t.estimatedCost || 0), 0);
        
        // actual is already updated when tasks are marked done
        const newForecast = cat.actual + pendingEstimate;
        
        return {
          ...cat,
          forecast: newForecast,
          trend: newForecast > cat.planned ? "up" : newForecast < cat.planned ? "down" : "stable"
        };
      });
      
      return { budgetCategories: newCategories };
    });
    get().detectAdvancedRisks();
  },

  logExpense: (categoryId, amount, description) => {
    set((state) => ({
      budgetCategories: state.budgetCategories.map(cat => 
        cat.id === categoryId ? { ...cat, actual: cat.actual + amount } : cat
      ),
      budgetUpdates: [
        {
          id: `bu-${Date.now()}`,
          categoryName: state.budgetCategories.find(c => c.id === categoryId)?.name || "Unknown",
          amount,
          date: new Date().toISOString().split('T')[0],
          description,
          type: "increase"
        },
        ...state.budgetUpdates
      ]
    }));
    get().recalculateBudget();
  },

  updateTaskActualCost: (taskId: string, amount: number) => {
    set((state) => ({
      tasks: state.tasks.map(t => 
        t.id === taskId ? { ...t, actualCost: amount } : t
      )
    }));
  },

  reallocateBudget: (fromCategoryId, toCategoryId, amount) => {
    set((state) => {
      const fromCat = state.budgetCategories.find(c => c.id === fromCategoryId);
      const toCat = state.budgetCategories.find(c => c.id === toCategoryId);
      
      if (!fromCat || !toCat) return state;

      return {
        budgetCategories: state.budgetCategories.map(cat => {
          if (cat.id === fromCategoryId) return { ...cat, planned: cat.planned - amount };
          if (cat.id === toCategoryId) return { ...cat, planned: cat.planned + amount };
          return cat;
        }),
        budgetUpdates: [
          {
            id: `bu-${Date.now()}`,
            categoryName: 'Budget Rebalancing',
            amount: amount,
            date: new Date().toISOString().split('T')[0],
            description: `Shared resources from ${fromCat.name} to help with ${toCat.name}`,
            type: 'reallocation'
          },
          ...state.budgetUpdates
        ]
      };
    });
    get().detectAdvancedRisks();
  },

  linkTaskToBudgetCategory: (taskId, categoryId) => {
    set((state) => ({
      tasks: state.tasks.map(t => 
        t.id === taskId ? { ...t, budgetCategoryId: categoryId } : t
      )
    }));
    get().recalculateBudget();
  },

  completeTaskWithBudget: (taskId, actualCost, proofUrl) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const estimatedCost = task.estimatedCost || 0;
    const hasSignificantDrift = estimatedCost > 0 && actualCost > estimatedCost * 1.2;

    // 1. Update Task status and cost
    set((state) => ({
      tasks: state.tasks.map(t => 
        t.id === taskId ? { 
          ...t, 
          status: 'done', 
          actualCost: actualCost, 
          notes: proofUrl ? `${t.notes}\n\n[Proof]: ${proofUrl}` : t.notes 
        } : t
      ),
      lastCompletedTaskId: taskId
    }));

    // 2. Update Budget if linked
    if (task.budgetCategoryId) {
      set((state) => {
        const category = state.budgetCategories.find(c => c.id === task.budgetCategoryId);
        const newWatchouts = [...state.budgetWatchouts];
        
        if (hasSignificantDrift && category) {
          newWatchouts.push({
            id: `drift-${taskId}`,
            title: `Unexpected drift in ${category.name}`,
            description: `The "${task.title}" task ended up ${Math.round((actualCost / estimatedCost - 1) * 100)}% above the estimate.`,
            severity: "high"
          });
        }

        return {
          budgetCategories: state.budgetCategories.map(cat => 
            cat.id === task.budgetCategoryId 
              ? { ...cat, actual: cat.actual + actualCost }
              : cat
          ),
          budgetUpdates: [
            {
              id: `bu-${Date.now()}`,
              categoryName: category?.name || 'Unknown',
              amount: actualCost,
              date: new Date().toISOString().split('T')[0],
              description: `Settled payment for: ${task.title}`,
              type: 'increase'
            },
            ...state.budgetUpdates
          ],
          budgetWatchouts: newWatchouts
        };
      });
      get().recalculateBudget();
    }

    // 3. Log activity
    set((state) => ({
      activities: [
        {
          id: `a${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          description: `Marked as done and settled the fund`,
          icon: "couple",
          actor: "Couple",
        },
        ...state.activities,
      ]
    }));

    get().recalculateNextSteps();
    get().detectAdvancedRisks();
  },

  recalculateNextSteps: () => {
    const { tasks, weddingInfo } = get();
    const engine = new DependencyEngine(tasks);
    
    set((state) => {
      const doneTaskIds = state.tasks.filter(t => t.status === "done").map(t => t.id);
      
      // 1. Filter out finished tasks from next steps
      let newNextSteps = state.nextSteps.filter(ns => !doneTaskIds.includes(ns.taskId));
      
      // 2. Identify new potential next steps: Tasks that are NOT blocked and NOT done
      const readyTasks = state.tasks.filter(t => t.status !== "done" && !engine.isBlocked(t.id));
      
      // Update next steps to prioritize these ready tasks
      // For MVP, we'll just keep the existing logic but ensure they aren't blocked
      newNextSteps = newNextSteps.filter(ns => !engine.isBlocked(ns.taskId));

      // 3. Update Risks based on engine
      const newRisks = state.risks.filter(r => {
        if (r.id === "risk1" && doneTaskIds.includes("t2")) return false;
        if (r.id === "risk2" && doneTaskIds.includes("t1")) return false;
        return true;
      });

      return { nextSteps: newNextSteps, risks: newRisks };
    });
  },

  setLeadershipModel: (model) => set({ leadershipModel: model }),
  analyzeWhatsApp: async (file: File) => {
    set({ whatsAppAnalysisStatus: "analyzing", whatsAppErrorMessage: null });
    
    try {
      const rawText = await file.text();
      
      // Simulate AI analysis delay for UX
      await new Promise(r => setTimeout(r, 1500));
      
      const analysis = WhatsAppAnalyzer.analyze(rawText);

      set((state) => {
        const info = { ...state.weddingInfo, ...analysis.weddingInfo };
        
        // Apply explicit task updates from chat (e.g. "Task: X | Status: Y")
        let updatedTasks = [...state.tasks];
        analysis.tasks.forEach(et => {
          const existingIndex = updatedTasks.findIndex(t => t.title.toLowerCase().includes(et.title.toLowerCase()));
          if (existingIndex !== -1) {
            updatedTasks[existingIndex] = {
              ...updatedTasks[existingIndex],
              status: et.status,
              owner: et.owner
            };
          }
        });

        // Auto-complete based on detected status flags (e.g. "Venue booked")
        updatedTasks = updatedTasks.map(t => {
          if (t.id === "t1" && analysis.statusTracking.venueBooked) return { ...t, status: "done" as const };
          if (t.id === "t3" && analysis.statusTracking.catererBooked) return { ...t, status: "done" as const };
          if (t.id === "t5" && analysis.statusTracking.photoBooked) return { ...t, status: "done" as const };
          return t;
        });

        return {
          whatsAppAnalysisStatus: "completed",
          whatsAppSummary: analysis.summary,
          potentialGuestList: analysis.potentialGuestList,
          tasks: updatedTasks,
          statusTracking: { ...state.statusTracking, ...analysis.statusTracking },
          weddingInfo: info as AppWeddingInfo,
          lastWhatsAppUpload: Date.now()
        };
      });

      get().recalculateNextSteps();
    } catch (err) {
      console.error("WhatsApp Analysis Error:", err);
      set({ whatsAppAnalysisStatus: "error", whatsAppErrorMessage: "The chat log analysis failed. Please ensure the file is a standard WhatsApp export (.txt)." });
    }
  },


  setPlanningPace: (pace) => set((state) => ({
    weddingInfo: { ...state.weddingInfo, planningPace: pace }
  })),

  suggestPlanningPace: (daysLeft: number): PlanningPace => {
    if (daysLeft > 180) return "serene";
    if (daysLeft > 60) return "steady";
    if (daysLeft > 30) return "brisk";
    if (daysLeft > 7) return "sprint";
    return "final_countdown";
  },

  setBudgetPhase: (phase) => set((state) => ({
    weddingInfo: { ...state.weddingInfo, budgetPhase: phase }
  })),

  saveBudgetScenario: (name, description, vibeId) => set((state) => {
    const linkedVibe = state.events.find(e => e.id === vibeId);
    const newScenario: BudgetScenario = {
      id: uuidv4(),
      name,
      description,
      vibeId,
      visionTags: linkedVibe?.colors || [],
      thumbnailUrl: linkedVibe?.gallery?.[0],
      totalBudget: parseBudget(state.weddingInfo.budget),
      categories: state.budgetCategories.reduce((acc, cat) => ({
        ...acc,
        [cat.id]: cat.forecast // Capture the 'played around' numbers
      }), {}),
      createdAt: new Date().toISOString()
    };
    return {
      budgetScenarios: [...state.budgetScenarios, newScenario]
    };
  }),

  toggleCategoryLock: (categoryId) => set((state) => ({
    budgetCategories: state.budgetCategories.map(cat => 
      cat.id === categoryId ? { ...cat, isLocked: !cat.isLocked } : cat
    )
  })),

  switchBudgetScenario: (scenarioId) => set((state) => {
    const scenario = state.budgetScenarios.find(s => s.id === scenarioId);
    if (!scenario) return state;

    const updatedCategories = state.budgetCategories.map(cat => ({
      ...cat,
      planned: scenario.categories[cat.id] || cat.planned
    }));

    return {
      weddingInfo: { 
        ...state.weddingInfo, 
        activeScenarioId: scenarioId,
        budget: `₹${(scenario.totalBudget / 100000).toFixed(1)}L` 
      },
      budgetCategories: updatedCategories
    };
  }),

  deleteBudgetScenario: (scenarioId) => set((state) => ({
    budgetScenarios: state.budgetScenarios.filter(s => s.id !== scenarioId)
  })),

  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(e => e.id === id ? { ...e, ...updates } : e)
  })),
  removeEvent: (id) => set((state) => ({
    events: state.events.filter(e => e.id !== id)
  })),
  updateTaskCustomData: (taskId, data) => set((state) => ({
    tasks: state.tasks.map(t => t.id === taskId ? { ...t, customActionData: { ...t.customActionData, ...data } } : t)
  })),

  addTask: (taskData) => {
    const { weddingInfo } = get();
    const newTask: Task = {
      id: uuidv4(),
      status: "not_started",
      owner: "Couple",
      ownerInitials: "C",
      ownerType: "couple",
      dependencies: [],
      blocks: [],
      whyItMatters: "Added during planning",
      notes: "",
      priority: "medium",
      effort: 2,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default 1 week from now
      phase: "Custom",
      ...taskData,
    };

    set((state) => ({
      tasks: [newTask, ...state.tasks],
      activities: [
        {
          id: `a${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          description: `Added a new task: ${newTask.title}`,
          icon: "couple",
          actor: "Couple",
        },
        ...state.activities,
      ]
    }));
    
    get().recalculateBudget();
    get().recalculateNextSteps();
  },
  
  removeTask: (taskId: string) => {
    const task = get().tasks.find(t => t.id === taskId);
    if (!task) return;

    set((state) => ({
      tasks: state.tasks.filter(t => t.id !== taskId),
      activities: [
        {
          id: `a${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          description: `Removed task: ${task.title}`,
          icon: "system",
          actor: "System",
        },
        ...state.activities,
      ]
    }));

    get().recalculateBudget();
    get().recalculateNextSteps();
  },

  updateTask: (taskId: string, updates: Partial<Task>) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t)
    }));

    // If cost changed, recalculate
    if (updates.estimatedCost !== undefined || updates.actualCost !== undefined || updates.status !== undefined) {
      get().recalculateBudget();
    }
    
    get().recalculateNextSteps();
  },

  claimAuth: () => set({ isAuthClaimed: true }),

  getCategoryTasks: (categoryId) => {
    const { tasks } = get();
    return tasks.filter(t => t.budgetCategoryId === categoryId);
  },

  getTaskStatus: (taskId) => {
    const { tasks } = get();
    const engine = new DependencyEngine(tasks);
    return engine.getDynamicStatus(taskId);
  },

  getBlockingExplanation: (taskId) => {
    const { tasks } = get();
    const engine = new DependencyEngine(tasks);
    return engine.getBlockingExplanation(taskId);
  },

  getRelevantTasks: () => {
    const { tasks, statusTracking, weddingInfo } = get();
    if (!statusTracking) return tasks;
    
    // Filter tasks based on onboarding status
    return tasks.filter(t => {
      // 1. If venue is booked, prioritize contract review and payments over selection
      if (statusTracking.venueBooked && t.category === "Venue") {
        if (t.title.toLowerCase().includes("shortlist") || t.title.toLowerCase().includes("visit")) {
          return t.status === "done"; // Only show if already done
        }
      }
      
      // 2. If catering is booked, focus on menu finalization
      if (statusTracking.catererBooked && t.category === "Catering") {
         if (t.title.toLowerCase().includes("search") || t.title.toLowerCase().includes("tasting")) {
           return t.status === "done";
         }
      }

      // 3. Multi-day wedding tasks
      if (!statusTracking.multiDay && t.title.toLowerCase().includes("multi-day")) {
        return false;
      }

      // 4. Destination wedding tasks
      if (!statusTracking.destination && t.category === "Travel") {
        return false;
      }

      return true;
    });
  },

  getBudgetInsights: () => {
    const { budgetCategories, weddingInfo } = get();
    const totalBudget = parseBudget(weddingInfo.budget);
    const totalForecast = budgetCategories.reduce((acc, cat) => acc + cat.forecast, 0);
    const isOver = totalForecast > totalBudget;
    const phase = weddingInfo.budgetPhase || "dreaming";
    const pace = weddingInfo.planningPace || "serene";
    
    const insights: any[] = [];
    
    if (isOver) {
      const overAmount = totalForecast - totalBudget;
      if (phase === "dreaming") {
        insights.push({
          type: "suggestion",
          title: "Expanding the Vision",
          message: `Your beautiful vision is currently ${formatCurrency(overAmount)} beyond the initial map. It's completely natural to dream big—let's see if we can find a path that feels lighter and just as magical.`,
          action: "Explore Scenarios"
        });
      } else {
        insights.push({
          type: "warning",
          title: "A Gentle Course Correction",
          message: `We've noticed a ${formatCurrency(overAmount)} drift from our settled fund. Making a few small, mindful adjustments now will help ensure a completely worry-free celebration later.`,
          action: "Review Joy Investments"
        });
      }
      
      const luxuries = budgetCategories.filter(c => c.priority === 'luxury' && c.forecast > 0);
      if (luxuries.length > 0) {
        insights.push({
          type: "info",
          title: "Prioritizing Magic",
          message: `Refining ${luxuries.length} of your 'nice-to-have' special touches could bring everything back into beautiful harmony.`,
          action: "Refine Luxury"
        });
      }
    } else {
      const buffer = totalBudget - totalForecast;
      if (buffer > totalBudget * 0.1) {
        insights.push({
          type: "success",
          title: "Room for Extra Joy",
          message: `You've managed things so beautifully! There's a ${formatCurrency(buffer)} buffer that could go towards a surprise for your guests or a special treat for yourselves.`,
          action: "Add Extras"
        });
      } else if (buffer > 0) {
        insights.push({
          type: "success",
          title: "Perfectly on Track",
          message: `You're navigating the budget with grace. Having ${formatCurrency(buffer)} as a safety net is a very wise move.`,
          action: "View Breakdown"
        });
      }
    }

    // Pace-specific advice
    if (pace === "sprint") {
      insights.push({
        type: "warning",
        title: "The Home Stretch",
        message: "You're almost there! Focus on double-checking all final payments and enjoying the magic you've created.",
        action: "Final Check"
      });
    } else if (pace === "brisk") {
      insights.push({
        type: "warning",
        title: "Momentum Phase",
        message: "With the big day approaching, let's focus on locking in any remaining estimates to avoid last-minute surprises.",
        action: "Lock Estimates"
      });
    } else if (pace === "steady" && isOver) {
      insights.push({
        type: "info",
        title: "Steady Progress",
        message: "You're in the peak of planning. Now is a great time to re-evaluate those 'Maybe' items to keep the budget balanced.",
        action: "Review Priorities"
      });
    }
    
    const lowConfidence = budgetCategories.filter(c => c.confidence === 'low' && c.forecast > 0);
    if (lowConfidence.length > 0 && phase === "tracking") {
      insights.push({
        type: "info",
        title: "Gaining Clarity",
        message: `We're still refining the numbers for ${lowConfidence.length} areas. Getting final quotes soon will give you wonderful peace of mind.`,
        action: "Get Quotes"
      });
    }

    return insights;
  },

  getScenarioComparison: () => {
    const { budgetScenarios, weddingInfo, events } = get();
    const currentTotal = parseBudget(weddingInfo.budget);
    
    return budgetScenarios.map(scenario => {
      const vibe = events.find(e => e.id === scenario.vibeId);
      return {
        id: scenario.id,
        name: scenario.name,
        totalBudget: scenario.totalBudget,
        difference: scenario.totalBudget - currentTotal,
        vibeName: vibe?.name,
        visionTags: scenario.visionTags,
        thumbnailUrl: scenario.thumbnailUrl,
        isCurrent: scenario.id === weddingInfo.activeScenarioId
      };
    });
  },

  getPlanningMaturity: () => {
    const { budgetCategories } = get();
    const totalForecast = budgetCategories.reduce((acc, cat) => acc + cat.forecast, 0);
    if (totalForecast === 0) return { percentage: 0, lockedAmount: 0, estimatedAmount: 0, status: "vibe_check" };

    const lockedAmount = budgetCategories
      .filter(cat => cat.confidence === 'high')
      .reduce((acc, cat) => acc + (cat.actual || cat.forecast), 0);
    
    const estimatedAmount = totalForecast - lockedAmount;
    const percentage = Math.round((lockedAmount / totalForecast) * 100);
    
    let status: "vibe_check" | "planning" | "solidified" = "vibe_check";
    if (percentage > 80) status = "solidified";
    else if (percentage > 40) status = "planning";
    
    return { percentage, lockedAmount, estimatedAmount, status };
  },

  getBudgetActionables: () => {
    const { budgetCategories, weddingInfo } = get();
    const actionables: any[] = [];
    const phase = weddingInfo.budgetPhase || "dreaming";
    
    // 1. High Forecast vs Planned (Saving Opportunity)
    const overspent = budgetCategories.filter(c => c.forecast > c.planned * 1.1 && c.priority !== 'must_have');
    overspent.forEach(cat => {
      const diffPercent = Math.round((cat.forecast / cat.planned - 1) * 100);
      actionables.push({
        id: `act-save-${cat.id}`,
        category: cat.name,
        title: `Reimagine ${cat.name}`,
        description: phase === "dreaming" 
          ? `Your thoughts for ${cat.name} are ${diffPercent}% higher than the initial spark. Should we explore some creative ways to keep the same vibe with a lighter touch?`
          : `We've noticed a ${diffPercent}% drift in ${cat.name} costs. Let's see if we can bring this back into alignment with your original dream.`,
        type: "saving",
        potentialSaving: cat.forecast - cat.planned
      });
    });

    // 2. Low Confidence (Locking Opportunity)
    const lowConfidence = budgetCategories.filter(c => c.confidence === 'low' && c.forecast > 0);
    lowConfidence.forEach(cat => {
      actionables.push({
        id: `act-lock-${cat.id}`,
        category: cat.name,
        title: `Find Confidence in ${cat.name}`,
        description: phase === "dreaming"
          ? `You're still exploring ${cat.name}. Setting a firm number here will help the rest of your puzzle pieces fall into place.`
          : `We're still working with a rough estimate for ${cat.name}. Confirming this with a vendor will help you feel much more secure.`,
        type: "locking"
      });
    });

    // 3. Unallocated Budget (Exploring Opportunity)
    const totalBudget = parseBudget(weddingInfo.budget);
    const totalPlanned = budgetCategories.reduce((acc, c) => acc + c.planned, 0);
    if (totalPlanned < totalBudget * 0.95 && phase === "dreaming") {
      actionables.push({
        id: 'act-explore-extras',
        category: 'Possibilities',
        title: 'Discover New Delights',
        description: `You have ${formatCurrency(totalBudget - totalPlanned)} left in your wedding fund. How about we look into a little surprise for your guests or a personal touch just for you two?`,
        type: "exploring"
      });
    }

    return actionables.slice(0, 4);
  },

  getCategoryTips: (categoryId) => {
    const { budgetCategories } = get();
    const cat = budgetCategories.find(c => c.id === categoryId);
    if (!cat) return { title: "General Tips", tips: ["Keep track of all deposits.", "Review contracts carefully."] };

    const tipsMap: Record<string, { title: string; tips: string[]; potentialSavings?: string }> = {
      "Venue": {
        title: "Securing the Perfect Setting",
        tips: [
          "Weekday weddings can save up to 20% on rental fees.",
          "Check if they allow outside vendors for decor to stay flexible.",
          "Confirm if lighting and basic sound are included in the package."
        ],
        potentialSavings: "Save up to ₹2L by choosing a Friday or Sunday."
      },
      "Catering": {
        title: "A Feast to Remember",
        tips: [
          "A multi-cuisine buffet is usually more cost-effective than sit-down service.",
          "Limit the number of 'Live Stations' to 2-3 high-impact ones.",
          "Consider a limited premium bar instead of a full open bar."
        ],
        potentialSavings: "Save ₹500 per plate by refining the dessert counter."
      },
      "Decor": {
        title: "Painting Your Vision",
        tips: [
          "Use seasonal local flowers to reduce costs and support local growers.",
          "Repurpose decor from the ceremony to the reception (like floral arches).",
          "Focus high-detail decor on eye-level areas where guests spend time."
        ],
        potentialSavings: "Repurposing ceremony flowers can save ₹50k - ₹1L."
      },
      "Photography": {
        title: "Capturing Every Smile",
        tips: [
          "Book a team that handles both photo and video for better coordination and pricing.",
          "Consider a shorter duration for pre-wedding shoots if budget is tight.",
          "Ask for a 'Raw Data' package if you want to handle album printing later."
        ]
      }
    };

    return tipsMap[cat.name] || {
      title: `${cat.name} Planning`,
      tips: [
        `Compare at least 3 quotes for ${cat.name}.`,
        "Ask about hidden costs like transport or service taxes.",
        "Check reviews specifically for punctuality and reliability."
      ]
    };
  },

  generateVisionSummary: (eventId: string) => {
    const { events, updateEvent } = get();
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    const colors = event.colors?.length ? event.colors.join(", ") : "a spectrum of colors";
    const theme = event.theme || "a bespoke celebration";
    const vibe = event.vibe || "unique";
    const guestCount = event.guestCount || "your loved ones";
    const location = event.locationType || "a beautiful setting";
    const atmosphere = event.atmosphere ? ` The air will be filled with ${event.atmosphere},` : "";
    const music = event.musicStyle ? ` complemented by the ${event.musicStyle} notes that define the mood.` : "";
    const dress = event.dressCode ? ` We envision guests arriving in ${event.dressCode}, adding to the visual harmony.` : "";

    const summary = `Your ${event.name} will be an ${vibe} ${theme} gathering, set against ${location}.${atmosphere} Imagine a palette of ${colors} weaving through the space, creating an atmosphere that feels both curated and deeply personal for you and your ${guestCount} guests.${music}${dress} It's a vision of elegance and joy, designed to linger in memory long after the last candle is extinguished.`;

    updateEvent(eventId, { visionSummary: summary });
  }
}), {
  name: 'wedding-orchestrator-storage',
  storage: createJSONStorage(() => localStorage),
  partialize: (state) => ({ 
    events: state.events, 
    weddingInfo: state.weddingInfo,
    leadershipModel: state.leadershipModel,
    isAuthClaimed: state.isAuthClaimed,
    sessionId: state.sessionId,
    budgetCategories: state.budgetCategories,
    budgetScenarios: state.budgetScenarios,
    tasks: state.tasks,
    phases: state.phases,
    stakeholders: state.stakeholders,
    reminders: state.reminders,
    activities: state.activities,
    risks: state.risks,
    budgetUpdates: state.budgetUpdates,
    budgetWatchouts: state.budgetWatchouts,
  }),
}));
