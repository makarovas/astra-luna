/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createProxyMiddleware } from "http-proxy-middleware";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const proxy = createProxyMiddleware({
  target: "https://assets.terra.money",
  changeOrigin: true,
  pathRewrite: {
    "^/api/extensions-proxy": "/extensions.json", // rewrite path
  },
});

export default function handler(req: any, res: any) {
  if (req.method === "GET") {
    void proxy(req, res, (result) => {
      if (result instanceof Error) {
        return NextResponse.error();
      }
      return res.json(result);
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
