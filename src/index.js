export default {
  async fetch(request, env) {
    const key = new URL(request.url).pathname.slice(1);

    if (key) {
      const value = await env.NOTICE.get(key);
      if (value) {
        return new Response(value, {
          headers: {
            "Content-Type": "text/html; charset=utf-8",
            "Cache-Control": "public, max-age=3600"
          },
        });
      }
    }

    return Response.redirect(
      "https://prod-notice.bluearchiveyostar.com/" + key,
      302
    );
  },
};
