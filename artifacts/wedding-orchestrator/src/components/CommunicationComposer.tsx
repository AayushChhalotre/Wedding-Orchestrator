import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Send, 
  MessageSquare, 
  Sparkles, 
  Bell, 
  Clock, 
  Eye, 
  CheckCircle2,
  Image as ImageIcon
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Stakeholder } from "@/lib/models/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommunicationComposerProps {
  stakeholder: Stakeholder;
  onClose: () => void;
  isOpen: boolean;
}

const TEMPLATES = [
  {
    id: "nudge",
    label: "Gentle Nudge",
    icon: Bell,
    subject: "Checking in: [Task] ✨",
    body: "Hi [Name], I hope you're having a lovely week! We're just touching base on the [Task] when you have a moment. No rush at all, just trying to keep everything moving smoothly. Looking forward to hearing from you! ✨",
    type: "reminder"
  },
  {
    id: "status",
    label: "Status Check",
    icon: Clock,
    subject: "Quick question about [Task] status",
    body: "Hey [Name], we're currently updating our planning dashboard and realized we hadn't synced up on [Task] lately. Could you let us know where we stand? We want to make sure we're on track for the big day! 🙏",
    type: "update"
  },
  {
    id: "vision",
    label: "Vision Alignment",
    icon: Sparkles,
    subject: "Refining our vision for the [Event]! 🎨",
    body: "Hi [Name], we've been spending some time dreaming about the [Event] and wanted to share our latest vision summary with you:\n\n[VisionSummary]\n\nWe're so excited to see how this comes together. Let us know if you have any thoughts! 🌸",
    type: "vision"
  },
  {
    id: "handoff",
    label: "Idea Handoff",
    icon: ImageIcon,
    subject: "Details for [Task] handoff",
    body: "Hi [Name], we're ready to pass the baton on [Task]! We've put together a full dossier including our vision, requirements, and timeline here: [Link]\n\n[VisionSummary]\n\nLet's catch up soon to discuss the next steps! 🚀",
    type: "handoff"
  }
];

export const CommunicationComposer: React.FC<CommunicationComposerProps> = ({ 
  stakeholder, 
  onClose, 
  isOpen 
}) => {
  const { events, tasks } = useStore();
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [messageBody, setMessageBody] = useState("");
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [isPreparing, setIsPreparing] = useState(false);

  const stakeholderTasks = tasks.filter(t => stakeholder.tasks.includes(t.id));
  const primaryTask = stakeholderTasks[0]?.title || "our pending items";
  const primaryTaskId = stakeholderTasks[0]?.id;
  const primaryEvent = events[0] || { name: "Wedding", vibe: "Elegant" };

  useEffect(() => {
    // Generate vendor portal link if applicable
    const portalUrl = primaryTaskId 
      ? `${window.location.origin}/vendor-portal/${primaryTaskId}`
      : `${window.location.origin}/vibe-and-vision`;

    // Get vision summary if available
    const event = events.find(e => e.id === primaryEvent.id) || primaryEvent;
    const visionSummary = event.visionSummary || `We're aiming for a ${event.vibe || "unique"} atmosphere for our ${event.name}.`;

    // Replace placeholders
    let body = selectedTemplate.body
      .replace("[Name]", stakeholder.name)
      .replace("[Task]", primaryTask)
      .replace("[Event]", primaryEvent.name)
      .replace("[Vibe]", primaryEvent.vibe || "Serene")
      .replace("[VisionSummary]", visionSummary)
      .replace("[Link]", portalUrl);
    
    setMessageBody(body);
  }, [selectedTemplate, stakeholder, primaryTask, primaryEvent, primaryTaskId, events]);

  const handleSend = () => {
    setIsPreparing(true);

    const encodedBody = encodeURIComponent(messageBody);
    const encodedSubject = encodeURIComponent(selectedTemplate.subject.replace("[Task]", primaryTask));
    
    let url = "";
    if (contactMethod === "whatsapp") {
      // Use a mock phone number if not available
      const phone = (stakeholder as any).phone || "919876543210"; 
      url = `https://wa.me/${phone}?text=${encodedBody}`;
    } else {
      url = `mailto:${stakeholder.email}?subject=${encodedSubject}&body=${encodedBody}`;
    }

    // Small delay for "feel"
    setTimeout(() => {
      window.open(url, "_blank");
      setIsPreparing(false);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-2xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl shadow-2xl shadow-indigo-500/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-rose-50/50 dark:from-indigo-950/20 dark:to-rose-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                    Share Update
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                    Sending to <span className="text-indigo-600 dark:text-indigo-400">{stakeholder.name}</span>
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-[500px]">
              {/* Sidebar - Templates & Method */}
              <div className="w-full md:w-64 border-r border-slate-100 dark:border-slate-800 p-4 space-y-6 bg-slate-50/30 dark:bg-slate-950/20">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">
                    Channel
                  </p>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-xl">
                    <button
                      onClick={() => setContactMethod("whatsapp")}
                      className={cn(
                        "py-2 px-3 rounded-lg text-xs font-bold transition-all",
                        contactMethod === "whatsapp" 
                          ? "bg-white dark:bg-slate-700 text-green-600 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      WhatsApp
                    </button>
                    <button
                      onClick={() => setContactMethod("email")}
                      className={cn(
                        "py-2 px-3 rounded-lg text-xs font-bold transition-all",
                        contactMethod === "email" 
                          ? "bg-white dark:bg-slate-700 text-indigo-600 shadow-sm" 
                          : "text-slate-500 hover:text-slate-700"
                      )}
                    >
                      Email
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 mb-3">
                    Templates
                  </p>
                  <div className="space-y-2">
                    {TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => setSelectedTemplate(tmpl)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left group",
                          selectedTemplate.id === tmpl.id 
                            ? "bg-white dark:bg-slate-800 shadow-md border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400"
                            : "hover:bg-white/50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                        )}
                      >
                        <div className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          selectedTemplate.id === tmpl.id 
                            ? "bg-indigo-500 text-white"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:text-indigo-500"
                        )}>
                          <tmpl.icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-semibold text-xs">{tmpl.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {selectedTemplate.id === "vision" && (
                  <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider mb-2">
                      Vision Context
                    </p>
                    <div className="flex gap-1.5">
                      <div className="w-8 h-8 rounded-lg bg-indigo-200/50 dark:bg-indigo-800/50" />
                      <div className="w-8 h-8 rounded-lg bg-rose-200/50 dark:bg-rose-800/50" />
                      <div className="w-8 h-8 rounded-lg bg-amber-200/50 dark:bg-amber-800/50" />
                    </div>
                  </div>
                )}
              </div>

              {/* Main Composer Area */}
              <div className="flex-1 flex flex-col p-6 bg-white dark:bg-slate-900">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">
                      Draft Message
                    </label>
                    <textarea
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      className="w-full h-72 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-sm"
                    />
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-6 flex items-center justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    className="rounded-xl px-6 font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSend}
                    disabled={isPreparing}
                    className={cn(
                      "rounded-xl px-8 font-bold gap-2 shadow-lg transition-all min-w-[160px]",
                      contactMethod === "whatsapp" 
                        ? "bg-green-600 hover:bg-green-700 shadow-green-500/20" 
                        : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                    )}
                  >
                    {isPreparing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Preparing...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {contactMethod === "whatsapp" ? "Open WhatsApp" : "Open Email"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
