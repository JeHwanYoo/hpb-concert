import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { PrismaModule } from '../../prisma.connection/prisma.module'
import { PrismaService } from '../../prisma.connection/prisma.service'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
} from '../../../shared/shared.integrated.test.setup'
import { UserModel } from '../../../domain/user/model/user.model'
import { seedUsers } from '../../../shared/shared.integrated.test.seed'
import { ChargePrismaRepository } from './charge.prisma.repository'
import { faker } from '@faker-js/faker'
import { ChargeModel } from '../../../domain/charge/model/charge.model'

describe('ChargesPrismaRepository', () => {
  let repository: ChargePrismaRepository
  let prisma: PrismaService
  let users: UserModel[]

  beforeAll(
    setUpPipeline(
      // 1. Prepare a TestContainer for setting up a PostgreSQL instance.
      setUpPrismaIntegratedTest(async _prisma => {
        prisma = _prisma

        const module: TestingModule = await Test.createTestingModule({
          imports: [PrismaModule],
          providers: [ChargePrismaRepository],
        }).compile()
        await module.init()

        repository = module.get<ChargePrismaRepository>(ChargePrismaRepository)
      }),
      // 2. Seed user to resolve the constraint rule
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
    it("should create a user's charge", async () => {
      const createdCharge = await repository.create({
        userId: faker.helpers.arrayElement(users).id,
        amount: 1000,
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
          amount: 1000,
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
          amount: 1000,
        },
      })
    })

    it("should update a user's charge", async () => {
      const updatedCharge = await repository.update(createdCharge.userId, {
        amount: 2000,
      })()
      expect(updatedCharge.amount).to.be.deep.eq(2000)
    })
    it('should fail to update charge if given userId did not match to the original userId', async () => {
      const updatedCharge = await repository.update('fake-id', {
        amount: 2000,
      })()

      expect(updatedCharge).to.be.null
    })
  })
})
