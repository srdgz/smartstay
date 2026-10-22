import { setRequestLocale } from "next-intl/server";

import { resolveLocale } from "@/i18n/metadata";
import { useCases } from "@/infrastructure/container";
import FeaturedRoom from "@/presentation/components/FeaturedRoom/FeaturedRoom";
import Gallery from "@/presentation/components/Gallery/Gallery";
import HeroSection from "@/presentation/components/HeroSection/HeroSection";
import NewsLetter from "@/presentation/components/NewsLetter/NewsLetter";
import PageSearch from "@/presentation/components/PageSearch/PageSearch";

export const dynamic = "force-dynamic";

const Home = async ({ params }: { params: Promise<{ locale: string }> }) => {
  const { locale } = await params;
  setRequestLocale(resolveLocale(locale));
  const featuredRoom = await useCases.getFeaturedRoom(locale);

  return (
    <>
      <HeroSection />
      <PageSearch />
      {featuredRoom && <FeaturedRoom featuredRoom={featuredRoom} />}
      <Gallery />
      <NewsLetter />
    </>
  );
};

export default Home;
