import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { BillService } from './bill.service'
import { BillsRepositoryToken } from './bill.repository'
import { v4 } from 'uuid'

describe('billService', () => {
  let service: BillService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillService,
        {
          provide: BillsRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<BillService>(BillService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should create a bill', async () => {
      mockRepository.create = vi.fn().mockReturnValue(() => ({
        id: v4(),
        seatId: v4(),
        holderId: v4(),
        amount: 5000,
        createdAt: new Date(),
      }))

      const createdBill = await service.create({
        seatId: 'fake-id',
        holderId: 'fake-id',
        amount: 5000,
      })

      expect(createdBill).to.have.keys(
        'id',
        'seatId',
        'holderId',
        'amount',
        'createdAt',
      )
    })
  })
})
