"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";

import { discountedPrice } from "@/domain/room/pricing";
import { useMoney } from "@/presentation/hooks/useMoney";

type Props = {
  price: number;
  discount: number;
};

const MobileBookBar: FC<Props> = ({ price, discount }) => {
  const t = useTranslations("Booking");
  const tRoom = useTranslations("RoomDetails");
  const { format } = useMoney();

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-gray-200 bg-white px-4 py-3 shadow-float dark:border-neutral-800 dark:bg-neutral-950 lg:hidden">
      <p className="text-lg font-bold">
        {format(discountedPrice(price, discount))}
        <span className="text-muted ml-1 text-sm font-normal">/ {tRoom("perNight")}</span>
      </p>
      <a href="#booking" className="btn-primary">
        {t("bookNow")}
      </a>
    </div>
  );
};

export default MobileBookBar;
