import { serve } from "@hono/node-server";
import app from "./index.js";

serve(
  {
    fetch: app.fetch,
    port: 5173,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
