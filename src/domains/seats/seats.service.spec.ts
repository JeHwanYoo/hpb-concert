import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { SeatsService } from './seats.service'
import { SeatsRepositoryToken } from './seats.repository'
import { SeatCreationModel } from './models/seat.model'
import { v4 } from 'uuid'
import { differenceInMinutes, sub } from 'date-fns'

describe('SeatsService', () => {
  let service: SeatsService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

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
    it.todo('should not reserve a seat if it was already reserved')
    it.todo(
      'should reserve a seat and it was already reserved but the deadline exceeds',
    )
    it.todo('should not reserve a seat if it was already paid')
  })

  describe.todo('.pay()')

  describe.todo('.find()')

  describe.todo('.findOneBySeatNo()')
})
