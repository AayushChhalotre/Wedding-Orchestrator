
import { Task, WeddingInfo } from '../models/schema';

export interface WhatsAppAnalysisResult {
  weddingInfo: Partial<WeddingInfo>;
  tasks: Array<{
    title: string;
    owner: string;
    status: 'todo' | 'in-progress' | 'done';
  }>;
  statusTracking: {
    venueBooked: boolean;
    catererBooked: boolean;
    plannerHired: boolean;
    photoBooked: boolean;
    multiDay: boolean;
    destination: boolean;
  };
  potentialGuestList: string[];
  summary: string;
}

export class WhatsAppAnalyzer {
  private static COMMON_CITIES = [
    "Mumbai", "Delhi", "Udaipur", "Jaipur", "Goa", "Bengaluru", "Bangalore", "Chennai", 
    "Kolkata", "Hyderabad", "Pune", "Jodhpur", "Mussoorie", "Shimla", "Kochi", 
    "Jim Corbett", "Rishikesh", "Khandala", "Lonavala", "Mahabaleshwar", "Agra", 
    "Pushkar", "Alibaug", "Amritsar", "Chandigarh", "Lucknow", "Varanasi"
  ];

  private static TRADITIONS: Record<string, string[]> = {
    "Hindu": ["hindu", "vivaah", "phere", "mandap", "brahmin", "marwari", "punjabi", "vedic", "pandit", "agnihotra", "shaadi", "haldi", "sangeet", "mehendi"],
    "Sikh": ["sikh", "anand karaj", "gurudwara", "palla", "ardas", "lavan"],
    "Christian": ["christian", "church", "white wedding", "vows", "altar", "pastor", "priest"],
    "Muslim": ["muslim", "nikah", "walima", "qabul", "maulvi", "mubarak"],
    "South Indian": ["tamil", "telugu", "kannada", "malayali", "saree", "dhoti", "muhurtham", "kalyanam", "mangalsutra"],
    "Parsi": ["parsi", "lagan", "fire temple", "navjote", "agyari", "achoo michoo"]
  };

  private static STOP_WORDS = new Set([
    "Wedding", "Planning", "The", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", 
    "Budget", "Venue", "Hotel", "Lakh", "Cr", "India", "Destination", "January", "February", "March", "April", 
    "May", "June", "July", "August", "September", "October", "November", "December", "Hi", "Hello", "Hey", 
    "Ok", "Okay", "Yes", "No", "Good", "Great", "Nice", "Please", "Thanks", "Thank", "You", "Your", "My", "Our", 
    "We", "They", "Them", "Me", "Am", "Is", "Are", "Was", "Were", "Be", "Been", "Being", "Have", "Has", "Had", 
    "Do", "Does", "Did", "But", "If", "Or", "Because", "As", "Until", "While", "Of", "At", "By", "For", "With", 
    "About", "Against", "Between", "Into", "Through", "During", "Before", "After", "Above", "Below", "To", 
    "From", "Up", "Down", "In", "Out", "On", "Off", "Over", "Under", "Again", "Further", "Then", "Once", "All", 
    "Both", "Any", "Each", "Few", "More", "Most", "Other", "Some", "Such", "So", "Than", "Too", "Very", "Can", 
    "Will", "Just", "Should", "Now", "Mandap", "Haldi", "Sangeet", "Mehendi", "Reception", "Cocktail", "Dinner", 
    "Lunch", "Breakfast", "Ritual", "Puja", "Pooja", "Bharat", "Baraat", "Vedi", "Sehra", "Sherwani", "Lehenga", 
    "Saree", "Bridal", "Groom", "Summary", "City", "Tentative", "Date", "Guest", "Count", "Band", "Leadership", 
    "Model", "Couple", "Parents", "Advisors", "Task", "Owner", "Status", "Pending", "Done", "Negotiation", 
    "Almost", "Actually", "Already", "Anyway", "Back", "Better", "Bit", "Both", "Called", "Call", "Cant", 
    "Check", "Clear", "Close", "Come", "Could", "Day", "Does", "Done", "Each", "Early", "Else", "Even", "Ever", 
    "Every", "Exactly", "Far", "Few", "Final", "First", "From", "Full", "Get", "Give", "Go", "Got", "Had", 
    "Has", "Have", "He", "Her", "Here", "Him", "His", "How", "If", "In", "Into", "Is", "It", "Its", "Just", 
    "Keep", "Know", "Last", "Like", "Little", "Look", "Made", "Make", "Many", "Me", "Might", "More", "Most", 
    "Much", "Must", "My", "Never", "New", "Next", "No", "Not", "Now", "Of", "Off", "On", "Once", "Only", 
    "Or", "Other", "Our", "Out", "Over", "Own", "Rather", "Said", "Same", "Say", "See", "She", "Should", 
    "Since", "So", "Some", "Still", "Such", "Take", "Than", "That", "The", "Their", "Them", "Then", "There", 
    "These", "They", "This", "Those", "Through", "To", "Too", "Under", "Until", "Up", "Very", "Was", "We", 
    "Well", "Were", "What", "When", "Where", "Which", "While", "Who", "Whom", "Why", "Will", "With", "Within", 
    "Without", "Would", "Yet", "You", "Your", "Yours", "Stay", "Transport", "Food", "Catering", "Decor", 
    "Booking", "Confirmed", "Fixed", "Trial", "Trial", "Trail", "Venue", "Hotel", "Resort"
  ]);

