// pages/api/proxy.js
import { createProxyMiddleware } from "http-proxy-middleware";

export default function proxy(req, res) {
  // Создание прокси без тела запроса.
  if (req.method === "GET") {
    const proxy = createProxyMiddleware({
      target: "https://pisco-rpc.terra.dev",
      changeOrigin: true,
      pathRewrite: {
        "^/api/proxy": "/",
      },
    });

    proxy(req, res);
  }
}
