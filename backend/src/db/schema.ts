import {
  pgTable,
  serial,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  date,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  xp: integer('xp').notNull().default(0),
  level: integer('level').notNull().default(1),
  streak: integer('streak').notNull().default(0),
  lastActivityDate: date('last_activity_date'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  progress: many(userProgress),
  submissions: many(exerciseSubmissions),
  badges: many(userBadges),
  activityLog: many(activityLog),
  refreshTokens: many(refreshTokens),
}))

// ─── Refresh Tokens ───────────────────────────────────────────────────────────

export const refreshTokens = pgTable('refresh_tokens', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, { fields: [refreshTokens.userId], references: [users.id] }),
}))

// ─── Trails ───────────────────────────────────────────────────────────────────

export const trails = pgTable('trails', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 200 }).notNull(),
  description: text('description').notNull(),
  order: integer('order').notNull().default(0),
  isActive: boolean('is_active').notNull().default(true),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const trailsRelations = relations(trails, ({ many }) => ({
  lessons: many(lessons),
}))

// ─── Lessons ──────────────────────────────────────────────────────────────────

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  trailId: integer('trail_id').notNull().references(() => trails.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 200 }).notNull(),
  theoryContent: text('theory_content').notNull(),
  references: jsonb('references').$type<{ title: string; url: string }[]>().default([]),
  order: integer('order').notNull().default(0),
  xpReward: integer('xp_reward').notNull().default(100),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  trail: one(trails, { fields: [lessons.trailId], references: [trails.id] }),
  exercises: many(exercises),
  progress: many(userProgress),
}))

// ─── Exercises ────────────────────────────────────────────────────────────────

export const exercises = pgTable('exercises', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  options: jsonb('options').$type<string[]>().notNull(),
  correctAnswer: integer('correct_answer').notNull(), // index of correct option
  explanation: text('explanation').notNull(),
  order: integer('order').notNull().default(0),
  xpReward: integer('xp_reward').notNull().default(10),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  lesson: one(lessons, { fields: [exercises.lessonId], references: [lessons.id] }),
  submissions: many(exerciseSubmissions),
}))

// ─── User Progress ────────────────────────────────────────────────────────────

export const userProgress = pgTable(
  'user_progress',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    lessonId: integer('lesson_id').notNull().references(() => lessons.id, { onDelete: 'cascade' }),
    completed: boolean('completed').notNull().default(false),
    score: integer('score').notNull().default(0), // number of correct answers
    xpEarned: integer('xp_earned').notNull().default(0),
    completedAt: timestamp('completed_at'),
    startedAt: timestamp('started_at').defaultNow().notNull(),
  },
  (table) => ({
    userLessonIdx: uniqueIndex('user_lesson_idx').on(table.userId, table.lessonId),
  }),
)

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, { fields: [userProgress.userId], references: [users.id] }),
  lesson: one(lessons, { fields: [userProgress.lessonId], references: [lessons.id] }),
}))

// ─── Exercise Submissions ─────────────────────────────────────────────────────

export const exerciseSubmissions = pgTable(
  'exercise_submissions',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id').notNull().references(() => exercises.id, { onDelete: 'cascade' }),
    answer: integer('answer').notNull(), // index of selected option
    isCorrect: boolean('is_correct').notNull(),
    xpEarned: integer('xp_earned').notNull().default(0),
    submittedAt: timestamp('submitted_at').defaultNow().notNull(),
  },
  (table) => ({
    userExerciseIdx: index('user_exercise_idx').on(table.userId, table.exerciseId),
  }),
)

export const exerciseSubmissionsRelations = relations(exerciseSubmissions, ({ one }) => ({
  user: one(users, { fields: [exerciseSubmissions.userId], references: [users.id] }),
  exercise: one(exercises, { fields: [exerciseSubmissions.exerciseId], references: [exercises.id] }),
}))

// ─── Badges ───────────────────────────────────────────────────────────────────

export const badges = pgTable('badges', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 100 }).notNull(), // icon name from lucide/expo-vector-icons
  type: varchar('type', { length: 50 }).notNull(), // 'lesson', 'trail', 'streak', 'level'
  requirement: jsonb('requirement').$type<Record<string, unknown>>().notNull(), // flexible criteria
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const badgesRelations = relations(badges, ({ many }) => ({
  userBadges: many(userBadges),
}))

// ─── User Badges ──────────────────────────────────────────────────────────────

export const userBadges = pgTable(
  'user_badges',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    badgeId: integer('badge_id').notNull().references(() => badges.id, { onDelete: 'cascade' }),
    earnedAt: timestamp('earned_at').defaultNow().notNull(),
  },
  (table) => ({
    userBadgeIdx: uniqueIndex('user_badge_idx').on(table.userId, table.badgeId),
  }),
)

export const userBadgesRelations = relations(userBadges, ({ one }) => ({
  user: one(users, { fields: [userBadges.userId], references: [users.id] }),
  badge: one(badges, { fields: [userBadges.badgeId], references: [badges.id] }),
}))

// ─── Activity Log (Heatmap) ───────────────────────────────────────────────────

export const activityLog = pgTable(
  'activity_log',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    date: date('date').notNull(),
    xpEarned: integer('xp_earned').notNull().default(0),
    lessonsCompleted: integer('lessons_completed').notNull().default(0),
    exercisesCompleted: integer('exercises_completed').notNull().default(0),
  },
  (table) => ({
    userDateIdx: uniqueIndex('user_date_idx').on(table.userId, table.date),
  }),
)

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(users, { fields: [activityLog.userId], references: [users.id] }),
}))

// ─── Type Exports ─────────────────────────────────────────────────────────────

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Trail = typeof trails.$inferSelect
export type NewTrail = typeof trails.$inferInsert
export type Lesson = typeof lessons.$inferSelect
export type NewLesson = typeof lessons.$inferInsert
export type Exercise = typeof exercises.$inferSelect
export type NewExercise = typeof exercises.$inferInsert
export type UserProgress = typeof userProgress.$inferSelect
export type Badge = typeof badges.$inferSelect
export type UserBadge = typeof userBadges.$inferSelect
export type ActivityLog = typeof activityLog.$inferSelect
