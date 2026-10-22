"use client";

import { MdOutlineCleaningServices } from "react-icons/md";
import { LiaFireExtinguisherSolid } from "react-icons/lia";
import { AiOutlineMedicineBox } from "react-icons/ai";
import { GiSmokeBomb } from "react-icons/gi";
import { useState } from "react";

import { useRoom } from "@/presentation/hooks/useApi";
import { createCheckoutSession } from "@/presentation/lib/apiClient";
import { toDateOnly } from "@/presentation/lib/dateOnly";
import LoadingSpinner from "../../loading";
import HotelPhotoGallery from "@/presentation/components/HotelPhotoGallery/HotelPhotoGallery";
import BookRoomCta from "@/presentation/components/BookRoomCta/BookRoomCta";
import toast from "react-hot-toast";
import { notifyError } from "@/presentation/lib/notify";
import { getStripe } from "@/presentation/lib/stripeBrowser";
import { getErrorMessage } from "@/presentation/lib/errorMessage";
import RoomReview from "@/presentation/components/RoomReview/RoomReview";

const RoomDetails = (props: { params: { slug: string } }) => {
  const {
    params: { slug },
  } = props;

  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [noOfChildren, setNoOfChildren] = useState(0);

  const { data: room, error } = useRoom(slug);

  if (error) throw new Error("Cannot fetch data");

  if (!room) return <LoadingSpinner />;

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
      return notifyError("Please provide checkin / checkout date");

    if (checkinDate > checkoutDate)
      return notifyError("Please choose a valid checkin period");

    try {
      const stripe = await getStripe();

      if (!stripe) {
        return notifyError(
          "Payments are not available right now. Please try again later."
        );
      }

      const stripeSession = await createCheckoutSession({
        roomSlug: room.slug,
        checkinDate: toDateOnly(checkinDate),
        checkoutDate: toDateOnly(checkoutDate),
        adults,
        children: noOfChildren,
      });

      const result = await stripe.redirectToCheckout({
        sessionId: stripeSession.id,
      });

      if (result.error) {
        notifyError(result.error.message ?? "The payment could not be completed.");
      }
    } catch (error) {
      notifyError(
        getErrorMessage(error, "We could not start the payment. Please try again.")
      );
    }
  };

  return (
    <div>
      <HotelPhotoGallery photos={room.images} />
      <div className="container mx-auto mt-20">
        <div className="md:grid md:grid-cols-12 gap-10 px-3">
          <div className="md:col-span-8 md:w-full">
            <div className="">
              <h1 className="font-bold text-left text-lg md:text-2xl">
                {room.name} ({room.dimension})
              </h1>
              <div className="flex my-11">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity.id}
                    className="md:w-44 w-fit text-center px-2 md:px-0 h-20 md:h-40 mr-3 bg-[#eff0f2] dark:bg-gray-800 rounded-lg grid place-content-center"
                  >
                    <i
                      className={`fa-solid ${amenity.icon} md:text-2xl`}
                      aria-hidden="true"
                    ></i>
                    <p className="text-xs md:text-base pt-3">
                      {amenity.name}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Description</h2>
                <p className="">{room.description}</p>
              </div>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Offered Amenities</h2>
                <div className="grid grid-cols-2">
                  {room.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className="flex items-center md:my-0 my-1"
                    >
                      <i
                        className={`fa-solid ${amenity.icon}`}
                        aria-hidden="true"
                      ></i>
                      <p className="text-xs md:text-base ml-2">
                        {amenity.name}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mb-11">
                <h2 className="font-bold text-3xl mb-2">Safety and hygiene</h2>
                <div className="grid grid-cols-2">
                  <div className="flex items-center my-1 md:my-0">
                    <MdOutlineCleaningServices aria-hidden="true" />
                    <p className="ml-2 md:text-base text-xs">Daily Cleaning</p>
                  </div>
                  <div className="flex items-center my-1 md:my-0">
                    <LiaFireExtinguisherSolid aria-hidden="true" />
                    <p className="ml-2 md:text-base text-xs">
                      Fire Extinguishers
                    </p>
                  </div>
                  <div className="flex items-center my-1 md:my-0">
                    <AiOutlineMedicineBox aria-hidden="true" />
                    <p className="ml-2 md:text-base text-xs">
                      Disinfections and Sterilizations
                    </p>
                  </div>
                  <div className="flex items-center my-1 md:my-0">
                    <GiSmokeBomb aria-hidden="true" />
                    <p className="ml-2 md:text-base text-xs">Smoke Detectors</p>
                  </div>
                </div>
              </div>
              <div className="shadow dark:shadow-white rounded-lg p-6">
                <div className="items-center mb-4">
                  <h2 className="md:text-lg font-semibold">Customer Reviews</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <RoomReview roomId={room.id} />
                </div>
              </div>
            </div>
          </div>
          <aside
            aria-label="Book this room"
            className="md:col-span-4 rounded-xl shadow-lg dark:shadow dark:shadow-white sticky top-10 h-fit overflow-auto"
          >
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
          </aside>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
