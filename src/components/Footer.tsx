import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "@/lib/translate";
import { useTranslationLoading } from "@/components/TranslationLoadingContext";

const quickLinks = [
  { to: "/careers", key: "exploreCareers", label: "Explore Careers" },
  { to: "/exams", key: "entranceExams", label: "Entrance Exams" },
  { to: "/colleges", key: "collegesDirectory", label: "Colleges Directory" },
  { to: "/scholarships", key: "scholarships", label: "Scholarships" },
  { to: "/career-test", key: "careerSelfTest", label: "Career Self-Test" },
  { to: "/student-registration", key: "studentRegistration", label: "Student Registration" },
  { to: "/reels-registration", key: "reelsRegistration", label: "Reels Registration" },
  { to: "/exhibitor-registration", key: "exhibitorRegistration", label: "Exhibitor Registration" },
];

export const Footer = () => {
  const { i18n } = useTranslation();
  const { setIsTranslating } = useTranslationLoading();
  const baseTexts = {
    description:
      "A comprehensive guide to careers, exams, and scholarships for students after 12th standard.",
    quickLinks: "Quick Links",
    resources: "Resources",
    contact: "Contact",
    exploreCareers: "Explore Careers",
    entranceExams: "Entrance Exams",
    collegesDirectory: "Colleges Directory",
    scholarships: "Scholarships",
    careerSelfTest: "Career Self-Test",
    studentRegistration: "Student Registration",
    reelsRegistration: "Influencer registration",
    exhibitorRegistration: "Exhibitor Registration",
    ministryOfEducation: "Ministry of Education",
    nationalScholarshipPortal: "National Scholarship Portal",
    copyright: "All rights reserved.",
  };

  const [texts, setTexts] = useState<Record<keyof typeof baseTexts, string> | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const safeTexts = texts || baseTexts;

  // Light particle network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots: { x: number; y: number; vx: number; vy: number; alpha: number }[] = [];
    for (let i = 0; i < 50; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.3 + 0.08,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;

        ctx.beginPath();
        ctx.arc(d.x, d.y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 115, 22, ${d.alpha})`;
        ctx.fill();
      });

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(253, 186, 116, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const runTranslation = async (lang: string) => {
      if (!isMounted) return;
      if (lang === "en") { setTexts(baseTexts); return; }
      try {
        const t = {} as Record<keyof typeof baseTexts, string>;
        for (const key of Object.keys(baseTexts) as Array<keyof typeof baseTexts>) {
          t[key] = await translateText(baseTexts[key], lang);
        }
        if (isMounted) setTexts(t);
      } catch { if (isMounted) setTexts(baseTexts); }
    };
    runTranslation(i18n.language);
    const handleLangChange = (lng: string) => {
      setIsTranslating(true);
      setTexts(null);
      runTranslation(lng).finally(() => setIsTranslating(false));
    };
    i18n.on("languageChanged", handleLangChange);
    return () => { isMounted = false; i18n.off("languageChanged", handleLangChange); };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .footer-root {
          position: relative;
          background: rgba(249,115,22,0.05);
          font-family: 'Rajdhani', sans-serif;
          overflow: hidden;
        }

        /* Subtle grid pattern */
        .footer-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(249,115,22,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,115,22,0.045) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .footer-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .footer-glow-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, #F97316 30%, #FDBA74 65%, transparent 100%);
          z-index: 3;
        }

        /* Corner bracket accents */
        .footer-corner {
          position: absolute;
          width: 24px; height: 24px;
          border-color: rgba(249,115,22,0.3);
          border-style: solid;
          z-index: 3;
          pointer-events: none;
        }
        .footer-corner-tl { top: 10px; left: 10px; border-width: 1.5px 0 0 1.5px; }
        .footer-corner-tr { top: 10px; right: 10px; border-width: 1.5px 1.5px 0 0; }
        .footer-corner-bl { bottom: 10px; left: 10px; border-width: 0 0 1.5px 1.5px; }
        .footer-corner-br { bottom: 10px; right: 10px; border-width: 0 1.5px 1.5px 0; }

        .footer-inner {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 56px 24px 32px;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.4fr;
          gap: 40px;
        }
        @media (max-width: 900px) { .footer-grid { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 560px) { .footer-grid { grid-template-columns: 1fr; } }

        .footer-logo-img {
          height: 52px;
          filter: drop-shadow(0 2px 8px rgba(249,115,22,0.15));
        }

        .footer-desc {
          margin-top: 16px;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          line-height: 1.75;
          color: #547e79;
        }

        .footer-heading {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #F97316;
          margin-bottom: 20px;
        }
        .footer-heading::before {
          content: '';
          display: inline-block;
          width: 16px; height: 1.5px;
          background: #F97316;
        }

        .footer-links { list-style: none; padding: 0; margin: 0; }
        .footer-links li { margin-bottom: 2px; }

        .footer-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          font-size: 14px;
          font-weight: 600;
          color: #010545;
          text-decoration: none;
          border: 1px solid transparent;
          border-radius: 5px;
          letter-spacing: 0.03em;
          transition: all 0.2s ease;
        }
        .footer-link svg {
          opacity: 0;
          transform: translateX(-4px);
          transition: all 0.2s;
          color: #010545;
        }
        .footer-link:hover {
          color: #FDBA74;
          background: rgba(249,115,22,0.07);
          border-color: rgba(249,115,22,0.2);
          padding-left: 14px;
        }
        .footer-link:hover svg { opacity: 1; transform: translateX(0); }

        .footer-resource {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 12px;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 600;
          color: #010545;
          text-decoration: none;
          border: 1px solid rgba(249,115,22,0.2);
          border-radius: 7px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(4px);
          letter-spacing: 0.03em;
          transition: all 0.25s ease;
        }
        .footer-resource svg { color: #010545; }
        .footer-resource:hover {
          color: #FDBA74;
          background: rgba(255,255,255,0.95);
          border-color: rgba(249,115,22,0.4);
          box-shadow: 0 2px 14px rgba(249,115,22,0.1), 0 0 0 3px rgba(249,115,22,0.06);
          transform: translateY(-1px);
        }

        .footer-address {
          display: block;
          padding: 13px 14px;
          margin-bottom: 14px;
          border: 1px solid rgba(249,115,22,0.2);
          border-radius: 8px;
          background: rgba(255,255,255,0.7);
          backdrop-filter: blur(6px);
          color: #010545;
          text-decoration: none;
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          line-height: 1.85;
          transition: all 0.25s ease;
        }
        .footer-address:hover {
          border-color: rgba(249,115,22,0.42);
          background: rgba(255,255,255,0.95);
          box-shadow: 0 4px 16px rgba(249,115,22,0.1);
          color: #C2410C;
        }
        .footer-address .maps-hint {
          display: block;
          margin-top: 7px;
          font-size: 9.5px;
          letter-spacing: 0.08em;
          opacity: 0.5;
        }

        .footer-contact-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 500;
          color: #010545;
        }
        .footer-contact-row svg { color: #010545; flex-shrink: 0; }
        .footer-contact-row a { color: #010545; text-decoration: none; transition: color 0.2s; }
        .footer-contact-row a:hover { color: #C2410C; }

        .footer-divider {
          margin: 40px 0 20px;
          height: 1px;
          position: relative;
          background: rgba(249,115,22,0.12);
        }
        .footer-divider::before {
          content: '';
          position: absolute;
          left: 0; top: 0;
          width: 100px; height: 1px;
          background: linear-gradient(90deg, #F97316, transparent);
        }
        .footer-divider::after {
          content: '';
          position: absolute;
          right: 0; top: 0;
          width: 60px; height: 1px;
          background: linear-gradient(270deg, rgba(253,186,116,0.55), transparent);
        }

        .footer-copy {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          font-family: 'Space Mono', monospace;
          font-size: 10.5px;
          color: #999;
          letter-spacing: 0.06em;
        }
        .footer-copy-brand { color: #F97316; font-weight: 700; }

        .footer-status { display: flex; align-items: center; gap: 7px; }
        .footer-pulse {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: #F97316;
          position: relative;
        }
        .footer-pulse::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1.5px solid #F97316;
          opacity: 0;
          animation: fp-ripple 2s ease-out infinite;
        }
        @keyframes fp-ripple {
          0%   { opacity: 0.5; transform: scale(0.6); }
          100% { opacity: 0;   transform: scale(2.2); }
        }
      `}</style>

      <footer className="footer-root">
        <canvas ref={canvasRef} className="footer-canvas" />
        <div className="footer-glow-top" />
        <div className="footer-corner footer-corner-tl" />
        <div className="footer-corner footer-corner-tr" />
        <div className="footer-corner footer-corner-bl" />
        <div className="footer-corner footer-corner-br" />

        <div className="footer-inner">
          <div className="footer-grid">

            {/* Brand */}
            <div>
              <Link to="/"><img src="/logo_new.svg" alt="EduConnect" className="footer-logo-img" /></Link>
              <p className="footer-desc">{safeTexts.description}</p>
            </div>

            {/* Quick Links */}
            <div>
              <div className="footer-heading">{safeTexts.quickLinks}</div>
              <ul className="footer-links">
                {quickLinks.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="footer-link">
                      <ChevronRight size={12} />
                      {safeTexts[link.key]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <div className="footer-heading">{safeTexts.resources}</div>
              <a href="https://www.education.gov.in/" target="_blank" rel="noopener noreferrer" className="footer-resource">
                <ArrowUpRight size={14} />{safeTexts.ministryOfEducation}
              </a>
              <a href="https://scholarships.gov.in/" target="_blank" rel="noopener noreferrer" className="footer-resource">
                <ArrowUpRight size={14} />{safeTexts.nationalScholarshipPortal}
              </a>
            </div>

            {/* Contact */}
            <div>
              <div className="footer-heading">{safeTexts.contact}</div>
              <a
                href="https://www.google.com/maps/place/14%C2%B027'39.3%22N+75%C2%B055'04.4%22E/@14.4609261,75.9153099,17z/data=!3m1!4b1!4m4!3m3!8m2!3d14.4609261!4d75.9178848?hl=en&entry=ttu&g_ep=EgoyMDI2MDMxOC4xIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-address"
              >
                <MapPin size={12} style={{ display: "inline", marginRight: "5px", color: "#F97316" }} />
                Shri Ganesh Plaza, PJ Extension<br />
                Opp. Chetana Hotel, 2nd Floor<br />
                Davanagere — 577004
                <span className="maps-hint">↗ VIEW ON GOOGLE MAPS</span>
              </a>

              <div className="footer-contact-row">
                <Phone size={13} />
                <span>
                  <a href="tel:9663881439">9663881439</a>{" / "}
                  <a href="tel:8088203437">8088203437</a>
                </span>
              </div>
              <div className="footer-contact-row">
                <Mail size={13} />
                <a href="mailto:admin@educonnect.info">admin@educonnect.info</a>
              </div>
            </div>
          </div>

          <div className="footer-divider" />

          <div className="footer-copy">
            <span>© {new Date().getFullYear()} <span className="footer-copy-brand">EDUCONNECT</span>. {safeTexts.copyright}</span>
            <div className="footer-status">
              <div className="footer-pulse" />
              <span>SYSTEMS ONLINE</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};