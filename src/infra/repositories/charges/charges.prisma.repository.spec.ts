import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaModule } from '../../prisma/prisma.module'
import { PrismaService } from '../../prisma/prisma.service'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
} from '../../../shared/shared.integrated.test.setup'
import { UserModel } from '../../../domains/users/models/user.model'
import { seedUsers } from '../../../shared/shared.integrated.test.seed'
import { ChargesPrismaRepository } from './charges.prisma.repository'
import { faker } from '@faker-js/faker'
import { ChargeModel } from '../../../domains/charges/models/charge.model'

describe('ChargesPrismaRepository', () => {
  let repository: ChargesPrismaRepository
  let prisma: PrismaService
  let users: UserModel[]

  beforeAll(
    setUpPipeline(
      // 1. Prepare a TestContainer for setting up a PostgreSQL instance.
      setUpPrismaIntegratedTest(async _prisma => {
        prisma = _prisma

        const module: TestingModule = await Test.createTestingModule({
          imports: [PrismaModule],
          providers: [ChargesPrismaRepository],
        }).compile()
        await module.init()

        repository = module.get<ChargesPrismaRepository>(
          ChargesPrismaRepository,
        )
      }),
      // 2. Seed users to resolve the constraint rule
      async () => {
        users = await seedUsers(prisma)
      },
    ),
    1000 * 60 * 3,
  )

  // Initialize databases to ensure test idempotency
  afterEach(async () => {
    await prisma.charge.deleteMany()
  })

  it('should be defined', async () => {
    expect(repository).to.not.be.undefined
  })

  describe('.create()', () => {
    it("should create a user's charges", async () => {
      const createdCharge = await repository.create({
        userId: faker.helpers.arrayElement(users).id,
        amount: BigInt(1000),
      })()
      expect(createdCharge).to.have.keys('amount', 'id', 'userId')
    })
  })

  describe('.findOneBy()', () => {
    // Seed a charge to find
    let createdCharge: ChargeModel
    beforeEach(async () => {
      createdCharge = await prisma.charge.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          amount: BigInt(1000),
        },
      })
    })

    it("should find a user's charge", async () => {
      const foundCharge = await repository.findOneBy({
        id: createdCharge.id,
      })()
      expect(foundCharge).to.be.deep.eq(createdCharge)
    })
  })
  describe('.update()', () => {
    // Seed a charge to update
    let createdCharge: ChargeModel
    beforeEach(async () => {
      createdCharge = await prisma.charge.create({
        data: {
          userId: faker.helpers.arrayElement(users).id,
          amount: BigInt(1000),
        },
      })
    })

    it("should update a user's charge", async () => {
      const updatedCharge = await repository.update(createdCharge.id, {
        userId: createdCharge.userId,
        amount: BigInt(2000),
      })()
      expect(updatedCharge.amount).to.be.deep.eq(BigInt(2000))
    })
    it('should fail to update charge if given userId did not match to the original userId', async () => {
      const updatedCharge = await repository.update(createdCharge.id, {
        userId: 'fake-user-id',
        amount: BigInt(2000),
      })()

      expect(updatedCharge).to.be.null
    })
  })
})
