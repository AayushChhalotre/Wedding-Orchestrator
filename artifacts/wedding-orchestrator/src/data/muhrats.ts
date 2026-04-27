export interface Muhurat {
  date: string; // ISO format
  quality: "Excellent" | "Good" | "Average";
  nakshatras?: string[]; // Optional for Hindu
  notes?: string;
  tradition: "Hindu" | "Muslim" | "Christian" | "Sikh" | "Secular";
}

// Static high-ritual anchor dates for 2025/2026 (Found via research)
export const ALL_MUHURATS: Muhurat[] = [
  // Hindu
  { date: "2025-01-16", quality: "Excellent", nakshatras: ["Pushya"], tradition: "Hindu" },
  { date: "2025-02-02", quality: "Excellent", nakshatras: ["Revati"], tradition: "Hindu" },
  { date: "2025-04-14", quality: "Excellent", nakshatras: ["Swati"], tradition: "Hindu" },
  { date: "2025-05-08", quality: "Excellent", nakshatras: ["Uttara Phalguni"], tradition: "Hindu" },
  { date: "2025-11-08", quality: "Excellent", nakshatras: ["Rohini"], tradition: "Hindu" },
  { date: "2026-01-20", quality: "Excellent", nakshatras: ["Pushya"], tradition: "Hindu" },
  { date: "2026-04-15", quality: "Good", nakshatras: ["Ashwini"], tradition: "Hindu" },
  
  // Muslim
  { date: "2025-04-04", quality: "Excellent", tradition: "Muslim", notes: "Friday - Shawwal start" },
  { date: "2025-04-11", quality: "Excellent", tradition: "Muslim", notes: "Friday - Shawwal" },
  { date: "2025-06-20", quality: "Good", tradition: "Muslim", notes: "Friday - Post-Eid" },
  { date: "2026-03-27", quality: "Excellent", tradition: "Muslim", notes: "Friday - Shawwal window" },
  
  // Christian
  { date: "2025-05-17", quality: "Excellent", tradition: "Christian", notes: "Spring Saturday" },
  { date: "2025-06-14", quality: "Excellent", tradition: "Christian", notes: "June Wedding - Classic" },
  { date: "2025-09-20", quality: "Excellent", tradition: "Christian", notes: "Fall Saturday" },
  { date: "2026-05-16", quality: "Excellent", tradition: "Christian", notes: "Spring Saturday" },

  // Sikh
  { date: "2025-03-30", quality: "Excellent", tradition: "Sikh", notes: "Baisakhi timeframe" },
  { date: "2025-04-13", quality: "Excellent", tradition: "Sikh", notes: "Vaisakhi Day" },
  { date: "2025-11-05", quality: "Excellent", tradition: "Sikh", notes: "Bandhi Chhor Divas timeframe" },
];

/**
 * Generates recommendation slots for modern events (Cocktail, Sangeet) 
 * around a main ritual date based on the desired wedding duration.
 */
export function getBufferSlots(mainDate: string, duration: number) {
  const date = new Date(mainDate);
  const slots: { name: string, date: string, type: 'modern' | 'ritual' }[] = [];
  
  // Common multi-day patterns
  if (duration >= 3) {
    const sangeetDate = new Date(date);
    sangeetDate.setDate(date.getDate() - 1);
    slots.push({ name: "Sangeet & Mehendi", date: sangeetDate.toISOString().split('T')[0], type: 'ritual' });
    
    const cocktailDate = new Date(date);
    cocktailDate.setDate(date.getDate() - 2);
    slots.push({ name: "Cocktail Party", date: cocktailDate.toISOString().split('T')[0], type: 'modern' });
  }

  if (duration >= 5) {
    const haldiDate = new Date(date);
    haldiDate.setDate(date.getDate() - 3);
    slots.push({ name: "Haldi Ceremony", date: haldiDate.toISOString().split('T')[0], type: 'ritual' });
    
    const welcomeDate = new Date(date);
    welcomeDate.setDate(date.getDate() - 4);
    slots.push({ name: "Welcome Brunch", date: welcomeDate.toISOString().split('T')[0], type: 'modern' });
  }

  const receptionDate = new Date(date);
  receptionDate.setDate(date.getDate() + 1);
  slots.push({ name: "Reception", date: receptionDate.toISOString().split('T')[0], type: 'modern' });

  return slots;
}

export function getRelevantDates(tradition: string): Muhurat[] {
  const normTradition = tradition.split(' ')[0] as any;
  if (normTradition === "Mixed") return ALL_MUHURATS.slice(0, 10);
  return ALL_MUHURATS.filter(m => m.tradition === normTradition || m.tradition === "Secular");
}

export type Rashi = 
  | "Aries" | "Taurus" | "Gemini" | "Cancer" 
  | "Leo" | "Virgo" | "Libra" | "Scorpio" 
  | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

const compatibilityMap: Record<Rashi, Rashi[]> = {
  Aries: ["Leo", "Sagittarius", "Gemini", "Libra"],
  Taurus: ["Virgo", "Capricorn", "Taurus", "Pisces"],
  Gemini: ["Libra", "Aquarius", "Aries", "Gemini"],
  Cancer: ["Scorpio", "Pisces", "Taurus", "Cancer"],
  Leo: ["Aries", "Sagittarius", "Leo", "Libra"],
  Virgo: ["Taurus", "Capricorn", "Virgo", "Scorpio"],
  Libra: ["Gemini", "Aquarius", "Libra", "Leo"],
  Scorpio: ["Cancer", "Pisces", "Scorpio", "Virgo"],
  Sagittarius: ["Aries", "Leo", "Sagittarius", "Aquarius"],
  Capricorn: ["Taurus", "Virgo", "Capricorn", "Pisces"],
  Aquarius: ["Gemini", "Libra", "Aquarius", "Sagittarius"],
  Pisces: ["Cancer", "Scorpio", "Pisces", "Capricorn"],
};

export function getRashiCompatibility(r1: Rashi, r2: Rashi): number {
  if (r1 === r2) return 10;
  if (compatibilityMap[r1].includes(r2)) return 9;
  return 5;
}
