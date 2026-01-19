export default {
    async fetch(request, env, ctx) {
        return Response.redirect(`https://prod-notice.bluearchiveyostar.com${new URL(request.url).pathname}`, 302);
    },
};
