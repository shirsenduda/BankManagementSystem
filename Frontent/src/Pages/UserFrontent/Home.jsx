import HeroSection from './HeroSection';
import BrandSlider from './BrandSlider';
import OfferSection from './OfferSection';
import PersonalizedCardSection from './PersonalizedCardSection';
import FindPerfectCardSection from './FindPerfectCardSection';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <HeroSection />
      <OfferSection />
      <PersonalizedCardSection />
      <FindPerfectCardSection />
    </div>
  );
}

export default Home;