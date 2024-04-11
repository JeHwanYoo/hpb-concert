import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UsersPrismaRepository } from './users.prisma.repository'
import { PrismaModule } from '../../prisma/prisma.module'
import { PrismaService } from '../../prisma/prisma.service'
import { setUpIntegratedTest } from '../../../shared/integrated.test.setup'

describe('UsersPrismaRepository', () => {
  let repository: UsersPrismaRepository
  let prisma: PrismaService

  // Prepare a TestContainer for setting up a PostgreSQL instance.
  beforeEach(
    () =>
      setUpIntegratedTest(async _prisma => {
        prisma = _prisma

        const module: TestingModule = await Test.createTestingModule({
          imports: [PrismaModule],
          providers: [UsersPrismaRepository],
        }).compile()
        await module.init()

        repository = module.get<UsersPrismaRepository>(UsersPrismaRepository)
      }),
    1000 * 60 * 3,
  )

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', async () => {
    expect(repository).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should create a user', async () => {
      const createdUser = await repository.create({ name: 'John' })
      const expectedUser = await prisma.user.findUnique({
        where: {
          id: createdUser.id,
        },
      })

      expect(expectedUser).to.be.a('object')
      expect(expectedUser.id).to.be.eq(createdUser.id)
      expect(expectedUser.name).to.be.eq(createdUser.name)
      expect(expectedUser.createdAt).to.be.deep.eq(createdUser.createdAt)
      expect(expectedUser.updatedAt).to.be.deep.eq(createdUser.updatedAt)
    })
  })
})
