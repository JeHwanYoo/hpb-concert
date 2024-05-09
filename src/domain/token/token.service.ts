import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import Redis from 'ioredis'
import { EnqueueTokenModel } from '../../../dist/src/domains/tokens/models/enqueueTokenModel'
import { InjectRedis } from '@nestjs-modules/ioredis'

export const redisKeys = {
  waitingCount: 'waitingCount',
}

@Injectable()
export class TokenService {
  private readonly throughputPerMinute: number

  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    this.throughputPerMinute = parseInt(
      this.configService.get('THROUGHPUT_PER_MINUTE', '100'),
    )
  }

  async createToken(userId: string): Promise<string> {
    const availableTime = Math.floor(
      (await this.getAvailableTime()).getTime() / 1000,
    )
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
    const decoded = this.jwtService.decode<EnqueueTokenModel>(token)

    await this.decrWaitingCount()
    return this.jwtService.sign({
      ...decoded,
      completed: true,
    })
  }

  private async getAvailableTime(): Promise<Date> {
    const waitingCount = parseInt(
      (await this.redis.get(redisKeys.waitingCount)) ?? '0',
    )

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

  private async decrWaitingCount(): Promise<number> {
    return this.redis.decr(redisKeys.waitingCount)
  }
}
