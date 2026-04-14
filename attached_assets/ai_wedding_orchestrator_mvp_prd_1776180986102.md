# AI Wedding Timeline Orchestrator — MVP Prioritization + PRD Reference

## Purpose of this document
This document is a practical product reference for v0, Lovable, Visily, and other prototyping tools. It is designed to help generate cleaner product flows and screens for the leanest MVP of an AI-native wedding planning orchestrator.

The goal of the MVP is not to digitize every wedding-planning workflow. The goal is to solve milestone clarity, stakeholder coordination, and deadline anxiety first.

---

## Product overview

### Product name
AI Wedding Timeline Orchestrator

### Vision
Build the operating system for wedding planning: a shared, AI-native coordination layer that understands milestones, dependencies, and stakeholder responsibilities across the full planning journey.

### One-line description
An AI-native wedding planning workspace that generates a dynamic timeline, coordinates vendors and family, and proactively surfaces the next best action.

### Target users
**Primary users**
- Couples planning weddings without full-service planners
- Couples using fragmented tools like spreadsheets, notes apps, WhatsApp, and wedding marketplaces

**Secondary users**
- Vendors: venue, caterer, photographer, decorator, makeup artist, music/DJ, planner
- Family and wedding party members helping with tasks, decisions, and coordination

### Core assumptions
- Couples will provide basic planning inputs if they immediately receive a usable, personalized planning timeline.
- Vendors do not want another heavy dashboard unless it reduces follow-up chaos and gives them cleaner data.
- Family members will engage only if tasks are simple, explicit, and delivered through lightweight channels.
- The first product wedge is coordination and anxiety reduction, not full wedding commerce.
- The MVP should work even when some stakeholders never download the app.

---

## Problem statement

### 1. Planning anxiety and decision fatigue
Wedding planning includes dozens of interconnected tasks over several months. Couples often do not know what matters now, what can wait, and what is blocked by another decision.

### 2. Fragmented stakeholder communication
The planning journey is split across calls, chats, spreadsheets, PDFs, vendor emails, and family conversations. No one has a single live source of truth.

### 3. Static milestone tracking
Most planning tools behave like checklists. They do not understand dependencies well enough to adapt when one variable changes, such as date, guest count, venue, or ceremony order.

### 4. Missing vendor data creates downstream chaos
Critical information like final headcount, dietary restrictions, floor plans, arrival times, or music preferences is often delayed, incomplete, or scattered.

### 5. Couples need confidence, not just organization
The real product job is emotional as well as operational: reduce fear of forgetting something important and help couples feel in control.

---

## Product principles
- Start with the smallest loop that creates visible value.
- Build for mixed-channel behavior: app for the couple, lightweight link/email/WhatsApp-style interactions for others.
- Default to recommendation + confirmation, not full automation.
- Show why a task matters, not just what the task is.
- Make dependencies understandable in plain language.
- Keep every stakeholder’s view scoped to only what they need.

---

## MVP prioritization using Impact vs Effort

| Feature | Side | Impact Score | Effort Score | Recommendation |
|---------|------|--------------|--------------|----------------|
| AI Timeline Generation (Dependency-Aware) | Couple | High | High | Include in MVP |
| Proactive Next Step Assistant | Couple | High | Medium | Include in MVP |
| Vendor Data Collection Portal | Vendor | High | Medium | Include in MVP |
| Automated Check-ins / Reminders | Platform | High | Medium | Include in MVP |
| Stakeholder Hub (Family/Vendor task status) | All | High | Medium | Include in MVP |
| Milestone Change Cascade Engine | Platform | High | High | v2 |
| Budget Impact Simulator | Couple | Medium | Medium | v2 |
| Automated Family Task Delegation | Family | Medium | Low | v2 |

### MVP recommendation
**Definitely include in MVP**
- AI Timeline Generation (Dependency-Aware)
- Proactive Next Step Assistant
- Vendor Data Collection Portal
- Automated Check-ins / Reminders
- Stakeholder Hub

**Move to v2**
- Milestone Change Cascade Engine
- Budget Impact Simulator
- Automated Family Task Delegation

