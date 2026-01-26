import { useState } from 'react';
import { ExternalLink, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Project {
  id: number;
  title: string;
  description: string;
  category: 'digital' | 'research' | 'hr';
  tags: string[];
  event?: string;
  role?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Monic Bouquet (Business)',
    description: 'Managed end-to-end operations of a boutique floral business, including product design, digital marketing, and customer relationship management.',
    category: 'hr',
    tags: ['Entrepreneurship', 'Business Management', 'Digital Marketing'],
    role: 'Owner',
  },
  {
    id: 2,
    title: 'Centrino Business Plan Competition 2025',
    description: 'Developing a comprehensive business proposal including market analysis, financial projections, and strategic marketing plans as a Finalist.',
    category: 'research',
    tags: ['Business Planning', 'Market Analysis', 'Financial Projections'],
    event: 'Universitas Kristen Duta Wacana',
    role: 'Finalist',
  },
  {
    id: 3,
    title: 'Faculty of Business Social Media',
    description: 'Managed official Instagram account, developed content strategy, and analyzed social media metrics to improve engagement for the Faculty of Business.',
    category: 'digital',
    tags: ['Social Media Management', 'Content Strategy', 'Analytics'],
    role: 'Social Media Admin',
  },
  {
    id: 4,
    title: 'Mooncake Festival Financial Management',
    description: 'Developed budget plans (RAB), managed cash flow, verified transactions, and prepared financial accountability reports (LPJ) for the event committee.',
    category: 'research',
    tags: ['Financial Reporting', 'Budgeting', 'Accounting'],
    role: 'Treasurer',
  },
];

const categoryConfig = {
  all: { label: 'All Works', filter: () => true },
  research: { label: 'HR & Research', filter: (p: Project) => p.category === 'research' || p.category === 'hr' },
  digital: { label: 'Digital & Creative', filter: (p: Project) => p.category === 'digital' },
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
