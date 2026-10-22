import { useTranslations } from "next-intl";
import Image from "next/image";
import { FC } from "react";

import type { Room } from "@/domain/room/Room";
import { Link } from "@/i18n/navigation";

import Money from "../Money/Money";

type Props = {
  room: Room;
  stay?: { checkin: string; checkout: string };
};

const RoomCard: FC<Props> = (props) => {
  const {
    room: { coverImageUrl, name, price, type, description, slug },
    stay,
  } = props;
  const t = useTranslations("RoomCard");
  const tTypes = useTranslations("RoomTypes");

  const typeLabel = tTypes.has(type.toLowerCase() as never)
    ? tTypes(type.toLowerCase() as never)
    : type;

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface dark:bg-neutral-800">
        <Image
          src={coverImageUrl}
          alt=""
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="img scale-animation"
        />
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-lg font-semibold leading-snug">
            <Link
              href={stay ? `/rooms/${slug}?checkin=${stay.checkin}&checkout=${stay.checkout}` : `/rooms/${slug}`}
              className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-offset-4"
            >
              {name}
            </Link>
          </h2>
          <p className="shrink-0 text-lg font-bold">
            <Money amount={price} />
            <span className="text-muted ml-1 text-sm font-normal">/ {t("perNight")}</span>
          </p>
        </div>
        <p className="text-muted mt-1 text-sm">{t("roomOfType", { type: typeLabel })}</p>
        <p className="text-muted mt-2 line-clamp-2 text-sm">{description}</p>
        <span
          aria-hidden="true"
          className="mt-4 inline-flex w-fit items-center rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white transition group-hover:bg-primary-dark"
        >
          {t("bookNow")}
        </span>
      </div>
    </article>
  );
};

export default RoomCard;
