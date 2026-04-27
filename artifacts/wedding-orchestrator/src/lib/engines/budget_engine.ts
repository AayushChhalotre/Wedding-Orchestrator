import { 
  BudgetCategory, 
  Task, 
  WeddingInfo, 
  PlanningPace,
  BudgetPhase
} from "../models/schema";
import { formatCurrency } from "../utils";

export interface BudgetConfig {
  tiers: Record<string, number>;
  baseAllocations: Record<string, number>;
  cityFactors: Record<string, number>;
  traditionMultipliers: Record<string, Record<string, number>>;
}

export const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  tiers: {
    standard: 1.0,
    premium: 1.4,
    luxury: 2.2
  },
  baseAllocations: {
    "Venue": 0.22,
    "Catering": 0.28,
    "Decor": 0.12,
    "Photography": 0.08,
    "Attire": 0.06,
    "Invitations": 0.02,
    "Entertainment": 0.05,
    "Transport": 0.04,
    "Misc": 0.04,
  },
  cityFactors: {
    "mumbai": 1.3,
    "delhi": 1.3,
    "bangalore": 1.3,
    "gurgaon": 1.3,
    "jaipur": 1.5,
    "udaipur": 1.5,
    "goa": 1.5,
    "jodhpur": 1.5,
    "pune": 1.15,
    "hyderabad": 1.15,
    "chennai": 1.15,
  },
  traditionMultipliers: {
    "punjabi": { "Catering": 1.2, "Decor": 1.2 },
    "marwari": { "Catering": 1.2, "Decor": 1.2 },
    "south indian": { "Attire": 1.1 }
  }
};

export interface BudgetSuggestion {
  standard: number;
  premium: number;
  luxury: number;
  min: number;
  max: number;
}

export class BudgetEngine {
  private config: BudgetConfig;

  constructor(config: BudgetConfig = DEFAULT_BUDGET_CONFIG) {
    this.config = config;
  }

  /**
   * Calculates a suggested budget range for a specific category.
   */
  getSuggestedRange(
    categoryName: string, 
    weddingInfo: WeddingInfo, 
    numericBudget: number
  ): BudgetSuggestion {
    const guests = parseInt(weddingInfo.guests) || 200;
    const baseAlloc = this.config.baseAllocations[categoryName] || 0.08;
    
    const city = weddingInfo.city.toLowerCase();
    const cityFactor = this.config.cityFactors[city] || 1.0;
    
    const tradition = (weddingInfo.weddingType || "").toLowerCase();
    let traditionFactor = 1.0;
    
    // Apply tradition-specific multipliers for this category
    for (const [trad, multipliers] of Object.entries(this.config.traditionMultipliers)) {
      if (tradition.includes(trad)) {
        if (multipliers[categoryName]) {
          traditionFactor = multipliers[categoryName];
          break;
        }
      }
    }
    
    // Catering is special (per plate logic)
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

    const standard = numericBudget * baseAlloc * cityFactor * traditionFactor;
    
    return {
      standard: Math.round(standard),
      premium: Math.round(standard * this.config.tiers.premium),
      luxury: Math.round(standard * this.config.tiers.luxury),
      min: Math.round(standard),
      max: Math.round(standard * this.config.tiers.premium)
    };
  }

  /**
   * Recalculates the forecast for a category based on custom estimates and pending tasks.
   * FIX: Prioritizes manual override (customEstimate) but ensures it's not less than 
   * already spent + pending tasks if those tasks are explicit.
   */
  calculateForecast(category: BudgetCategory, tasks: Task[]): number {
    const pendingTasks = tasks.filter(t => t.budgetCategoryId === category.id && t.status !== "done");
    const pendingEstimate = pendingTasks.reduce((acc, t) => acc + (t.estimatedCost || 0), 0);
    
    // If we have a custom estimate (manual override), use it.
    // Otherwise use the task-based rollup.
    const remainingEstimate = category.customEstimate !== undefined 
      ? category.customEstimate 
      : pendingEstimate;

    return category.actual + remainingEstimate;
  }

  /**
   * Generates actionable insights based on the current budget state.
   */
  getBudgetInsights(
    categories: BudgetCategory[], 
    weddingInfo: WeddingInfo,
    totalBudget: number
  ) {
    const totalForecast = categories.reduce((acc, cat) => acc + cat.forecast, 0);
    const isOver = totalForecast > totalBudget;
    const phase = weddingInfo.budgetPhase || "dreaming";
    const pace = weddingInfo.planningPace || "marathon";
    
    const insights: any[] = [];
    
    if (isOver) {
      const overAmount = totalForecast - totalBudget;
      if (phase === "dreaming") {
        insights.push({
          type: "suggestion",
          title: "Expanding the Vision",
          message: `Your beautiful vision is currently ${formatCurrency(overAmount)} beyond the initial map. It's okay to dream big—let's see if we can find a path that feels lighter and just as magical.`,
          action: "Explore Scenarios"
        });
      } else {
        insights.push({
          type: "warning",
          title: "A Gentle Course Correction",
          message: `We're ${formatCurrency(overAmount)} over the planned path. Making a few small adjustments now will help ensure a completely worry-free celebration later.`,
          action: "Review Tracked Costs"
        });
      }
      
      const luxuries = categories.filter(c => c.priority === 'luxury' && c.forecast > 0);
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
    if (pace === "final_countdown") {
      insights.push({
        type: "warning",
        title: "The Final Countdown",
        message: "You're almost there! Focus on double-checking all final payments and enjoying the magic you've created.",
        action: "Final Check"
      });
    } else if (pace === "blitz") {
      insights.push({
        type: "warning",
        title: "The Home Stretch",
        message: "With the big day approaching fast, let's focus on locking in any remaining estimates to avoid last-minute surprises.",
        action: "Lock Estimates"
      });
    }

    return insights;
  }

  /**
   * Calculates the planning maturity based on how much of the budget is locked/actual.
   */
  getPlanningMaturity(categories: BudgetCategory[]) {
    const totalForecast = categories.reduce((acc, cat) => acc + cat.forecast, 0);
    const lockedAmount = categories
      .filter(c => c.isLocked)
      .reduce((acc, cat) => acc + cat.planned, 0);
    
    const actualAmount = categories.reduce((acc, cat) => acc + cat.actual, 0);
    const solidifiedAmount = Math.max(actualAmount, lockedAmount);
    
    const percentage = totalForecast > 0 ? Math.round((solidifiedAmount / totalForecast) * 100) : 0;
    
    let status: "vibe_check" | "planning" | "solidified" = "vibe_check";
    if (percentage > 70) status = "solidified";
    else if (percentage > 20) status = "planning";
    
    return {
      percentage,
      lockedAmount,
      estimatedAmount: totalForecast - solidifiedAmount,
      status
    };
  }
}
