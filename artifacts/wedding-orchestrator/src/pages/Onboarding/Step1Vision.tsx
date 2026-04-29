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
    <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
      <div className="space-y-6">
        <p className="text-sm text-muted-foreground mb-4">
          Who is shaping the vision? Decisions feel different depending on who's leading.
        </p>

        <div className="space-y-3">
          {leadershipModels.map((model) => (
            <button
              key={model.id}
              onClick={() => setLeadershipModel(model.id as any)}
              className={cn(
                "w-full flex items-start gap-4 p-4 rounded-xl border text-left transition-all group",
                leadershipModel === model.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg shrink-0 transition-colors",
                leadershipModel === model.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-muted/80"
              )}>
                <model.icon size={18} />
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">{model.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{model.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2 md:pt-0">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-4 text-muted-foreground font-medium">Skip the typing</span></div>
        </div>
        
        <div className="p-5 rounded-2xl border border-primary/20 bg-primary/5 text-center transition-all hover:bg-primary/[0.07] overflow-hidden group/whatsapp flex flex-col justify-center h-full min-h-[320px]">
          <div className="relative h-40 sm:h-48 mb-6 rounded-2xl overflow-hidden shadow-inner ring-1 ring-primary/10 shrink-0">
            <WeddingGraphic type="whatsapp" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent pointer-events-none" />
          </div>
          <h3 className="text-sm font-bold text-foreground">Import your local story</h3>
          <p className="text-xs text-muted-foreground mt-1.5 mb-5 px-6 leading-relaxed">
            Already planning in a WhatsApp group? Upload the chat export and we'll extract your basics instantly.
          </p>
          
          <label className={cn(
            "inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer shadow-sm transition-all",
            whatsAppStatus === "analyzing" ? "bg-muted text-muted-foreground" : "bg-foreground text-background hover:bg-foreground/90 active:scale-95"
          )}>
            {whatsAppStatus === "analyzing" ? "Reading chat..." : "Upload Chat (.txt)"}
            <input type="file" accept=".txt" className="hidden" onChange={onFileUpload} disabled={whatsAppStatus === "analyzing"} />
          </label>

          {whatsAppStatus === "completed" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-white/50 backdrop-blur rounded-xl border border-primary/10 text-left shadow-sm"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-tight">
                  <Check size={14} className="stroke-[3px]" /> Extraction Complete
                </div>
              </div>

              {useStore.getState().whatsAppSummary && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/10 mb-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-primary/40" />
                  <p className="text-[11px] text-foreground/80 leading-relaxed italic pl-2">
                    "{useStore.getState().whatsAppSummary}"
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Budget", value: weddingInfo.budget },
                  { label: "Vision", value: leadershipModel, capitalize: true },
                  { label: "City", value: weddingInfo.location },
                  { label: "Guests", value: weddingInfo.guests }
                ].map((item, i) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-2 rounded-lg bg-primary/5 border border-primary/5"
                  >
                    <div className="text-[10px] text-muted-foreground font-medium">{item.label}</div>
                    <div className={cn("text-xs font-bold text-foreground", item.capitalize && "capitalize")}>
                      {item.value || "—"}
                    </div>
                  </motion.div>
                ))}
              </div>

              {potentialGuestList.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 p-3 bg-secondary/30 rounded-lg border border-secondary/20 flex gap-3 items-start"
                >
                  <Users size={16} className="text-secondary-foreground shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] font-bold text-secondary-foreground uppercase tracking-tight">Privacy First</div>
                    <p className="text-[10px] text-secondary-foreground/70 leading-relaxed mt-0.5">
                      We've spotted potential guest names in your chat—probably your favorite people! We've tucked them away safely to help you build your guest list later.
                    </p>
                  </div>
                </motion.div>
              )}

              <button 
                onClick={onNext}
                className="w-full mt-5 py-2.5 bg-primary text-white rounded-lg text-xs font-bold shadow-md hover:bg-primary/90 transition-all active:scale-[0.98]"
              >
                Sync Details & Continue
              </button>
            </motion.div>
          )}
          {whatsAppStatus === "error" && (
            <p className="text-[10px] text-destructive font-medium mt-3 leading-tight px-6">
              {whatsAppError}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
