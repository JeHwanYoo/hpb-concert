import { Module } from '@nestjs/common'
import { EnqueuesApiController } from './enqueues.api.controller'

@Module({
  controllers: [EnqueuesApiController],
})
export class EnqueuesApiModule {}
