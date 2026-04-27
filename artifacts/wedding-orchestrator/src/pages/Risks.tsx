import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { RiskPanel, RiskModal } from "@/components/RiskPanel";
import { type Risk } from "@/data/mockData";
import { useStore } from "@/store/useStore";
import { motion } from "framer-motion";

export default function Risks() {
  const risks = useStore(state => state.risks);
  const [activeRisk, setActiveRisk] = useState<Risk | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Header */}
        <motion.div 
          initial={mounted ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-serif-display text-serif-gradient leading-tight">
            Risk Alerts
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">
            {risks.filter((r) => r.severity === "high").length} high-priority risks need your attention.
          </p>
        </motion.div>

        {/* Risk cards */}
        <RiskPanel onRiskClick={(risk) => setActiveRisk(risk)} />

        {/* Info box */}
        <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
          <p className="text-sm text-muted-foreground">
            Risks are automatically detected based on upcoming deadlines, pending stakeholder
            responses, and blocked milestones. Click any risk to see recommended actions.
          </p>
        </div>

        {/* Example: click to open modal */}
        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-3">See an example risk alert modal:</p>
          <div className="flex flex-wrap gap-2">
            {risks.map((risk) => (
              <button
                key={risk.id}
                onClick={() => setActiveRisk(risk)}
                className="px-3 py-1.5 text-xs bg-card border border-border rounded-lg text-foreground hover:border-primary/40 transition-colors"
                data-testid={`btn-open-risk-${risk.id}`}
              >
                Open: {risk.title.substring(0, 30)}…
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeRisk && (
        <RiskModal risk={activeRisk} onClose={() => setActiveRisk(null)} />
      )}
    </Layout>
  );
}
