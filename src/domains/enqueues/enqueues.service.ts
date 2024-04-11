import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class EnqueuesService {
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
    // expire after 5 minutes
    const expirationTime = availableTime + 5 * 60

    await this.addWaitingCount()
    return this.jwtService.sign({
      userId,
      availableTime,
      exp: expirationTime,
    })
  }

  private async getAvailableTime(): Promise<Date> {
    const waitingCount = parseInt(await this.redis.get('waitingCount'))

    const currentTime = new Date()
    const currentCount = waitingCount + 1

    return new Date(
      currentTime.getTime() +
        currentCount * Math.round(60000 / this.throughputPerMinute),
    )
  }

  private async addWaitingCount(): Promise<number> {
    return this.redis.incr('waitingCount')
  }
}
