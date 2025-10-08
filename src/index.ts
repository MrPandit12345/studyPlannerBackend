import { Hono } from "hono";
import { cors } from "hono/cors";
import { routes } from "./routes/index.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "http://localhost:3000",
    allowHeaders: ["Authorization", "Content-Type"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.route("/",routes());

export default app;
