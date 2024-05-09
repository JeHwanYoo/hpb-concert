import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { PrismaModule } from '../../prisma.connection/prisma.module'
import { PrismaService } from '../../prisma.connection/prisma.service'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
} from '../../../shared/shared.integrated.test.setup'
import { UserModel } from '../../../domain/user/model/user.model'
import {
  seedConcerts,
  seedSeats,
  seedUsers,
} from '../../../shared/shared.integrated.test.seed'
import { BillPrismaRepository } from './bill.prisma.repository'
import { ConcertModel } from '../../../domain/concert/model/concert.model'
import { SeatModel } from '../../../domain/seat/model/seat.model'
import { faker } from '@faker-js/faker'

describe('BillsPrismaRepository', () => {
  let repository: BillPrismaRepository
  let prisma: PrismaService
  let users: UserModel[]
  let concerts: ConcertModel[]
  let seats: SeatModel[]

  beforeAll(
    setUpPipeline(
      // 1. Prepare a TestContainer for setting up a PostgreSQL instance.
      setUpPrismaIntegratedTest(async _prisma => {
        prisma = _prisma

        const module: TestingModule = await Test.createTestingModule({
          imports: [PrismaModule],
          providers: [BillPrismaRepository],
        }).compile()
        await module.init()

        repository = module.get<BillPrismaRepository>(BillPrismaRepository)
      }),
      // 2. Seed user and concert and seat to resolve the constraint rule
      async () => {
        users = await seedUsers(prisma)
        concerts = await seedConcerts(prisma)
        seats = await seedSeats(prisma, users, concerts)
      },
    ),
    1000 * 60 * 3,
  )

  // Initialize databases to ensure test idempotency
  afterEach(async () => {
    await prisma.bill.deleteMany()
  })

  it('should be defined', async () => {
    expect(repository).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should create a bill', async () => {
      const createdBill = await repository.create({
        holderId: faker.helpers.arrayElement(users).id,
        seatId: faker.helpers.arrayElement(seats).id,
        amount: 10000,
      })()

      expect(createdBill).to.have.keys(
        'amount',
        'createdAt',
        'holderId',
        'id',
        'seatId',
      )
    })
  })

  describe('.findOneBy()', () => {
    it('should find a bill', async () => {
      const createdBill = await prisma.bill.create({
        data: {
          holderId: faker.helpers.arrayElement(users).id,
          seatId: faker.helpers.arrayElement(seats).id,
          amount: 10000,
        },
      })

      const foundBill = await repository.findOneBy({
        id: createdBill.id,
      })()

      expect(foundBill).to.be.deep.eq(createdBill)
    })
  })
})
