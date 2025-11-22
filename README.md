# Chat App with WhatsApp-style Tagging

This repository contains:
- FrontendWebApplication (Next.js) at port 3000
- BackendAPIService (Express) at port 3001
- ApplicationDatabase (PostgreSQL) connection variables referenced by backend

## Quick start (local)
1) Backend
```bash
cd ../chat-app-with-whatsapp-style-tagging--dynamic-autocomplete-209953-210066/BackendAPIService
cp .env.example .env
npm install
npm run dev
# Service: http://localhost:3001
```

2) Frontend
```bash
cd ../chat-app-with-whatsapp-style-tagging--dynamic-autocomplete-209953-210065/FrontendWebApplication
cp .env.local.example .env.local
npm install
npm run dev
# App: http://localhost:3000
```

The frontend is preconfigured to call the backend at http://localhost:3001 (see src/lib/api.ts or NEXT_PUBLIC_API_BASE).

## Notes
- Tag suggestions endpoint expects "trigger" and "search". Backend should also accept "query" as alias for compatibility.
- Ensure CORS_ORIGINS in backend .env includes the frontend origin.