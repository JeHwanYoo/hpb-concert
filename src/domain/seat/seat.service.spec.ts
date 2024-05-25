import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { SeatService } from './seat.service'
import { SeatRepositoryToken } from './seat.repository'
import { v4 } from 'uuid'
import { addMinutes, differenceInMinutes } from 'date-fns'
import { faker } from '@faker-js/faker'
import { TransactionServiceToken } from '../../shared/transaction/transaction.service'
import { LockServiceToken } from '../../shared/lock/lock.service'
import {
  REDIS_MODULE_CONNECTION,
  REDIS_MODULE_CONNECTION_TOKEN,
} from '@nestjs-modules/ioredis/dist/redis.constants'

describe('SeatsService', () => {
  let service: SeatService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatService,
        {
          provide: SeatRepositoryToken,
          useValue: mockRepository,
        },
        {
          provide: TransactionServiceToken,
          useValue: {
            tx: vi
              .fn()
              .mockImplementation(
                async (operation: ReturnType<typeof vi.fn>) => {
                  return operation()
                },
              ),
          },
        },
        {
          provide: LockServiceToken,
          useValue: {
            acquireLock: vi.fn().mockReturnValue(true),
            releaseLock: vi.fn(),
          },
        },
        {
          provide:
            REDIS_MODULE_CONNECTION + '_' + REDIS_MODULE_CONNECTION_TOKEN,
          useValue: {},
        },
      ],
    }).compile()

    service = module.get<SeatService>(SeatService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe('.reserve()', () => {
    beforeEach(() => {
      mockRepository.create = vi.fn().mockImplementation(param => () => ({
        ...param,
        id: v4(),
      }))
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => ({
        reservedAt: null,
        paidAt: null,
      }))
      mockRepository.update = vi.fn().mockImplementation((_, param) => () => ({
        ...param,
        id: v4(),
      }))
    })
    it('should reserve a seat and deadline is 5 minutes', async () => {
      const reserved = await service.reserve({
        holderId: 'fake-id',
        concertId: 'fake-id',
        seatNo: 0,
      })

      expect(reserved).to.have.keys(
        'id',
        'holderId',
        'concertId',
        'seatNo',
        'reservedAt',
        'deadline',
      )
      expect(
        differenceInMinutes(reserved.deadline, reserved.reservedAt),
      ).to.be.greaterThanOrEqual(5)
    })
    it('should not reserve a seat if it was already reserved', async () => {
      const now = new Date()
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => ({
        reservedAt: now,
        deadline: addMinutes(now, 5),
      }))

      await expect(
        service.reserve({
          holderId: 'fake-id',
          concertId: 'fake-id',
          seatNo: 0,
        }),
      ).rejects.toThrow('Already reserved')
    })
    it('should reserve a seat and it was already reserved but the deadline exceeds', async () => {
      const past = faker.date.past({ refDate: new Date() })
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => ({
        reservedAt: past,
        deadline: addMinutes(past, 5),
        paidAt: null,
      }))

      const reserved = await service.reserve({
        holderId: 'fake-id',
        concertId: 'fake-id',
        seatNo: 0,
      })

      expect(reserved).to.have.keys(
        'id',
        'holderId',
        'concertId',
        'seatNo',
        'reservedAt',
        'deadline',
      )
      expect(
        differenceInMinutes(reserved.deadline, reserved.reservedAt),
      ).to.be.greaterThanOrEqual(5)
      expect(reserved.reservedAt).to.be.greaterThan(past)
    })
    it('should not reserve a seat if it was already paid', async () => {
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => ({
        paidAt: new Date(),
      }))

      await expect(
        service.reserve({
          holderId: 'fake-id',
          concertId: 'fake-id',
          seatNo: 0,
        }),
      ).rejects.toThrow('Already paid')
    })
  })

  describe('.pay()', () => {
    beforeEach(() => {
      mockRepository.create = vi.fn().mockImplementation(param => () => ({
        ...param,
        id: v4(),
      }))
      const now = new Date()
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => ({
        reservedAt: now,
        deadline: addMinutes(now, 5),
        paidAt: null,
        holderId: 'fake-id',
      }))
      mockRepository.update = vi
        .fn()
        .mockImplementation((_, { paidAt }) => () => ({ paidAt }))
    })
    it('should pay', async () => {
      const paid = await service.pay('fake-id', 'fake-id')
      expect(paid.paidAt).to.be.instanceof(Date)
    })
    it('should not pay if deadline exceeds', async () => {
      const past = faker.date.past({ refDate: new Date() })
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => ({
        reservedAt: past,
        deadline: addMinutes(past, 5),
        holderId: 'fake-id',
      }))

      await expect(service.pay('fake-id', 'fake-id')).rejects.toThrow(
        'Deadline Exceeds',
      )
    })
    it('should not pay if it was already paid', async () => {
      const now = new Date()
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => ({
        reservedAt: now,
        deadline: addMinutes(now, 5),
        paidAt: new Date(),
        holderId: 'fake-id',
      }))

      await expect(service.pay('fake-id', 'fake-id')).rejects.toThrow(
        'Already paid',
      )
    })
    it('should not pay if wat not reserved', async () => {
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => null)

      await expect(service.pay('fake-id', 'fake-id')).rejects.toThrow(
        'Not Reserved',
      )
    })
    it('should not pay if the user is different with the holder', async () => {
      const now = new Date()
      mockRepository.findOneBy = vi.fn().mockReturnValue(() => ({
        reservedAt: now,
        deadline: addMinutes(now, 5),
        paidAt: null,
        holderId: v4(),
      }))

      await expect(service.pay('fake-id', v4())).rejects.toThrow(
        'Not Authorized',
      )
    })
  })
})
