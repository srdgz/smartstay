import { useTranslations } from "next-intl";
import Image from "next/image";
import { FC } from "react";

import type { Room } from "@/domain/room/Room";
import { Link } from "@/i18n/navigation";

import Money from "../Money/Money";

type Props = {
  room: Room;
};

const RoomCard: FC<Props> = (props) => {
  const {
    room: { coverImageUrl, name, price, type, description, slug, isBooked },
  } = props;
  const t = useTranslations("RoomCard");
  const tTypes = useTranslations("RoomTypes");

  const typeLabel = tTypes.has(type.toLowerCase() as never)
    ? tTypes(type.toLowerCase() as never)
    : type;

  return (
    <div className="rounded-xl w-72 mb-10 mx-auto md:mx-0 overflow-hidden text-black">
      <div className="h-60 overflow-hidden">
        <Image
          src={coverImageUrl}
          alt=""
          width={250}
          height={250}
          className="img scale-animation"
        />
      </div>
      <div className="p-4 bg-white">
        <div className="flex justify-between text-xl font-semibold">
          <h2>{name}</h2>
          <p>
            <Money amount={price} />
          </p>
        </div>
        <p className="pt-2 text-xs">{t("roomOfType", { type: typeLabel })}</p>
        <p className="pt-3 pb-6">{description.slice(0, 100)}...</p>
        <Link
          href={`/rooms/${slug}`}
          className="bg-primary inline-block text-center w-full py-4 rounded-xl text-white text-xl font-bold hover:-translate-y-2 hover:shadow-lg transition-all duration-500"
        >
          {isBooked ? t("booked") : t("bookNow")}
          <span className="sr-only"> - {name}</span>
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
