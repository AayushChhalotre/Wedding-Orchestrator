import { AlertTriangle, X, Zap, TrendingDown, Layers, Compass, Flame, Check, Loader2, RefreshCcw } from "lucide-react";
import { type Risk } from "@/lib/models/schema";
import { useStore } from "@/store/useStore";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RiskPanelProps {
  compact?: boolean;
  onRiskClick?: (risk: Risk) => void;
}

const getRiskIcon = (type: string, size: number, className?: string) => {
  switch (type) {
    case "burnout": return <Zap size={size} className={className} />;
    case "budget": return <TrendingDown size={size} className={className} />;
    case "density": return <Layers size={size} className={className} />;
    default: return <AlertTriangle size={size} className={className} />;
  }
};

// Extracted for shared use
export const getHandleRiskClick = (setLocation: (p: string) => void) => (risk: Risk) => {
  if (risk.type === 'density') {
    setLocation('/timeline');
  } else if (risk.type === 'budget') {
    setLocation('/budget');
  } else if (risk.type === 'burnout') {
    setLocation('/stakeholders');
  } else {
    setLocation('/risks');
  }
};

export function RiskPanel({ compact = false, onRiskClick }: RiskPanelProps) {
  const risks = useStore((state) => state.risks);
  const [, setLocation] = useLocation();
  const handleRiskClick = getHandleRiskClick(setLocation);
  
  if (compact) {
    const highRisks = risks.filter(r => r.severity === 'high');
    
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} className="text-amber-500" />
            <h3 className="text-sm font-bold text-foreground tracking-tight">Risk Watch</h3>
          </div>
          {highRisks.length > 0 && (
            <span className="text-[9px] font-black uppercase tracking-widest text-destructive animate-pulse">
              {highRisks.length} Action{highRisks.length > 1 ? 's' : ''} Needed
            </span>
          )}
        </div>
        
        {highRisks.length > 0 && (
          <div className="mb-4 p-3 bg-destructive/5 border border-destructive/10 rounded-xl">
             <p className="text-[10px] font-bold text-destructive uppercase tracking-widest flex items-center gap-1.5 mb-1">
               <Zap size={10} />
               Heads Up
             </p>
             <p className="text-[10px] text-muted-foreground leading-snug">
               Your planning pace or budget needs rebalancing. Check the alerts below.
             </p>
          </div>
        )}

        <div className="space-y-2">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className={cn(
                "p-3 rounded-lg border text-sm transition-all hover:shadow-sm cursor-pointer",
                risk.severity === "high"
                  ? "border-destructive/20 bg-destructive/5 hover:border-destructive/30"
                  : "border-border bg-muted/30 hover:border-primary/20"
              )}
              onClick={() => onRiskClick ? onRiskClick(risk) : handleRiskClick(risk)}
            >
              <div className="flex items-start gap-2">
                <div className={cn(
                  "p-1 rounded-md shrink-0 mt-0.5",
                  risk.type === "burnout" ? "bg-orange-100 text-orange-600" :
                  risk.type === "budget" ? "bg-rose-100 text-rose-600" :
                  risk.type === "density" ? "bg-purple-100 text-purple-600" :
                  "bg-amber-100 text-amber-600"
                )}>
                  {getRiskIcon(risk.type || "general", 12)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground text-[11px] uppercase tracking-tight leading-none mb-1">{risk.title}</p>
                  <p className="text-muted-foreground text-[10px] leading-relaxed line-clamp-2">{risk.explanation}</p>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-primary text-[10px] hover:underline font-bold uppercase tracking-wider">
                      {risk.cta}
                    </span>
                    {(risk.assistanceResources?.length || 0) > 0 && (
                      <div className="flex items-center gap-1">
                        <Zap size={10} className="text-primary animate-pulse" />
                        <span className="text-[8px] font-black text-primary uppercase">Ready</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {risks.length === 0 && (
            <div className="text-center py-4 border border-dashed border-border rounded-lg">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">No risks detected</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {risks.map((risk) => (
        <RiskCard 
          key={risk.id} 
          risk={risk} 
          onClick={() => onRiskClick ? onRiskClick(risk) : handleRiskClick(risk)} 
        />
      ))}
    </div>
  );
}

interface RiskModalProps {
  risk: Risk;
  onClose: () => void;
}

export function RiskModal({ risk, onClose }: RiskModalProps) {
  const [, setLocation] = useLocation();
  const handleRiskClick = getHandleRiskClick(setLocation);
  const getAIAssistance = useStore(state => state.getAIAssistance);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleGetAIAdvice = async () => {
    setLoadingAI(true);
    await getAIAssistance(risk.id);
    setLoadingAI(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end lg:items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-card border border-border rounded-[2rem] shadow-2xl w-full max-w-lg p-8 relative noise-bg my-auto"
          onClick={(e) => e.stopPropagation()}
          data-testid="risk-modal"
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="risk-modal-close"
          >
            <X size={18} />
          </button>

          <div className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm",
            risk.severity === "high" ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-600"
          )}>
            {getRiskIcon(risk.type, 24)}
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-serif-display text-foreground mb-3 leading-tight">{risk.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{risk.explanation}</p>
          </div>

          <div className={cn(
            "p-4 rounded-2xl text-sm mb-8 border",
            risk.severity === "high" 
              ? "bg-destructive/5 text-destructive border-destructive/10" 
              : "bg-amber-50/50 text-amber-800 border-amber-100"
          )}>
            <div className="flex gap-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <p><strong>Immediate Impact: </strong>{risk.impact}</p>
            </div>
          </div>

          {/* AI Assistance Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground/40 flex items-center gap-2">
                <Compass size={12} className="text-primary" />
                Actionable Advice
              </h3>
              
              <button 
                onClick={handleGetAIAdvice}
                disabled={loadingAI}
                className={cn(
                  "text-[10px] font-bold uppercase tracking-widest text-primary hover:underline flex items-center gap-1.5 transition-all",
                  loadingAI && "opacity-50 cursor-not-allowed"
                )}
              >
                {loadingAI ? <Loader2 size={10} className="animate-spin" /> : <RefreshCcw size={10} />}
                {loadingAI ? "Analyzing..." : "Deep Advice"}
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {/* Render structured resources first if they exist */}
                {risk.assistanceResources?.map((item, idx) => (
                  <motion.div 
                    key={`${item.text}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 group hover:border-primary/30 transition-all shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        <Zap size={12} strokeWidth={3} />
                      </div>
                      <span className="text-xs font-semibold text-foreground/90 leading-relaxed">{item.text}</span>
                    </div>
                    {item.link && (
                      <button 
                        onClick={() => {
                          setLocation(item.link!);
                          onClose();
                        }}
                        className="self-end px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary transition-all active:scale-95"
                      >
                        {item.linkText || "Take Action"}
                      </button>
                    )}
                  </motion.div>
                ))}

                {/* Render text suggestions as fallback/extra */}
                {risk.suggestedAssistance?.map((item, idx) => (
                   <motion.div 
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Check size={10} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-medium text-foreground/80">{item}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {(!risk.suggestedAssistance || risk.suggestedAssistance.length === 0) && (!risk.assistanceResources || risk.assistanceResources.length === 0) && !loadingAI && (
                <button 
                  onClick={handleGetAIAdvice}
                  className="w-full py-6 border border-dashed border-border rounded-2xl text-xs text-muted-foreground hover:border-primary/30 hover:text-primary transition-all flex flex-col items-center gap-3 bg-muted/10"
                >
                  <Compass size={20} className="opacity-50 animate-pulse" />
                  <div className="text-center">
                    <p className="font-bold text-foreground">Unlock Deep Insights</p>
                    <p className="text-[10px] opacity-70">Get personalized, actionable steps for this risk</p>
                  </div>
                </button>
              )}

              {loadingAI && (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 w-full bg-muted/20 animate-pulse rounded-2xl" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 px-6 py-4 bg-foreground text-background text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-primary transition-all shadow-lg shadow-black/10 active:scale-[0.98] border border-white/10"
              data-testid="risk-modal-cta"
              onClick={() => {
                handleRiskClick(risk);
                onClose();
              }}
            >
              {risk.cta}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 bg-muted text-foreground text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-muted/80 transition-all border border-border/50"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function RiskCard({ risk, onClick }: { risk: Risk; onClick?: () => void }) {
  const icon = getRiskIcon(risk.type || "general", 18, risk.severity === "high" ? "text-destructive" : "text-primary");

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className={cn(
        "p-6 rounded-[2rem] border transition-all cursor-pointer noise-bg",
        risk.severity === "high"
          ? "border-destructive/30 bg-destructive/5"
          : "border-border bg-card shadow-sm"
      )}
      onClick={onClick}
      data-testid={`risk-card-${risk.id}`}
    >
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 shadow-sm",
          risk.type === "burnout" ? "bg-orange-50 text-orange-600" :
          risk.type === "budget" ? "bg-rose-50 text-rose-600" :
          risk.type === "density" ? "bg-purple-50 text-purple-600" :
          "bg-muted text-muted-foreground"
        )}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h3 className="font-bold text-foreground text-lg tracking-tight truncate">{risk.title}</h3>
            <span className={cn(
              "text-[9px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest border",
              risk.severity === "high" ? "bg-destructive/10 border-destructive/20 text-destructive" : "bg-muted border-border text-muted-foreground"
            )}>
              {risk.type || "General"}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{risk.explanation}</p>
          
          <div className="bg-muted/30 p-3 rounded-2xl mb-4 border border-border/50">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground uppercase font-bold tracking-tighter mr-2">Impact:</strong> {risk.impact}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="px-4 py-2 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">
              {risk.cta}
            </span>
            
            {risk.suggestedAssistance && risk.suggestedAssistance.length > 0 && (
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-widest">
                <Flame size={12} className="animate-pulse" />
                {risk.suggestedAssistance.length} Tips
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
