import { Layout } from "@/components/Layout";
import { type Reminder } from "@/data/mockData";
import { useStore } from "@/store/useStore";
import { useState, useEffect } from "react";
import { Mail, MessageCircle, Phone, RefreshCw, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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

export default function Reminders() {
  const reminders = useStore(state => state.reminders);
  const activities = useStore(state => state.activities);
  const sendReminder = useStore(state => state.sendReminder);
  const [activeTab, setActiveTab] = useState("Reminders");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Header */}
        <motion.div 
          initial={mounted ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-serif-display text-serif-gradient leading-tight">
            Reminders & Activity
          </h1>
          <p className="text-muted-foreground text-sm mt-2 font-medium">
            Track what's been sent, seen, and responded to.
          </p>
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
          <div>
            {/* Desktop header */}
            <div className="hidden lg:grid grid-cols-[200px_80px_1fr_120px_48px] gap-4 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground font-medium border-b border-border mb-1">
              <span>Recipient</span>
              <span>Channel</span>
              <span>Task</span>
              <span>Status</span>
              <span />
            </div>

            <div className="space-y-1">
              {reminders.map((reminder) => {
                const status = statusConfig[reminder.status];
                const ChannelIcon = channelIcon[reminder.channel];
                return (
                  <div
                    key={reminder.id}
                    className="bg-card border border-card-border rounded-lg"
                    data-testid={`reminder-row-${reminder.id}`}
                  >
                    {/* Mobile layout */}
                    <div className="lg:hidden px-4 py-3">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div>
                          <p className="text-sm font-semibold text-foreground">{reminder.recipient}</p>
                          <p className="text-xs text-muted-foreground">{reminder.role}</p>
                        </div>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0", status.color)}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{reminder.task}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <ChannelIcon size={12} />
                          <span className="capitalize">{reminder.channel}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{reminder.scheduledFor}</span>
                        <button onClick={() => sendReminder(reminder.id)} className="ml-auto text-muted-foreground hover:text-foreground" data-testid={`btn-resend-${reminder.id}`}>
                          <RefreshCw size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Desktop layout */}
                    <div className="hidden lg:grid grid-cols-[200px_80px_1fr_120px_48px] gap-4 items-center px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-foreground truncate">{reminder.recipient}</p>
                        <p className="text-xs text-muted-foreground">{reminder.role}</p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <ChannelIcon size={13} />
                        <span className="capitalize">{reminder.channel}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{reminder.task}</p>
                      <span className={cn("text-[11px] px-2 py-0.5 rounded-full font-medium w-fit", status.color)}>
                        {status.label}
                      </span>
                      <button
                        onClick={() => sendReminder(reminder.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        title="Resend"
                        data-testid={`btn-resend-${reminder.id}`}
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Compose new */}
            <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Need to send a reminder not in the list?
              </p>
              <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                Compose reminder
              </button>
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
    </Layout>
  );
}
