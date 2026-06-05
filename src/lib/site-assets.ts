/**
 * SITE_ASSETS
 * Centralized configuration for all visual assets in Version 2.
 * Update these paths to change images across the entire site.
 * Paths starting with '/' point to the 'public' folder.
 */

export const SITE_ASSETS = {
  // ==========================================
  // GLOBAL & COMPONENTS
  // ==========================================
  NAVBAR: {
    logo: "", // Text-based logo currently, add path if image logo is needed
  },

  // ==========================================
  // HOME PAGE
  // ==========================================
  HOME: {
    hero: {
      src: "/landing2.webp",
      alt: "Peaceful Meditation"
    },
    aboutPreview: {
      src: "/sofa_teal.webp",
      alt: "Alchemy Therapy Space"
    },
    testimonialAvatars: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
    ]
  },

  // ==========================================
  // ABOUT PAGE
  // ==========================================
  ABOUT: {
    hero: {
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
      alt: "Clinical Consultation Room"
    },
    philosophy: {
      src: "https://images.unsplash.com/photo-1518301775955-14933017f1c9?auto=format&fit=crop&q=80&w=800",
      alt: "Peaceful Nature Scene"
    },
    team: {
      drSarah: {
        src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800",
        alt: "Dr. Sarah Mitchell"
      }
    }
  },

  // ==========================================
  // SERVICES PAGE (Landing)
  // ==========================================
  SERVICES_LANDING: {
    hero: {
      src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=800",
      alt: "Alchemy Therapy Environment"
    },
    blogs: [
      {
        slug: "understanding-anxiety",
        src: "/landing2.webp",
        alt: "Man looking at sea"
      },
      {
        slug: "power-of-mindfulness",
        src: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
        alt: "Person meditating"
      },
      {
        slug: "healthy-relationships",
        src: "/landing2.webp",
        alt: "Couple talking"
      }
    ]
  },

  // ==========================================
  // SERVICE DETAIL PAGES (Single Services)
  // ==========================================
  SERVICE_DETAILS: {
    psychotherapy: {
      hero: "/psycotheraphylanding.webp", // Updated to local as per example
      alt: "Clinical Psychotherapy"
    },
    counsellingServices: {
      hero: "/conseling.webp", // Updated to local as per example
      alt: "Compassionate Counseling"
    },
    meditationPrograms: {
      hero: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
      alt: "Meditation Practice"
    },
    personalGrowth: {
      hero: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200",
      alt: "Sunrise Growth"
    },
    addictionSupport: {
      hero: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200",
      alt: "Support Group Circle"
    },
    healingRecovery: {
      hero: "https://images.unsplash.com/photo-1516589174184-c68536575802?auto=format&fit=crop&q=80&w=1200",
      alt: "Emotional Healing Support"
    }
  },

  // ==========================================
  // CONTACT PAGE
  // ==========================================
  CONTACT: {
    mapPlaceholder: "", // Grayscale filter applied in code
    // If you need a background image for contact hero, add here
  }
};
