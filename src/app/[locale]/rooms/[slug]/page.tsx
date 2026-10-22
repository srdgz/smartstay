"use client";

import { MdOutlineCleaningServices } from "react-icons/md";
import { LiaFireExtinguisherSolid } from "react-icons/lia";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { GiSmokeBomb } from "react-icons/gi";
import { useLocale, useTranslations } from "next-intl";
import { use, useState } from "react";

import { useRoom } from "@/presentation/hooks/useApi";
import { createCheckoutSession } from "@/presentation/lib/apiClient";
import { toDateOnly } from "@/presentation/lib/dateOnly";
import LoadingSpinner from "../../loading";
import HotelPhotoGallery from "@/presentation/components/HotelPhotoGallery/HotelPhotoGallery";
import BookRoomCta from "@/presentation/components/BookRoomCta/BookRoomCta";
import toast from "react-hot-toast";
import { notifyError } from "@/presentation/lib/notify";
import { useErrorMessage } from "@/presentation/hooks/useErrorMessage";
import { useMoney } from "@/presentation/hooks/useMoney";
import RoomReview from "@/presentation/components/RoomReview/RoomReview";
import MobileBookBar from "@/presentation/components/MobileBookBar/MobileBookBar";

const RoomDetails = (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = use(props.params);

  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [noOfChildren, setNoOfChildren] = useState(0);
  const t = useTranslations("RoomDetails");
  const locale = useLocale();
  const { currency } = useMoney();
  const errorMessage = useErrorMessage();

  const { data: room, error } = useRoom(slug);

  if (error) throw new Error("Cannot fetch data");

  if (!room) return <LoadingSpinner />;

  const squareFeet = room.dimension.match(/^\s*(\d+)/)?.[1];

  const calcMinCheckoutDate = () => {
    if (checkinDate) {
      const nextDay = new Date(checkinDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    return null;
  };

  const handleBookNowClick = async () => {
    if (!checkinDate || !checkoutDate)
      return notifyError(t("provideDates"));

    if (checkinDate > checkoutDate)
      return notifyError(t("invalidPeriod"));

    try {
      const stripeSession = await createCheckoutSession({
        roomSlug: room.slug,
        checkinDate: toDateOnly(checkinDate),
        checkoutDate: toDateOnly(checkoutDate),
        adults,
        children: noOfChildren,
        currency,
        locale,
      });

      if (!stripeSession.url) return notifyError(t("paymentIncomplete"));

      window.location.assign(stripeSession.url);
    } catch (error) {
      notifyError(errorMessage(error, t("paymentFailed")));
    }
  };

  const section = "border-b border-gray-200 py-8 first:pt-0 dark:border-neutral-800";
  const safetyItems = [
    { icon: MdOutlineCleaningServices, label: t("dailyCleaning") },
    { icon: LiaFireExtinguisherSolid, label: t("fireExtinguishers") },
    { icon: AiOutlineMedicineBox, label: t("disinfection") },
    { icon: GiSmokeBomb, label: t("smokeDetectors") },
  ];

  return (
    <div className="page-container pt-6 sm:pt-8">
      <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{room.name}</h1>
      <p className="text-muted mt-1">
        {squareFeet ? t("squareFeet", { value: squareFeet }) : room.dimension}
      </p>

      <div className="mt-6">
        <HotelPhotoGallery photos={room.images} />
      </div>

      <div className="mt-10 grid gap-10 pb-24 lg:grid-cols-12 lg:gap-16 lg:pb-0">
        <div className="lg:col-span-7 xl:col-span-8">
          <section className={section}>
            <h2 className="text-2xl font-bold">{t("description")}</h2>
            <p className="text-muted mt-3 text-lg leading-relaxed">{room.description}</p>
          </section>

          <section className={section}>
            <h2 className="text-2xl font-bold">{t("amenities")}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {room.amenities.map((amenity) => (
                <li key={amenity.id} className="flex items-center gap-3 text-lg">
                  <i
                    className={`fa-solid ${amenity.icon} w-6 text-center text-xl`}
                    aria-hidden="true"
                  ></i>
                  {amenity.name}
                </li>
              ))}
            </ul>
          </section>

          <section className={section}>
            <h2 className="text-2xl font-bold">{t("safety")}</h2>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2">
              {safetyItems.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-lg">
                  <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </section>

          <section className="py-8">
            <h2 className="text-2xl font-bold">{t("reviews")}</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <RoomReview roomId={room.id} />
            </div>
          </section>
        </div>

        <aside
          id="booking"
          aria-label={t("bookAside")}
          className="lg:col-span-5 xl:col-span-4"
        >
          <div className="card p-6 lg:sticky lg:top-28">
            <BookRoomCta
              discount={room.discount}
              price={room.price}
              specialNote={room.specialNote}
              checkinDate={checkinDate}
              setCheckinDate={setCheckinDate}
              checkoutDate={checkoutDate}
              setCheckoutDate={setCheckoutDate}
              calcMinCheckoutDate={calcMinCheckoutDate}
              adults={adults}
              noOfChildren={noOfChildren}
              setAdults={setAdults}
              setNoOfChildren={setNoOfChildren}
              isBooked={room.isBooked}
              handleBookNowClick={handleBookNowClick}
            />
          </div>
        </aside>
      </div>

      <MobileBookBar price={room.price} discount={room.discount} isBooked={room.isBooked} />
    </div>
  );
};

export default RoomDetails;
