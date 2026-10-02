import { profile, skills, projects, experience, testimonials } from '../../data/siteData'

export const BANNER = [
  '██╗███████╗██╗   ██╗██████╗ ██╗   ██╗    ██████╗ ███████╗    ███████╗██╗██╗     ██╗   ██╗ █████╗ ',
  '██║██╔════╝██║   ██║██╔══██╗██║   ██║    ██╔══██╗██╔════╝    ██╔════╝██║██║     ██║   ██║██╔══██╗',
  '██║███████╗██║   ██║██████╔╝██║   ██║    ██║  ██║█████╗      ███████╗██║██║     ██║   ██║███████║',
  '██║╚════██║██║   ██║██╔══██╗██║   ██║    ██║  ██║██╔══╝      ╚════██║██║██║     ╚██╗ ██╔╝██╔══██║',
  '██║███████║╚██████╔╝██║  ██║╚██████╔╝    ██████╔╝███████╗    ███████║██║███████╗ ╚████╔╝ ██║  ██║',
  '╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝     ╚═════╝ ╚══════╝    ╚══════╝╚═╝╚══════╝  ╚═══╝  ╚═╝  ╚═╝',
].join('\n')

export const COMMANDS = [
  { name: 'help', description: 'list all commands' },
  { name: 'whoami', description: 'who am i' },
  { name: 'about', description: 'short bio' },
  { name: 'skills', description: 'tech stack' },
  { name: 'projects', description: 'things i have built' },
  { name: 'experience', description: 'work history' },
  { name: 'testimonials', description: 'what people say' },
  { name: 'contact', description: 'ways to reach me' },
  { name: 'social', description: 'github / linkedin' },
  { name: 'resume', description: 'download resume.pdf' },
  { name: 'games', description: 'dev playground (snake, memory)' },
  { name: 'banner', description: 'show the ascii banner' },
  { name: 'clear', description: 'clear the terminal' },
]

const C = {
  accent: 'text-terminal-accent',
  cyan: 'text-terminal-cyan',
  heading: 'text-terminal-heading',
  text: 'text-terminal-text',
  muted: 'text-terminal-muted',
}

const Link = ({ href, children, download = false }) => (
  <a
    href={href}
    {...(download ? { download } : { target: '_blank', rel: 'noreferrer' })}
    className={`${C.cyan} underline decoration-terminal-accent/40 underline-offset-2 transition hover:text-terminal-accent`}
  >
    {children}
  </a>
)

export function renderWelcome() {
  return (
    <div>
      <pre className={`${C.accent} leading-[1.05]`}>{BANNER}</pre>
      <p className={`${C.heading} mt-3`}>
        {profile.name} // {profile.role}
      </p>
      <p className={`${C.text} mt-1`}>{profile.tagline}</p>
      <p className={`${C.muted} mt-3`}>
        type <span className={C.accent}>help</span> to list commands — or click one in the
        panel on the right.
      </p>
    </div>
  )
}

function renderHelp() {
  return (
    <div className="space-y-1">
      <p className={C.heading}>available commands:</p>
      {COMMANDS.map((c) => (
        <div key={c.name} className="grid grid-cols-[8rem_1fr] gap-3">
          <span className={C.accent}>{c.name}</span>
          <span className={C.muted}>{c.description}</span>
        </div>
      ))}
    </div>
  )
}

function renderWhoami() {
  return (
    <div className="space-y-1">
      <div>
        <span className={C.cyan}>name</span> : {profile.name}
      </div>
      <div>
        <span className={C.cyan}>role</span> : {profile.role}
      </div>
      <div>
        <span className={C.cyan}>location</span> : {profile.location}
      </div>
      <div>
        <span className={C.cyan}>status</span> : available for collaboration
      </div>
    </div>
  )
}

function renderAbout() {
  return (
    <div className="space-y-1">
      <p className={`${C.text} max-w-xl`}>{profile.shortBio}</p>
      <div className={`${C.muted} mt-3`}>
        <div>&gt; location: {profile.location}</div>
        <div>&gt; role: {profile.role}</div>
        <div>&gt; focus: product engineering</div>
        <div>&gt; email: {profile.email}</div>
      </div>
    </div>
  )
}

