# WebSeoSage

WebSeoSage is a full‑stack SEO analysis platform. It combines an Express API with a React frontend to deliver comprehensive reports about a website's technical health, content quality, performance metrics and user experience. The application also tracks backlinks, keywords, search rankings and competitors.

## Features
- **Comprehensive SEO scans** with Puppeteer and Cheerio
- **Backlink and keyword tracking** with historical score storage
- **Real‑time SERP monitoring** with simulated rankings and competitor gap analysis
- **User authentication** via Replit OpenID Connect
- **Interactive dashboard** built with React, Radix UI and Tailwind CSS

## Requirements
- Node.js 20+
- PostgreSQL database

Set the following environment variables:
- `DATABASE_URL` – PostgreSQL connection string
- `SESSION_SECRET` – session cookie secret
- `REPLIT_DOMAINS` and `REPL_ID` – Replit authentication configuration
- Optional: `ISSUER_URL` to override the default OpenID issuer

## Development
Install dependencies and run the dev server:
```bash
npm install
npm run dev
```
The backend runs on port 5000 and serves the React client via Vite middleware.

## Production build
```bash
npm run build
npm run start
```
The client is built to `dist/public` and the server bundle is placed in `dist/`.

## Project structure
- `client/` – React frontend
- `server/` – Express API and web scraping logic
- `shared/` – Drizzle ORM schema and shared TypeScript types

## How it works
1. Users submit a URL from the dashboard.
2. The Express server launches a headless browser and performs multiple technical and content checks.
3. Results are stored in PostgreSQL and returned to the client.
4. React components render scores, issues and recommendations.

For a detailed changelog and architecture notes see [`replit.md`](replit.md).

