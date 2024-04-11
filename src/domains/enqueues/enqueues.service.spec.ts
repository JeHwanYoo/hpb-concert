import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { EnqueuesService } from './enqueues.service'
import Redis from 'ioredis'
import { ConfigModule } from '@nestjs/config'
import { JwtModule, JwtService } from '@nestjs/jwt'
import {
  DEFAULT_REDIS_NAMESPACE,
  getRedisToken,
} from '@liaoliaots/nestjs-redis'
import { TokenModel } from './models/token.model'

describe('EnqueuesService', () => {
  let service: EnqueuesService
  let mockRedis: Redis
  let jwtService: JwtService

  beforeEach(async () => {
    mockRedis = {} as Redis
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), JwtModule.register({ secret: 'test' })],
      providers: [
        EnqueuesService,
        {
          provide: getRedisToken(DEFAULT_REDIS_NAMESPACE),
          useValue: mockRedis,
        },
      ],
    }).compile()

    service = module.get<EnqueuesService>(EnqueuesService)
    jwtService = module.get<JwtService>(JwtService)
  })

  it('should be defined', () => {
    expect(service).to.be.a('object')
  })

  describe('.createToken()', () => {
    it('should create a token', async () => {
      mockRedis.get = vi.fn().mockResolvedValue('0')
      mockRedis.incr = vi.fn().mockResolvedValue(1)

      const token = await service.createToken('fake-user-id')

      expect(token).to.be.a('string')

      const verified = jwtService.verify<TokenModel>(token, { secret: 'test' })

      expect(verified).to.be.a('object')
      expect(verified.userId).to.be.string('fake-user-id')
      expect(verified.availableTime).to.be.a('number')
      expect(verified.exp).to.be.a('number')
      expect(verified.exp - verified.availableTime).to.be.greaterThanOrEqual(
        5 * 60,
      )
    })
  })

  describe('.completeToken()', () => {
    it('should make the token completed', async () => {
      mockRedis.decr = vi.fn().mockResolvedValue(0)
      const fakeToken = jwtService.sign({})

      const completedToken = await service.completeToken(fakeToken)

      const decoded = jwtService.decode(completedToken)

      expect(decoded).to.be.a('object')
      expect(decoded.completed).to.be.true
    })
  })
})
