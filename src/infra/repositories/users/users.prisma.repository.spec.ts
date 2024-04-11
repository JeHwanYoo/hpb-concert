import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UsersPrismaRepository } from './users.prisma.repository'
import { PrismaModule } from '../../prisma/prisma.module'

describe('UsersPrismaRepository', () => {
  let repository: UsersPrismaRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [UsersPrismaRepository],
    }).compile()
    await module.init()

    repository = module.get<UsersPrismaRepository>(UsersPrismaRepository)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', async () => {
    expect(repository).to.not.be.undefined
  })
})
