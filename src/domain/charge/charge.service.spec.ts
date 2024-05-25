import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { ChargeService } from './charge.service'
import { ChargeRepositoryToken } from './charge.repository'
import { LockServiceToken } from '../../shared/lock/lock.service'

describe('ChargesService', () => {
  let service: ChargeService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargeService,
        {
          provide: ChargeRepositoryToken,
          useValue: mockRepository,
        },
        {
          provide: LockServiceToken,
          useValue: {
            acquireLock: vi.fn().mockReturnValue(true),
            releaseLock: vi.fn(),
          },
        },
      ],
    }).compile()

    service = module.get<ChargeService>(ChargeService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe('.use()', () => {
    it('should use the balance', async () => {
      mockRepository.findOneBy = vi
        .fn()
        .mockReturnValue(() => ({ amount: 1000 }))

      mockRepository.update = vi
        .fn()
        .mockImplementation((_, { amount }) => () => ({
          amount,
        }))

      const used = await service.use('fake-id', {
        amount: 500,
      })

      expect(used.amount).to.be.eq(500)
    })

    it('should throw an error if the balance is insufficient', async () => {
      mockRepository.findOneBy = vi
        .fn()
        .mockResolvedValue(() => ({ balance: 1000 }))

      await expect(service.use('fake-id', { amount: 3000 })).rejects.toThrow(
        Error,
      )
    })
  })
})
