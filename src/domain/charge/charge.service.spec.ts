import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { ChargeService } from './charge.service'
import { ChargeRepositoryToken } from './charge.repository'
import { TransactionServiceToken } from '../../shared/transaction/transaction.service'

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
          provide: TransactionServiceToken,
          useValue: {
            tx: vi
              .fn()
              .mockImplementation(
                async (_, operations: ReturnType<typeof vi.fn>[]) => {
                  for (const op of operations.slice(0, -1)) {
                    await op()
                  }
                  return operations.at(-1)()
                },
              ),
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
