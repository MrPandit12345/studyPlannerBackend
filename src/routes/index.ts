import { Hono } from "hono";
import { users } from "./users.js";

export const routes = () => {
    const app = new Hono();

    app.route('/api',users)
    return app;
};
