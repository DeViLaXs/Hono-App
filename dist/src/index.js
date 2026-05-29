import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { createAuth } from './auth/index.js';
import { createDb } from './db/index.js';
import { games } from './db/schema.js';
const app = new Hono();
app.use('*', cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST'],
}));
app.on(['POST', 'GET'], '/api/auth/*', async (c) => {
    try {
        const auth = createAuth(c.env);
        return await auth.handler(c.req.raw);
    }
    catch (error) {
        console.error('Auth route crashed:', error);
        return c.json({
            error: 'Auth route internal error',
            details: error instanceof Error ? error.message : 'Unknown auth error',
        }, 500);
    }
});
app.get('/me', async (c) => {
    const auth = createAuth(c.env);
    const session = await auth.api.getSession({
        headers: c.req.raw.headers,
    });
    if (!session) {
        return c.json({
            error: 'Unauthorized',
        }, 401);
    }
    return c.json({
        user: session.user,
    });
});
app.get('/', (c) => {
    return c.json({
        message: 'Backend working',
    });
});
app.get('/games', async (c) => {
    const db = createDb(c.env.DATABASE_URL);
    const gamesData = await db.select().from(games);
    return c.json({
        games: gamesData,
    });
});
export default app;
