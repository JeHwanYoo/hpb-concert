import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { UsersService } from './users.service'
import { UsersRepositoryToken } from './users.repository'
import { faker } from '@faker-js/faker'
import { v4 as uuidv4, validate as validateUUID } from 'uuid'

describe('UsersService', () => {
  let service: UsersService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

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
    expect(service).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should be create a user', async () => {
      mockRepository.create = vi.fn().mockResolvedValue(uuidv4())

      const result = await service.create({ name: faker.person.firstName() })
      expect(result).to.not.be.undefined
      expect(validateUUID(result)).to.be.true
    })
  })

  describe('.findOne()', () => {
    it('should return the user with the given id', async () => {
      mockRepository.findOne = vi.fn().mockResolvedValue({
        id: uuidv4(),
        name: faker.person.firstName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      const uuid = uuidv4()
      const result = await service.findOne(uuid)
      expect(result).to.not.be.undefined
      expect(validateUUID(result.id)).to.be.true
      expect(result).has.property('name').and.be.a('string')
      expect(result).has.property('createdAt').and.be.instanceof(Date)
      expect(result).has.property('updatedAt').and.be.instanceof(Date)
    })
  })
})
