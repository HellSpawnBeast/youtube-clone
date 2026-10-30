# AGENTS.md

Notes for anyone running this repository in a sandbox / dev container.

## What this app is

A YouTube clone: React 18 + Vite 3 SPA (single runnable project, no backend of its own).
It talks directly from the browser to two external services:

- **YouTube Data API v3** (`src/axios.js`) — base URL `https://youtube.googleapis.com/youtube/v3`,
  key read from `import.meta.env.VITE_YT_API_KEY`.
- **Firebase Auth** (`src/firebase.js`) — Google popup sign-in. The web config (including the
  public client apiKey) is committed to `src/firebase.js`; a Firebase web apiKey is a public
  browser identifier, not a server secret.

## Running it

```sh
docker compose -f docker-compose.base44.yml up -d --build
```

- Dev server: Vite from the bind-mounted source on host port **3000** (`--host 0.0.0.0`).
- Dependencies install at container start from `yarn.lock` (Yarn 1.22.22) into the
  `web_node_modules` volume; a rebuild is not needed for source edits.
- Env files, in order: `.env.base44-defaults` (committed placeholders) then
  `/run/base44/app.env` (platform secrets, wins).

## Mock data mode (no API key)

When `VITE_YT_API_KEY` is empty, `src/axios.js` installs a mock axios adapter
(`src/mock/mockApi.js` + `src/mock/mockData.js`) instead of calling Google. Every screen
works offline: home feed (2 pages of 20), categories, search, channel pages, watch page,
related videos and paged comments. Thumbnails/avatars are inline SVG data URLs, so no
network images are needed. Set a real key to switch back to the live API — the mock
adapter is only installed when the key is missing.

## Quirks

- **A real key changes behavior.** With `VITE_YT_API_KEY` set, all requests go to the
  YouTube Data API; the mock data is not mixed in. A Vite dev-server restart is needed
  after adding the key (env is read at server start).
- `react-show-more` (React <= 16 internals) crashed the watch page on React 18 with
  "Cannot read properties of null (reading 'removeChild')" once a description rendered.
  `VideoMeta` now uses its own `VideoDescription` clamp/expand component.
- Search and Channel used to re-run their fetch effect on every state update (`searchresults`
  / `channelVideos` in the dependency array), which refetched forever. Results are appended
  functionally and the loops are keyed on `query` / `playListId` + `currentPage` only.
- Vite 3 does not implement `server.allowedHosts`, so the preview host works without
  extra host allowlisting; `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` is passed through for
  when the toolchain is upgraded (Vite >= 6.1).
- `CHOKIDAR_USEPOLLING=true` is set so file watching works reliably over the bind mount.
- `public/assets` icons plus `src/data.js` drive the sidebar; the gitignored `src/data/`
  directory is not needed for the app to run.
- Peer-dependency warnings during `yarn install` (react-show-more, bootstrap/popper) are
  pre-existing and harmless.

## Verifying

- `curl -I http://localhost:3000/` returns `200` and the HTML references `/@vite/client`
  (proves the dev server is serving live source, not a prebuilt bundle).
- A functional check needs a valid `VITE_YT_API_KEY`: the home page should list popular
  videos instead of the 403 message.
