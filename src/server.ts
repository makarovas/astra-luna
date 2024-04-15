import { createServer, type IncomingMessage, type ServerResponse } from "http";
import httpProxy from "http-proxy";
import { type Socket } from "net"; // Использование типа Socket из пакета net
import next from "next";
import { parse } from "url";

const port = parseInt(process.env.PORT ?? "3000", 10);
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const proxy = httpProxy.createProxyServer();

void app.prepare().then(() => {
  createServer((req: IncomingMessage, res: ServerResponse | Socket) => {
    const parsedUrl = parse(req.url!, true);
    const isResponse = (
      obj: ServerResponse | Socket,
    ): obj is ServerResponse => {
      return (obj as ServerResponse).end !== undefined;
    };

    if (req.headers.upgrade && /websocket/i.test(req.headers.upgrade)) {
      if (isResponse(res)) {
        res.writeHead(501);
        res.end("WebSocket connections are not implemented.");
      }
    } else if (parsedUrl.pathname?.startsWith("/api/proxy")) {
      if (isResponse(res)) {
        proxy.web(req, res, {
          target: "https://pisco-lcd.terra.dev",
          changeOrigin: true,
        });
      }
    } else {
      void handle(req, res as ServerResponse, parsedUrl);
    }
  }).listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

  proxy.on("error", (err, _req, res) => {
    const isResponse = (
      obj: ServerResponse | Socket,
    ): obj is ServerResponse => {
      return (obj as ServerResponse).end !== undefined;
    };
    console.error("Proxy error:", err);
    if (isResponse(res) && !res.headersSent) {
      res.writeHead(500, { "Content-Type": "text/plain" });
      res.end("Proxy error: Could not proxy request");
    }
  });
});
