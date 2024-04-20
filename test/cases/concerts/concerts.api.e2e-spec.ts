import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
  setUpRedisIntegratedTest,
} from '../../../src/shared/shared.integrated.test.setup'
import Redis from 'ioredis'
import { PrismaService } from '../../../src/infra/prisma/prisma.service'
import { AppModule } from '../../../src/app.module'
import { agent } from 'supertest'
import { JwtService } from '@nestjs/jwt'
import { v4 as uuidV4 } from 'uuid'
import { ConcertsPostRequestDto } from '../../../src/apis/concerts/dto/concerts.api.dto'
import { faker } from '@faker-js/faker'
import { ConcertModel } from '../../../src/domains/concerts/models/concert.model'

describe('ConcertsAPIController (e2e)', () => {
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

  // Initialize database to ensure test idempotency
  afterEach(async () => {
    await prisma.bill.deleteMany()
    await prisma.seat.deleteMany()
    await prisma.concert.deleteMany()
  })

  it('should be defined', () => {
    expect(app).to.be.not.be.undefined
    expect(redis).to.not.be.undefined
    expect(prisma).to.not.be.undefined
  })

  describe('POST /concerts', () => {
    it('should post a concert', async () => {
      const concertPostRequestDto = seedConcertPostRequestDto()
      const result = await request
        .post('/v1/concerts')
        .send(concertPostRequestDto)

      expect(result.status).to.be.eq(201)
      expect(result.body.id).to.be.a('string')
    })
  })

  describe('GET /concerts', () => {
    // seed concerts
    beforeAll(async () => {
      await prisma.concert.createMany({
        data: Array.from({ length: 5 }, () => seedConcertPostRequestDto()),
      })
    })
  })

  it('should get 5 concerts', async () => {
    const concertsResponse = await request.get('/v1/concerts')

    expect(concertsResponse.status).to.be.eq(200)
    expect(concertsResponse.body).to.be.instanceof(Array)
    expect(concertsResponse.body.length).to.be.eq(5)
  })
})

interface ConcertPostRequestDtoSeeder {
  openingAt?: Date
  willCloseDays?: number
  willHoldDays?: number
}

/**
 *
 * @param seeder
 * @returns seeded Concert
 */
function seedConcertPostRequestDto(
  seeder?: ConcertPostRequestDtoSeeder,
): ConcertsPostRequestDto {
  const openingAt = seeder?.openingAt ?? new Date()
  const closingAt = faker.date.soon({
    refDate: openingAt,
    days: seeder?.willCloseDays ?? 7,
  })
  const eventDate = faker.date.soon({
    refDate: closingAt,
    days: seeder?.willHoldDays ?? 7,
  })
  return {
    capacity: faker.number.int({ min: 10, max: 100 }),
    price:
      Math.round(faker.number.float({ min: 10, max: 50, precision: 3 })) * 1000,
    openingAt,
    closingAt,
    eventDate,
  }
}
