import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import * as bcrypt from 'bcrypt'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users, refreshTokens } from '../db/schema'

const SALT_ROUNDS = 12

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const refreshSchema = z.object({
  refreshToken: z.string(),
})

export async function authRoutes(app: FastifyInstance): Promise<void> {
  // ─── Register ──────────────────────────────────────────────────────────────
  app.post('/auth/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.flatten() })
    }

    const { name, email, password } = parsed.data

    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email))
    if (existing.length > 0) {
      return reply.code(409).send({ error: 'Email already registered' })
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
    const [user] = await db
      .insert(users)
      .values({ name, email, passwordHash })
      .returning({ id: users.id, name: users.name, email: users.email, xp: users.xp, level: users.level })

    const accessToken = app.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' })
    const refreshToken = app.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d' })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await db.insert(refreshTokens).values({ userId: user.id, token: refreshToken, expiresAt })

    return reply.code(201).send({
      user,
      accessToken,
      refreshToken,
    })
  })

  // ─── Login ────────────────────────────────────────────────────────────────
  app.post('/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed', details: parsed.error.flatten() })
    }

    const { email, password } = parsed.data

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))

    if (!user) {
      return reply.code(404).send({ error: 'Usuário não cadastrado' })
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash)
    if (!passwordValid) {
      return reply.code(401).send({ error: 'Senha incorreta' })
    }

    const accessToken = app.jwt.sign({ sub: user.id, email: user.email }, { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' })
    const refreshToken = app.jwt.sign({ sub: user.id, type: 'refresh' }, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d' })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await db.insert(refreshTokens).values({ userId: user.id, token: refreshToken, expiresAt })

    return reply.send({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
      },
      accessToken,
      refreshToken,
    })
  })

  // ─── Refresh Token ────────────────────────────────────────────────────────
  app.post('/auth/refresh', async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.code(400).send({ error: 'Validation failed' })
    }

    const { refreshToken } = parsed.data

    // Verify token is valid JWT
    let payload: { sub: number; type: string }
    try {
      payload = app.jwt.verify(refreshToken) as { sub: number; type: string }
    } catch {
      return reply.code(401).send({ error: 'Invalid refresh token' })
    }

    if (payload.type !== 'refresh') {
      return reply.code(401).send({ error: 'Invalid token type' })
    }

    // Check token exists and not expired in DB
    const [storedToken] = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, refreshToken))

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return reply.code(401).send({ error: 'Refresh token expired or revoked' })
    }

    // Rotate refresh token
    await db.delete(refreshTokens).where(eq(refreshTokens.token, refreshToken))

    const newAccessToken = app.jwt.sign({ sub: payload.sub }, { expiresIn: process.env.JWT_EXPIRES_IN ?? '15m' })
    const newRefreshToken = app.jwt.sign({ sub: payload.sub, type: 'refresh' }, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d' })

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await db.insert(refreshTokens).values({ userId: payload.sub, token: newRefreshToken, expiresAt })

    return reply.send({ accessToken: newAccessToken, refreshToken: newRefreshToken })
  })

  // ─── Me ───────────────────────────────────────────────────────────────────
  app.get('/auth/me', { preHandler: [async (req, rep) => { try { await req.jwtVerify() } catch { rep.code(401).send({ error: 'Unauthorized' }) } }] }, async (request, reply) => {
    const payload = request.user as { sub: number }
    const [user] = await db
      .select({ id: users.id, name: users.name, email: users.email, xp: users.xp, level: users.level, streak: users.streak, lastActivityDate: users.lastActivityDate })
      .from(users)
      .where(eq(users.id, payload.sub))

    if (!user) {
      return reply.code(404).send({ error: 'User not found' })
    }

    return reply.send({ user })
  })
}
