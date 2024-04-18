import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { PrismaModule } from '../../prisma/prisma.module'
import { PrismaService } from '../../prisma/prisma.service'
import {
  setUpPipeline,
  setUpPrismaIntegratedTest,
} from '../../../shared/shared.integrated.test.setup'
import { UserModel } from '../../../domains/users/models/user.model'
import { seedUsers } from '../../../shared/shared.integrated.test.seed'
import { ChargesPrismaRepository } from './charges.prisma.repository'

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
      // 2. Seed users and concerts to resolve the constraint rule
      async () => {
        users = await seedUsers(prisma)
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

  describe.todo('.create()')
  describe.todo('.findOneBy()')
  describe.todo('.update()')
})
