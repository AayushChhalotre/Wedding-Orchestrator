import { Task, Phase } from "@/data/mockData";
import { v4 as uuidv4 } from "uuid";

export interface TimelineGenerationInput {
  partner1: string;
  partner2: string;
  weddingDate: string;
  tradition: string;
  guests: string;
  budget: string;
  city: string;
  isDestination?: boolean;
  isMultiDay?: boolean;
}

export const traditionTemplates: Record<string, Partial<Task>[]> = {
  "Traditional Hindu Wedding": [
    { title: "Consult Priest for Muhrat (Auspicious dates)", category: "Rituals", phaseId: "foundation", priority: "high", effort: 2 },
    { title: "Book Pandit/Priest", category: "Rituals", phaseId: "foundation", priority: "medium", effort: 1 },
    { title: "Finalize guest list for Haldi & Mehendi", category: "Guests", phaseId: "guest-management", priority: "medium", effort: 3 },
    { title: "Book Mehendi Artist", category: "Rituals", phaseId: "vendor-locking", priority: "medium", effort: 2 },
  ],
  "Christian Wedding": [
    { title: "Book Church / Chapel", category: "Venue", phaseId: "foundation", priority: "high", effort: 3 },
    { title: "Arrange for Choir/Music", category: "Rituals", phaseId: "vendor-locking", priority: "medium", effort: 2 },
    { title: "Coordinate with Officiant", category: "Rituals", phaseId: "foundation", priority: "medium", effort: 1 },
  ],
  "Minimalist / Court Wedding": [
    { title: "Submit Marriage Notice at Registrar Office", category: "Legal", phaseId: "foundation", priority: "high", effort: 3 },
    { title: "Coordinate with 3 witnesses", category: "Legal", phaseId: "finalization", priority: "medium", effort: 1 },
  ]
};

const basePhases: Phase[] = [
  { id: "foundation", name: "Foundation", dateRange: "Month 1-2", taskCount: 0, atRisk: 0, color: "teal" },
  { id: "vendor-locking", name: "Vendor Locking", dateRange: "Month 3-5", taskCount: 0, atRisk: 0, color: "teal" },
  { id: "guest-management", name: "Guest Management", dateRange: "Month 6-8", taskCount: 0, atRisk: 0, color: "teal" },
  { id: "ceremony-planning", name: "Ceremony & Rituals", dateRange: "Month 9-11", taskCount: 0, atRisk: 0, color: "gold" },
  { id: "finalization", name: "Finalization", dateRange: "Event Month", taskCount: 0, atRisk: 0, color: "gold" },
];

