import { eq, and, inArray } from 'drizzle-orm'
import { db } from '../db'
import { trails, lessons, exercises, userProgress, exerciseSubmissions } from '../db/schema'

export class TrailsRepository {
  async findAllActiveTrails() {
    return db.select().from(trails).where(eq(trails.isActive, true)).orderBy(trails.order)
  }

  async findTrailById(id: number) {
    const [trail] = await db.select().from(trails).where(eq(trails.id, id))
    return trail || null
  }

  async findLessonsByTrailId(trailId: number) {
    return db.select().from(lessons).where(eq(lessons.trailId, trailId)).orderBy(lessons.order)
  }

  async findLessonById(id: number) {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id))
    return lesson || null
  }

  async findExercisesByLessonId(lessonId: number) {
    return db.select().from(exercises).where(eq(exercises.lessonId, lessonId)).orderBy(exercises.order)
  }

  async findUserCompletedProgress(userId: number) {
    return db
      .select({ lessonId: userProgress.lessonId })
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.completed, true)))
  }

  async findUserProgressForLessons(userId: number, lessonIds: number[]) {
    if (lessonIds.length === 0) return []
    return db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), inArray(userProgress.lessonId, lessonIds)))
  }

  async findUserProgressForLesson(userId: number, lessonId: number) {
    const [progress] = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)))
    return progress || null
  }

  async findUserSubmissions(userId: number) {
    return db
      .select({ exerciseId: exerciseSubmissions.exerciseId, isCorrect: exerciseSubmissions.isCorrect })
      .from(exerciseSubmissions)
      .where(eq(exerciseSubmissions.userId, userId))
  }
}
