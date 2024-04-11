import { Module } from '@nestjs/common'
import { EnqueuesApiController } from './enqueues.api.controller'
import { EnqueuesApiUseCase } from './enqueues.api.use.case'
import { EnqueuesModule } from '../../domains/enqueues/enqueues.module'

@Module({
  imports: [
    EnqueuesModule.forFeature({
      throughputPerMinute: 100,
    }),
  ],
  controllers: [EnqueuesApiController],
  providers: [EnqueuesApiUseCase],
})
export class EnqueuesApiModule {}
