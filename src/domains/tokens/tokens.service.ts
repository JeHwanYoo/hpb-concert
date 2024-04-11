import { Injectable } from '@nestjs/common'
import { RedisService } from '@liaoliaots/nestjs-redis'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { TokenModel } from './models/token.model'
import Redis from 'ioredis'

export const redisKeys = {
  waitingCount: 'waitingCount',
}

@Injectable()
export class TokensService {
  private readonly throughputPerMinute: number
  private readonly redis: Redis

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.throughputPerMinute = parseInt(
      this.configService.get('THROUGHPUT_PER_MINUTE', '100'),
    )
    this.redis = redisService.getClient()
  }

  async createToken(userId: string): Promise<string> {
    const availableTime = Math.floor(
      (await this.getAvailableTime()).getTime() / 1000,
    )
    // expire after 5 minutes
    const expirationTime = availableTime + 5 * 60

    await this.incrWaitingCount()
    return this.jwtService.sign({
      userId,
      availableTime,
      exp: expirationTime,
      completed: false,
    })
  }

  async completeToken(token: string): Promise<string> {
    const decoded = this.jwtService.decode<TokenModel>(token)

    await this.decrWaitingCount()
    return this.jwtService.sign({
      ...decoded,
      completed: true,
    })
  }

  private async getAvailableTime(): Promise<Date> {
    const waitingCount = parseInt(await this.redis.get(redisKeys.waitingCount))

    const currentTime = new Date()
    const currentCount = waitingCount + 1

    return new Date(
      currentTime.getTime() +
        currentCount * Math.round(60000 / this.throughputPerMinute),
    )
  }

  private async incrWaitingCount(): Promise<number> {
    return this.redis.incr(redisKeys.waitingCount)
  }

  private async decrWaitingCount() {
    return this.redis.decr(redisKeys.waitingCount)
  }
}
