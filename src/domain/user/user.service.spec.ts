import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { UserService } from './user.service'
import { UsersRepositoryToken } from './user.repository'
import { faker } from '@faker-js/faker'
import { v4 as uuidv4, validate as validateUUID } from 'uuid'

describe('UsersService', () => {
  let service: UserService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UsersRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<UserService>(UserService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should be create a user', async () => {
      mockRepository.create = vi.fn().mockReturnValue(() => ({
        id: uuidv4(),
        name: 'john',
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      const result = await service.create({ name: faker.person.firstName() })
      expect(result).to.not.be.undefined
      expect(validateUUID(result.id)).to.be.true
      expect(result.name).to.be.a('string')
      expect(result.createdAt).to.be.instanceof(Date)
      expect(result.updatedAt).to.be.instanceof(Date)
    })
  })

  describe('.findOneBy()', () => {
    it('should return the user with the given id', async () => {
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => ({
        id: uuidv4(),
        name: faker.person.firstName(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      const uuid = uuidv4()
      const result = await service.findOneBy({
        id: uuid,
      })
      expect(result).to.not.be.undefined
      expect(validateUUID(result.id)).to.be.true
      expect(result).has.property('name').and.to.be.a('string')
      expect(result).has.property('createdAt').and.to.be.instanceof(Date)
      expect(result).has.property('updatedAt').and.to.be.instanceof(Date)
    })
  })

  describe('.findManyBy()', () => {
    it('should return the paginated results', async () => {
      mockRepository.findManyBy = vi.fn().mockReturnValue(() => ({
        total: 3,
        items: Array.from({ length: 3 }, () => ({
          id: uuidv4(),
          name: faker.person.firstName(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
      }))

      const result = await service.findManyByOffset({ page: 1, size: 10 })
      expect(result).to.not.be.undefined
      expect(result).has.property('total').and.to.be.a('number')
      expect(result).has.property('items').and.to.be.a('array')
      for (const item of result.items) {
        expect(validateUUID(item.id)).to.be.true
        expect(item).has.property('name').and.to.be.a('string')
        expect(item).has.property('createdAt').and.to.be.instanceof(Date)
        expect(item).has.property('updatedAt').and.to.be.instanceof(Date)
      }
    })
  })
})
