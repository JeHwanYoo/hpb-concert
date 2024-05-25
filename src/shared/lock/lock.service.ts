export const LockServiceToken = 'RedisDistributedLockService'

export interface LockService {
  acquireLock(lockKey: string, ttl?: number): Promise<boolean>

  releaseLock(lockKey: string): Promise<boolean>
}
