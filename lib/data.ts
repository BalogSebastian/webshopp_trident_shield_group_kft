// lib/data.ts

export const siteConfig = {
    name: "MUNKAVÉDELEM.",
    description: "Prémium tűzvédelmi eszközök, porral oltók és munkavédelmi felszerelések.",
    copyright: "© 2026 Munkavédelem Kft.",
  };
  
  export const products = [
    {
      id: 1,
      name: "MAXIMA Porral Oltó 6kg (ABC)",
      category: "ALAPFELSZERELÉS",
      price: "14 990 Ft",
      image: "https://images.unsplash.com/photo-1596468137351-460d36746401?q=80&w=1000&auto=format&fit=crop", // Piros porral oltó jellegű kép
      badge: "BESTSELLER"
    },
    {
      id: 2,
      name: "MAXIMA Tűztakaró 3m",
      category: "KIEGÉSZÍTŐK",
      price: "5 490 Ft",
      image: "https://images.unsplash.com/photo-1615707548590-b3dfd2a50156?q=80&w=1000&auto=format&fit=crop", // Védőeszköz/táska jellegű kép
      badge: "ÚJ"
    },
    {
      id: 3,
      name: "MAXIMA Porral Oltó 12kg (ABC)",
      category: "IPARI VÉDELEM",
      price: "28 900 Ft",
      image: "https://images.unsplash.com/photo-1596468137351-460d36746401?q=80&w=1000&auto=format&fit=crop", // Nagyobb készülék
      badge: "-10%"
    },
    {
      id: 4,
      name: "MAXIMA Porral Oltó 2kg (ABC)",
      category: "JÁRMŰVEKHEZ",
      price: "8 990 Ft",
      image: "https://images.unsplash.com/photo-1596468137351-460d36746401?q=80&w=1000&auto=format&fit=crop", // Kisebb készülék
      badge: null
    },
    {
      id: 5,
      name: "MAXIMA Tűztakaró 1m (Konyhai)",
      category: "OTTHONI",
      price: "3 990 Ft",
      image: "https://images.unsplash.com/photo-1615707548590-b3dfd2a50156?q=80&w=1000&auto=format&fit=crop",
      badge: null
    },
    {
      id: 6,
      name: "Fali Tartó 6kg-os Oltóhoz",
      category: "TARTOZÉK",
      price: "2 490 Ft",
      image: "https://images.unsplash.com/photo-1585834896773-41e974e64906?q=80&w=1000&auto=format&fit=crop", // Fém/tartozék jellegű kép
      badge: null
    }
  ];
  
  export const reviews = [
    {
      id: 1,
      name: "Kovács Péter",
      role: "TŰZVÉDELMI ELŐADÓ",
      text: "A MAXIMA porral oltók minősége kifogástalan, minden telephelyünket ezzel szereltük fel. A szállítás pedig másnapra itt volt."
    }
  ];