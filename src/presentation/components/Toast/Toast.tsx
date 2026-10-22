"use client";

import { Toaster } from "react-hot-toast";

const Toast = () => (
  <Toaster
    toastOptions={{
      error: {
        duration: 8000,
        ariaProps: { role: "alert", "aria-live": "assertive" },
      },
    }}
  />
);

export default Toast;
