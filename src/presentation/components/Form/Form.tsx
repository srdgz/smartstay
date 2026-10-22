import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

const Form = () => {
  const t = useTranslations("Contact");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setName("");
    setEmail("");
    setMessage("");
    toast.success(t("success"));
  };

  return (
    <div className="mx-auto w-full max-w-lg">
      <form
        className="card space-y-5 p-6 sm:p-8"
        onSubmit={handleSubmit}
      >
        <label className="block text-sm font-semibold">
          {t("name")}
          <input
            className="field mt-1 font-normal"
            name="name"
            autoComplete="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label className="block text-sm font-semibold">
          {t("email")}
          <input
            className="field mt-1 font-normal"
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label className="block text-sm font-semibold">
          {t("message")}
          <textarea
            name="message"
            rows={5}
            className="field mt-1 font-normal"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </label>

        <button type="submit" className="btn-primary w-full">
          {t("submit")}
        </button>
      </form>
    </div>
  );
};

export default Form;
