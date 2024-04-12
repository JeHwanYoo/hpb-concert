import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { SeatsService } from './seats.service'
import { SeatsRepositoryToken } from './seats.repository'

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
    it.todo('should reserve a seat')
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
