import { FastifyRequest, FastifyReply } from 'fastify'
import { TrailsService } from '../services/trails.service'
import { AppError } from '../errors/AppError'

export class TrailsController {
  private trailsService: TrailsService

  constructor() {
    this.trailsService = new TrailsService()
  }

  async listTrails(request: FastifyRequest, reply: FastifyReply) {
    try {
      request.log.info({ msg: 'Starting listTrails', userId: (request.user as any)?.sub })
      
      const { sub: userId } = request.user as { sub: number }
      const trails = await this.trailsService.getAllTrailsWithProgress(userId)
      
      request.log.info({ msg: 'Successfully fetched trails', count: trails.length })
      return reply.send({ trails })
    } catch (error) {
      request.log.error({ msg: 'Error in listTrails', error })
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message })
      }
      return reply.code(500).send({ error: 'Internal Server Error' })
    }
  }

  async getTrail(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const trailId = parseInt(request.params.id, 10)
      request.log.info({ msg: 'Starting getTrail', trailId })

      const { sub: userId } = request.user as { sub: number }
      
      if (isNaN(trailId)) {
        throw new AppError('Invalid trail ID', 400)
      }

      const trail = await this.trailsService.getTrailDetails(userId, trailId)
      
      request.log.info({ msg: 'Successfully fetched trail details', trailId })
      return reply.send(trail)
    } catch (error) {
      request.log.error({ msg: 'Error in getTrail', error })
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message })
      }
      return reply.code(500).send({ error: 'Internal Server Error' })
    }
  }

  async getLesson(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const lessonId = parseInt(request.params.id, 10)
      request.log.info({ msg: 'Starting getLesson', lessonId })

      const { sub: userId } = request.user as { sub: number }

      if (isNaN(lessonId)) {
        throw new AppError('Invalid lesson ID', 400)
      }

      const lesson = await this.trailsService.getLessonDetails(userId, lessonId)
      
      request.log.info({ msg: 'Successfully fetched lesson details', lessonId })
      return reply.send(lesson)
    } catch (error) {
      request.log.error({ msg: 'Error in getLesson', error })
      if (error instanceof AppError) {
        return reply.code(error.statusCode).send({ error: error.message })
      }
      return reply.code(500).send({ error: 'Internal Server Error' })
    }
  }
}
