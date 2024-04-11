import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { EnqueuesService } from './enqueues.service'
import Redis from 'ioredis'
import { validate as validateUUID } from 'uuid'

describe('EnqueuesService', () => {
  let service: EnqueuesService
  let mockRedis: Redis

  beforeEach(async () => {
    mockRedis = {} as Redis
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnqueuesService],
    }).compile()

    service = module.get<EnqueuesService>(EnqueuesService)
  })

  it('should be defined', () => {
    expect(service).to.be.a('object')
  })

  describe('.createToken()', () => {
    it('should create a token', async () => {
      mockRedis.get = vi.fn().mockResolvedValue(0)
      mockRedis.incr = vi.fn().mockResolvedValue(1)

      const token = await service.createToken()

      expect(token).to.be.a('string')
      expect(validateUUID(token)).to.be.true
    })
  })
})
