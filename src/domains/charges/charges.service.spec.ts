import { Test, TestingModule } from '@nestjs/testing'
import { afterEach, beforeEach, describe, expect, it, Mock, vi } from 'vitest'
import { ChargesService } from './charges.service'
import { ChargesRepositoryToken } from './charges.repository'

describe('ChargesService', () => {
  let service: ChargesService
  let mockRepository: Record<string, Mock>

  beforeEach(async () => {
    mockRepository = {}

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargesService,
        {
          provide: ChargesRepositoryToken,
          useValue: mockRepository,
        },
      ],
    }).compile()

    service = module.get<ChargesService>(ChargesService)
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should be defined', () => {
    expect(service).to.not.be.undefined
  })

  describe.todo('.findOneByUserId()')

  describe.todo('.charge()')

  describe.todo('.use()')
})
