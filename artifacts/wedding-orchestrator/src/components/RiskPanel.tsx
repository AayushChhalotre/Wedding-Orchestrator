import { AlertTriangle, X } from "lucide-react";
import { risks, type Risk } from "@/data/mockData";
import { cn } from "@/lib/utils";

interface RiskPanelProps {
  compact?: boolean;
}

export function RiskPanel({ compact = false }: RiskPanelProps) {
  if (compact) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={14} className="text-amber-500" />
          <h3 className="text-sm font-medium text-foreground">Risks we're watching</h3>
        </div>
        <div className="space-y-2">
          {risks.slice(0, 3).map((risk) => (
            <div
              key={risk.id}
              className={cn(
                "p-3 rounded-lg border text-sm",
                risk.severity === "high"
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-amber-200 bg-amber-50/50"
              )}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle
                  size={13}
                  className={cn("mt-0.5 shrink-0", risk.severity === "high" ? "text-destructive" : "text-amber-500")}
                />
                <div>
                  <p className="font-medium text-foreground text-xs leading-snug">{risk.title}</p>
                  <p className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{risk.explanation}</p>
                  <button className="text-primary text-xs mt-1.5 hover:underline font-medium">
                    {risk.cta} →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {risks.map((risk) => (
        <RiskCard key={risk.id} risk={risk} />
      ))}
    </div>
  );
}

interface RiskModalProps {
  risk: Risk;
  onClose: () => void;
}

export function RiskModal({ risk, onClose }: RiskModalProps) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 flex items-end lg:items-center justify-center p-4" onClick={onClose}>
        <div
          className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 relative"
          onClick={(e) => e.stopPropagation()}
          data-testid="risk-modal"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            data-testid="risk-modal-close"
          >
            <X size={16} />
          </button>

          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center mb-4",
            risk.severity === "high" ? "bg-destructive/10" : "bg-amber-100"
          )}>
            <AlertTriangle
              size={20}
              className={risk.severity === "high" ? "text-destructive" : "text-amber-600"}
            />
          </div>

          <h2 className="text-lg font-semibold text-foreground mb-2">{risk.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{risk.explanation}</p>

          <div className={cn(
            "p-3 rounded-lg text-sm mb-5",
            risk.severity === "high" ? "bg-destructive/5 text-destructive" : "bg-amber-50 text-amber-700"
          )}>
            <strong>Impact: </strong>{risk.impact}
          </div>

          <button
            className="w-full px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:opacity-90 transition-opacity"
            data-testid="risk-modal-cta"
          >
            {risk.cta}
          </button>
        </div>
      </div>
    </>
  );
}

function RiskCard({ risk }: { risk: Risk }) {
  return (
    <div
      className={cn(
        "p-5 rounded-xl border",
        risk.severity === "high"
          ? "border-destructive/30 bg-destructive/5"
          : "border-amber-200 bg-amber-50/40"
      )}
      data-testid={`risk-card-${risk.id}`}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5",
          risk.severity === "high" ? "bg-destructive/10" : "bg-amber-100"
        )}>
          <AlertTriangle
            size={15}
            className={risk.severity === "high" ? "text-destructive" : "text-amber-600"}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground text-sm">{risk.title}</h3>
            <span className={cn(
              "text-[10px] px-1.5 py-0.5 rounded-full font-medium uppercase tracking-wide",
              risk.severity === "high" ? "bg-destructive/10 text-destructive" : "bg-amber-100 text-amber-700"
            )}>
              {risk.severity}
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">{risk.explanation}</p>
          <p className="text-xs text-muted-foreground mb-3">
            <strong>Impact:</strong> {risk.impact}
          </p>
          <button className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-md hover:opacity-90 transition-opacity">
            {risk.cta}
          </button>
        </div>
      </div>
    </div>
  );
}
