import { useTranslations } from "next-intl";
import { BiSolidMessageDetail } from "react-icons/bi";
import { BsFillSendFill, BsTelephoneOutbound } from "react-icons/bs";

import { Link } from "@/i18n/navigation";

type FooterItem = { label: string; href?: "/contact" | "/rooms" };

const FooterList = ({
  id,
  label,
  items,
}: {
  id: string;
  label: string;
  items: FooterItem[];
}) => (
  <nav aria-labelledby={id}>
    <h2 id={id} className="mb-4 text-base font-semibold">
      {label}
    </h2>
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label}>
          {item.href ? (
            <Link href={item.href} className="text-muted hover:text-ink hover:underline dark:hover:text-white">
              {item.label}
            </Link>
          ) : (
            <span className="text-muted">{item.label}</span>
          )}
        </li>
      ))}
    </ul>
  </nav>
);

const Footer = () => {
  const t = useTranslations("Footer");

  const supportLinks: FooterItem[] = [
    { label: t("communityForum") },
    { label: t("helpCenter"), href: "/contact" },
    { label: t("privacy") },
    { label: t("terms") },
  ];

  const exploreLinks: FooterItem[] = [
    { label: t("stays"), href: "/rooms" },
    { label: t("experiences") },
    { label: t("newFeatures") },
    { label: t("giftCards") },
  ];

  return (
    <footer className="mt-20 border-t border-gray-200 bg-surface dark:border-neutral-800 dark:bg-neutral-900">
      <div className="page-container grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-tertiary-dark dark:text-tertiary-darkmode"
          >
            SmartStay
          </Link>
          <h2 className="mb-4 mt-6 text-base font-semibold">{t("contact")}</h2>
          <address className="space-y-3 not-italic text-muted">
            <p>Avda. Programación 123</p>
            <p className="flex items-center gap-2">
              <BsFillSendFill aria-hidden="true" />
              Madrid, España
            </p>
            <p className="flex items-center gap-2">
              <BsTelephoneOutbound aria-hidden="true" />
              111-222-333
            </p>
            <p className="flex items-center gap-2">
              <BiSolidMessageDetail aria-hidden="true" />
              SmartStay by srdgz
            </p>
          </address>
        </div>
        <FooterList id="footer-support" label={t("support")} items={supportLinks} />
        <FooterList id="footer-explore" label={t("explore")} items={exploreLinks} />
      </div>
      <div className="border-t border-gray-200 dark:border-neutral-800">
        <p className="page-container py-6 text-sm text-muted">
          © {new Date().getFullYear()} SmartStay
        </p>
      </div>
    </footer>
  );
};

export default Footer;