### Why this is the right MVP cut
These 5 MVP features create a complete transaction loop:
1. Couple enters planning basics.
2. System generates a live timeline.
3. System identifies missing data or blocked milestones.
4. System follows up with the right stakeholder.
5. Everyone sees what is pending and what to do next.

That loop delivers real coordination value without overbuilding advanced automation too early.

---

## User personas

### Persona 1 — Primary Planner Couple Lead
- Usually one partner is doing most of the planning.
- Uses spreadsheets, Instagram saves, and wedding websites.
- Feels constant anxiety about forgetting something important.
- Wants structure, recommendations, and a sense of control.

**What success looks like**
- Knows the next three important actions at all times.
- Can see what is blocked and who is responsible.
- Does not need to manually chase every vendor.

### Persona 2 — Busy Co-Planner Partner
- Less involved day-to-day but still important for approvals and key decisions.
- Needs concise updates, not planning overload.
- Wants to contribute without diving into complexity.

**What success looks like**
- Can quickly review decisions, approve milestones, and complete assigned tasks.
- Sees only what is relevant.

### Persona 3 — Vendor Operator
- Could be a caterer, photographer, venue manager, decorator, or planner.
- Handles multiple clients and hates repeated follow-ups and incomplete briefs.
- Wants structured data, clear deadlines, and fewer surprises.

**What success looks like**
- Receives one clean request for required information.
- Can submit or confirm details in a few minutes.
- Avoids back-and-forth across channels.

### Persona 4 — Family Helper / Wedding Party Member
- Helps with guests, logistics, shopping, rituals, or local coordination.
- Often not comfortable with complex planning tools.
- Needs clarity and lightweight task handoff.

**What success looks like**
- Gets one clearly worded task with due date and context.
- Can mark progress without learning a full product.

---

## Core user journeys

### Journey 1 — Couple inputs vision → AI generates dependency-mapped timeline
1. Couple signs up and enters event basics: wedding date, city, estimated guests, type of wedding, ceremony count, budget band, and what is already booked.
2. System generates a dynamic wedding timeline with phases, milestones, due dates, and owners.
3. Tasks are grouped by planning stage: foundation, vendor locking, guest management, ceremony planning, finalization, event week.
4. Each task includes plain-language dependency logic, for example: “Finalize guest estimate before shortlisting venues” or “Finalize menu before printing invitation inserts.”
5. Couple reviews timeline, edits assumptions, and confirms ownership of immediate next tasks.

**User value**
- Instant clarity.
- Reduced overwhelm.
- Personalized plan instead of static checklist.

### Journey 2 — Orchestrator identifies missing vendor data → proactively follow-up
1. Vendor-specific milestones are tracked in the system.
2. The system detects that required data is missing, for example final headcount for the caterer or floor dimensions for decor.
3. It sends a lightweight request to the right stakeholder through the configured channel.
4. Stakeholder submits missing info through a simple form or link.
5. Timeline updates automatically and the blocked milestone is cleared.

**User value**
- Less chasing.
- Less coordination drift.
- Better vendor readiness.

### Journey 3 — Milestone change → system surfaces dependent updates
1. Couple changes a core variable, such as guest count increasing from 200 to 260.
2. System identifies impacted downstream tasks.
3. In MVP, the system shows a dependency alert card with the top affected stakeholders and a recommended action checklist.
4. Couple confirms which follow-ups should be triggered.
5. Stakeholders receive updated requests.

**User value**
- Prevents silent breakage in the plan.
- Makes dependency impact visible.

### Journey 4 — Risk mitigation → deadline approaching → system alerts couple with next step
1. The system detects a high-risk milestone, such as invitation finalization still pending while print cutoff is near.
2. Couple receives a proactive alert with reason, urgency, and one recommended action.
3. Assistant suggests the fastest path forward, such as “Approve menu variant A and send to caterer today.”
4. Couple taps the action and resolves the risk.

**User value**
- Reduced decision paralysis.
- Confidence that the system is watching for planning risk.

---

## MVP feature list

## Couple-side features

### 1. Dynamic Timeline (with dependency awareness)
**Goal**
Turn wedding inputs into a personalized planning roadmap with milestone logic.

**What the feature does**
- Generates wedding phases and milestone dates based on event date and planning maturity.
- Maps dependencies between tasks.
- Updates task order and urgency as inputs change.
- Lets users edit dates, owners, and statuses.

