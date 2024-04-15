//src/api/[...all].ts
import { type NextApiRequest, type NextApiResponse } from "next";
import createProxyMiddleware from "next-http-proxy-middleware";

const proxy = (req: NextApiRequest, res: NextApiResponse<Response>) =>
  createProxyMiddleware(req, res, {
    target: "https://pisco-lcd.terra.dev/",
    pathRewrite: {
      "^/api": "/",
    },
    changeOrigin: true,
    ws: true,
  });

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.status(200).end();
    return;
  }

  return proxy(req, res);
}
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
