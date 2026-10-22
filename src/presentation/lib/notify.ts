import toast from "react-hot-toast";

export const notifyError = (message: string, id?: string) =>
  toast.error(message, {
    id,
    duration: 8000,
    ariaProps: { role: "alert", "aria-live": "assertive" },
  });