**Detailed functional requirements**
- Input capture: wedding date, location, event type, guest count band, already-booked vendors, ceremony types, budget band.
- Timeline objects: task title, task type, owner, due date, dependency, status, stakeholder visibility, notes.
- Support milestone categories: venue, guests, food, decor, photography, rituals, travel/accommodation, final week logistics.
- Allow manual override of auto-generated dates.
- Show dependency explanation in plain language.
- Allow filtering by owner, status, and milestone phase.

**Screen implications for prototyping**
- Onboarding wizard
- Timeline view
- Task detail drawer
- Dependency detail popover

### 2. Proactive Next Step Assistant
**Goal**
Always tell the couple what to do next and why.

**What the feature does**
- Ranks next actions based on urgency, dependency criticality, and blocked milestones.
- Shows the top 3 recommended tasks.
- Explains why each task matters now.
- Supports quick actions: complete, snooze, remind, assign.

**Detailed functional requirements**
- Recommendation engine must evaluate due date proximity, blocked downstream milestones, missing stakeholder data, and task age.
- Every recommendation must include rationale text.
- Users can snooze with reason.
- Users can dismiss or mark done.
- Assistant must adapt after every timeline change.

**Screen implications for prototyping**
- Today dashboard
- AI suggestion cards
- Action confirmation state
- Snooze modal

### 3. Stakeholder Hub
**Goal**
Give the couple one shared coordination view across vendors and family.

**What the feature does**
- Central dashboard of task ownership and status.
- Shows which milestones are waiting on which stakeholder.
- Enables low-friction sharing with non-primary users.

**Detailed functional requirements**
- Stakeholder list with role, responsibility, response state, pending tasks.
- Filters by vendor, family, due date, blocked state.
- Permission scope by stakeholder type.
- View task history and latest response.
- Shared links or invite flows for external contributors.

**Screen implications for prototyping**
- Stakeholder list screen
- Stakeholder detail panel
- Shared status matrix

### 4. Budget Impact Simulator (v2)
**Goal**
Help couples understand tradeoffs of planning changes.

**What the feature does**
- Estimates budget effects of guest count, menu, or vendor changes.
- Surfaces financial consequences before the couple commits.

**Why it is not MVP**
- Valuable, but not core to milestone coordination loop.
- Requires better pricing structure and vendor-specific logic.

---

## Vendor-side features

### 5. Shared Data Portal
**Goal**
Collect critical vendor inputs in a structured, low-friction format.

**What the feature does**
- Gives each vendor a scoped portal for only the information they need.
- Supports forms, file uploads, approvals, and completion tracking.
- Converts vague requests into structured submissions.

**Detailed functional requirements**
- Vendor-type templates: caterer, venue, photographer, decor, DJ, makeup, planner.
- Each template supports required fields, optional fields, file upload, comments, and due dates.
- Display completion score and missing fields.
- View/edit access must be role-based.
- Couple can review submissions.

**Screen implications for prototyping**
- Vendor request screen
- Vendor submission form
- File upload interaction
- Submission review state

### 6. Automated Check-ins / Reminders
**Goal**
Reduce manual follow-up burden.

**What the feature does**
- Sends reminders for missing data, overdue approvals, or upcoming deadlines.
- Routes reminders to the right stakeholder.
- Maintains reminder history and response status.

**Detailed functional requirements**
- Trigger engine based on due date windows and incompleteness.
- Template engine for reminder copy.
- Multi-channel support architecture: email first, WhatsApp-capable design, push for logged-in users.
- Delivery logs, status states, and retry handling.
- Couple can manually trigger reminder resend.

**Screen implications for prototyping**
- Reminder center
- Reminder confirmation sheet
- Delivery status history

### 7. Milestone Approval Workflow (v2)
**Goal**
Formalize approvals for critical planning checkpoints.

**What the feature does**
- Lets vendors or couples approve locked milestones, such as final headcount or event timing.

**Why it is not MVP**
- Useful after data portal adoption is proven.
- Adds additional state complexity and edge cases.

### 8. Resource Loading View (v2)
**Goal**
Support event-week operations.

**What the feature does**
- Shows arrival times, setup windows, and cross-vendor dependencies.

