'use client'

import React, { useEffect, useMemo, useState } from 'react'

const CONFIG = {
  botName: "SEYORI'S TG BOT",
  botUsername: 'seyoritgbot',
  ownerUsername: 's3yori',               
  ownerEmail: 'havefun777444@gmail.com', 
  brandTagline: 'Seyoris Telegram Bot Web.'
}

type Scope = 'anywhere' | 'group-only' | 'dm-only'

interface CommandRow {
  cmd: string
  args?: string
  description: string
  scope: Scope
  role: 'any' | 'admin' | 'owner'
}

interface CommandBlock {
  plugin: string
  summary: string
  rows: CommandRow[]
}

const COMMANDS: CommandBlock[] = [
  {
    plugin: 'Core',
    summary: 'General commands anyone can use to discover the bot.',
    rows: [
      { cmd: '/start', description: 'Show welcome and quick menu.', args: '', scope: 'anywhere', role: 'any' },
      { cmd: '/menu', description: 'Open the main menu.', args: '', scope: 'anywhere', role: 'any' },
    ],
  },
  {
    plugin: 'Donate (Stars)',
    summary: 'Support the project with Telegram Stars (XTR).',
    rows: [
      { cmd: '/donate', args: '(stars)', description: 'Create a Stars invoice for the given amount.', scope: 'anywhere', role: 'any' },
      { cmd: '/balance', description: 'Show current Stars balance.', args: '', scope: 'anywhere', role: 'owner' },
      { cmd: '/gifts', description: 'List available gifts (live).', args: '', scope: 'anywhere', role: 'owner' },
      { cmd: '/buy', args: '(gift_id)', description: 'Buy a gift using Stars and send to OWNER_ID.', scope: 'anywhere', role: 'owner' },
    ],
  },
  {
    plugin: 'Games',
    summary: 'Party games with smart rules and stats.',
    rows: [
      { cmd: '/wcg', args: '', description: 'Word Chain with lobby, auto-start, and stats.', scope: 'anywhere', role: 'any' },
      { cmd: '/matchgame', args: '', description: 'Memory Match; starter-only plays.', scope: 'anywhere', role: 'any' },
      { cmd: '/xo', args: '', description: 'Tic-Tac-Toe.', scope: 'anywhere', role: 'any' },
      { cmd: '/redgreen', args: '', description: 'Red/Green Light game.', scope: 'anywhere', role: 'any' },
    ],
  },
  {
    plugin: 'Group Admin (gcadmin)',
    summary: 'Admin utilities for managing groups. Bot must be admin with proper rights.',
    rows: [
      { cmd: '/promote', args: '[@user] [Custom Title]', description: 'Promote a member (no add-admins).', scope: 'group-only', role: 'admin' },
      { cmd: '/demote', args: '[@user]', description: 'Remove admin rights.', scope: 'group-only', role: 'admin' },
      { cmd: '/ban', args: '[@user] [reason]', description: 'Ban a member.', scope: 'group-only', role: 'admin' },
      { cmd: '/unban', args: '[@user]', description: 'Unban a member.', scope: 'group-only', role: 'admin' },
      { cmd: '/mute', args: '[@user] [duration]', description: 'Mute a member.', scope: 'group-only', role: 'admin' },
      { cmd: '/unmute', args: '[@user]', description: 'Unmute a member.', scope: 'group-only', role: 'admin' },
      { cmd: '/kick', args: '[@user]', description: 'Remove a member.', scope: 'group-only', role: 'admin' },
      { cmd: '/delete', args: '(reply)', description: 'Delete the replied message.', scope: 'group-only', role: 'admin' },
      { cmd: '/deleteall', args: '(reply target)', description: 'Delete recent messages from the replied user.', scope: 'group-only', role: 'admin' },
      { cmd: '/lock', args: '<permission>', description: 'Lock permission (links, stickers, media).', scope: 'group-only', role: 'admin' },
      { cmd: '/unlock', args: '<permission>', description: 'Unlock permission.', scope: 'group-only', role: 'admin' },
      { cmd: '/gclink', args: '', description: 'Get group invite link.', scope: 'group-only', role: 'admin' },
      { cmd: '/ginfo', args: '', description: 'Group info snapshot.', scope: 'group-only', role: 'admin' },
      { cmd: '/tagadmins', args: '', description: 'Mention all admins.', scope: 'group-only', role: 'admin' },
      { cmd: '/tag', args: '<text|reply>', description: 'Mass mention with custom text.', scope: 'group-only', role: 'admin' },
      { cmd: '/antilink', args: 'on|off', description: 'Auto-delete external links.', scope: 'group-only', role: 'admin' },
      { cmd: '/welcome', args: 'on|off', description: 'Welcome messages.', scope: 'group-only', role: 'admin' },
      { cmd: '/goodbye', args: 'on|off', description: 'Goodbye messages.', scope: 'group-only', role: 'admin' },
    ],
  },
  {
    plugin: 'Media tools',
    summary: 'Convenience utilities for images and file hosting.',
    rows: [
      { cmd: '/image', args: '<query>', description: 'Public image search.', scope: 'anywhere', role: 'any' },
      { cmd: '/catbox', args: '<file|reply>', description: 'Owner-only Catbox upload.', scope: 'anywhere', role: 'owner' },
    ],
  },
  {
    plugin: 'Planned / Coming soon',
    summary: 'Upcoming features on the roadmap.',
    rows: [
      { cmd: '/premium', args: 'add|del|list <user_id>', description: 'Owner-only premium IDs manager.', scope: 'anywhere', role: 'owner' },
      { cmd: '/userinfo', args: '[@user]', description: 'Fetch public info for a user (privacy-safe).', scope: 'anywhere', role: 'any' },
    ],
  },
]

