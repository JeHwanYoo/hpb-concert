import { Module } from '@nestjs/common'
import { RedisCacheModule } from './infra/redis/redis.cache.module'
import { ConfigModule } from '@nestjs/config'
import { EnqueueApiModule } from './api/enqueue/enqueue.api.module'
import { ChargeApiModule } from './api/charge/charge.api.module'
import { ConcertApiModule } from './api/concert/concert.api.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisCacheModule,
    EnqueueApiModule,
    ChargeApiModule,
    ConcertApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
