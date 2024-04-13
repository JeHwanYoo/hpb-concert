import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { PrismaModule } from '../../prisma/prisma.module'
import { PrismaService } from '../../prisma/prisma.service'
import { setUpPrismaIntegratedTest } from '../../../shared/integrated.test.setup'
import { ConcertsPrismaRepository } from './concerts.prisma.repository'

describe('UsersPrismaRepository', () => {
  let repository: ConcertsPrismaRepository
  let prisma: PrismaService

  // Prepare a TestContainer for setting up a PostgreSQL instance.
  beforeAll(
    setUpPrismaIntegratedTest(async _prisma => {
      prisma = _prisma

      const module: TestingModule = await Test.createTestingModule({
        imports: [PrismaModule],
        providers: [ConcertsPrismaRepository],
      }).compile()
      await module.init()

      repository = module.get<ConcertsPrismaRepository>(
        ConcertsPrismaRepository,
      )
    }),
    1000 * 60 * 3,
  )

  // Initialize databases to ensure test idempotency
  afterEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should be defined', async () => {
    expect(repository).to.not.be.undefined
  })
})
