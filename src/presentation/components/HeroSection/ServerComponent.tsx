import { useTranslations } from "next-intl";
import Image from "next/image";

import { Link } from "@/i18n/navigation";

export const HeroHeading = () => {
  const t = useTranslations("Hero");

  return (
    <>
      <h1 className="font-heading mb-6" style={{ lineHeight: "1.2" }}>
        {t("title")}
      </h1>
      <p className="text-[#4a4a4a] dark:text-[#ffffffea] mb-12 max-w-lg">
        {t("text")}
      </p>
      <Link href="/rooms" className="btn btn-primary">
        {t("cta")}
      </Link>
    </>
  );
};

export const HeroImages = () => (
  <div className="md:grid hidden gap-8 grid-cols-1">
    <div className="rounded-2xl overflow-hidden h-48">
      <Image
        src="/images/hero-1.jpg"
        alt=""
        width={300}
        height={300}
        className="img scale-animation"
      />
    </div>

    <div className="grid grid-cols-2 gap-8 h-48">
      <div className="rounded-2xl overflow-hidden">
        <Image
          src="/images/hero-2.jpg"
          alt=""
          width={300}
          height={300}
          className="img scale-animation"
        />
      </div>
      <div className="rounded-2xl overflow-hidden">
        <Image
          src="/images/hero-3.jpg"
          alt=""
          width={300}
          height={300}
          className="img scale-animation"
        />
      </div>
    </div>
  </div>
);
