import { Module } from '@nestjs/common'
import { RedisConnectionModule } from './infra/redis/redis.connection.module'
import { ConfigModule } from '@nestjs/config'
import { EnqueuesApiModule } from './apis/enqueues/enqueues.api.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisConnectionModule,
    EnqueuesApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
