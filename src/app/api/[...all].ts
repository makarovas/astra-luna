import { type NextApiRequest, type NextApiResponse } from "next";
import createProxyMiddleware from "next-http-proxy-middleware";

const proxyMiddleware = (req: NextApiRequest, res: NextApiResponse<Response>) =>
  createProxyMiddleware(req, res, {
    target: "https://pisco-lcd.terra.dev/",
    pathRewrite: {
      "^/api": "/",
    },
    changeOrigin: true,
  });

export default proxyMiddleware;

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
