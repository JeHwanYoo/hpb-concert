import { Module } from '@nestjs/common'
import { RedisConnectionModule } from './infra/redis/redis.connection.module'
import { ConfigModule } from '@nestjs/config'
import { EnqueueApiModule } from './api/enqueue/enqueue.api.module'
import { ChargeApiModule } from './api/charge/charge.api.module'
import { ConcertApiModule } from './api/concert/concert.api.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisConnectionModule,
    EnqueueApiModule,
    ChargeApiModule,
    ConcertApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
