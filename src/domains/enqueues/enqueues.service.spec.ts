import { beforeEach, describe, expect, it } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { EnqueuesService } from './enqueues.service'
import Redis from 'ioredis'

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
})
