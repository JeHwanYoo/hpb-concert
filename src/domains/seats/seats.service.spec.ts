import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { SeatsService } from './seats.service'
import { SeatsRepositoryToken } from './seats.repository'
import { v4 } from 'uuid'
import { addMinutes, differenceInMinutes } from 'date-fns'
import { faker } from '@faker-js/faker'

describe('SeatsService', () => {
  let service: SeatsService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {
      withTransaction: vi.fn().mockImplementation(cb => cb()),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeatsService,
        {
          provide: SeatsRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<SeatsService>(SeatsService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe('.reserve()', () => {
    it('should reserve a seat and deadline is 5 minutes', async () => {
      mockRepository.create = vi.fn().mockImplementation(param => ({
        ...param,
        id: v4(),
      }))

      mockRepository.findOneBySeatNo = vi.fn().mockResolvedValue({
        reservedAt: null,
      })

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
      mockRepository.findOneBySeatNo = vi.fn().mockResolvedValue({
        reservedAt: now,
        deadline: addMinutes(now, 5),
      })

      await expect(
        service.reserve({
          holderId: 'fake-id',
          concertId: 'fake-id',
          seatNo: 0,
        }),
      ).rejects.toThrow('Already reserved')
    })
    it.todo(
      'should reserve a seat and it was already reserved but the deadline exceeds',
    )
    it.todo('should not reserve a seat if it was already paid')
  })

  describe.todo('.pay()')

  describe.todo('.find()')

  describe.todo('.findOneBySeatNo()')
})
