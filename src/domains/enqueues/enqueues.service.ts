import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class EnqueuesService {
  private readonly throughputPerMinute: number

  constructor(
    @InjectRedis() private readonly client: Redis,
    private readonly configService: ConfigService,
  ) {
    this.throughputPerMinute = parseInt(
      this.configService.get('THROUGHPUT_PER_MINUTE', '100'),
    )
  }

  async createToken() {}

  private async getAvailableTime() {}

  private async addWaitingCount() {}
}
