import { Module } from '@nestjs/common'
import { RedisConnectionModule } from '../../infra/redis/redis.connection.module'
import { EnqueuesService } from './enqueues.service'

@Module({
  imports: [RedisConnectionModule],
  providers: [EnqueuesService],
  exports: [EnqueuesService],
})
export class EnqueuesModule {}
