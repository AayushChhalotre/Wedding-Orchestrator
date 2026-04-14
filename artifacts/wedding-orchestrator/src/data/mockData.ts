export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  status: "not_started" | "in_progress" | "done" | "at_risk" | "overdue";
  phase: string;
  phaseId: string;
  owner: string;
  ownerInitials: string;
  ownerType: "couple" | "vendor" | "family";
  category: string;
  dependencies: string[];
  blocks: string[];
  whyItMatters: string;
  notes: string;
  vendorPortalLink?: string;
}

export interface Phase {
  id: string;
  name: string;
  dateRange: string;
  taskCount: number;
  atRisk: number;
  color: string;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  type: "vendor" | "family";
  initials: string;
  taskCount: number;
  overdue: number;
  waitingOn: number;
  progress: number;
  nextTask: string;
  nextTaskDue: string;
  email: string;
  tasks: string[];
}

export interface Reminder {
  id: string;
  recipient: string;
  role: string;
  channel: "email" | "whatsapp" | "sms";
  task: string;
  status: "scheduled" | "sent" | "viewed" | "responded";
  scheduledFor: string;
}

export interface Activity {
  id: string;
  timestamp: string;
  description: string;
  icon: "vendor" | "couple" | "system";
  actor: string;
}

export interface Risk {
  id: string;
  title: string;
  explanation: string;
  impact: string;
  cta: string;
  severity: "high" | "medium";
}

export const weddingInfo = {
  coupleName: "Priya & Arjun",
  brideName: "Priya Sharma",
  groomName: "Arjun Mehta",
  weddingDate: "November 8, 2025",
  city: "Mumbai",
  daysLeft: 208,
};