const FEATURES = [
  { title: 'Stars-ready donations', desc: 'Telegram Stars (XTR) invoicing with gifts lookup and owner balance tools.' },
  { title: 'Powerful group admin', desc: 'Promote, ban, mute, anti-link, welcome messages, and more.' },
  { title: 'Party games', desc: 'Word Chain, Tic-Tac-Toe, Red/Green Light, Memory Match with stats.' },
  { title: 'Plugin architecture', desc: 'Telethon plugin system with hot reload and access control.' },
  { title: 'Fast onboarding', desc: 'Slash-only commands, smart menus, and .env configuration.' },
  { title: 'Privacy-first', desc: 'Stores only what is required for features and logs.' },
]

function classNames(...xs: (string | false | null | undefined)[]) { return xs.filter(Boolean).join(' ') }

function AnchorBtn({ href, children, outline = false, newTab = true }: { href: string; children: React.ReactNode; outline?: boolean; newTab?: boolean }) {
  return (
    <a
      href={href}
      {...(newTab ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      className={classNames(
        'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition',
        outline ? 'border border-green-500 text-green-400 hover:bg-green-900/10' : 'bg-green-500 text-black hover:bg-green-400'
      )}
      style={{ boxShadow: '0 0 18px rgba(57,255,20,0.25)' }}
    >
      {children}
    </a>
  )
}

export default function Page() {
  const [query, setQuery] = useState('')
  const [pluginFilter, setPluginFilter] = useState<string>('All')
  const [roleFilter, setRoleFilter] = useState<'All' | 'any' | 'admin' | 'owner'>('All')
  const [scopeFilter, setScopeFilter] = useState<'All' | Scope>('All')

  useEffect(() => {
    const tg = (window as any)?.Telegram?.WebApp
    if (!tg) return
    tg.ready()
    tg.expand()
    tg.setBackgroundColor('#000000')
    tg.setHeaderColor('#000000')
  }, [])

  const flatCommands = useMemo(() => {
    const rows = COMMANDS.flatMap(block => block.rows.map(r => ({ ...r, plugin: block.plugin } as CommandRow & { plugin: string })))
    return rows
  }, [])

  const filtered = useMemo(() => {
    return flatCommands.filter(row => {
      const matchesText = [row.cmd, row.args ?? '', row.description, (row as any).plugin].join(' ').toLowerCase().includes(query.toLowerCase())
      const pluginOk = pluginFilter === 'All' || (row as any).plugin === pluginFilter
      const roleOk = roleFilter === 'All' || row.role === roleFilter
      const scopeOk = scopeFilter === 'All' || row.scope === scopeFilter
      return matchesText && pluginOk && roleOk && scopeOk
    })
  }, [flatCommands, query, pluginFilter, roleFilter, scopeFilter])

  const plugins = ['All', ...COMMANDS.map(b => b.plugin)]

  return (
    <main className="min-h-screen bg-black text-green-400">
      {/* Header */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border border-green-600" style={{ boxShadow: '0 0 16px rgba(57,255,20,0.35)', background: 'radial-gradient(40% 40% at 50% 50%, rgba(57,255,20,0.3), rgba(0,0,0,0))' }} />
          <div>
            <div className="text-xs uppercase tracking-wider text-green-500">{CONFIG.botUsername}</div>
            <div className="text-base font-semibold text-green-300">{CONFIG.botName}</div>
          </div>
        </div>
        <nav className="hidden gap-3 md:flex">
          <a href="#features" className="rounded-xl px-3 py-2 text-sm text-green-300 hover:bg-green-900/10">Features</a>
          <a href="#commands" className="rounded-xl px-3 py-2 text-sm text-green-300 hover:bg-green-900/10">Commands</a>
          <a href="#contact" className="rounded-xl px-3 py-2 text-sm text-green-300 hover:bg-green-900/10">Contact</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-green-300 sm:text-4xl">{CONFIG.botName}</h1>
            <p className="mt-3 text-sm text-green-500">{CONFIG.brandTagline}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <AnchorBtn href={`https://t.me/${CONFIG.botUsername}?startgroup=true`}>Add to Group</AnchorBtn>
              <AnchorBtn href={`https://t.me/${CONFIG.botUsername}`} outline>Open Bot</AnchorBtn>
              <AnchorBtn href={`https://t.me/${CONFIG.ownerUsername}`} outline>Contact Owner</AnchorBtn>
            </div>
            <div className="mt-4 text-xs text-green-600">Tip: make the bot an admin after adding it to a group to unlock admin features.</div>
          </div>
          <div className="rounded-3xl border border-green-900 bg-black p-6" style={{ boxShadow: '0 0 22px rgba(57,255,20,0.12)' }}>
            <div className="grid grid-cols-2 gap-3">
              {FEATURES.slice(0,4).map((f, i) => (
                <div key={i} className="rounded-2xl border border-green-900 p-4" style={{ boxShadow: '0 0 14px rgba(57,255,20,0.08)' }}>
                  <div className="text-sm font-semibold text-green-300">{f.title}</div>
                  <div className="mt-1 text-xs text-green-500">{f.desc}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-2xl border border-green-900 p-4 text-xs text-green-500" style={{ boxShadow: '0 0 14px rgba(57,255,20,0.08)' }}>Hot-reloadable plugins. Clean codebase. Access control with require_access roles.</div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-8">
        <h2 className="text-xl font-semibold text-green-300">Features</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={i} className="rounded-3xl border border-green-900 bg-black p-6" style={{ boxShadow: '0 0 20px rgba(57,255,20,0.10)' }}>
              <div className="text-base font-semibold text-green-300">{f.title}</div>
              <div className="mt-2 text-sm text-green-500">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Commands */}
      <section id="commands" className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-green-300">Commands</h2>
            <p className="mt-1 text-sm text-green-600">
              Slash-only, organized by plugin. Use filters to explore.
            </p>
          </div>

          {/* Always-visible filters; stack on mobile */}
          <div className="grid w-full grid-cols-1 gap-2 sm:w-auto sm:grid-cols-3">
            <select
              value={pluginFilter}
              onChange={e => setPluginFilter(e.target.value)}
              className="rounded-xl border border-green-800 bg-black px-3 py-2 text-sm text-green-300 focus:outline-none"
            >
              {plugins.map(p => (
                <option key={p} value={p} className="bg-black text-green-300">
                  {p}
                </option>
              ))}
            </select>

            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as any)}
              className="rounded-xl border border-green-800 bg-black px-3 py-2 text-sm text-green-300 focus:outline-none"
            >
              {['All','any','admin','owner'].map(p => (
                <option key={p} value={p} className="bg-black text-green-300">
                  {p}
                </option>
              ))}
            </select>

            <select
              value={scopeFilter}
              onChange={e => setScopeFilter(e.target.value as any)}
              className="rounded-xl border border-green-800 bg-black px-3 py-2 text-sm text-green-300 focus:outline-none"
            >
              {['All','anywhere','group-only','dm-only'].map(p => (
                <option key={p} value={p} className="bg-black text-green-300">
                  {p}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4">
          <input
            placeholder="Search commands…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full rounded-2xl border border-green-800 bg-black px-4 py-2 text-sm text-green-300 placeholder-green-700 focus:outline-none"
          />
        </div>

        {/* H-scroll table for narrow screens */}
        <div className="mt-6 overflow-x-auto rounded-3xl border border-green-900 bg-black shadow-sm" style={{ boxShadow: '0 0 24px rgba(57,255,20,0.10)' }}>
          <table className="min-w-[900px] text-left text-sm">
            <thead className="bg-[#0b0f0b] text-green-300">
              <tr>
                <th className="px-4 py-3 border-b border-green-900">Plugin</th>
                <th className="px-4 py-3 border-b border-green-900">Command</th>
                <th className="px-4 py-3 border-b border-green-900">Args</th>
                <th className="px-4 py-3 border-b border-green-900">Description</th>
                <th className="px-4 py-3 border-b border-green-900">Role</th>
                <th className="px-4 py-3 border-b border-green-900">Scope</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {filtered.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-black' : 'bg-[#0a0f0a]'}>
                  <td className="px-4 py-3 text-green-400 border-b border-green-900">{(row as any).plugin}</td>
                  <td className="px-4 py-3 text-green-300 border-b border-green-900">{row.cmd}</td>
                  <td className="px-4 py-3 text-green-500 border-b border-green-900">{row.args || '-'}</td>
                  <td className="px-4 py-3 text-green-400 border-b border-green-900">{row.description}</td>
                  <td className="px-4 py-3 border-b border-green-900">
                    <span className={'rounded-lg px-2 py-1 text-xs font-medium ' + (row.role==='owner'?'bg-green-500 text-black': row.role==='admin'?'bg-green-800 text-green-100':'bg-green-900/40 text-green-300')}>
                      {row.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-green-500 border-b border-green-900">{row.scope}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-green-900 bg-black p-6" style={{ boxShadow: '0 0 20px rgba(57,255,20,0.10)' }}>
            <h3 className="text-lg font-semibold text-green-300">Got an idea or suggestion?</h3>
            <p className="mt-1 text-sm text-green-600">Send feature requests, bug reports, or partnership ideas.</p>
            <IdeaForm />
          </div>
          <div className="rounded-3xl border border-green-900 bg-black p-6" style={{ boxShadow: '0 0 20px rgba(57,255,20,0.10)' }}>
            <h3 className="text-lg font-semibold text-green-300">Direct contact</h3>
            <p className="mt-2 text-sm text-green-600">Prefer direct chat? Reach out via Telegram or email.</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <AnchorBtn href={`https://t.me/${CONFIG.ownerUsername}`}>Message on Telegram</AnchorBtn>
              {CONFIG.ownerEmail && (
                <AnchorBtn href={`mailto:${CONFIG.ownerEmail}`} outline>Send Email</AnchorBtn>
              )}
            </div>
            <p className="mt-6 text-xs text-green-700">Include screenshots and exact error logs for technical issues.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 pb-10">
        <div className="rounded-3xl border border-green-900 bg-black p-6 text-sm text-green-500 shadow-sm" style={{ boxShadow: '0 0 20px rgba(57,255,20,0.08)' }}>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="font-semibold text-green-300">{CONFIG.botName}</div>
              <div className="text-xs text-green-600">Built with Telethon plugins, SQLite data, and clean slash commands.</div>
            </div>
            <div className="flex gap-3">
              <a href={`https://t.me/${CONFIG.botUsername}?startgroup=true`} className="text-sm underline text-green-400" target="_blank" rel="noreferrer noopener">Add to Group</a>
              <a href={`https://t.me/${CONFIG.botUsername}`} className="text-sm underline text-green-400" target="_blank" rel="noreferrer noopener">Open Bot</a>
              <a href={`https://t.me/${CONFIG.ownerUsername}`} className="text-sm underline text-green-400" target="_blank" rel="noreferrer noopener">Contact Owner</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ---- IdeaForm (Telegram share sheet; robust Android/WebView support) ---- */
function IdeaForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const buildText = () =>
    `Name: ${name || 'Anonymous'}\nEmail: ${email || 'n/a'}\n\nMessage:\n${message || '(no message)'}`
  
  const sendViaTelegram = () => {
    const tg = (window as any)?.Telegram?.WebApp
    const text = buildText()

    const shareLink = `https://t.me/share/url?text=${encodeURIComponent(text)}`

    try {
      tg?.HapticFeedback?.impactOccurred?.('medium')

      if (tg?.openTelegramLink) {
        tg.openTelegramLink(shareLink)
        return
      }
    } catch (_) {}

    try {
      window.location.href = shareLink
    } catch (_) {
      navigator.clipboard?.writeText(text).catch(() => {})
      alert('Your message was copied. Please open Telegram and paste it into the chat.')
    }
  }

  return (
    <form onSubmit={(e) => e.preventDefault()} className="mt-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your name"
          className="rounded-2xl border border-green-800 bg-black px-4 py-2 text-sm text-green-300 placeholder-green-700 focus:outline-none"
        />
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Your email (optional)"
          type="email"
          className="rounded-2xl border border-green-800 bg-black px-4 py-2 text-sm text-green-300 placeholder-green-700 focus:outline-none"
        />
      </div>
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Describe your idea or suggestion in detail…"
        rows={5}
        className="w-full rounded-2xl border border-green-800 bg-black px-4 py-2 text-sm text-green-300 placeholder-green-700 focus:outline-none"
      />
      <div className="flex flex-wrap gap-3">
        <button
          onClick={sendViaTelegram}
          type="button"
          className="inline-flex items-center justify-center rounded-2xl bg-green-500 px-4 py-2 text-sm font-semibold text-black hover:bg-green-400 active:scale-[.99]"
          style={{ boxShadow: '0 0 18px rgba(57,255,20,0.25)' }}
        >
          Send via Telegram
        </button>
      </div>
      <p className="text-xs text-green-700">
        This opens Telegram’s share panel with your message prefilled. Pick the owner chat to send it.
      </p>
    </form>
  )
}
