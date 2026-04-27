import { useStore } from "@/store/useStore";
import { getRelevantDates, getRashiCompatibility, getBufferSlots } from "@/data/muhrats";
import { Calendar as CalendarIcon, Flame, Compass, Check, Lock, Info, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

export function MuhratTool() {
  const weddingInfo = useStore(state => state.weddingInfo);
  const lockInDate = useStore(state => state.lockInDate);
  const lockEventDate = useStore(state => state.lockEventDate);
  const setWeddingDuration = useStore(state => state.setWeddingDuration);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"ritual" | "timeline">("ritual");

  const tradition = weddingInfo.weddingType || "Hindu";
  const partner1Rashi = weddingInfo.partner1Rashi;
  const partner2Rashi = weddingInfo.partner2Rashi;

  const relevantDates = getRelevantDates(tradition);
  const displayDates = isExpanded ? relevantDates : relevantDates.slice(0, 3);
  
  const bufferSlots = weddingInfo.lockedDate ? getBufferSlots(weddingInfo.lockedDate, weddingInfo.weddingDuration) : [];

  const toolTitle = tradition === "Hindu" || tradition === "Mixed / Multi-faith" ? "Vedic Muhrat Tool" : "Auspicious Dates";
  const toolSub = tradition === "Hindu" || tradition === "Mixed / Multi-faith" 
    ? `Auspicious dates for ${partner1Rashi} & ${partner2Rashi}`
    : `Recommended dates for a ${tradition} wedding`;

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
            <Flame size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-orange-900 leading-none">{toolTitle}</h3>
            <p className="text-[10px] text-orange-700 font-medium mt-1">
              {toolSub}
            </p>
          </div>
        </div>
        {weddingInfo.lockedDate && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">
            <Lock size={10} />
            LOCKED
          </div>
        )}
      </div>

      {/* Stats/Options Bar */}
      <div className="mb-4 flex items-center justify-between bg-white/40 p-1.5 rounded-xl">
        <div className="flex gap-1">
          {[3, 5, 7].map(d => (
            <button
              key={d}
              onClick={() => setWeddingDuration(d)}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                weddingInfo.weddingDuration === d 
                  ? "bg-orange-600 text-white shadow-sm" 
                  : "text-orange-900 hover:bg-orange-100"
              )}
            >
              {d} Days
            </button>
          ))}
        </div>
        <div className="flex gap-1">
           <button
            onClick={() => setActiveTab("ritual")}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
              activeTab === "ritual" ? "text-orange-900" : "text-orange-900/40"
            )}
          >
            Muhrats
          </button>
          <button
            disabled={!weddingInfo.lockedDate}
            onClick={() => setActiveTab("timeline")}
            className={cn(
              "px-3 py-1 rounded-lg text-[10px] font-bold transition-all disabled:opacity-30",
              activeTab === "timeline" ? "text-orange-900" : "text-orange-900/40"
            )}
          >
            Timeline
          </button>
        </div>
      </div>

      {activeTab === "ritual" ? (
        <div className="space-y-2">
          {displayDates.map((m) => {
            const score = (tradition === "Hindu" || tradition === "Mixed / Multi-faith") 
              ? getRashiCompatibility(partner1Rashi || "Aries", partner2Rashi || "Taurus") 
              : 8;
            const isSelected = weddingInfo.lockedDate === m.date;
            
            return (
              <div 
                key={m.date}
                className={cn(
                  "group relative p-3 rounded-xl border transition-all cursor-pointer",
                  isSelected 
                    ? "bg-white border-orange-300 shadow-md ring-1 ring-orange-200" 
                    : "bg-white/50 border-orange-100 hover:border-orange-200 hover:bg-white"
                )}
                onClick={() => lockInDate(m.date)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-center min-w-[40px]">
                      <div className="text-[10px] font-bold text-orange-400 uppercase leading-none">
                        {new Date(m.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-lg font-serif-display font-bold text-orange-900">
                        {new Date(m.date).toLocaleDateString('en-US', { day: 'numeric' })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-orange-900">
                        {m.nakshatras ? `${m.nakshatras[0]} Nakshatra` : "Auspicious Day"}
                      </div>
                      <div className="text-[10px] text-orange-600/70 font-medium">
                        {m.notes || "High energy, stable foundation"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1">
                    <div className={cn(
                      "px-2 py-0.5 rounded-full text-[9px] font-bold uppercase",
                      score >= 9 ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {m.quality}
                    </div>
                    {isSelected && <Check size={14} className="text-orange-500" strokeWidth={3} />}
                  </div>
                </div>
              </div>
            );
          })}
          
          {!weddingInfo.lockedDate && relevantDates.length > 3 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full mt-2 py-2 text-[10px] font-bold text-orange-600 hover:bg-orange-100/50 rounded-lg transition-colors border border-orange-200 border-dashed"
            >
              {isExpanded ? "Show Recommended Top 3" : `View ${relevantDates.length - 3} More Auspicious Dates`}
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-white/60 border border-orange-200 rounded-xl relative overflow-hidden">
             <div className="absolute right-0 top-0 p-1 opacity-10">
                <Check size={40} />
             </div>
             <p className="text-[9px] font-bold text-orange-400 uppercase tracking-wider mb-1">Anchor Point</p>
             <h4 className="text-sm font-bold text-orange-900">Main Wedding Ritual</h4>
             <p className="text-[10px] text-orange-700 font-medium mt-0.5">
               {new Date(weddingInfo.lockedDate!).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
             </p>
          </div>

          <div className="relative pl-4 space-y-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-orange-200">
            {bufferSlots.map((slot, idx) => {
              const dateObj = new Date(slot.date);
              const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
              const isLocked = weddingInfo.lockedDates[slot.name] === slot.date;

              return (
                <div key={idx} className="relative">
                  <div className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-orange-400 ring-4 ring-orange-50" />
                  <div 
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer",
                      isLocked ? "bg-white border-orange-300 shadow-sm" : "bg-white/40 border-orange-100 hover:bg-white"
                    )}
                    onClick={() => lockEventDate(slot.name, slot.date)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-[11px] font-bold text-orange-900">{slot.name}</h5>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] text-orange-700 font-medium">
                            {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                          {isWeekend && (
                            <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-[8px] font-bold rounded uppercase">
                              Weekend
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {slot.type === 'modern' ? (
                          <div className="p-1 bg-primary/10 rounded-full">
                             <Info size={12} className="text-orange-400" />
                          </div>
                        ) : (
                          <Compass size={12} className="text-orange-500" />
                        )}
                        {isLocked && <Check size={14} className="text-orange-600" />}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button className="w-full py-2 bg-orange-100/50 border border-orange-200 border-dashed rounded-xl flex items-center justify-center gap-2 text-[10px] font-bold text-orange-700 hover:bg-orange-100 transition-colors">
            <Plus size={12} />
            Add Custom Event
          </button>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-orange-200/50">
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-orange-700/60 leading-relaxed max-w-[140px]">
            {activeTab === "ritual" 
              ? "Calculated based on Vastu & planetary alignments for your Rashi."
              : "Optimized for logistical flow and guest engagement."}
          </p>
          <div className="text-[10px] font-bold text-orange-900 flex items-center gap-1">
             <CalendarIcon size={12} />
             {weddingInfo.weddingDuration} Day Celebration
          </div>
        </div>
      </div>
    </div>
  );
}