  static analyze(rawText: string): WhatsAppAnalysisResult {
    const lines = rawText.split('\n').filter(line => line.trim().length > 0);
    
    // 1. Extract Sender Names
    const senders = new Set<string>();
    const senderRegex = /\[?\d{1,2}\/\d{1,2}\/\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?(?:\s*[ap]m)?\]?\s*(?:-?\s*([^:]+):\s*|→\s*|[:\-→]\s*)/i;
    
    lines.forEach(line => {
      const match = line.match(senderRegex);
      if (match && match[1]) {
        const sender = match[1].trim();
        // Ignore generic labels
        if (!['Mom', 'Dad', 'Bhai', 'Admin', 'Me'].includes(sender)) {
          senders.add(sender);
        }
      }
    });

    // 2. Clean Text
    const cleanLines = lines.map(line => {
      return line
        .replace(senderRegex, " ")
        .trim();
    }).filter(l => l.length > 0);
    
    const cleanText = cleanLines.join(' ');

    // 3. Entity Extraction
    const tentativeDate = this.extractDate(cleanText);
    const detectedBudget = this.extractBudget(cleanText);
    const detectedGuests = this.extractGuests(cleanText);
    const detectedCity = this.extractCity(cleanText);
    const detectedTradition = this.extractTradition(cleanText);
    
    // 4. Name Extraction (Partners & Stakeholders)
    const { partner1, partner2, potentialGuests } = this.extractNames(cleanText, Array.from(senders), cleanLines);

    // 5. Task & Status Extraction
    const explicitTasks = this.extractExplicitTasks(rawText);
    const statusTracking = this.extractStatusTracking(cleanText, detectedCity || "");

    // 6. Generate Summary
    const summary = this.generateSummary({
      partner1, partner2, tentativeDate, detectedCity, detectedGuests, detectedBudget, detectedTradition, statusTracking
    });

    return {
      weddingInfo: {
        weddingDate: tentativeDate || undefined,
        budget: detectedBudget || undefined,
        guests: detectedGuests || undefined,
        city: detectedCity || undefined,
        location: detectedCity || undefined,
        partner1Name: partner1 || undefined,
        partner2Name: partner2 || undefined,
        coupleName: (partner1 && partner2) ? `${partner1.split(' ')[0]} & ${partner2.split(' ')[0]}` : undefined,
        weddingType: (detectedTradition as any) || undefined
      },
      tasks: explicitTasks,
      statusTracking,
      potentialGuestList: potentialGuests,
      summary
    };
  }

