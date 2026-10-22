import Link from "next/link";
import { BiSolidMessageDetail } from "react-icons/bi";
import { BsFillSendFill, BsTelephoneOutbound } from "react-icons/bs";

const supportLinks = [
  { label: "Community Forum" },
  { label: "Help Center", href: "/contact" },
  { label: "Privacy" },
  { label: "Terms of Service" },
];

const exploreLinks = [
  { label: "Stays", href: "/rooms" },
  { label: "Experiences" },
  { label: "New Features" },
  { label: "Gift Cards" },
];

const FooterList = ({
  label,
  items,
}: {
  label: string;
  items: { label: string; href?: string }[];
}) => (
  <nav aria-label={label} className="flex-1 md:text-right">
    <ul>
      {items.map((item) => (
        <li key={item.label} className="pb-4">
          {item.href ? (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          ) : (
            item.label
          )}
        </li>
      ))}
    </ul>
  </nav>
);

const Footer = () => {
  return (
    <footer className="mt-16">
      <div className="container mx-auto px-4">
        <Link
          href="/"
          className="font-black text-tertiary-dark dark:text-tertiary-darkmode"
        >
          SmartStay
        </Link>
        <h2 className="font-semibold text-[20px] py-6">Contact</h2>
        <div className="flex flex-wrap gap-16 items-center justify-between">
          <div className="flex-1">
            <p>Avda. Programación 123</p>
            <div className="flex items-center py-4">
              <BsFillSendFill aria-hidden="true" />
              <p className="ml-2">Madrid, España</p>
            </div>
            <div className="flex items-center">
              <BsTelephoneOutbound aria-hidden="true" />
              <p className="ml-2">111-222-333</p>
            </div>
            <div className="flex items-center pt-4">
              <BiSolidMessageDetail aria-hidden="true" />
              <p className="ml-2">SmartStay by srdgz</p>
            </div>
          </div>
          <FooterList label="Support" items={supportLinks} />
          <FooterList label="Explore" items={exploreLinks} />
        </div>
      </div>
      <div className="bg-tertiary-light h-10 md:h-[70px] mt-16 w-full bottom-0 left-0 dark:bg-[#212529]"></div>
    </footer>
  );
};

export default Footer;
