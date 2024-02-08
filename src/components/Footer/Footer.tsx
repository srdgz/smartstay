import Link from "next/link";
import { BiSolidMessageDetail } from "react-icons/bi";
import { BsFillSendFill, BsTelephoneOutbound } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="mt-16">
      <div className="container mx-auto px-4">
        <Link href="/" className="font-black text-tertiary-dark">
          SmartStay
        </Link>
        <h4 className="font-semibold text-[20px] py-6">Contact</h4>
        <div className="flex flex-wrap gap-16 items-center justify-between">
          <div className="flex-1">
            <p>Avda. Programación 123</p>
            <div className="flex items-center py-4">
              <BsFillSendFill />
              <p className="ml-2">Madrid, España</p>
            </div>
            <div className="flex items-center">
              <BsTelephoneOutbound />
              <p className="ml-2">111-222-333</p>
            </div>
            <div className="flex items-center pt-4">
              <BiSolidMessageDetail />
              <p className="ml-2">SmartStay by srdgz</p>
            </div>
          </div>
          <div className="flex-1 md:text-right">
            <p className="pb-4">Community Forum</p>
            <p className="pb-4">Help Center</p>
            <p className="pb-4">Privacy</p>
            <p className="pb-4">Terms of Service</p>
          </div>
          <div className="flex-1 md:text-right">
            <p className="pb-4">Stays</p>
            <p className="pb-4">Experiences</p>
            <p className="pb-4">New Features</p>
            <p className="pb-4">Gift Cards</p>
          </div>
        </div>
      </div>
      <div className="bg-tertiary-light h-10 md:h-[70px] mt-16 w-full bottom-0 left-0 dark:bg-[#212529]"></div>
    </footer>
  );
};

export default Footer;
