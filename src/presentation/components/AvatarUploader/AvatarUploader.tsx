"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChangeEvent, FC, useId, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaUserCircle } from "react-icons/fa";
import { FiCamera } from "react-icons/fi";
import { mutate } from "swr";

import { avatarFileProblem, AVATAR_MAX_MEGABYTES, AVATAR_TYPES } from "@/domain/user/avatar";
import { useErrorMessage } from "@/presentation/hooks/useErrorMessage";
import { removeAvatar, uploadAvatar } from "@/presentation/lib/apiClient";
import { notifyError } from "@/presentation/lib/notify";

type Props = {
  imageUrl: string | null;
  canRemove: boolean;
};

type Busy = "uploading" | "removing" | null;

const AvatarUploader: FC<Props> = ({ imageUrl, canRemove }) => {
  const t = useTranslations("Avatar");
  const tErrors = useTranslations("Errors");
  const errorMessage = useErrorMessage();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState<Busy>(null);

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const problem = avatarFileProblem(file.size, file.type);
    if (problem) {
      notifyError(tErrors(problem.code as never, problem.params as never));
      return;
    }

    setBusy("uploading");
    try {
      await uploadAvatar(file);
      await mutate("/api/me");
      toast.success(t("uploaded"));
    } catch (error) {
      notifyError(errorMessage(error, t("failed")));
    } finally {
      setBusy(null);
    }
  };

  const handleRemove = async () => {
    setBusy("removing");
    try {
      await removeAvatar();
      await mutate("/api/me");
      toast.success(t("removed"));
    } catch (error) {
      notifyError(errorMessage(error, t("failed")));
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-28 w-28 overflow-hidden rounded-full border border-gray-200 bg-surface text-gray-400 dark:border-neutral-700 dark:bg-neutral-800 md:h-36 md:w-36">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="144px"
            className="object-cover"
          />
        ) : (
          <FaUserCircle className="h-full w-full" aria-hidden="true" />
        )}
        {busy && (
          <div
            aria-hidden="true"
            className="absolute inset-0 grid place-items-center bg-black/50"
          >
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
      </div>

      <p role="status" className="sr-only">
        {busy === "uploading" ? t("uploading") : ""}
      </p>

      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_TYPES.join(",")}
        className="hidden"
        onChange={handleFile}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          disabled={busy !== null}
          aria-describedby={hintId}
          onClick={() => inputRef.current?.click()}
          className="btn-outline px-4 py-2 text-sm disabled:opacity-60"
        >
          <FiCamera aria-hidden="true" />
          {imageUrl ? t("change") : t("add")}
        </button>
        {canRemove && (
          <button
            type="button"
            disabled={busy !== null}
            onClick={handleRemove}
            className="rounded-xl px-3 py-2 text-sm font-semibold text-muted underline-offset-2 hover:underline disabled:opacity-60"
          >
            {t("remove")}
          </button>
        )}
      </div>

      <p id={hintId} className="text-muted text-center text-xs">
        {t("hint", { max: AVATAR_MAX_MEGABYTES })}
      </p>
    </div>
  );
};

export default AvatarUploader;
