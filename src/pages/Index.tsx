import { useCallback, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Portfolio, { type Filter } from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Lightbox from "@/components/Lightbox";
import type { Work } from "@/data/content";

const scrollToPortfolio = () => document.getElementById("portfolio")?.scrollIntoView({ block: "start" });

const Index = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Filter>("All");
  const [lightbox, setLightbox] = useState<{ list: Work[]; index: number } | null>(null);

  const openWork = useCallback((list: Work[], index: number) => setLightbox({ list, index }), []);

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-primary focus:px-5 focus:py-3 focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero
          onSearch={(q) => {
            setQuery(q);
            setCategory("All");
            scrollToPortfolio();
          }}
          onOpenWork={openWork}
        />
        <About />
        <Experience
          onBrowse={(c) => {
            setQuery("");
            setCategory(c);
            scrollToPortfolio();
          }}
        />
        <Portfolio
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          onOpenWork={openWork}
        />
        <Contact />
      </main>
      <Lightbox
        state={lightbox}
        onChange={(index) => setLightbox((s) => (s ? { ...s, index } : s))}
        onClose={() => setLightbox(null)}
      />
    </div>
  );
};

export default Index;
