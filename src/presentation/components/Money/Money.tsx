"use client";

import { useMoney } from "@/presentation/hooks/useMoney";

const Money = ({ amount }: { amount: number }) => {
  const { format } = useMoney();
  return <>{format(amount)}</>;
};

export default Money;
