import { useState } from "react";
import { useLocation } from "wouter";
import { Check, ChevronRight, Calendar, MapPin, Users, Wallet, Heart, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Events" },
  { id: 3, label: "Already done" },
];

const guestBands = ["Under 100", "100–200", "200–300", "300+"];
const budgetBands = ["Under ₹10L", "₹10L–₹25L", "₹25L–₹50L", "₹50L+"];
const weddingTypes = ["Hindu", "Christian", "Muslim", "Sikh", "Other", "Mixed / Multi-faith"];
const eventTypes = ["Haldi", "Mehendi", "Sangeet", "Wedding", "Reception"];
const alreadyDone = [
  "Venue booked",
  "Caterer booked",
  "Photographer booked",
  "Wedding planner hired",
  "None yet — starting fresh",
];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);

  // Step 1 state
  const [weddingDate, setWeddingDate] = useState("");
  const [city, setCity] = useState("");
  const [guestBand, setGuestBand] = useState("");
  const [budgetBand, setBudgetBand] = useState("");

  // Step 2 state
  const [weddingType, setWeddingType] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["Wedding"]);
  const [multiDay, setMultiDay] = useState(false);
  const [destination, setDestination] = useState(false);

  // Step 3 state
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const toggleChecked = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else setLocation("/generating");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left: Form */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Header */}
        <div className="px-6 pt-8 pb-6 lg:px-12 lg:pt-12">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1 text-muted-foreground/50">
              <div className="w-1.5 h-1.5 rounded-full border border-current" />
              <div className="w-1.5 h-1.5 rounded-full border border-current" />
            </div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
              AI Wedding Orchestrator
            </span>
          </div>

          <h1 className="font-serif-display text-3xl lg:text-4xl text-foreground leading-tight">
            Let's build your<br />wedding plan.
          </h1>
          <p className="text-muted-foreground text-sm mt-2">
            2 minutes to your personalised timeline.
          </p>
        </div>

        {/* Stepper */}
        <div className="px-6 lg:px-12 mb-6">
          <div className="flex items-center gap-0">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all",
                      step > s.id
                        ? "bg-primary text-primary-foreground"
                        : step === s.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {step > s.id ? <Check size={13} /> : s.id}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
                      step === s.id ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className="w-8 lg:w-16 h-px bg-border mx-2" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className="flex-1 px-6 lg:px-12 pb-28 lg:pb-12">
          <div className="max-w-lg">
            {step === 1 && (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground mb-4">
                  A few basics so we can build around your date and scale.
                </p>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    <Calendar size={13} className="inline mr-1.5 -mt-0.5" />
                    Wedding date
                  </label>
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
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
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
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
                        onClick={() => setGuestBand(band)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left",
                          guestBand === band
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
                        onClick={() => setBudgetBand(band)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left",
                          budgetBand === band
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
            )}

            {step === 2 && (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground mb-4">
                  Tell us about the type and structure of your celebration.
                </p>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    <Heart size={13} className="inline mr-1.5 -mt-0.5" />
                    Type of wedding
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {weddingTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setWeddingType(type)}
                        className={cn(
                          "px-3 py-2.5 rounded-lg border text-sm font-medium transition-all text-left",
                          weddingType === type
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

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Events (select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {eventTypes.map((event) => (
                      <button
                        key={event}
                        onClick={() => toggleEvent(event)}
                        className={cn(
                          "px-3 py-1.5 rounded-full border text-sm font-medium transition-all",
                          selectedEvents.includes(event)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card text-foreground hover:border-primary/40"
                        )}
                        data-testid={`chip-event-${event.toLowerCase()}`}
                      >
                        {event}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setMultiDay(!multiDay)}
                      className={cn(
                        "w-10 h-6 rounded-full transition-colors relative cursor-pointer",
                        multiDay ? "bg-primary" : "bg-border"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                        multiDay ? "translate-x-5" : "translate-x-1"
                      )} />
                    </div>
                    <span className="text-sm font-medium text-foreground">Multi-day celebration</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div
                      onClick={() => setDestination(!destination)}
                      className={cn(
                        "w-10 h-6 rounded-full transition-colors relative cursor-pointer",
                        destination ? "bg-primary" : "bg-border"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform",
                        destination ? "translate-x-5" : "translate-x-1"
                      )} />
                    </div>
                    <span className="text-sm font-medium text-foreground">Destination wedding</span>
                  </label>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  What's already locked in? We'll skip those steps in your plan.
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
                    <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We'll generate a personalised timeline with{" "}
                      {selectedEvents.length > 0 ? selectedEvents.join(", ") : "your"} events,
                      tailored to what's already been booked.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sticky bottom CTA */}
        <div className="fixed bottom-0 left-0 right-0 lg:static bg-background/95 backdrop-blur border-t border-border px-6 py-4 lg:border-none lg:px-12 lg:pb-12">
          <div className="max-w-lg flex items-center justify-between gap-3">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                data-testid="btn-back"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 lg:flex-none lg:min-w-[180px] flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
              data-testid="btn-next"
            >
              {step < 3 ? "Continue" : "Generate my timeline"}
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Illustration placeholder (desktop only) */}
      <div className="hidden lg:flex flex-col w-96 xl:w-[480px] bg-sidebar items-center justify-center px-10 py-12 shrink-0">
        <div className="text-center">
          <div className="relative mx-auto mb-8 w-48 h-48">
            {/* Abstract rings motif */}
            <div className="absolute inset-0 rounded-full border-2 border-sidebar-primary/30 animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-sidebar-primary/20" />
            <div className="absolute inset-8 rounded-full border border-sidebar-foreground/10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="font-serif-display text-sidebar-foreground text-2xl leading-tight">
                  {step === 1 ? "Your Date" : step === 2 ? "Your Day" : "Your Plan"}
                </div>
                <div className="text-sidebar-foreground/50 text-xs mt-1">awaits</div>
              </div>
            </div>
          </div>

          {/* Preview card */}
          <div className="bg-sidebar-accent/40 rounded-xl p-4 text-left border border-sidebar-border">
            <p className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest mb-3">Timeline preview</p>
            {["Foundation · Apr–May", "Vendor Locking · May–Jul", "Guest Management · Jun–Aug", "Ceremony Prep · Aug–Oct", "Final Week · Nov"].map((item, i) => (
              <div key={i} className={cn(
                "flex items-center gap-2 py-1.5 text-xs",
                i < 2 ? "text-sidebar-foreground" : "text-sidebar-foreground/40"
              )}>
                <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", i < 2 ? "bg-sidebar-primary" : "bg-sidebar-foreground/20")} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
