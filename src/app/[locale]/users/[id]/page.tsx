"use client";

import { useLocale, useTranslations } from "next-intl";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";

import { useCurrentUser, useUserBookings } from "@/presentation/hooks/useApi";
import { submitReview } from "@/presentation/lib/apiClient";
import LoadingSpinner from "../../loading";
import { useState } from "react";
import { BsJournalBookmarkFill } from "react-icons/bs";
import { GiMoneyStack } from "react-icons/gi";
import Table from "@/presentation/components/Table/Table";
import Chart from "@/presentation/components/Chart/Chart";
import RatingModal from "@/presentation/components/RatingModal/RatingModal";
import BackDrop from "@/presentation/components/BackDrop/BackDrop";
import toast from "react-hot-toast";
import { notifyError } from "@/presentation/lib/notify";
import { useErrorMessage } from "@/presentation/hooks/useErrorMessage";

const UserDetails = () => {
  const t = useTranslations("Profile");
  const locale = useLocale();
  const errorMessage = useErrorMessage();
  const [currentNav, setCurrentNav] = useState<
    "bookings" | "amount" | "ratings"
  >("bookings");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isRatingVisible, setIsRatingVisible] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [ratingValue, setRatingValue] = useState<number | null>(0);
  const [ratingText, setRatingText] = useState("");
  const { data: session } = useSession();

  const toggleRatingModal = () => setIsRatingVisible((prevState) => !prevState);

  const reviewSubmitHandler = async () => {
    if (!ratingText.trim().length || !ratingValue) {
      return notifyError(t("reviewRequired"));
    }

    if (!roomId) {
      return notifyError(t("reviewRoomMissing"));
    }

    setIsSubmittingReview(true);

    try {
      await submitReview({ roomId, rating: ratingValue, text: ratingText });
      toast.success(t("reviewSubmitted"));
      setRatingText("");
      setRatingValue(null);
      setRoomId(null);
      setIsRatingVisible(false);
    } catch (error) {
      notifyError(errorMessage(error, t("reviewFailed")));
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const { data: userBookings, error } = useUserBookings();
  const { data: userData, error: errorGettingUserData } = useCurrentUser();

  if (error || errorGettingUserData) throw new Error("Cannot fetch data");

  if (!userData) return <LoadingSpinner />;

  const tabs = [
    { key: "bookings", icon: BsJournalBookmarkFill, label: t("bookingsTab") },
    { key: "amount", icon: GiMoneyStack, label: t("amountTab") },
  ] as const;

  const avatarUrl = userData.image ?? session?.user?.image ?? null;
  const joinedDate = new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(userData.createdAt)
  );

  return (
    <div className="page-container py-10">
      <div className="grid md:grid-cols-12 gap-10">
        <aside
          aria-label={t("summary")}
          className="card hidden h-fit p-6 md:sticky md:top-28 md:col-span-4 md:block lg:col-span-3"
        >
          <div className="md:w-[143px] w-28 h-28 md:h-[143px] mx-auto mb-5 rounded-full overflow-hidden">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt=""
                width={143}
                height={143}
                className="img scale-animation rounded-full"
              />
            ) : (
              <FaUserCircle className="w-full h-full" aria-hidden="true" />
            )}
          </div>
          <div className="font-normal py-4 text-left">
            <h2 className="text-xl font-bold pb-3">{t("about")}</h2>
            <p className="text-sm">{userData.about ?? ""}</p>
          </div>
          <div className="font-normal text-left">
            <p className="text-xl font-bold pb-3">{userData.name}</p>
          </div>
          <button
            type="button"
            className="flex items-center"
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
          >
            <span className="mr-2">{t("signOut")}</span>
            <FaSignOutAlt className="text-3xl" aria-hidden="true" />
          </button>
        </aside>

        <div className="md:col-span-8 lg:col-span-9">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-3">
              {t("hello", { name: userData.name })}
            </h1>
          </div>
          <div className="md:hidden w-14 h-14 rounded-l-full overflow-hidden">
            {avatarUrl ? (
              <Image
                className="img scale-animation rounded-full"
                width={56}
                height={56}
                src={avatarUrl}
                alt=""
              />
            ) : (
              <FaUserCircle className="w-full h-full" aria-hidden="true" />
            )}
          </div>
          <p className="block w-fit md:hidden text-sm py-2">
            {userData.about ?? ""}
          </p>

          <p className="text-xs py-2 font-medium">
            {t("joined", { date: joinedDate })}
          </p>
          <button
            type="button"
            className="md:hidden flex items-center my-2"
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
          >
            <span className="mr-2">{t("signOut")}</span>
            <FaSignOutAlt className="text-3xl" aria-hidden="true" />
          </button>

          <nav
            aria-label={t("sections")}
            className="mb-8 mt-7 rounded-2xl bg-surface p-1 dark:bg-neutral-900"
          >
            <ul className="flex gap-1">
              {tabs.map(({ key, icon: Icon, label }) => (
                <li key={key}>
                  <button
                    type="button"
                    onClick={() => setCurrentNav(key)}
                    aria-current={currentNav === key ? "page" : undefined}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                      currentNav === key
                        ? "bg-white text-ink shadow dark:bg-neutral-800 dark:text-white"
                        : "text-muted hover:text-ink dark:hover:text-white"
                    }`}
                  >
                    <Icon aria-hidden="true" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <h2 className="sr-only" aria-live="polite">
            {currentNav === "bookings" ? t("bookingsTab") : t("amountTab")}
          </h2>

          {currentNav === "bookings" ? (
            userBookings && (
              <Table
                bookingDetails={userBookings}
                setRoomId={setRoomId}
                toggleRatingModal={toggleRatingModal}
              />
            )
          ) : (
            <></>
          )}

          {currentNav === "amount" ? (
            userBookings && <Chart userBookings={userBookings} />
          ) : (
            <></>
          )}
        </div>
      </div>

      <RatingModal
        isOpen={isRatingVisible}
        ratingValue={ratingValue}
        setRatingValue={setRatingValue}
        ratingText={ratingText}
        setRatingText={setRatingText}
        isSubmittingReview={isSubmittingReview}
        reviewSubmitHandler={reviewSubmitHandler}
        toggleRatingModal={toggleRatingModal}
      />
      <BackDrop isOpen={isRatingVisible} />
    </div>
  );
};

export default UserDetails;
