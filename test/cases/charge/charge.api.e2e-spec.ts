import { afterEach, beforeAll, beforeEach, describe, it, expect } from 'vitest'
import { INestApplication, VersioningType } from '@nestjs/common'
import Redis from 'ioredis'
import { PrismaService } from '../../../src/infra/prisma.connection/prisma.service'
import { agent } from 'supertest'
import { JwtService } from '@nestjs/jwt'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
  setUpRedisIntegratedTest,
} from '../../../src/shared/shared.integrated.test.setup'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../../src/app.module'

describe('ChargeAPIController (e2e)', () => {
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

        request = agent(app.getHttpServer())
      },
    ),
    1000 * 60 * 3,
  )

  beforeEach(async () => {
    // mock authorization
    const user = await prisma.user.create({ data: { name: 'John Doe' } })
    mockUserId = user.id
    setAuthorization(
      request,
      jwtService.sign(
        {
          userId: mockUserId,
        },
        { secret: process.env.JWT_SECRET },
      ),
    )
  })

  // Initialize redis to ensure test idempotency
  afterEach(async () => {
    await redis.flushdb()
  })

  describe('concurrency test', () => {
    it('Consistency must be maintained even when requests come in at almost the same time.', async () => {
      await Promise.allSettled(
        Array.from({ length: 500 }, () =>
          request.patch(`/v1/charges`).send({
            action: 'charge',
            amount: 1000,
          }),
        ),
      )

      const response = await request.get(`v1/charges`)
      expect(response.body.amount).toBe(500000)
    })
  })
})

function setAuthorization(request: ReturnType<typeof agent>, token: string) {
  request.set('Authorization', `Bearer ${token}`)
}
