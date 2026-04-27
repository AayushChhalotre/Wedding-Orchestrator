import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Palette, CheckCircle2, ChevronRight, Calendar, ArrowRight, History } from "lucide-react";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  
  const weddingInfo = useStore(state => state.weddingInfo);
  const phases = useStore(state => state.phases);

  useEffect(() => {
    let isMounted = true;
    
    const interval = setInterval(() => {
      if (!isMounted) return;
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (isMounted) setDone(true);
          }, 800);
          return 100;
        }
        return p + 1.5;
      });
    }, 40);

    const stepInterval = setInterval(() => {
      if (!isMounted) return;
      setCurrentStep((s) => Math.min(s + 1, loadingSteps.length - 1));
    }, 2000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, []);

  // Handle auto-redirect
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (done && redirectCountdown > 0) {
      timer = setInterval(() => {
        setRedirectCountdown(c => c - 1);
      }, 1000);
    } else if (done && redirectCountdown === 0) {
      setLocation("/dashboard");
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [done, redirectCountdown, setLocation]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.05, 
              filter: "blur(10px)",
              transition: { duration: 0.6, ease: [0.32, 0, 0.67, 0] } 
            }}
            className="max-w-md w-full text-center relative z-10"
          >
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 rounded-[2rem] bg-white/40 backdrop-blur-md flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-primary/10 border border-white/50"
            >
              <Palette size={40} className="text-primary animate-pulse" />
            </motion.div>

            <h2 className="text-4xl font-serif-display text-serif-gradient mb-4 tracking-tight">
              Orchestrating your moments…
            </h2>
            <p className="text-muted-foreground text-base mb-14 font-medium italic">
              We're weaving your traditions into a perfectly timed roadmap.
            </p>

            {/* Progress bar container */}
            <div className="relative w-full h-1.5 bg-muted/60 rounded-full mb-12 overflow-hidden border border-black/[0.02]">
              <motion.div
                className="absolute top-0 left-0 h-full bg-primary rounded-full shadow-[0_0_12px_rgba(var(--primary),0.4)]"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ type: "spring", stiffness: 40, damping: 20 }}
              />
            </div>

            {/* Loading steps */}
            <div className="space-y-6 text-left max-w-sm mx-auto pl-4">
              {loadingSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ 
                    opacity: i <= currentStep ? 1 : 0.2,
                    x: i <= currentStep ? 0 : -10 
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex items-center gap-5 text-sm"
                >
                  <div className={cn(
                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-700",
                    i < currentStep
                      ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                      : i === currentStep
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110"
                      : "bg-muted/60"
                  )}>
                    {i < currentStep ? (
                      <CheckCircle2 size={16} strokeWidth={3} />
                    ) : (
                      <div className={cn("w-2 h-2 rounded-full", i === currentStep ? "bg-white animate-pulse" : "bg-muted-foreground/30")} />
                    )}
                  </div>
                  <span className={cn(
                    "transition-all duration-700 tracking-tight",
                    i <= currentStep ? "text-foreground font-semibold" : "text-muted-foreground"
                  )}>
                    {step}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="success"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl w-full text-center relative z-10 py-16"
          >
            {/* Success Hero */}
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-24 h-24 rounded-[2rem] bg-green-500 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-green-500/30 border-4 border-white"
            >
              <CheckCircle2 size={48} className="text-white" />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl lg:text-6xl font-serif-display text-serif-gradient mb-6 tracking-tight"
            >
              Coming together.
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-muted-foreground text-lg max-w-xl mx-auto mb-16 leading-relaxed font-medium italic"
            >
              We've orchestrated your days across {phases?.length || 0} distinct phases, 
              tailored to your vision and tradition.
            </motion.p>

            {/* Phase cards with staggered entrance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 text-left px-6">
              {(phases || []).slice(0, 6).map((phase, i) => (
                <motion.div
                  key={phase?.id || i}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1, type: "spring", stiffness: 100, damping: 15 }}
                  className="bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl p-7 shadow-sm hover:shadow-xl hover:bg-white hover:-translate-y-2 transition-all duration-500 group"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
                      <Calendar size={18} className="transition-colors" />
                    </div>
                    {phase?.atRisk > 0 && (
                      <span className="text-[9px] px-3 py-1 rounded-full bg-red-50 text-red-600 font-bold border border-red-100 uppercase tracking-widest">
                        {phase.atRisk} at risk
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{phase?.name || "Phase"}</h3>
                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                      {phase?.dateRange || "TBD"}
                    </p>
                    <p className="text-xs text-muted-foreground font-semibold flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                      {phase?.taskCount || 0} priority tasks
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTAs and Auto-redirect */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col items-center gap-8"
            >
              <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
                <button
                  onClick={() => setLocation("/dashboard")}
                  className="px-10 py-4.5 bg-foreground text-background text-sm font-bold rounded-2xl hover:bg-primary transition-all active:scale-95 shadow-2xl shadow-foreground/10 flex items-center justify-center gap-3 group"
                >
                  <History size={18} className="group-hover:rotate-12 transition-transform" />
                  Open Dashboard
                </button>
                <button
                  onClick={() => setLocation("/timeline")}
                  className="px-10 py-4.5 bg-white/50 backdrop-blur-sm border border-border text-foreground text-sm font-bold rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-3 group"
                >
                  View full timeline
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-bold uppercase tracking-widest bg-white/60 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/50 shadow-sm">
                Redirecting in {redirectCountdown}s
                <ArrowRight size={14} className="animate-bounce-x text-primary/60" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
