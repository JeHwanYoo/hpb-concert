import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { LockService } from '../../shared/lock/lock.service'
import { InjectRedis } from '@nestjs-modules/ioredis'

// @todo refactor pub/sub
@Injectable()
export class RedisDistributedLockService implements LockService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async acquireLock(lockKey: string, ttl = 5000): Promise<boolean> {
    const result = await this.redis.set(lockKey, '1', 'PX', ttl, 'NX')
    return result === 'OK'
  }

  async releaseLock(lockKey: string): Promise<boolean> {
    return (await this.redis.del(lockKey)) === 1
  }
}
