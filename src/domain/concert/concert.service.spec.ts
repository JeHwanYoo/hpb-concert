import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { ConcertService } from './concert.service'
import { ConcertRepositoryToken } from './concert.repository'
import { faker } from '@faker-js/faker'
import { v4 } from 'uuid'

describe('ConcertsService', () => {
  let service: ConcertService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        {
          provide: ConcertRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<ConcertService>(ConcertService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe('.create()', () => {
    it('should create a new concert', async () => {
      const openingAt = new Date()
      const closingAt = faker.date.future({ refDate: openingAt })
      const eventDate = faker.date.future({ refDate: closingAt })
      const creationModel = {
        capacity: 50,
        price: 5000,
        openingAt,
        closingAt,
        eventDate,
      }
      mockRepository.create = vi.fn().mockReturnValue(() => ({
        ...creationModel,
        id: v4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }))

      const createdConcert = await service.create(creationModel)

      expect(createdConcert).to.have.keys(
        'id',
        'capacity',
        'price',
        'createdAt',
        'updatedAt',
        'closingAt',
        'openingAt',
        'eventDate',
      )
    })

    // 이번 주차에는 구현하지 않음
    it.todo(
      'should satisfy date relations `openingAt < closingAt < eventDate` or throw error',
    )
  })

  describe('.find()', () => {
    it('should find all concert', async () => {
      mockRepository.findManyBy = vi.fn().mockReturnValue(() =>
        Array.from({ length: 10 }, () => {
          const openingAt = new Date()
          const closingAt = faker.date.future({ refDate: openingAt })
          const eventDate = faker.date.future({ refDate: closingAt })
          return {
            id: v4(),
            createdAt: openingAt,
            updatedAt: openingAt,
            capacity: 50,
            price: 5000,
            openingAt,
            closingAt,
            eventDate,
          }
        }),
      )

      const foundConcerts = await service.findManyBy({})

      for (const foundConcert of foundConcerts) {
        expect(foundConcert).to.have.keys(
          'id',
          'capacity',
          'price',
          'createdAt',
          'updatedAt',
          'closingAt',
          'openingAt',
          'eventDate',
        )
      }
    })
  })
})
