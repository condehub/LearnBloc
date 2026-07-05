import { TrailsRepository } from '../repositories/trails.repository'
import { AppError } from '../errors/AppError'

export class TrailsService {
  private trailsRepo: TrailsRepository

  constructor() {
    this.trailsRepo = new TrailsRepository()
  }

  async getAllTrailsWithProgress(userId: number) {
    const allTrails = await this.trailsRepo.findAllActiveTrails()
    
    // Enrich with user progress summary for each trail
    const enriched = await Promise.all(
      allTrails.map(async (trail) => {
        const trailLessons = await this.trailsRepo.findLessonsByTrailId(trail.id)
        const lessonIds = trailLessons.map((l) => l.id)
        const totalLessons = lessonIds.length

        const completedProgress = totalLessons > 0 
          ? await this.trailsRepo.findUserCompletedProgress(userId)
          : []

        const completedInTrail = completedProgress.filter((p) => lessonIds.includes(p.lessonId)).length

        return {
          ...trail,
          totalLessons,
          completedLessons: completedInTrail,
          progressPercent: totalLessons > 0 ? Math.round((completedInTrail / totalLessons) * 100) : 0,
        }
      })
    )

    return enriched
  }

  async getTrailDetails(userId: number, trailId: number) {
    const trail = await this.trailsRepo.findTrailById(trailId)
    if (!trail) {
      throw new AppError('Trail not found', 404)
    }

    const trailLessons = await this.trailsRepo.findLessonsByTrailId(trailId)
    
    const progressMap = new Map<number, { completed: boolean; score: number; xpEarned: number }>()
    if (trailLessons.length > 0) {
      const lessonIds = trailLessons.map(l => l.id)
      const progress = await this.trailsRepo.findUserProgressForLessons(userId, lessonIds)

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

    return {
      ...trail,
      lessons: lessonsWithProgress,
    }
  }

  async getLessonDetails(userId: number, lessonId: number) {
    const lesson = await this.trailsRepo.findLessonById(lessonId)
    if (!lesson) {
      throw new AppError('Lesson not found', 404)
    }

    const lessonExercises = await this.trailsRepo.findExercisesByLessonId(lessonId)
    
    // Get which exercises the user already submitted
    const submissions = await this.trailsRepo.findUserSubmissions(userId)
    const submittedMap = new Map(submissions.map((s) => [s.exerciseId, s.isCorrect]))

    const progress = await this.trailsRepo.findUserProgressForLesson(userId, lessonId)

    return {
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
              userAnswer: undefined, // stored in submissions (can be expanded if needed)
              isCorrect: submittedMap.get(ex.id),
            }
          : {}),
      })),
      userProgress: progress,
    }
  }
}
