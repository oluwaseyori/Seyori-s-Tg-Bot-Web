# SEYORI'S TG BOT — Web App

Neon-green hacker themed web hub for SEYORI'S TG BOT. Built with Next.js (app router) + Tailwind.

## Quick start
```bash
pnpm i   # or npm i / yarn
pnpm dev # http://localhost:3000
```

## Deploy to Vercel
1. Push this folder to a GitHub repo.
2. Import the repo in Vercel and deploy (no extra config needed).
3. Copy the deployed HTTPS URL (e.g. https://seyoris-bot.vercel.app).

## Wire it to Telegram
- In BotFather → *Configure Mini App* set the App URL to your deployed link.
- (Optional) `/setmenubutton` → set the same URL so the chat menu opens the app.
- Use the inline button or deep link: `https://t.me/<your_bot>?startapp=home`.

## Customize
- Edit text and links in `app/page.tsx` under the `CONFIG` object.
- Tailwind styles live in `app/globals.css` and classnames throughout the page.
