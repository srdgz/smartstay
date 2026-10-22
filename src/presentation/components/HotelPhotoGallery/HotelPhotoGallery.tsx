"use client";

import { useTranslations } from "next-intl";
import { FC, useRef, useState } from "react";
import type { RoomImage } from "@/domain/room/Room";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import useModalFocus from "@/presentation/hooks/useModalFocus";

const HotelPhotoGallery: FC<{ photos: RoomImage[] }> = ({ photos }) => {
  const t = useTranslations("Gallery");
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const openModal = (index: number) => {
    setCurrentPhotoIndex(index);
    setShowModal(true);
  };

  const closeModal = () => setShowModal(false);

  useModalFocus(showModal, dialogRef, closeModal);

  const handlePrevious = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  const maximumVisiblePhotos = 4;
  const totalPhotos = photos.length;
  const displayPhotos = photos.slice(1, maximumVisiblePhotos - 1);
  const remainingPhotosCount = totalPhotos - maximumVisiblePhotos;

  return (
    <div className="container mx-auto">
      <div className="grid md:grid-cols-2 relative gap-5 px-3">
        <div className="h-[540px] relative rounded-2xl overflow-hidden">
          <div className="hidden md:flex justify-center items-center w-full h-full">
            <button
              type="button"
              className="w-full h-full"
              onClick={() => openModal(0)}
              aria-label={t("open")}
            >
              <Image
                src={photos[0].url}
                alt={t("roomPhoto", { number: 1 })}
                className="img scale-animation"
                width={150}
                height={150}
              />
            </button>
          </div>
          <div className="md:hidden flex justify-center items-center w-full h-full">
            <button
              type="button"
              className="w-full h-full"
              onClick={() => openModal(currentPhotoIndex)}
              aria-label={t("open")}
            >
              <Image
                src={photos[currentPhotoIndex].url}
                alt={t("roomPhoto", { number: currentPhotoIndex + 1 })}
                className="img"
                width={150}
                height={150}
              />
            </button>
          </div>
        </div>
        <div className="md:hidden flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label={t("previous")}
            >
              <FaArrowLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={handleNext} aria-label={t("next")}>
              <FaArrowRight aria-hidden="true" />
            </button>
          </div>
          <span aria-live="polite">
            {currentPhotoIndex + 1} / {photos.length}
          </span>
        </div>
        <div className="hidden md:grid grid-cols-2 h-full gap-5">
          {displayPhotos.map((photo, index) => (
            <div key={index} className="h-64 rounded-2xl overflow-hidden">
              <button
                type="button"
                className="w-full h-full"
                onClick={() => openModal(index + 1)}
                aria-label={t("openPhoto", { number: index + 2 })}
              >
                <Image
                  width={150}
                  height={150}
                  src={photo.url}
                  alt={t("roomPhoto", { number: index + 2 })}
                  className="img scale-animation"
                />
              </button>
            </div>
          ))}
          {remainingPhotosCount > 0 && (
            <button
              type="button"
              className="relative h-64 rounded-2xl overflow-hidden"
              onClick={() => openModal(maximumVisiblePhotos)}
              aria-label={t("morePhotos", { count: remainingPhotosCount })}
            >
              <Image
                width={150}
                height={150}
                src={photos[maximumVisiblePhotos - 1].url}
                alt={t("roomPhoto", { number: maximumVisiblePhotos })}
                className="img"
              />
              <div
                aria-hidden="true"
                className="absolute text-white inset-0 flex justify-center bg-[rgba(0,0,0,0.5)] items-center text-2xl"
              >
                + {remainingPhotosCount}
              </div>
            </button>
          )}
        </div>
        {showModal && (
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("dialog")}
            className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-90 z-[55]"
          >
            <div className="h-[75vh] w-[320px] md:w-[700px] relative">
              <Image
                src={photos[currentPhotoIndex].url}
                alt={t("roomPhoto", { number: currentPhotoIndex + 1 })}
                width={150}
                height={150}
                className="img"
              />
              <div className="flex justify-between items-center py-3">
                <div className="flex space-x-2 items-center text-white">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    aria-label={t("previous")}
                  >
                    <FaArrowLeft aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={t("next")}
                  >
                    <FaArrowRight aria-hidden="true" />
                  </button>
                </div>
                <span className="text-white text-sm" aria-live="polite">
                  {currentPhotoIndex + 1} / {photos.length}
                </span>
              </div>
              <button
                type="button"
                className="absolute top-2 right-2 text-white text-lg"
                onClick={closeModal}
                aria-label={t("close")}
              >
                <MdCancel
                  aria-hidden="true"
                  className="font-medium text-2xl text-tertiary-dark"
                />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelPhotoGallery;
