import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { runCommand, renderWelcome } from './commands'

const PROMPT = 'isuru@portfolio:~$'

const Terminal = forwardRef(function Terminal(_props, ref) {
  const [lines, setLines] = useState([])
  const [value, setValue] = useState('')
  const inputRef = useRef(null)
  const scrollRef = useRef(null)
  const idRef = useRef(0)
  const historyRef = useRef([])
  const histIndexRef = useRef(-1)

  const nextId = () => {
    idRef.current += 1
    return idRef.current
  }

  const execute = useCallback((raw) => {
    const command = raw.trim()

    if (command.toLowerCase() === 'clear') {
      setLines([])
      return
    }

    if (!command) return

    const next = [{ id: nextId(), kind: 'input', text: command }]
    const content = runCommand(command)
    if (content) {
      next.push({ id: nextId(), kind: 'output', content })
    }
    setLines(next)
  }, [])

  useImperativeHandle(
    ref,
    () => ({
      run: (command) => {
        setValue('')
        execute(command)
        inputRef.current?.focus()
      },
      focus: () => inputRef.current?.focus(),
    }),
    [execute],
  )

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const onSubmit = (e) => {
    e.preventDefault()
    const raw = value
    if (raw.trim()) {
      historyRef.current.push(raw)
    }
    histIndexRef.current = historyRef.current.length
    setValue('')
    execute(raw)
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (histIndexRef.current > 0) {
        histIndexRef.current -= 1
        setValue(historyRef.current[histIndexRef.current])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (histIndexRef.current < historyRef.current.length - 1) {
        histIndexRef.current += 1
        setValue(historyRef.current[histIndexRef.current])
      } else {
        histIndexRef.current = historyRef.current.length
        setValue('')
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className="flex h-full min-h-0 flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex items-center justify-between border-b border-terminal-border/80 bg-terminal-panel/60 px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-lime-400"></span>
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-terminal-muted">
          terminal://isuru — zsh
        </p>
      </div>

      <div
        ref={scrollRef}
        className="terminal-scroll flex-1 overflow-y-auto px-4 py-4 font-display text-sm leading-relaxed md:px-6"
      >
        <div className="mb-5 border-b border-terminal-border/50 pb-4">
          {renderWelcome()}
        </div>

        <div className="space-y-1.5">
          {lines.map((line) =>
            line.kind === 'input' ? (
              <div key={line.id} className="flex gap-2">
                <span className="shrink-0 text-terminal-accent">{PROMPT}</span>
                <span className="text-terminal-heading">{line.text}</span>
              </div>
            ) : (
              <div key={line.id} className="whitespace-pre-wrap break-words">
                {line.content}
              </div>
            ),
          )}
        </div>

        <form onSubmit={onSubmit} className="mt-2 flex items-center gap-2">
          <span className="shrink-0 text-terminal-accent">{PROMPT}</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            autoFocus
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck="false"
            aria-label="terminal input"
            className="w-full flex-1 bg-transparent font-display text-terminal-heading caret-terminal-accent outline-none"
          />
        </form>
      </div>
    </div>
  )
})

export default Terminal
