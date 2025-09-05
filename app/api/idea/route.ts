export const runtime = 'nodejs'

type From = {
  id?: number
  username?: string | null
  first_name?: string | null
  last_name?: string | null
  language_code?: string | null
} | null

export async function POST(req: Request) {
  try {
    const { name, email, message, from }: { name?: string; email?: string; message?: string; from?: From } = await req.json()

    if (!message || String(message).trim().length < 5) {
      return new Response('Message too short', { status: 400 })
    }

    const BOT_TOKEN = process.env.BOT_TOKEN
    const OWNER_ID = process.env.OWNER_ID
    if (!BOT_TOKEN || !OWNER_ID) {
      return new Response('Server not configured: BOT_TOKEN and OWNER_ID are required', { status: 500 })
    }

    const who =
      from
        ? (from.username ? `@${from.username}` : [from.first_name, from.last_name].filter(Boolean).join(' ') || `id ${from.id}`)
        : 'web user'

    const header = `New WebApp message from ${who}${from?.id ? ` (id ${from.id})` : ''}`
    const text =
`${header}
Name: ${name || 'Anonymous'}
Email: ${email || 'n/a'}

Message:
${message}`

    const resp = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: OWNER_ID, text }),
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
