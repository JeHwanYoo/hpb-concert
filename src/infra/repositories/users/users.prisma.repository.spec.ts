import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { UsersPrismaRepository } from './users.prisma.repository'
import { PrismaModule } from '../../prisma/prisma.module'
import { PrismaService } from '../../prisma/prisma.service'
import {
  assertAllFulfilled,
  setUpIntegratedTest,
} from '../../../shared/integrated.test.setup'
import { UserModel } from '../../../domains/users/models/user.model'
import { faker } from '@faker-js/faker'

describe('UsersPrismaRepository', () => {
  let repository: UsersPrismaRepository
  let prisma: PrismaService

  // Prepare a TestContainer for setting up a PostgreSQL instance.
  beforeAll(
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

  // Initialize databases to ensure test idempotency
  afterEach(async () => {
    await prisma.user.deleteMany()
  })

  it('should be defined', async () => {
    expect(repository).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should create a user', async () => {
      const expectedUser = await repository.create({ name: 'John' })
      const foundUser = await prisma.user.findUnique({
        where: {
          id: expectedUser.id,
        },
      })

      assertUser(expectedUser, foundUser)
    })
  })

  describe('.findOne()', () => {
    it('should find a user', async () => {
      const createdUser = await prisma.user.create({
        data: {
          name: 'John',
        },
      })
      const expectedUser = await repository.findOne(createdUser.id)

      assertUser(expectedUser, createdUser)
    })
  })

  describe('.find()', () => {
    it('should find users', async () => {
      const settledResults = await Promise.allSettled(
        Array.from({ length: 12 }, () =>
          prisma.user.create({
            data: {
              name: faker.person.firstName(),
            },
          }),
        ),
      )
      const expectedUsers = await repository.find({ page: 1, size: 10 })

      assertAllFulfilled(settledResults)

      const wantedUsers = settledResults
        .map(
          (settledResult: PromiseFulfilledResult<UserModel>) =>
            settledResult.value,
        )
        // stubbing order query (1. createdAt desc, 2. id asc)
        .sort((a, b) => {
          const aTime = a.createdAt.getTime()
          const bTime = b.createdAt.getTime()
          return aTime === bTime
            ? a.id.localeCompare(b.id)
            : b.createdAt.getTime() - a.createdAt.getTime()
        })
        // stubbing pagination (page: 1, size: 10)
        .slice(0, 10)

      expect(expectedUsers).to.have.keys('total', 'items')
      expect(expectedUsers.total).to.be.eq(12)
      expect(expectedUsers.items).to.be.a('array')
      for (const [index, expectedUser] of Object.entries(expectedUsers.items)) {
        assertUser(expectedUser, wantedUsers[index])
      }
    })
  })
})

function assertUser(expected: UserModel, wanted: UserModel) {
  expect(expected).to.be.a('object')
  expect(expected).to.be.deep.eq(wanted)
}