function renderSkills() {
  return (
    <div className="space-y-4">
      {skills.map((group) => (
        <div key={group.group}>
          <p className={C.accent}>
            &gt; {group.group}
          </p>
          <p className={C.text}>[{group.items.join(', ')}]</p>
        </div>
      ))}
    </div>
  )
}

function renderProjects() {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.name}>
          <p className={C.heading}>
            {project.name} <span className={C.muted}>— {project.stack.join(', ')}</span>
          </p>
          <p className={C.text}>{project.summary}</p>
          <p className={C.muted}>
            <Link href={project.github}>source</Link>
            {'  ·  '}
            <Link href={project.live}>live</Link>
          </p>
        </div>
      ))}
    </div>
  )
}

function renderExperience() {
  return (
    <div className="space-y-4">
      {experience.map((item) => (
        <div key={`${item.company}-${item.period}`}>
          <p className={C.accent}>{item.period}</p>
          <p className={C.heading}>
            {item.role} <span className={C.muted}>@ {item.company}</span>
          </p>
          <ul className={`${C.text} list-disc pl-5`}>
            {item.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

function renderTestimonials() {
  return (
    <div className="space-y-4">
      {testimonials.map((item) => (
        <div key={item.author}>
          <p className={C.text}>"{item.quote}"</p>
          <p className={C.accent}>- {item.author}</p>
        </div>
      ))}
    </div>
  )
}

function renderContact() {
  return (
    <div className="space-y-1">
      <p className={C.heading}>let's build something.</p>
      <p className={C.text}>
        email: <Link href={`mailto:${profile.email}`}>{profile.email}</Link>
      </p>
      <p className={C.text}>
        resume: <Link href={profile.resumePath} download>resume.pdf</Link>
      </p>
      <p className={C.muted}>
        run <span className={C.accent}>social</span> for github / linkedin links.
      </p>
    </div>
  )
}

function renderSocial() {
  return (
    <div className="space-y-1">
      <div>
        <span className={C.cyan}>github</span> :{' '}
        <Link href={profile.github}>{profile.github}</Link>
      </div>
      <div>
        <span className={C.cyan}>linkedin</span> :{' '}
        <Link href={profile.linkedin}>{profile.linkedin}</Link>
      </div>
      <div>
        <span className={C.cyan}>email</span> :{' '}
        <Link href={`mailto:${profile.email}`}>{profile.email}</Link>
      </div>
    </div>
  )
}

function renderResume() {
  return (
    <p className={C.text}>
      downloading... or click here: <Link href={profile.resumePath} download>resume.pdf</Link>
    </p>
  )
}

function renderBanner() {
  return (
    <pre className={`${C.accent} leading-[1.05]`}>
      {BANNER}
      {`\n${profile.role.toUpperCase()}`}
    </pre>
  )
}

function renderLs() {
  const dirs = ['about/', 'skills/', 'projects/', 'experience/', 'testimonials/', 'contact/']
  return <p className={C.cyan}>{dirs.join('  ')}</p>
}

function renderDate() {
  return <p className={C.text}>{new Date().toString()}</p>
}

function renderSudo() {
  return <p className={C.accent}>permission denied: you already have root access here. 😉</p>
}

function renderUnknown(cmd) {
  return (
    <p className={C.text}>
      zsh: command not found: <span className={C.accent}>{cmd}</span>
      <span className={C.muted}> — type "help" for available commands.</span>
    </p>
  )
}

export function runCommand(input) {
  const trimmed = input.trim()
  const [rawCmd, ...args] = trimmed.split(/\s+/)
  const cmd = (rawCmd || '').toLowerCase()

  switch (cmd) {
    case 'help':
      return renderHelp()
    case 'whoami':
      return renderWhoami()
    case 'about':
      return renderAbout()
    case 'skills':
    case 'stack':
      return renderSkills()
    case 'projects':
      return renderProjects()
    case 'experience':
      return renderExperience()
    case 'testimonials':
      return renderTestimonials()
    case 'contact':
      return renderContact()
    case 'social':
      return renderSocial()
    case 'resume':
      return renderResume()
    case 'banner':
      return renderBanner()
    case 'ls':
      return renderLs()
    case 'date':
      return renderDate()
    case 'sudo':
      return renderSudo()
    case 'echo': {
      const text = args.join(' ')
      return <p className={C.text}>{text || ''}</p>
    }
    case 'clear':
      return null
    default:
      return renderUnknown(rawCmd)
  }
}
