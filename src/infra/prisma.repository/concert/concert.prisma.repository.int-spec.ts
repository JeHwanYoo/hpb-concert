import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaModule } from '../../prisma.connection/prisma.module'
import { PrismaService } from '../../prisma.connection/prisma.service'
import { setUpPrismaIntegratedTest } from '../../../shared/shared.integrated.test.setup'
import { ConcertPrismaRepository } from './concert.prisma.repository'
import { ConcertCreationModel } from '../../../domain/concert/model/concert.model'
import { faker } from '@faker-js/faker'

describe('ConcertsPrismaRepository', () => {
  let repository: ConcertPrismaRepository
  let prisma: PrismaService

  // Prepare a TestContainer for setting up a PostgreSQL instance.
  beforeAll(
    setUpPrismaIntegratedTest(async _prisma => {
      prisma = _prisma

      const module: TestingModule = await Test.createTestingModule({
        imports: [PrismaModule],
        providers: [ConcertPrismaRepository],
      }).compile()
      await module.init()

      repository = module.get<ConcertPrismaRepository>(ConcertPrismaRepository)
    }),
    1000 * 60 * 3,
  )

  // Initialize databases to ensure test idempotency
  afterEach(async () => {
    await prisma.concert.deleteMany()
  })

  it('should be defined', async () => {
    expect(repository).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should create a concert', async () => {
      const openingAt = new Date()
      const closingAt = faker.date.future({ refDate: openingAt })
      const eventDate = faker.date.future({ refDate: closingAt })
      const createdModel: ConcertCreationModel = {
        capacity: 100,
        price: 10000,
        openingAt,
        closingAt,
        eventDate,
      }
      const createdConcert = await repository.create(createdModel)()
      expect(createdConcert).to.have.keys(
        'id',
        'capacity',
        'price',
        'createdAt',
        'updatedAt',
        'openingAt',
        'closingAt',
        'eventDate',
      )
    })
  })

  describe('.find()', () => {
    let createdConcerts: Awaited<ReturnType<typeof prisma.concert.findMany>>

    beforeEach(async () => {
      await prisma.concert.createMany({
        data: Array.from({ length: 10 }, () => {
          const openingAt = new Date()
          const closingAt = faker.date.future({ refDate: openingAt })
          const eventDate = faker.date.future({ refDate: closingAt })
          return {
            capacity: faker.number.int(100),
            price: faker.number.int(30000),
            openingAt,
            closingAt,
            eventDate,
          }
        }),
      })

      createdConcerts = await prisma.concert.findMany()
    })

    it('should find all concert', async () => {
      const foundConcerts = await repository.findManyBy({})()
      expect(foundConcerts).to.be.deep.eq(createdConcerts)
    })
  })
})
