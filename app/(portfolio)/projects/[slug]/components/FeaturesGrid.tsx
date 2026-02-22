import {
  Search,
  Cpu,
  Database,
  Brain,
  Mic,
  Radio,
  Lock,
  Volume2,
  Package,
  Bot,
  Zap,
  Cloud,
  type LucideIcon,
} from "lucide-react";
import type { ProjectFeature } from "../project-showcase-config";

const icons: Record<string, LucideIcon> = {
  Search,
  Cpu,
  Database,
  Brain,
  Mic,
  Radio,
  Lock,
  Volume2,
  Package,
  Bot,
  Zap,
  Cloud,
};

export function FeaturesGrid({
  features,
  accentColor,
  accentColorRgb,
}: {
  features: ProjectFeature[];
  accentColor: string;
  accentColorRgb: string;
}) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {features.map((feature, i) => {
        const Icon = icons[feature.iconName];
        return (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
            style={{
              borderLeftWidth: "3px",
              borderLeftColor: `rgba(${accentColorRgb}, 0.35)`,
            }}
          >
            {/* Hover gradient */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(ellipse at top left, rgba(${accentColorRgb}, 0.06), transparent 60%)`,
              }}
            />
            <div className="relative">
              <div
                className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `rgba(${accentColorRgb}, 0.12)` }}
              >
                {Icon && (
                  <Icon className="h-5 w-5" style={{ color: accentColor }} />
                )}
              </div>
              <h3 className="mb-2 font-[Nutmeg] text-[17px] font-semibold text-white">
                {feature.title}
              </h3>
              <p className="font-[Nutmeg] text-[14px] font-light leading-relaxed text-white/55">
                {feature.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
