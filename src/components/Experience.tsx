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
    title: 'Store Assistant',
    company: 'Kingkong Flames',
    period: 'Apr 2025 - Saat ini',
    description: [
      'Managed high-volume printing services and document processing.',
      'Oversaw daily inventory of office and school supplies.',
      'Provided excellent customer service and resolved technical issues.',
    ],
    icon: <Wallet className="w-6 h-6" />,
  },
  {
    id: 2,
    title: 'Social Media Admin (Faculty of Business)',
    company: 'Universitas Kristen Duta Wacana',
    period: 'Mar 2025 - Saat ini',
    description: [
      'Managed the official Instagram account of the Faculty of Business.',
      'Developed creative visual content and captions to promote faculty programs.',
      'Monitored social media analytics and responded to inquiries.',
    ],
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    id: 3,
    title: 'Owner',
    company: 'Monic Bouquet',
    period: 'Mei 2023 - Saat ini',
    description: [
      'Established and managed a boutique floral business.',
      'Handled end-to-end business operations including product design.',
      'Executed digital marketing strategies to build a loyal customer base.',
    ],
    icon: <Flower className="w-6 h-6" />,
  },
  {
    id: 4,
    title: 'Registration Volunteer',
    company: 'Pekan Olahraga Mahasiswa Daerah DIY',
    period: 'Des 2024',
    description: [
      'Managed participant databases and performed document verification.',
      'Coordinated on-site registration workflows for efficient service.',
    ],
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 5,
    title: 'Treasurer',
    company: 'Mooncake Festival Committee UKDW',
    period: 'Sep 2024',
    description: [
      'Developed the Budget Plan (RAB) and managed transparent cash flow.',
      'Verified transaction receipts to maintain data accuracy.',
      'Prepared the final Financial Accountability Report (LPJ).',
    ],
    icon: <Wallet className="w-6 h-6" />,
  },
  {
    id: 6,
    title: 'Secretary',
    company: 'BEM Fakultas Bisnis UKDW',
    period: 'Feb 2024 – Sekarang',
    description: [
      'Manage organizational correspondence and systematic document archiving.',
      'Draft meeting minutes and coordinate the internal agenda.',
      'Review and verify P3DK proposals to ensure smooth program financing.',
    ],
    icon: <Settings className="w-6 h-6" />,
  },
  {
    id: 7,
    title: 'Design & Documentation',
    company: 'PMK Soli Deo Gloria UKDW',
    period: 'Feb 2024 – Feb 2024',
    description: [
      'Managed visual communication and digital publications.',
      'Responsible for documenting all event series as official archives.',
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
                className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background md:-translate-x-1/2 z-10" />

                {/* Card */}
                <div
                  className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'
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
