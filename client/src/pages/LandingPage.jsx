import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import PopularCategories from "../components/PopularCategories";
import Footer from "../components/Footer";
import "./LandingPage.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <Navbar />
      <main className="landing-main">
        <Hero />
        <PopularCategories />
      </main>
      <Footer />
    </div>
  );
}
