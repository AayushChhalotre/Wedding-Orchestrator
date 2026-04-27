import { Check, History } from "lucide-react";
import { cn } from "@/lib/utils";

const alreadyDone = [
  "Venue booked",
  "Caterer booked",
  "Photographer booked",
  "Wedding planner hired",
  "None yet — starting fresh",
];

interface Step4AlreadyDoneProps {
  checkedItems: string[];
  toggleChecked: (item: string) => void;
  selectedEvents: string[];
}

export function Step4AlreadyDone({ checkedItems, toggleChecked, selectedEvents }: Step4AlreadyDoneProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mb-4">
        Are there any items you've already locked in? We'll prioritize what's next.
      </p>

      <div className="space-y-2">
        {alreadyDone.map((item) => (
          <button
            key={item}
            onClick={() => toggleChecked(item)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left",
              checkedItems.includes(item)
                ? "border-primary bg-primary/8 text-primary"
                : "border-border bg-card text-foreground hover:border-primary/30"
            )}
            data-testid={`checkbox-${item.toLowerCase().replace(/[^a-z0-9]/gi, "").substring(0, 15)}`}
          >
            <div className={cn(
              "w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all",
              checkedItems.includes(item)
                ? "border-primary bg-primary"
                : "border-border"
            )}>
              {checkedItems.includes(item) && <Check size={12} className="text-white" />}
            </div>
            {item}
          </button>
        ))}
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-border mt-4">
        <div className="flex items-start gap-2">
          <History size={20} className="text-orange-600 mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            We'll build your roadmap with{" "}
            <span className="text-foreground font-semibold">
              {selectedEvents.length > 0 ? selectedEvents.join(", ") : "your"} events
            </span>
            , accounting for what's already decided.
          </p>
        </div>
      </div>
    </div>
  );
}
