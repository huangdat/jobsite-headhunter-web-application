import { ParticleBackground } from "./ParticleBackground";
import { useHomeTranslation } from "@/shared/hooks";
import {
  Display,
  BodyText,
} from "@/shared/common-blocks/typography/Typography";

export function HeroSection() {
  const { t } = useHomeTranslation();
  return (
    <section className="relative py-70 bg-linear-to-br from-slate-900 to-lime-100 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 to-lime-100 -z-20" />

      {/* Particle */}
      <ParticleBackground />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <Display>
          {t("hero.title")}{" "}
          <span className="text-brand-primary">{t("hero.highlight")}</span>
        </Display>

        <BodyText className="mt-6 max-w-2xl mx-auto">
          {t("hero.description")}
        </BodyText>
      </div>
      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          viewBox="0 0 1440 120"
          className="relative block w-full h-[calc(80px)]"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,53.3C840,53,960,75,1080,85.3C1200,96,1320,96,1380,96L1440,96L1440,120L0,120Z"
            className="fill-slate-50"
          />
        </svg>
      </div>
    </section>
  );
}
