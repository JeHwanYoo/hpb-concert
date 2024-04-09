import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { UsersService } from './users.service'
import { UsersRepositoryToken } from './users.repository'
import { faker } from '@faker-js/faker'
import { validate as validateUUID } from 'uuid'

describe('UsersService', () => {
  let service: UsersService
  let mockRepository: Mock

  beforeEach(async () => {
    mockRepository = vi.fn()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('.create()', () => {
    it('should be create a user', async () => {
      const result = await service.create({ name: faker.person.firstName() })
      expect(result).toBeDefined()
      expect(validateUUID(result)).toBeTruthy()
    })
  })
})
