import { useState, useEffect, useMemo } from "react";
import { useStore, parseBudget } from "@/store/useStore";
import { cn, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee,
  PieChart,
  Activity,
  ChevronRight,
  X,
  Palette,
} from "lucide-react";
import { Layout } from "@/components/Layout";
import { WeddingFloralRing } from "@/components/WeddingGraphics";
import { BudgetRefinementModal } from "@/components/BudgetRefinementModal";
import { BudgetDetailDrawer } from "@/components/BudgetDetailDrawer";
import { BudgetCategory } from "@/lib/models/schema";
import { Heart, Target, Lightbulb, PenLine, Shield, ShieldCheck, Zap, Lock, Unlock, Search, HeartHandshake, Compass, Coins, Save, History, RefreshCcw, Wallet } from "lucide-react";

export default function BudgetWatch() {
  const weddingInfo = useStore((state) => state.weddingInfo);
  const budgetCategories = useStore((state) => state.budgetCategories);
  const budgetUpdates = useStore((state) => state.budgetUpdates);
  const budgetWatchouts = useStore((state) => state.budgetWatchouts);
  const tasks = useStore((state) => state.tasks);
  const insights = useStore((state) => state.getBudgetInsights);
  const maturity = useStore((state) => state.getPlanningMaturity);
  const actionables = useStore((state) => state.getBudgetActionables);
  const updateWeddingInfo = useStore((state) => state.updateWeddingInfo);
  const getSuggestedBudget = useStore((state) => state.getSuggestedBudget);

  const memoizedInsights = useMemo(() => insights(), [insights, budgetCategories, weddingInfo.budget]);
  const memoizedMaturity = useMemo(() => maturity(), [maturity, budgetCategories]);
  const memoizedActionables = useMemo(() => actionables(), [actionables, budgetCategories, weddingInfo.budget]);

  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState(weddingInfo.budget);
  const [showCelebration, setShowCelebration] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState(weddingInfo.budgetPhase === 'dreaming' ? "dream" : "biggest");

  const budgetScenarios = useStore((state) => state.budgetScenarios);
  const saveBudgetScenario = useStore((state) => state.saveBudgetScenario);
  const switchBudgetScenario = useStore((state) => state.switchBudgetScenario);
  const deleteBudgetScenario = useStore((state) => state.deleteBudgetScenario);
  const toggleCategoryLock = useStore((state) => state.toggleCategoryLock);
  const reallocateBudget = useStore((state) => state.reallocateBudget);

  useEffect(() => {
    setNewBudget(weddingInfo.budget);
  }, [weddingInfo.budget]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Summary Calculations
  const totalBudgetAmount = parseBudget(weddingInfo.budget);
  const totalPlanned = budgetCategories.reduce(
    (acc, cat) => acc + cat.planned,
    0,
  );
  const totalForecast = budgetCategories.reduce(
    (acc, cat) => acc + cat.forecast,
    0,
  );
  const totalActual = budgetCategories.reduce(
    (acc, cat) => acc + cat.actual,
    0,
  );
  const buffer = totalBudgetAmount - totalForecast;
  const remainingInPot = Math.max(0, totalBudgetAmount - totalPlanned);
  const isOverBudget = totalForecast > totalBudgetAmount;

  // Processed Categories Logic
  const filteredAndSortedCategories = useMemo(() => {
    let result = [...budgetCategories];

    // 1. Filtering Logic
    if (filter !== "all") {
      if (weddingInfo.budgetPhase === 'dreaming') {
        if (filter === "core") result = result.filter(c => c.priority === "must_have");
        else if (filter === "refining") result = result.filter(c => c.priority === "nice_to_have");
        else if (filter === "delights") result = result.filter(c => c.priority === "luxury");
      } else {
        if (filter === "review") result = result.filter(c => c.forecast > c.planned);
        else if (filter === "upcoming") result = result.filter(c => (c.actual / (c.forecast || 1)) < 0.9);
        else if (filter === "solid") result = result.filter(c => (c.actual / (c.forecast || 1)) >= 0.9);
      }
    }

    // 2. Sorting Logic
    result.sort((a, b) => {
      if (weddingInfo.budgetPhase === 'dreaming') {
        if (sortBy === "dream") return b.planned - a.planned;
        if (sortBy === "priority") {
          const scores = { must_have: 3, nice_to_have: 2, luxury: 1 };
          return (scores[b.priority || "nice_to_have"] || 0) - (scores[a.priority || "nice_to_have"] || 0);
        }
      } else {
        if (sortBy === "biggest") return b.actual - a.actual;
        if (sortBy === "drift") return (b.forecast - b.planned) - (a.forecast - a.planned);
      }
      if (sortBy === "recent") return parseInt(b.id) - parseInt(a.id);
      return 0;
    });

    return result;
  }, [budgetCategories, filter, sortBy, weddingInfo.budgetPhase]);

  // Variables for Spending Pace UI - Moved up for use in calculateVisionAlignment
  const estimatedTotalDays = useMemo(() => {
    if (weddingInfo.createdAt) {
      const start = new Date(weddingInfo.createdAt);
      const end = new Date(weddingInfo.weddingDate);
      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(1, diff);
      }
    }
    return 270; // Fallback to 9 months if start date unknown
  }, [weddingInfo.createdAt, weddingInfo.weddingDate]);

  const timeElapsedPercent = Math.min(1, Math.max(0, (estimatedTotalDays - weddingInfo.daysLeft) / estimatedTotalDays));
  const budgetSpentPercent = totalActual / (totalBudgetAmount || 1);
  const isSpendingTooFast = budgetSpentPercent > timeElapsedPercent + 0.1;

  // Feasibility Score (0-100)
  // Vision Alignment Score (formerly Feasibility Score)
  const calculateVisionAlignment = () => {
    let score = 100;
    const phase = weddingInfo.budgetPhase || 'dreaming';
    const maturityPercent = memoizedMaturity.percentage;
    const { lockedCount, totalCount } = memoizedMaturity;
    
    // 1. Budget Overrun Impact (Max -45)
    if (isOverBudget) {
      const overPercentage = ((totalForecast - totalBudgetAmount) / totalBudgetAmount) * 100;
      
      if (phase === 'dreaming') {
        // More lenient in dreaming - curiosity shouldn't be punished too hard
        score -= Math.min(25, overPercentage * 1); 
      } else {
        // Stricter in tracking - we need adherence to the map
        // Scaled penalty: more mature plan = more punitive for overruns
        const penaltyMultiplier = 2 + ((maturityPercent / 100) * 3); // 2x to 5x
        score -= Math.min(45, overPercentage * penaltyMultiplier);
      }
    }
    
    // 2. Low Confidence Impact / Plan Maturity (Max -25)
    const lowConfidenceCount = budgetCategories.filter(c => c.confidence === 'low').length;
    
    if (phase === 'dreaming') {
      score -= Math.min(10, lowConfidenceCount * 1);
    } else {
      score -= Math.min(25, lowConfidenceCount * 5);
    }
    
    // 3. Unallocated Budget Impact (Slightly positive if in Dreaming)
    if (phase === 'dreaming' && remainingInPot > totalBudgetAmount * 0.1) {
      score += 5;
    }

    // 4. Spending Pace Impact (Max -20)
    const paceThreshold = timeElapsedPercent < 0.3 ? 0.2 : 0.1;
    if (budgetSpentPercent > timeElapsedPercent + paceThreshold) {
       const paceDifference = (budgetSpentPercent - timeElapsedPercent) * 100;
       const pacePenalty = phase === 'dreaming' ? paceDifference * 0.5 : paceDifference;
       score -= Math.min(20, pacePenalty);
    }

    // 5. Commitment Ratio (Tracking only)
    if (phase === 'tracking' && totalCount > 0) {
      const commitmentRatio = lockedCount / totalCount;
      // If halfway through time but less than 30% categories settled
      if (timeElapsedPercent > 0.5 && commitmentRatio < 0.3) {
        score -= 15;
      }
      // Bonus for being highly organized
      if (commitmentRatio > 0.9) {
        score += 5;
      }
    }

    // 6. Drift Penalty (Actuals vs Forecast for locked items)
    const totalDrift = budgetCategories.reduce((acc, cat) => {
      if (cat.confidence === 'high' && cat.actual > cat.forecast) {
        return acc + (cat.actual - cat.forecast);
      }
      return acc;
    }, 0);

    if (totalDrift > 0) {
      const driftPercent = (totalDrift / totalBudgetAmount) * 100;
      const driftPenalty = phase === 'dreaming' ? driftPercent * 0.5 : driftPercent * 1.5;
      score -= Math.min(15, driftPenalty);
    }
    
    return Math.round(Math.min(100, Math.max(0, score)));
  };
  const visionAlignmentScore = calculateVisionAlignment();

  if (!mounted) return null;

  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-8 py-8 lg:py-12">
        {/* Phase Toggle & Pace Indicator */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-2xl border border-white/20 shadow-sm self-start">
            {[
              { id: "dreaming", label: "Dreaming", icon: Compass },
              { id: "tracking", label: "Tracking", icon: Target },
            ].map((phase) => (
              <button
                key={phase.id}
                onClick={() => useStore.getState().setBudgetPhase(phase.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all duration-300 text-xs font-bold uppercase tracking-widest",
                  weddingInfo.budgetPhase === phase.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                    : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                )}
              >
                <phase.icon className="w-3.5 h-3.5" />
                {phase.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className={cn(
              "absolute inset-0 opacity-5",
              weddingInfo.planningPace === "serene" || weddingInfo.planningPace === "steady" ? "bg-emerald-500" :
              weddingInfo.planningPace === "brisk" || weddingInfo.planningPace === "sprint" ? "bg-indigo-400" :
              "bg-rose-400"
            )} />
            <div className={cn(
              "p-2 rounded-xl relative z-10",
              weddingInfo.planningPace === "serene" || weddingInfo.planningPace === "steady" ? "bg-emerald-50 text-emerald-600" :
              weddingInfo.planningPace === "brisk" || weddingInfo.planningPace === "sprint" ? "bg-indigo-50 text-indigo-500" :
              "bg-rose-50 text-rose-500"
            )}>
              {weddingInfo.planningPace === "serene" || weddingInfo.planningPace === "steady" ? <Compass className="w-4 h-4" /> :
               weddingInfo.planningPace === "brisk" || weddingInfo.planningPace === "sprint" ? <Activity className="w-4 h-4" /> :
               <Heart className="w-4 h-4 animate-pulse" />}
            </div>
            <div className="relative z-10">
              <p className="text-[9px] uppercase font-bold tracking-widest text-slate-400 leading-none mb-1">Our Tempo</p>
              <p className="text-xs font-bold text-slate-700 capitalize">
                {weddingInfo.planningPace === "serene" || weddingInfo.planningPace === "steady" ? "Steady Flow" : 
                 weddingInfo.planningPace === "brisk" || weddingInfo.planningPace === "sprint" ? "Swift Progress" : 
                 "Final Countdown"}: {weddingInfo.daysLeft} Days
              </p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={weddingInfo.budgetPhase}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "anticipate" }}
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                    <Heart className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-rose-400">
                {weddingInfo.budgetPhase === 'dreaming' ? 'The Vision Board' : 'The Execution Map'}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif-display text-slate-800 leading-tight tracking-tight">
              {weddingInfo.budgetPhase === 'dreaming' ? 'Painting Our Shared Future' : 'Bringing Our Dream to Life'}
            </h1>
            <p className="text-slate-500 mt-1 max-w-lg italic font-medium text-xs leading-relaxed">
              {weddingInfo.budgetPhase === 'dreaming' 
                ? "This is our space to imagine, play with numbers, and see how our vision takes shape. Nothing is set in stone yet—just let your hearts lead."
                : "Now that we've found our direction, let's track our progress and keep the momentum steady as we approach our big day."}
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md border border-rose-100 p-4 rounded-[2rem] shadow-sm">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-widest text-rose-400 font-bold mb-1">
                Peace of Mind
              </p>
              <div className="flex items-center gap-2 justify-end">
                <span
                   className={cn(
                    "text-lg font-serif-display",
                    isOverBudget ? "text-rose-500" : "text-emerald-600",
                  )}
                >
                  {isOverBudget ? "Needs Gentle Attention" : "All is Calm"}
                </span>
                <div
                  className={cn(
                    "w-2 h-2 rounded-full",
                    isOverBudget ? "bg-rose-400 animate-pulse" : "bg-emerald-400",
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Our Dream Fund",
              value: totalBudgetAmount,
              icon: Wallet,
              color: "text-slate-800",
              bg: "bg-white/80 border-slate-100",
            },
            {
              label: "The Estimate",
              id: "forecast",
              value: totalForecast,
              icon: Compass,
              color: isOverBudget ? "text-rose-500" : "text-primary",
              bg: isOverBudget ? "bg-rose-50/80 border-rose-100" : "bg-white/80 border-slate-100",
            },
            {
              label: "Shared Progress",
              id: "spent",
              value: totalActual,
              icon: Heart,
              color: "text-emerald-500",
              bg: "bg-white/80 border-slate-100",
            },
            {
              label: "Our Little Cushion",
              id: "cushion",
              value: buffer,
              icon: Coins,
              color: isOverBudget ? "text-rose-600" : "text-emerald-600",
              bg: isOverBudget
                ? "bg-rose-50/90 border-rose-200"
                : "bg-emerald-50/80 border-emerald-100",
            },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-5 rounded-[1.8rem] border border-white/20 shadow-sm backdrop-blur-sm",
                item.bg,
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-1.5 rounded-lg bg-white/50">
                  <item.icon className={cn("w-3.5 h-3.5", item.color)} />
                </div>
                {item.id === "forecast" && (
                  <span className="text-[8px] font-bold text-muted-foreground bg-white/50 px-1.5 py-0.5 rounded-full uppercase">
                    Live
                  </span>
                )}
              </div>
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">
                {item.label}
              </p>
              {item.label === "Our Dream Fund" ? (
                <div className="relative group">
                  {isEditingBudget ? (
                    <input
                      autoFocus
                      type="text"
                      value={newBudget}
                      onChange={(e) => setNewBudget(e.target.value)}
                      onBlur={() => {
                        updateWeddingInfo({ budget: newBudget });
                        setIsEditingBudget(false);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateWeddingInfo({ budget: newBudget });
                          setIsEditingBudget(false);
                        }
                      }}
                      className="text-xl font-serif-display bg-white/50 rounded px-1 w-full border-none focus:ring-0"
                    />
                  ) : (
                    <div 
                      onClick={() => setIsEditingBudget(true)}
                      className="flex items-center gap-2 cursor-pointer group-hover:text-primary transition-colors"
                    >
                      <p className={cn("text-xl font-serif-display", item.color)}>
                        {formatCurrency(item.value)}
                      </p>
                      <PenLine className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </div>
              ) : (
                <p className={cn("text-xl font-serif-display", item.color)}>
                  {formatCurrency(item.value)}
                </p>
              )}
            </motion.div>
          ))}
        </div>

        {/* Insights & Feasibility Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Feasibility Gauge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              // Toggle some detail view or scroll to the most problematic category
              const problematic = budgetCategories.find(c => c.forecast > c.planned * 1.2);
              if (problematic) {
                const element = document.getElementById(`category-${problematic.id}`);
                element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Briefly highlight it?
              }
            }}
            className="lg:col-span-1 bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center shadow-sm relative overflow-hidden cursor-pointer hover:bg-white/50 transition-colors group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
            <div className="relative group-hover:scale-110 transition-transform duration-500">
              <div className="w-32 h-32 rounded-full flex items-center justify-center relative shadow-inner overflow-hidden">
                <svg viewBox="0 0 128 128" className="absolute inset-0 w-full h-full -rotate-90">
                  {/* Background Track */}
                  <circle
                    cx="64"
                    cy="64"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-black/5"
                  />
                  {/* Progress Arc */}
                  <circle
                    cx="64"
                    cy="64"
                    r="50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={314.16}
                    strokeDashoffset={314.16 - (314.16 * visionAlignmentScore) / 100}
                    strokeLinecap="round"
                    className={cn(
                      "transition-all duration-1000 ease-out",
                      visionAlignmentScore > 80 ? "text-emerald-500" : visionAlignmentScore > 50 ? "text-amber-500" : "text-rose-500"
                    )}
                  />
                </svg>
                <div className="text-center relative z-10">
                  <span className="text-3xl font-serif-display block">{Math.round(visionAlignmentScore)}%</span>
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">
                    {weddingInfo.budgetPhase === 'dreaming' ? 'Aligned' : 'Healthy'}
                  </span>
                  <div className="mt-1 flex flex-col items-center">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-slate-400">
                        {memoizedMaturity.lockedCount}/{memoizedMaturity.totalCount}
                      </span>
                      {memoizedMaturity.lockedCount === memoizedMaturity.totalCount ? (
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                      ) : (
                        <Lock className="w-2.5 h-2.5 text-slate-300" />
                      )}
                    </div>
                    <span className="text-[8px] text-slate-400 uppercase tracking-tighter">Settled</span>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-lg font-serif-display mt-6 mb-2">
              {weddingInfo.budgetPhase === 'dreaming' ? 'Vision Alignment' : 'Execution Health'}
            </h3>
            <p className="text-xs text-slate-500 italic px-4 leading-relaxed font-medium">
              {visionAlignmentScore > 80 
                ? "You're doing amazing! Your dreams are perfectly in sync with your heart's fund." 
                : visionAlignmentScore > 50 
                  ? "We're almost there. Just a few small adjustments to keep everything cozy." 
                  : "Let's sit down together and find a path that feels lighter for both of you."}
            </p>
            <div className="mt-4 flex items-center gap-1 text-[9px] font-bold text-primary uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
              See Alignment <ChevronRight className="w-3 h-3" />
            </div>
          </motion.div>

          {/* Smart Insights */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {memoizedInsights.map((insight, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn(
                  "p-6 rounded-[2.2rem] border backdrop-blur-sm flex gap-4 items-start shadow-sm transition-all hover:shadow-md group cursor-default",
                  insight.type === 'warning' ? "bg-rose-50/50 border-rose-100" :
                  insight.type === 'suggestion' ? "bg-amber-50/50 border-amber-100" :
                  insight.type === 'success' ? "bg-emerald-50/50 border-emerald-100" :
                  "bg-sky-50/50 border-sky-100"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm",
                  insight.type === 'warning' ? "bg-rose-100 text-rose-600" :
                  insight.type === 'suggestion' ? "bg-amber-100 text-amber-600" :
                  insight.type === 'success' ? "bg-emerald-100 text-emerald-600" :
                  "bg-sky-100 text-sky-600"
                )}>
                  {insight.type === 'warning' ? <Heart className="w-5 h-5" /> :
                   insight.type === 'suggestion' ? <Lightbulb className="w-5 h-5" /> :
                   insight.type === 'success' ? <ShieldCheck className="w-5 h-5" /> :
                   <History className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-serif-display text-base mb-1">{insight.title}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{insight.message}</p>
                  {insight.action && (
                    <button 
                      onClick={() => {
                        if (insight.action === "Review Priorities") {
                          document.getElementById('budget-categories-list')?.scrollIntoView({ behavior: 'smooth' });
                        } else if (insight.action === "Get Quotes") {
                          const firstLow = budgetCategories.find(c => c.confidence === 'low');
                          if (firstLow) {
                            setSelectedCategory(firstLow);
                            setIsModalOpen(true);
                          }
                        } else if (insight.action === "Refine Luxury") {
                          const firstLuxury = budgetCategories.find(c => c.priority === 'luxury');
                          if (firstLuxury) {
                            setSelectedCategory(firstLuxury);
                            setIsModalOpen(true);
                          }
                        } else if (insight.action === "Track Progress") {
                          useStore.getState().setBudgetPhase('tracking');
                          setShowCelebration(true);
                          setTimeout(() => setShowCelebration(false), 3000);
                        } else {
                          setIsModalOpen(true);
                        }
                      }}
                      className={cn(
                        "text-[10px] font-bold py-2.5 px-4 rounded-xl transition-all border uppercase tracking-widest flex items-center justify-center gap-2 w-full sm:w-auto",
                        insight.type === 'warning' ? "bg-rose-500 text-white border-rose-600 hover:bg-rose-600 shadow-rose-200" :
                        insight.type === 'suggestion' ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600 shadow-amber-200" :
                        insight.type === 'success' ? "bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600 shadow-emerald-200" :
                        "bg-primary text-white border-primary-dark shadow-primary-100"
                      )}
                    >
                      {insight.action} <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Content Area (8/12) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Allocation Overview & Scenario Explorer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-6 shadow-sm overflow-hidden relative"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Compass size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif-display mb-0.5">
                      Where Our Heart Goes
                    </h3>
                    <p className="text-[10px] text-muted-foreground italic max-w-xs">
                      {weddingInfo.budgetPhase === 'dreaming' 
                        ? "A gentle look at how our shared vision is distributed."
                        : "Seeing how each dream is coming to life."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 bg-white/50 p-3 rounded-[1.5rem] border border-white/40">
                  <div className="flex items-center gap-4 px-2">
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">
                        Our Vision Fund
                      </p>
                      <p className="text-lg font-serif-display text-slate-700">
                        {formatCurrency(totalPlanned)}
                      </p>
                    </div>
                    <div className="w-px h-6 bg-black/5" />
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-widest text-primary/60 font-bold mb-0.5">
                        Room for Magic
                      </p>
                      <p className="text-lg font-serif-display text-primary">
                        {formatCurrency(remainingInPot)}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsScenarioModalOpen(true)}
                    className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-5 py-3 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                    Explore Scenarios
                  </button>
                </div>
              </div>

              <div className="h-6 w-full bg-black/5 rounded-2xl overflow-hidden flex shadow-inner mb-6 group/bar relative">
                {budgetCategories.map((cat, i) => (
                  <motion.div
                    key={cat.id}
                    initial={{ width: 0 }}
                    animate={{ width: `${(cat.planned / totalPlanned) * 100}%` }}
                    whileHover={{ 
                      height: "120%",
                      transition: { duration: 0.2 }
                    }}
                    className={cn(
                      "h-full first:rounded-l-2xl last:rounded-r-2xl border-r border-white/20 last:border-r-0 transition-all cursor-pointer relative group/segment",
                      i % 2 === 0
                        ? "bg-primary"
                        : "bg-primary/40",
                    )}
                    onClick={() => {
                      setActiveCategoryId(cat.id);
                      setIsDetailDrawerOpen(true);
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover/segment:opacity-100 transition-opacity bg-white/30 flex items-center justify-center backdrop-blur-[1px]">
                      <span className="text-[10px] font-bold text-white uppercase tracking-tighter drop-shadow-md">
                        {Math.round((cat.planned / totalPlanned) * 100)}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3">
                {budgetCategories.slice(0, 8).map((cat, i) => (
                  <div 
                    key={cat.id} 
                    className="flex items-center gap-2 group/legend cursor-pointer"
                    onClick={() => {
                      setActiveCategoryId(cat.id);
                      setIsDetailDrawerOpen(true);
                    }}
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full transition-transform group-hover/legend:scale-125",
                        i % 2 === 0
                          ? "bg-primary"
                          : "bg-primary/40",
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-600 uppercase tracking-tight group-hover/legend:text-primary transition-colors">
                        {cat.name}
                      </span>
                      <span className="text-[8px] text-muted-foreground font-mono">
                        {Math.round((cat.planned / totalPlanned) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {weddingInfo.budgetPhase === 'dreaming' && (
                <div className="mt-8 pt-6 border-t border-black/5 flex items-center justify-between">
                  <p className="text-[10px] text-slate-400 italic">
                    Feeling good about this distribution? 
                  </p>
                  <button 
                    onClick={() => {
                      const name = prompt("Name this scenario (e.g., 'Intimate Garden', 'Grand Palace')");
                      if (name) useStore.getState().saveBudgetScenario(name);
                    }}
                    className="text-[10px] font-bold text-primary hover:text-primary-dark uppercase tracking-widest flex items-center gap-2 transition-all hover:gap-3"
                  >
                    Save as Variation <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              )}
            </motion.div>

            <div className="bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                  <h3 className="text-xl font-serif-display text-slate-800 mb-1">
                    Our Budget Story
                  </h3>
                  <p className="text-[10px] text-slate-400 italic">
                    {weddingInfo.budgetPhase === 'dreaming' 
                      ? "Shaping the vision for our big day." 
                      : "Keeping our plans in perfect harmony."}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-white/60 backdrop-blur-md border border-slate-100 rounded-2xl p-1 flex items-center shadow-sm">
                    {(weddingInfo.budgetPhase === 'dreaming' 
                      ? ['all', 'core', 'refining', 'delights'] 
                      : ['all', 'review', 'upcoming', 'solid']
                    ).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all",
                          filter === f 
                            ? "bg-primary text-white shadow-md shadow-primary/20" 
                            : "text-slate-400 hover:text-slate-600"
                        )}
                      >
                        {f === 'all' ? 'Everything' : 
                         f === 'core' ? 'Core Vibe' : 
                         f === 'refining' ? 'Refining' : 
                         f === 'delights' ? 'Delights' :
                         f === 'review' ? 'Gentle Review' :
                         f === 'upcoming' ? 'Next Steps' : 'Solid Ground'}
                      </button>
                    ))}
                  </div>

                  <div className="relative group">
                    <button className="bg-white/60 backdrop-blur-md border border-slate-100 p-2.5 rounded-2xl shadow-sm text-slate-500 hover:text-primary transition-all flex items-center gap-2">
                      <RefreshCcw className="w-3.5 h-3.5" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">
                        {sortBy === 'dream' ? 'Largest Dreams' : 
                         sortBy === 'priority' ? "Heart's Priority" :
                         sortBy === 'biggest' ? 'Largest Spend' :
                         sortBy === 'drift' ? 'Budget Drift' : 'Latest Thoughts'}
                      </span>
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 p-1.5">
                      {(weddingInfo.budgetPhase === 'dreaming'
                        ? [
                            { id: 'dream', label: 'Largest Dreams', icon: Compass },
                            { id: 'priority', label: "Heart's Priority", icon: Heart },
                            { id: 'recent', label: 'Latest Thoughts', icon: History },
                          ]
                        : [
                            { id: 'biggest', label: 'Largest Spend', icon: Coins },
                            { id: 'drift', label: 'Budget Drift', icon: TrendingUp },
                            { id: 'recent', label: 'Recent Updates', icon: History },
                          ]
                      ).map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSortBy(s.id as any)}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 transition-colors",
                            sortBy === s.id ? "bg-primary/5 text-primary" : "text-slate-500 hover:bg-slate-50"
                          )}
                        >
                          <s.icon className="w-3 h-3" />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{s.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAndSortedCategories.map((category) => (
                  <div key={category.id} id={`category-${category.id}`} className="group p-4 bg-white/50 rounded-[2rem] border border-white/50 shadow-sm transition-all hover:bg-white/80">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center text-lg",
                            category.name.toLowerCase().includes("venue") ? "bg-teal-50" :
                            category.name.toLowerCase().includes("catering") ? "bg-orange-50" :
                            category.name.toLowerCase().includes("floral") ? "bg-rose-50" :
                            "bg-slate-50",
                          )}
                        >
                          {category.name.toLowerCase().includes("venue") ? "🏰" :
                           category.name.toLowerCase().includes("catering") ? "🍽️" :
                           category.name.toLowerCase().includes("floral") ? "🌸" :
                           "✨"}
                        </div>
                        <div>
                          <h4 className="font-serif-display text-base text-slate-800 leading-none mb-1">
                            {category.name}
                          </h4>
                          <div className="flex items-center gap-1.5">
                            {weddingInfo.budgetPhase === 'dreaming' ? (
                              <>
                                <span className={cn(
                                  "text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full",
                                  category.priority === 'must_have' ? "bg-teal-50 text-teal-600 border border-teal-100" :
                                  category.priority === 'nice_to_have' ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                                  "bg-slate-50 text-slate-400 border border-slate-100"
                                )}>
                                  {category.priority?.replace('_', ' ') || 'Planning'}
                                </span>
                                <span className={cn(
                                  "text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full",
                                  category.confidence === 'high' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                  category.confidence === 'medium' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                  "bg-rose-50 text-rose-600 border border-rose-100"
                                )}>
                                  {category.confidence} Confidence
                                </span>
                              </>
                            ) : (
                              <>
                                <span className={cn(
                                  "text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full",
                                  category.isLocked ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                                )}>
                                  {category.isLocked ? "Solidified" : "Still Fluid"}
                                </span>
                                {category.forecast > category.planned && (
                                  <span className="text-[7px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                                    Refining
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono font-bold text-slate-700">
                          {formatCurrency(weddingInfo.budgetPhase === 'dreaming' ? category.planned : category.actual)}
                        </p>
                        <p className="text-[8px] text-slate-400 uppercase font-bold tracking-tighter">
                          {weddingInfo.budgetPhase === 'dreaming' ? "Target" : "Paid So Far"}
                        </p>
                      </div>
                    </div>

                    {/* Adaptive Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-bold uppercase tracking-tighter text-slate-400">
                        <span>{weddingInfo.budgetPhase === 'dreaming' ? "Our Vision" : "Payment Progress"}</span>
                        <span>{weddingInfo.budgetPhase === 'dreaming' ? "Allocation" : `${Math.round((category.actual / (category.forecast || 1)) * 100)}%`}</span>
                      </div>
                      <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden flex">
                        {weddingInfo.budgetPhase === 'dreaming' ? (
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(category.planned / (totalPlanned || 1)) * 100}%` }}
                            className="h-full bg-primary"
                          />
                        ) : (
                          <>
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(category.actual / (category.forecast || 1)) * 100}%` }}
                              className="h-full bg-emerald-500"
                            />
                            {category.forecast > category.actual && (
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${((category.forecast - category.actual) / (category.forecast || 1)) * 100}%` }}
                                className="h-full bg-slate-200"
                              />
                            )}
                          </>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center text-[9px] pt-1">
                         {weddingInfo.budgetPhase === 'tracking' ? (
                           <span className="text-slate-400 italic">
                            {category.actual >= category.forecast ? "Fully Settled ✨" : `${formatCurrency(category.forecast - category.actual)} to go`}
                           </span>
                         ) : (
                           <span className="text-slate-400 italic">
                             Ideal: {formatCurrency(getSuggestedBudget(category.name).min)} - {formatCurrency(getSuggestedBudget(category.name).max)}
                           </span>
                         )}
                         
                         <button 
                            onClick={() => {
                              setActiveCategoryId(category.id);
                              setIsDetailDrawerOpen(true);
                            }}
                            className="text-primary hover:text-primary/70 font-bold uppercase flex items-center gap-0.5"
                          >
                            Details <ChevronRight className="w-3 h-3" />
                          </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Area (4/12) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Planning Stability */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-6 shadow-sm overflow-hidden relative group"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif-display flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-500" />
                  Our Plan's Roots
                </h3>
                <span className="text-xs font-bold font-mono text-emerald-600">{memoizedMaturity.percentage}%</span>
              </div>
              <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden mb-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${memoizedMaturity.percentage}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 italic font-medium">
                <p>{memoizedMaturity.percentage > 70 ? "Feeling steady and sure!" : "Growing more certain every day..."}</p>
                <button className="font-bold text-primary uppercase tracking-tighter">View Roots</button>
              </div>
            </motion.div>

            {/* Keeping an Eye Out (Watchouts) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-rose-50/50 backdrop-blur-md border border-rose-100 rounded-[2.5rem] p-6 shadow-sm overflow-hidden relative"
            >
              <h3 className="text-lg font-serif-display mb-4 flex items-center gap-2 text-rose-800">
                <Heart className="w-4 h-4 text-rose-500" />
                Gentle Reminders
              </h3>
              <div className="space-y-2">
                {budgetWatchouts.length > 0 ? (
                  budgetWatchouts.slice(0, 2).map((watchout) => (
                    <div key={watchout.id} className="p-3 bg-white/60 rounded-xl border border-rose-100">
                      <h4 className="text-[10px] font-bold text-rose-700">{watchout.title}</h4>
                      <p className="text-[10px] text-rose-600/80 line-clamp-1">{watchout.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-100 text-center py-4">
                    <p className="text-[10px] text-emerald-600 font-medium">Everything looks smooth right now! ✨</p>
                  </div>
                )}
                {budgetWatchouts.length > 2 && (
                  <button className="w-full text-[9px] font-bold text-rose-400 uppercase tracking-widest mt-1">
                    + {budgetWatchouts.length - 2} More to watch
                  </button>
                )}
              </div>
            </motion.div>

            {/* Our Spending Journey (Recent Activity) */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-6 shadow-sm"
            >
              <h3 className="text-lg font-serif-display mb-6 flex items-center gap-2">
                <History className="w-4 h-4 text-primary" />
                Our Journey So Far
              </h3>
              <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-1 before:w-px before:bg-black/5">
                {budgetUpdates.length > 0 ? (
                  budgetUpdates.slice(0, 3).map((update) => (
                    <div
                      key={update.id}
                      className="relative pl-5"
                    >
                      <div className="absolute left-0 top-1 w-2 h-2 rounded-full bg-primary ring-2 ring-white" />
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">
                          {update.date}
                        </p>
                        <span
                          className={cn(
                            "text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase",
                            update.type === "increase"
                              ? "bg-red-50 text-red-600"
                              : update.type === "reallocation"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-green-50 text-green-600",
                          )}
                        >
                          {update.type === "increase"
                            ? "Addition"
                            : update.type === "reallocation"
                              ? "Shared"
                              : "Saving"}
                        </span>
                      </div>
                      <p className="text-xs font-medium leading-tight">
                        {update.categoryName}
                      </p>
                      <p className={cn(
                          "text-[10px] font-mono font-bold mt-1",
                          update.type === "increase"
                            ? "text-red-500"
                            : "text-green-600",
                        )}
                      >
                        {update.type === "increase" ? "+" : "-"}
                        {formatCurrency(Math.abs(update.amount))}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-[10px] text-slate-400 italic text-center py-4 pl-5">Our journey is just beginning...</p>
                )}
              </div>
            </motion.div>

            {/* Heartfelt To-Dos & Big Moments Combined */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/40 backdrop-blur-md border border-white/20 rounded-[2.5rem] p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-serif-display flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  What's Next for Us
                </h3>
                <Target className="w-4 h-4 text-primary/30" />
              </div>
              <div className="space-y-4">
                {/* Actionable Next Steps */}
                <div className="space-y-2">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">Immediate Steps</p>
                  {memoizedActionables.slice(0, 2).map((action) => (
                    <motion.div
                      key={action.id}
                      onClick={() => {
                        const cat = budgetCategories.find(c => c.name === action.category);
                        if (cat) {
                          setActiveCategoryId(cat.id);
                          setIsDetailDrawerOpen(true);
                        }
                      }}
                      className="p-3 rounded-xl border bg-white/50 border-slate-100 hover:border-orange-200 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase">{action.category}</span>
                        {action.potentialSaving && <span className="text-[9px] font-bold text-emerald-600">Save {formatCurrency(action.potentialSaving)}</span>}
                      </div>
                      <h4 className="text-[11px] font-bold text-slate-700 group-hover:text-orange-600 transition-colors">{action.title}</h4>
                    </motion.div>
                  ))}
                </div>

                {/* Big Moments Ahead */}
                <div className="pt-4 border-t border-black/5 space-y-2">
                  <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-2">Coming Milestones</p>
                  {tasks
                    .filter(t => t.estimatedCost && t.estimatedCost > 0 && t.status !== "done")
                    .slice(0, 3)
                    .map(task => (
                      <div 
                        key={task.id} 
                        onClick={() => {
                          const cat = budgetCategories.find(c => c.id === task.budgetCategoryId);
                          if (cat) {
                            setActiveCategoryId(cat.id);
                            setIsDetailDrawerOpen(true);
                          }
                        }}
                        className="flex items-center justify-between p-2 rounded-xl hover:bg-white/50 transition-colors cursor-pointer group"
                      >
                        <div className="flex flex-col">
                          <span className="text-[11px] font-medium text-slate-700 line-clamp-1 group-hover:text-primary transition-colors">{task.title}</span>
                          <span className="text-[9px] text-slate-400 uppercase font-bold">{task.category}</span>
                        </div>
                        <span className="text-[10px] font-bold font-mono text-slate-500">{formatCurrency(task.estimatedCost!)}</span>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>

      <BudgetRefinementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />

      <BudgetDetailDrawer 
        categoryId={activeCategoryId}
        onClose={() => {
          setIsDetailDrawerOpen(false);
          setActiveCategoryId(null);
        }}
      />

      {/* Scenario Explorer Modal */}
      <AnimatePresence>
        {isScenarioModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsScenarioModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[2.5rem] border border-white/20 bg-white p-8 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-serif-display text-slate-800 flex items-center gap-3">
                    <Compass className="h-6 w-6 text-primary" />
                    Our Budget Visions
                  </h2>
                  <p className="text-slate-500 text-xs mt-1 italic">
                    Explore different paths for our big day and find the one that resonates most.
                  </p>
                </div>
                <button
                  onClick={() => setIsScenarioModalOpen(false)}
                  className="rounded-full bg-slate-50 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <motion.div 
                variants={{
                  show: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar"
              >
                {budgetScenarios.map((scenario) => (
                  <motion.div
                    key={scenario.id}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "p-5 rounded-3xl border transition-all cursor-pointer group relative",
                      weddingInfo.activeScenarioId === scenario.id
                        ? "bg-primary/5 border-primary shadow-md"
                        : "bg-slate-50 border-slate-100 hover:border-primary/30 hover:bg-white"
                    )}
                    onClick={() => {
                      switchBudgetScenario(scenario.id);
                      setIsScenarioModalOpen(false);
                    }}
                  >
                    {weddingInfo.activeScenarioId === scenario.id && (
                      <div className="absolute top-4 right-4">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <h4 className="font-serif-display text-lg mb-1 pr-6">{scenario.name}</h4>
                    <p className="text-[10px] text-slate-500 mb-4 line-clamp-2">{scenario.description || "A unique vision for our celebration."}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-black/5">
                      <span className="text-sm font-bold font-mono">{formatCurrency(scenario.totalBudget)}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Are you sure you want to delete this vision?")) {
                            deleteBudgetScenario(scenario.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 }
                  }}
                  onClick={() => {
                    const name = prompt("Name this new vision (e.g., 'Winter Wonderland')");
                    if (name) {
                      saveBudgetScenario(name);
                      setShowCelebration(true);
                      setTimeout(() => setShowCelebration(false), 3000);
                    }
                  }}
                  className="p-5 rounded-3xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center hover:border-primary/50 hover:bg-primary/5 transition-all group cursor-pointer relative overflow-hidden"
                >
                  <AnimatePresence>
                    {showCelebration && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1.5 }}
                        exit={{ opacity: 0, scale: 2 }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                      >
                        {[...Array(6)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: 0, y: 0 }}
                            animate={{ 
                              x: (Math.random() - 0.5) * 100,
                              y: (Math.random() - 0.5) * 100,
                              opacity: 0
                            }}
                            className="absolute"
                          >
                            <Heart className="w-4 h-4 text-primary fill-primary" />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                    <Palette className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs font-bold text-slate-500 group-hover:text-primary">Create New Variation</p>
                  <p className="text-[9px] text-slate-400 mt-1 italic">Based on current numbers</p>
                </motion.div>
              </motion.div>

              <div className="mt-10 flex gap-3">
                <button
                  onClick={() => setIsScenarioModalOpen(false)}
                  className="flex-1 rounded-2xl bg-slate-50 py-4 text-xs font-bold uppercase tracking-widest text-slate-600 transition-all hover:bg-slate-100"
                >
                  Close Explorer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
