import { Module } from '@nestjs/common'
import { RedisConnectionModule } from '../../infra/redis/redis.connection.module'
import { TokensService } from './tokens.service'

@Module({
  imports: [RedisConnectionModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
