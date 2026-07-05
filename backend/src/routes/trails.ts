import { FastifyInstance } from 'fastify'
import { authenticate } from '../middleware/authenticate'
import { TrailsController } from '../controllers/trails.controller'

export async function trailRoutes(app: FastifyInstance): Promise<void> {
  const trailsController = new TrailsController()

  // ─── List All Trails ──────────────────────────────────────────────────────
  app.get('/trails', { preHandler: [authenticate] }, trailsController.listTrails.bind(trailsController))

  // ─── Get Trail With Lessons ───────────────────────────────────────────────
  app.get<{ Params: { id: string } }>('/trails/:id', { preHandler: [authenticate] }, trailsController.getTrail.bind(trailsController))

  // ─── Get Lesson With Exercises ────────────────────────────────────────────
  app.get<{ Params: { id: string } }>('/lessons/:id', { preHandler: [authenticate] }, trailsController.getLesson.bind(trailsController))
}
