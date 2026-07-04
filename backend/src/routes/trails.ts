import { FastifyInstance } from 'fastify'
import { eq, and } from 'drizzle-orm'
import { db } from '../db'
import { trails, lessons, exercises, userProgress, exerciseSubmissions } from '../db/schema'
import { authenticate } from '../middleware/authenticate'

export async function trailRoutes(app: FastifyInstance): Promise<void> {
  // ─── List All Trails ──────────────────────────────────────────────────────
  app.get('/trails', { preHandler: [authenticate] }, async (request, reply) => {
    const { sub: userId } = request.user as { sub: number }

    const allTrails = await db
      .select()
      .from(trails)
      .where(eq(trails.isActive, true))
      .orderBy(trails.order)

    // Enrich with user progress summary for each trail
    const enriched = await Promise.all(
      allTrails.map(async (trail) => {
        const trailLessons = await db
          .select({ id: lessons.id })
          .from(lessons)
          .where(eq(lessons.trailId, trail.id))

        const lessonIds = trailLessons.map((l) => l.id)
        const totalLessons = lessonIds.length

        const completedProgress = totalLessons > 0
          ? await db
              .select({ lessonId: userProgress.lessonId })
              .from(userProgress)
              .where(
                and(
                  eq(userProgress.userId, userId),
                  eq(userProgress.completed, true),
                ),
              )
          : []

        const completedInTrail = completedProgress.filter((p) => lessonIds.includes(p.lessonId)).length

        return {
          ...trail,
          totalLessons,
          completedLessons: completedInTrail,
          progressPercent: totalLessons > 0 ? Math.round((completedInTrail / totalLessons) * 100) : 0,
        }
      }),
    )

    return reply.send({ trails: enriched })
  })

  // ─── Get Trail With Lessons ───────────────────────────────────────────────
  app.get<{ Params: { id: string } }>('/trails/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { sub: userId } = request.user as { sub: number }
    const trailId = parseInt(request.params.id, 10)

    const [trail] = await db
      .select()
      .from(trails)
      .where(eq(trails.id, trailId))

    if (!trail) {
      return reply.code(404).send({ error: 'Trail not found' })
    }

    const trailLessons = await db
      .select()
      .from(lessons)
      .where(eq(lessons.trailId, trailId))
      .orderBy(lessons.order)

    // Get user progress for each lesson
    const progressMap = new Map<number, { completed: boolean; score: number; xpEarned: number }>()
    if (trailLessons.length > 0) {
      const progress = await db
        .select()
        .from(userProgress)
        .where(eq(userProgress.userId, userId))

      for (const p of progress) {
        progressMap.set(p.lessonId, { completed: p.completed, score: p.score, xpEarned: p.xpEarned })
      }
    }

    // Lessons are sequential: only first is unlocked, or unlocked if previous is completed
    const lessonsWithProgress = trailLessons.map((lesson, index) => {
      const progress = progressMap.get(lesson.id)
      const isUnlocked = index === 0 || progressMap.get(trailLessons[index - 1].id)?.completed === true

      return {
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        xpReward: lesson.xpReward,
        isUnlocked,
        completed: progress?.completed ?? false,
        score: progress?.score ?? 0,
        xpEarned: progress?.xpEarned ?? 0,
      }
    })

    return reply.send({
      ...trail,
      lessons: lessonsWithProgress,
    })
  })

  // ─── Get Lesson With Exercises ────────────────────────────────────────────
  app.get<{ Params: { id: string } }>('/lessons/:id', { preHandler: [authenticate] }, async (request, reply) => {
    const { sub: userId } = request.user as { sub: number }
    const lessonId = parseInt(request.params.id, 10)

    const [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId))

    if (!lesson) {
      return reply.code(404).send({ error: 'Lesson not found' })
    }

    const lessonExercises = await db
      .select()
      .from(exercises)
      .where(eq(exercises.lessonId, lessonId))
      .orderBy(exercises.order)

    // Get which exercises the user already submitted
    const submissions = await db
      .select({ exerciseId: exerciseSubmissions.exerciseId, isCorrect: exerciseSubmissions.isCorrect })
      .from(exerciseSubmissions)
      .where(eq(exerciseSubmissions.userId, userId))

    const submittedMap = new Map(submissions.map((s) => [s.exerciseId, s.isCorrect]))

    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))

    return reply.send({
      ...lesson,
      exercises: lessonExercises.map((ex) => ({
        id: ex.id,
        question: ex.question,
        options: ex.options,
        order: ex.order,
        xpReward: ex.xpReward,
        // Only reveal explanation and correct answer if user already submitted
        ...(submittedMap.has(ex.id)
          ? {
              correctAnswer: ex.correctAnswer,
              explanation: ex.explanation,
              userAnswer: undefined, // stored in submissions
              isCorrect: submittedMap.get(ex.id),
            }
          : {}),
      })),
      userProgress: progress ?? null,
    })
  })
}
