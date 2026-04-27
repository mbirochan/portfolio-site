'use client';

import Image from 'next/image';
import { Fragment, useCallback, useEffect, useState } from 'react';
import ArthaHowItWorks from '@/components/ArthaHowItWorks';

type SectionId = 'hero' | 'skills' | 'artha' | 'projects' | 'blog' | 'education' | 'contact';

const NAVS: SectionId[] = ['hero', 'skills', 'artha', 'projects', 'blog', 'education', 'contact'];
const NAV_LABELS: Record<SectionId, string> = {
  hero: 'Home',
  skills: 'Skills',
  artha: 'Artha Network',
  projects: 'Projects',
  blog: 'Blog',
  education: 'Education',
  contact: 'Contact',
};

const BLOG_URL = 'https://blog-delta-ashy-90.vercel.app/';
const GITHUB_URL = 'https://github.com/mbirochan';
const LINKEDIN_URL = 'https://www.linkedin.com/in/birochan-mainali-8513561aa/';
const LEETCODE_URL = 'https://leetcode.com/u/birochan/';
const EMAIL = 'mbirochan@gmail.com';
const ARTHA_GITHUB_URL = 'https://github.com/Artha-Network';

function useScramble(text: string) {
  const [display, setDisplay] = useState('');
  useEffect(() => {
    const chars = '!<>-_\\/[]{}=+*^?#@$%&';
    let frame = 0;
    const total = 28;
    const id = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((ch, i) => {
            if (ch === ' ') return ' ';
            if (frame > (i / text.length) * total) return ch;
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(''),
      );
      if (++frame > total + 5) clearInterval(id);
    }, 35);
    return () => clearInterval(id);
  }, [text]);
  return display || text;
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible');
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useActiveSection(ids: SectionId[]) {
  const [active, setActive] = useState<SectionId>(ids[0]);
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id as SectionId);
        });
      },
      { threshold: 0.35 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
};

function Nav({ active }: { active: SectionId }) {
  return (
    <nav className="nav">
      {NAVS.map((id) => (
        <button
          key={id}
          className={`nav-btn${active === id ? ' active' : ''}`}
          onClick={() => scrollTo(id)}
        >
          {NAV_LABELS[id]}
        </button>
      ))}
    </nav>
  );
}

function ProfilePhoto() {
  return (
    <Image
      src="/assets/profile-picture.png"
      alt="Birochan Mainali"
      width={200}
      height={200}
      priority
      style={{
        width: 200,
        height: 200,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid oklch(0.72 0.14 190 / 0.4)',
        boxShadow: '0 0 40px oklch(0.72 0.14 190 / 0.2)',
        display: 'block',
      }}
    />
  );
}

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const LeetCodeIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
  </svg>
);

const MailIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const ArrowRightIcon = ({ size = 14, weight = 2 }: { size?: number; weight?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={weight}>
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

function Hero() {
  const name = useScramble('Birochan Mainali');
  return (
    <section id="hero" className="section hero" style={{ position: 'relative' }}>
      <div className="hero-inner">
        <div className="hero-photo-wrap reveal">
          <ProfilePhoto />
        </div>
        <div>
          <p className="hero-eyebrow reveal reveal-delay-1">Software Engineer · Blockchain · Fintech</p>
          <h1 className="hero-name reveal reveal-delay-2">{name}</h1>
          <p className="hero-role reveal reveal-delay-3">
            <span>I build software that moves real money at scale</span>
          </p>
          <p className="hero-bio reveal reveal-delay-4">
            Computer Science senior at UNT. Creator of Artha Network, a decentralized escrow protocol on Solana with
            AI-driven arbitration. 80,000+ lines of code and counting.
          </p>
          <div className="hero-btns reveal reveal-delay-4">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <GithubIcon /> GitHub
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <LinkedInIcon /> LinkedIn
            </a>
            <a href={LEETCODE_URL} target="_blank" rel="noopener noreferrer" className="icon-link" title="LeetCode">
              <LeetCodeIcon />
            </a>
            <a href={`mailto:${EMAIL}`} className="icon-link" title="Email">
              <MailIcon />
            </a>
          </div>
        </div>
      </div>
      <div className="scroll-hint">
        <span>scroll</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
}

const SKILLS: Record<string, string[]> = {
  Frontend: ['React', 'Next.js', 'Tailwind CSS', 'shadcn/ui', 'JavaScript', 'TypeScript', 'HTML/CSS'],
  Backend: ['Node.js', 'NestJS', 'Express', 'Prisma', 'REST APIs'],
  Database: ['PostgreSQL', 'MongoDB', 'Supabase', 'Redis', 'Firebase'],
  Cloud: ['AWS (In Progress)', 'Docker', 'GitHub Actions', 'Linux'],
  Languages: ['TypeScript', 'JavaScript', 'Rust', 'Python', 'Java', 'C++', 'C', 'SQL'],
  'AI / ML': ['Claude AI Integration', 'AI Pipeline Architecture'],
  Blockchain: ['Rust', 'Anchor Framework', 'Solana', 'SPL Tokens', 'PDAs', 'CPIs', 'CBOR', 'ed25519', 'IPFS', 'USDC'],
};

const CAT_COLORS: Record<string, string> = {
  Frontend: 'var(--accent)',
  Backend: 'var(--accent)',
  Database: 'var(--gold)',
  Cloud: 'var(--gold)',
  Languages: 'oklch(0.72 0.14 280)',
  'AI / ML': 'oklch(0.72 0.14 320)',
  Blockchain: 'var(--gold)',
};

function Skills() {
  const [active, setActive] = useState<string>('All');
  const cats = ['All', ...Object.keys(SKILLS)];
  const shown =
    active === 'All'
      ? Object.entries(SKILLS).flatMap(([cat, skills]) => skills.map((s) => ({ s, cat })))
      : SKILLS[active].map((s) => ({ s, cat: active }));
  return (
    <section id="skills" className="section">
      <p className="sec-label reveal">02 — Skills</p>
      <h2 className="sec-title reveal reveal-delay-1">What I work with</h2>
      <div className="skill-categories reveal reveal-delay-2">
        {cats.map((c) => (
          <button
            key={c}
            className={`cat-tab${active === c ? ' active' : ''}`}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="skills-grid reveal reveal-delay-3">
        {shown.map(({ s, cat }) => (
          <div key={`${cat}-${s}`} className="skill-pill">
            <div className="skill-dot" style={{ background: CAT_COLORS[cat] }}></div>
            {s}
          </div>
        ))}
      </div>
    </section>
  );
}

const ARCH_LAYERS = [
  {
    num: 'Layer 1',
    name: 'Frontend',
    tech: 'Next.js + Tailwind + shadcn/ui',
    desc: 'Wallet onboarding, transaction UI, dispute dashboard',
  },
  {
    num: 'Layer 2',
    name: 'Actions Server',
    tech: 'NestJS + Prisma',
    desc: 'APIs, fee-payer policy, dispute management, webhooks',
  },
  {
    num: 'Layer 3',
    name: 'On-Chain Escrow Program',
    tech: 'Rust / Anchor on Solana',
    desc: 'Secure fund custody, state management, PDAs + CPIs',
  },
  {
    num: 'Layer 4',
    name: 'AI Arbiter Service',
    tech: 'Claude AI + CBOR + ed25519',
    desc: 'Cryptographically signed settlement verdicts',
  },
];

type FlowItem =
  | { kind: 'pill'; label: string; cls: string }
  | { kind: 'arrow' }
  | { kind: 'sep' };

const FLOW_STATES: FlowItem[] = [
  { kind: 'pill', label: 'INIT', cls: 'state-init' },
  { kind: 'arrow' },
  { kind: 'pill', label: 'FUNDED', cls: 'state-funded' },
  { kind: 'arrow' },
  { kind: 'pill', label: 'RELEASED', cls: 'state-released' },
  { kind: 'sep' },
  { kind: 'pill', label: 'DISPUTED', cls: 'state-disputed' },
  { kind: 'arrow' },
  { kind: 'pill', label: 'EVIDENCE', cls: 'state-evidence' },
  { kind: 'arrow' },
  { kind: 'pill', label: 'AI ARBITRATION', cls: 'state-ai' },
  { kind: 'arrow' },
  { kind: 'pill', label: 'REFUNDED', cls: 'state-refunded' },
];

const ARTHA_TAGS = [
  'Rust',
  'Anchor',
  'Solana',
  'TypeScript',
  'NestJS',
  'Prisma',
  'Next.js',
  'Tailwind',
  'shadcn/ui',
  'Supabase',
  'PostgreSQL',
  'CBOR',
  'ed25519',
  'IPFS',
  'USDC',
];

function ArthaNetwork() {
  return (
    <section id="artha" className="section artha-section">
      <div className="artha-header reveal">
        <div>
          <p className="sec-label">03 — Featured Project</p>
          <h2 className="artha-title">Artha Network</h2>
          <p className="artha-subtitle">Decentralized AI-Powered Escrow Protocol</p>
        </div>
        <a
          href={ARTHA_GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline artha-cta"
        >
          View on GitHub <ArrowRightIcon />
        </a>
      </div>

      <div className="artha-body reveal reveal-delay-1">
        <div className="artha-card">
          <p className="artha-card-label">The Problem</p>
          <p>
            I built this because I&apos;ve lived the problem. I&apos;ve been on the wrong end of peer-to-peer
            transactions — scams, broken trust, no recourse. Traditional escrow services exist, but they cost too much
            to justify for everyday deals like buying a used car or paying a freelancer. That cost barrier kills the
            velocity of money.
          </p>
        </div>
        <div className="artha-card">
          <p className="artha-card-label">The Solution</p>
          <p>
            A non-custodial escrow protocol on Solana using smart contracts and AI arbitration, settled in USDC for
            real-world usability. Blockchain and AI make escrow dead cheap and reliable, increasing the velocity of
            money and making crypto adoption practical for day-to-day transactions.
          </p>
        </div>
      </div>

      <div className="arch-wrap reveal reveal-delay-2">
        <p className="arch-title">Architecture</p>
        <div className="arch-diagram">
          <div className="arch-layers">
            {ARCH_LAYERS.map((layer, i) => (
              <Fragment key={layer.num}>
                <div className="arch-layer">
                  <p className="arch-layer-num">{layer.num}</p>
                  <p className="arch-layer-name">{layer.name}</p>
                  <p className="arch-layer-tech">{layer.tech}</p>
                  <p className="arch-layer-desc">{layer.desc}</p>
                </div>
                {i < ARCH_LAYERS.length - 1 && (
                  <div className="arch-connector">
                    <div className="arch-connector-stack">
                      <div className="arch-connector-line" />
                      <span className="arch-connector-arrow">▼</span>
                    </div>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
          <div className="arch-db">
            <p className="arch-db-label">Database</p>
            <p className="arch-db-name">Supabase / PostgreSQL</p>
            <p className="arch-db-tech">Persistent state + dispute records</p>
          </div>
        </div>
      </div>

      <div className="flow-wrap reveal reveal-delay-3">
        <p className="flow-title">Transaction Lifecycle</p>
        <div className="flow-states">
          {FLOW_STATES.map((s, i) => {
            if (s.kind === 'arrow') return <span key={i} className="flow-arrow">→</span>;
            if (s.kind === 'sep') return <span key={i} className="flow-sep">/</span>;
            return <span key={i} className={`flow-pill ${s.cls}`}>{s.label}</span>;
          })}
        </div>
      </div>

      <div className="hiw-wrap reveal reveal-delay-2">
        <div className="hiw-header">
          <p className="hiw-label">How it works</p>
          <p className="hiw-sub">15-second walkthrough · loops automatically</p>
        </div>
        <ArthaHowItWorks />
      </div>

      <div className="reveal reveal-delay-3">
        <p className="tag-section-label">Tech Stack</p>
        <div className="tag-row">
          {ARTHA_TAGS.map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="role-card reveal reveal-delay-3">
        <p className="role-label">My Role</p>
        <p className="role-text">
          Founded the Artha Network GitHub organization. Led a 4-person engineering team across 4+ agile sprints. Wrote
          80,000+ lines of code across 6 repositories. Authored the project whitepaper, architecture documentation, and
          developer onboarding materials.
        </p>
      </div>
    </section>
  );
}

type ProjectTagColor = 'teal' | 'gold';
interface Project {
  title: string;
  desc: string;
  tags: [string, ProjectTagColor][];
  link: string;
  blog?: string;
}

const PROJECTS: Project[] = [
  {
    title: 'Smoke Shop Aggregator Platform',
    desc: 'Full-stack e-commerce platform with age-gated catalog, zone-based delivery routing, and PACT Act regulatory compliance for tobacco retail.',
    tags: [
      ['React', 'teal'],
      ['Node.js', 'teal'],
      ['Express', 'teal'],
      ['MongoDB', 'gold'],
    ],
    link: 'https://github.com/mbirochan',
    blog: 'https://blog-delta-ashy-90.vercel.app/blog/the-last-retail-category-amazon-won-t-touch',
  },
  {
    title: 'Classmate Social Graph',
    desc: "Social networking app using Dijkstra's algorithm to recommend connections via dynamically weighted graph edges based on profile interaction data.",
    tags: [
      ['React', 'teal'],
      ['MongoDB', 'gold'],
      ['JavaScript', 'teal'],
    ],
    link: 'https://github.com/mbirochan/Social-Network-Graph',
  },
  {
    title: 'Blog Platform',
    desc: 'Mobile-first blog application with real-time data syncing, authentication, and rich text editing.',
    tags: [
      ['React Native', 'teal'],
      ['Firebase', 'gold'],
      ['TypeScript', 'teal'],
    ],
    link: 'https://blog-delta-ashy-90.vercel.app/',
  },
  {
    title: 'JWKS Server Security Extension',
    desc: 'Cryptographic key management server with persistent RSA key storage in SQLite and SQL injection hardening via parameterized queries.',
    tags: [
      ['Python', 'teal'],
      ['SQLite', 'gold'],
      ['JWT', 'teal'],
      ['RSA', 'gold'],
    ],
    link: 'https://github.com/mbirochan',
  },
];

function Projects() {
  return (
    <section id="projects" className="section">
      <p className="sec-label reveal">04 — Projects</p>
      <h2 className="sec-title reveal reveal-delay-1">Other things I&apos;ve built</h2>
      <div className="projects-grid">
        {PROJECTS.map((p, i) => (
          <div key={p.title} className={`project-card reveal reveal-delay-${(i % 3) + 1}`}>
            <p className="project-num">0{i + 1}</p>
            <h3 className="project-title">{p.title}</h3>
            <p className="project-desc">{p.desc}</p>
            <div className="project-tags">
              {p.tags.map(([t, c]) => (
                <span key={t} className={`tag${c === 'gold' ? ' gold' : ''}`}>
                  {t}
                </span>
              ))}
            </div>
            <div className="project-links">
              <a href={p.link} target="_blank" rel="noopener noreferrer" className="project-link">
                View on GitHub
                <ArrowRightIcon />
              </a>
              {p.blog && (
                <a
                  href={p.blog}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-link project-link-gold"
                >
                  Read the blog
                  <ArrowRightIcon />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Blog() {
  return (
    <section id="blog" className="section" style={{ minHeight: 'auto', paddingTop: 60, paddingBottom: 60 }}>
      <div className="blog-banner reveal">
        <div className="blog-banner-text">
          <p className="blog-banner-label">05 — Writing</p>
          <h2 className="blog-banner-title">
            I write about tech,
            <br />
            crypto &amp; building things
          </h2>
          <p className="blog-banner-sub">
            Thoughts on DeFi, full-stack development, AI, and the craft of engineering software.
          </p>
        </div>
        <div className="blog-banner-cta">
          <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" className="btn-blog">
            Read my blog
            <ArrowRightIcon size={16} weight={2.5} />
          </a>
        </div>
      </div>
    </section>
  );
}

interface EduItem {
  date: string;
  school: string;
  degree: string;
  gpa?: string;
  courses?: string;
}

const EDU: EduItem[] = [
  {
    date: 'Jan 2025 – May 2026 (Expected)',
    school: 'University of North Texas',
    degree: 'BS Computer Science',
    gpa: 'GPA: 3.9 / 4.0',
    courses:
      'Applied AI, Machine Learning, Algorithms, Cybersecurity, Data Structures, Software Engineering, Systems Programming, Database Systems, Computer Networks',
  },
  {
    date: 'Jan 2023 – Dec 2024',
    school: 'Dallas College',
    degree: 'Computer Science, Mathematics, Physics (Transfer)',
  },
  {
    date: 'Aug 2022 – Dec 2022',
    school: 'Truman State University',
    degree: 'Computer Science, Mathematics (Transfer)',
  },
  {
    date: 'Jan 2022 – Apr 2022',
    school: 'Pulchowk Campus, IOE',
    degree: 'Computer Engineering',
  },
];

function Education() {
  return (
    <section id="education" className="section">
      <p className="sec-label reveal">06 — Education</p>
      <h2 className="sec-title reveal reveal-delay-1">Academic path</h2>
      <div className="timeline">
        {EDU.map((e, i) => (
          <div key={e.school} className={`tl-item reveal reveal-delay-${(i % 3) + 1}`}>
            <div className="tl-date">{e.date}</div>
            <div className="tl-line">
              <div className="tl-dot"></div>
            </div>
            <div className="tl-content">
              <p className="tl-school">{e.school}</p>
              <p className="tl-degree">{e.degree}</p>
              {e.gpa && <p className="tl-gpa">{e.gpa}</p>}
              {e.courses && <p className="tl-courses">Relevant Coursework: {e.courses}</p>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg('');
    try {
      const subject = `Portfolio contact from ${form.name}`;
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject,
          message: form.message,
        }),
      });
      const result = await res.json().catch(() => ({}));
      if (res.ok && result.success) {
        setStatus('sent');
      } else {
        setStatus('error');
        setErrorMsg(result.error || 'Failed to send. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const update = (field: 'name' | 'email' | 'message') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  return (
    <section id="contact" className="section">
      <div className="contact-grid">
        <div>
          <p className="sec-label reveal">07 — Contact</p>
          <h2 className="sec-title reveal reveal-delay-1" style={{ marginBottom: 16 }}>
            Let&apos;s work together
          </h2>
          <p
            className="reveal reveal-delay-2"
            style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.7 }}
          >
            Open to opportunities in blockchain engineering, fintech, backend infrastructure, and full-stack
            development.
          </p>
          <div className="contact-links reveal reveal-delay-3">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <GithubIcon /> GitHub
            </a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              <LinkedInIcon /> LinkedIn
            </a>
            <a href={LEETCODE_URL} target="_blank" rel="noopener noreferrer" className="icon-link" title="LeetCode">
              <LeetCodeIcon />
            </a>
            <a href={`mailto:${EMAIL}`} className="icon-link" title={EMAIL}>
              <MailIcon />
            </a>
          </div>
        </div>
        <div className="reveal reveal-delay-2">
          {status === 'sent' ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: 16,
                padding: '48px 0',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  background: 'oklch(0.72 0.14 190 / 0.15)',
                  border: '1px solid var(--accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ fontWeight: 600, fontSize: 18 }}>Message sent!</p>
              <p style={{ color: 'var(--muted)', fontSize: 14 }}>I&apos;ll get back to you soon.</p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setForm({ name: '', email: '', message: '' });
                }}
                className="btn btn-outline"
                style={{ marginTop: 8 }}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Your name"
                  value={form.name}
                  onChange={update('name')}
                  required
                  minLength={2}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={update('email')}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Message</label>
                <textarea
                  className="form-textarea"
                  placeholder="What's on your mind?"
                  value={form.message}
                  onChange={update('message')}
                  required
                  minLength={10}
                />
              </div>
              {status === 'error' && <p className="form-error">{errorMsg}</p>}
              <button
                type="submit"
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', marginTop: 4 }}
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending...' : 'Send message'}
                <ArrowRightIcon />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

interface Tweaks {
  accentHue: number;
  bgStyle: 'grid' | 'glow' | 'minimal';
}

const HUES = [
  { label: 'Teal', value: 190 },
  { label: 'Blue', value: 240 },
  { label: 'Purple', value: 285 },
  { label: 'Rose', value: 10 },
];
const BG_STYLES: Tweaks['bgStyle'][] = ['grid', 'glow', 'minimal'];

function TweaksPanel() {
  const [tweaks, setTweaks] = useState<Tweaks>({ accentHue: 190, bgStyle: 'grid' });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', `oklch(0.72 0.14 ${tweaks.accentHue})`);
    document.documentElement.style.setProperty('--gold', `oklch(0.72 0.14 ${(tweaks.accentHue + 130) % 360})`);
  }, [tweaks.accentHue]);

  useEffect(() => {
    document.documentElement.style.setProperty('--grid-opacity', tweaks.bgStyle === 'grid' ? '1' : '0');
    document.querySelectorAll<HTMLElement>('.orb').forEach((o) => {
      o.style.opacity = tweaks.bgStyle === 'minimal' ? '0' : '1';
    });
  }, [tweaks.bgStyle]);

  const set = useCallback(<K extends keyof Tweaks>(key: K, val: Tweaks[K]) => {
    setTweaks((p) => ({ ...p, [key]: val }));
  }, []);

  return (
    <>
      <button
        className="tweaks-toggle"
        aria-label="Open tweaks panel"
        onClick={() => setOpen((o) => !o)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </button>
      {open && (
        <div
          style={{
            position: 'fixed',
            bottom: 80,
            right: 24,
            zIndex: 9999,
            background: 'oklch(0.11 0.012 255 / 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid oklch(0.22 0.015 255)',
            borderRadius: 12,
            padding: '20px 24px',
            width: 260,
            boxShadow: '0 20px 60px oklch(0 0 0 / 0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Tweaks</span>
            <button
              onClick={() => setOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                fontSize: 18,
                lineHeight: 1,
              }}
              aria-label="Close tweaks"
            >
              ×
            </button>
          </div>
          <div style={{ marginBottom: 18 }}>
            <span
              style={{
                fontSize: 11,
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
                display: 'block',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
              }}
            >
              Accent Color
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {HUES.map((h) => (
                <button
                  key={h.value}
                  onClick={() => set('accentHue', h.value)}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                    background: tweaks.accentHue === h.value ? `oklch(0.72 0.14 ${h.value})` : 'var(--surface2)',
                    color: tweaks.accentHue === h.value ? '#05060f' : 'var(--muted)',
                    border: `1px solid ${tweaks.accentHue === h.value ? `oklch(0.72 0.14 ${h.value})` : 'var(--border)'}`,
                    transition: 'all 0.2s',
                  }}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span
              style={{
                fontSize: 11,
                color: 'var(--muted)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: 8,
                display: 'block',
                fontFamily: 'var(--font-jetbrains-mono), monospace',
              }}
            >
              Background
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {BG_STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => set('bgStyle', s)}
                  style={{
                    flex: 1,
                    padding: '6px 4px',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    background: tweaks.bgStyle === s ? 'var(--accent)' : 'var(--surface2)',
                    color: tweaks.bgStyle === s ? '#05060f' : 'var(--muted)',
                    border: `1px solid ${tweaks.bgStyle === s ? 'var(--accent)' : 'var(--border)'}`,
                    transition: 'all 0.2s',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Page() {
  const active = useActiveSection(NAVS);
  useReveal();
  return (
    <div className="page-root">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <Nav active={active} />
      <Hero />
      <Skills />
      <ArthaNetwork />
      <Projects />
      <Blog />
      <Education />
      <Contact />
      <TweaksPanel />
    </div>
  );
}
