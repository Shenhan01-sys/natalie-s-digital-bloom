import { Users, Cpu, ArrowRight } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <p className="text-primary font-medium mb-2">Get to know me</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              About <span className="text-primary">Me</span>
            </h2>
          </div>

          {/* Content */}
          <div className="space-y-8">
            {/* Main Story */}
            <div className="glass-card rounded-2xl p-8 md:p-12 hover-lift">
              <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                An Undergraduate Management student at{' '}
                <span className="text-primary font-medium">Duta Wacana Christian University</span>{' '}
                specializing in Human Resource Management (HRM). I am actively involved in various student organizations, which has significantly honed my leadership and teamwork skills.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                With practical experience in administration and coordination, I am recognized as a meticulous and communicative individual. I possess a strong passion for applying HRM principles to professional employee management and development.
              </p>
            </div>

            {/* Bridge Icon Section */}
            <div className="flex items-center justify-center gap-4 md:gap-8 py-8">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center hover-lift">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">People</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-accent" />
                <ArrowRight className="w-5 h-5 text-primary" />
                <div className="w-12 h-0.5 bg-gradient-to-r from-accent to-primary" />
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center hover-lift">
                  <Cpu className="w-8 h-8 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Technology</span>
              </div>
            </div>

            {/* Education Card */}
            <div className="glass-card rounded-2xl p-6 md:p-8 hover-lift">
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex-1">
                  <p className="text-primary font-medium text-sm mb-1">Education</p>
                  <h3 className="text-xl font-serif font-bold text-foreground">
                    Universitas Kristen Duta Wacana
                  </h3>
                  <p className="text-foreground/80">
                    Sarjana Manajemen (S.M.) - Konsentrasi MSDM
                  </p>
                </div>
                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-serif font-bold text-primary">2023</p>
                    <p className="text-xs text-muted-foreground">Start Year</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-serif font-bold text-primary">3.5 Y</p>
                    <p className="text-xs text-muted-foreground">Target Grad</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Digital Signature */}
            <div className="text-right pt-4">
              <p className="font-serif italic text-2xl text-primary">
                Natalie N. Sulistio
              </p>
              <p className="text-sm text-muted-foreground">
                Yogyakarta, Indonesia
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
