import { Module } from '@nestjs/common'
import { MocksModule } from './mocks/mocks.module'
import { RedisConnectionModule } from './infra/redis/redis.connection.module'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MocksModule,
    RedisConnectionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
