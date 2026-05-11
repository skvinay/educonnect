import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Compass,
  GraduationCap,
  Building2,
  Award,
  BookOpen,
  ClipboardList,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/service/AuthContent";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";

const navLinks = [
  { to: "/", key: "home", icon: Compass },
  { to: "/careers", key: "careers", icon: GraduationCap },
  { to: "/exams", key: "exams", icon: BookOpen },
  { to: "/colleges", key: "colleges", icon: Building2 },
  { to: "/ai-chat", key: "aiChat", icon: MessageSquare, protected: true },
  { to: "/scholarships", key: "scholarships", icon: Award, protected: true },
];

const registrationLinks = [
  { to: "/student-registration", key: "studentRegistration" },
  // { to: "/reels-registration", key: "reelsRegistration" },
  { to: "/exhibitor-registration", key: "exhibitorRegistration" },
];

export const Navbar = () => {
  const [pendingRoute, setPendingRoute] = useState<string | null>(null);

  const { user, loading } = useAuth();
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();

  const { i18n } = useTranslation();

  const baseTexts = {
    logo: "EduConnect",

    home: "Home",
    careers: "Careers",
    exams: "Exams",
    colleges: "Colleges",
    aiChat: "AI Chat",
    scholarships: "Scholarships",
    registrations: "Registrations",
    studentRegistration: "Student Registration",
    // reelsRegistration: "Influencer registration",
    exhibitorRegistration: "Exhibitor Registration",

    takeCareerTest: "Take Career Test",

    loginRequired: "Login Required",
    loginSubtitle: "Please sign in with Google to continue.",
    signInWithGoogle: "Sign in with Google",
    cancel: "Cancel",
  };

  const [texts, setTexts] = useState<Record<
    keyof typeof baseTexts,
    string
  > | null>(null);

  const safeTexts = texts || baseTexts;

  const handleProtectedNavigation = (e: string) => {
    if (!user) {
      setPendingRoute(e);
      setShowLoginDialog(true);
    } else {
      navigate(e);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      console.log("Logged in user:", result.user);

      setShowLoginDialog(false);

      if (pendingRoute) {
        navigate(pendingRoute);
        setPendingRoute(null);
      }
    } catch (error) {
      console.error("Google sign-in failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  useEffect(() => {
    let isMounted = true;

    const runTranslation = async (lang: string) => {
      if (!isMounted) return;

      // English → instant
      if (lang === "en") {
        setTexts(baseTexts);
        return;
      }

      try {
        const t = {} as Record<keyof typeof baseTexts, string>;

        t.logo = await translateText(baseTexts.logo, lang);

        t.home = await translateText(baseTexts.home, lang);
        t.careers = await translateText(baseTexts.careers, lang);
        t.exams = await translateText(baseTexts.exams, lang);
        t.colleges = await translateText(baseTexts.colleges, lang);
        t.aiChat = await translateText(baseTexts.aiChat, lang);
        t.scholarships = await translateText(baseTexts.scholarships, lang);
        t.registrations = await translateText(baseTexts.registrations, lang);
        t.studentRegistration = await translateText(
          baseTexts.studentRegistration,
          lang
        );
        // t.reelsRegistration = await translateText(
        //   baseTexts.reelsRegistration,
        //   lang
        // );
        t.exhibitorRegistration = await translateText(
          baseTexts.exhibitorRegistration,
          lang
        );

        t.takeCareerTest = await translateText(baseTexts.takeCareerTest, lang);

        t.loginRequired = await translateText(baseTexts.loginRequired, lang);
        t.loginSubtitle = await translateText(baseTexts.loginSubtitle, lang);
        t.signInWithGoogle = await translateText(
          baseTexts.signInWithGoogle,
          lang
        );
        t.cancel = await translateText(baseTexts.cancel, lang);

        if (isMounted) setTexts(t);
      } catch (e) {
        console.error("Navbar translation failed", e);
        if (isMounted) setTexts(baseTexts);
      }
    };

    // Initial run
    runTranslation(i18n.language);

    const handleLangChange = (lng: string) => {
      // 🔹 Force loader
      setTexts(null);
      runTranslation(lng);
    };

    i18n.on("languageChanged", handleLangChange);

    return () => {
      isMounted = false;
      i18n.off("languageChanged", handleLangChange);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0">
              <img
                src="/logo_new.svg"
                alt="EduConnect"
                className="h-8 sm:h-9 md:h-10 w-auto object-contain"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive =
                  location.pathname === link.to ||
                  (link.to !== "/" && location.pathname.startsWith(link.to));

                return link.protected ? (
                  <button
                    key={link.to}
                    onClick={() => handleProtectedNavigation(link.to)}
                  >
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 ${
                        isActive
                          ? "gradient-teal text-white shadow-md"
                          : "hover:text-[#14B8A6] hover:bg-[rgba(20,184,166,0.1)]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {safeTexts[link.key as keyof typeof baseTexts]}
                    </Button>
                  </button>
                ) : (
                  <Link key={link.to} to={link.to}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 ${
                        isActive
                          ? "gradient-teal text-white shadow-md"
                          : "hover:text-[#14B8A6] hover:bg-[rgba(20,184,166,0.1)]"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {safeTexts[link.key as keyof typeof baseTexts]}
                    </Button>
                  </Link>
                );
              })}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`gap-2 ${
                      registrationLinks.some(
                        (item) => location.pathname === item.to
                      )
                        ? "gradient-teal text-white shadow-md"
                        : "hover:text-[#14B8A6] hover:bg-[rgba(20,184,166,0.1)]"
                    }`}
                  >
                    <ClipboardList className="w-4 h-4" />
                    {safeTexts.registrations}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {registrationLinks.map((item) => (
                    <DropdownMenuItem key={item.to} asChild>
                      <Link to={item.to}>
                        {safeTexts[item.key as keyof typeof baseTexts]}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Career Test CTA */}
            <div className="hidden lg:flex items-center gap-4">
              <LanguageSwitcher />

              <div className="flex items-center gap-3">
                {user && (
                  <span className="text-sm font-bold text-secondary">
                    {user.displayName}
                  </span>
                )}

                <Button
                  onClick={() => handleProtectedNavigation("/career-test")}
                  className="gradient-teal text-white shadow-md hover:shadow-lg transition-shadow"
                  style={{
                    background:
                      "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
                  }}
                >
                  {safeTexts.takeCareerTest}
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-card border-t border-border/50"
            >
              <div className="container mx-auto px-4 py-4 space-y-2">
                {user && (
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border/50">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        {user.displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                )}

                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;

                  // 🔹 PROTECTED LINKS (Scholarships etc.)
                  if (link.protected) {
                    return (
                      <button
                        key={link.to}
                        onClick={() => {
                          setIsOpen(false);
                          handleProtectedNavigation(link.to);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
                          isActive
                            ? "gradient-hero text-white"
                            : "hover:bg-muted"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">
                          {safeTexts[link.key as keyof typeof baseTexts]}
                        </span>
                      </button>
                    );
                  }

                  // 🔹 NORMAL (PUBLIC) LINKS
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                        isActive ? "gradient-hero text-white" : "hover:bg-muted"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">
                        {safeTexts[link.key as keyof typeof baseTexts]}
                      </span>
                    </Link>
                  );
                })}

                <div className="pt-2">
                  <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {safeTexts.registrations}
                  </div>
                  {registrationLinks.map((item) => {
                    const isActive = location.pathname === item.to;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive
                            ? "gradient-hero text-white"
                            : "hover:bg-muted"
                        }`}
                      >
                        <ClipboardList className="w-5 h-5" />
                        <span className="font-medium">
                          {safeTexts[item.key as keyof typeof baseTexts]}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* Language Switcher */}
                <div className="px-4 py-2">
                  <LanguageSwitcher />
                </div>

                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleProtectedNavigation("/career-test");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-teal text-white font-medium"
                  style={{
                    background:
                      "linear-gradient(135deg, #14B8A6 0%, #0D9488 100%)",
                  }}
                >
                  {safeTexts.takeCareerTest}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      {showLoginDialog && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[350px] space-y-4 shadow-xl animate-in fade-in zoom-in">
            <h2 className="text-lg font-semibold text-center">
              {safeTexts.loginRequired}
            </h2>
            <p className="text-sm text-muted-foreground text-center">
              {safeTexts.loginSubtitle}
            </p>

            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:bg-white/90 hover:text-black/90"
              onClick={signInWithGoogle}
            >
              <img
                src="/google.png"
                alt="Google"
                className="w-5 h-5 hover:bg-black/90"
              />
              <span>{safeTexts.signInWithGoogle}</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowLoginDialog(false)}
            >
              {safeTexts.cancel}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
