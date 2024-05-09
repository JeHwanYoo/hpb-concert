import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { BillService } from './bill.service'
import { BillRepositoryToken } from './bill.repository'
import { v4 } from 'uuid'
import { BillCreationModel, BillModel } from './model/bill.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { NotFoundDomainException } from '../../shared/shared.exception'
import { faker } from '@faker-js/faker'

describe('BillService', () => {
  let service: BillService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillService,
        {
          provide: BillRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<BillService>(BillService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('.create()', () => {
    it('should create a bill and return the created bill', async () => {
      const mockBill: BillModel = {
        id: v4(),
        seatId: v4(),
        holderId: v4(),
        amount: faker.number.int(),
        createdAt: faker.date.anytime(),
      }
      mockRepository.create = vi.fn().mockReturnValue(() => mockBill)

      const bill: BillCreationModel = {
        seatId: mockBill.seatId,
        holderId: mockBill.holderId,
        amount: mockBill.amount,
      }

      const createdBill = await service.create(bill)

      expect(createdBill).to.equal(mockBill)
    })
  })

  describe('.findOneBy()', () => {
    it('should find a bill', async () => {
      const mockBill: BillModel = {
        id: v4(),
        seatId: v4(),
        holderId: v4(),
        amount: faker.number.int(),
        createdAt: faker.date.anytime(),
      }
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => mockBill)

      const identifier: IdentifierFrom<BillModel> = { id: mockBill.id }

      const foundBill = await service.findOneBy(identifier)

      expect(foundBill).to.equal(mockBill)
    })

    it('should throw NotFoundDomainException', async () => {
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => null)

      const identifier: IdentifierFrom<BillModel> = {
        id: v4(),
      }

      await expect(service.findOneBy(identifier)).rejects.toThrow(
        NotFoundDomainException,
      )
    })
  })
})
