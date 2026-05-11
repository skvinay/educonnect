export type RegistrationPageKey = "student" | "reels" | "exhibitor";

type HeroSection = {
  type: "hero";
  title: string;
  subtitle: string;
  points: string[];
};

type CardsSection = {
  type: "cards";
  title: string;
  layout?: "default" | "whyAttend";
  items: Array<{
    title: string;
    description?: string;
    icon?: "GraduationCap" | "Compass" | "BadgeIndianRupee" | "Search" | "Globe";
  }>;
};

type ChecklistSection = {
  type: "checklist";
  title: string;
  centered?: boolean;
  items: string[];
};

type GridSection =
  | {
      type: "grid";
      title: string;
      layout?: "default";
      items: string[];
    }
  | {
      type: "grid";
      title: string;
      layout: "whoShouldAttend";
      items: Array<{
        label: string;
        icon: "Users" | "UserPlus" | "BookOpen" | "Plane" | "Heart";
      }>;
    };

type DetailsSection = {
  type: "details";
  title: string;
  centered?: boolean;
  items: Array<{ label: string; value: string }>;
};

type CtaSection = {
  type: "cta";
  title: string;
  points?: string[];
  buttonLabel: string;
  centered?: boolean;
  hideButton?: boolean;
};

export type PreFormSection =
  | HeroSection
  | CardsSection
  | ChecklistSection
  | GridSection
  | DetailsSection
  | CtaSection;

export const registrationContent: Record<RegistrationPageKey, PreFormSection[]> = {
  student: [
    {
      type: "hero",
      title: "Education Expo 2026 – Shape Your Future",
      subtitle: "Find the right college, career & scholarships — all in one place",
      points: ["Direct college interaction", "Career clarity", "Scholarship opportunities"],
    },
    {
      type: "cards",
      title: "Why Attend",
      layout: "whyAttend",
      items: [
        {
          icon: "GraduationCap",
          title: "Meet Top Schools, Colleges & Universities",
          description: "Connect directly with leading institutions",
        },
        {
          icon: "Compass",
          title: "One-on-One Career Guidance",
          description: "Get personalized career counseling",
        },
        {
          icon: "BadgeIndianRupee",
          title: "₹1 Crore Scholarships",
          description: "Access exclusive scholarship opportunities",
        },
        {
          icon: "Search",
          title: "Compare Courses & Colleges",
          description: "Make informed decisions easily",
        },
        {
          icon: "Globe",
          title: "Study Abroad Opportunities",
          description: "Explore international education options",
        },
      ],
    },
    {
      type: "checklist",
      title: "What You’ll Experience",
      centered: true,
      items: [
        "Meet 100+ schools, colleges and Universities",
        "Live counseling sessions",
        "Admission guidance",
        "Proper Career Guidance with Free of cost",
      ],
    },
    {
      type: "grid",
      title: "Who Should Attend",
      layout: "whoShouldAttend",
      items: [
        { icon: "Users", label: "10th / SSLC students" },
        { icon: "UserPlus", label: "12th / PUC students" },
        { icon: "BookOpen", label: "NEET / JEE aspirants" },
        { icon: "Plane", label: "Degree / Abroad seekers" },
        { icon: "Heart", label: "Parents" },
      ],
    },
    {
      type: "details",
      title: "Event Details",
      centered: true,
      items: [
        { label: "Venue", value: "Shri Abhinava Renuka Mandir" },
        { label: "Date", value: "23–24 May 2026" },
        { label: "Time", value: "9:30 AM – 8:30 PM" },
      ],
    },
    {
      type: "cta",
      title: "Register now to unlock scholarship eligibility and priority entry.",
      points: ["₹1 Crore scholarship eligibility", "Priority entry"],
      buttonLabel: "Complete Your Registration",
      centered: true,
      hideButton: true,
    },
  ],
  reels: [
    {
      type: "hero",
      title: "Reels Competition – Show Your Creativity",
      subtitle: "Create, showcase & win exciting prizes",
      points: ["Create", "Showcase", "Win exciting rewards"],
    },
    {
      type: "cards",
      title: "Why Participate",
      items: [
        { title: "Gain visibility" },
        { title: "Get featured on platforms" },
        { title: "Connect with students" },
        { title: "Win rewards" },
      ],
    },
    {
      type: "cards",
      title: "Prizes",
      items: [
        { title: "1st Prize", description: "₹1,00,000" },
        { title: "2nd Prize", description: "₹50,000" },
        { title: "Next Top 10", description: "₹5,000" },
      ],
    },
    {
      type: "checklist",
      title: "Who can participate",
      items: [
        "Student",
        "Content creator",
        "Influencer with 3000+ followers",
      ],
    },
    {
      type: "checklist",
      title: "Benefits",
      items: ["Become brand ambassador", "Social media exposure", "Recognition"],
    },
    {
      type: "details",
      title: "Event Details",
      centered: true,
      items: [
        { label: "Venue", value: "Shri Abhinava Renuka Mandir" },
        { label: "Date", value: "23–24 May 2026" },
        { label: "Time", value: "9:30 AM – 8:30 PM" },
      ],
    },
    {
      type: "cta",
      title: "Bring your creativity to the spotlight.",
      buttonLabel: "Submit Your Reel Entry",
      centered: true,
      hideButton: true,
    },
  ],
  exhibitor: [
    {
      type: "hero",
      title: "Book Your Stall – Education Expo 2026",
      subtitle: "Connect with high-intent students & boost admissions",
      points: ["High-intent audience", "Admissions boost", "Strong brand visibility"],
    },
    {
      type: "cards",
      title: "Why Participate",
      items: [
        { title: "Direct Student Engagement", description: "Face-to-face interaction with prospects" },
        { title: "Institutional Visibility", description: "Boost your brand presence" },
        { title: "Admissions Growth", description: "Drive enrollment numbers" },
        { title: "Branding Exposure", description: "Reach thousands of students" },
      ],
    },
    {
      type: "grid",
      title: "Who Can Join",
      items: [
        "Schools & Colleges",
        "Coaching Institutes",
        "EdTech companies",
        "Foreign Universities",
        "Consultants",
      ],
    },
    {
      type: "cards",
      title: "Stall Options",
      items: [
        { title: "Diamond", description: "₹1,00,000" },
        { title: "Platinum", description: "₹70,000" },
        { title: "Gold", description: "₹60,000" },
        { title: "Silver", description: "₹30,000" },
        { title: "Normal Stall", description: "Basic setup Affordable" },
      ],
    },
    {
      type: "cards",
      title: "Expo Scale",
      items: [
        { title: "10,000+", description: "Footfall" },
        { title: "High-intent", description: "Audience" },
        { title: "Massive", description: "Exposure" },
      ],
    },
    {
      type: "details",
      title: "Event Details",
      centered: true,
      items: [
        { label: "Venue", value: "Shri Abhinava Renuka Mandir" },
        { label: "Date", value: "23–24 May 2026" },
        { label: "Time", value: "9:30 AM – 8:30 PM" },
      ],
    },
    {
      type: "cta",
      title: "Limited stalls available for 2026.",
      buttonLabel: "Book Your Stall Now",
      centered: true,
      hideButton: true,
    },
  ],
};
