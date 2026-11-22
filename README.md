# AI Teacher — Complete Standalone Web & Android Application

**AI Teacher** is a full-stack interactive voice, vision, and digital blackboard educational application built with **React 19, TypeScript, Tailwind CSS v4, Vite, Express.js, WebSockets (`ws`), and Google Gemini Live (`gemini-3.8-live`)**.

It includes real-time voice tutoring, live camera/copy handwriting checking, an interactive Digital Blackboard, a Drawing & Color-Fill Studio, a complete 30-Para / 114-Surah Quran Player, a Zero-Key Song/Music Player, and a role-protected **Chand Admin Dashboard**.

---

## 1. Complete Folder & File Structure

```text
ai-teacher/
├── .env.example                 # Environment variables template (copy to .env)
├── .gitignore                   # Git ignore rules
├── README.md                    # Complete setup, Android, & deployment guide
├── index.html                   # SPA HTML entry point
├── metadata.json                # App metadata & permissions
├── package.json                 # Dependencies and scripts (dev, build, start, lint)
├── package-lock.json            # Exact locked npm dependency versions
├── tsconfig.json                # TypeScript configuration
├── vite.config.ts               # Vite + Tailwind v4 configuration
├── server.ts                    # Full Express + WebSocket (/live) + Gemini backend
├── ui_config.json               # Live UI override configuration (auto-managed)
├── app_config.json              # APK link & download button config (auto-managed)
├── ai_directives.json           # Admin directives for AI Teacher (auto-managed)
├── public/
│   └── assets/aistudio/         # Static assets (Noorani Qaida PDF, Admin icons)
└── src/
    ├── main.tsx                 # React entry point with BrowserRouter
    ├── index.css                # Tailwind v4 global styles & mobile touch rules
    ├── App.tsx                  # Main Classroom UI, Voice Core, Blackboard, Music & Quran
    ├── types/
    │   └── index.ts             # Shared TypeScript interfaces
    ├── data/
    │   ├── classTextbooks.ts    # Class 1–10 textbooks & 7-day weekly study plans
    │   ├── coloringSheets.ts    # Interactive SVG coloring sheets
    │   └── curriculum.ts        # Phonics, numbers, rhymes, quiz datasets
    ├── utils/
    │   ├── audioManager.ts      # WebSocket LiveAudioSession + 16kHz PCM mic/speaker engine
    │   ├── badgeManager.ts      # Student milestone badge calculation
    │   ├── deviceId.ts          # Persistent browser/device identifier
    │   ├── generateReportCardPdf.ts # jsPDF exam report card generator
    │   └── safeFetch.ts         # Safe JSON fetch wrapper
    ├── pages/
    │   ├── AdminPage.tsx        # Admin route wrapper (/admin)
    │   └── AdminDashboardPage.tsx # Full Admin Panel (Users, AI Control, Chat, Exams, Code Export)
    └── components/              # 24 modular React modals & interactive hubs
        ├── AdminMessageReceivedModal.tsx
        ├── AlphabetPhonicsHub.tsx
        ├── ApkInstallGuideModal.tsx
        ├── BodyPartsAndEnglishHubModal.tsx
        ├── ClassCurriculumHub.tsx
        ├── ClassTextbookReaderModal.tsx
        ├── ColorPickerModal.tsx
        ├── ComplaintModal.tsx
        ├── DrawingStudio.tsx
        ├── DrawingTracingPad.tsx
        ├── KidsNavbar.tsx
        ├── KidsQuizPlayground.tsx
        ├── KidsStoryTutor.tsx
        ├── LanguageSelectionModal.tsx
        ├── LiveVoiceTeacherModal.tsx
        ├── MicrophonePermissionModal.tsx
        ├── NotebookCameraModal.tsx
        ├── PaintingMenuModal.tsx
        ├── RhymesAudioStudio.tsx
        ├── StudentBadgesModal.tsx
        ├── StudentProfileModal.tsx
        ├── StudentRoleSettingsModal.tsx
        ├── WeeklyExamReportPortal.tsx
        └── WritingPracticePadModal.tsx
```

---

## 2. Requirements & External Services