**Why it is not MVP**
- More valuable after milestone system has usage.
- Better as an operations expansion feature.

---

## Platform / orchestration logic

### 9. Dependency Engine
**Goal**
Provide the core logic layer that makes the product feel intelligent.

**What the feature does**
- Maps planning tasks into dependency chains.
- Determines which tasks are blocked, overdue, or critical.
- Powers timeline logic and recommendation ranking.

**Detailed functional requirements**
- Predefined rule library by wedding type and planning phase.
- Ability to attach dependencies between tasks.
- Blocking logic to mark tasks as waiting on prior actions.
- Manual override by user or admin.
- Plain-language dependency explanation output.

### 10. Risk Prediction Engine
**Goal**
Identify likely planning delays before they become real problems.

**What the feature does**
- Flags risk based on due dates, dependency congestion, and missing stakeholder inputs.
- Surfaces high-risk milestones on couple dashboard.

**Detailed functional requirements**
- Risk score at task and milestone level.
- Threshold-based alerts.
- Suggested mitigation action.
- MVP can be rules-based with lightweight AI wording layer.

### 11. Multi-Channel Outreach
**Goal**
Meet stakeholders where they already are.

**What the feature does**
- Sends reminders and requests through channels that minimize friction.
- Keeps the app from becoming the single forced interaction layer.

**Detailed functional requirements**
- Channel abstraction for email, push, and future WhatsApp.
- Template personalization with event context.
- Fallback logic if channel is unavailable.
- Audit log for all outbound requests.

### 12. Basic Admin Dashboard
**Goal**
Enable internal operations, quality assurance, and intervention.

**What the feature does**
- Gives the product/ops team visibility into timeline generation quality, stuck milestones, failed reminders, and vendor adoption.

**Detailed functional requirements**
- Search by couple/event.
- View generated timeline and dependency map.
- Override task dates or statuses.
- Monitor reminder delivery and response rates.
- Flag risky or broken workflows.

---

## Non-functional requirements

### Performance
- Timeline generation response target: less than 1 second for standard events.
- Timeline edits should refresh visible task states near-instantly.
- Dashboard screens should load in under 2 seconds on average mobile conditions.

### Reliability
- Similar wedding inputs should produce consistent timeline structures.
- Critical workflows must fail safely: if AI confidence is low, fall back to template logic.
- Reminder triggers must be idempotent and deduplicated.

### Security and privacy
- Protect sensitive contact information, vendor quotations, contracts, and guest-related details.
- Role-based access control for couple, vendor, family, and admin users.
- Explicit permissioning for external stakeholder access.

### Language and accessibility
- English first, with Hindi and one regional language supported for user-facing communications.
- Mobile-first interaction design.
- Simple readable copy for non-technical stakeholders.

### Interoperability
- Design APIs/data structures so future integrations are possible with calendars, vendor CRMs, invitation tools, and payments.

---

## Success metrics

### User and workflow metrics
- Timeline activation rate: % of signed-up couples who generate and save a timeline.
- Milestone completion rate: % of milestone tasks completed by recommended due date.
- Next-step engagement rate: % of recommended tasks acted on within 48 hours.
- Blocked-task resolution time: average time to clear a blocked dependency.

### Coordination metrics
- Vendor response rate to data requests.
- Average turnaround time for missing vendor data.
- Reminder-to-response conversion rate.
- Stakeholder visibility coverage: % of active tasks with assigned owner and visible status.

### Experience metrics
- Couple-reported anxiety reduction through quick pulse survey.
- NPS or task-confidence score after first 2 weeks of usage.
- Reduction in manual follow-up volume reported by couples.

### Business metrics
- Couple activation to paid conversion.
- Vendor participation rate.
- Retention through major milestones.

---

## Risks and mitigations

### Risk 1 — Vendors resist another tool
**Why it matters**
Vendors do not want heavy onboarding or daily software management.

**Mitigation**
- Use scoped, lightweight forms instead of full dashboard dependency.
- Keep interactions fast and contextual.
- Show value through cleaner briefs and fewer follow-ups.

### Risk 2 — Dependency logic becomes too complex too early
**Why it matters**
A wedding has many edge cases, and trying to model every dependency in MVP can slow shipping.

