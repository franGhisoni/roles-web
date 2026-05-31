# roles-web

React + Vite + TypeScript admin console for the [roles-api](https://github.com/) RBAC service.

Single-page admin app. The static API token lives in `VITE_API_TOKEN` (set on the host / CI), gets baked into the bundle at build time, and is sent verbatim on every request. There is no login screen — this is an operator tool, not a user-facing product.

---

## Stack

| Concern    | Choice                                          |
| ---------- | ----------------------------------------------- |
| Build      | Vite 5 + TypeScript                             |
| UI         | React 18, Tailwind CSS, hand-rolled components  |
| Routing    | React Router 6                                  |
| Data       | TanStack Query 5 (cache, polling, invalidation) |
| Forms      | Zod + lightweight controlled inputs             |
| Toasts     | Sonner                                          |
| Icons      | lucide-react                                    |
| Deploy     | Railway (Dockerfile, build-time env baking)     |

---

## Quick start

```bash
npm install
cp .env.example .env   # set VITE_API_URL and VITE_API_TOKEN
npm run dev            # http://localhost:5173
```

Production build:

```bash
npm run build
npm run start          # serves dist/ via vite preview on $PORT
```

---

## Pages

- `/`        Dashboard — live status counts, recent roles, users at a glance
- `/roles`   Roles CRUD — paginated table, filters by type/scope, search, create/edit modals
- `/users`   Users + assignments — assign / unassign role chips inline
- `/status`  Real-time service status — uptime, memory bar, entity counts, polls every 3s
- `/*`       404

---

## Architecture

```
src/
├── api/         apiRequest helper + one module per feature (roles/users/health)
├── components/
│   ├── ui/      Button, Input, Select, Modal, Table, Badge, Card, EmptyState…
│   └── layout/  Sidebar, Header, AuthBanner, AppLayout
├── features/    feature-level state (useRoles, useUsers hooks)
├── pages/       one component per route
├── types/       shared API types (mirror of backend response shapes)
├── lib/         config (env), cn (className helper)
├── App.tsx      router
└── main.tsx     React + QueryClient + Toaster + Router boot
```

Why this split:
- `api/` is the **only** layer that knows about `fetch`. Pages call hooks; hooks call api modules.
- `features/` keeps the React-Query glue (keys, mutations, invalidation rules) co-located with the feature.
- `components/ui` is a small Tailwind primitive kit — no third-party component lib needed for an app this size.

---

## Environment

| Var               | Default                      | Notes                                                                 |
| ----------------- | ---------------------------- | --------------------------------------------------------------------- |
| `VITE_API_URL`    | `http://localhost:4000`      | Backend base URL (no trailing slash).                                 |
| `VITE_API_TOKEN`  | empty                        | Sent as `Authorization: Bearer …` on every request. Required in prod. |
| `VITE_APP_VERSION`| `1.0.0`                      | Cosmetic — shown in the sidebar.                                      |

All three are Vite client env vars, so **they are baked into the production bundle at build time**. Anyone who can fetch your JS can read the token — keep this app behind whatever access control you'd put in front of a `/admin` panel, and rotate `API_TOKEN` like any other shared secret.

If `VITE_API_TOKEN` is missing or wrong, the app shows an `API auth misconfigured` banner instead of trying to be clever about it.

---

## Deploy on Railway

1. Push this repo to GitHub.
2. Railway → **New project → Deploy from GitHub → roles-web**.
3. Add the **same** env vars to the Railway service:
   - `VITE_API_URL`   — your roles-api public URL
   - `VITE_API_TOKEN` — must match `API_TOKEN` on the backend
   - (optional) `VITE_APP_VERSION`
4. Railway will detect [`railway.json`](railway.json) and build from the Dockerfile. Build-time `ARG`s pull the env vars into the bundle.
5. The service listens on `$PORT` via `vite preview`.

---

## License

MIT.