  private static extractDate(text: string): string | null {
    const dateRegex = /(\d{1,2}(?:st|nd|rd|th)?\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})|(\d{1,2}[/-]\d{1,2}[/-]\d{2,4})/gi;
    const dates = text.match(dateRegex) || [];
    return dates.length > 0 ? dates[dates.length - 1] : null;
  }

  private static extractBudget(text: string): string | null {
    const budgetRegex = /(?:budget|spend|cost|limit|allocation|estimate)\s*(?:count|band|range|total|overall)?\s*[:\-→=]?\s*(?:is|around|of|approx|to|be|at|roughly|nearly)?\s*(?:₹|rs\.?)?\s*(\d+(?:\.\d+)?)\s*(?:-|to|–|and)?\s*(\d+(?:\.\d+)?)?\s*(L|Lakh|Cr|Crore|k|thousand|Lacs|Lac)s?\b/gi;
    const matches = Array.from(text.matchAll(budgetRegex));
    if (matches.length > 0) {
      const last = matches[matches.length - 1];
      const amt1 = last[1];
      const amt2 = last[2];
      const unit = last[3] ? (last[3].toLowerCase().startsWith('l') ? 'L' : (last[3].toLowerCase().startsWith('c') ? 'Cr' : 'k')) : "L";
      return `₹${amt1}${amt2 ? '–' + amt2 : ''}${unit}`;
    }
    return null;
  }

  private static extractGuests(text: string): string | null {
    const guestRegex = /(?:guest|headcount|pax|people|invited|members)(?:\s+(?:count|band|range|list|strength))*\s*[:\-→=]?\s*(?:is|around|approx|of|expected|roughly|nearly)?\s*(\d{2,4})\s*(?:-|to|–|and)?\s*(\d{2,4})?/gi;
    const matches = Array.from(text.matchAll(guestRegex));
    if (matches.length > 0) {
      const last = matches[matches.length - 1];
      return `${last[1]}${last[2] ? '–' + last[2] : ''}`;
    }
    return null;
  }

  private static extractCity(text: string): string | null {
    return this.COMMON_CITIES.find(city => new RegExp(`\\b${city}\\b`, "i").test(text)) || null;
  }

  private static extractTradition(text: string): string | null {
    return Object.entries(this.TRADITIONS).find(([name, keywords]) => 
      keywords.some(k => text.toLowerCase().includes(k))
    )?.[0] || null;
  }

  private static extractNames(text: string, senders: string[], lines: string[]): { partner1: string | null, partner2: string | null, potentialGuests: string[] } {
    // 1. Anchor Pattern (Strongest signal)
    const coupleRegex = /([A-Z][a-z]+)\s*(?:&|and|weds|💍)\s*([A-Z][a-z]+)/i;
    const coupleMatch = text.match(coupleRegex);
    let p1: string | null = coupleMatch ? coupleMatch[1] : null;
    let p2: string | null = coupleMatch ? coupleMatch[2] : null;

    // 2. Frequency Analysis of Capitalized Words
    const namePattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    const rawMatches = text.match(namePattern) || [];
    const frequency: Record<string, number> = {};
    
    rawMatches.forEach(match => {
      const normalized = match.trim();
      if (!this.STOP_WORDS.has(normalized) && 
          normalized.length > 2 && 
          !this.COMMON_CITIES.includes(normalized)) {
        frequency[normalized] = (frequency[normalized] || 0) + 1;
      }
    });

    // 3. Sender Bonus
    senders.forEach(sender => {
      if (frequency[sender] !== undefined) {
        frequency[sender] += 5; // Strong signal if they are talking
      }
    });

    const sortedNames = Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .filter(([name]) => name.split(' ').length <= 2)
      .map(([name]) => name);

    if (!p1) p1 = sortedNames[0] || null;
    if (!p2) p2 = sortedNames[1] || null;

    const potentialGuests = sortedNames
      .filter(n => n !== p1 && n !== p2)
      .slice(0, 30);

    return { partner1: p1, partner2: p2, potentialGuests };
  }

  private static extractExplicitTasks(rawText: string): Array<{ title: string, owner: string, status: 'todo' | 'in-progress' | 'done' }> {
    const taskPattern = /Task\s*:\s*([^|\n]+)(?:\s*\|\s*Owner\s*:\s*([^|\n]+))?(?:\s*\|\s*Status\s*:\s*([^|\n\r]+))?/gi;
    const tasks: Array<{ title: string, owner: string, status: 'todo' | 'in-progress' | 'done' }> = [];
    let match;
    while ((match = taskPattern.exec(rawText)) !== null) {
      tasks.push({
        title: match[1].trim(),
        owner: match[2]?.trim() || "Couple",
        status: this.normalizeStatus(match[3]?.trim().toLowerCase() || "todo")
      });
    }
    return tasks;
  }

  private static normalizeStatus(status: string): 'todo' | 'in-progress' | 'done' {
    if (status.includes('done') || status.includes('confirmed') || status.includes('booked')) return 'done';
    if (status.includes('progress') || status.includes('negotiation') || status.includes('shortlist')) return 'in-progress';
    return 'todo';
  }

  private static extractStatusTracking(text: string, detectedCity: string) {
    const lowerText = text.toLowerCase();
    const status = {
      venueBooked: false,
      catererBooked: false,
      plannerHired: false,
      photoBooked: false,
      multiDay: lowerText.includes("multi-day") || lowerText.includes("3 day") || lowerText.includes("4 day") || lowerText.includes("haldi") || lowerText.includes("sangeet"),
      destination: lowerText.includes("destination") || lowerText.includes("traveling to") || (detectedCity && !["Mumbai", "Delhi", "Bangalore", "Chennai"].includes(detectedCity))
    };

    const doneKeywords = ["booked", "final", "fixed", "hired", "deposit paid", "confirmed", "locked", "advance paid", "done"];
    const categories = {
      venue: ["venue", "hotel", "resort", "palace", "hall"],
      caterer: ["caterer", "catering", "food"],
      photo: ["photographer", "photo", "video"],
      planner: ["planner", "coordinator", "event manager"]
    };

    Object.entries(categories).forEach(([key, keywords]) => {
      const hasKeyword = keywords.some(k => lowerText.includes(k));
      const hasDoneContext = doneKeywords.some(d => lowerText.includes(d));
      if (hasKeyword && hasDoneContext) {
        (status as any)[`${key}${key === "planner" ? "Hired" : "Booked"}`] = true;
      }
    });

    return status;
  }

  private static generateSummary(data: any): string {
    const { partner1, partner2, tentativeDate, detectedCity, detectedGuests, detectedBudget, detectedTradition, statusTracking } = data;
    const templates = [
      partner1 && partner2 ? `Found the heart of the story: **${partner1} & ${partner2}**'s celebration.` : "Analyzed your chat logs!",
      tentativeDate ? `The magic happens on **${tentativeDate}**.` : "",
      detectedCity ? `Setting the stage in **${detectedCity}**.` : "",
      detectedGuests ? `Planning for a gathering of **${detectedGuests}** guests.` : "",
      detectedBudget ? `Working with an estimated budget of **${detectedBudget}**.` : "",
      detectedTradition ? `Beautifully rooted in **${detectedTradition}** traditions.` : ""
    ].filter(s => s !== "");

    const bookedItems = Object.entries(statusTracking)
      .filter(([k, v]) => v === true && ["venueBooked", "catererBooked", "plannerHired", "photoBooked"].includes(k))
      .map(([k]) => k.replace("Booked", "").replace("Hired", "").charAt(0).toUpperCase() + k.replace("Booked", "").replace("Hired", "").slice(1));
    
    if (bookedItems.length > 0) {
      templates.push(`Great news: **${bookedItems.join(", ")}** are already locked in!`);
    }

    return templates.join(" ");
  }
}
