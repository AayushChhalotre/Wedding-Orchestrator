import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { History, Edit3, Check, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface VisionNarrativeEditorProps {
  value: string;
  onSave: (value: string) => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
  readOnly?: boolean;
}

export function VisionNarrativeEditor({ value, onSave, onRegenerate, isRegenerating, readOnly }: VisionNarrativeEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [showConfirmRegen, setShowConfirmRegen] = useState(false);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <label className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
          <History size={14} className="text-primary" />
          Vision Narrative
        </label>
        {!readOnly && (
          <div className="flex items-center gap-4">
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest flex items-center gap-1.5 transition-colors"
              >
                <Edit3 size={12} /> Edit Manually
              </button>
            )}
            <button 
              onClick={() => setShowConfirmRegen(true)}
              disabled={isRegenerating}
              className="text-[10px] font-bold text-primary uppercase tracking-widest hover:underline disabled:opacity-50"
            >
              {isRegenerating ? "Curating..." : "Regenerate with AI"}
            </button>
          </div>
        )}
      </div>

      <div className={cn(
        "relative rounded-2xl transition-all duration-500",
        isEditing && !readOnly ? "bg-background border-2 border-primary/20 shadow-2xl shadow-primary/5" : "bg-muted/10 border border-border/40"
      )}>
        <AnimatePresence mode="wait">
          {isEditing && !readOnly ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-1"
            >
              <textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 p-5 text-sm font-medium leading-relaxed min-h-[120px] resize-none text-foreground placeholder:text-muted-foreground/50"
                placeholder="Describe your vision for this ceremony..."
                autoFocus
              />
              <div className="flex justify-end gap-2 p-3 bg-muted/5 border-t border-border/20">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-[10px] font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest"
                >
                  Discard
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={cn(
                "p-6",
                !readOnly && "cursor-pointer group/narrative"
              )}
              onClick={() => !readOnly && setIsEditing(true)}
            >
              {value ? (
                <p className={cn(
                  "text-sm font-medium leading-relaxed italic text-muted-foreground/80 transition-colors",
                  !readOnly && "group-hover/narrative:text-muted-foreground"
                )}>
                  "{value}"
                </p>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest mb-2">No narrative curated yet</p>
                  {!readOnly && <span className="text-[10px] font-bold text-primary hover:underline">Click to write or generate</span>}
                </div>
              )}
              {!readOnly && (
                <div className="absolute top-4 right-4 opacity-0 group-hover/narrative:opacity-100 transition-opacity">
                  <Edit3 size={14} className="text-muted-foreground/40" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confirmation Modal for Regeneration */}
      <AnimatePresence>
        {showConfirmRegen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmRegen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-background border border-border p-8 rounded-[2rem] shadow-2xl"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="text-primary" size={24} />
              </div>
              <h3 className="text-xl font-serif-display text-foreground mb-3">Refresh Narrative?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                Regenerating with AI will replace any manual edits you've made to this ceremony's vision story. Are you sure you want to proceed?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmRegen(false)}
                  className="flex-1 px-6 py-3 border border-border rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted/50 transition-colors"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    onRegenerate();
                    setShowConfirmRegen(false);
                    setIsEditing(false);
                  }}
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-xs font-bold shadow-lg shadow-primary/20"
                >
                  Yes, Regenerate
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
