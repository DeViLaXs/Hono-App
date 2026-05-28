import "dotenv/config";
import { Hono } from "hono";  
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";

import { auth } from "./auth/index.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST"],
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/me", async (c) => {
  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json(
      {
        error: "Unauthorized",
      },
      401
    );
  }

  return c.json({
    user: session.user,
  });
});

app.get("/", (c) => {
  return c.json({
    message: "Backend working 🚀",
  });
});

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log("Server running on http://localhost:3000");