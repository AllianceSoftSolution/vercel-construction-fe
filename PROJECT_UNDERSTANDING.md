# Construction FE - Project Understanding (AI Handoff)

Last updated: 2026-04-28
Repository: construction-fe

## 1. What this project is

This is a React + Vite frontend for a role-based Construction Management System. It supports multiple operational roles and dashboards for managing users, projects, sections, demands, purchase orders, stores, materials, vendors, and payables.

Core business flow:
1. Users authenticate.
2. User role determines which dashboard routes are available.
3. Each role operates on overlapping domains (projects, demands, PO, store, payables) with different permissions and views.
4. Notifications are handled via Firebase Cloud Messaging (foreground + background).

## 2. Current stack and runtime

- Framework: React 18
- Bundler: Vite 5
- Routing: react-router-dom 6 (createBrowserRouter)
- State: Redux Toolkit + redux-persist
- UI: Tailwind CSS + MUI + custom components
- Charts: chart.js, react-chartjs-2, recharts, @mui/x-charts
- Forms/validation: formik + yup, react-hook-form + zod (mixed usage)
- HTTP client: apisauce (wrapper around axios)
- Realtime: socket.io-client
- Notifications: Firebase Messaging + service worker
- File/storage integration: AWS S3 SDK in browser

## 3. How app bootstraps

Entry flow:
1. src/main.jsx mounts app with Redux Provider and react-hot-toast Toaster.
2. src/App.jsx reads role from Redux auth state.
3. getRoutesByRole(role) builds role-specific route tree.
4. RouterProvider renders only the routes available for that role.

Important implementation detail:
- Access control is primarily route selection by role at runtime.
- There is a ProtectedRoute component in src/modules/ProtectedRoute.jsx, but this is not the main gate in current App.jsx routing.

## 4. Role model and route groups

Role strings used in routing/login:
- ADMIN
- PROJECT_MANAGER
- SITE_INCHARGE
- CONSTRUCTION_MANAGER
- ACCOUNTANT
- STORE_INCHARGE

