import Navbar from "@/components/navbar";
import { Footer } from "@/components/footer";
import { About } from "@/components/landingPage/About";
import { Program } from "@/components/landingPage/Program";
import MapSection from "@/components/landingPage/Map";
import FAQSection from "@/components/landingPage/FAQ";
import HeroSection from "@/components/landingPage/Hero";
import Stats from "@/components/landingPage/Stats";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50 aurora-bg text-gray-900">
      <Navbar />
      <HeroSection />
      <Stats />
      <About />
      <Program />
      <MapSection />
      <FAQSection />
      <Footer />
    </div>
  );
}
