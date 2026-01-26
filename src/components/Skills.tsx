import { Badge } from '@/components/ui/badge';

interface SkillCategory {
  title: string;
  skills: string[];
  color: string;
}

interface Certification {
  name: string;
  issuer: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Human Resources',
    skills: ['Recruitment', 'Administration', 'Organizational Behavior', 'Talent Management'],
    color: 'from-primary to-accent',
  },
  {
    title: 'Tech Stack',
    skills: ['React.js', 'Oracle SQL', 'Move Language', 'Microsoft Office Suite'],
    color: 'from-accent to-primary',
  },
  {
    title: 'Design Tools',
    skills: ['Canva', 'CapCut', 'Figma Basics'],
    color: 'from-gradient-warm to-primary',
  },
  {
    title: 'Soft Skills',
    skills: ['Public Speaking', 'Leadership', 'Time Management', 'Critical Thinking', 'Research'],
    color: 'from-primary to-gradient-warm',
  },
];

const certifications: Certification[] = [
  { name: 'Sui Dev Campus Workshop Participant', issuer: 'UGM (Januari 2026)' },
  { name: 'Kandidat Pilmapres', issuer: 'Tingkat Universitas UKDW' },
  { name: 'HR Courses Completion', issuer: 'MySkill' },
];

const Skills = () => {
  return (
    <section id="skills" className="py-20 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary font-medium mb-2">What I bring to the table</p>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Skills & <span className="text-primary">Certifications</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto space-y-16">
          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, catIndex) => (
              <div
                key={category.title}
                className="glass-card rounded-2xl p-6 hover-lift"
              >
                <h3 className="text-lg font-serif font-bold text-foreground mb-4 flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.color}`} />
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill, skillIndex) => (
                    <div
                      key={skill}
                      className="skill-bubble"
                      style={{
                        animationDelay: `${(catIndex * 0.2) + (skillIndex * 0.1)}s`,
                      }}
                    >
                      <Badge
                        variant="secondary"
                        className="bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default px-4 py-2 text-sm font-medium"
                      >
                        {skill}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-xl font-serif font-bold text-foreground mb-6 text-center">
              Certifications & Achievements
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {certifications.map((cert, index) => (
                <div
                  key={cert.name}
                  className="group text-center p-6 rounded-xl bg-background/50 hover:bg-primary/5 transition-all duration-300 hover-lift"
                >
                  {/* Logo Placeholder */}
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <span className="text-2xl font-serif font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {cert.issuer.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-medium text-foreground mb-1 line-clamp-2">
                    {cert.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {cert.issuer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Skills Note */}
          <div className="text-center">
            <p className="text-muted-foreground">
              Also experienced in:{' '}
              <span className="text-foreground">
                Fundamental & Technical Stock Analysis (Case Study: BBCA)
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