**Mitigation**
- Start with a curated rule library covering top milestone paths.
- Focus on the highest-frequency planning dependencies first.
- Use admin overrides for exceptions.

### Risk 3 — AI hallucinates tasks or recommendations
**Why it matters**
Bad recommendations can destroy trust.

**Mitigation**
- Use rules-first timeline scaffolding.
- Let AI explain and personalize instead of inventing unsupported planning requirements.
- Add confidence checks and safe fallbacks.

### Risk 4 — Couples feel overwhelmed by too much detail
**Why it matters**
A powerful planner can still fail if the interface feels dense.

**Mitigation**
- Show only next best actions by default.
- Hide advanced details behind drill-down views.
- Use progressive disclosure.

### Risk 5 — Family coordination creates social friction
**Why it matters**
Delegating tasks into family systems can create confusion or tension.

**Mitigation**
- Keep family tasks optional and manual in MVP.
- Require couple approval before task delegation.
- Use neutral reminder language.

---

## Future roadmap (v2 and beyond)

### v2
- Milestone Change Cascade Engine with deeper automatic downstream updates
- Budget Impact Simulator
- Milestone Approval Workflow
- Family task delegation flows
- Day-of Resource Loading View

### v3+
- AI contract review and extraction
- Integrated payments / escrow and milestone-linked payouts
- Advanced vendor matching engine
- Calendar sync and invitation-platform integrations
- Planner-grade operational console
- Multicultural and multi-day wedding planning packs
- Regional expansion playbook

---

## Recommended MVP scope statement

**Build now**
- Dynamic Timeline
- Next Step Assistant
- Shared Data Portal
- Automated Check-ins / Reminders
- Stakeholder Hub
- Dependency Engine
- Risk Engine (rules-first)
- Basic Admin Dashboard

**Do not build yet**
- Full auto-cascade updates across every vendor
- Deep budgeting and price simulation
- Full family delegation system
- Complex planner operations suite
- Integrated payments/escrow
- Contract AI

---

## Product architecture framing for prototyping tools
Use this section directly as prompt/reference material for v0, Lovable, Visily, Figma AI, or other prototyping tools.

### Product structure
The MVP should feel like a wedding command center for the couple, with simple external collaboration surfaces for everyone else.

### Primary screens to prototype
1. Onboarding / wedding setup
2. AI-generated timeline screen
3. Today / Next Step dashboard
4. Task detail drawer with dependency explanation
5. Stakeholder Hub
6. Vendor request and submission portal
7. Reminder center / activity log
8. Risk alert modal / panel
9. Admin operations dashboard

### Design principles for screens
- Calm, trust-building, not celebratory clutter
- High clarity over visual decoration
- Show status, urgency, and ownership clearly
- Make “what to do next” obvious within 3 seconds
- Progressive disclosure: summary first, details second
- Mobile-first, because coordination happens on the go
- Non-primary stakeholders should have lightweight task completion flows

### Core objects in the product model
- Event
- Milestone
- Task
- Dependency
- Stakeholder
- Vendor request
- Submission
- Reminder
- Risk alert

### Screen-level UX cues
- Timeline cards should show due date, owner, blocked/unblocked status, and why it matters.
- Next-step cards should always include one clear CTA.
- Stakeholder hub should answer “who is waiting on whom?” quickly.
- Vendor portal should be form-first, not dashboard-heavy.
- Reminder activity should build confidence that the system is actively coordinating.

---

## Example product copy

### Sample hero statement
Plan your wedding with a timeline that actually adapts.

### Sample value proposition
Track milestones, collect vendor details, and stay ahead of deadlines without chasing everyone manually.

### Sample next-step card
**Finalize guest count estimate**  
This affects venue shortlist, catering budget, and invitation planning.  
**Action:** Confirm guest band

### Sample risk alert
**You may miss your invitation print window**  
Menu inserts are still not locked and the print deadline is in 5 days.  
**Suggested next step:** Approve one of the two pending menu options today.

---

## Final recommendation
If only one thing matters in the MVP, it is this: the product must make couples feel that the planning journey is under control.

That means the first release should be optimized for:
- timeline clarity,
- dependency visibility,
- structured vendor follow-up,
- and proactive next-step guidance.

Everything else should be judged by whether it strengthens or distracts from that core loop.
