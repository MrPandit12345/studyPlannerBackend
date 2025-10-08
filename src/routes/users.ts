import { Hono } from "hono";

const app = new Hono();

app.post('/register')
app.post('/login')

app.get('/profile')


export const users = app;
