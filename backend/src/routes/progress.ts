import { FastifyInstance } from 'fastify'
import { eq, and, count } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../db'
import {
  exercises,
  exerciseSubmissions,
  userProgress,
  lessons,
} from '../db/schema'
import { authenticate } from '../middleware/authenticate'
import {
  awardXP,
  updateStreak,
  logActivity,
  checkAndAwardBadges,
} from '../services/gamification'

const submitSchema = z.object({
  answer: z.number().int().min(0),
})

export async function progressRoutes(app: FastifyInstance): Promise<void> {
  // ─── Submit Exercise Answer ───────────────────────────────────────────────
  app.post<{ Params: { id: string } }>(
    '/exercises/:id/submit',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { sub: userId } = request.user as { sub: number }
      const exerciseId = parseInt(request.params.id, 10)

      const parsed = submitSchema.safeParse(request.body)
      if (!parsed.success) {
        return reply.code(400).send({ error: 'Validation failed', details: parsed.error.flatten() })
      }

      const [exercise] = await db
        .select()
        .from(exercises)
        .where(eq(exercises.id, exerciseId))

      if (!exercise) {
        return reply.code(404).send({ error: 'Exercise not found' })
      }

      // Check if already submitted (prevent re-submission)
      const existing = await db
        .select()
        .from(exerciseSubmissions)
        .where(
          and(
            eq(exerciseSubmissions.userId, userId),
            eq(exerciseSubmissions.exerciseId, exerciseId),
          ),
        )

      if (existing.length > 0) {
        return reply.code(409).send({
          error: 'Already submitted',
          isCorrect: existing[0].isCorrect,
          correctAnswer: exercise.correctAnswer,
          explanation: exercise.explanation,
        })
      }

      const isCorrect = parsed.data.answer === exercise.correctAnswer
      const xpEarned = isCorrect ? exercise.xpReward : 0

      // Record submission
      await db.insert(exerciseSubmissions).values({
        userId,
        exerciseId,
        answer: parsed.data.answer,
        isCorrect,
        xpEarned,
      })

      // Award XP and update activity
      let leveledUp = false
      let newLevel = 1
      let newXp = 0

      if (isCorrect) {
        const xpResult = await awardXP(userId, xpEarned)
        leveledUp = xpResult.leveledUp
        newLevel = xpResult.newLevel
        newXp = xpResult.newXp
        await updateStreak(userId)
        await logActivity(userId, { xpEarned, exercisesCompleted: 1 })
      }

      return reply.send({
        isCorrect,
        correctAnswer: exercise.correctAnswer,
        explanation: exercise.explanation,
        xpEarned,
        leveledUp,
        newLevel,
        newXp,
      })
    },
  )

  // ─── Complete Lesson ──────────────────────────────────────────────────────
  app.post<{ Params: { id: string } }>(
    '/lessons/:id/complete',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const { sub: userId } = request.user as { sub: number }
      const lessonId = parseInt(request.params.id, 10)

      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, lessonId))

      if (!lesson) {
        return reply.code(404).send({ error: 'Lesson not found' })
      }

      // Check if already completed
      const [existing] = await db
        .select()
        .from(userProgress)
        .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))

      if (existing?.completed) {
        return reply.code(409).send({ error: 'Lesson already completed' })
      }

      // Count correct submissions for this lesson's exercises
      const lessonExercises = await db
        .select({ id: exercises.id })
        .from(exercises)
        .where(eq(exercises.lessonId, lessonId))

      const exerciseIds = lessonExercises.map((e) => e.id)
      const totalExercises = exerciseIds.length

      // Count how many were answered correctly
      let correctCount = 0
      if (exerciseIds.length > 0) {
        const subs = await db
          .select({ isCorrect: exerciseSubmissions.isCorrect })
          .from(exerciseSubmissions)
          .where(eq(exerciseSubmissions.userId, userId))

        const submittedForLesson = subs.filter((s) => exerciseIds.includes)
        correctCount = subs.filter((s) => s.isCorrect).length
      }

      // Mark lesson as complete
      const xpEarned = lesson.xpReward
      const now = new Date()

      if (existing) {
        await db
          .update(userProgress)
          .set({ completed: true, score: correctCount, xpEarned, completedAt: now })
          .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
      } else {
        await db.insert(userProgress).values({
          userId,
          lessonId,
          completed: true,
          score: correctCount,
          xpEarned,
          completedAt: now,
        })
      }

      // Award XP for lesson completion
      const { newXp, newLevel, leveledUp } = await awardXP(userId, xpEarned)
      await updateStreak(userId)
      await logActivity(userId, { xpEarned, lessonsCompleted: 1 })

      // Check badges
      const newBadges = await checkAndAwardBadges(userId, {
        lessonId,
        level: newLevel,
      })

      return reply.send({
        lessonId,
        score: correctCount,
        totalExercises,
        xpEarned,
        newXp,
        newLevel,
        leveledUp,
        newBadges,
      })
    },
  )
}
