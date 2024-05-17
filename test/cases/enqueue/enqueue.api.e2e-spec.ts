import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, VersioningType } from '@nestjs/common'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
  setUpRedisIntegratedTest,
} from '../../../src/shared/shared.integrated.test.setup'
import Redis from 'ioredis'
import { PrismaService } from '../../../src/infra/prisma.connection/prisma.service'
import { AppModule } from '../../../src/app.module'
import { agent } from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidV4 } from 'uuid'
import { EnqueueTokenModel } from '../../../src/domain/token/model/token.model'

describe('EnqueueApiController (e2e)', () => {
  let app: INestApplication
  let redis: Redis
  let prisma: PrismaService
  let request: ReturnType<typeof agent>
  let mockUserId: string
  const jwtService = new JwtService()

  beforeAll(
    setUpPipeline(
      setUpRedisIntegratedTest(async _redis => {
        redis = _redis
      }),
      setUpPrismaIntegratedTest(async _prisma => {
        prisma = _prisma
      }),
      async () => {
        process.env.JWT_SECRET = 'test'

        const moduleFixture: TestingModule = await Test.createTestingModule({
          imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        app.enableVersioning({
          type: VersioningType.URI,
          prefix: 'v',
        })

        await app.init()

        // mock authorization
        mockUserId = uuidV4()
        request = agent(app.getHttpServer())
        request.set(
          'Authorization',
          `Bearer ${jwtService.sign(
            {
              userId: mockUserId,
            },
            { secret: process.env.JWT_SECRET },
          )}`,
        )
      },
    ),
    1000 * 60 * 3,
  )

  // Initialize redis to ensure test idempotency
  afterEach(async () => {
    await redis.flushdb()
  })

  it('should be defined', () => {
    expect(app).to.be.not.be.undefined
    expect(redis).to.not.be.undefined
    expect(prisma).to.not.be.undefined
  })

  describe('POST /enqueue', () => {
    it('Use case - EnqueueUsecaseCreateToken (201)', async () => {
      const response = await request.post('/v1/enqueues')

      expect(response.status).to.be.eq(201)
      expect(response.text).to.be.a('string')

      const decoded = jwtService.decode<EnqueueTokenModel>(response.text)

      expect(decoded).to.be.a('object')
      expect(decoded.userId).to.be.eq(mockUserId)
      expect(decoded.completed).to.be.false
      expect(decoded.exp - decoded.availableTime).to.be.greaterThanOrEqual(
        60 * 5,
      )
    })
  })
})
