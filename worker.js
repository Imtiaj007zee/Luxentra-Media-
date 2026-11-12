// LuxEntra Media Worker: SPA routing with real 404s, video range repair,
// and cache policy.
//
// The worker runs first for every request (see wrangler.json
// run_worker_first) and static assets use not_found_handling "none", so
// this file owns all routing decisions:
//
//   /api/*            -> the Hono app in src/worker/index.ts (bookings,
//                        orders, website chatbot).
//   known SPA route   -> the app shell (index.html) with a 200.
//   unknown path with no file extension (a mistyped or dead link)
//                     -> the app shell with a real 404 status, so the
//                        React router renders its NotFound page AND
//                        search engines see the 404 (no more soft 404s).
//   path with a file extension (a real asset request)
//                     -> served from static assets as-is; a missing file
//                        now 404s for real instead of falling back to the
//                        homepage.
//
// Video range repair for /work/* .mp4 files:
// Safari's media engine (iOS and macOS) requires a server to answer
// Range requests with a 206 response and a well-formed Content-Range
// header; intermittent plain-200 answers put it into a broken state
// (WebKit Bug 229413, Jer Noble). Static asset serving has been
// observed answering some Range requests with a plain 200, so video
// traffic runs through this worker first: pass the asset response
// through untouched when it already honours the range, otherwise
// slice the file here and answer with a correct 206.
//
// Cache policy (the assets layer answers max-age=0 for everything):
//   /assets/*         -> 1 year immutable. Vite fingerprints these
//                        files by content hash, so a new deploy is a
//                        new filename and a stale copy is impossible.
//   images / video / fonts
//                     -> 7 days. Long enough to matter on repeat
//                        visits, short enough that a replaced file
//                        does not linger.
//   HTML shell        -> max-age=0, must-revalidate, so a fresh deploy
//                        reaches every visitor immediately.
import app from "./src/worker/index.ts";

// Every client-side route in src/react-app/App.tsx. If a route is added
// there, add it here too, or the page will 404.
const KNOWN_ROUTES = new Set([
  "/",
  "/preview-home",
  "/book",
  "/about",
  "/order",
  "/work",
  "/branding",
  "/real-estate-photography",
  "/real-estate-film",
  "/personal-branding-queens",
  "/personal-branding-long-island",
  "/consultation",
  "/privacy",
  "/backstage",
]);

const HTML_CACHE = "public, max-age=0, must-revalidate";
const HASHED_ASSET_CACHE = "public, max-age=31536000, immutable";
const MEDIA_CACHE = "public, max-age=604800";
const MEDIA_EXTENSIONS = new Set([
  "jpg", "jpeg", "png", "webp", "avif", "gif", "svg", "ico",
  "mp4", "webm", "mov",
  "woff", "woff2", "ttf", "otf",
]);

function cacheFor(path) {
  if (path.startsWith("/assets/")) return HASHED_ASSET_CACHE;
  const ext = path.split(".").pop().toLowerCase();
  if (MEDIA_EXTENSIONS.has(ext)) return MEDIA_CACHE;
  return HTML_CACHE;
}

function withCache(res, cacheControl) {
  if (res.status !== 200) return res;
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", cacheControl);
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

function hasExtension(path) {
  const last = path.split("/").pop();
  return last.includes(".");
}

async function serveShell(request, env, status) {
  const res = await env.ASSETS.fetch(
    new Request(new URL("/", request.url), request),
  );
  // Set the cache header explicitly: withCache only touches 200s, and a
  // 404 shell must never be cached long either.
  const headers = new Headers(res.headers);
  headers.set("Cache-Control", HTML_CACHE);
  return new Response(res.body, {
    status,
    statusText: res.statusText,
    headers,
  });
}

// Slice a ranged .mp4 request into a correct 206 when the asset layer
// answered with a plain 200. Returns the response untouched otherwise.
async function applyRangeRepair(request, res) {
  try {
    if (request.method !== "GET" || res.status !== 200) return res;
    const range = request.headers.get("Range");
    if (!range) return res;
    const url = new URL(request.url);
    if (!url.pathname.endsWith(".mp4")) return res;
    const m = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    if (!m || (m[1] === "" && m[2] === "")) return res;

    const buf = await res.arrayBuffer();
    const total = buf.byteLength;
    let start;
    let end;
    if (m[1] === "") {
      // Suffix range: the last N bytes.
      start = Math.max(0, total - parseInt(m[2], 10));
      end = total - 1;
    } else {
      start = parseInt(m[1], 10);
      end = m[2] === "" ? total - 1 : Math.min(parseInt(m[2], 10), total - 1);
    }
    if (start >= total) {
      return new Response(null, {
        status: 416,
        headers: { "Content-Range": `bytes */${total}` },
      });
    }
    const slice = buf.slice(start, end + 1);
    const headers = new Headers(res.headers);
    headers.set("Content-Range", `bytes ${start}-${end}/${total}`);
    headers.set("Accept-Ranges", "bytes");
    headers.set("Content-Length", String(slice.byteLength));
    return new Response(slice, { status: 206, headers });
  } catch {
    return res;
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/")) {
      return app.fetch(request, env);
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      return env.ASSETS.fetch(request);
    }

    // Normalize: "/work/" is the "/work" route.
    let path = url.pathname;
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

    if (KNOWN_ROUTES.has(path)) {
      return serveShell(request, env, 200);
    }
    if (!hasExtension(path)) {
      return serveShell(request, env, 404);
    }

    const res = await env.ASSETS.fetch(request);
    const ranged = await applyRangeRepair(request, res);
    return withCache(ranged, cacheFor(path));
  },
};
