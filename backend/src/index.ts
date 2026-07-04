import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import * as dotenv from 'dotenv'

import { authRoutes } from './routes/auth'
import { userRoutes } from './routes/user'
import { trailRoutes } from './routes/trails'
import { progressRoutes } from './routes/progress'

dotenv.config()

const app = Fastify({
  logger: {
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
  },
})

// ─── Plugins ──────────────────────────────────────────────────────────────────

await app.register(cors, {
  origin: true, // Allow all origins in development — restrict in production
  credentials: true,
})

await app.register(jwt, {
  secret: process.env.JWT_SECRET ?? 'fallback-secret-change-in-production',
})

// ─── Routes ───────────────────────────────────────────────────────────────────

await app.register(authRoutes)
await app.register(userRoutes)
await app.register(trailRoutes)
await app.register(progressRoutes)

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }))

// ─── Start ────────────────────────────────────────────────────────────────────

const port = parseInt(process.env.PORT ?? '3000', 10)
const host = process.env.HOST ?? '0.0.0.0'

try {
  await app.listen({ port, host })
  app.log.info(`🚀 LearnBloc API running at http://${host}:${port}`)
} catch (err) {
  app.log.error(err)
  process.exit(1)
}
