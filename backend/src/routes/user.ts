import { FastifyInstance } from 'fastify'
import { eq, desc, and, gte } from 'drizzle-orm'
import { db } from '../db'
import { users, userBadges, badges, activityLog } from '../db/schema'
import { authenticate } from '../middleware/authenticate'
import { xpToNextLevel } from '../services/gamification'

export async function userRoutes(app: FastifyInstance): Promise<void> {
  // ─── Get Current User Profile ─────────────────────────────────────────────
  app.get('/user/me', { preHandler: [authenticate] }, async (request, reply) => {
    const { sub: userId } = request.user as { sub: number }

    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        xp: users.xp,
        level: users.level,
        streak: users.streak,
        lastActivityDate: users.lastActivityDate,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, userId))

    if (!user) {
      return reply.code(404).send({ error: 'User not found' })
    }

    const earnedBadges = await db
      .select({
        id: badges.id,
        name: badges.name,
        description: badges.description,
        icon: badges.icon,
        type: badges.type,
        earnedAt: userBadges.earnedAt,
      })
      .from(userBadges)
      .innerJoin(badges, eq(userBadges.badgeId, badges.id))
      .where(eq(userBadges.userId, userId))
      .orderBy(desc(userBadges.earnedAt))

    const levelInfo = xpToNextLevel(user.xp)

    return reply.send({
      ...user,
      levelInfo,
      badges: earnedBadges,
    })
  })

  // ─── Get Activity Heatmap ─────────────────────────────────────────────────
  app.get('/user/activity', { preHandler: [authenticate] }, async (request, reply) => {
    const { sub: userId } = request.user as { sub: number }

    // Last 365 days of activity
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
    const oneYearAgoStr = oneYearAgo.toISOString().split('T')[0]

    const activity = await db
      .select({
        date: activityLog.date,
        xpEarned: activityLog.xpEarned,
        lessonsCompleted: activityLog.lessonsCompleted,
        exercisesCompleted: activityLog.exercisesCompleted,
      })
      .from(activityLog)
      .where(
        and(
          eq(activityLog.userId, userId),
          gte(activityLog.date, oneYearAgoStr),
        ),
      )
      .orderBy(activityLog.date)

    return reply.send({ activity })
  })
}
