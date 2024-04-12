import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { ConcertsService } from './concerts.service'
import { ConcertsRepositoryToken } from './concerts.repository'

describe('UsersService', () => {
  let service: ConcertsService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertsService,
        {
          provide: ConcertsRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<ConcertsService>(ConcertsService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe('.create()', () => {})

  describe('.find()', () => {})
})
