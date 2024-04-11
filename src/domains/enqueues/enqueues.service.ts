import { Injectable } from '@nestjs/common'
import { InjectRedis } from '@liaoliaots/nestjs-redis'
import Redis from 'ioredis'

export interface EnqueuesServiceProps {
  /**
   * @description Throughput per minute
   */
  throughputPerMinute: number
}

@Injectable()
export class EnqueuesService {
  constructor(
    private readonly props: EnqueuesServiceProps,
    @InjectRedis() private readonly client: Redis,
  ) {}

  async createToken() {}

  private async getAvailableTime() {}

  private async addWaitingCount() {}
}