Main route roots:
- / (landing)
- /auth/*
- /admin-dashboard/*
- /project-manager-dashboard/*
- /siteincharge-dashboard/*
- /construction-manager-dashboard/*
- /accountant-dashboard/*
- /store-incharge-dashboard/*

Role capabilities summary:
- ADMIN: full system scope (users, projects, demands, POs, stores, materials, vendors, payables).
- PROJECT_MANAGER: dashboard + users + demands + POs + stores. Project-management paths currently redirect to dashboard in App routes.
- SITE_INCHARGE: project, user, demand, PO, store operations.
- CONSTRUCTION_MANAGER: project, demand, PO; store routes intentionally removed in App route config.
- STORE_INCHARGE: PO and store operations.
- ACCOUNTANT: project, sections, demands, payables.

## 5. State management model

Redux slices:
- auth (src/redux/authSlice.js)
  - token, user, isLoggedIn, userType, username, businessName
- plan (src/redux/plan_details.js)

Persistence:
- redux-persist with localStorage
- Persisted: auth
- Not persisted: plan (blacklisted)

Notes:
- store exports persistor, but app bootstrap does not currently wrap with PersistGate.

## 6. API integration model

Base API client:
- src/api/apiClient.js
- baseURL is currently hardcoded to /api/
- Bearer token auto-injected from Redux auth.token

Endpoint families seen in code:

Auth and users:
- /auth/login
- /auth/device-token
- /auth/register
- /auth/request-password-reset
- /auth/users
- /auth/users/:id/activate
- /auth/users/:id/deactivate
- /user
- /user/:id

Projects and sections:
- /projects
- /projects/:id
- /sections
- /sections?projectId=:id

Demands:
- /demands
- /demands/:id
- /demands/:id/fulfill

Purchase orders and payables:
- /purchase-orders
- /purchase-orders?hasAmount=true|false
- /purchase-orders/:id
- /purchase-orders/:id/amount

Stores and stock:
- /stores
- /stores/:id
- /stores/:id/assign
- /stores/:id/assign-site-incharge
- /stores/:id/assign-project-manager
- /stores/:id/stock-in
- /stores/:id/stock-out

Materials and vendors:
- /materials
- /materials/:id
- /vendors
- /vendors/:id

Vendor account and accounting summaries:
- /vendor-account/payables-summary
- /vendor-account/payables-summary/by-project
- /vendor-account/vendors?projectId=:id
- /vendor-account/vendors/:vendorId/statement?projectId=:id
- /vendor-account/vendors/:vendorId/payments

Dashboard analytics:
- /analytics/admin/dashboard
- /analytics/accountant/dashboard
- /analytics/store-incharge/dashboard

## 7. Notifications and realtime

Firebase messaging:
- src/utils/firebase.js uses VITE_FIREBASE_* env vars.
- src/hooks/usePushNotification.jsx requests notification permission, registers service worker, gets FCM token.
- On login, app posts FCM token to /auth/device-token.

Service worker:
- firebase-messaging-sw.js handles background notifications.
- Persists notification data into IndexedDB store fcm_notifications_db.

Notification storage util:
- src/utils/notificationStorage.js merges IndexedDB + localStorage notifications and tracks read status.

Socket:
- src/socket.js defines socket.io client and emit helpers.
- src/context/SocketContext.jsx provides connection lifecycle helper.

## 8. Environment variables required

From code usage, these env vars are expected:

Firebase:
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_FIREBASE_MEASUREMENT_ID
- VITE_FIREBASE_VAPID_KEY

AWS S3 upload:
- VITE_AWS_REGION
- VITE_AWS_ACCESS_KEY_ID
- VITE_AWS_SECRET_ACCESS_KEY
- VITE_AWS_BUCKET_NAME

Potentially intended but currently not active:
- VITE_BASE_URL (commented in apiClient)

## 9. Build, run, deploy

NPM scripts:
- npm run dev
- npm run build
- npm run preview
- npm run lint

Vite config:
- Alias @ -> src

Vercel config:
- SPA rewrite sends all paths to /index.html

## 10. Directory map (high-value)

- src/App.jsx: route tree and role gating
- src/layouts/*: role-specific dashboards and screens
- src/components/*: shared reusable UI
- src/mui/*: MUI wrappers/components
- src/api/apiClient.js: HTTP layer
- src/redux/*: app state
- src/hooks/usePushNotification.jsx: FCM hook
- src/utils/firebase.js: Firebase setup
- firebase-messaging-sw.js: background FCM service worker
- src/utils/uploadFileToS3.js: browser upload helper

Brand/image assets noted:
- src/assets/construction/logo.png
- src/assets/construction/loginLogo.png
- src/assets/construction/manager.png
- src/assets/construction/profile.png
- src/assets/construction/flag.jpg
- src/assets/construction/Search.png
- src/assets/construction/upload 1.png

## 11. Important risks and inconsistencies

1. Protected route mismatch:
- src/modules/ProtectedRoute.jsx checks userType !== "AD", while actual roles are ADMIN, etc.
- Also appears not to be the primary protection path in current App routing.

2. Hardcoded API base URL:
- src/api/apiClient.js uses /api/ directly; VITE_BASE_URL is commented out.

3. Hardcoded socket URL:
- src/socket.js uses http://localhost:5000; no env-based switching.

4. Firebase config duplication risk:
- src/utils/firebase.js uses env values.
- firebase-messaging-sw.js has hardcoded Firebase config values.
- These can drift out of sync across environments.

5. S3 upload utility appears broken:
- src/utils/uploadFileToS3.js returns URL using bucketName and key variables not defined in function scope.
- Likely runtime bug if used.

6. Naming inconsistencies:
- Folder typo: layouts/acountant
- Mixed casing in route paths (user-Management, project-Management, pOS, etc.)
- This raises maintenance and linking risk.

7. No test harness found:
- No visible unit/integration test structure in current workspace snapshot.

## 12. Suggested AI operating instructions for this repo

When handing this repo to another AI, paste this:

"""
You are working on a React + Vite role-based construction management frontend.

Primary files first:
1) src/App.jsx for route/role model
2) src/api/apiClient.js for backend integration
3) src/redux/authSlice.js + src/redux/store.js for auth state
4) src/layouts/<role> for role-specific screens
5) src/hooks/usePushNotification.jsx + src/utils/firebase.js + firebase-messaging-sw.js for notifications

Rules:
- Preserve existing route patterns unless explicitly asked to normalize.
- Assume backend APIs are already defined; do not rename endpoints casually.
- Keep role-based access behavior intact.
- Prefer targeted edits in the relevant role layout/screen folder.
- Validate changes against npm run lint and role route behavior.

Known sharp edges:
- ProtectedRoute role mismatch (AD vs ADMIN)
- hardcoded socket URL
- hardcoded service worker Firebase config
- possible bug in uploadFileToS3 return URL variables
"""

## 13. Fast onboarding checklist

1. Install dependencies: npm install
2. Create .env with Firebase and AWS variables listed above
3. Ensure backend proxy/routing supports /api/* calls
4. Start dev server: npm run dev
5. Test login with each role and verify route landing
6. Verify notification permission flow and service worker registration
7. Verify key dashboards load data (admin, accountant, store incharge)

---

If you want, the next step can be generating:
- PROJECT_ARCHITECTURE_DIAGRAM.md (Mermaid diagrams)
- API_CONTRACT_REFERENCE.md (endpoint-by-endpoint table)
- ROLE_CAPABILITY_MATRIX.md (screen-level permission matrix)
