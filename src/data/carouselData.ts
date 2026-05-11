export type CarouselSlide = {
  id: string;
  title: string;
  subtitle: string;
  highlights: string[];
  ctaLabel: string;
  ctaRoute: string;
  image: string;
  eventDate?: string;
  eventLocation?: string;
};

export const carouselSlides: CarouselSlide[] = [
  {
    id: "exhibitor-booking",
    title: "Book Your Stall – Education Expo 2026",
    subtitle: "Connect with 10,000+ high-intent students",
    highlights: [
      "Direct student engagement",
      "High visibility branding",
      "Admissions boost opportunity",
      "Limited stalls available",
    ],
    ctaLabel: "Book Stall",
    ctaRoute: "/exhibitor-registration",
    image: "/exhibitor_reg_new.jpeg",
  },
  // {
  //   id: "reels-competition",
  //   title: "Reels Competition – Education Expo 2026",
  //   subtitle: "Showcase your creativity & win exciting prizes",
  //   highlights: [
  //     "1st Prize: ₹1,00,000",
  //     "2nd Prize: ₹50,000",
  //     "Get featured & gain visibility",
  //     "Become EduConnect ambassador",
  //   ],
  //   ctaLabel: "Participate Now",
  //   ctaRoute: "/reels-registration",
  //   image: "/reels_reg.jpeg",
  // },
  {
    id: "student-registration",
    title: "Education Expo 2026 – Student Registration",
    subtitle: "Find the right college, career & scholarships in one place",
    highlights: [
      "10,000+ students & parents attending",
      "₹1 Crore scholarships available",
      "Direct interaction with colleges",
      "Career guidance & counseling",
    ],
    eventDate: "23–24 May 2026",
    eventLocation: "Davanagere",
    ctaLabel: "Register Now",
    ctaRoute: "/student-registration",
    image: "/student_reg.jpeg",
  },
];
