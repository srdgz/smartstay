import { useContext } from "react";

import { CurrencyContext } from "../context/CurrencyContext";

export const useMoney = () => {
  const value = useContext(CurrencyContext);
  if (!value) throw new Error("useMoney must be used inside a CurrencyProvider");
  return value;
};
