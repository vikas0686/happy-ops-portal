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
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Markdown | react-markdown + remark-gfm |
| Syntax highlighting | react-syntax-highlighter (One Dark) |
| HTTP | fetch (native) |

---

## Prerequisites

- Node.js 18+ or [Bun](https://bun.sh)
- `happy-ops-service` running (see its README for setup)

---

## Setup

```bash
git clone https://github.com/your-org/happy-ops-portal.git
cd happy-ops-portal
```

**Install dependencies:**
```bash
bun install
# or: npm install
```

**Point the UI at your backend:**

Open `src/api/AiApis.ts` and update the service URL:

```ts
const url = `http://localhost:8080/chat`;
```

Replace `localhost:8080` with wherever `happy-ops-service` is running.

**Start the dev server:**
```bash
bun dev
# or: npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Connecting to the Backend

The portal makes a single API call:

```
POST {SERVICE_URL}/chat
Body: { "message": "your question" }
Response: { "response": "agent reply" }
```

Make sure `happy-ops-service` is running and CORS is enabled (it is by default). If you're running both locally, no additional config is needed beyond matching the port.

---

## Project Structure

```
src/
├── pages/
│   └── Chat.tsx        # Main chat page — all UI logic lives here
├── api/
│   └── AiApis.ts       # Single function that calls POST /chat
├── types/
│   └── aiChatMessage.ts # Request/response types
├── components/ui/      # shadcn/ui component library
├── hooks/
│   └── use-mobile.tsx  # Responsive breakpoint hook
└── App.tsx             # Router setup (single route: /)
```

---

## Building for Production

```bash
bun run build
# Output in dist/
```

The build is a static site — deploy to any CDN (Vercel, Netlify, S3 + CloudFront, etc.). Make sure the production service URL is set correctly in `AiApis.ts` before building.

---

## Screenshot

> _Add a screenshot of the chat interface here_

---

## Contributing

1. Fork and create a feature branch
2. Keep UI changes focused — the current design is intentionally minimal
3. For new pages/features, follow the existing pattern: page in `src/pages/`, API calls in `src/api/`
4. Open a PR with a clear description

---

## License

MIT — see [LICENSE](LICENSE)
