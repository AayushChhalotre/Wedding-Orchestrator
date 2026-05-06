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
  Image as ImageIcon,
  CreditCard,
  FileText,
  ChevronRight,
  AlertCircle,
  Pencil
} from "lucide-react";
import { useStore } from "@/store/useStore";
import { Stakeholder } from "@/lib/models/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommunicationComposerProps {
  stakeholder: Stakeholder | null;
  onClose: () => void;
  isOpen: boolean;
  initialTemplateId?: string;
  reminderId?: string;
  bulkReminderIds?: string[];
}

const TEMPLATES = [
  {
    id: "nudge",
    label: "Gentle Nudge",
    icon: Bell,
    subject: "Checking in: [Task] ✨",
    body: "Hi [Name], we're so grateful for your help with the [Task]! Whenever you have a moment, we'd love an update so we can keep our planning journey flowing smoothly. No pressure at all, just excited to see everything coming together! ✨",
    type: "reminder"
  },
  {
    id: "status",
    label: "Status Check",
    icon: Clock,
    subject: "Quick question about [Task] status",
    body: "Hey [Name], we're doing a little sync on our end for the [Task]. We want to make sure you have everything you need from us to make your magic happen! Could you let us know where we stand? We're here to support you too! 🙏",
    type: "update"
  },
  {
    id: "vision",
    label: "Vision Alignment",
    icon: Sparkles,
    subject: "Refining our vision for the [Event]! 🎨",
    body: "Hi [Name], our vision for the [Event] is becoming so much clearer! We wanted to share this summary with you to make sure we're all dreaming in the same direction:\n\n\"[VisionSummary]\"\n\nDoes this align with what you're seeing? We value your creative eye and would love to hear your thoughts! 🌸",
    type: "vision"
  },
  {
    id: "payment",
    label: "Payment Update",
    icon: CreditCard,
    subject: "Payment status for [Task]",
    body: "Hi [Name], we're just checking in on the payment schedule for [Task]. We want to make sure everything is settled on time so there are no hiccups! Could you confirm if you've received the latest installment or if there's anything else we need to do? Thank you! 💳",
    type: "reminder"
  },
  {
    id: "contract",
    label: "Contract Review",
    icon: FileText,
    subject: "Checking in on the contract for [Task]",
    body: "Hi [Name], we've had a chance to look over the details for [Task]. We have a couple of minor questions/refinements before we sign off! Would you be free for a quick 5-minute chat or should we send them over here? Excited to finalize this! 📝",
    type: "update"
  },
  {
    id: "handoff",
    label: "Idea Handoff",
    icon: ImageIcon,
    subject: "Details for [Task] handoff",
    body: "Hi [Name], we're ready to pass the baton on the [Task]! We've put together our vision and some details here: [Link]\n\nOur overall vibe: [VisionSummary]\n\nWe trust your expertise to bring this to life. Excited to see your magic touch! 🚀",
    type: "handoff"
  },
  {
    id: "snooze",
    label: "Partner Snooze",
    icon: Clock,
    subject: "A little more time for [Task]? ❤️",
    body: "Hey [Name], I'm feeling a bit of 'planning fatigue' today. Can we snooze the [Task] until [SnoozeDate]? I'd love to revisit this when I have a fresh mind and can give it the attention it deserves. Love you! ❤️",
    type: "internal"
  }
];

