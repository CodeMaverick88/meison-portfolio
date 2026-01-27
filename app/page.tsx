import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects/>
      {/* You can add more sections like <Works /> or <About /> here later */}
    </main>
  );
}