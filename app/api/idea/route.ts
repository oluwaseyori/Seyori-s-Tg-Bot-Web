// app/api/idea/route.ts
export const runtime = 'nodejs' // ensure Node fetch with env available

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json()

    const BOT_TOKEN = process.env.BOT_TOKEN
    const OWNER_ID = process.env.OWNER_ID
    if (!BOT_TOKEN || !OWNER_ID) {
      return new Response('Server not configured: BOT_TOKEN and OWNER_ID are required', { status: 500 })
    }

    const text =
      `📥 New WebApp submission\n` +
      `Name: ${name || 'Anonymous'}\n` +
      `Email: ${email || 'n/a'}\n\n` +
      `Message:\n${message || '(no message)'}`
    
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
  } catch (err) {
    return new Response('Bad Request', { status: 400 })
  }
}
