import { useState } from "react";
import { Check, ChevronDown, Upload, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const sections = [
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

  const toggleSection = (id: string) => {
    setOpenSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Check size={28} className="text-primary" />
          </div>
          <h1 className="font-serif-display text-2xl lg:text-3xl text-foreground mb-3">
            Details submitted!
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Thank you for providing your information. Priya & Arjun will review your
            submission and reach out if they have any questions.
          </p>
          <p className="text-muted-foreground text-xs mt-4">
            Wedding date: <strong>November 8, 2025</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Simple header - no app chrome */}
      <header className="bg-card border-b border-border px-4 sm:px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="flex items-center gap-0.5 text-muted-foreground/50">
                <Circle size={4} strokeWidth={1.5} />
                <Circle size={4} strokeWidth={1.5} />
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">
                AI Wedding Orchestrator
              </span>
            </div>
            <h1 className="font-serif-display text-lg text-foreground">
              Priya & Arjun — November 8, 2025
            </h1>
          </div>
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            Catering form
          </span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Catering details request
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We need a few details to finalize catering for our wedding. This takes
            5–10 minutes. All information will be shared only with Priya & Arjun.
          </p>
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
            onClick={() => setSubmitted(true)}
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
            data-testid="btn-vendor-submit"
          >
            Submit details
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
