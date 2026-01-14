export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const path = url.pathname;
        const params = url.searchParams;
        const headers = new Headers({ "Content-Type": "text/plain; charset=utf-8" });

        if (path.startsWith("/api/")) {
            if (path === "/api/status") {
                let value;
                const type = params.get("type");
                const scope = params.get("scope");
                const field = params.get("field");
                if (type && scope && field) value = await env.RESOURCESTATUS.get([type, scope, field].join("/"));
                else value = await env.RESOURCESTATUS.get("status.json");
                return new Response(value || "API：资源状态：状态查询失败", { headers: { "Content-Type": "application/json" }, status: value ? 200 : 404 });
            } else if (path === "/api/dash") {
                const uuid = params.get("uuid");
                const table = params.get("table");
                const asset = params.get("asset");
                const media = params.get("media");
                if (uuid) {
                    if (table && asset && media) {
                        try {
                            await env.PREFERENCE.put(uuid, JSON.stringify({ table, asset, media }));
                            return new Response("API：偏好设置：设置保存成功", { headers });
                        } catch { return new Response("API：偏好设置：设置保存失败", { headers, status: 500 }); }
                    } else if (table || asset || media) {
                        return new Response("API：偏好设置：设置参数缺失", { headers, status: 400 });
                    } else {
                        const preference = await env.PREFERENCE.get(uuid);
                        return new Response(preference || "API：偏好设置：设置查询失败", { headers, status: preference ? 200 : 404 });
                    }
                } else return new Response("API：偏好设置：查询参数缺失", { headers, status: 400 });
            }
            return new Response("API：调用错误：调用接口未知", { headers, status: 400 })
        }
        return Response.redirect(`https://prod-notice.bluearchiveyostar.com${new URL(request.url).pathname}`, 302);
    },
};
