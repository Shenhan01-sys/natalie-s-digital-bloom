import { Download, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const handleScrollToProjects = () => {
    const element = document.querySelector('#projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-hero">
      {/* Animated Blob Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-gradient-warm/40 blob animate-blob-morph"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute top-1/2 -left-32 w-80 h-80 bg-gradient-to-br from-secondary to-primary/20 blob animate-blob-morph"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute -bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-gradient-warm/30 to-secondary blob animate-blob-morph"
          style={{ animationDelay: '4s' }}
        />
      </div>

      <div className="container mx-auto px-6 py-20 md:py-0">
        <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8 text-center md:text-left order-2 md:order-1">
            <div className="space-y-4">
              <p className="text-primary font-medium animate-fade-in-up stagger-1">
                Welcome to my portfolio ✨
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight animate-fade-in-up stagger-2">
                Natalie Netania
                <br />
                <span className="text-primary">Sulistio</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto md:mx-0 animate-fade-in-up stagger-3">
                HR Management Student.
                <br />
                <span className="text-foreground/80 font-medium">
                  Bridging Human Potential with Digital Innovation.
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start animate-fade-in-up stagger-4">
              <Button
                size="lg"
                className="bg-primary hover:bg-accent text-primary-foreground font-medium px-8 rounded-full hover-lift"
              >
                <Download className="w-4 h-4 mr-2" />
                Download CV
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleScrollToProjects}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium px-8 rounded-full hover-lift"
              >
                View Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-8 justify-center md:justify-start animate-fade-in-up stagger-5">
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-primary">6+</p>
                <p className="text-sm text-muted-foreground">Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-primary">7+</p>
                <p className="text-sm text-muted-foreground">Experiences</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-serif font-bold text-primary">3+</p>
                <p className="text-sm text-muted-foreground">Certifications</p>
              </div>
            </div>
          </div>

          {/* Right Side - Profile Image */}
          <div className="flex justify-center order-1 md:order-2 animate-fade-in-up stagger-2">
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/40 to-gradient-warm/40 rounded-full blur-3xl scale-110" />

              {/* Image container with organic shape */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 float-animation">
                <div
                  className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary overflow-hidden blob"
                  style={{
                    animationDuration: '10s',
                  }}
                >
                  {/* Placeholder for profile image */}
                  <img
                    src="/profilePict01.png"
                    alt="Natalie Netania Sulistio"
                    className="w-full h-full object-cover object-center scale-98"
                  />
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-bounce opacity-80" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-warm rounded-full animate-bounce opacity-80" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1.5 h-3 bg-primary rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
