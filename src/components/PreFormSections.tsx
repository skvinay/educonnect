import { motion } from "framer-motion";
import {
  Award,
  BadgeIndianRupee,
  BarChart3,
  Briefcase,
  Building2,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  Compass,
  Eye,
  Gift,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Laptop,
  MapPin,
  Megaphone,
  Medal,
  Plane,
  Search,
  Sparkles,
  Star,
  Trophy,
  UserPlus,
  UsersRound,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PreFormSection } from "@/data/registrationContent";

type PreFormSectionsProps = {
  sections: PreFormSection[];
};

const getAltSectionBg = (index: number) => (index % 2 === 0 ? "bg-white" : "bg-slate-50");

const sectionMotion = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.45, ease: "easeOut" as const },
};

export const PreFormSections = ({ sections }: PreFormSectionsProps) => {
  const whyAttendIconMap = {
    GraduationCap,
    Compass,
    BadgeIndianRupee,
    Search,
    Globe,
  } as const;

  const whoShouldAttendIconMap = {
    Users,
    UserPlus,
    BookOpen,
    Plane,
    Heart,
  } as const;

  const reelsWhyParticipateIconMap = {
    "Gain visibility": Megaphone,
    "Get featured on platforms": Star,
    "Connect with students": UsersRound,
    "Win rewards": Gift,
  } as const;

  const exhibitorWhyParticipateIconMap = {
    "Direct Student Engagement": Handshake,
    "Institutional Visibility": Eye,
    "Admissions Growth": BarChart3,
    "Branding Exposure": Megaphone,
  } as const;

  const whoCanJoinIconMap = {
    "Schools & Colleges": Building2,
    "Coaching Institutes": BookOpen,
    "EdTech companies": Laptop,
    "Foreign Universities": Globe,
    Consultants: Briefcase,
  } as const;

  return (
    <div className="mx-auto mb-10 w-full max-w-[1100px] space-y-5 md:mb-12 md:space-y-6">
      {sections.map((section, index) => {
        if (section.type === "hero") {
          return (
            <motion.section
              key={`${section.type}-${index}`}
              {...sectionMotion}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-[0_18px_50px_rgba(15,23,42,0.35)]"
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute -bottom-12 left-1/3 h-28 w-28 rounded-full bg-orange-200/20 blur-xl" />

              <div className="relative p-6 md:p-8">
                <h1 className="text-2xl font-bold md:text-3xl">{section.title}</h1>
                <p className="mt-2 text-base font-medium text-white/85">{section.subtitle}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {section.points.map((point) => (
                    <span
                      key={point}
                      className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 text-sm text-white backdrop-blur-sm"
                    >
                      <Sparkles className="h-4 w-4 text-orange-300" />
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </motion.section>
          );
        }

        if (section.type === "cards") {
          if (section.title === "Why Participate" && section.items.every((item) => !item.description)) {
            return (
              <motion.section
                key={`${section.type}-${index}`}
                {...sectionMotion}
                className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
              >
                <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {section.items.map((item) => {
                    const Icon = reelsWhyParticipateIconMap[item.title as keyof typeof reelsWhyParticipateIconMap] ?? Star;

                    return (
                      <div
                        key={`${item.title}-${item.description ?? ""}`}
                        className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-6 text-center"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100">
                          <Icon className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="mt-4 text-base font-medium text-gray-900">{item.title}</h3>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          }

          if (section.title === "Why Participate" && section.items.some((item) => item.description)) {
            return (
              <motion.section
                key={`${section.type}-${index}`}
                {...sectionMotion}
                className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
              >
                <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-2">
                  {section.items.map((item) => {
                    const Icon =
                      exhibitorWhyParticipateIconMap[item.title as keyof typeof exhibitorWhyParticipateIconMap] ?? Handshake;

                    return (
                      <div
                        key={`${item.title}-${item.description ?? ""}`}
                        className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6"
                      >
                        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-orange-100">
                          <Icon className="h-5 w-5 text-orange-600" />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          }

          if (section.title === "Prizes") {
            return (
              <motion.section
                key={`${section.type}-${index}`}
                {...sectionMotion}
                className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
              >
                <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item) => {
                    const isFirst = item.title === "1st Prize";
                    const isSecond = item.title === "2nd Prize";
                    const isThird = item.title === "3rd Prize" || item.title === "Next Top 10";
                    const isTopTen = item.title === "Top 10";

                    const cardClasses = isFirst
                      ? "border-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-300"
                      : isSecond
                        ? "border-gray-300 bg-gray-200"
                        : isThird
                          ? "border-orange-300 bg-gradient-to-br from-orange-100 to-orange-200"
                          : "border-gray-200 bg-gray-100";

                    const PrizeIcon = isFirst ? Trophy : isSecond ? Medal : isThird ? Award : Gift;
                    const value = isTopTen ? "Rewards" : item.description;

                    return (
                      <div
                        key={`${item.title}-${item.description ?? ""}`}
                        className={`flex min-h-44 flex-col items-center justify-center rounded-2xl border p-6 text-center ${cardClasses}`}
                      >
                        <PrizeIcon className={`h-6 w-6 ${isFirst ? "text-orange-600" : "text-slate-700"}`} />
                        <h3 className="mt-3 text-base font-medium text-gray-900">{item.title}</h3>
                        {value && <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>}
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          }

          if (section.title === "Stall Options") {
            return (
              <motion.section
                key={`${section.type}-${index}`}
                {...sectionMotion}
                className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
              >
                <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
                  {section.items.map((item) => {
                    const isDiamond = item.title === "Diamond";
                    const isPlatinum = item.title === "Platinum";
                    const isGold = item.title === "Gold";
                    const isSilver = item.title === "Silver";

                    const cardClasses = isDiamond
                      ? "border border-blue-400 bg-blue-100"
                      : isPlatinum
                        ? "border border-gray-300 bg-gray-200"
                        : isGold
                          ? "border border-yellow-400 bg-gradient-to-br from-yellow-100 to-yellow-300"
                          : isSilver
                            ? "border border-gray-300 bg-gray-100"
                            : "border border-gray-200 bg-white";

                    return (
                      <div
                        key={`${item.title}-${item.description ?? ""}`}
                        className={`relative rounded-2xl p-6 text-center ${cardClasses}`}
                      >
                        <span className="inline-flex rounded-full bg-black px-3 py-1 text-xs text-white">{item.title}</span>
                        {item.description && <p className="mt-4 text-2xl font-bold text-gray-900">{item.description}</p>}
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          }

          if (section.title === "Expo Scale") {
            return (
              <motion.section
                key={`${section.type}-${index}`}
                {...sectionMotion}
                className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
              >
                <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>

                <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <div
                      key={`${item.title}-${item.description ?? ""}`}
                      className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                        <BarChart3 className="h-6 w-6 text-blue-600" />
                      </div>
                      <p className="mt-4 text-2xl font-bold text-gray-900">{item.title}</p>
                      {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </motion.section>
            );
          }

          if (section.layout === "whyAttend") {
            return (
              <motion.section
                key={`${section.type}-${index}`}
                {...sectionMotion}
                className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} px-6 py-8 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:px-8 md:py-10`}
              >
                <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
                  {section.items.map((item) => {
                    const Icon = item.icon ? whyAttendIconMap[item.icon] : GraduationCap;
                    const isScholarshipCard = item.title === "₹1 Crore Scholarships";
                    const isCompareCard = item.title === "Compare Courses & Colleges";
                    const isStudyAbroadCard = item.title === "Study Abroad Opportunities";

                    return (
                      <div
                        key={`${item.title}-${item.description ?? ""}`}
                        className={`flex gap-4 rounded-2xl p-6 transition duration-300 hover:shadow-md ${
                          isScholarshipCard
                            ? "border border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-100 shadow-md"
                            : "border border-gray-200 bg-white"
                        } lg:col-span-2 ${isCompareCard ? "lg:col-start-2" : ""} ${
                          isStudyAbroadCard ? "lg:col-start-4" : ""
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 flex-none items-center justify-center rounded-lg ${
                            isScholarshipCard ? "bg-orange-500" : "bg-blue-100"
                          }`}
                        >
                          <Icon className={`h-5 w-5 ${isScholarshipCard ? "text-white" : "text-blue-600"}`} />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          {item.description && <p className="mt-1 text-sm text-gray-600">{item.description}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          }

          return (
            <motion.section
              key={`${section.type}-${index}`}
              {...sectionMotion}
              className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
            >
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <Card
                    key={`${item.title}-${item.description ?? ""}`}
                    className="group overflow-hidden border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="h-1 w-full bg-gradient-to-r from-slate-600 via-slate-400 to-slate-200" />
                    <CardHeader className="pb-2 pt-4">
                      <CardTitle className="text-base font-semibold text-slate-900">{item.title}</CardTitle>
                    </CardHeader>
                    {item.description && (
                      <CardContent>
                        <p className="text-sm text-slate-600">{item.description}</p>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </motion.section>
          );
        }

        if (section.type === "checklist") {
          if (
            section.title === "Benefits" &&
            sections[index - 1]?.type === "checklist" &&
            (sections[index - 1]?.title === "What to Create" || sections[index - 1]?.title === "Who can participate")
          ) {
            return null;
          }

          if (section.title === "What to Create" || section.title === "Who can participate") {
            const nextSection = sections[index + 1];
            const benefitsSection =
              nextSection && nextSection.type === "checklist" && nextSection.title === "Benefits"
                ? nextSection
                : null;

            return (
              <motion.section
                key={`${section.type}-${index}`}
                {...sectionMotion}
                className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
              >
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-gray-200 bg-white p-6">
                    <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>
                    <ul className="mt-4 space-y-3">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-gray-800">
                          <Check className="mt-0.5 h-4 w-4 flex-none text-orange-600" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {benefitsSection && (
                    <div className="rounded-2xl border border-gray-200 bg-white p-6">
                      <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{benefitsSection.title}</h2>
                      <ul className="mt-4 space-y-3">
                        {benefitsSection.items.map((item) => (
                          <li key={item} className="flex items-start gap-3 text-sm text-gray-800">
                            <Star className="mt-0.5 h-4 w-4 flex-none text-orange-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.section>
            );
          }

          return (
            <motion.section
              key={`${section.type}-${index}`}
              {...sectionMotion}
              className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
            >
              <h2 className={`text-xl font-bold text-slate-900 md:text-2xl ${section.centered ? "text-center" : ""}`}>
                {section.title}
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {section.items.map((item) => (
                  <li
                    key={item}
                    className={`flex gap-2.5 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-700 transition-colors duration-300 hover:bg-slate-50 ${
                      section.centered ? "items-center justify-center text-center" : "items-start"
                    }`}
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-slate-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          );
        }

        if (section.type === "grid") {
          if (section.title === "Who Can Join") {
            return (
              <motion.section
                key={`${section.type}-${index}`}
                {...sectionMotion}
                className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
              >
                <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {section.items.map((item) => {
                    const Icon = whoCanJoinIconMap[item as keyof typeof whoCanJoinIconMap] ?? Building2;

                    return (
                      <div
                        key={item}
                        className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="mt-4 text-base font-medium text-gray-900">{item}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          }

          if (section.layout === "whoShouldAttend") {
            return (
              <motion.section
                key={`${section.type}-${index}`}
                {...sectionMotion}
                className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} px-6 py-8 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:px-8 md:py-10`}
              >
                <h2 className="text-center text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>

                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
                  {section.items.map((item) => {
                    const Icon = whoShouldAttendIconMap[item.icon];

                    return (
                      <div
                        key={item.label}
                        className="flex flex-col items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-md"
                      >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                          <Icon className="h-6 w-6 text-indigo-600" />
                        </div>

                        <p className="text-base font-medium text-gray-900">{item.label}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.section>
            );
          }

          return (
            <motion.section
              key={`${section.type}-${index}`}
              {...sectionMotion}
              className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
            >
              <h2 className="text-xl font-bold text-slate-900 md:text-2xl">{section.title}</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((item) => (
                  <div
                    key={item}
                    className="rounded-lg border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </motion.section>
          );
        }

        if (section.type === "details") {
          return (
            <motion.section
              key={`${section.type}-${index}`}
              {...sectionMotion}
              className={`rounded-2xl border border-slate-200 ${getAltSectionBg(index)} p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8`}
            >
              <h2 className={`text-xl font-bold text-slate-900 md:text-2xl ${section.centered ? "text-center" : ""}`}>
                {section.title}
              </h2>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {section.items.map((detail) => {
                  const icon =
                    detail.label === "Venue" ? (
                      <MapPin className="h-5 w-5 text-blue-600" />
                    ) : detail.label === "Date" ? (
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Clock3 className="h-5 w-5 text-blue-600" />
                    );

                  return (
                    <div
                      key={`${detail.label}-${detail.value}`}
                      className="rounded-lg border border-slate-200 bg-white p-4 transition-all duration-300 hover:shadow-md"
                    >
                      <div
                        className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                          section.centered ? "justify-center text-center" : ""
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">{icon}</div>
                        {detail.label}
                      </div>
                      <p
                        className={`mt-2 text-sm font-medium text-slate-800 ${
                          section.centered ? "text-center" : "ml-12"
                        }`}
                      >
                        {detail.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.section>
          );
        }

        return (
          <motion.section
            key={`${section.type}-${index}`}
            {...sectionMotion}
            className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:p-8"
          >
            {(() => {
              const isScholarshipCtaSection =
                section.title === "Register now to unlock scholarship eligibility and priority entry.";

              return (
            <div
              className={`flex flex-col gap-5 md:flex-row md:items-center ${
                section.centered ? "items-center justify-center text-center" : "items-start justify-between"
              }`}
            >
              <div className={section.centered ? "flex flex-col items-center" : ""}>
                <h2 className="text-lg font-bold text-slate-900 md:text-xl">{section.title}</h2>
                {section.points && (
                  <ul className={`mt-3 space-y-2 ${section.centered ? "text-center" : ""}`}>
                    {section.points.map((point) => (
                      (() => {
                        const useGoldStyle =
                          isScholarshipCtaSection &&
                          (point === "₹1 Crore scholarship eligibility" || point === "Priority entry");

                        return (
                      <li
                        key={point}
                        className={`flex gap-2 text-sm text-slate-700 ${
                          section.centered ? "items-center justify-center" : "items-start"
                        }`}
                      >
                        <CheckCircle2
                          className={`mt-0.5 h-4 w-4 flex-none ${useGoldStyle ? "text-yellow-600" : "text-slate-600"}`}
                        />
                        <span className={useGoldStyle ? "text-yellow-600" : ""}>{point}</span>
                      </li>
                        );
                      })()
                    ))}
                  </ul>
                )}
              </div>
              {!section.hideButton && (
                <Button className="min-w-52" size="lg">
                  {section.buttonLabel}
                </Button>
              )}
            </div>
              );
            })()}
          </motion.section>
        );
      })}
    </div>
  );
};