export class TimelineGenerator {
  generate(input: TimelineGenerationInput): { tasks: Task[], phases: Phase[] } {
    const tasks: Task[] = [];
    const initials = (input.partner1[0] || "") + (input.partner2[0] || "");
    const coupleName = `${input.partner1} & ${input.partner2}`;

    // 1. Add Universal Tasks
    const universalTasks: Partial<Task>[] = [
      { id: "t-guest-est", title: "Confirm initial guest count estimate", category: "Guests", phaseId: "foundation", priority: "high", effort: 2, whyItMatters: "Your guest count dictates almost every other decision, especially venue and budget." },
      { id: "t-budget", title: "Set overall wedding budget", category: "Finance", phaseId: "foundation", priority: "high", effort: 3, whyItMatters: "A clear budget prevents stress later and helps prioritize what matters most to you." },
      { id: "t-venue", title: "Finalize venue shortlist and site visits", category: "Venue", phaseId: "foundation", priority: "high", effort: 5, dependencies: ["t-guest-est"], whyItMatters: "Venues book up fast. Securing your date and space is the first big milestone." },
      { id: "t-caterer", title: "Book caterer", category: "Food", phaseId: "vendor-locking", priority: "high", effort: 3, dependencies: ["t-venue"], whyItMatters: "Good food is what guests remember most. Secure your favorite early." },
      { id: "t-photo", title: "Book photographer & videographer", category: "Photography", phaseId: "vendor-locking", priority: "medium", effort: 4, dependencies: ["t-venue"], whyItMatters: "These are the memories that last a lifetime. Top talent is often booked a year in advance." },
    ];

    // 2. Conditional Tasks
    
    // Destination Wedding Tasks
    const isDestination = input.isDestination || input.city.toLowerCase().includes("destination");
    
    if (isDestination) {
      universalTasks.push(
        { id: "t-visa", title: "Check visa & travel requirements", category: "Logistics", phaseId: "foundation", priority: "high", effort: 3, whyItMatters: "International or remote travel requires early coordination to ensure all your loved ones can make it." },
        { id: "t-travel", title: "Book group travel / room blocks", category: "Logistics", phaseId: "vendor-locking", priority: "high", effort: 4, whyItMatters: "Securing travel early saves costs and ensures everyone stays together." },
        { id: "t-welcome-hamper", title: "Design Welcome Hampers for out-of-town guests", category: "Guests", phaseId: "ceremony-planning", priority: "low", effort: 3, whyItMatters: "A thoughtful touch for guests traveling long distances." }
      );
    }

    // Multi-day Celebration Tasks
    const isMultiDay = input.isMultiDay || input.guests.includes("-") || parseInt(input.guests) > 300; 
    if (isMultiDay) {
      universalTasks.push(
        { id: "t-events-seq", title: "Define sequence of events", category: "Planning", phaseId: "foundation", priority: "medium", effort: 3, whyItMatters: "Managing multiple events requires a clear flow to keep guests engaged and logistics smooth." },
        { id: "t-day-wise-itinerary", title: "Finalize day-wise itinerary for guests", category: "Guests", phaseId: "ceremony-planning", priority: "medium", effort: 2, whyItMatters: "Helps guests plan their time and outfits for various rituals." },
        { id: "t-hosp-desk", title: "Setup guest hospitality desk", category: "Logistics", phaseId: "finalization", priority: "medium", effort: 2, whyItMatters: "A dedicated point of contact helps guests navigate the multi-day celebration." }
      );
    }

    // 3. Add Tradition Specific Tasks
    const traditionTasks = traditionTemplates[input.tradition] || [];

    // Combine and finalize tasks
    [...universalTasks, ...traditionTasks].forEach((t, index) => {
      tasks.push({
        id: t.id || `t-gen-${index}`,
        title: t.title || "Untitled Task",
        dueDate: this.calculateDueDate(input.weddingDate, t.phaseId || "foundation"),
        status: "not_started",
        phase: basePhases.find(p => p.id === (t.phaseId || "foundation"))?.name || "Foundation",
        phaseId: t.phaseId || "foundation",
        owner: coupleName,
        ownerInitials: initials.toUpperCase(),
        ownerType: "couple",
        category: t.category || "General",
        dependencies: t.dependencies || [],
        blocks: [], 
        whyItMatters: t.whyItMatters || "This is a critical part of your wedding planning journey.",
        notes: "",
        priority: t.priority || "medium",
        effort: t.effort || 2,
      });
    });

    // 4. Fill 'blocks' field based on dependencies
    tasks.forEach(task => {
      task.dependencies.forEach(depId => {
        const depTask = tasks.find(t => t.id === depId);
        if (depTask) {
          depTask.blocks.push(task.id);
        }
      });
    });

    return { tasks, phases: basePhases };
  }

  private calculateDueDate(weddingDate: string, phaseId: string): string {
    const wedding = new Date(weddingDate);
    if (isNaN(wedding.getTime())) return new Date().toISOString(); // Fallback
    
    const now = new Date();
    const totalDays = (wedding.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    
    // Distribute tasks realistically across the available time
    let offsetDays = 0;
    switch(phaseId) {
      case "foundation": offsetDays = totalDays * 0.15; break;
      case "vendor-locking": offsetDays = totalDays * 0.4; break;
      case "guest-management": offsetDays = totalDays * 0.6; break;
      case "ceremony-planning": offsetDays = totalDays * 0.85; break;
      case "finalization": offsetDays = totalDays * 0.98; break;
      default: offsetDays = totalDays * 0.5;
    }

    const dueDate = new Date();
    dueDate.setDate(now.getDate() + offsetDays);
    return dueDate.toISOString();
  }
}
