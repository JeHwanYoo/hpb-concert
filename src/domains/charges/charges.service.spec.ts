import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { ChargesService } from './charges.service'
import { ChargesRepositoryToken } from './charges.repository'

describe('ChargesService', () => {
  let service: ChargesService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {
      withTransaction: vi.fn().mockImplementation(cb => cb()),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargesService,
        {
          provide: ChargesRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<ChargesService>(ChargesService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe.todo('.findOneByUserId()')

  describe.todo('.charge()')

  describe('.use()', () => {
    it('should use the balance', async () => {
      mockRepository.findOneByChargeId = vi
        .fn()
        .mockResolvedValue({ balance: 1000 })

      mockRepository.update = vi.fn().mockImplementation((_, { balance }) => ({
        balance,
      }))

      const used = await service.use('fake-id', { amount: 500 })

      expect(used.balance).to.be.eq(500)
    })

    it('should throw an error if the balance is insufficient', async () => {
      mockRepository.findOneByChargeId = vi
        .fn()
        .mockResolvedValue({ balance: 1000 })

      await expect(service.use('fake-id', { amount: 3000 })).rejects.toThrow(
        Error,
      )
    })
  })
})
