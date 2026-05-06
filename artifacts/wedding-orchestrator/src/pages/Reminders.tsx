import { Layout } from "@/components/Layout";
import { type Reminder, type Stakeholder } from "@/lib/models/schema";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { Mail, MessageCircle, Phone, RefreshCw, Clock, X, ChevronRight, Check, Send, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CommunicationComposer } from "@/components/CommunicationComposer";

const statusConfig: Record<Reminder["status"], { label: string; color: string }> = {
  scheduled: { label: "Scheduled", color: "bg-muted text-muted-foreground" },
  sent: { label: "Sent", color: "bg-primary/10 text-primary" },
  viewed: { label: "Viewed", color: "bg-amber-100 text-amber-700" },
  responded: { label: "Responded", color: "bg-green-100 text-green-700" },
};

const channelIcon: Record<Reminder["channel"], React.FC<{ size?: number; className?: string }>> = {
  email: Mail,
  whatsapp: MessageCircle,
  sms: Phone,
};

const tabs = ["Reminders", "Activity"];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};


export default function Reminders() {
  const reminders = useStore(state => state.reminders);
  const activities = useStore(state => state.activities);
  const stakeholders = useStore(state => state.stakeholders);
  const [activeTab, setActiveTab] = useState("Reminders");
  const [mounted, setMounted] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState<Reminder | null>(null);
  const [selectedStakeholder, setSelectedStakeholder] = useState<Stakeholder | null>(null);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isStakeholderSelectorOpen, setIsStakeholderSelectorOpen] = useState(false);

  const [selectedReminderIds, setSelectedReminderIds] = useState<string[]>([]);
  const bulkSendReminders = useStore(state => state.bulkSendReminders);
  const getBulkSendCooldown = useStore(state => state.getBulkSendCooldown);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCooldown(getBulkSendCooldown());
    }, 1000);
    return () => clearInterval(timer);
  }, [getBulkSendCooldown]);

  const toggleSelection = (id: string) => {
    setSelectedReminderIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedReminderIds.length === reminders.length) {
      setSelectedReminderIds([]);
    } else {
      setSelectedReminderIds(reminders.map(r => r.id));
    }
  };

  const handleResend = (reminder: Reminder) => {
    const stakeholder = stakeholders.find(s => s.id === reminder.recipientId) || 
                       stakeholders.find(s => s.name === reminder.recipient);
    
    if (stakeholder) {
      setSelectedReminder(reminder);
      setSelectedStakeholder(stakeholder);
      setIsComposerOpen(true);
    }
  };

  const handleBulkSend = () => {
    if (selectedReminderIds.length === 0 || cooldown > 0) return;
    setIsComposerOpen(true);
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Header */}
        <motion.div 
          initial={mounted ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl lg:text-4xl font-serif-display text-serif-gradient leading-tight">
              Reminders & Activity
            </h1>
            <p className="text-muted-foreground text-sm mt-2 font-medium">
              Track what's been sent, seen, and responded to.
            </p>
          </div>

          {cooldown > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-xl">
              <Clock size={14} className="text-amber-600 animate-pulse" />
              <span className="text-xs font-bold text-amber-700">Cooldown active: {cooldown}s</span>
            </div>
          )}
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                activeTab === tab
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              data-testid={`reminder-tab-${tab.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Reminders" && (
          <div className="relative pb-24">
            {/* Desktop header */}
            <div className="hidden lg:grid grid-cols-[40px_200px_80px_1fr_120px_48px] gap-4 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground font-bold border-b border-border mb-1 items-center">
              <div 
                className="w-4 h-4 rounded border border-muted-foreground/30 flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                onClick={toggleSelectAll}
              >
                {selectedReminderIds.length === reminders.length && (
                  <Check size={10} className="text-primary" strokeWidth={4} />
                )}
              </div>
              <span>Recipient</span>
              <span>Channel</span>
              <span>Task</span>
              <span>Status</span>
              <span />
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-1"
            >
              {reminders.map((reminder) => {
                const stakeholder = stakeholders.find(s => s.id === reminder.recipientId) || 
                                   stakeholders.find(s => s.name === reminder.recipient);
                const isMissingInfo = reminder.channel === "whatsapp" 
                  ? !stakeholder?.phone 
                  : !stakeholder?.email;
                
                const status = statusConfig[reminder.status];
                const ChannelIcon = channelIcon[reminder.channel];
                const isSelected = selectedReminderIds.includes(reminder.id);

                return (
                  <motion.div
                    key={reminder.id}
                    variants={itemVariants}
                    className={cn(
                      "bg-card border rounded-lg transition-all",
                      isSelected ? "border-primary/40 bg-primary/5" : "border-card-border"
                    )}
                    data-testid={`reminder-row-${reminder.id}`}
                  >

                    {/* Mobile layout */}
                    <div className="lg:hidden px-4 py-3 flex gap-3">
                      <div 
                        className={cn(
                          "w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-1",
                          isSelected ? "bg-primary border-primary text-white" : "border-muted-foreground/30"
                        )}
                        onClick={() => toggleSelection(reminder.id)}
                      >
                        {isSelected && <Check size={12} strokeWidth={4} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-semibold text-foreground truncate">{reminder.recipient}</p>
                              {isMissingInfo && (
                                <AlertCircle size={12} className="text-rose-500 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{reminder.role}</p>
                          </div>

                          <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0", status.color)}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{reminder.task}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock size={12} />
                            <span>{reminder.scheduledFor}</span>
                          </div>
                          <button 
                            onClick={() => handleResend(reminder)} 
                            className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-muted rounded-lg transition-all" 
                            data-testid={`btn-resend-${reminder.id}`}
                          >
                            <RefreshCw size={13} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden lg:grid grid-cols-[40px_200px_80px_1fr_120px_48px] gap-4 items-center px-4 py-3">
                      <div 
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-all",
                          isSelected ? "bg-primary border-primary text-white shadow-sm" : "border-muted-foreground/30 hover:border-primary/50"
                        )}
                        onClick={() => toggleSelection(reminder.id)}
                      >
                        {isSelected && <Check size={10} strokeWidth={4} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-foreground truncate">{reminder.recipient}</p>
                          {isMissingInfo && (
                            <div className="flex items-center gap-1 text-[9px] font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded-full shrink-0">
                              <AlertCircle size={10} />
                              Missing Info
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">{reminder.role}</p>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ChannelIcon size={13} />
                        <span className="capitalize">{reminder.channel}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{reminder.task}</p>
                      <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-bold w-fit", status.color)}>
                        {status.label}
                      </span>
                      <button
                        onClick={() => handleResend(reminder)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                        title="Personalize and Resend"
                        data-testid={`btn-resend-${reminder.id}`}
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>


            {/* Bulk Action Bar */}
            <AnimatePresence>
              {selectedReminderIds.length > 0 && (
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 100, opacity: 0 }}
                  className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4"
                >
                  <div className="bg-foreground text-background rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 border border-white/10 backdrop-blur-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/20">
                        {selectedReminderIds.length}
                      </div>
                      <p className="text-sm font-bold">Selected to nudge</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedReminderIds([])}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X size={18} />
                      </button>
                      <button 
                        disabled={cooldown > 0}
                        onClick={handleBulkSend}
                        className={cn(
                          "px-4 py-2 bg-primary text-white text-sm font-bold rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 active:scale-95 transition-all",
                          cooldown > 0 && "opacity-50 grayscale cursor-not-allowed"
                        )}
                      >
                        <Send size={14} />
                        Review & Send All
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Compose new */}
            <div className="mt-6 p-6 bg-muted/30 rounded-2xl border border-dashed border-border/60">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-foreground">Need to send a custom reminder?</p>
                  <p className="text-xs text-muted-foreground">Select a stakeholder and compose a personalized message.</p>
                </div>
                <button 
                  onClick={() => setIsStakeholderSelectorOpen(true)}
                  className="px-6 py-2.5 bg-background text-foreground border border-border text-sm font-bold rounded-xl hover:bg-muted transition-all active:scale-95 shadow-sm"
                >
                  Compose custom
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "Activity" && (
          <div className="space-y-1">
            {activities.map((activity, index) => {
              const iconColor =
                activity.icon === "vendor"
                  ? "bg-primary/10 text-primary"
                  : activity.icon === "couple"
                  ? "bg-accent/40 text-accent-foreground"
                  : "bg-muted text-muted-foreground";

              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 px-4 py-4 bg-card border border-card-border rounded-lg"
                  data-testid={`activity-row-${activity.id}`}
                >
                  {/* Timeline line */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold", iconColor)}>
                      {activity.icon === "vendor" ? "V" : activity.icon === "couple" ? "C" : "S"}
                    </div>
                    {index < activities.length - 1 && (
                      <div className="w-px h-4 bg-border mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm text-foreground leading-snug">{activity.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={11} className="text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CommunicationComposer
        stakeholder={selectedStakeholder}
        reminderId={selectedReminder?.id}
        bulkReminderIds={selectedReminderIds.length > 0 ? selectedReminderIds : undefined}
        isOpen={isComposerOpen}
        initialTemplateId={selectedReminder || selectedReminderIds.length > 0 ? "nudge" : undefined}
        onClose={() => {
          setIsComposerOpen(false);
          setSelectedReminder(null);
          setSelectedStakeholder(null);
          if (selectedReminderIds.length > 0) setSelectedReminderIds([]);
        }}
      />

      {/* Stakeholder Selector Modal */}
      <AnimatePresence>
        {isStakeholderSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsStakeholderSelectorOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden bg-card rounded-3xl shadow-2xl border border-border"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold">Select Stakeholder</h3>
                <button 
                  onClick={() => setIsStakeholderSelectorOpen(false)}
                  className="p-2 hover:bg-muted rounded-full transition-colors"
                >
                  <X size={18} className="text-muted-foreground" />
                </button>
              </div>
              <div className="p-4 max-h-[400px] overflow-y-auto space-y-2">
                {stakeholders.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedStakeholder(s);
                      setSelectedReminder(null);
                      setIsStakeholderSelectorOpen(false);
                      setIsComposerOpen(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-all text-left border border-transparent hover:border-border"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold",
                      s.type === "vendor" ? "bg-primary/10 text-primary" : "bg-accent text-accent-foreground"
                    )}>
                      {s.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.role}</p>
                    </div>
                    <ChevronRight size={14} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
