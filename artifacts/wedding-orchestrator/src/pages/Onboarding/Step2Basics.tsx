import { Heart, Calendar, MapPin, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const guestBands = ["Under 100", "100–200", "200–300", "300–600", "600–1000", "1000+"];
const budgetBands = ["Under ₹10L", "₹10L–₹25L", "₹25L–₹50L", "₹50L+"];

interface Step2BasicsProps {
  data: {
    partner1: string;
    partner2: string;
    weddingDate: string;
    city: string;
    guestBand: string;
    budgetBand: string;
  };
  updateData: (updates: Partial<Step2BasicsProps['data']>) => void;
}

export function Step2Basics({ data, updateData }: Step2BasicsProps) {
  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground mb-4 font-medium">
        Where and when? We'll use these to suggest local vendors and check availability.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Heart size={10} className="text-primary" />
            Partner 1
          </label>
          <input
            type="text"
            placeholder="Name"
            value={data.partner1}
            onChange={(e) => updateData({ partner1: e.target.value })}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="input-partner1"
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Heart size={10} className="text-primary" />
            Partner 2
          </label>
          <input
            type="text"
            placeholder="Name"
            value={data.partner2}
            onChange={(e) => updateData({ partner2: e.target.value })}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
            data-testid="input-partner2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5 transition-colors">
          <Calendar size={13} className="inline mr-1.5 -mt-0.5" />
          Wedding date
        </label>
        <input
          type="date"
          value={data.weddingDate}
          onChange={(e) => updateData({ weddingDate: e.target.value })}
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="input-wedding-date"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1.5">
          <MapPin size={13} className="inline mr-1.5 -mt-0.5" />
          City
        </label>
        <input
          type="text"
          placeholder="e.g. Mumbai, Jaipur, Delhi…"
          value={data.city}
          onChange={(e) => updateData({ city: e.target.value })}
          className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/30"
          data-testid="input-city"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <Users size={13} className="inline mr-1.5 -mt-0.5" />
          Expected guests
        </label>
        <div className="grid grid-cols-2 gap-2">
          {guestBands.map((band) => (
            <button
              key={band}
              onClick={() => updateData({ guestBand: band })}
              className={cn(
                "px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left",
                data.guestBand === band
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              )}
              data-testid={`chip-guest-${band.replace(/[^a-z0-9]/gi, "").toLowerCase()}`}
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <Wallet size={13} className="inline mr-1.5 -mt-0.5" />
          Budget range
        </label>
        <div className="grid grid-cols-2 gap-2">
          {budgetBands.map((band) => (
            <button
              key={band}
              onClick={() => updateData({ budgetBand: band })}
              className={cn(
                "px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left",
                data.budgetBand === band
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              )}
              data-testid={`chip-budget-${band.replace(/[^a-z0-9]/gi, "").toLowerCase()}`}
            >
              {band}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
