export const projects = [
  {
    num: '01',
    name: 'Into The Prompt',
    type: 'AI Platform',
    desc: 'AI learning platform with an immersive world-map course navigation UI and car dashboard-themed learning interface. Built progress tracking, streaks, quiz scores, waitlist system with GSAP animations, WordPress lead capture, batched email campaigns, and a full admin dashboard.',
    techs: ['React.js', 'GSAP', 'Lenis Scroll', 'WordPress', 'SMTP'],
    url: 'https://intotheprompt.com',
  },
  {
    num: '02',
    name: 'MotionLANG',
    type: 'SaaS / Dev Tool',
    desc: 'Motion extraction engine that reverse-engineers animations from live websites. Headless browser pipeline capturing DOM states during animation frames, normalising output across GSAP, Framer Motion and CSS Keyframes into a Universal Motion Format. Multi-agent AI orchestration via NVIDIA NIM with WCAG 2.1 audit and a Figma plugin bridge.',
    techs: ['NVIDIA NIM', 'GSAP', 'Framer Motion', 'Headless Browser', 'Figma API'],
    url: 'https://vocaine.com',
  },
  {
    num: '03',
    name: 'DocMIND',
    type: 'RAG Application',
    desc: 'Document intelligence app — users upload PDFs and chat with them. Full RAG pipeline including PDF parsing, chunk embedding, vector storage in ChromaDB, and answer generation via NVIDIA NIM. FastAPI backend with React and Tailwind frontend.',
    techs: ['LangChain', 'ChromaDB', 'NVIDIA NIM', 'FastAPI', 'React', 'Tailwind'],
    url: null,
  },
  {
    num: '04',
    name: 'SolTrim International',
    type: 'WordPress',
    desc: "Full corporate website for Asia's first CarbonNeutral® label manufacturer. Multi-page product showcase, media gallery, news section, and an interactive Label Mockup Designer tool built from scratch.",
    techs: ['WordPress', 'Custom Plugins', 'JavaScript', 'SCSS'],
    url: null,
  },
]

export const experience = [
  {
    period: 'Nov 2025 — Present',
    company: 'INSK Group',
    location: 'Colombo, Sri Lanka',
    role: 'Senior Frontend Developer',
    points: [
      'Building and maintaining scalable web applications using React.js, Vue.js, Next.js, TypeScript, Tailwind CSS and CSS-in-JS',
      'Led frontend-focused SEO including SSR/SSG with Next.js, Core Web Vitals and structured data',
      'Applied performance optimisation: lazy loading, code splitting, image optimisation, critical CSS',
      'Implemented custom WordPress themes, plugins and third-party integrations',
    ],
  },
  {
    period: 'Jul 2025 — Present',
    company: 'Self Employed',
    location: 'Remote',
    role: 'Freelance Frontend Developer & AI Engineer',
    points: [
      'Independently built and delivered production-grade projects spanning frontend engineering, AI integration and full product development',
      'Into The Prompt — AI learning platform; MotionLANG — developer SaaS; DocMIND — RAG application; SolTrim — corporate WordPress site',
    ],
  },
  {
    period: 'Apr 2023 — Sep 2025',
    company: 'Appspotr AB',
    location: 'Sri Lanka & Sweden',
    role: 'Senior Low Code App Developer',
    points: [
      "Engineered custom logic layers handling workflows beyond the platform's native engine",
      'Integrated Twilio and Slack APIs alongside CRM and ERP systems for real-time data flows',
      'Built multi-step approval flows, complex conditional logic, and cross-system sync pipelines',
      'Mentored developers, led technical discussions and made key architectural decisions',
    ],
  },
  {
    period: 'Mar 2022 — Apr 2023',
    company: 'Appspotr AB',
    location: 'Colombo, Sri Lanka',
    role: 'Low Code App Developer',
    points: [
      'Developed and deployed scalable applications integrating third-party services including CRMs and messaging APIs',
      'Implemented RESTful API integrations and webhook-based connections for real-time data exchange',
      'Identified and resolved early-stage performance issues',
    ],
  },
  {
    period: 'Sep 2019 — Apr 2022',
    company: 'i-Context Pvt Ltd',
    location: 'Colombo, Sri Lanka',
    role: 'Associate Software Engineer — UI/UX',
    points: [
      'Grew from designer to someone who could take a design all the way through to working frontend code',
      'Researched and tested user behaviour to improve UX on exam and quiz modules in an LMS',
      'Translated Figma and Adobe XD designs into clean frontend code across web apps, LMS platforms and internal tools',
    ],
  },
]

export const skills = [
  {
    category: 'Frontend',
    items: ['React.js', 'Next.js', 'Vue.js', 'TypeScript', 'JavaScript', 'Tailwind', 'SCSS', 'CSS-in-JS'],
  },
  {
    category: 'Animation',
    items: ['GSAP', 'Framer Motion', 'Lenis Scroll', 'Vite', 'Webpack'],
  },
  {
    category: 'AI & Backend',
    items: ['LangChain', 'RAG Pipelines', 'NVIDIA NIM', 'FastAPI', 'ChromaDB', 'Python'],
  },
  {
    category: 'Design & Tools',
    items: ['Figma', 'Adobe XD', 'Sketch', 'WordPress', 'WCAG 2.1', 'Git / CI/CD'],
  },
  {
    category: 'Integrations',
    items: ['Twilio API', 'Slack API', 'CRM/ERP', 'RESTful APIs', 'Webhooks'],
  },
  {
    category: 'Testing',
    items: ['Jest', 'React Testing Library', 'Cypress'],
  },
]
