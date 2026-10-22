// Video range repair for /work/* (see wrangler.json run_worker_first).
//
// Safari's media engine (iOS and macOS) requires a server to answer
// Range requests with a 206 response and a well-formed Content-Range
// header; intermittent plain-200 answers put it into a broken state
// (WebKit Bug 229413, Jer Noble). Static asset serving has been
// observed answering some Range requests with a plain 200, so video
// traffic runs through this worker first: pass the asset response
// through untouched when it already honours the range, otherwise
// slice the file here and answer with a correct 206. Everything that
// is not a ranged .mp4 request is served exactly as before.

export default {
  async fetch(request, env) {
    const res = await env.ASSETS.fetch(request);
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
  },
};
