import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";
import { ExternalLink, Sparkles, Users, Building2 } from "lucide-react";

type ExpoTexts = {
  title: string;
  description: string;
  badge: string;
  statInstitutions: string;
  statStudents: string;
  statGuidance: string;
  cta: string;
};

export const EducationExpoSection = () => {
  const { i18n } = useTranslation();
  const { setIsTranslating } = useTranslationLoading();
  const expoUrl = "https://expo.educonnect.in.net/expo-at-davangere/";
  const expoImgUrl = "/expo.png";

  const baseTexts: ExpoTexts = useMemo(
    () => ({
      title: "Education Expo 2026 – Davanagere",
      description:
        "EduConnect proudly presents Education Expo 2026 – Davanagere, a professionally organized platform connecting students, parents, and leading institutions from across Karnataka.",
      badge: "Upcoming · 2026",
      statInstitutions: "100+ Premier Educational Institutions",
      statStudents: "10,000+ Students Expected",
      statGuidance: "Scholarships & Expert Career Guidance",
      cta: "Explore More",
    }),
    []
  );

  const [texts, setTexts] = useState<ExpoTexts | null>(null);
  const safeTexts = texts || baseTexts;

  useEffect(() => {
    let isMounted = true;

    const runTranslation = async (lang: string) => {
      if (!isMounted) return;
      if (lang === "en") {
        setTexts(baseTexts);
        return;
      }
      try {
        const [
          title,
          description,
          badge,
          statInstitutions,
          statStudents,
          statGuidance,
          cta,
        ] = await Promise.all([
          translateText(baseTexts.title, lang),
          translateText(baseTexts.description, lang),
          translateText(baseTexts.badge, lang),
          translateText(baseTexts.statInstitutions, lang),
          translateText(baseTexts.statStudents, lang),
          translateText(baseTexts.statGuidance, lang),
          translateText(baseTexts.cta, lang),
        ]);
        if (isMounted) {
          setTexts({
            title,
            description,
            badge,
            statInstitutions,
            statStudents,
            statGuidance,
            cta,
          });
        }
      } catch (e) {
        console.error("EducationExpoSection translation failed", e);
        if (isMounted) setTexts(baseTexts);
      }
    };

    runTranslation(i18n.language);

    const handleLangChange = (lng: string) => {
      setIsTranslating(true);
      setTexts(null);
      runTranslation(lng).finally(() => setIsTranslating(false));
    };

    i18n.on("languageChanged", handleLangChange);
    return () => {
      isMounted = false;
      i18n.off("languageChanged", handleLangChange);
    };
  }, [i18n, baseTexts, setIsTranslating]);

  return (
    <>
      <style>{`
  .expo-outer {
    padding: 6rem 1.5rem;
    background: linear-gradient(
      180deg,
      hsl(var(--background)) 0%,
      hsl(var(--muted)) 100%
    );
  }

  .expo-card {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 32px;
    overflow: hidden;
    max-width: 1150px;
    margin: 0 auto;
    min-height: 520px;
    transition: transform 0.4s ease, box-shadow 0.4s ease;
    box-shadow:
      0 10px 40px rgba(0,0,0,0.08),
      0 40px 120px rgba(0,0,0,0.08);
  }

  .expo-card:hover {
    transform: translateY(-6px);
    box-shadow:
      0 20px 60px rgba(0,0,0,0.12),
      0 60px 160px rgba(0,0,0,0.10);
  }

  @media (max-width: 900px) {
    .expo-card {
      grid-template-columns: 1fr;
      min-height: auto;
    }
  }

  /* IMAGE SIDE */
  .expo-img-pane {
    position: relative;
    overflow: hidden;
  }

  .expo-img-pane img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 1s ease;
  }

  .expo-card:hover .expo-img-pane img {
    transform: scale(1.06);
  }

  .expo-img-pane::after {
  display: none;
}

  /* CONTENT SIDE */
  .expo-content-pane {
    position: relative;
    background: linear-gradient(
      135deg,
      hsl(var(--primary)) 0%,
      hsl(var(--primary) / 0.92) 100%
    );
    padding: 3.5rem 3rem;
    display: flex;
    align-items: center;
  }

  .expo-content-pane::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 85% 10%, hsl(var(--secondary) / 0.5), transparent 50%),
      radial-gradient(circle at 10% 90%, hsl(180 60% 35% / 0.4), transparent 50%);
    opacity: 0.9;
  }

  .expo-content-inner {
    position: relative;
    z-index: 2;
    max-width: 480px;
  }

  /* LIVE BADGE */
  .expo-live-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px 16px;
    border-radius: 100px;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    background: rgba(255,255,255,0.12);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.25);
    color: rgba(255,255,255,0.85);
    margin-bottom: 1.75rem;
  }

  .expo-pulse-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.7); }
    70% { box-shadow: 0 0 0 8px rgba(74, 222, 128, 0); }
    100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); }
  }

  .expo-heading {
    font-size: clamp(1.8rem, 2.8vw, 2.4rem);
    font-weight: 800;
    line-height: 1.2;
    color: #ffffff;
    margin-bottom: 1.25rem;
  }

  .expo-desc {
    font-size: 1rem;
    line-height: 1.75;
    color: rgba(255,255,255,0.75);
    margin-bottom: 2.5rem;
  }

  /* STATS */
  .expo-stats {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    margin-bottom: 2.75rem;
  }

  .expo-stat-item {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
  }

  .expo-stat-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.15);
    border: 1px solid rgba(255,255,255,0.2);
  }

  .expo-stat-icon svg {
    width: 16px;
    height: 16px;
  }

  /* CTA */
  .expo-cta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 26px;
    border-radius: 14px;
    background: #ffffff;
    color: hsl(var(--primary));
    font-weight: 700;
    font-size: 0.95rem;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }

  .expo-cta:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  }

  .expo-cta svg {
    transition: transform 0.25s ease;
  }

  .expo-cta:hover svg {
    transform: translate(3px, -3px);
  }

  @media (max-width: 640px) {
    .expo-outer {
      padding: 4rem 1.25rem;
    }
    .expo-content-pane {
      padding: 2.5rem 1.75rem;
    }
  }
`}</style>

      <section className="expo-outer">
        <div className="expo-card">
          <div className="expo-img-pane">
            <img
              src={expoImgUrl}
              alt="Education Expo 2026 Davanagere"
              loading="lazy"
            />
          </div>

          <div className="expo-content-pane">
            <div className="expo-content-inner">
              <div className="expo-live-badge">
                <span className="expo-pulse-dot" />
                <span className="expo-live-text">{safeTexts.badge}</span>
              </div>

              <h2 className="expo-heading">{safeTexts.title}</h2>

              <p className="expo-desc">{safeTexts.description}</p>

              <div className="expo-stats">
                <div className="expo-stat-item">
                  <span className="expo-stat-icon">
                    <Building2 />
                  </span>
                  {safeTexts.statInstitutions}
                </div>
                <div className="expo-stat-item">
                  <span className="expo-stat-icon">
                    <Users />
                  </span>
                  {safeTexts.statStudents}
                </div>
                <div className="expo-stat-item">
                  <span className="expo-stat-icon">
                    <Sparkles />
                  </span>
                  {safeTexts.statGuidance}
                </div>
              </div>

              <a
                href={expoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="expo-cta"
              >
                {safeTexts.cta}
                <ExternalLink />
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
