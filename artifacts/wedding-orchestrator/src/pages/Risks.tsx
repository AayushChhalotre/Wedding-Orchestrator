import { useState } from "react";
import { Layout } from "@/components/Layout";
import { RiskPanel, RiskModal } from "@/components/RiskPanel";
import { risks, type Risk } from "@/data/mockData";

export default function Risks() {
  const [activeRisk, setActiveRisk] = useState<Risk | null>(null);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl lg:text-2xl font-semibold text-foreground">Risk Alerts</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {risks.filter((r) => r.severity === "high").length} high-priority risks need your attention.
          </p>
        </div>

        {/* Risk cards */}
        <RiskPanel />

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
