# talk_to_me — AI English Practice Bot

> Practice English through job interviews, debates, group discussions and casual conversation. Get AI-powered grammar, vocabulary and fluency feedback after every session.

---

## 🚀 Quick Start

### 1. Set up environment variables

**Backend** — copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

```env
GROQ_API_KEY=gsk_your_groq_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Frontend** — (optional, Vite proxy handles dev):
```bash
cd frontend
cp .env.example .env
```

### 2. Set up Supabase Database

1. Go to your [Supabase project](https://app.supabase.com)
2. Open **SQL Editor**
3. Paste and run the contents of `db/schema.sql`

### 3. Start the backend
```bash
# From Talk_to_Me/
npm run dev
# → API running at http://localhost:3001
```

### 4. Start the frontend
```bash
cd frontend
npm run dev
# → App running at http://localhost:5173
```

---

## 🧠 How It Works

1. **Choose a mode**: Interview / Debate / Group Discussion / Casual
2. **Pick a topic** from suggestions or type your own
3. **Chat**: Type replies or use the 🎤 mic (Chrome/Edge only)
4. **End session**: Type "end session" or click the button
5. **Get feedback**: Grammar corrections, vocab upgrades, fluency score, tips

---

## 📁 Project Structure

```
Talk_to_Me/
├── index.js              ← Express server
├── package.json
├── .env.example
├── db/
│   ├── supabase.js       ← Supabase client
│   └── schema.sql        ← PostgreSQL schema (run in Supabase)
├── services/
│   ├── groq.js           ← Groq AI wrapper + system prompt
│   ├── sessionService.js ← Supabase CRUD
│   └── feedbackService.js← Feedback JSON parser
├── routes/
│   ├── session.js        ← /session/start, /message, /end
│   ├── topics.js         ← /topics
│   └── history.js        ← /history
├── middleware/
│   └── errorHandler.js
└── frontend/
    ├── src/
    │   ├── pages/        ← Home, Session, History
    │   ├── components/   ← ChatWindow, ModeSelector, VoiceButton, FeedbackReport, TopicPicker
    │   ├── store/        ← Zustand session store
    │   └── api/          ← Axios client
    └── tailwind.config.js
```

---

## 🔑 Get API Keys

| Service | URL | Free Tier |
|---------|-----|-----------|
| Groq | https://console.groq.com | ✅ Yes (generous) |
| Supabase | https://app.supabase.com | ✅ Yes (2 free projects) |

---

## 🎙️ Voice Input

Voice input uses the browser's built-in **Web Speech API**.
- ✅ Works in **Chrome** and **Edge**
- ❌ Not supported in Firefox or Safari

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/session/start` | Start a new session |
| `POST` | `/session/message` | Send a message |
| `POST` | `/session/end` | End session & get feedback |
| `GET` | `/session/:id/feedback` | Get saved feedback |
| `GET` | `/topics` | Get suggested topics |
| `GET` | `/history` | Get session history |
