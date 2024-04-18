import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { PrismaModule } from '../../prisma/prisma.module'
import { PrismaService } from '../../prisma/prisma.service'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
} from '../../../shared/shared.integrated.test.setup'
import { UserModel } from '../../../domains/users/models/user.model'
import {
  seedConcerts,
  seedSeats,
  seedUsers,
} from '../../../shared/shared.integrated.test.seed'
import { BillsPrismaRepository } from './bills.prisma.repository'
import { ConcertModel } from '../../../domains/concerts/models/concert.model'
import { SeatModel } from '../../../domains/seats/models/seat.model'
import { faker } from '@faker-js/faker'

describe('BillsPrismaRepository', () => {
  let repository: BillsPrismaRepository
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
          providers: [BillsPrismaRepository],
        }).compile()
        await module.init()

        repository = module.get<BillsPrismaRepository>(BillsPrismaRepository)
      }),
      // 2. Seed users and concerts and seats to resolve the constraint rule
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
        amount: BigInt(10000),
      })

      expect(createdBill).to.have.keys(
        'amount',
        'createdAt',
        'holderId',
        'id',
        'seatId',
      )
    })
  })

  describe.todo('.findOneBy()')
})
