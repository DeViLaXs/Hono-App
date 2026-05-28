import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { createAuth } from './auth/index.js'
import { createDb } from './db/index.js'
import { games } from './db/schema.js'

type EnvBindings = {
  DATABASE_URL: string
  BETTER_AUTH_URL: string
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
}

const app = new Hono<{ Bindings: EnvBindings }>()

app.use(
  '*',
  cors({
    origin: '*',
    allowHeaders: ['Content-Type', 'Authorization'],
    allowMethods: ['GET', 'POST'],
  }),
)

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  const auth = createAuth(c.env)
  return auth.handler(c.req.raw)
})

app.get('/me', async (c) => {
  const auth = createAuth(c.env)

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  })

  if (!session) {
    return c.json(
      {
        error: 'Unauthorized',
      },
      401,
    )
  }

  return c.json({
    user: session.user,
  })
})

app.get('/', (c) => {
  return c.json({
    message: 'Backend working',
  })
})

app.get('/games', async (c) => {
  const db = createDb(c.env.DATABASE_URL)
  const gamesData = await db.select().from(games)

  return c.json({
    games: gamesData,
  })
})

export default app
