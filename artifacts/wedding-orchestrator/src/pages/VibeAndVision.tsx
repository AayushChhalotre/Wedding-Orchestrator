import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useStore, EventInfo } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Users, Clock, Trash2, Camera, Palette, Zap, Music, Shirt, Wind, Copy, Compass, Heart, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { comboPacks, ComboPack } from "@/lib/combo-packs";
import { VisionNarrativeEditor } from "@/components/VisionNarrativeEditor";
import { CommunicationComposer } from "@/components/CommunicationComposer";
import { toast } from "sonner";
import { Share, User } from "lucide-react";
import { Stakeholder } from "@/lib/models/schema";


export default function VibeAndVision() {
  const events = useStore(state => state.events || []);
  const addEvent = useStore(state => state.addEvent);
  const updateEvent = useStore(state => state.updateEvent);
  const removeEvent = useStore(state => state.removeEvent);
  const stakeholders = useStore(state => state.stakeholders || []);
  
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [isStakeholderPickerOpen, setIsStakeholderPickerOpen] = useState(false);

  const generateVisionSummary = useStore(state => state.generateVisionSummary);

  useEffect(() => {
    if (events.length > 0 && !activeTab) {
      setActiveTab(events[0].id);
    }
  }, [events, activeTab]);

  const currentEvent = events.find(e => e.id === activeTab);

  const handleAdd = () => {
    if (newEventName) {
      const id = crypto.randomUUID();
      addEvent({
        id,
        name: newEventName,
        theme: "",
        vibe: "",
        guestCount: 0,
        duration: "",
        locationType: "indoor"
      });
      setActiveTab(id);
      setIsAdding(false);
      setNewEventName("");
    }
  };

  const applyCombo = (combo: ComboPack) => {
    if (activeTab) {
      updateEvent(activeTab, {
        theme: combo.theme,
        vibe: combo.vibe,
        colors: combo.colors,
        gallery: combo.gallery
      });
    }
  };

  const handleAddColor = () => {
    if (currentEvent) {
      const newColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
      const updatedColors = [...(currentEvent.colors || []), newColor];
      updateEvent(currentEvent.id, { colors: updatedColors });
    }
  };

  const generateMagicPalette = () => {
    if (!currentEvent) return;
    
    const vibe = currentEvent.vibe.toLowerCase();
    let palette: string[] = [];
    
    if (vibe.includes("royal") || vibe.includes("opulent")) {
      palette = ["#800000", "#D4AF37", "#2F4F4F", "#FFFDD0", "#000080"];
    } else if (vibe.includes("minimal") || vibe.includes("serene")) {
      palette = ["#DFD3C3", "#708090", "#F5F5DC", "#D3D3D3", "#8B7D6B"];
    } else if (vibe.includes("romantic") || vibe.includes("soft")) {
      palette = ["#FFD1DC", "#FFB6C1", "#E6E6FA", "#FFF0F5", "#B2AC88"];
    } else if (vibe.includes("high energy") || vibe.includes("celebration")) {
      palette = ["#FF00FF", "#00FFFF", "#FFFF00", "#FF4500", "#800080"];
    } else if (vibe.includes("mysterious") || vibe.includes("bold")) {
      palette = ["#36454F", "#50C878", "#B87333", "#1A1A1A", "#4B0082"];
    } else {
      // Default warm wedding palette
      palette = ["#E2725B", "#9CB071", "#FFFDD0", "#F4C430", "#8B4513"];
    }
    
    updateEvent(currentEvent.id, { colors: palette });
  };


  return (
    <Layout>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="mb-16 bg-background border border-border/60 p-6 sm:p-10 lg:p-14 rounded-[2.5rem] shadow-sm relative overflow-hidden group"
        >
          {/* Animated Background Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-primary/10 transition-colors duration-1000" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-[80px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-primary/30" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">Design & Aesthetic</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-serif-display text-serif-gradient leading-[1.1] tracking-tighter">
                Vibe & Vision
              </h1>
              <p className="text-muted-foreground text-base lg:text-lg font-medium mt-6 leading-relaxed max-w-2xl">
                Curating the visual soul of your celebrations. Every ceremony is a story told through curated palettes, textures, and atmosphere.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPreviewMode(!isPreviewMode)}
                className={cn(
                  "px-5 py-2.5 rounded-full border flex items-center gap-2 backdrop-blur-sm transition-all font-bold text-[11px] uppercase tracking-[0.2em] relative overflow-hidden group/btn",
                  isPreviewMode 
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20" 
                    : "bg-primary/5 text-primary border-primary/10 hover:bg-primary/10"
                )}
              >
                <Camera size={16} className="relative z-10" />
                <span className="relative z-10">{isPreviewMode ? "Editing View" : "Preview Mode"}</span>
                {!isPreviewMode && <motion.div layoutId="btn-bg" className="absolute inset-0 bg-primary/5 group-hover/btn:bg-primary/10 transition-colors" />}
              </button>
              <button
                onClick={() => setIsStakeholderPickerOpen(true)}
                className="px-5 py-2.5 rounded-full bg-indigo-600 text-white flex items-center gap-2 hover:bg-indigo-700 transition-all font-bold text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20"
              >
                <Share size={16} />
                Share Vision
              </button>
              <div className="px-5 py-2.5 bg-primary/5 rounded-full border border-primary/10 flex items-center gap-2 backdrop-blur-sm">
                <div className="relative">
                  <Palette size={16} className="text-primary" />
                </div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">Vision Curator</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stakeholder Picker Modal */}
        <AnimatePresence>
          {isStakeholderPickerOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsStakeholderPickerOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden noise-bg p-8"
              >
                <h3 className="text-2xl font-serif-display text-serif-gradient mb-2">Share Your Vision</h3>
                <p className="text-sm text-muted-foreground mb-8">Select a stakeholder to align them with your vision.</p>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                  {stakeholders.length > 0 ? (
                    stakeholders.map(s => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setSelectedStakeholder(s);
                          setIsStakeholderPickerOpen(false);
                          setIsComposerOpen(true);
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
                      >
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-sm">{s.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.type}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <p className="text-center py-8 text-muted-foreground italic text-sm">No stakeholders added yet.</p>
                  )}
                </div>
                
                <button
                  onClick={() => setIsStakeholderPickerOpen(false)}
                  className="w-full mt-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Communication Composer Modal */}
        {isComposerOpen && selectedStakeholder && (
          <CommunicationComposer
            stakeholder={selectedStakeholder}
            isOpen={isComposerOpen}
            onClose={() => setIsComposerOpen(false)}
          />
        )}

        {/* Tab Bar */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide border-b border-border/40 relative">
          {events.map((event) => (
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              key={event.id}
              onClick={() => setActiveTab(event.id)}
              className={cn(
                "px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap border relative",
                activeTab === event.id
                  ? "border-primary text-primary-foreground z-10"
                  : "bg-background border-border text-muted-foreground hover:border-primary/40 hover:bg-muted/30"
              )}
            >
              <span className="relative z-10">{event.name}</span>
              {activeTab === event.id && (
                <motion.div 
                   layoutId="activeTab"
                   className="absolute inset-0 bg-primary rounded-xl shadow-xl shadow-primary/20"
                   transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          ))}
          {!isPreviewMode && (
            <motion.button
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdding(true)}
              className="w-11 h-11 rounded-xl border border-dashed border-muted-foreground/30 flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all shrink-0 bg-muted/20"
            >
              <Plus size={20} />
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isAdding && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="mb-12"
            >
              <div className="bg-background border border-primary/30 p-8 rounded-[2rem] shadow-2xl shadow-primary/5 flex flex-col md:flex-row items-center gap-6">
                <div className="flex-1 w-full">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2.5 ml-1">Ceremony Destination</label>
                  <input 
                    type="text"
                    placeholder="e.g. Sangeet Soirée, Sunset Vows"
                    value={newEventName}
                    onChange={e => setNewEventName(e.target.value)}
                    className="w-full bg-muted/30 border border-border/60 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary/40 transition-all font-medium"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-6">
                  <button 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 md:flex-none px-6 py-4 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAdd}
                    className="flex-1 md:flex-none px-10 py-4 bg-primary text-primary-foreground rounded-2xl text-sm font-bold shadow-xl shadow-primary/20 transition-all"
                  >
                    Create Event
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {currentEvent ? (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={cn(
                "grid grid-cols-1 gap-8 text-left",
                isPreviewMode ? "lg:grid-cols-1" : "lg:grid-cols-12"
              )}
            >
              {/* Left Column: Editor */}
              <div className={cn(
                isPreviewMode ? "lg:col-span-12" : "lg:col-span-7",
                "space-y-8"
              )}>
                <div className="bg-background border border-border/60 p-10 rounded-[2.5rem] shadow-sm relative overflow-hidden group">
                  {!isPreviewMode && (
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          removeEvent(currentEvent.id);
                          setActiveTab(null);
                        }}
                        className="p-2.5 text-destructive hover:bg-destructive/10 rounded-xl transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}

                  <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <label className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          <Palette size={14} className="text-primary" />
                          Visual Narrative
                        </label>
                        {isPreviewMode ? (
                          <div className="text-3xl lg:text-4xl font-serif-display text-serif-gradient ml-1">
                            {currentEvent.theme || "Untitled Theme"}
                          </div>
                        ) : (
                          <input 
                            type="text"
                            value={currentEvent.theme}
                            onChange={e => updateEvent(currentEvent.id, { theme: e.target.value })}
                            placeholder="e.g. Royal Ivory & Champagne"
                            className="w-full bg-muted/20 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium"
                          />
                        )}
                        
                        {/* Color Swatches */}
                        <div className="flex flex-wrap items-center gap-3.5 mt-6 ml-1">
                          {(currentEvent.colors || ["#E5E7EB", "#D1D5DB", "#9CA3AF"]).map((c, i) => (
                            <motion.div
                              key={`${c}-${i}`}
                              initial={{ scale: 0, rotate: -10 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 20, delay: i * 0.05 }}
                              className="w-12 h-12 rounded-2xl border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform relative group/color"
                                style={{ backgroundColor: c }}
                              title={isPreviewMode ? `Color: ${c}` : "Click to copy hex, or use color picker"}
                              onClick={() => {
                                navigator.clipboard.writeText(c);
                                toast.success(`Copied ${c} to clipboard`);
                              }}
                            >
                              {!isPreviewMode && (
                                <input 
                                  type="color"
                                  value={c}
                                  onChange={(e) => {
                                    const updated = [...(currentEvent.colors || [])];
                                    updated[i] = e.target.value;
                                    updateEvent(currentEvent.id, { colors: updated });
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                  className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                              )}
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-opacity pointer-events-none">
                                <Copy size={12} className={cn(
                                  "text-white drop-shadow-md",
                                )} />
                              </div>
                              {!isPreviewMode && (
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const updated = (currentEvent.colors || []).filter((_, index) => index !== i);
                                    updateEvent(currentEvent.id, { colors: updated });
                                  }}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-background border border-border text-destructive rounded-full flex items-center justify-center opacity-0 group-hover/color:opacity-100 transition-all shadow-lg scale-90 group-hover/color:scale-100"
                                >
                                  <Trash2 size={11} />
                                </button>
                              )}
                            </motion.div>
                          ))}
                          {!isPreviewMode && (
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleAddColor}
                              className="w-12 h-12 rounded-2xl border-2 border-dashed border-muted-foreground/20 flex items-center justify-center text-muted-foreground hover:border-primary/40 hover:text-primary transition-all bg-muted/5 shadow-sm"
                            >
                              <Plus size={18} />
                            </motion.button>
                          )}
                          
                          {!isPreviewMode && useStore.getState().weddingInfo.budgetPhase === 'dreaming' && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={generateMagicPalette}
                              className="flex items-center gap-2 px-4 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl text-[10px] font-bold uppercase tracking-widest ml-auto"
                            >
                              <Palette size={14} /> Magic Palette
                            </motion.button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-5">
                        <label className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          <Zap size={14} className="text-primary" />
                          Atmospheric Vibe
                        </label>
                        {isPreviewMode ? (
                          <div className="text-lg font-medium text-muted-foreground italic ml-1">
                            {currentEvent.vibe || "No vibe specified"}
                          </div>
                        ) : (
                          <>
                            <input 
                              type="text"
                              value={currentEvent.vibe}
                              onChange={e => updateEvent(currentEvent.id, { vibe: e.target.value })}
                              placeholder="e.g. Minimal, Ethereal, Classic"
                              className="w-full bg-muted/20 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium"
                            />
                            <div className="flex flex-wrap gap-2 mt-4">
                              {["Ethereal", "Minimal", "Opulent", "Modern", "Classic", "Bohemian", "Regal", "Rustic", "Cinematic", "Intimate"].map(v => (
                                <button
                                  key={v}
                                  onClick={() => updateEvent(currentEvent.id, { vibe: v })}
                                  className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border",
                                    currentEvent.vibe === v 
                                      ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/10"
                                      : "bg-background border-border text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                                  )}
                                >
                                  {v}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Vision Narrative Section */}
                    <div className="pt-8 border-t border-border/40">
                      <VisionNarrativeEditor
                        readOnly={isPreviewMode}
                        value={currentEvent.visionSummary || ""}
                        onSave={(val) => updateEvent(currentEvent.id, { visionSummary: val })}
                        onRegenerate={() => generateVisionSummary(currentEvent.id)}
                      />
                    </div>

                    {/* Sensory Atmosphere Section */}
                    <div className="pt-8 border-t border-border/40">
                      <label className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 ml-1">
                        <Wind size={14} className="text-primary" />
                        Sensory Atmosphere
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">
                            <Wind size={12} /> Atmosphere
                          </label>
                          {isPreviewMode ? (
                            <div className="px-5 py-4 text-sm font-semibold text-foreground ml-1">
                              {currentEvent.atmosphere || <span className="text-muted-foreground/40 font-normal italic">Not specified yet</span>}
                            </div>
                          ) : (
                            <input 
                              type="text"
                              value={currentEvent.atmosphere || ""}
                              onChange={e => updateEvent(currentEvent.id, { atmosphere: e.target.value })}
                              placeholder="e.g. Fragrant Jasmine"
                              className="w-full bg-muted/20 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium"
                            />
                          )}
                        </div>
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">
                            <Music size={12} /> Music Style
                          </label>
                          {isPreviewMode ? (
                            <div className="px-5 py-4 text-sm font-semibold text-foreground ml-1">
                              {currentEvent.musicStyle || <span className="text-muted-foreground/40 font-normal italic">Not specified yet</span>}
                            </div>
                          ) : (
                            <input 
                              type="text"
                              value={currentEvent.musicStyle || ""}
                              onChange={e => updateEvent(currentEvent.id, { musicStyle: e.target.value })}
                              placeholder="e.g. Acoustic Soul"
                              className="w-full bg-muted/20 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium"
                            />
                          )}
                        </div>
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest ml-1">
                            <Shirt size={12} /> Dress Code
                          </label>
                          {isPreviewMode ? (
                            <div className="px-5 py-4 text-sm font-semibold text-foreground ml-1">
                              {currentEvent.dressCode || <span className="text-muted-foreground/40 font-normal italic">Not specified yet</span>}
                            </div>
                          ) : (
                            <input 
                              type="text"
                              value={currentEvent.dressCode || ""}
                              onChange={e => updateEvent(currentEvent.id, { dressCode: e.target.value })}
                              placeholder="e.g. Indian Ethnic"
                              className="w-full bg-muted/20 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-border/40">
                      <div className="space-y-3">
                        <label className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          <Users size={14} className="text-primary" />
                          Guest List
                        </label>
                        {isPreviewMode ? (
                          <div className="px-5 py-4 text-sm font-semibold text-foreground ml-1">
                            {currentEvent.guestCount} Guests
                          </div>
                        ) : (
                          <input 
                            type="number"
                            value={currentEvent.guestCount}
                            onChange={e => updateEvent(currentEvent.id, { guestCount: parseInt(e.target.value) || 0 })}
                            className="w-full bg-muted/20 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium"
                          />
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          <Clock size={14} className="text-primary" />
                          Timeline
                        </label>
                        {isPreviewMode ? (
                          <div className="px-5 py-4 text-sm font-semibold text-foreground ml-1">
                            {currentEvent.duration || <span className="text-muted-foreground/40 font-normal italic">Not specified yet</span>}
                          </div>
                        ) : (
                          <input 
                            type="text"
                            value={currentEvent.duration}
                            onChange={e => updateEvent(currentEvent.id, { duration: e.target.value })}
                            placeholder="e.g. 6 Hours"
                            className="w-full bg-muted/20 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium"
                          />
                        )}
                      </div>
                      <div className="space-y-3">
                        <label className="flex items-center gap-2.5 text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] ml-1">
                          <MapPin size={14} className="text-primary" />
                          Setting
                        </label>
                        {isPreviewMode ? (
                          <div className="px-5 py-4 text-sm font-semibold text-foreground ml-1 capitalize">
                            {currentEvent.locationType} Setting
                          </div>
                        ) : (
                          <select 
                            value={currentEvent.locationType}
                            onChange={e => updateEvent(currentEvent.id, { locationType: e.target.value as any })}
                            className="w-full bg-muted/20 border border-border/50 rounded-2xl px-5 py-4 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary/30 focus:outline-none transition-all font-medium text-foreground appearance-none"
                          >
                            <option value="indoor">Indoor Sanctuary</option>
                            <option value="outdoor">Open Air</option>
                            <option value="hybrid">Fluid Space</option>
                          </select>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Inspiration Gallery */}
                <div className="bg-background border border-border/60 p-10 rounded-[2.5rem] shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-serif-display text-2xl text-foreground">
                      {useStore.getState().weddingInfo.budgetPhase === 'dreaming' ? "Aesthetic Reference" : "The Reality Check"}
                    </h3>
                    {!isPreviewMode ? (
                      <motion.a 
                        whileHover={{ x: 3 }}
                        href={`https://www.pinterest.com/search/pins/?q=${encodeURIComponent(currentEvent.name + " " + currentEvent.theme + " wedding inspiration")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full"
                      >
                        <Compass size={14} /> {useStore.getState().weddingInfo.budgetPhase === 'dreaming' ? "Pinterest Search" : "Visual Inspiration"}
                      </motion.a>
                    ) : (
                      <motion.button
                        whileHover={{ x: 3 }}
                        onClick={() => window.print()}
                        className="text-[11px] font-bold text-primary uppercase tracking-widest hover:underline flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full print:hidden"
                      >
                        <Plus size={14} className="rotate-45" /> Save to PDF
                      </motion.button>
                    )}
                  </div>
                    <div className={cn(
                      "columns-2 gap-4 space-y-4",
                      isPreviewMode ? "sm:columns-4" : "sm:columns-3"
                    )}>
                      {(currentEvent.gallery && currentEvent.gallery.length > 0) ? (
                        currentEvent.gallery.map((img, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25, delay: i * 0.1 }}
                            className="break-inside-avoid rounded-[1.5rem] overflow-hidden border border-border/60 group relative shadow-sm"
                          >
                            <img src={img} alt="Inspiration" className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" />
                            {!isPreviewMode && (
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button 
                                  onClick={() => {
                                    const updated = (currentEvent.gallery || []).filter((_, index) => index !== i);
                                    updateEvent(currentEvent.id, { gallery: updated });
                                  }}
                                  className="w-10 h-10 bg-background/90 text-destructive rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            )}
                          </motion.div>
                        ))
                      ) : (
                        [1, 2, 3, 4].map(i => (
                          <div key={i} className="aspect-[4/5] break-inside-avoid rounded-[1.5rem] bg-muted/30 border border-dashed border-border/60 flex items-center justify-center">
                            <Plus size={24} className="text-muted-foreground/20" />
                          </div>
                        ))
                      )}
                    </div>
                  {!isPreviewMode && (
                    <p className="text-[10px] text-muted-foreground mt-10 text-center font-medium uppercase tracking-widest opacity-60">
                      Pro tip: starter packs auto-populate these aesthetic refs
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Combo Packs / Vendor Alignment */}
              {!isPreviewMode && (
                <div className="lg:col-span-5 space-y-8">
                  {useStore.getState().weddingInfo.budgetPhase === 'dreaming' ? (
                    <div className="bg-background border border-border/60 p-10 rounded-[2.5rem] shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                        <Heart className="text-primary" size={20} />
                        <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-foreground">Starter Packs</h3>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-10 leading-relaxed">
                        Elevate your {currentEvent.name} instantly. Apply a curated aesthetic pack to synchronize your vision.
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                        {comboPacks.map((combo) => (
                          <motion.button
                            whileHover={{ y: -4, scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            key={combo.id}
                            onClick={() => applyCombo(combo)}
                            className="group relative h-40 rounded-3xl overflow-hidden border border-border/60 transition-all shadow-sm"
                          >
                            <img 
                              src={combo.image} 
                              alt={combo.name}
                              className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                            <div className="absolute bottom-5 left-6 right-6 text-left">
                              <div className="text-white font-serif-display text-lg tracking-tight mb-1">{combo.name}</div>
                              <div className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{combo.theme}</div>
                            </div>
                            <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                              <div className="bg-white text-black px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl">Apply</div>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-background border border-border/60 p-10 rounded-[2.5rem] shadow-sm">
                      <div className="flex items-center gap-3 mb-8">
                        <ShieldCheck className="text-emerald-500" size={20} />
                        <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-foreground">Vendor Alignment</h3>
                      </div>
                      <p className="text-sm font-medium text-muted-foreground mb-10 leading-relaxed">
                        Confirmed partners bringing your {currentEvent.name} vision to life.
                      </p>
                      
                      <div className="space-y-4">
                        {[
                          { category: "Venue", status: "Booked", vendor: "The Grand Palace" },
                          { category: "Decor", status: "Reviewing", vendor: "Floral Dreams Studio" },
                          { category: "Catering", status: "Confirmed", vendor: "Royal Bites" }
                        ].map((alignment, i) => (
                          <div key={i} className="p-5 bg-muted/20 rounded-3xl border border-border/40 flex items-center justify-between">
                            <div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{alignment.category}</p>
                              <p className="text-sm font-bold">{alignment.vendor}</p>
                            </div>
                            <span className={cn(
                              "text-[9px] font-bold px-3 py-1.5 rounded-full uppercase tracking-tighter",
                              alignment.status === "Booked" ? "bg-emerald-50 text-emerald-600" : 
                              alignment.status === "Reviewing" ? "bg-amber-50 text-amber-600" : "bg-primary/5 text-primary"
                            )}>
                              {alignment.status}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-10 p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <p className="text-xs font-medium text-primary leading-relaxed text-center italic">
                          "Visual reality matches 85% of your original vision. Keep the champagne tones consistent across all vendors."
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          ) : (
            <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-border">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-muted-foreground" size={24} />
              </div>
              <h3 className="text-lg font-serif-display text-foreground mb-2">No ceremonies yet</h3>
              <p className="text-sm text-muted-foreground mb-6">Start by adding your first event or ceremony.</p>
              <button
                onClick={() => setIsAdding(true)}
                className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl"
              >
                Add Ceremony
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
