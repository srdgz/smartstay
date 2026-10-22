import { useTranslations } from "next-intl";
import Image from "next/image";
import { FC } from "react";

import type { Room } from "@/domain/room/Room";
import { Link } from "@/i18n/navigation";

import Money from "../Money/Money";

type Props = {
  featuredRoom: Room;
};

const FeaturedRoom: FC<Props> = (props) => {
  const { featuredRoom } = props;
  const t = useTranslations("FeaturedRoom");

  return (
    <section className="flex md:flex-row flex-col px-4 py-10 items-center gap-12 container mx-auto">
      <div className="md:grid gap-8 grid-cols-1">
        <div className="rounded-2xl overflow-hidden h-48 mb-4 md:mb-0">
          <Image
            src={featuredRoom.coverImageUrl}
            alt={featuredRoom.name}
            width={300}
            height={300}
            className="img scale-animation"
          />
        </div>
        <div className="grid grid-cols-2 gap-8 h-48">
          {featuredRoom.images.slice(1, 3).map((image, index) => (
            <div key={image.id} className="rounded-2xl overflow-hidden">
              <Image
                src={image.url}
                alt={t("photoAlt", { name: featuredRoom.name, number: index + 2 })}
                width={300}
                height={300}
                className="img scale-animation"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="md:py-10 md:w-1/2 text-left">
        <h2 className="font-heading mb-12">{t("title")}</h2>
        <p className="font-normal max-2-md">{featuredRoom.description}</p>
        <div className="flex flex-col md:flex-row md:items-end justify-between mt-5">
          <div className="flex mb-3 md:mb-0">
            <div className="flex gap-3 flex-col items-center justify-center mr-4">
              <p className="text-xs lg:text-xl text-center">{t("startFrom")}</p>
              <p className="md:font-bold flex font-medium text-lg xl:text-5xl">
                <Money amount={featuredRoom.price} />
              </p>
            </div>
            <div className="flex gap-3 flex-col items-center justify-center mr-4">
              <p className="text-xs lg:text-xl text-center">{t("discount")}</p>
              <p className="md:font-bold flex font-medium text-lg xl:text-5xl">
                {featuredRoom.discount}%
              </p>
            </div>
          </div>
          <Link
            href={`/rooms/${featuredRoom.slug}`}
            className="border h-fit text-center border-tertiary-dark text-tertiary-dark dark:border-tertiary-darkmode dark:text-tertiary-darkmode px-3 py-2 lg:py-5 lg:px-7 rounded-2xl font-bold lg:text-xl"
          >
            {t("moreDetails")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoom;
