import { Link } from "react-router-dom";

import { ComponentType, CSSProperties } from "react";

type CategoryCardProps = {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
  bgColor: string;
  hoverGradient: string;
  link: string;
  linkText: string;
};

// Extract colors from gradient string (e.g., "linear-gradient(135deg, #2563EB 0%, #06B6D4 100%)" => ["#2563EB", "#06B6D4"])
const extractGradientColors = (gradient: string): [string, string] => {
  const matches = gradient.match(/#[A-Fa-f0-9]{6}/g);
  if (matches && matches.length >= 2) {
    return [matches[0], matches[1]];
  }
  return ["#6366F1", "#8B5CF6"]; // Default fallback
};

export const CategoryCard = ({
  title,
  description,
  icon: Icon,
  bgColor,
  hoverGradient,
  link,
  linkText,
}: CategoryCardProps) => {
  const [color1, color2] = extractGradientColors(bgColor);

  return (
    <Link
      to={link}
      style={{
        "--card-hover-gradient": hoverGradient,
        "--card-bg-gradient": `linear-gradient(to bottom right, ${color1}14, ${color2}14)`,
      } as CSSProperties}
      className="group flex h-full cursor-pointer flex-col rounded-[18px] border border-[#E5E7EB] p-6 shadow-none transition-all duration-200 ease-in-out hover:-translate-y-1 bg-[image:var(--card-bg-gradient)] hover:bg-[image:var(--card-hover-gradient)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
    >
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-[14px] transition-transform duration-200 ease-in-out group-hover:scale-[1.12]"
        style={{ background: bgColor }}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>

      <h3 className="mb-2 text-[20px] font-semibold leading-tight text-[#111827]">
        {title}
      </h3>

      <p className="mb-5 text-[15px] leading-relaxed text-[#6B7280] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] overflow-hidden">
        {description}
      </p>

      <span className="mt-auto inline-flex items-center text-[15px] font-medium text-[#1F2937]">
        {linkText}
        <span className="ml-1 inline-block transition-transform duration-200 ease-in-out group-hover:translate-x-2">
          →
        </span>
      </span>
    </Link>
  );
};
