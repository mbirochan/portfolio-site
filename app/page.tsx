"use client";
import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Code2, 
  GraduationCap, 
  Briefcase,
  Mail,
  Github,
  Linkedin 
} from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { TextScramble } from '@/components/TextScramble';
import BackgroundPaths from '@/components/background-paths';
import { ThemeToggle } from '@/components/theme-toggle';
import { 
  FaReact, 
  FaNodeJs, 
  FaPython, 
  FaAws, 
  FaJava, 
  FaHtml5, 
  FaDatabase,
  FaDocker
} from 'react-icons/fa';
import { 
  SiNextdotjs, 
  SiJavascript, 
  SiExpress, 
  SiMongodb, 
  SiPostgresql, 
  SiFirebase, 
  SiCplusplus,
  SiC,
  SiPytorch,
  SiScikitlearn,
  SiNumpy,
  SiSolidity
} from 'react-icons/si';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  name: string;
  level: number;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud' | 'Languages' | 'AI/ML' | 'Blockchain';
  icon: React.ElementType;
}

interface Project {
  title: string;
  description: string;
  link: string;
}

export default function Home() {
  const sectionsRef = useRef<HTMLDivElement>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    const sections = document.querySelectorAll('.section');
    const observers: IntersectionObserver[] = [];
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '-10% 0px -10% 0px'
    };
    
    sections.forEach((section) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Section in view:', entry.target.id);
            setActiveSection(entry.target.id);
          }
        });
      }, observerOptions);
      observer.observe(section);
      observers.push(observer);
    });
    
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const skillCards = document.querySelectorAll('.skill-card');
      console.log('Number of skill cards:', skillCards.length);

      gsap.from(skillCards, {
        scrollTrigger: {
          trigger: '.skills-section',
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none',
          markers: true,
          onEnter: () => console.log('ScrollTrigger entered'),
        },
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.set(skillCards, { opacity: 1, y: 0 });
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const skills: Skill[] = [
    { name: 'React', level: 90, category: 'Frontend', icon: FaReact },
    { name: 'Next.js', level: 85, category: 'Frontend', icon: SiNextdotjs },
    { name: 'JavaScript', level: 90, category: 'Frontend', icon: SiJavascript },
    { name: 'HTML/CSS', level: 88, category: 'Frontend', icon: FaHtml5 },
    { name: 'Node.js', level: 85, category: 'Backend', icon: FaNodeJs },
    { name: 'Express', level: 85, category: 'Backend', icon: SiExpress },
    { name: 'Python', level: 80, category: 'Backend', icon: FaPython },
    { name: 'MongoDB', level: 85, category: 'Database', icon: SiMongodb },
    { name: 'PostgreSQL', level: 80, category: 'Database', icon: SiPostgresql },
    { name: 'Firebase', level: 85, category: 'Database', icon: SiFirebase },
    { name: 'AWS', level: 75, category: 'Cloud', icon: FaAws },
    { name: 'Java', level: 75, category: 'Languages', icon: FaJava },
    { name: 'C++', level: 75, category: 'Languages', icon: SiCplusplus },
    { name: 'C', level: 70, category: 'Languages', icon: SiC },
    { name: 'PyTorch', level: 70, category: 'AI/ML', icon: SiPytorch },
    { name: 'Scikit-learn', level: 75, category: 'AI/ML', icon: SiScikitlearn },
    { name: 'NumPy', level: 80, category: 'AI/ML', icon: SiNumpy },
    { name: 'Solidity', level: 75, category: 'Blockchain', icon: SiSolidity },
  ];

  const projects: Project[] = [
    {
      title: 'AI-powered Voice Converter',
      description: 'I fine-tuned a voice model to convert any song to my voice.',
      link: 'https://github.com/mbirochan'
    },
    {
      title: 'Blog Site with React Native',
      description: 'A blog site built with React Native and Firebase for real-time data storage. I post my blogs here.',
      link: 'https://github.com/mbirochan'
    },
    {
      title: 'Personal Portfolio Website',
      description: 'A personal portfolio website built with Next.js and Tailwind CSS.',
      link: 'https://github.com/mbirochan'
    },
  ];

  const sections = [
    { id: 'about', icon: User, label: 'About' },
    { id: 'skills', icon: Code2, label: 'Skills' },
    { id: 'education', icon: GraduationCap, label: 'Education' },
    { id: 'projects', icon: Briefcase, label: 'Projects' },
    { id: 'contact', icon: Mail, label: 'Contact' },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <BackgroundPaths />
      </div>
      <div
        className={`fixed left-0 top-0 h-full bg-card/80 backdrop-blur-sm border-r transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-4 bg-background border shadow-md rounded-full"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
        </Button>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            {sidebarOpen && <span className="font-semibold">Menu</span>}
            <ThemeToggle />
          </div>
          <div className="space-y-4">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'ghost'}
                className={`w-full justify-start ${!sidebarOpen && 'justify-center'}`}
                onClick={() => scrollToSection(section.id)}
              >
                <section.icon className="h-5 w-5" />
                {sidebarOpen && <span className="ml-2">{section.label}</span>}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`flex-1 overflow-y-auto transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}
        ref={sectionsRef}
      >
        <section id="about" className="section min-h-screen flex items-center p-8">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <TextScramble text="Birochan Mainali" />
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
               I am a Computer Science Student at University of North Texas
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg" asChild>
                  <a href="https://github.com/mbirochan" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <a href="https://www.linkedin.com/in/birochan-mainali-8513561aa/" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-5 w-5" />
                    LinkedIn
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        <section id="skills" className="section min-h-screen p-8 skills-section">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Skills</h2>
            <div className="space-y-8">
              {['Frontend', 'Backend', 'Database', 'Cloud', 'Languages', 'AI/ML', 'Blockchain'].map((category) => {
                const categorySkills = skills.filter((skill) => skill.category === category);
                console.log(`${category} skills:`, categorySkills.length);
                
                return (
                  <div key={category} className="mb-8">
                    <h3 className="text-2xl font-semibold mb-6">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorySkills.map((skill) => (
                        <Card 
                          key={skill.name} 
                          className="p-6 skill-card hover:shadow-lg transition-shadow"
                          style={{ opacity: 1 }}
                        >
                          <div className="flex items-center gap-3 mb-3">
                            {React.createElement(skill.icon, {
                              className: "h-5 w-5 text-primary"
                            })}
                            <h4 className="text-lg font-semibold">{skill.name}</h4>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2.5">
                            <div
                              className="bg-primary h-2.5 rounded-full transition-all duration-1000"
                              style={{ width: `${skill.level}%` }}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 text-right">{skill.level}%</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        <section id="education" className="section min-h-screen p-8">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Education</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold">University of North Texas</h3>
                <p className="text-muted-foreground">Bachelor of Science in Computer Science</p>
                <p className="text-sm text-muted-foreground mt-2">January 2025 - December 2025</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold">Dallas College</h3>
                <p className="text-muted-foreground">Computer Science</p>
                <p className="text-sm text-muted-foreground mt-2">January 2023 - December 2024</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold">Truman State University</h3>
                <p className="text-muted-foreground">Computer Science</p>
                <p className="text-sm text-muted-foreground mt-2">August 2022 - December 2022</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold">Institute of Engineering, Pulchowk Campus</h3>
                <p className="text-muted-foreground">Computer Engineering</p>
                <p className="text-sm text-muted-foreground mt-2">January 2022 - April 2022</p>
              </Card>
            </div>
          </div>
        </section>
        <section id="projects" className="section min-h-screen p-8">
          <div className="container">
            <h2 className="text-3xl font-bold mb-8">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.title} className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  <Button variant="outline" asChild>
                    <a href={project.link} target="_blank" rel="noopener noreferrer">
                      View Project
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
        <section id="contact" className="section min-h-screen p-8">
          <ContactForm />
        </section>
      </div>
    </div>
  );
}