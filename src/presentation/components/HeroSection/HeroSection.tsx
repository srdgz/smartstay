import ClientComponent from "./ClientComponent";
import { HeroHeading, HeroImages } from "./ServerComponent";

const HeroSection = () => {
  return <ClientComponent section2={<HeroImages />} heading1={<HeroHeading />} />;
};

export default HeroSection;
