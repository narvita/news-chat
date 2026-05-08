# News Chat

An AI-powered news assistant that answers questions about current events. Ask anything — the assistant searches live news, summarizes findings, and surfaces relevant articles in a clean chat interface.

## Features

- Conversational chat with a news-aware AI assistant
- Live news search via [NewsData.io](https://newsdata.io)
- Streaming responses with real-time tool status updates
- Article cards with source, image, and direct links
- Prompt suggestions to get started quickly

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| LLM | OpenRouter — `openai/gpt-4o-mini` |
| News API | NewsData.io |

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenRouter](https://openrouter.ai) API key
- A [NewsData.io](https://newsdata.io) API key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```env
OPENROUTER_API_KEY=your_openrouter_key_here
NEWSDATA_API_KEY=your_newsdata_key_here
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


## Deployment

### Netlify

**Via GitHub (recommended)**

1. Push the repository to GitHub
2. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**
3. Connect your GitHub repo
4. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables under **Site settings → Environment variables**:
   - `OPENROUTER_API_KEY`
   - `NEWSDATA_API_KEY`
6. Click **Deploy site**

Netlify auto-detects Next.js and installs the Essential Next.js plugin — no extra config needed.


## Project Structure

app/
├── api/chat/route.ts          # Streaming POST endpoint — orchestrates LLM + tool calls
├── components/
│   ├── chat/
│   │   ├── Chat.tsx           # Root chat component — layout and message list
│   │   ├── Assistant.tsx      # Renders assistant messages, articles, and sources
│   │   └── PromptsBox.tsx     # Starter prompt suggestions
│   ├── news/
│   │   └── ArticleGrid.tsx    # Article card grid displayed after a news search
│   ├── input.tsx              # Textarea input with submit handling
│   ├── SourceBadge.tsx        # Inline source link pill
│   └── Spinner.tsx            # Loading indicator
├── hooks/
│   └── chatHook.ts            # Chat state — sends messages, parses SSE stream
├── lib/
│   ├── openRouter.ts          # OpenRouter API client
│   ├── news.ts                # NewsData.io search — returns normalized Article[]
│   ├── llm/
│   │   ├── systemPrompt.ts    # System instructions for the assistant
│   │   └── tools.ts           # Tool schema for `search_news`
│   └── constants/
│       └── prompts.ts         # Pool of starter prompts
├── services/
│   └── chatService.ts         # SSE emit helpers and tool/plain response handlers
├── types/
│   └── chat.ts                # Shared TypeScript interfaces
└── utils/
    ├── constants.ts           # Regex patterns for response parsing
    └──
randomPrompts.ts       # Picks random prompts from the pool

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
