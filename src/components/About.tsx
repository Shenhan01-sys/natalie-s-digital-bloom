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
                Saya adalah mahasiswa Manajemen di{' '}
                <span className="text-primary font-medium">Universitas Kristen Duta Wacana</span>{' '}
                dengan konsentrasi Manajemen Sumber Daya Manusia (MSDM). Memiliki dedikasi tinggi dalam pengembangan organisasi, administrasi, dan manajemen talenta.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90 mb-6">
                Aktif dalam berbagai kegiatan akademis maupun non-akademis, mulai dari menjadi{' '}
                <span className="text-primary font-medium">Asisten Dosen</span>, memimpin sebagai{' '}
                <span className="text-primary font-medium">Sekretaris BEM</span>, hingga mengeksplorasi teknologi{' '}
                <span className="text-primary font-medium">Web3</span> sebagai Koordinator Tim Teknis.
              </p>
              <p className="text-lg leading-relaxed text-foreground/90">
                Tujuan karir saya adalah untuk berkembang di bidang Human Resources dan Administrasi, didukung dengan kemampuan analisis data dan komunikasi yang baik. Saya percaya bahwa masa depan HR terletak pada perpaduan antara{' '}
                <span className="font-serif italic text-primary">human touch</span> dan{' '}
                <span className="font-serif italic text-primary">technological innovation</span>.
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
                    <p className="text-2xl font-serif font-bold text-primary">Sem 6</p>
                    <p className="text-xs text-muted-foreground">Current</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-serif font-bold text-primary">3.5 Th</p>
                    <p className="text-xs text-muted-foreground">Target Lulus</p>
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
