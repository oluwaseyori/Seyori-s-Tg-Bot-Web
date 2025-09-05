export const runtime = 'nodejs'

type From = {
  id?: number
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  language_code?: string | null
} | null

function escapeHtml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function POST(req: Request) {
  try {
    const { name, email, message, from }: { name?: string; email?: string; message?: string; from?: From } = await req.json()

    const msg = (message || '').trim()
    if (msg.length < 5) {
      return new Response('Message too short', { status: 400 })
    }

    const BOT_TOKEN = process.env.BOT_TOKEN
    const OWNER_ID = process.env.OWNER_ID
    if (!BOT_TOKEN || !OWNER_ID) {
      return new Response('Server not configured: BOT_TOKEN and OWNER_ID are required', { status: 500 })
    }

    const hasFrom = !!from && typeof from === 'object'
    const first = (from?.first_name || '').trim()
    const last  = (from?.last_name || '').trim()
    const fullName = [first, last].filter(Boolean).join(' ') || ''
    const uname = (from?.username || '').trim()
    const id = from?.id

    let header: string
    if (hasFrom) {
      if (uname) {
        header = `New message from ${escapeHtml(fullName || '@' + uname)}`
      } else if (id) {
        const display = escapeHtml(fullName || 'this user')
        header = `New message from <a href="tg://user?id=${id}">${display}</a>`
      } else {
        header = `New message from ${escapeHtml(fullName || 'web user')}`
      }
    } else {
      header = 'New message from web user'
    }

    const usernameLine = uname ? `Username: @${escapeHtml(uname)}` : ''

    const idLine = typeof id === 'number' ? `User ID: ${id}` : ''

    const emailClean = (email || '').trim()
    const emailLine = emailClean && emailClean.toLowerCase() !== 'n/a'
      ? `Email: ${escapeHtml(emailClean)}`
      : ''

    const nameClean = (name || '').trim()
    const nameLine = nameClean ? `Name: ${escapeHtml(nameClean)}` : ''

    const text =
`${header}
${nameLine}${nameLine ? '\n' : ''}${usernameLine}${usernameLine ? '\n' : ''}${idLine}${idLine ? '\n' : ''}${emailLine}${emailLine ? '\n' : ''}
Message:
${escapeHtml(msg)}`

    const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: OWNER_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    })
    const data = await resp.json()
    if (!data.ok) {
      return new Response(JSON.stringify(data), { status: 502 })
    }

    return Response.json({ ok: true })
  } catch {
    return new Response('Bad Request', { status: 400 })
  }
}
