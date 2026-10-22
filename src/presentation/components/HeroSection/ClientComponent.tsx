"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";

import CountUpNumber from "../CountUpNumber/CountUpNumber";

type Props = {
  heading1: React.ReactNode;
  section2: React.ReactNode;
};

const ClientComponent: FC<Props> = (props) => {
  const { heading1, section2 } = props;
  const t = useTranslations("Hero");

  const stats = [
    { label: t("basicRoom"), value: 200 },
    { label: t("luxuryRoom"), value: 150 },
    { label: t("suiteRoom"), value: 90 },
  ];

  return (
    <section className="page-container grid items-center gap-10 py-10 lg:grid-cols-2 lg:gap-14 lg:py-16">
      <div>
        {heading1}
        <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-gray-200 pt-6 dark:border-neutral-800">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col-reverse gap-1">
              <dt className="text-muted text-sm">{stat.label}</dt>
              <dd>
                <CountUpNumber duration={2000} endValue={stat.value} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
      {section2}
    </section>
  );
};

export default ClientComponent;
