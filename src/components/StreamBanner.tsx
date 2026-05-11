import { ComponentType } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface StreamBannerProps {
  title: string;
  subtitle: string;
  count: number;
  Icon: ComponentType<{ className?: string }>;
  gradientFrom: string;
  gradientTo: string;
  backLink?: string;
  backText?: string;
}

export const StreamBanner = ({
  title,
  subtitle,
  count,
  Icon,
  gradientFrom,
  gradientTo,
  backLink = "/colleges",
  backText = "Back to streams",
}: StreamBannerProps) => {
  return (
    <div
      className="relative w-full"
      style={{
        background: `linear-gradient(to right, ${gradientFrom}, ${gradientTo})`,
      }}
    >
      {/* Back Button */}
      <div className="absolute top-6 left-8 md:top-8 md:left-12 z-10">
        <Link
          to={backLink}
          className="inline-flex items-center gap-2 text-white/90 text-sm md:text-base hover:text-white transition-opacity duration-200 no-underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {backText}
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex items-start gap-6 md:gap-8 px-8 md:px-12 lg:px-16 pt-36 md:pt-44 pb-16 min-h-[300px] md:min-h-[360px]">
        
        {/* Icon */}
        <div
          className="flex-shrink-0 rounded-2xl flex items-center justify-center"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.15)",
            width: "72px",
            height: "72px",
          }}
        >
          <Icon className="text-white w-9 h-9" />
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            {title}
          </h1>

          <p className="text-base md:text-lg text-white/85 max-w-2xl">
            {subtitle}
          </p>

          <p className="text-sm md:text-base text-white/70 mt-1">
            {count} colleges available
          </p>
        </div>
      </div>
    </div>
  );
};