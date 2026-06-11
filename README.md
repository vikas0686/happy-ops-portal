# happy-ops-portal

> React chat UI for the happy-ops AI agent — ask questions about orders in plain English.

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)

---

## What is this?

A minimal, mobile-responsive chat interface that connects to [`happy-ops-service`](../happy-ops-service). You type a question in natural language ("show me recent orders from Vikas") and the AI agent on the backend figures out what to do and responds.

This is the frontend half of the happy-ops reference project — see `happy-ops-service` for the backend and agent architecture.

---

## Features

- **Rich markdown responses** — tables, lists, code blocks with syntax highlighting
- **Conversation persistence** — chat history survives page refresh (localStorage)
- **Typing indicator** — animated dots while the agent is thinking
- **Mobile responsive** — works on phone screens
- **Copy code button** — on any code block in the response

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5.5 |
| Styling | Tailwind CSS + shadcn/ui |
| Markdown | react-markdown + remark-gfm |
| Syntax highlighting | react-syntax-highlighter (One Dark) |
| HTTP | fetch (native) + axios |
| Auth | Keycloak (keycloak-js) |
| Data fetching | TanStack Query v5 |

---

## Prerequisites

- Node.js 18+
- `happy-ops-service` running (see its README for setup)

---

## Setup

```bash
git clone https://github.com/your-org/happy-ops-portal.git
cd happy-ops-portal
npm install
```

**Point the UI at your backend:**

Open `src/api/AiApis.ts` and update the service URL:

```ts
const url = `http://localhost:8080/chat`;
```

Replace with wherever `happy-ops-service` is running.

**Start the dev server:**
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Connecting to the Backend

The portal makes a single API call:

```
POST {SERVICE_URL}/chat
Body:     { "message": "your question" }
Response: { "response": "agent reply" }
```

Make sure `happy-ops-service` is running and CORS is enabled (it is by default).

---

## Project Structure

```
src/
├── pages/
│   └── Chat.tsx              # Main chat page — all UI logic lives here
├── api/
│   └── AiApis.ts             # POST /chat wrapper
├── types/
│   └── aiChatMessage.ts      # Request/response types
├── lib/
│   ├── formatters.ts         # Currency and date formatting utilities
│   └── utils.ts              # Tailwind class merging (cn)
├── hooks/
│   └── use-mobile.tsx        # Responsive breakpoint hook
├── components/ui/            # shadcn/ui component library
└── App.tsx                   # Router setup (single route: /)
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server (binds to all interfaces) |
| `npm run build` | Production build → `dist/` |
| `npm run build:dev` | Development build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

---

## Building for Production

```bash
npm run build
# Output in dist/
```

The build is a static site — deploy to any CDN (Vercel, Netlify, S3 + CloudFront, etc.). Make sure the production service URL is set correctly in `AiApis.ts` before building.

---

## Contributing

1. Fork and create a feature branch
2. Keep UI changes focused — the current design is intentionally minimal
3. For new pages/features, follow the existing pattern: page in `src/pages/`, API calls in `src/api/`
4. Open a PR with a clear description

---

## License

MIT — see [LICENSE](LICENSE)
