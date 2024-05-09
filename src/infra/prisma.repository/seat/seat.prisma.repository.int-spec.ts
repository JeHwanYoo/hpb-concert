import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaModule } from '../../prisma/prisma.module'
import { PrismaService } from '../../prisma/prisma.service'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
} from '../../../shared/shared.integrated.test.setup'
import { SeatPrismaRepository } from './seat.prisma.repository'
import { addMinutes } from 'date-fns'
import { UserModel } from '../../../domain/user/model/user.model'
import { ConcertModel } from '../../../domain/concert/model/concert.model'
import {
  seedConcerts,
  seedUsers,
} from '../../../shared/shared.integrated.test.seed'
import { faker } from '@faker-js/faker'
import { SeatModel } from '../../../domain/seat/model/seat.model'

describe('SeatsPrismaRepository', () => {
  let repository: SeatPrismaRepository
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
          providers: [SeatPrismaRepository],
        }).compile()
        await module.init()

        repository = module.get<SeatPrismaRepository>(SeatPrismaRepository)
      }),
      // 2. Seed user and concert to resolve the constraint rule
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

  let uniqueSeatNo = 0

  describe('.create()', () => {
    it('should create a seat', async () => {
      const reservedAt = new Date()
      const deadline = addMinutes(reservedAt, 5)
      const createdSeat = await repository.create({
        seatNo: uniqueSeatNo++,
        holderId: faker.helpers.arrayElement(users).id, // pick randomly
        concertId: faker.helpers.arrayElement(concerts).id, // pick randomly
        reservedAt,
        deadline,
      })()
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
        seatNo: uniqueSeatNo++,
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
      })()
      expect(foundSeat).to.be.deep.eq(createdSeat)
    })
  })
  describe('.findOneBy()', () => {
    it('should find the seat which matched to id', async () => {
      const foundSeat = await repository.findOneBy({
        id: createdSeat.id,
      })()
      expect(foundSeat).to.be.deep.eq(createdSeat)
    })
  })
  describe('.update()', () => {
    it('should update the seat which matched to id', async () => {
      const paidAt = new Date()
      const paidSeat = await repository.update(createdSeat.id, {
        paidAt,
      })()
      expect(paidSeat.paidAt).to.be.deep.eq(paidAt)
    })
    it('should fail to update the seat which does not match to id', async () => {
      const paidAt = new Date()
      const noPaidSeat = await repository.update('fake-id', {
        paidAt,
      })()
      expect(noPaidSeat).to.be.null
    })
  })
})
