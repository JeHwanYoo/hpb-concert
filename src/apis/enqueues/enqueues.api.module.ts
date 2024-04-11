import { Module } from '@nestjs/common'
import { EnqueuesController } from './enqueues.controller'

@Module({
  controllers: [EnqueuesController],
})
export class EnqueuesApiModule {}
