import { db } from '../db'
import {
  users,
  badges,
  userBadges,
  activityLog,
  userProgress,
} from '../db/schema'
import { eq, and, sql } from 'drizzle-orm'

// ─── Level Thresholds ─────────────────────────────────────────────────────────

export const LEVEL_THRESHOLDS = [
  0,     // Level 1
  100,   // Level 2
  300,   // Level 3
  600,   // Level 4
  1000,  // Level 5
  1500,  // Level 6
  2200,  // Level 7
  3000,  // Level 8
  4000,  // Level 9
  5500,  // Level 10
]

export function calculateLevel(xp: number): number {
  let level = 1
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_THRESHOLDS[i]) {
      level = i + 1
    } else {
      break
    }
  }
  return level
}

export function xpToNextLevel(xp: number): { current: number; next: number; progress: number } {
  const level = calculateLevel(xp)
  const currentThreshold = LEVEL_THRESHOLDS[level - 1] ?? 0
  const nextThreshold = LEVEL_THRESHOLDS[level] ?? LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1]
  const progress = Math.min(((xp - currentThreshold) / (nextThreshold - currentThreshold)) * 100, 100)
  return { current: currentThreshold, next: nextThreshold, progress }
}

// ─── XP Grants ───────────────────────────────────────────────────────────────

export async function awardXP(userId: number, amount: number): Promise<{ newXp: number; newLevel: number; leveledUp: boolean }> {
  const [user] = await db
    .select({ xp: users.xp, level: users.level })
    .from(users)
    .where(eq(users.id, userId))

  if (!user) throw new Error('User not found')

  const newXp = user.xp + amount
  const newLevel = calculateLevel(newXp)
  const leveledUp = newLevel > user.level

  await db
    .update(users)
    .set({ xp: newXp, level: newLevel, updatedAt: new Date() })
    .where(eq(users.id, userId))

  return { newXp, newLevel, leveledUp }
}

// ─── Streak Management ────────────────────────────────────────────────────────

export async function updateStreak(userId: number): Promise<{ streak: number; maintained: boolean }> {
  const [user] = await db
    .select({ streak: users.streak, lastActivityDate: users.lastActivityDate })
    .from(users)
    .where(eq(users.id, userId))

  if (!user) throw new Error('User not found')

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  let newStreak = user.streak
  let maintained = true

  if (user.lastActivityDate === today) {
    // Already logged today — no change
    return { streak: user.streak, maintained: true }
  } else if (user.lastActivityDate === yesterday) {
    // Consecutive day — increment
    newStreak = user.streak + 1
  } else {
    // Streak broken
    newStreak = 1
    maintained = false
  }

  await db
    .update(users)
    .set({ streak: newStreak, lastActivityDate: today, updatedAt: new Date() })
    .where(eq(users.id, userId))

  return { streak: newStreak, maintained }
}

// ─── Activity Log ─────────────────────────────────────────────────────────────

export async function logActivity(
  userId: number,
  params: { xpEarned?: number; lessonsCompleted?: number; exercisesCompleted?: number },
): Promise<void> {
  const today = new Date().toISOString().split('T')[0]

  await db
    .insert(activityLog)
    .values({
      userId,
      date: today,
      xpEarned: params.xpEarned ?? 0,
      lessonsCompleted: params.lessonsCompleted ?? 0,
      exercisesCompleted: params.exercisesCompleted ?? 0,
    })
    .onConflictDoUpdate({
      target: [activityLog.userId, activityLog.date],
      set: {
        xpEarned: sql`activity_log.xp_earned + ${params.xpEarned ?? 0}`,
        lessonsCompleted: sql`activity_log.lessons_completed + ${params.lessonsCompleted ?? 0}`,
        exercisesCompleted: sql`activity_log.exercises_completed + ${params.exercisesCompleted ?? 0}`,
      },
    })
}

// ─── Badge Awards ─────────────────────────────────────────────────────────────

export async function checkAndAwardBadges(
  userId: number,
  context: {
    lessonId?: number
    trailId?: number
    streak?: number
    level?: number
  },
): Promise<Array<{ id: number; name: string; description: string; icon: string }>> {
  const allBadges = await db.select().from(badges)
  const alreadyEarned = await db
    .select({ badgeId: userBadges.badgeId })
    .from(userBadges)
    .where(eq(userBadges.userId, userId))

  const earnedIds = new Set(alreadyEarned.map((b) => b.badgeId))
  const newBadges: Array<{ id: number; name: string; description: string; icon: string }> = []

  for (const badge of allBadges) {
    if (earnedIds.has(badge.id)) continue

    let earned = false
    const req = badge.requirement as Record<string, unknown>

    if (badge.type === 'lesson' && context.lessonId) {
      earned = req.lessonId === context.lessonId
    } else if (badge.type === 'trail' && context.trailId) {
      earned = req.trailId === context.trailId
    } else if (badge.type === 'streak' && context.streak !== undefined) {
      earned = context.streak >= (req.days as number)
    } else if (badge.type === 'level' && context.level !== undefined) {
      earned = context.level >= (req.level as number)
    }

    if (earned) {
      await db.insert(userBadges).values({ userId, badgeId: badge.id })
      newBadges.push({ id: badge.id, name: badge.name, description: badge.description, icon: badge.icon })
    }
  }

  return newBadges
}
