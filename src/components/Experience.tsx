import { Settings, GraduationCap, FileText, Flower, Smartphone, Wallet } from 'lucide-react';

interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string[];
  icon: React.ReactNode;
}

const experiences: Experience[] = [
  {
    id: 1,
    title: 'Koordinator Tim Teknis',
    company: 'DutaWacana Web3',
    period: 'Januari 2026 – Sekarang',
    description: [
      'Memimpin tim teknis dalam komunitas yang berfokus pada teknologi Web3 di lingkungan kampus.',
      'Mengorganisir kegiatan workshop dan sesi belajar terkait blockchain dan pengembangan dApp.',
    ],
    icon: <Settings className="w-6 h-6" />,
  },
  {
    id: 2,
    title: 'Asisten Dosen (Database Design)',
    company: 'Universitas Kristen Duta Wacana',
    period: 'Januari 2026 – Sekarang',
    description: [
      'Mendampingi dosen dalam proses pengajaran mata kuliah Perancangan Basis Data.',
      'Membantu mahasiswa dalam memahami konsep SQL dan manajemen data.',
    ],
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    id: 3,
    title: 'Sekretaris BEM',
    company: 'Fakultas Bisnis UKDW',
    period: '2024 – 2025',
    description: [
      'Mengelola administrasi surat-menyurat dan pengarsipan dokumen organisasi.',
      'Mengatur jadwal rapat dan notulensi kegiatan kemahasiswaan.',
    ],
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 4,
    title: 'Business Owner',
    company: 'Monic Bouquet',
    period: '2023 – Sekarang',
    description: [
      'Mengelola operasional bisnis florist secara mandiri mulai dari produksi, pemasaran, hingga layanan pelanggan.',
    ],
    icon: <Flower className="w-6 h-6" />,
  },
  {
    id: 5,
    title: 'Social Media Admin & Koordinator Danus',
    company: 'Berbagai Organisasi Kampus',
    period: '2023 – Sekarang',
    description: [
      'Mengelola konten dan interaksi media sosial untuk meningkatkan engagement.',
      'Memimpin strategi pencarian dana untuk berbagai kegiatan kepanitiaan kampus.',
    ],
    icon: <Smartphone className="w-6 h-6" />,
  },
];

const Experience = () => {
  return (
    <section id="experience" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">My journey so far</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Experience & <span className="text-primary">Roles</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary md:-translate-x-1/2" />

          {/* Experience Cards */}
          <div className="space-y-8 md:space-y-12">
            {experiences.map((exp, index) => (
              <div
                key={exp.id}
                className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background md:-translate-x-1/2 z-10" />

                {/* Card */}
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${
                    index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
                  }`}
                >
                  <div className="glass-card rounded-2xl p-6 hover-lift group cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <span className="text-primary group-hover:text-primary-foreground transition-colors">
                        {exp.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <span className="text-sm text-primary font-medium">
                        {exp.period}
                      </span>
                      <h3 className="text-xl font-serif font-bold text-foreground">
                        {exp.title}
                      </h3>
                      <p className="text-muted-foreground font-medium">
                        {exp.company}
                      </p>
                      <ul className="space-y-2 pt-2">
                        {exp.description.map((desc, i) => (
                          <li
                            key={i}
                            className="text-sm text-foreground/80 flex items-start gap-2"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
