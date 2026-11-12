/** Page content for the original services, used by the seed script to fill the database. */

export type ServiceContent = {
  title: string;
  tagline: string;
  description: string;
  image: string;
  imageAlt: string;
  icon: string;
  dimensions: { name: string; focus: string; method: string }[];
  includes: string[];
  emergencySupport?: boolean;
};

export const SERVICE_CONTENT: Record<string, ServiceContent> = {
  "psychotherapy": {
    title: "Psychotherapy",
    tagline: "Science-Backed Clinical Healing",
    description: "Our psychotherapy services utilize proven therapeutic approaches to help you navigate complex mental health challenges and develop healthy coping strategies.",
    image: "/psycotheraphylanding.webp",
    imageAlt: "Clinical Psychotherapy", 
    icon: "Brain",
    dimensions: [
      { name: "Cognitive", focus: "Thoughts, beliefs, and narratives.", method: "CBT & Talk Therapy" },
      { name: "Somatic", focus: "The body and nervous system.", method: "Somatic Regulation" },
      { name: "Emotional", focus: "Feelings and relational patterns.", method: "Emotional Literacy" },
      { name: "Spiritual", focus: "Purpose and soul connection.", method: "Existential Alignment" }
    ],
    includes: [
      "Cognitive Behavioral Therapy (CBT)",
      "Dialectical Behavior Therapy (DBT)",
      "Trauma-Informed Care",
      "Depression & Anxiety Treatment",
      "Stress Management",
      "Neuroplasticity Training"
    ],
    emergencySupport: true
  },
  "counselling-services": {
    title: "Counseling Services",
    tagline: "Compassionate Relational Guidance",
    description: "Deep listening and empathy-driven support for individuals, couples, and families to address communication patterns and systemic harmony.",
    image: "/conseling.webp",
    imageAlt: "Compassionate Counseling",
    icon: "Heart",
    dimensions: [
      { name: "Relational", focus: "Communication and boundaries.", method: "Systemic Therapy" },
      { name: "Behavioral", focus: "Habits and reactions.", method: "Action-Oriented Planning" },
      { name: "Contextual", focus: "Social and cultural environment.", method: "CALD Specialized Care" },
      { name: "Empathetic", focus: "Unconditional positive regard.", method: "Person-Centered Support" }
    ],
    includes: [
      "Individual Counseling",
      "Couples Therapy",
      "Family Counseling",
      "Communication Skills Training",
      "Gottman Method Principles",
      "Intergenerational Healing"
    ]
  },
  "meditation-programs": {
    title: "Meditation Programs",
    tagline: "Mindful Resilience & Inner Peace",
    description: "Cultivate presence and reduce stress through guided mindfulness training, breathwork, and transformative wellness retreats.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "Meditation Practice",
    icon: "Compass",
    dimensions: [
      { name: "Mind", focus: "Mental clarity and focus.", method: "Mindfulness Training" },
      { name: "Body", focus: "Breath and physical stillness.", method: "Vipassana Techniques" },
      { name: "Soul", focus: "Transcendence and peace.", method: "Guided Visualization" },
      { name: "Energy", focus: "Vibrational and nervous system balance.", method: "Breathwork (Pranayama)" }
    ],
    includes: [
      "Guided Meditation Sessions",
      "Mindfulness-Based Stress Reduction",
      "Wellness Retreats",
      "Breathwork Workshops",
      "Body Awareness Practices",
      "Daily Practice Integration"
    ]
  },
  "personal-growth": {
    title: "Personal Growth",
    tagline: "Evolve Beyond Your Limitations",
    description: "Shift from 'What is wrong?' to 'What is right?'. Our growth programs use your internal resources to drive your evolution.",
    image: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "Sunrise Growth",
    icon: "Target",
    dimensions: [
      { name: "Vision", focus: "Future goals and aspirations.", method: "Strategic Life Coaching" },
      { name: "Agency", focus: "Self-efficacy and empowerment.", method: "Strength-Based Blueprint" },
      { name: "Identity", focus: "Authentic self-expression.", method: "Self-Discovery Workshops" },
      { name: "Performance", focus: "Confidence and public presence.", method: "Peak Performance Tools" }
    ],
    includes: [
      "Life Coaching",
      "Goal Setting & Achievement",
      "Confidence Building",
      "Career Guidance",
      "Self-Discovery Sessions",
      "Leadership Development"
    ]
  },
  "addiction-support": {
    title: "Addiction Recovery Support",
    tagline: "Sustainable Path to Recovery",
    description: "Evidence-based treatment for substance abuse and behavioral addictions, focusing on reclaiming your agency and rebuilding your life.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "Support Group Circle",
    icon: "ShieldCheck",
    dimensions: [
      { name: "Physical", focus: "Detox and somatic stability.", method: "Recovery Planning" },
      { name: "Psychological", focus: "Trigger management.", method: "Relapse Prevention" },
      { name: "Social", focus: "Community and support.", method: "Group Sessions" },
      { name: "Existential", focus: "Finding meaning beyond addiction.", method: "Spiritual Care" }
    ],
    includes: [
      "Addiction Assessment",
      "Relapse Prevention Strategies",
      "Support Groups",
      "Family Support Systems",
      "Ongoing Monitoring",
      "Holistic Recovery Tools"
    ],
    emergencySupport: true
  },
  "healing-recovery": {
    title: "Healing & Recovery",
    tagline: "Processing Grief & Trauma",
    description: "Compassionate support for grief, trauma, and PTSD using trauma-informed care to process difficult experiences and build resilience.",
    image: "/healing.webp",
    imageAlt: "Emotional Healing Support",
    icon: "Sparkles",
    dimensions: [
      { name: "Trauma", focus: "Processing difficult memories.", method: "Trauma-Informed Therapy" },
      { name: "Grief", focus: "Honoring loss and transition.", method: "Bereavement Counseling" },
      { name: "Resilience", focus: "Rebuilding inner strength.", method: "Healing Support" },
      { name: "Hope", focus: "Future outlook and meaning.", method: "Spiritual Integration" }
    ],
    includes: [
      "Grief Counseling",
      "Trauma-Informed Care",
      "PTSD Support",
      "Loss & Bereavement",
      "Crisis Intervention",
      "Somatic Healing"
    ],
    emergencySupport: true
  },
  "mediation": {
    title: "Mediation & Out-of-Court Settlement",
    tagline: "Professional Conflict Resolution",
    description: "We provide professional facilitation to help resolve conflicts constructively, offering a dignified and effective alternative to costly and stressful court proceedings.",
    image: "/mediation.webp",
    imageAlt: "Professional Mediation & Conflict Resolution",
    icon: "Scale",
    dimensions: [
      { name: "Neutral", focus: "Impartial, unbiased facilitation.", method: "Structured Mediation" },
      { name: "Relational", focus: "Communication and boundaries.", method: "Conflict Mapping" },
      { name: "Legal", focus: "Rights, agreements, and settlement.", method: "Out-of-Court Settlement" },
      { name: "Restorative", focus: "Repairing relationships and trust.", method: "Reconciliation Support" }
    ],
    includes: [
      "Family & Marital Disputes",
      "Financial & Property Disagreements",
      "Social & Community Conflicts",
      "Workplace Environment Disputes",
      "Out-of-Court Settlement",
      "Conflict Resolution Facilitation"
    ]
  },
  "residential-couples-therapy": {
    title: "Residential Couples Therapy",
    tagline: "Immersive Relationship Transformation",
    description: "An immersive, limited-availability residential program for couples seeking a deeper breakthrough. Escape external distractions and focus entirely on rebuilding love, connection, and understanding. Pre-booking required.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=1200",
    imageAlt: "Residential Couples Therapy Retreat",
    icon: "Home",
    dimensions: [
      { name: "Emotional", focus: "Reconnection, empathy, and safety.", method: "Emotionally Focused Therapy" },
      { name: "Communication", focus: "Listening and expression patterns.", method: "Gottman Method" },
      { name: "Relational", focus: "Trust, intimacy, and attachment.", method: "Attachment-Based Therapy" },
      { name: "Renewal", focus: "Shared vision and future goals.", method: "Couples Goal Setting" }
    ],
    includes: [
      "Intensive Couples Therapy",
      "Structured Retreat Environment",
      "Planned Meals & Activities",
      "Expert Senior Therapist Guidance",
      "Proven Communication Strategies",
      "Personalised Relationship Program"
    ]
  }
};