### Required API Key
| Service | Env Variable | Purpose | Required? |
|---|---|---|---|
| **Google Gemini API** (`@google/genai`) | `GEMINI_API_KEY` | Real-time voice call (`gemini-3.8-live`), camera/handwriting vision analysis, AI support replies, quiz generation | **Yes** (get a key from Google AI Studio: https://aistudio.google.com/apikey) |

### Key-Free External Services (No API Key Needed)
- **Al-Quran Cloud (`api.alquran.cloud`), `alquran-api.pages.dev`, `server8.mp3quran.net`, `everyayah.com`**: Complete 30 Paras, 114 Surahs, Arabic Uthmani text, Hindi/Urdu/English translations, and audio recitation.
- **JioSaavn Public Search API + iTunes Search API**: Song playback with DES-ECB stream decryption (`crypto-js`) and preview fallback.

### Optional Environment Variables
- `PORT`: Server port (defaults to `3000`).
- `APP_URL`: Public URL where your app is hosted.
- `ADMIN_PASSCODE`: Custom 6-digit admin password for Chand Admin login (fallback saved in `student_memory.json` / `admin_passcode.json`).

---

## 3. Running Locally (Windows / macOS / Linux / Termux)

1. **Install Node.js 20+** from https://nodejs.org
2. **Unzip & enter the project folder:**
   ```bash
   unzip AI_Teacher_Complete_Source.zip
   cd AI_Teacher_Complete_Source
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Create `.env` from `.env.example`:**
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
   PORT=3000
   APP_URL="http://localhost:3000"
   ADMIN_PASSCODE="808999"
   ```
5. **Build & Start (Production Mode):**
   ```bash
   npm run build
   npm start
   ```
   Or start Development Server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in Chrome/Edge/Safari.

---

## 4. Deploying Outside Google AI Studio (Web & Android)

### Option A: Web Deployment (Render / Railway / Fly.io / VPS)
Because this app uses a persistent WebSocket endpoint (`/live`) and writes runtime JSON files (`student_memory.json`, `complaints.json`, etc.), deploy it to any Node.js host that supports WebSockets + persistent disk (e.g., **Render**, **Railway**, **Fly.io**, or an Ubuntu VPS with **PM2 + Nginx**):
- **Build command:** `npm install && npm run build`
- **Start command:** `NODE_ENV=production npm start`
- **Environment variables:** Set `GEMINI_API_KEY`, `NODE_ENV=production`, and optionally `ADMIN_PASSCODE`.
- **HTTPS Required:** Mobile browsers require `https://` to grant **Microphone** and **Camera** permissions. Render/Railway provide free HTTPS automatically.

### Option B: Running on an Android Phone
1. **Installable Web App (Fastest — Works Immediately):**
   - Deploy to an `https://` URL (Render / Railway / Cloudflare Tunnel).
   - Open in Chrome on Android → Tap Menu (`⋮`) → **Add to Home screen / Install app**.
   - Grant Microphone & Camera permissions when prompted.
2. **Package as a Native Android APK (Capacitor):**
   - Install Capacitor in the project:
     ```bash
     npm install @capacitor/core @capacitor/cli @capacitor/android
     npx cap init "AI Teacher" "com.aiteacher.app"
     ```
   - Point `capacitor.config.ts` `server.url` to your hosted `https://your-app-domain.com` backend (so `/live` WebSocket and `/api/*` routes run seamlessly):
     ```ts
     const config = {
       appId: 'com.aiteacher.app',
       appName: 'AI Teacher',
       webDir: 'dist',
       server: { url: 'https://YOUR-DEPLOYED-DOMAIN.com', cleartext: false }
     };
     ```
   - Run `npx cap add android && npx cap open android`.
   - In `android/app/src/main/AndroidManifest.xml`, add permissions:
     ```xml
     <uses-permission android:name="android.permission.INTERNET" />
     <uses-permission android:name="android.permission.RECORD_AUDIO" />
     <uses-permission android:name="android.permission.CAMERA" />
     <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
     ```
   - Build the signed `.apk` in Android Studio (**Build → Build Bundle(s) / APK(s) → Build APK(s)**).

---

## 5. Database / File Storage Schema

This application runs zero-config file-based JSON persistence on the backend (no external SQL server required; can easily be migrated to SQLite/PostgreSQL/Firestore if needed):

- `student_memory.json` — `{ adminPassword?: string, deletedUsers?: string[], deletedDevices?: string[], blockedUsers?: string[], blockedDevices?: string[], devices: Record<deviceId, ServerProfile> }`
  Stores each student/device profile (`name`, `grade`, `role`, `students[]`, `stars`, `badges[]`, `chatHistory[]`, `learnedTopics[]`, `askedQuestionsHistory[]`, `examHistory[]`, `hasDownloadedApp`).
- `ui_config.json` — Live home screen & blackboard overrides controlled by Chand Admin (`downloadButtonText`, `downloadButtonVisible`, `downloadButtonOnlyWhenLive`, `profileVisible`, `profileOnlyWhenLive`, `blackboardTitle`, `blackboardVisible`, `customBannerText`).
- `app_config.json` — APK download URL and per-user/per-device download button visibility lists.
- `ai_directives.json` — Array of active Admin instructions broadcast to AI Teacher sessions (`id`, `commandText`, `category`, `active`, `createdAt`).
- `complaints.json`, `notifications.json`, `user_messages.json`, `camera_snapshots.json` — Support chat threads, app download alerts, admin broadcast messages, and checked homework snapshots.

---

## 6. Sharing With ChatGPT

Upload **`AI_Teacher_Complete_Source.zip`** directly to ChatGPT:
- To debug or deploy as-is: share this ZIP and provide your `GEMINI_API_KEY` when hosting on Render/Railway/VPS.
- To convert voice from Gemini Live to **OpenAI Realtime API**: ask ChatGPT to replace the `/live` `ai.live.connect(...)` block in `server.ts` with an OpenAI Realtime WebSocket bridge using `OPENAI_API_KEY`, keeping all existing function tools and frontend WebSocket messages unchanged.
