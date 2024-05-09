import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { RedisDistributedLockService } from './redis.lock.service'
import { RedisModule } from '@nestjs-modules/ioredis'
import { LockServiceToken } from '../../service/lock/lock.service'

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'single',
        url: `${configService.get('REDIS_HOST')}:${configService.get('REDIS_PORT')}`,
      }),
    }),
  ],
  providers: [
    {
      provide: LockServiceToken,
      useClass: RedisDistributedLockService,
    },
  ],
  exports: [
    {
      provide: LockServiceToken,
      useClass: RedisDistributedLockService,
    },
  ],
})
export class RedisCacheModule {}