/** Short card text from the services page. */
export const SERVICE_SUMMARIES: Record<string, string> = {
  "personal-growth": "Our personal growth programs combine therapeutic insights with life coaching strategies to help you identify your values, set meaningful goals, and create the life you envision.",
  "addiction-support": "Our addiction support services provide evidence-based treatment for substance abuse and behavioral addictions with a focus on long-term recovery.",
  "meditation-programs": "Learn the transformative power of mindfulness through our structured meditation programs designed for stress reduction and emotional balance.",
  "healing-recovery": "Our healing and recovery programs provide compassionate support for those experiencing grief, trauma, or emotional distress.",
  "psychotherapy": "Our psychotherapy services utilize proven therapeutic approaches including CBT, DBT, and mindfulness-based interventions.",
  "counselling-services": "Our counseling services address relationship dynamics, family conflicts, and communication patterns for individuals and groups.",
  "mediation": "We provide professional facilitation to help resolve conflicts constructively, offering an effective alternative to costly and stressful court proceedings.",
  "residential-couples-therapy": "An immersive, limited-availability residential program for couples seeking a deeper breakthrough — escape distractions and focus entirely on your relationship. Pre-booking required."
};

/** Services featured on the home page, in order. */
export const HOME_SERVICES = ["psychotherapy", "counselling-services", "meditation-programs", "mediation", "residential-couples-therapy"];
