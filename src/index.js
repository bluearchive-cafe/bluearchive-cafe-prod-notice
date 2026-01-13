export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const params = url.searchParams;
        const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });

        if (path.startsWith("/api/")) {
            if (path === "/api/status") {
                const type = params.get("type");
                const scope = params.get("scope");
                const field = params.get("field");
                if (type === "last" && scope === "check" && field === "time") {
                    const status = await env.STATUS.get("LastCheckTime");
                    return new Response(status || "API：状态信息：查询状态失败", { headers, status: status ? 200 : 404 });
                } else if (type && scope) {
                    const key = type.charAt(0).toUpperCase() + type.slice(1) + "." + scope.charAt(0).toUpperCase() + scope.slice(1);
                    let status = await env.STATUS.get(key);
                    if (status && field) status = JSON.parse(status)[field];
                    return new Response(status || "API：状态信息：查询状态失败", { headers, status: status ? 200 : 404 });
                } else return new Response("API：状态信息：查询参数缺失", { headers, status: 400 });
            } else if (path === "/api/dash") {
                const uuid = params.get("uuid");
                const table = params.get("table");
                const asset = params.get("asset");
                const media = params.get("media");
                if (uuid && table && asset && media) {
                    try {
                        await env.PREFERENCE.put(uuid, JSON.stringify({ table, asset, media }));
                        return new Response("API：偏好设置：保存设置成功", { headers });
                    } catch { return new Response("API：偏好设置：保存设置失败", { headers, status: 500 }); }
                } else if (uuid) {
                    const preference = await env.PREFERENCE.get(uuid);
                    return new Response(preference || "API：偏好设置：查询设置失败", { headers, status: preference ? 200 : 404 });
                } else return new Response("API：偏好设置：查询参数缺失", { headers, status: 400 });
            }
            return new Response("API：调用错误：调用接口未知", { headers, status: 400 })
        }
        return Response.redirect(`https://prod-notice.bluearchiveyostar.com${new URL(request.url).pathname}`, 302);
    },
};
