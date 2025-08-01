import AboutUs from "./components/Home/AboutUs";
import BlogSection from "./components/Home/BlogSection";
import GadgetShowcase from "./components/Home/GadgetShowcase";
import Hero from "./components/Home/Hero";

export default function Home() {
  return (
    <section>
      <Hero />
      <GadgetShowcase />
      <BlogSection />
      <AboutUs />
    </section>
  );
}
