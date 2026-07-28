# Vercel Deploy Guide (Frontend)

Isolated admin panel for the Vercel backend. Does not change AWS production.

## 1. Vercel project

1. Import GitHub repo `AllianceSoftSolution/vercel-construction-fe`.
2. Framework: **Vite**.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Set env vars below → Deploy.

## 2. Frontend env checklist (Vercel dashboard)

| Name | Notes |
|------|--------|
| `VITE_BASE_URL` | `https://<your-be>.vercel.app/api/` (trailing slash) |
| `VITE_SOCKET_URL` | Same BE origin, e.g. `https://<your-be>.vercel.app` (optional) |
| `VITE_FIREBASE_API_KEY` | Firebase web config |
| `VITE_FIREBASE_AUTH_DOMAIN` | |
| `VITE_FIREBASE_PROJECT_ID` | |
| `VITE_FIREBASE_STORAGE_BUCKET` | |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | |
| `VITE_FIREBASE_APP_ID` | |
| `VITE_FIREBASE_MEASUREMENT_ID` | |
| `VITE_FIREBASE_VAPID_KEY` | |

Do **not** put AWS secret access keys in `VITE_*` vars (they are baked into the browser bundle). File uploads should go through the backend / separate bucket configured on the BE.

## 3. Deploy order

1. Deploy backend first and confirm `https://<be>.vercel.app/api/` responds.
2. Set `VITE_BASE_URL` to that API URL.
3. Deploy frontend.

## 4. Isolation reminder

- Point only at the Vercel backend URL — never the Elastic Beanstalk / production API.
- Production AWS frontends and databases are unchanged.