export const CommunicationComposer: React.FC<CommunicationComposerProps> = ({ 
  stakeholder, 
  onClose, 
  isOpen,
  initialTemplateId,
  reminderId,
  bulkReminderIds
}) => {
  const [bulkIndex, setBulkIndex] = useState(0);
  const [unresolvedPlaceholders, setUnresolvedPlaceholders] = useState<string[]>([]);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [newContactValue, setNewContactValue] = useState("");
  const [contactMethod, setContactMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [messageBody, setMessageBody] = useState("");
  const [bulkMessages, setBulkMessages] = useState<Record<string, string>>({});
  const [bulkStep, setBulkStep] = useState<"config" | "review">("config");
  const [isPreparing, setIsPreparing] = useState(false);

  const { 
    stakeholders, 
    reminders, 
    tasks, 
    events, 
    weddingInfo, 
    logCommunication, 
    sendReminder, 
    bulkSendReminders,
    updateStakeholderContact 
  } = useStore();

  const isBulk = !!bulkReminderIds && bulkReminderIds.length > 0;

  const currentStakeholder = isBulk && bulkReminderIds 
    ? (stakeholders.find(st => st.id === reminders.find(rem => rem.id === bulkReminderIds[bulkIndex])?.recipientId) || 
       stakeholders.find(st => st.name === reminders.find(rem => rem.id === bulkReminderIds[bulkIndex])?.recipient))
    : stakeholder;

  const isContactMissing = contactMethod === "whatsapp" 
    ? !currentStakeholder?.phone 
    : !currentStakeholder?.email;

  useEffect(() => {
    if (initialTemplateId) {
      const template = TEMPLATES.find(t => t.id === initialTemplateId);
      if (template) setSelectedTemplate(template);
    }
  }, [initialTemplateId, isOpen]);
  const generateMessage = (tmpl: typeof TEMPLATES[0], targetStakeholder: Stakeholder | null, targetReminder?: any) => {
    // Safety check for targetStakeholder and tasks array
    if (!targetStakeholder) return tmpl.body;
    
    const stakeholderTasks = tasks.filter(t => targetStakeholder.tasks?.includes(t.id) ?? false);
    const taskTitle = targetReminder?.task || stakeholderTasks[0]?.title || "our pending items";
    const taskId = targetReminder?.taskId || stakeholderTasks[0]?.id;
    const primaryEvent = events[0] || { name: "Wedding", vibe: "Elegant" };

    const portalUrl = taskId 
      ? `${window.location.origin}/vendor-portal/${taskId}`
      : `${window.location.origin}/vibe-and-vision`;

    const event = events.find(e => e.id === primaryEvent.id) || primaryEvent;
    const visionSummary = (event as any)?.visionSummary || weddingInfo?.visionSummary || `We're aiming for a ${event?.vibe || "unique"} atmosphere for our ${event?.name || "Wedding"}.`;

    const snoozeDate = new Date();
    snoozeDate.setDate(snoozeDate.getDate() + 7);
    const snoozeDateStr = snoozeDate.toLocaleDateString("en-IN", { weekday: 'long', month: 'short', day: 'numeric' });

    return tmpl.body
      .replace("[Name]", targetStakeholder.name || "there")
      .replace("[Task]", taskTitle)
      .replace("[Event]", primaryEvent.name)
      .replace("[Vibe]", primaryEvent.vibe || "Serene")
      .replace("[VisionSummary]", visionSummary)
      .replace("[SnoozeDate]", snoozeDateStr)
      .replace("[Link]", portalUrl);
  };

  useEffect(() => {
    if (!isBulk) {
      setMessageBody(generateMessage(selectedTemplate, stakeholder, reminders.find(r => r.id === reminderId)));
    } else {
      const messages: Record<string, string> = {};
      bulkReminderIds.forEach(id => {
        const r = reminders.find(rem => rem.id === id);
        if (r) {
          const s = stakeholders.find(st => st.id === r.recipientId) || 
                    stakeholders.find(st => st.name === r.recipient);
          if (s) {
            messages[id] = generateMessage(selectedTemplate, s, r);
          }
        }
      });
      setBulkMessages(messages);
    }
  }, [selectedTemplate, stakeholder, reminderId, bulkReminderIds, reminders, stakeholders, tasks, events, weddingInfo, isBulk]);

  useEffect(() => {
    const text = isBulk && bulkReminderIds ? bulkMessages[bulkReminderIds[bulkIndex]] : messageBody;
    if (text) {
      const regex = /\[([^\]]+)\]/g;
      const matches = text.match(regex) || [];
      setUnresolvedPlaceholders(matches);
    } else {
      setUnresolvedPlaceholders([]);
    }
  }, [messageBody, bulkMessages, bulkIndex, isBulk, bulkReminderIds]);

  const handleUpdateContact = () => {
    if (currentStakeholder && newContactValue) {
      updateStakeholderContact(
        currentStakeholder.id, 
        contactMethod === "whatsapp" ? { phone: newContactValue } : { email: newContactValue }
      );
      setIsEditingContact(false);
      setNewContactValue("");
    }
  };

  const handleSend = () => {
    if (isContactMissing && !isEditingContact) {
      setIsEditingContact(true);
      setNewContactValue(contactMethod === "whatsapp" ? (currentStakeholder as any)?.phone || "" : currentStakeholder?.email || "");
      return;
    }

    setIsPreparing(true);

    if (!isBulk) {
      const encodedBody = encodeURIComponent(messageBody);
      const encodedSubject = encodeURIComponent(selectedTemplate.subject.replace("[Task]", "Update"));
      
      let url = "";
      if (contactMethod === "whatsapp") {
        const phone = stakeholder ? (stakeholder as any).phone : "919876543210"; 
        url = `https://wa.me/${phone}?text=${encodedBody}`;
      } else if (stakeholder?.email) {
        url = `mailto:${stakeholder.email}?subject=${encodedSubject}&body=${encodedBody}`;
      }

      setTimeout(() => {
        if (url) window.open(url, "_blank");
        if (reminderId) {
          sendReminder(reminderId);
        } else if (stakeholder?.id) {
          logCommunication(stakeholder.id, contactMethod, selectedTemplate.id, messageBody);
        }
        setIsPreparing(false);
        onClose();
      }, 800);
    } else {
      // Bulk send - handle one by one to avoid browser popup blockers
      const id = bulkReminderIds![bulkIndex];
      const r = reminders.find(rem => rem.id === id);
      if (r) {
        const s = stakeholders.find(st => st.id === r.recipientId) || 
                  stakeholders.find(st => st.name === r.recipient);
        if (s) {
          const body = bulkMessages[id];
          const encodedBody = encodeURIComponent(body);
          const phone = (s as any).phone || "919876543210";
          const url = contactMethod === "whatsapp" 
            ? `https://wa.me/${phone}?text=${encodedBody}`
            : `mailto:${s.email}?subject=${encodeURIComponent(selectedTemplate.subject)}&body=${encodedBody}`;
          
          window.open(url, "_blank");
        }
      }

      // Auto-advance
      if (bulkIndex < bulkReminderIds!.length - 1) {
        setTimeout(() => {
          setBulkIndex(prev => prev + 1);
          setIsPreparing(false);
        }, 400);
      } else {
        // All sent
        setTimeout(() => {
          bulkSendReminders(bulkReminderIds!, bulkMessages, contactMethod);
          setIsPreparing(false);
          onClose();
        }, 1000);
      }
    }
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
            className="relative w-full max-w-4xl overflow-hidden bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-3xl shadow-2xl shadow-indigo-500/10"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-rose-50/50 dark:from-indigo-950/20 dark:to-rose-950/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500 rounded-xl shadow-lg shadow-indigo-500/20">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-serif-display text-slate-800 dark:text-slate-100">
                    {isBulk ? `Bulk Communication (${bulkReminderIds.length})` : "Share Update"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">
                    {isBulk ? "Reviewing multiple messages" : `To ${stakeholder?.name || "Stakeholder"}`}
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

            <div className="flex flex-col md:flex-row h-[600px]">
              {/* Sidebar - Settings (Always visible or in config step) */}
              {bulkStep === "config" && (
                <div className="w-full md:w-72 border-r border-slate-100 dark:border-slate-800 p-6 space-y-8 bg-slate-50/30 dark:bg-slate-950/20 overflow-y-auto">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">
                      Select Channel
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-3">
                      Core Template
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
                          <span className="font-bold text-xs">{tmpl.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Main Composer Area */}
              <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 overflow-hidden">
                {!isBulk ? (
                  <div className="flex-1 flex flex-col p-8">
                    <div className="flex-1 space-y-4">
                      {isContactMissing && (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-amber-900 dark:text-amber-200">Attention Needed</p>
                              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                                Missing {contactMethod === "whatsapp" ? "phone number" : "email address"} for {currentStakeholder?.name}
                              </p>
                            </div>
                          </div>
                          {!isEditingContact ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setIsEditingContact(true);
                                setNewContactValue(contactMethod === "whatsapp" ? (currentStakeholder as any)?.phone || "" : currentStakeholder?.email || "");
                              }}
                              className="text-[10px] h-8 rounded-xl border-amber-200 hover:bg-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/50"
                            >
                              <Pencil className="w-3 h-3 mr-1" />
                              Add Info
                            </Button>
                          ) : (
                            <div className="flex items-center gap-2">
                              <input 
                                autoFocus
                                value={newContactValue}
                                onChange={(e) => setNewContactValue(e.target.value)}
                                placeholder={`Enter ${contactMethod === "whatsapp" ? "phone" : "email"}`}
                                className="text-xs px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 w-48 outline-none focus:ring-2 focus:ring-amber-500/20"
                              />
                              <Button size="sm" onClick={handleUpdateContact} className="h-8 rounded-lg px-3 bg-amber-600 hover:bg-amber-700 text-white text-[10px]">
                                Save
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between mb-2 px-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                            Draft Message
                          </label>
                          {unresolvedPlaceholders.length > 0 && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full animate-pulse">
                              <AlertCircle className="w-3 h-3" />
                              {unresolvedPlaceholders.length} unresolved tags
                            </span>
                          )}
                        </div>
                        <div className="relative group">
                          <textarea
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            className={cn(
                              "w-full h-[380px] p-6 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all resize-none text-slate-700 dark:text-slate-300 font-medium leading-relaxed text-sm shadow-inner",
                              unresolvedPlaceholders.length > 0 && "border-rose-200 dark:border-rose-900/30 ring-rose-500/5"
                            )}
                          />
                          <div className="absolute top-4 right-4 pointer-events-none transition-transform duration-500 group-hover:rotate-12">
                            <Sparkles className="w-5 h-5 text-indigo-400/20" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    {bulkStep === "config" ? (
                      <div className="p-8 space-y-6 overflow-y-auto">
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                          <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            How bulk sending works
                          </h4>
                          <p className="text-xs text-indigo-700/80 dark:text-indigo-400/80 leading-relaxed font-medium">
                            We've customized the "{selectedTemplate.label}" template for each of your {bulkReminderIds.length} recipients. 
                            You can review each individual message on the next screen before sending.
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between px-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Our Shared Journey</p>
                            <span className="text-[10px] font-bold text-indigo-500/80 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
                              {bulkReminderIds.length} Hearts to Nudge
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            {bulkReminderIds.map(id => {
                              const r = reminders.find(rem => rem.id === id);
                              const t = tasks.find(task => task.id === (r?.taskId || r?.task));
                              return r && (
                                <div key={id} className="group relative flex flex-col gap-3 p-4 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-all cursor-default">
                                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Sparkles className="w-3 h-3 text-rose-400" />
                                  </div>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-rose-400 text-white flex items-center justify-center text-[10px] font-bold shadow-sm ring-2 ring-white dark:ring-slate-900">
                                      {r.recipient.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">{r.recipient}</p>
                                      <p className="text-[9px] text-indigo-500/80 font-bold uppercase tracking-wider">{r.role}</p>
                                    </div>
                                    <span className={cn(
                                      "text-[9px] px-2 py-0.5 rounded-full font-bold",
                                      r.channel === "whatsapp" ? "bg-green-50 text-green-600" : "bg-indigo-50 text-indigo-600"
                                    )}>
                                      {r.channel === "whatsapp" ? "WhatsApp" : "Email"}
                                    </span>
                                  </div>
                                  <div className="pt-3 border-t border-slate-50 dark:border-slate-800/50">
                                    <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.1em] mb-1.5">Touching base on</p>
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-300 leading-tight line-clamp-1">{r.task}</p>
                                    {t && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <span className="text-[9px] px-1.5 py-0.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100/50 font-bold flex items-center gap-1">
                                          <Clock className="w-2.5 h-2.5" />
                                          {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </span>
                                        {(t.estimatedCost ?? 0) > 0 && (
                                          <span className="text-[9px] px-1.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100/50 font-bold">
                                            ₹{t.estimatedCost?.toLocaleString()}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
                    ) : (
                        <AnimatePresence mode="popLayout">
                          {bulkReminderIds.map((id, idx) => {
                            const r = reminders.find(rem => rem.id === id);
                            if (!r) return null;
                            const isActive = idx === bulkIndex;
                            const isSent = idx < bulkIndex;

                            return isActive && (
                              <motion.div 
                                key={id} 
                                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className={cn(
                                  "group bg-white dark:bg-slate-900 rounded-3xl border transition-all duration-500 overflow-hidden",
                                  isActive ? "border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02] z-10" : "border-slate-200 dark:border-slate-800 opacity-60 scale-95",
                                  isSent && "border-green-200 dark:border-green-900/30 opacity-40 grayscale-[0.5]"
                                )}
                              >
                                <div className="p-6">
                                  {isContactMissing && (
                                    <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-3">
                                        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                                        <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider">
                                          Missing {contactMethod} Info
                                        </p>
                                      </div>
                                      {!isEditingContact ? (
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          onClick={() => {
                                            setIsEditingContact(true);
                                            setNewContactValue(contactMethod === "whatsapp" ? (currentStakeholder as any)?.phone || "" : currentStakeholder?.email || "");
                                          }}
                                          className="text-[10px] h-7 rounded-lg"
                                        >
                                          Add
                                        </Button>
                                      ) : (
                                        <div className="flex items-center gap-2">
                                          <input 
                                            autoFocus
                                            value={newContactValue}
                                            onChange={(e) => setNewContactValue(e.target.value)}
                                            className="text-[10px] px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-amber-200 w-32 outline-none"
                                          />
                                          <Button size="sm" onClick={handleUpdateContact} className="h-7 rounded-lg bg-amber-600 text-white text-[10px]">
                                            Save
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                      <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ring-2 ring-white dark:ring-slate-900 transition-colors",
                                        isSent ? "bg-green-500 text-white" : "bg-gradient-to-tr from-indigo-50 to-indigo-100 dark:from-indigo-900/40 dark:to-indigo-800/40 text-indigo-600 dark:text-indigo-400"
                                      )}>
                                        {isSent ? <CheckCircle2 className="w-4 h-4" /> : r.recipient.charAt(0)}
                                      </div>
                                      <div>
                                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{r.recipient}</p>
                                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{r.role}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {unresolvedPlaceholders.length > 0 && (
                                        <span className="flex items-center gap-1 text-[8px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full">
                                          <AlertCircle className="w-2.5 h-2.5" />
                                          {unresolvedPlaceholders.length} Tags
                                        </span>
                                      )}
                                      <span className="text-[9px] font-bold text-indigo-500/60 uppercase tracking-widest bg-indigo-50/50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-full">
                                        {r.channel}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="relative">
                                    <textarea
                                      value={bulkMessages[id] || ""}
                                      disabled={!isActive}
                                      onChange={(e) => setBulkMessages({...bulkMessages, [id]: e.target.value})}
                                      className={cn(
                                        "w-full h-48 p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-950/30 border text-xs font-medium leading-relaxed resize-none transition-all",
                                        isActive ? "border-indigo-100 dark:border-indigo-900/50 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400" : "border-transparent",
                                        unresolvedPlaceholders.length > 0 && isActive && "border-rose-200 dark:border-rose-900/30"
                                      )}
                                      placeholder="Type your personal touch here..."
                                    />
                                    {isActive && (
                                      <div className="absolute bottom-3 right-3 text-[9px] font-bold text-slate-300 dark:text-slate-600">
                                        {bulkMessages[id]?.length || 0} characters
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </AnimatePresence>
                      </div>
                    )}

                  </div>
                )}

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3 bg-white dark:bg-slate-900">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      if (isBulk && bulkStep === "review") {
                        setBulkStep("config");
                      } else {
                        onClose();
                      }
                    }}
                    className="rounded-2xl px-6 font-bold text-slate-500"
                  >
                    {isBulk && bulkStep === "review" ? "Back" : "Cancel"}
                  </Button>
                  
                  {isBulk && bulkStep === "config" ? (
                    <Button
                      onClick={() => setBulkStep("review")}
                      className="rounded-2xl px-8 bg-foreground text-background hover:bg-slate-800 font-bold gap-2 shadow-lg transition-all"
                    >
                      Review All Messages
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSend}
                      disabled={isPreparing}
                      className={cn(
                        "rounded-2xl px-8 font-bold gap-2 shadow-xl transition-all min-w-[180px]",
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
                          {isBulk ? `Send ${bulkReminderIds.length} Now` : (contactMethod === "whatsapp" ? "Open WhatsApp" : "Open Email")}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
