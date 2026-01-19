export default {
    async fetch(request, env, ctx) {
        const pathname = new URL(request.url).pathname;
        return Response.redirect(`https://prod-notice.bluearchiveyostar.com${pathname}`, 302);
    },
};
