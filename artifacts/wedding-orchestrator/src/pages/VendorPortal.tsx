import { Check, ChevronDown, Upload, Circle, ArrowLeft, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useLocation } from "wouter";

interface VendorField {
  id: string;
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  options?: string[];
}

interface VendorSection {
  id: string;
  title: string;
  fields: VendorField[];
}

const sections: VendorSection[] = [
  {
    id: "event",
    title: "Event details",
    fields: [
      { id: "date", label: "Service date", type: "date", required: true },
      { id: "start_time", label: "Service start time", type: "time", required: true },
      { id: "venue", label: "Venue name", type: "text", placeholder: "e.g. The Leela Mumbai", required: true },
      { id: "headcount", label: "Final headcount", type: "number", placeholder: "e.g. 280", required: true },
    ],
  },
  {
    id: "menu",
    title: "Menu & dietary",
    fields: [
      { id: "menu_type", label: "Menu type", type: "select", options: ["Vegetarian", "Non-vegetarian", "Both / Mixed"], required: true },
      { id: "dietary", label: "Dietary restrictions", type: "textarea", placeholder: "e.g. 15 guests are Jain, 10 are allergic to nuts…" },
      { id: "menu_choice", label: "Preferred menu option", type: "select", options: ["Option A – Classic thali", "Option B – Live stations", "Option C – Fusion buffet"] },
    ],
  },
  {
    id: "logistics",
    title: "Logistics",
    fields: [
      { id: "setup_time", label: "Setup access required from", type: "time" },
      { id: "staff_count", label: "Number of service staff you'll bring", type: "number", placeholder: "e.g. 25" },
      { id: "equipment", label: "Equipment or rentals needed from venue", type: "textarea", placeholder: "e.g. chafing dishes, serving tables…" },
      { id: "comments", label: "Any other notes or requirements", type: "textarea", placeholder: "Share anything that will help us coordinate better." },
    ],
  },
];

export default function VendorPortal() {
  const [openSections, setOpenSections] = useState<string[]>(["event"]);
  const [submitted, setSubmitted] = useState(false);
  const submitVendorData = useStore(state => state.submitVendorData);
  const weddingInfo = useStore(state => state.weddingInfo);
  const [, setLocation] = useLocation();
  const { taskId } = (useStore.getState() as any); // This is not ideal, wouter gives params via hook
  // Correct way with wouter:
  // @ts-ignore
  const params = React.useContext((window as any).WouterContext)?.params;
  // Actually, I'll use the standard wouter hook if available or just useStore
  
  // Let's use a more robust way to get the ID from the URL since I don't want to break the build with missing types
  const pathParts = window.location.pathname.split("/");
  const routeTaskId = pathParts[pathParts.length - 1];

  const tasks = useStore(state => state.tasks);
  const currentTask = tasks.find(t => t.id === routeTaskId);
  const taskTitle = currentTask?.title || "Catering details request";
  const weddingDateStr = weddingInfo.weddingDate || "November 8, 2025";

  const toggleSection = (id: string) => {
    setOpenSections((prev: string[]) =>
      prev.includes(id) ? prev.filter((s: string) => s !== id) : [...prev, id]
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-primary" />
          </div>
          <h1 className="font-serif-display text-3xl lg:text-4xl text-serif-gradient leading-tight mb-3">
            Details submitted!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Thank you for providing your information. {weddingInfo.coupleName} will review your
            submission and reach out if they have any questions.
          </p>
          <p className="text-muted-foreground text-xs mt-4">
            Wedding date: <strong>{weddingDateStr}</strong>
          </p>
          <button 
            onClick={() => setLocation("/dashboard")}
            className="mt-8 px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Premium header - no app chrome */}
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground group"
              aria-label="Go back"
            >
              <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-0.5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <div className="flex items-center gap-1 text-primary/40">
                  <div className="w-1 h-1 rounded-full bg-current" />
                  <div className="w-1 h-1 rounded-full bg-current" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 font-bold">
                  Wedding Orchestrator
                </span>
              </div>
              <h1 className="font-serif-display text-lg text-foreground tracking-tight">
                {weddingInfo.coupleName} <span className="text-muted-foreground/30 font-sans mx-1">/</span> <span className="text-primary/70">{weddingDateStr}</span>
              </h1>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Secure Form
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-10 pt-4">
          <div className="w-10 h-1 text-primary/20 bg-current rounded-full mb-6" />
          <h2 className="text-3xl lg:text-4xl font-serif-display text-serif-gradient leading-tight mb-3">
            {taskTitle}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium max-w-lg mb-6">
            We need a few details to finalize this request. This takes
            5–10 minutes. All information will be shared only with {weddingInfo.coupleName}.
          </p>

          {/* Vision alignment preview */}
          <div className="p-4 rounded-2xl bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Vision Alignment Active</p>
              <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70 font-medium">Your services will be matched against our "Serene Flora" aesthetic.</p>
            </div>
          </div>
        </div>

        {/* Accordion sections */}
        <div className="space-y-3 mb-8">
          {sections.map((section, sIndex) => {
            const isOpen = openSections.includes(section.id);
            return (
              <div
                key={section.id}
                className="bg-card border border-card-border rounded-xl overflow-hidden"
                data-testid={`vendor-section-${section.id}`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
                  data-testid={`vendor-section-toggle-${section.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                      {sIndex + 1}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{section.title}</span>
                  </div>
                  <ChevronDown
                    size={16}
                    className={cn(
                      "text-muted-foreground transition-transform",
                      isOpen ? "rotate-0" : "-rotate-90"
                    )}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 space-y-4 border-t border-border pt-4">
                    {section.fields.map((field) => (
                      <div key={field.id}>
                        <label className="block text-sm font-medium text-foreground mb-1.5">
                          {field.label}
                          {field.required && (
                            <span className="text-destructive ml-1">*</span>
                          )}
                        </label>

                        {field.type === "textarea" ? (
                          <textarea
                            rows={3}
                            placeholder={field.placeholder}
                            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                            data-testid={`vendor-field-${field.id}`}
                          />
                        ) : field.type === "select" ? (
                          <select
                            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                            data-testid={`vendor-field-${field.id}`}
                          >
                            <option value="">Select an option</option>
                            {field.options?.map((opt) => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            placeholder={field.placeholder}
                            className="w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                            data-testid={`vendor-field-${field.id}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* File upload */}
          <div className="bg-card border border-card-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-1">Attachments</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Upload any relevant documents (menu PDF, equipment list, contract draft).
            </p>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
              <Upload size={20} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Drag & drop files here, or{" "}
                <span className="text-primary font-medium">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => {
              submitVendorData(routeTaskId);
              setSubmitted(true);
            }}
            className="flex-1 px-6 py-4 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
            data-testid="btn-vendor-submit"
          >
            Confirm & Finalize Handoff
          </button>
          <button className="px-6 py-3 bg-card border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted/50 transition-colors">
            Save as draft
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Your information is private and only shared with the couple.
        </p>
      </div>
    </div>
  );
}
