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
    <section className="page-container py-14">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="grid grid-cols-2 gap-4">
          <div className="group relative col-span-2 aspect-[16/10] overflow-hidden rounded-3xl">
            <Image
              src={featuredRoom.coverImageUrl}
              alt={featuredRoom.name}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="img scale-animation"
            />
          </div>
          {featuredRoom.images.slice(1, 3).map((image, index) => (
            <div
              key={image.id}
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
            >
              <Image
                src={image.url}
                alt={t("photoAlt", { name: featuredRoom.name, number: index + 2 })}
                fill
                sizes="(min-width: 1024px) 22vw, 50vw"
                className="img scale-animation"
              />
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-xl font-semibold">{featuredRoom.name}</p>
          <p className="text-muted mt-4 max-w-xl text-lg">{featuredRoom.description}</p>
          <div className="mt-8 flex flex-wrap items-end gap-8">
            <div>
              <p className="text-muted text-sm">{t("startFrom")}</p>
              <p className="text-3xl font-extrabold">
                <Money amount={featuredRoom.price} />
              </p>
            </div>
            <div>
              <p className="text-muted text-sm">{t("discount")}</p>
              <p className="text-3xl font-extrabold text-tertiary-dark dark:text-tertiary-darkmode">
                {featuredRoom.discount}%
              </p>
            </div>
            <Link
              href={`/rooms/${featuredRoom.slug}`}
              className="btn-outline ml-auto"
            >
              {t("moreDetails")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoom;