export const phases: Phase[] = [
  {
    id: "foundation",
    name: "Foundation",
    dateRange: "Now – May 2025",
    taskCount: 12,
    atRisk: 2,
    color: "teal",
  },
  {
    id: "vendor-locking",
    name: "Vendor Locking",
    dateRange: "May – Jul 2025",
    taskCount: 18,
    atRisk: 3,
    color: "teal",
  },
  {
    id: "guest-management",
    name: "Guest Management",
    dateRange: "Jun – Aug 2025",
    taskCount: 10,
    atRisk: 1,
    color: "teal",
  },
  {
    id: "ceremony-planning",
    name: "Ceremony & Rituals",
    dateRange: "Aug – Oct 2025",
    taskCount: 15,
    atRisk: 0,
    color: "gold",
  },
  {
    id: "finalization",
    name: "Finalization",
    dateRange: "Oct – Nov 2025",
    taskCount: 22,
    atRisk: 4,
    color: "gold",
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Finalize venue shortlist and book site visits",
    dueDate: "2025-04-22",
    status: "at_risk",
    phase: "Foundation",
    phaseId: "foundation",
    owner: "Priya & Arjun",
    ownerInitials: "PA",
    ownerType: "couple",
    category: "Venue",
    dependencies: [],
    blocks: ["t3", "t5", "t8"],
    whyItMatters: "Venue locks the date for all vendor bookings and sets the capacity constraint for invitations.",
    notes: "Three venues shortlisted: The Leela, ITC Maratha, Taj Lands End. Awaiting availability confirmation.",
    vendorPortalLink: undefined,
  },
  {
    id: "t2",
    title: "Confirm final guest count estimate",
    dueDate: "2025-04-18",
    status: "overdue",
    phase: "Foundation",
    phaseId: "foundation",
    owner: "Priya & Arjun",
    ownerInitials: "PA",
    ownerType: "couple",
    category: "Guests",
    dependencies: [],
    blocks: ["t1", "t4"],
    whyItMatters: "Guest count determines venue capacity, catering quantity, and invitation print run.",
    notes: "Current estimate: 280 guests. Family is still adding names.",
    vendorPortalLink: undefined,
  },
  {
    id: "t3",
    title: "Book caterer and submit dietary requirements form",
    dueDate: "2025-05-10",
    status: "not_started",
    phase: "Foundation",
    phaseId: "foundation",
    owner: "Suresh Catering",
    ownerInitials: "SC",
    ownerType: "vendor",
    category: "Food",
    dependencies: ["t2", "t1"],
    blocks: ["t9"],
    whyItMatters: "Caterer must be confirmed before invitations can mention menu or dietary RSVP.",
    notes: "Three caterers contacted. Suresh Events is the preferred choice.",
    vendorPortalLink: "/vendor-portal",
  },
  {
    id: "t4",
    title: "Send save-the-date to outstation guests",
    dueDate: "2025-05-01",
    status: "not_started",
    phase: "Foundation",
    phaseId: "foundation",
    owner: "Priya & Arjun",
    ownerInitials: "PA",
    ownerType: "couple",
    category: "Guests",
    dependencies: ["t2"],
    blocks: ["t7"],
    whyItMatters: "Outstation guests need at least 6 months for travel planning.",
    notes: "",
  },
  {
    id: "t5",
    title: "Book wedding photographer",
    dueDate: "2025-05-15",
    status: "in_progress",
    phase: "Vendor Locking",
    phaseId: "vendor-locking",
    owner: "Rishi Kapoor Photography",
    ownerInitials: "RK",
    ownerType: "vendor",
    category: "Photography",
    dependencies: ["t1"],
    blocks: [],
    whyItMatters: "Top photographers book 12 months in advance. Waiting longer risks losing preferred vendors.",
    notes: "Portfolio review done. Contract review in progress.",
    vendorPortalLink: "/vendor-portal",
  },
  {
    id: "t6",
    title: "Design and print wedding invitations",
    dueDate: "2025-07-01",
    status: "not_started",
    phase: "Vendor Locking",
    phaseId: "vendor-locking",
    owner: "Priya & Arjun",
    ownerInitials: "PA",
    ownerType: "couple",
    category: "Invitations",
    dependencies: ["t3", "t2"],
    blocks: ["t7"],
    whyItMatters: "Physical invitations require 4 weeks for printing and delivery.",
    notes: "",
  },
  {
    id: "t7",
    title: "Distribute invitations to all guests",
    dueDate: "2025-08-01",
    status: "not_started",
    phase: "Guest Management",
    phaseId: "guest-management",
    owner: "Mama Sharma",
    ownerInitials: "MS",
    ownerType: "family",
    category: "Guests",
    dependencies: ["t6", "t4"],
    blocks: [],
    whyItMatters: "Invitations must go out 3 months before to allow RSVP time.",
    notes: "",
  },
  {
    id: "t8",
    title: "Finalize decor concept and sign decorator",
    dueDate: "2025-06-01",
    status: "not_started",
    phase: "Vendor Locking",
    phaseId: "vendor-locking",
    owner: "Priya & Arjun",
    ownerInitials: "PA",
    ownerType: "couple",
    category: "Decor",
    dependencies: ["t1"],
    blocks: [],
    whyItMatters: "Decorator needs venue floor plan and 5 months lead time for custom elements.",
    notes: "",
  },
  {
    id: "t9",
    title: "Submit final headcount to caterer",
    dueDate: "2025-10-15",
    status: "not_started",
    phase: "Finalization",
    phaseId: "finalization",
    owner: "Priya & Arjun",
    ownerInitials: "PA",
    ownerType: "couple",
    category: "Food",
    dependencies: ["t3"],
    blocks: [],
    whyItMatters: "Caterer requires confirmed numbers 3 weeks before the event.",
    notes: "",
  },
  {
    id: "t10",
    title: "Coordinate mehendi artist booking",
    dueDate: "2025-06-15",
    status: "not_started",
    phase: "Vendor Locking",
    phaseId: "vendor-locking",
    owner: "Sunita Mehta",
    ownerInitials: "SM",
    ownerType: "family",
    category: "Rituals",
    dependencies: [],
    blocks: [],
    whyItMatters: "Mehendi artists for large functions book early during wedding season.",
    notes: "",
  },
  {
    id: "t11",
    title: "Plan sangeet program and music setlist",
    dueDate: "2025-08-15",
    status: "not_started",
    phase: "Ceremony & Rituals",
    phaseId: "ceremony-planning",
    owner: "Priya & Arjun",
    ownerInitials: "PA",
    ownerType: "couple",
    category: "Rituals",
    dependencies: [],
    blocks: [],
    whyItMatters: "Sangeet choreography requires 2 months of practice.",
    notes: "",
  },
  {
    id: "t12",
    title: "Arrange airport pickup for outstation relatives",
    dueDate: "2025-11-05",
    status: "not_started",
    phase: "Finalization",
    phaseId: "finalization",
    owner: "Raj Mehta",
    ownerInitials: "RM",
    ownerType: "family",
    category: "Logistics",
    dependencies: ["t7"],
    blocks: [],
    whyItMatters: "25+ relatives flying in need coordinated pickup 3 days before the event.",
    notes: "",
  },
];

