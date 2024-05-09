import { Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { LockService } from '../../service/lock/lock.service'
import { InjectRedis } from '@nestjs-modules/ioredis'

@Injectable()
export class RedisDistributedLockService implements LockService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async acquireLock(
    lockKey: string,
    lockValue: string,
    ttl = 5000,
  ): Promise<boolean> {
    const result = await this.redis.set(lockKey, lockValue, 'PX', ttl, 'NX')
    return result === 'OK'
  }

  async releaseLock(lockKey: string, lockValue: string): Promise<void> {
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `
    await this.redis.eval(script, 1, lockKey, lockValue)
  }
}
