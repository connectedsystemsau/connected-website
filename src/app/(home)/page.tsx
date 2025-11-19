import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import AboutSection from "./components/AboutSection";
import ContactSection from "./components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      
      {/* Contact & Footer Wrapper */}
      <div className="min-h-screen flex flex-col">
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}
