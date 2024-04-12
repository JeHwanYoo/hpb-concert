import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { BillsService } from './bills.service'
import { BillsRepositoryToken } from './bills.repository'

describe('BillsService', () => {
  let service: BillsService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillsService,
        {
          provide: BillsRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<BillsService>(BillsService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe.todo('.create()')

  describe.todo('.findOne()')
})
