export const profile = {
  name: 'Isuru De silva',
  role: 'Full-Stack Developer',
  tagline: 'I build resilient systems and crisp interfaces that scale with product growth.',
  shortBio:
    'I am a full-stack engineer focused on fast user experiences, reliable APIs, and maintainable architecture. I enjoy shipping practical products with clean developer workflows.',
  location: 'Sri Lanka',
  email: 'hello@isuru.dev',
  github: 'https://github.com/isuru',
  linkedin: 'https://linkedin.com/in/isuru',
  resumePath: '/resume.pdf',
}

export const skills = [
  {
    group: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Framer Motion'],
  },
  {
    group: 'Backend',
    items: ['Node.js', 'Express', 'Python', 'REST APIs', 'GraphQL'],
  },
  {
    group: 'Data & Infra',
    items: ['PostgreSQL', 'MongoDB', 'Docker', 'GitHub Actions', 'AWS'],
  },
]

export const projects = [
  {
    name: 'OpsBoard',
    summary:
      'Operational dashboard for logistics teams with real-time alerts and SLA tracking.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    github: 'https://github.com/isuru/opsboard',
    live: 'https://opsboard.example.com',
  },
  {
    name: 'StorePulse',
    summary:
      'E-commerce analytics platform with cohort insights and conversion monitoring.',
    stack: ['Next.js', 'Prisma', 'PostgreSQL', 'Redis'],
    github: 'https://github.com/isuru/storepulse',
    live: 'https://storepulse.example.com',
  },
  {
    name: 'RecruitFlow',
    summary:
      'Hiring workflow app for talent teams with pipeline automation and reporting.',
    stack: ['React', 'Express', 'MongoDB', 'Docker'],
    github: 'https://github.com/isuru/recruitflow',
    live: 'https://recruitflow.example.com',
  },
]

export const experience = [
  {
    period: '2024 - Present',
    role: 'Senior Full-Stack Engineer',
    company: 'Nexa Labs',
    highlights: [
      'Led migration from monolith to service-based architecture.',
      'Reduced p95 API latency by 41% through query and caching optimizations.',
    ],
  },
  {
    period: '2021 - 2024',
    role: 'Full-Stack Developer',
    company: 'CloudBridge',
    highlights: [
      'Built customer-facing dashboard used by 20k+ monthly users.',
      'Introduced CI pipelines that cut release time from 2 hours to 20 minutes.',
    ],
  },
]

export const testimonials = [
  {
    quote:
      'Isuru ships fast without sacrificing code quality. He sees both product needs and engineering constraints clearly.',
    author: 'Engineering Manager, Nexa Labs',
  },
  {
    quote:
      'One of the most dependable developers I have worked with. Reliable communication and strong ownership.',
    author: 'Product Lead, CloudBridge',
  },
]
