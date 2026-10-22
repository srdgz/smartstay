"use client";

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
import { getErrorMessage } from "@/presentation/lib/errorMessage";

const UserDetails = () => {
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
      return notifyError("Please provide a rating text and a rating");
    }

    if (!roomId) {
      return notifyError("We could not find the room to review. Please try again.");
    }

    setIsSubmittingReview(true);

    try {
      await submitReview({ roomId, rating: ratingValue, text: ratingText });
      toast.success("Review submitted");
      setRatingText("");
      setRatingValue(null);
      setRoomId(null);
      setIsRatingVisible(false);
    } catch (error) {
      notifyError(
        getErrorMessage(error, "We could not save your review. Please try again.")
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const { data: userBookings, error } = useUserBookings();
  const { data: userData, error: errorGettingUserData } = useCurrentUser();

  if (error || errorGettingUserData) throw new Error("Cannot fetch data");

  if (!userData) return <LoadingSpinner />;

  const avatarUrl = userData.image ?? session?.user?.image ?? null;

  return (
    <div className="container mx-auto px-2 md:px-4 py10">
      <div className="grid md:grid-cols-12 gap-10">
        <aside
          aria-label="Profile summary"
          className="hidden md:block md:col-span-4 lg:col-span-3 shadow-lg h-fit sticky top-10 bg-[#eff0f2] text-black rounded-lg px-6 py-4"
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
            <h2 className="text-xl font-bold pb-3">About</h2>
            <p className="text-sm">{userData.about ?? ""}</p>
          </div>
          <div className="font-normal text-left">
            <p className="text-xl font-bold pb-3">{userData.name}</p>
          </div>
          <button
            type="button"
            className="flex items-center"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <span className="mr-2">Sign Out</span>
            <FaSignOutAlt className="text-3xl" aria-hidden="true" />
          </button>
        </aside>

        <div className="md:col-span-8 lg:col-span-9">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-3">Hello, {userData.name}</h1>
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
            Joined In {userData.createdAt.split("T")[0]}
          </p>
          <button
            type="button"
            className="md:hidden flex items-center my-2"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <span className="mr-2">Sign out</span>
            <FaSignOutAlt className="text-3xl" aria-hidden="true" />
          </button>

          <nav
            aria-label="Profile sections"
            className="sticky top-0 px-2 w-fit mx-auto md:w-full md:px-5 py-3 mb-8 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 mt-7"
          >
            <ul className="flex items-center">
              <li
                className={`${
                  currentNav === "bookings" ? "text-blue-700" : "text-gray-700"
                } mr-1 md:mr-5`}
              >
                <button
                  type="button"
                  onClick={() => setCurrentNav("bookings")}
                  aria-current={currentNav === "bookings" ? "page" : undefined}
                  className="inline-flex items-center"
                >
                  <BsJournalBookmarkFill aria-hidden="true" />
                  <span className="mx-1 md:mx-3 text-xs md:text-sm font-medium">
                    Current Bookings
                  </span>
                </button>
              </li>
              <li
                className={`${
                  currentNav === "amount" ? "text-blue-700" : "text-gray-700"
                } mr-1 md:mr-5`}
              >
                <button
                  type="button"
                  onClick={() => setCurrentNav("amount")}
                  aria-current={currentNav === "amount" ? "page" : undefined}
                  className="inline-flex items-center"
                >
                  <GiMoneyStack aria-hidden="true" />
                  <span className="mx-1 md:mx-3 text-xs md:text-sm font-medium">
                    Amount Spent
                  </span>
                </button>
              </li>
            </ul>
          </nav>

          <h2 className="sr-only" aria-live="polite">
            {currentNav === "bookings" ? "Current Bookings" : "Amount Spent"}
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