export const nextSteps = [
  {
    id: "ns1",
    title: "Confirm guest count and share with venue",
    dueDate: "2025-04-18",
    daysLeft: -2,
    isOverdue: true,
    reason: "Guest count is 2 days overdue and blocks venue finalization and caterer booking.",
    blocks: ["Venue shortlist", "Caterer booking", "Save-the-dates"],
    taskId: "t2",
  },
  {
    id: "ns2",
    title: "Book venue site visits for top 3 choices",
    dueDate: "2025-04-22",
    daysLeft: 2,
    isOverdue: false,
    reason: "Site visits must happen before end of April to lock venue before peak season.",
    blocks: ["Caterer booking", "Decor planning", "Photographer brief"],
    taskId: "t1",
  },
  {
    id: "ns3",
    title: "Send save-the-dates to outstation guests",
    dueDate: "2025-05-01",
    daysLeft: 11,
    isOverdue: false,
    reason: "45 guests are traveling from abroad. They need 6+ months to arrange travel.",
    blocks: ["Guest RSVP tracking", "Hotel block booking"],
    taskId: "t4",
  },
];

export const stakeholders: Stakeholder[] = [
  {
    id: "sh1",
    name: "Suresh Catering Co.",
    role: "Caterer",
    type: "vendor",
    initials: "SC",
    taskCount: 4,
    overdue: 0,
    waitingOn: 2,
    progress: 25,
    nextTask: "Confirm menu by 10 May",
    nextTaskDue: "2025-05-10",
    email: "suresh@catering.com",
    tasks: ["t3", "t9"],
  },
  {
    id: "sh2",
    name: "Rishi Kapoor Photography",
    role: "Photographer",
    type: "vendor",
    initials: "RK",
    taskCount: 3,
    overdue: 0,
    waitingOn: 1,
    progress: 60,
    nextTask: "Sign contract by 15 May",
    nextTaskDue: "2025-05-15",
    email: "rishi@rkphotography.in",
    tasks: ["t5"],
  },
  {
    id: "sh3",
    name: "Mama Sharma",
    role: "Bride's Mother / Guest coordinator",
    type: "family",
    initials: "MS",
    taskCount: 5,
    overdue: 1,
    waitingOn: 0,
    progress: 20,
    nextTask: "Distribute invitations by 1 Aug",
    nextTaskDue: "2025-08-01",
    email: "mama@sharma.com",
    tasks: ["t7"],
  },
  {
    id: "sh4",
    name: "Sunita Mehta",
    role: "Groom's Sister / Mehendi coordinator",
    type: "family",
    initials: "SM",
    taskCount: 3,
    overdue: 0,
    waitingOn: 0,
    progress: 10,
    nextTask: "Book mehendi artist by 15 Jun",
    nextTaskDue: "2025-06-15",
    email: "sunita@mehta.com",
    tasks: ["t10"],
  },
  {
    id: "sh5",
    name: "Raj Mehta",
    role: "Groom's Father / Logistics",
    type: "family",
    initials: "RM",
    taskCount: 4,
    overdue: 0,
    waitingOn: 1,
    progress: 5,
    nextTask: "Arrange airport pickups by 5 Nov",
    nextTaskDue: "2025-11-05",
    email: "raj@mehta.com",
    tasks: ["t12"],
  },
  {
    id: "sh6",
    name: "Bloom & Thread Decor",
    role: "Decorator",
    type: "vendor",
    initials: "BT",
    taskCount: 6,
    overdue: 0,
    waitingOn: 3,
    progress: 0,
    nextTask: "Submit concept proposal by 1 Jun",
    nextTaskDue: "2025-06-01",
    email: "hello@bloomthread.in",
    tasks: ["t8"],
  },
];

export const reminders: Reminder[] = [
  {
    id: "r1",
    recipient: "Suresh Catering Co.",
    role: "Caterer",
    channel: "email",
    task: "Submit menu options for approval",
    status: "sent",
    scheduledFor: "2025-04-14",
  },
  {
    id: "r2",
    recipient: "Rishi Kapoor Photography",
    role: "Photographer",
    channel: "email",
    task: "Return signed contract",
    status: "viewed",
    scheduledFor: "2025-04-13",
  },
  {
    id: "r3",
    recipient: "Mama Sharma",
    role: "Bride's Mother",
    channel: "whatsapp",
    task: "Finalize guest list additions",
    status: "responded",
    scheduledFor: "2025-04-12",
  },
  {
    id: "r4",
    recipient: "Bloom & Thread Decor",
    role: "Decorator",
    channel: "email",
    task: "Send portfolio for decor concept review",
    status: "scheduled",
    scheduledFor: "2025-04-20",
  },
  {
    id: "r5",
    recipient: "Sunita Mehta",
    role: "Groom's Sister",
    channel: "whatsapp",
    task: "Share mehendi artist referrals",
    status: "sent",
    scheduledFor: "2025-04-14",
  },
];

