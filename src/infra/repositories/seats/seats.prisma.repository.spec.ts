import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaModule } from '../../prisma/prisma.module'
import { PrismaService } from '../../prisma/prisma.service'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
} from '../../../shared/shared.integrated.test.setup'
import { SeatsPrismaRepository } from './seats.prisma.repository'
import { addMinutes } from 'date-fns'
import { UserModel } from '../../../domains/users/models/user.model'
import { ConcertModel } from '../../../domains/concerts/models/concert.model'
import {
  seedConcerts,
  seedUsers,
} from '../../../shared/shared.integrated.test.seed'
import { faker } from '@faker-js/faker'
import { SeatModel } from '../../../domains/seats/models/seat.model'

describe('SeatsPrismaRepository', () => {
  let repository: SeatsPrismaRepository
  let prisma: PrismaService
  let users: UserModel[]
  let concerts: ConcertModel[]

  beforeAll(
    setUpPipeline(
      // 1. Prepare a TestContainer for setting up a PostgreSQL instance.
      setUpPrismaIntegratedTest(async _prisma => {
        prisma = _prisma

        const module: TestingModule = await Test.createTestingModule({
          imports: [PrismaModule],
          providers: [SeatsPrismaRepository],
        }).compile()
        await module.init()

        repository = module.get<SeatsPrismaRepository>(SeatsPrismaRepository)
      }),
      // 2. Seed users and concerts to resolve the constraint rule
      async () => {
        users = await seedUsers(prisma)
        concerts = await seedConcerts(prisma)
      },
    ),
    1000 * 60 * 3,
  )

  // Initialize databases to ensure test idempotency
  afterEach(async () => {
    await prisma.seat.deleteMany()
  })

  it('should be defined', async () => {
    expect(repository).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should create a seat', async () => {
      const reservedAt = new Date()
      const deadline = addMinutes(reservedAt, 5)
      const createdSeat = await repository.create({
        seatNo: 0,
        holderId: faker.helpers.arrayElement(users).id, // pick randomly
        concertId: faker.helpers.arrayElement(concerts).id, // pick randomly
        reservedAt,
        deadline,
      })
      expect(createdSeat).to.have.keys(
        'concertId',
        'createdAt',
        'deadline',
        'holderId',
        'id',
        'paidAt',
        'reservedAt',
        'seatNo',
      )
    })
  })

  // Seed a seat to find and update
  let createdSeat: SeatModel
  beforeEach(async () => {
    const reservedAt = new Date()
    const deadline = addMinutes(reservedAt, 5)
    createdSeat = await prisma.seat.create({
      data: {
        seatNo: 0,
        holderId: faker.helpers.arrayElement(users).id, // pick randomly
        concertId: faker.helpers.arrayElement(concerts).id, // pick randomly
        reservedAt,
        deadline,
      },
    })
  })

  describe('.findManyBy()', () => {
    it('should find the seat which matched to concertId', async () => {
      const [foundSeat] = await repository.findManyBy({
        concertId: createdSeat.concertId,
      })
      expect(foundSeat).to.be.deep.eq(createdSeat)
    })
  })
  describe('.findOneBy()', () => {
    it('should find the seat which matched to id', async () => {
      const foundSeat = await repository.findOneBy({
        id: createdSeat.id,
      })
      expect(foundSeat).to.be.deep.eq(createdSeat)
    })
  })
  describe.todo('.update()')
})
