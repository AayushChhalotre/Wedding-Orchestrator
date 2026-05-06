import { Heart, Users, Compass, Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { WeddingGraphic } from "@/components/WeddingGraphics";

const leadershipModels = [
  { id: "couple", title: "We're deciding", description: "You and your partner make the key decisions.", icon: Heart },
  { id: "parent", title: "Parents are steering", description: "Parents or elders are steering the ship.", icon: Users },
  { id: "family", title: "It's a family effort", description: "A collaborative effort across the whole family.", icon: Compass },
];

interface Step1VisionProps {
  onNext: () => void;
}

export function Step1Vision({ onNext }: Step1VisionProps) {
  const { 
    leadershipModel, 
    setLeadershipModel, 
    analyzeWhatsApp, 
    whatsAppAnalysisStatus: whatsAppStatus,
    whatsAppErrorMessage: whatsAppError,
    weddingInfo,
    potentialGuestList
  } = useStore();

  const onFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await analyzeWhatsApp(file);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 lg:items-start pb-12 sm:pb-0">
      <div className="flex-1 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/50 pb-6">
          <div>
            <h2 className="text-2xl font-serif-display text-foreground">Who is shaping the vision?</h2>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Decisions feel different depending on who's leading. Choose your style or import your story.
            </p>
          </div>
          
          {/* Compact desktop fast track link */}
          <div className="hidden lg:block">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
              </span>
              Fast Track Available
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {leadershipModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setLeadershipModel(model.id as any)}
              className={cn(
                "w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all group",
                leadershipModel === model.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-sm"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div className={cn(
                "p-2.5 rounded-lg shrink-0 transition-colors",
                leadershipModel === model.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-muted/80"
              )}>
                <model.icon size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm text-foreground">{model.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{model.description}</div>
              </div>
              {leadershipModel === model.id && (
                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-[320px] shrink-0">
        <div className="relative mb-8 lg:mb-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-[0.2em]"><span className="bg-background px-4 text-primary">Or skip the typing</span></div>
        </div>
        
        <div className="p-6 rounded-2xl border border-primary/20 bg-primary/[0.03] text-center transition-all hover:bg-primary/[0.05] group/whatsapp flex flex-col relative shadow-sm overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
          
          <div className="relative h-24 sm:h-32 mb-5 rounded-xl overflow-hidden shadow-sm ring-1 ring-primary/10 shrink-0">
            <WeddingGraphic type="whatsapp" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent pointer-events-none" />
          </div>
          
          <h3 className="text-sm font-bold text-foreground">Import Chat Story</h3>
          <p className="text-[11px] text-muted-foreground mt-2 mb-6 px-1 leading-relaxed">
            Upload your WhatsApp chat export and we'll extract your wedding basics instantly.
          </p>
          
          <label className={cn(
            "inline-flex items-center justify-center px-6 py-3.5 rounded-xl text-xs font-bold cursor-pointer shadow-sm transition-all w-full",
            whatsAppStatus === "analyzing" ? "bg-muted text-muted-foreground" : "bg-foreground text-background hover:bg-foreground/90 active:scale-[0.98]"
          )}>
            {whatsAppStatus === "analyzing" ? (
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Reading chat...
              </span>
            ) : "Upload (.txt)"}
            <input type="file" accept=".txt" className="hidden" onChange={onFileUpload} disabled={whatsAppStatus === "analyzing"} />
          </label>

          {whatsAppStatus === "completed" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 text-left"
            >
              <div className="flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-wider mb-3">
                <Check size={14} className="stroke-[3px]" /> Extraction Complete
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label: "Budget", value: weddingInfo.budget },
                  { label: "City", value: weddingInfo.location },
                ].map((item, i) => (
                  <div key={item.label} className="p-2 rounded-lg bg-white border border-primary/10">
                    <div className="text-[8px] text-muted-foreground font-bold uppercase tracking-tighter">{item.label}</div>
                    <div className="text-[10px] font-bold text-foreground truncate">{item.value || "—"}</div>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={onNext}
                className="w-full py-3 bg-primary text-white rounded-xl text-xs font-bold shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Sync & Continue
              </button>
            </motion.div>
          )}
          
          {whatsAppStatus === "error" && (
            <p className="text-[10px] text-destructive font-medium mt-3 leading-tight">
              {whatsAppError}
            </p>
          )}
        </div>
      </div>
    </div>

  );
}