export const activities: Activity[] = [
  {
    id: "a1",
    timestamp: "2025-04-14 10:23",
    description: "Rishi Kapoor Photography viewed the contract request email",
    icon: "vendor",
    actor: "Rishi Kapoor Photography",
  },
  {
    id: "a2",
    timestamp: "2025-04-13 16:45",
    description: "Mama Sharma responded to guest list request with 12 new names",
    icon: "family",
    actor: "Mama Sharma",
  },
  {
    id: "a3",
    timestamp: "2025-04-13 09:00",
    description: "System sent automated reminder to Suresh Catering for menu submission",
    icon: "system",
    actor: "System",
  },
  {
    id: "a4",
    timestamp: "2025-04-12 14:30",
    description: "Priya marked 'Initial venue research' as done",
    icon: "couple",
    actor: "Priya",
  },
  {
    id: "a5",
    timestamp: "2025-04-11 11:15",
    description: "System flagged guest count task as overdue (was due Apr 10)",
    icon: "system",
    actor: "System",
  },
  {
    id: "a6",
    timestamp: "2025-04-10 18:00",
    description: "Arjun assigned airport logistics task to Raj Mehta",
    icon: "couple",
    actor: "Arjun",
  },
];

export const risks: Risk[] = [
  {
    id: "risk1",
    title: "Guest count still unconfirmed",
    explanation: "Your guest count estimate hasn't been locked for 5 days. This is blocking venue capacity confirmation and caterer preliminary planning.",
    impact: "Blocks 3 downstream tasks including venue booking and save-the-dates.",
    cta: "Update guest count now",
    severity: "high",
  },
  {
    id: "risk2",
    title: "Venue shortlist approaching April deadline",
    explanation: "Mumbai wedding venues for November fill up by May. You have 8 days before your self-set April deadline for site visits.",
    impact: "Losing preferred venues could cascade into decor, catering, and photography changes.",
    cta: "Schedule site visits",
    severity: "high",
  },
  {
    id: "risk3",
    title: "Photographer contract still unsigned",
    explanation: "Rishi Kapoor Photography has seen the contract but hasn't signed yet. Availability may not be guaranteed without a signed agreement.",
    impact: "Peak-season photographers may accept other bookings while contract is pending.",
    cta: "Send follow-up to photographer",
    severity: "medium",
  },
];

export const adminEvents = [
  {
    id: "ae1",
    coupleName: "Priya & Arjun",
    weddingDate: "Nov 8, 2025",
    tasksCompleted: 18,
    totalTasks: 77,
    atRisk: 5,
    lastActivity: "2 hours ago",
    city: "Mumbai",
  },
  {
    id: "ae2",
    coupleName: "Aisha & Rohan",
    weddingDate: "Dec 14, 2025",
    tasksCompleted: 32,
    totalTasks: 65,
    atRisk: 2,
    lastActivity: "Yesterday",
    city: "Delhi",
  },
  {
    id: "ae3",
    coupleName: "Sneha & Vikram",
    weddingDate: "Jan 22, 2026",
    tasksCompleted: 8,
    totalTasks: 60,
    atRisk: 0,
    lastActivity: "3 days ago",
    city: "Bangalore",
  },
  {
    id: "ae4",
    coupleName: "Meera & Siddharth",
    weddingDate: "Feb 14, 2026",
    tasksCompleted: 4,
    totalTasks: 70,
    atRisk: 1,
    lastActivity: "1 week ago",
    city: "Pune",
  },
];

export const stuckMilestones = [
  {
    id: "sm1",
    coupleName: "Priya & Arjun",
    task: "Confirm guest count",
    blockedSince: "5 days",
    blockReason: "Family additions pending",
  },
  {
    id: "sm2",
    coupleName: "Aisha & Rohan",
    task: "Venue floor plan submission",
    blockedSince: "12 days",
    blockReason: "Venue admin unresponsive",
  },
  {
    id: "sm3",
    coupleName: "Meera & Siddharth",
    task: "Budget approval from parents",
    blockedSince: "3 days",
    blockReason: "Awaiting family meeting",
  },
];
