import { useTranslations } from "next-intl";
import Image from "next/image";

import { Link } from "@/i18n/navigation";

export const HeroHeading = () => {
  const t = useTranslations("Hero");

  return (
    <>
      <h1 className="font-heading mb-6">{t("title")}</h1>
      <p className="text-muted mb-8 max-w-xl text-lg">{t("text")}</p>
      <Link href="/rooms" className="btn-primary px-8 py-4 text-lg">
        {t("cta")}
      </Link>
    </>
  );
};

const heroTiles = [
  { src: "/images/hero-1.jpg", className: "col-span-2 aspect-[16/9]" },
  { src: "/images/hero-2.jpg", className: "aspect-square" },
  { src: "/images/hero-3.jpg", className: "aspect-square" },
];

export const HeroImages = () => (
  <div className="grid grid-cols-2 gap-4">
    {heroTiles.map((tile) => (
      <div
        key={tile.src}
        className={`group relative overflow-hidden rounded-3xl ${tile.className}`}
      >
        <Image
          src={tile.src}
          alt=""
          fill
          priority={tile.src.endsWith("hero-1.jpg")}
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="img scale-animation"
        />
      </div>
    ))}
  </div>
);
