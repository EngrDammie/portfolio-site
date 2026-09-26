export interface ProjectItem {
  id: string;
  title: string;
  category: 'AI & Automation' | 'Full-Stack Web App' | 'Mobile App' | 'Business Website';
  summary: string;
  problem: string;
  solution: string;
  result: string;
  metric: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  // Interactive Preview Parameters
  previewType: 'iframe' | 'video' | 'interactive-mock';
  previewUrl?: string;
  videoUrl?: string;
}

export const SHOWCASE_PROJECTS: ProjectItem[] = [
  {
    id: 'omnidesk-portal',
    title: 'OmniDesk: Client Management & Payment Portal',
    category: 'Full-Stack Web App',
    summary: 'All-in-one client portal with role-based auth, dynamic invoicing, and seamless payment processing.',
    problem: 'A service agency was managing client communications across messy WhatsApp threads and unorganized bank transfer screenshots.',
    solution: 'Architected a centralized multi-tenant portal with integrated Paystack & Stripe checkout, role-based dashboards, and automated email receipts.',
    result: 'Streamlined invoice settlement turnaround from 4 days to under 15 minutes with zero manual payment reconciliation.',
    metric: '< 15 Min Settlement',
    techStack: ['Next.js', 'React', 'Paystack API', 'Tailwind CSS', 'PostgreSQL'],
    liveUrl: 'https://starium-app.dammieoptimus.workers.dev/',
    githubUrl: '#',
    featured: true,
    previewType: 'iframe',
    previewUrl: 'https://starium-app.dammieoptimus.workers.dev/'
  },
  {
    id: 'agentflow-ai',
    title: 'AgentFlow: Intelligent Document & Invoice Automation',
    category: 'AI & Automation',
    summary: 'Autonomous AI processing engine that extracts structured financial records from messy PDFs and receipts.',
    problem: 'Operations teams lose over 15 hours every week manually transcribing paper and PDF receipts into accounting sheets, resulting in frequent human errors.',
    solution: 'Engineered an end-to-end AI document processing pipeline using OpenAI Vision and structured JSON parsing with instant WhatsApp notification dispatch.',
    result: 'Reduced invoice processing time by 85% with 99.4% extraction accuracy across 1,000+ test records.',
    metric: '85% Time Saved',
    techStack: ['Next.js', 'TypeScript', 'OpenAI API', 'Tailwind CSS', 'Node.js'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    previewType: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=VL-xjzQFWsY'
  },
  {
    id: 'quickpulse-dispatch',
    title: 'QuickPulse: Local Logistics & Delivery Dispatcher',
    category: 'Mobile App',
    summary: 'Fast, offline-resilient mobile web application for tracking dispatch riders and capturing digital proof of delivery.',
    problem: 'Local couriers suffered from spotty cellular reception on the road, causing dropped delivery records and customer disputes.',
    solution: 'Built a lightweight, mobile-first app with offline local storage sync, live route directions, and digital signature capture.',
    result: 'Zero lost delivery confirmations over a 30-day trial period, running smoothly even on low-end smartphones.',
    metric: '100% Offline-Ready',
    techStack: ['React', 'Next.js PWA', 'Geolocation API', 'Tailwind CSS'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    previewType: 'interactive-mock',
  },
  {
    id: 'apex-marketing',
    title: 'Apex Growth: High-Converting SaaS Marketing Site',
    category: 'Business Website',
    summary: 'Ultra-fast landing page with interactive pricing calculators and sub-second load times.',
    problem: 'A fintech startup was suffering a 72% bounce rate due to a bloated 5-second website load time on mobile devices.',
    solution: 'Re-engineered the site using Next.js static pre-rendering, modern asset compression, and mobile-first micro-interactions.',
    result: 'Achieved a perfect 99/100 Google Lighthouse score and cut page load time down to 0.6 seconds.',
    metric: '0.6s Load Time',
    techStack: ['Next.js', 'Tailwind CSS', 'TypeScript', 'Vercel'],
    liveUrl: '#',
    githubUrl: '#',
    featured: false,
    previewType: 'interactive-mock',
  },
];