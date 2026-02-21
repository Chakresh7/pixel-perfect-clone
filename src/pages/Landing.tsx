import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import DashboardMockup from '@/components/landing/DashboardMockup';
import StatsStrip from '@/components/landing/StatsStrip';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import WhoItsForSection from '@/components/landing/WhoItsForSection';
import CTASection from '@/components/landing/CTASection';
import Footer from '@/components/landing/Footer';

const Landing = () => (
  <div className="min-h-screen bg-white">
    <Navbar />
    <HeroSection />
    <div className="px-6 md:px-12">
      <DashboardMockup />
    </div>
    <div className="mt-24">
      <StatsStrip />
    </div>
    <FeaturesSection />
    <HowItWorksSection />
    <WhoItsForSection />
    <CTASection />
    <Footer />
  </div>
);

export default Landing;
