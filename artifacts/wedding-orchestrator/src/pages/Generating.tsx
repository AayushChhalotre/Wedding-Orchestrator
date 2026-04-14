import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { phases, weddingInfo } from "@/data/mockData";

const loadingSteps = [
  "Mapping your wedding milestones across all events…",
  "Calculating dependencies between tasks…",
  "Identifying your highest-priority next steps…",
];

export default function Generating() {
  const [, setLocation] = useLocation();
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setDone(true);
          return 100;
        }
        return p + 2;
      });
    }, 60);

    const stepInterval = setInterval(() => {
      setCurrentStep((s) => Math.min(s + 1, loadingSteps.length - 1));
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  if (done) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          {/* Success icon */}
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-primary" />
          </div>

          <h1 className="font-serif-display text-3xl lg:text-4xl text-foreground mb-3">
            Your wedding timeline is ready.
          </h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
            We've mapped {weddingInfo.daysLeft} days across 5 planning phases, identified your
            top 3 next steps, and flagged 2 at-risk milestones.
          </p>

          {/* Phase cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8 text-left">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="bg-card border border-card-border rounded-xl p-4"
                data-testid={`phase-card-${phase.id}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-foreground">{phase.name}</h3>
                  {phase.atRisk > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                      {phase.atRisk} at risk
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{phase.dateRange}</p>
                <p className="text-xs text-muted-foreground">{phase.taskCount} tasks</p>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setLocation("/dashboard")}
              className="px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              data-testid="btn-see-next-steps"
            >
              <Sparkles size={14} className="inline mr-1.5 -mt-0.5" />
              See your top 3 next steps
            </button>
            <button
              onClick={() => setLocation("/timeline")}
              className="px-6 py-3 bg-card border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors"
              data-testid="btn-view-timeline"
            >
              View full timeline
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Sparkles size={28} className="text-primary animate-pulse" />
        </div>

        <h2 className="font-serif-display text-2xl text-foreground mb-2">
          Designing your wedding timeline…
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          This takes just a moment.
        </p>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-muted rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading steps */}
        <div className="space-y-3 text-left">
          {loadingSteps.map((step, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 text-sm transition-opacity duration-500",
                i <= currentStep ? "opacity-100" : "opacity-30"
              )}
            >
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                i < currentStep
                  ? "bg-primary"
                  : i === currentStep
                  ? "bg-primary/30"
                  : "bg-muted"
              )}>
                {i < currentStep ? (
                  <CheckCircle2 size={12} className="text-white" />
                ) : (
                  <div className={cn("w-2 h-2 rounded-full", i === currentStep ? "bg-primary animate-pulse" : "bg-muted-foreground/30")} />
                )}
              </div>
              <span className={i <= currentStep ? "text-foreground" : "text-muted-foreground"}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
