import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UsersPrismaRepository } from './users.prisma.repository'
import { PrismaModule } from '../../prisma/prisma.module'
import { PrismaService } from '../../prisma/prisma.service'
import { GenericContainer } from 'testcontainers'
import { execSync } from 'child_process'

describe('UsersPrismaRepository', () => {
  let repository: UsersPrismaRepository
  let prisma: PrismaService

  // Prepare a TestContainer for setting up a PostgreSQL instance.
  beforeEach(
    async () => {
      // Initialize the container
      console.log('Initialize PG Container ...')
      const container = await new GenericContainer('postgres:latest')
        .withExposedPorts(5432)
        .withEnvironment({
          POSTGRES_USER: 'user',
          POSTGRES_PASSWORD: 'password',
          POSTGRES_DB: 'test',
        })
        .start()

      // Get the mappedPort from the container and Set the DATABASE_URL
      const mappedPort = container.getMappedPort(5432)
      process.env.DATABASE_URL = `postgresql://user:password@localhost:${mappedPort}/test?schema=public`

      // Migrate TestContainer and PostgreSQL image
      execSync('npx prisma migrate dev', {
        env: {
          ...process.env,
          DATABASE_URL: process.env.DATABASE_URL,
        },
      })

      prisma = new PrismaService()

      const module: TestingModule = await Test.createTestingModule({
        imports: [PrismaModule],
        providers: [UsersPrismaRepository],
      }).compile()
      await module.init()

      repository = module.get<UsersPrismaRepository>(UsersPrismaRepository)

      console.log('Initialize PG Container Done')
    },
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
