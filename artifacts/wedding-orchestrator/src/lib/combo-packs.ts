export interface ComboPack {
  id: string;
  name: string;
  theme: string;
  colors: string[];
  vibe: string;
  keywords: string[];
  image: string;
  gallery: string[];
}

export const comboPacks: ComboPack[] = [
  {
    id: "royal",
    name: "Royal Heritage",
    theme: "Maroon, Gold, Cream",
    colors: ["#800000", "#D4AF37", "#FFFDD0"],
    vibe: "Regal, Grand, Traditional",
    keywords: ["Palace", "Ancestral", "Silk", "Velvet", "Gilded"],
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2069&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1507504031003-b417219a0fde?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?q=80&w=1974&auto=format&fit=crop"
    ]
  },
  {
    id: "pastel",
    name: "Pastel Dream",
    theme: "Blush Pink, Sage, Pearl",
    colors: ["#FFD1DC", "#B2AC88", "#F0EAD6"],
    vibe: "Romantic, Soft, Modern",
    keywords: ["Floral", "Whimsical", "Chiffon", "Ethereal", "Daylight"],
    image: "https://images.unsplash.com/photo-1522673607200-1648832cee98?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1465495910483-0d6749838f30?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop"
    ]
  },
  {
    id: "bollywood",
    name: "Neon Nights",
    theme: "Electric Blue, Magenta, Purple",
    colors: ["#00FFFF", "#FF00FF", "#800080"],
    vibe: "High Energy, Dramatic, Celebration",
    keywords: ["Dance", "Led", "Sparkle", "Cinematic", "Fusion"],
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2040&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1514525253344-f814d0c9e583?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2040&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?q=80&w=2069&auto=format&fit=crop"
    ]
  },
  {
    id: "south-indian",
    name: "Temple Minimal",
    theme: "Temple Gold, Jasmine, Earth",
    colors: ["#CFB53B", "#F8F8FF", "#8B4513"],
    vibe: "Divine, Serene, Authentic",
    keywords: ["Kanchipuram", "Traditional", "Jasmine", "Brass", "Culture"],
    image: "https://images.unsplash.com/photo-1605125950879-880907409f6e?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1602498456745-e9503b30470b?q=80&w=1974&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603504842183-b7787497d9b9?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=1974&auto=format&fit=crop"
    ]
  },
  {
    id: "bohemian",
    name: "Bohemian Garden",
    theme: "Terracotta, Sage, Cream",
    colors: ["#E2725B", "#9CB071", "#FFFDD0"],
    vibe: "Free-spirited, Organic, Warm",
    keywords: ["Pampas", "Macrame", "Sunset", "Wildflowers", "Rattan"],
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2070&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1510076857177-7470076d4098?q=80&w=2072&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1529636798458-92182e662485?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop"
    ]
  },
  {
    id: "sultry",
    name: "Midnight Soirée",
    theme: "Charcoal, Emerald, Copper",
    colors: ["#36454F", "#50C878", "#B87333"],
    vibe: "Mysterious, Sophisticated, Bold",
    keywords: ["Velvet", "Candlelight", "Jazz", "Intimate", "Noir"],
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1516997121675-4c2d04fe116e?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1496333039225-429bb156023e?q=80&w=2070&auto=format&fit=crop"
    ]
  }
];

