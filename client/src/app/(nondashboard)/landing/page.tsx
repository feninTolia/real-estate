import CallToActionSection from './CallToActionSection';
import DiscoverSection from './Discover';
import FeaturesSection from './Features';
import FooterSection from './Footer';
import Hero from './Hero';

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <FeaturesSection />
      <DiscoverSection />
      <CallToActionSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
