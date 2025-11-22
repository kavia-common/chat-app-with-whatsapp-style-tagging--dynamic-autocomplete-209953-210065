# Frontend Web Application (Next.js)

This is a Next.js app that provides the chat UI with WhatsApp-style tagging and dynamic autocomplete. It communicates with the Backend API Service over REST.

## Prerequisites
- Node.js 18+ and npm (or yarn/pnpm/bun)
- Backend API Service running at http://localhost:3001

## Environment Variables
Copy the example file and adjust if needed:
```bash
cp .env.local.example .env.local
```

Key variables:
- NEXT_PUBLIC_API_BASE: base URL for backend (default http://localhost:3001)
- NEXT_PUBLIC_FRONTEND_URL: external URL for this app (default http://localhost:3000)
- NEXT_PUBLIC_NODE_ENV: development|production
- NEXT_PUBLIC_LOG_LEVEL: debug|info|warn|error
- NEXT_PUBLIC_FEATURE_FLAGS: comma-separated flags

The app auto-detects API base via NEXT_PUBLIC_API_BASE (fallback to http://localhost:3001). See src/lib/api.ts.

## Running locally
1) Install dependencies
```bash
npm install
```
2) Start the dev server (port 3000)
```bash
npm run dev
```
Open http://localhost:3000

Note: Ensure backend is running on http://localhost:3001 so API calls succeed.

## Build and start
```bash
npm run build
npm start
```

## Project notes
- State management via Redux Toolkit (src/store)
- REST client and base URL in src/lib/api.ts
- Tag suggestions query param is "search" on the frontend; backend must accept both "search" and "query" for compatibility.

## Learn More
- Next.js Docs: https://nextjs.org/docs
- Redux Toolkit: https://redux-toolkit.js.org/
