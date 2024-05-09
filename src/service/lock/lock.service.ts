export const LockServiceToken = 'RedisDistributedLockService'

export interface LockService {
  acquireLock(
    lockKey: string,
    lockValue: string,
    ttl?: number,
  ): Promise<boolean>

  releaseLock(lockKey: string, lockValue: string): Promise<void>
}
