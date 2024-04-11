import { Module } from '@nestjs/common'
import { RedisConnectionModule } from './infra/redis/redis.connection.module'
import { ConfigModule } from '@nestjs/config'
import { EnqueuesApiModule } from './apis/enqueues/enqueues.api.module'
import { ChargesApiModule } from './apis/charges/charges.api.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisConnectionModule,
    EnqueuesApiModule,
    ChargesApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
