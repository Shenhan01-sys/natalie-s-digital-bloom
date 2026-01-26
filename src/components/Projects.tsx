import { useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Project {
  id: number;
  title: string;
  description: string;
  category: 'tech' | 'research' | 'hr';
  tags: string[];
  event?: string;
  role?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Progressive Escrow (Blockchain dApp)',
    description: 'Mengembangkan aplikasi terdesentralisasi (dApp) menggunakan bahasa pemrograman Move. Aplikasi ini berfungsi sebagai layanan escrow untuk pembayaran berbasis pencapaian (milestone) yang aman dan transparan.',
    category: 'tech',
    tags: ['Move Lang', 'Blockchain', 'Sui', 'dApp'],
    event: 'Sui Dev Campus Workshop (Januari 2026)',
    role: 'Developer/Peserta',
  },
  {
    id: 2,
    title: 'Riset Analisis Kebijakan Hilirisasi Tambang',
    description: 'Melakukan studi literatur dan analisis data mengenai dampak kebijakan hilirisasi terhadap ekonomi nasional. Fokus pada kinerja sektor pertambangan (Minyak, Gas, Mineral) 2020-2024.',
    category: 'research',
    tags: ['Research', 'Policy Analysis', 'Mining Sector'],
  },
  {
    id: 3,
    title: 'Analisis Risiko Operasional Bank Jatim',
    description: 'Menganalisis profil risiko operasional bank daerah dengan pendekatan Basic Indicator Approach (BIA) untuk memenuhi tugas Manajemen Risiko.',
    category: 'research',
    tags: ['Risk Management', 'Banking', 'Financial Analysis'],
  },
  {
    id: 4,
    title: 'FitAI (Web Application)',
    description: 'Proyek aplikasi web kesehatan (full-stack) yang mengintegrasikan model AI dari IBM untuk memberikan rekomendasi kebugaran personal.',
    category: 'tech',
    tags: ['React.js', 'Full-Stack', 'IBM AI', 'Health Tech'],
  },
  {
    id: 5,
    title: 'Bloom Charm (Business Plan)',
    description: 'Perencanaan bisnis produk aksesoris yang dibuat dari limbah plastik daur ulang untuk mengurangi sampah lingkungan. Menerapkan konsep Circular Economy.',
    category: 'hr',
    tags: ['Business Plan', 'Circular Economy', 'Sustainability'],
  },
  {
    id: 6,
    title: 'KKN Tematik - Kampung Cokrodirjan',
    description: 'Terlibat dalam sosialisasi dan implementasi program pengelolaan sampah rumah tangga di tingkat kelurahan. Fokus pada manajemen sampah dan edukasi masyarakat.',
    category: 'hr',
    tags: ['Community Service', 'Waste Management', 'Social Impact'],
  },
];

const categoryConfig = {
  all: { label: 'All Works', filter: () => true },
  research: { label: 'HR & Research', filter: (p: Project) => p.category === 'research' || p.category === 'hr' },
  tech: { label: 'Tech & Web3', filter: (p: Project) => p.category === 'tech' },
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState('all');

  const filteredProjects = projects.filter(
    categoryConfig[activeTab as keyof typeof categoryConfig].filter
  );

  return (
    <section id="projects" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-primary font-medium mb-2">What I've built</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Projects & <span className="text-primary">Portfolio</span>
          </h2>
        </div>

        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex justify-center mb-12 bg-secondary/50 p-1 rounded-full max-w-md mx-auto">
            {Object.entries(categoryConfig).map(([key, value]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="rounded-full px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
              >
                {value.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Projects Grid */}
          <TabsContent value={activeTab} className="mt-0">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="group glass-card rounded-2xl overflow-hidden hover-lift"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Thumbnail Placeholder with Gradient Overlay */}
                  <div className="relative h-48 bg-gradient-to-br from-secondary via-primary/10 to-gradient-warm/20 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-6xl font-serif font-bold text-primary/20">
                        {project.id}
                      </span>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="bg-white/90 text-primary hover:bg-white"
                      >
                        View Details
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    {project.event && (
                      <span className="text-xs text-primary font-medium">
                        {project.event}
                      </span>
                    )}
                    <h3 className="text-lg font-serif font-bold text-foreground line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-secondary/80 text-foreground/80 font-normal text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary font-normal text-xs"
                        >
                          +{project.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default Projects;
