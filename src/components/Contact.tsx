import { useState } from 'react';
import { Send, Linkedin, Github, Mail, Heart, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: 'Message sent! ✨',
      description: "Thank you for reaching out. I'll get back to you soon!",
    });

    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const socialLinks = [
    {
      icon: <Linkedin className="w-5 h-5" />,
      href: 'https://linkedin.com/in/natalie-sulistio',
      label: 'LinkedIn',
    },
    {
      icon: <Github className="w-5 h-5" />,
      href: 'https://github.com/natalie-sulistio',
      label: 'GitHub',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      href: 'mailto:natalie@example.com',
      label: 'Email',
    },
  ];

  return (
    <section id="contact" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-primary font-medium mb-2">Let's connect</p>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Get in <span className="text-primary">Touch</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md mx-auto">
              Open for HR Internship & Collaborative Projects. Feel free to reach out!
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="glass-card rounded-2xl p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-0 border-b-2 border-border rounded-none bg-transparent focus:border-primary transition-colors px-0"
                    placeholder="Your name"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-0 border-b-2 border-border rounded-none bg-transparent focus:border-primary transition-colors px-0"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="border-0 border-b-2 border-border rounded-none bg-transparent focus:border-primary transition-colors px-0 min-h-[120px] resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-accent text-primary-foreground rounded-full py-6 group"
                >
                  <span className={isSubmitting ? 'opacity-0' : ''}>
                    Send Message
                  </span>
                  <Send
                    className={`w-4 h-4 ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 ${
                      isSubmitting ? 'absolute animate-ping' : ''
                    }`}
                  />
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-lg font-serif font-bold text-foreground mb-6">
                  Connect with me
                </h3>
                <div className="flex gap-4">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 bounce-hover"
                      aria-label={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h3 className="text-lg font-serif font-bold text-foreground mb-4">
                  Location
                </h3>
                <p className="text-muted-foreground">
                  📍 Yogyakarta, Indonesia
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Available for remote work and on-site opportunities in Yogyakarta.
                </p>
              </div>

              <div className="text-center md:text-left">
                <p className="text-muted-foreground italic">
                  "The future of HR lies at the intersection of human empathy and technological innovation."
                </p>
                <p className="font-serif text-primary mt-2">— Natalie N.S.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <p className="text-muted-foreground text-sm">
              Made with <Heart className="w-4 h-4 inline text-primary" /> and{' '}
              <Code className="w-4 h-4 inline text-primary" /> by Natalie
            </p>
            <p className="text-muted-foreground text-sm">
              © 2026 Natalie Netania Sulistio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Contact;
