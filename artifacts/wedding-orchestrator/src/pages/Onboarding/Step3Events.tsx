import { useState } from "react";
import { Heart, History, X } from "lucide-react";
import { cn } from "@/lib/utils";

const weddingTypes = ["Hindu", "Christian", "Muslim", "Sikh", "Other", "Mixed / Multi-faith"];
const rashis = [
  "Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", 
  "Kark (Cancer)", "Simha (Leo)", "Kanya (Virgo)", 
  "Tula (Libra)", "Vrishchik (Scorpio)", "Dhanu (Sagittarius)", 
  "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)"
];
const eventTypes = ["Haldi", "Mehendi", "Sangeet", "Wedding", "Reception"];

interface Step3EventsProps {
  data: {
    weddingType: string;
    partner1Rashi: string;
    partner2Rashi: string;
    selectedEvents: string[];
    multiDay: boolean;
    destination: boolean;
    partner1Name: string;
    partner2Name: string;
  };
  updateData: (updates: Partial<Step3EventsProps['data']>) => void;
}

export function Step3Events({ data, updateData }: Step3EventsProps) {
  const [customEventInput, setCustomEventInput] = useState("");
  const [customEvents, setCustomEvents] = useState<string[]>([]);

  const addCustomEvent = () => {
    if (customEventInput.trim() && customEvents.length < 5) {
      const newEvent = customEventInput.trim();
      if (!data.selectedEvents.includes(newEvent) && !eventTypes.includes(newEvent)) {
        setCustomEvents([...customEvents, newEvent]);
        updateData({ selectedEvents: [...data.selectedEvents, newEvent] });
      }
      setCustomEventInput("");
    }
  };

  const toggleEvent = (event: string) => {
    updateData({
      selectedEvents: data.selectedEvents.includes(event)
        ? data.selectedEvents.filter((e) => e !== event)
        : [...data.selectedEvents, event]
    });
  };

  const removeCustomEvent = (event: string) => {
    setCustomEvents(customEvents.filter(ce => ce !== event));
    updateData({ selectedEvents: data.selectedEvents.filter(se => se !== event) });
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-muted-foreground mb-4 font-medium">
        Every wedding is unique. Tell us about the moments you're planning.
      </p>

      <div>
        <label className="block text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
          <Heart size={13} className="inline mr-2 -mt-0.5 text-primary" />
          Tradition & Vibe
        </label>
        <div className="grid grid-cols-2 gap-2">
          {weddingTypes.map((type) => (
            <button
              key={type}
              onClick={() => updateData({ weddingType: type })}
              className={cn(
                "px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left",
                data.weddingType === type
                  ? "border-primary bg-primary/8 text-primary"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              )}
              data-testid={`chip-type-${type.toLowerCase().replace(/[^a-z0-9]/gi, "")}`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {(data.weddingType === "Hindu" || data.weddingType === "Mixed / Multi-faith") && (
        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <History size={14} className="text-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Vedic Alignment</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">{data.partner1Name || "Partner 1"}'s Rashi</label>
              <select 
                value={data.partner1Rashi}
                onChange={(e) => updateData({ partner1Rashi: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Rashi</option>
                {rashis.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-muted-foreground">{data.partner2Name || "Partner 2"}'s Rashi</label>
              <select 
                value={data.partner2Rashi}
                onChange={(e) => updateData({ partner2Rashi: e.target.value })}
                className="w-full bg-background border border-border rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select Rashi</option>
                {rashis.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed italic">
            We'll use these to suggest auspicious Hindu Muhrat dates for your lock-in window.
          </p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Events (select all that apply)
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {[...eventTypes, ...customEvents].map((event) => (
            <button
              key={event}
              onClick={() => toggleEvent(event)}
              className={cn(
                "px-3 py-1.5 rounded-full border text-sm font-medium transition-all flex items-center gap-1.5",
                data.selectedEvents.includes(event)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-foreground hover:border-primary/40"
              )}
              data-testid={`chip-event-${event.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {event}
              {customEvents.includes(event) && (
                <span 
                  className="w-3.5 h-3.5 rounded-full bg-primary-foreground/20 flex items-center justify-center hover:bg-primary-foreground/40"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomEvent(event);
                  }}
                >
                  <X size={10} />
                </span>
              )}
            </button>
          ))}
        </div>

        {customEvents.length < 5 && (
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add your own event (e.g. Cocktails)"
              value={customEventInput}
              onChange={(e) => setCustomEventInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomEvent()}
              className="flex-1 border border-border rounded-lg px-3 py-2 text-xs bg-card focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <button
              onClick={addCustomEvent}
              disabled={!customEventInput.trim()}
              className="px-3 py-2 bg-muted text-foreground text-xs font-medium rounded-lg hover:bg-border transition-colors disabled:opacity-50"
            >
              Add
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3 pt-1">
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => updateData({ multiDay: !data.multiDay })}
            className={cn(
              "w-10 h-6 rounded-full transition-colors relative cursor-pointer",
              data.multiDay ? "bg-primary" : "bg-border"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
              data.multiDay ? "translate-x-5" : "translate-x-1"
            )} />
          </div>
          <span className="text-sm font-medium text-foreground">Multi-day celebration</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <div
            onClick={() => updateData({ destination: !data.destination })}
            className={cn(
              "w-10 h-6 rounded-full transition-colors relative cursor-pointer",
              data.destination ? "bg-primary" : "bg-border"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
              data.destination ? "translate-x-5" : "translate-x-1"
            )} />
          </div>
          <span className="text-sm font-medium text-foreground">Destination wedding</span>
        </label>
      </div>
    </div>
  );
}
