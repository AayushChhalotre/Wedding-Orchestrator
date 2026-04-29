import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Check, ChevronRight, Calendar, MapPin, Users, Wallet, Heart, Compass, History, ShieldCheck, Search, CheckCircle2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { WeddingGraphic } from "@/components/WeddingGraphics";
import { comboPacks } from "@/lib/combo-packs";
import { Step1Vision } from "./Onboarding/Step1Vision";
import { Step2Basics } from "./Onboarding/Step2Basics";
import { Step3Events } from "./Onboarding/Step3Events";
import { Step4AlreadyDone } from "./Onboarding/Step4AlreadyDone";


const steps = [
  { id: 1, label: "Vision" },
  { id: 2, label: "Basics" },
  { id: 3, label: "Events" },
  { id: 4, label: "Already done" },
];

const leadershipModels = [
  { id: "couple", title: "We're deciding", description: "You and your partner make the key decisions.", icon: Heart },
  { id: "parent", title: "Parents are steering", description: "Parents or elders are steering the ship.", icon: Users },
  { id: "family", title: "It's a family effort", description: "A collaborative effort across the whole family.", icon: Compass },
];

const guestBands = ["Under 100", "100–200", "200–300", "300–600", "600–1000", "1000+"];
const budgetBands = ["Under ₹10L", "₹10L–₹25L", "₹25L–₹50L", "₹50L+"];
const weddingTypes = ["Hindu", "Christian", "Muslim", "Sikh", "Other", "Mixed / Multi-faith"];
const rashis = [
  "Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", 
  "Kark (Cancer)", "Simha (Leo)", "Kanya (Virgo)", 
  "Tula (Libra)", "Vrishchik (Scorpio)", "Dhanu (Sagittarius)", 
  "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)"
];
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { 
    weddingInfo, 
    updateWeddingInfo, 
    generateTimeline, 
    analyzeWhatsApp, 
    whatsAppAnalysisStatus: whatsAppStatus,
    statusTracking,
    leadershipModel,
    setLeadershipModel,
    whatsAppErrorMessage: whatsAppError
  } = useStore();

  const [weddingDate, setWeddingDate] = useState("");
  const [city, setCity] = useState("");
  const [guestBand, setGuestBand] = useState("");
  const [budgetBand, setBudgetBand] = useState("");
  const [partner1, setPartner1] = useState("");
  const [partner2, setPartner2] = useState("");

  // Step 3 state
  const [weddingType, setWeddingType] = useState("");
  const [partner1Rashi, setPartner1Rashi] = useState("");
  const [partner2Rashi, setPartner2Rashi] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["Wedding"]);
  const [multiDay, setMultiDay] = useState(false);
  const [destination, setDestination] = useState(false);

  // Step 4 state
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  
  // Custom Events
  const [customEventInput, setCustomEventInput] = useState("");
  const [customEvents, setCustomEvents] = useState<string[]>([]);

  // Extraction Data Points
  const potentialGuests = useStore(state => state.potentialGuestList);

  // Auto-sync extracted data to UI state
  useEffect(() => {
    if (whatsAppStatus === "completed") {
      if (weddingInfo.budget) {
        const budgetValue = weddingInfo.budget.toLowerCase();
        if (budgetValue.includes("l")) {
          const num = parseFloat(budgetValue.replace(/[^0-9.]/g, ""));
          if (!isNaN(num)) {
            if (num < 10) setBudgetBand(budgetBands[0]);
            else if (num <= 25) setBudgetBand(budgetBands[1]);
            else if (num <= 50) setBudgetBand(budgetBands[2]);
            else setBudgetBand(budgetBands[3]);
          }
        }
      }
      
      if (weddingInfo.location) setCity(weddingInfo.location);
      if (weddingInfo.weddingDate) {
        setWeddingDate(weddingInfo.weddingDate);
      }
      if (weddingInfo.guests) {
        const normalized = weddingInfo.guests.replace("-", "–");
        if (guestBands.includes(normalized)) {
          setGuestBand(normalized);
        } else {
          // Robust numeric mapping
          const num = parseInt(normalized.split(/[–-]/)[0].replace(/[^0-9]/g, ""));
          if (!isNaN(num)) {
            if (num < 100) setGuestBand(guestBands[0]);
            else if (num < 200) setGuestBand(guestBands[1]);
            else if (num < 300) setGuestBand(guestBands[2]);
            else if (num < 600) setGuestBand(guestBands[3]);
            else if (num < 1000) setGuestBand(guestBands[4]);
            else setGuestBand(guestBands[5]);
          }
        }
      }
      
      if (weddingInfo.partner1Name) setPartner1(weddingInfo.partner1Name);
      if (weddingInfo.partner2Name) setPartner2(weddingInfo.partner2Name);

      if (weddingInfo.weddingType && weddingTypes.includes(weddingInfo.weddingType)) {
        setWeddingType(weddingInfo.weddingType);
      } else if (weddingInfo.weddingType && weddingInfo.weddingType.toLowerCase().includes("hindu")) {
        setWeddingType("Hindu");
      }

      if (statusTracking?.multiDay !== undefined) setMultiDay(statusTracking.multiDay);
      if (statusTracking?.destination !== undefined) setDestination(statusTracking.destination);
    }
  }, [whatsAppStatus, weddingInfo, statusTracking]);

  const addCustomEvent = () => {
    if (customEventInput.trim() && customEvents.length < 5) {
      const newEvent = customEventInput.trim();
      if (!selectedEvents.includes(newEvent) && !eventTypes.includes(newEvent)) {
        setCustomEvents([...customEvents, newEvent]);
        setSelectedEvents([...selectedEvents, newEvent]);
      }
      setCustomEventInput("");
    }
  };

  const removeCustomEvent = (event: string) => {
    setCustomEvents(customEvents.filter(ce => ce !== event));
    setSelectedEvents(selectedEvents.filter(se => se !== event));
  };

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  useEffect(() => {
    if (whatsAppStatus === "completed" && statusTracking) {
      const itemsToTick: string[] = [];
      if (statusTracking.venueBooked) itemsToTick.push("Venue booked");
      if (statusTracking.catererBooked) itemsToTick.push("Caterer booked");
      if (statusTracking.photoBooked) itemsToTick.push("Photographer booked");
      if (statusTracking.plannerHired) itemsToTick.push("Wedding planner hired");
      
      if (itemsToTick.length > 0) {
        setCheckedItems(prev => Array.from(new Set([...prev, ...itemsToTick])));
      }
    }
  }, [whatsAppStatus, statusTracking]);

  const toggleChecked = (item: string) => {
    setCheckedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Step 4 is final
      updateWeddingInfo({
        weddingDate,
        city,
        guests: guestBand,
        budget: budgetBand,
        partner1Name: partner1,
        partner2Name: partner2,
        weddingType,
        partner1Rashi: partner1Rashi as any,
        partner2Rashi: partner2Rashi as any,
      });

      // Save events to store
      const addEvent = useStore.getState().addEvent;
      const existingEvents = useStore.getState().events;
      
      selectedEvents.forEach(eventName => {
        const alreadyExists = existingEvents.some(e => e.name === eventName);
        if (!alreadyExists) {
          // Find matching combo pack for the event name
          const match = comboPacks.find(p => p.name.toLowerCase().includes(eventName.toLowerCase()) || eventName.toLowerCase().includes(p.id));
          
          addEvent({
            id: crypto.randomUUID(),
            name: eventName,
            theme: match?.theme || "",
            vibe: match?.vibe || "",
            guestCount: parseInt(guestBand.replace(/[^0-9]/g, "")) || 0,
            duration: "",
            colors: match?.colors || ["#E5E7EB", "#D1D5DB", "#9CA3AF"],
            gallery: match?.gallery || [],
            locationType: "indoor"
          });
        }
      });

      generateTimeline({ 
        weddingDate, 
        partner1, 
        partner2,
        tradition: weddingType,
        partner1Rashi,
        partner2Rashi
      });
      setLocation("/generating");
    }
  };

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await analyzeWhatsApp(file);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row relative">

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

          <h1 className="font-serif-display text-4xl lg:text-5xl text-serif-gradient leading-tight">
            Let's find<br />your rhythm.
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">
            A few quick prompts to shape your vision.
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
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={mounted ? { opacity: 0, x: 10 } : false}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {step === 1 && (
                  <Step1Vision 
                    onNext={() => handleNext()} 
                  />
                )}

                {step === 2 && (
                  <Step2Basics 
                    data={{
                      partner1,
                      partner2,
                      weddingDate,
                      city,
                      guestBand,
                      budgetBand
                    }}
                    updateData={(updates) => {
                      if (updates.partner1 !== undefined) setPartner1(updates.partner1);
                      if (updates.partner2 !== undefined) setPartner2(updates.partner2);
                      if (updates.weddingDate !== undefined) setWeddingDate(updates.weddingDate);
                      if (updates.city !== undefined) setCity(updates.city);
                      if (updates.guestBand !== undefined) setGuestBand(updates.guestBand);
                      if (updates.budgetBand !== undefined) setBudgetBand(updates.budgetBand);
                    }}
                  />
                )}

                {step === 3 && (
                  <Step3Events 
                    data={{
                      weddingType,
                      partner1Rashi,
                      partner2Rashi,
                      selectedEvents,
                      multiDay,
                      destination,
                      partner1Name: partner1,
                      partner2Name: partner2
                    }}
                    updateData={(updates) => {
                      if (updates.weddingType !== undefined) setWeddingType(updates.weddingType);
                      if (updates.partner1Rashi !== undefined) setPartner1Rashi(updates.partner1Rashi);
                      if (updates.partner2Rashi !== undefined) setPartner2Rashi(updates.partner2Rashi);
                      if (updates.selectedEvents !== undefined) setSelectedEvents(updates.selectedEvents);
                      if (updates.multiDay !== undefined) setMultiDay(updates.multiDay);
                      if (updates.destination !== undefined) setDestination(updates.destination);
                    }}
                  />
                )}

                {step === 4 && (
                  <Step4AlreadyDone 
                    checkedItems={checkedItems}
                    toggleChecked={toggleChecked}
                    selectedEvents={selectedEvents}
                  />
                )}
              </motion.div>
            </AnimatePresence>
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
              {step < 4 ? "Continue" : "Generate my timeline"}
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Right: Dynamic Preview (desktop only) */}
      <div className="hidden lg:flex flex-col w-96 xl:w-[420px] bg-sidebar sticky top-0 h-screen items-center justify-start gap-12 px-10 py-16 shrink-0 border-l border-border relative overflow-hidden">
        
        {/* Subtle background gradient based on step */}
        <div className="absolute inset-0 opacity-20 pointer-events-none transition-colors duration-1000 ease-in-out" 
          style={{
            background: step === 1 ? 'radial-gradient(circle at top right, var(--sidebar-primary), transparent 70%)' :
                        step === 2 ? 'radial-gradient(circle at bottom right, var(--sidebar-primary), transparent 70%)' :
                        step === 3 ? 'radial-gradient(circle at bottom left, var(--sidebar-primary), transparent 70%)' :
                        'radial-gradient(circle at center, var(--sidebar-primary), transparent 70%)'
          }}
        />

        {mounted && (
          <div className="relative w-full aspect-[4/5] max-h-[520px] flex items-center justify-center p-0">
            <WeddingGraphic 
              type={step === 1 && (whatsAppStatus === 'analyzing') ? "whatsapp" : "onboarding"} 
              className="absolute inset-0 rounded-[40px] shadow-2xl"
              partner1={partner1}
              partner2={partner2}
            />
            
            <div className="absolute inset-0 flex items-center justify-center translate-y-32">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/90 backdrop-blur-xl px-8 py-4 rounded-2xl shadow-xl border border-white/50 text-center"
                >
                  <div className="font-serif-display text-primary text-3xl">
                    {step === 1 ? "Vision" : step === 2 ? "Basics" : step === 3 ? "Events" : "Build"}
                  </div>
                  <div className="text-muted-foreground text-[10px] uppercase tracking-[0.2em] mt-1 font-bold">
                    Phase {step} of 4
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

          {/* Dynamic Wedding Profile Preview */}
          <div className="bg-sidebar-accent/30 rounded-2xl p-6 text-left border border-sidebar-border/50 w-full backdrop-blur-sm shadow-sm">
            <p className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest mb-5 font-semibold">Your Wedding Profile</p>
            
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-500", step > 1 ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "bg-sidebar-foreground/5 text-sidebar-foreground/30")}>
                  <Heart size={13} />
                </div>
                <div className="flex-1">
                  <div className={cn("text-xs font-bold tracking-wide uppercase transition-colors duration-500", step > 1 ? "text-sidebar-foreground" : "text-sidebar-foreground/40")}>The Vision</div>
                  {leadershipModel ? (
                    <div className="text-[11px] text-sidebar-foreground/70 mt-1 flex items-center gap-1">
                      {leadershipModels.find(m => m.id === leadershipModel)?.title || "Deciding together"}
                    </div>
                  ) : (
                    <div className="text-[11px] text-sidebar-foreground/40 mt-1 italic">Who's steering the ship?</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-500", step > 2 ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "bg-sidebar-foreground/5 text-sidebar-foreground/30")}>
                  <MapPin size={13} />
                </div>
                <div className="flex-1">
                  <div className={cn("text-xs font-bold tracking-wide uppercase transition-colors duration-500", step > 2 ? "text-sidebar-foreground" : "text-sidebar-foreground/40")}>The Basics</div>
                  {city || guestBand || budgetBand || weddingDate || partner1 || partner2 ? (
                    <div className="text-[11px] text-sidebar-foreground/70 mt-1 space-y-1">
                      {(partner1 || partner2) && <div className="font-medium text-sidebar-foreground">{partner1 || "Partner 1"} & {partner2 || "Partner 2"}</div>}
                      <div className="flex flex-wrap gap-1.5 opacity-90 pt-0.5">
                        {city && <span className="inline-flex px-1.5 py-0.5 bg-sidebar-background rounded text-[10px] border border-sidebar-border">{city}</span>}
                        {guestBand && <span className="inline-flex px-1.5 py-0.5 bg-sidebar-background rounded text-[10px] border border-sidebar-border">{guestBand}</span>}
                        {budgetBand && <span className="inline-flex px-1.5 py-0.5 bg-sidebar-background rounded text-[10px] border border-sidebar-border">{budgetBand}</span>}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-sidebar-foreground/40 mt-1 italic">Where, when, and how many?</div>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-colors duration-500", step > 3 ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm" : "bg-sidebar-foreground/5 text-sidebar-foreground/30")}>
                  <History size={13} />
                </div>
                <div className="flex-1">
                  <div className={cn("text-xs font-bold tracking-wide uppercase transition-colors duration-500", step > 3 ? "text-sidebar-foreground" : "text-sidebar-foreground/40")}>The Celebration</div>
                  {weddingType || selectedEvents.length > 0 ? (
                    <div className="text-[11px] text-sidebar-foreground/70 mt-1 space-y-1">
                      {weddingType && <div className="font-medium text-sidebar-foreground">{weddingType} {destination ? "· Destination" : ""}</div>}
                      <div className="flex flex-wrap gap-1.5 opacity-90 pt-0.5">
                        {selectedEvents.slice(0, 3).map(e => (
                          <span key={e} className="inline-flex px-1.5 py-0.5 bg-sidebar-background rounded text-[10px] border border-sidebar-border">{e}</span>
                        ))}
                        {selectedEvents.length > 3 && (
                          <span className="inline-flex px-1.5 py-0.5 bg-sidebar-background rounded text-[10px] border border-sidebar-border">+{selectedEvents.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[11px] text-sidebar-foreground/40 mt-1 italic">Traditions and events</div>
                  )}
                </div>
              </div>

              <AnimatePresence>
                {step >= 4 && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-7 h-7 rounded-full bg-sidebar-primary text-sidebar-primary-foreground flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                      <CheckCircle2 size={13} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold tracking-wide uppercase text-sidebar-foreground">Current Status</div>
                      <div className="text-[11px] text-sidebar-foreground/70 mt-1">
                        {checkedItems.length > 0 && !checkedItems.includes("None yet — starting fresh") ? (
                          <div className="flex flex-col gap-1">
                            {checkedItems.map(item => (
                              <div key={item} className="flex items-center gap-1.5">
                                <Check size={10} className="text-sidebar-primary shrink-0" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="italic">Starting fresh with a clean slate</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
