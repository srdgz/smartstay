"use client";

import { useTranslations } from "next-intl";
import { ChangeEvent, FC, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

type Props = {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  autoComplete: "current-password" | "new-password";
  minLength?: number;
  invalid?: boolean;
  describedBy?: string;
};

const PasswordField: FC<Props> = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  autoComplete,
  minLength,
  invalid,
  describedBy,
}) => {
  const t = useTranslations("Auth");
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          name={name}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          minLength={minLength}
          aria-invalid={invalid || undefined}
          aria-describedby={describedBy}
          className="field pr-12"
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? t("hidePassword") : t("showPassword")}
          aria-pressed={visible}
          className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-xl text-gray-600 hover:text-ink dark:text-gray-300 dark:hover:text-white"
        >
          {visible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
};

export default PasswordField;
