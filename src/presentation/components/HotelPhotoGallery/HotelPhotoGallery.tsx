"use client";

import { useTranslations } from "next-intl";
import { FC, useRef, useState } from "react";
import type { RoomImage } from "@/domain/room/Room";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import useModalFocus from "@/presentation/hooks/useModalFocus";

const thumbSpans: Record<number, string[]> = {
  0: [],
  1: ["col-span-2 row-span-2"],
  2: ["col-span-2", "col-span-2"],
  3: ["", "", "col-span-2"],
  4: ["", "", "", ""],
};

const roundButton =
  "grid h-10 w-10 place-items-center rounded-full border border-gray-300 bg-white text-ink transition hover:bg-gray-100";

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

  if (!photos.length) return null;

  const thumbs = photos.slice(1, 5);
  const spans = thumbSpans[thumbs.length];

  return (
    <div>
      <div className="relative hidden h-[420px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl md:grid lg:h-[480px]">
        <button
          type="button"
          className={`group relative overflow-hidden ${
            thumbs.length ? "col-span-2 row-span-2" : "col-span-4 row-span-2"
          }`}
          onClick={() => openModal(0)}
          aria-label={t("open")}
        >
          <Image
            src={photos[0].url}
            alt={t("roomPhoto", { number: 1 })}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
            className="img scale-animation"
          />
        </button>
        {thumbs.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            className={`group relative overflow-hidden ${spans[index]}`}
            onClick={() => openModal(index + 1)}
            aria-label={t("openPhoto", { number: index + 2 })}
          >
            <Image
              src={photo.url}
              alt={t("roomPhoto", { number: index + 2 })}
              fill
              sizes="25vw"
              className="img scale-animation"
            />
          </button>
        ))}
        {photos.length > 1 && (
          <button
            type="button"
            onClick={() => openModal(0)}
            className="absolute bottom-4 right-4 rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-ink shadow transition hover:bg-gray-100"
          >
            {t("showAll")}
          </button>
        )}
      </div>

      <div className="md:hidden">
        <button
          type="button"
          className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl"
          onClick={() => openModal(currentPhotoIndex)}
          aria-label={t("open")}
        >
          <Image
            src={photos[currentPhotoIndex].url}
            alt={t("roomPhoto", { number: currentPhotoIndex + 1 })}
            fill
            sizes="100vw"
            className="img"
          />
        </button>
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handlePrevious}
              aria-label={t("previous")}
              className={roundButton}
            >
              <FaArrowLeft aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={t("next")}
              className={roundButton}
            >
              <FaArrowRight aria-hidden="true" />
            </button>
          </div>
          <span aria-live="polite" className="text-muted text-sm">
            {currentPhotoIndex + 1} / {photos.length}
          </span>
        </div>
      </div>

      {showModal && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("dialog")}
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/90 p-4"
        >
          <div className="relative h-[75vh] w-full max-w-4xl">
            <div className="relative h-[calc(100%-3.5rem)] overflow-hidden rounded-2xl">
              <Image
                src={photos[currentPhotoIndex].url}
                alt={t("roomPhoto", { number: currentPhotoIndex + 1 })}
                fill
                sizes="(min-width: 1024px) 896px, 100vw"
                className="object-contain"
              />
            </div>
            <div className="flex items-center justify-between pt-3 text-white">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrevious}
                  aria-label={t("previous")}
                  className={roundButton}
                >
                  <FaArrowLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={t("next")}
                  className={roundButton}
                >
                  <FaArrowRight aria-hidden="true" />
                </button>
              </div>
              <span className="text-sm" aria-live="polite">
                {currentPhotoIndex + 1} / {photos.length}
              </span>
            </div>
            <button
              type="button"
              className="absolute right-2 top-2 rounded-full bg-white text-3xl text-primary"
              onClick={closeModal}
              aria-label={t("close")}
            >
              <MdCancel aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelPhotoGallery;
