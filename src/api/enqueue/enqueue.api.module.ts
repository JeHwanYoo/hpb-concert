import { Module } from '@nestjs/common'
import { EnqueueApiController } from './enqueue.api.controller'
import { EnqueueApiUseCase } from './enqueue.api.use-case'
import { TokensModule } from '../../domain/tokens/tokens.module'

@Module({
  imports: [TokensModule],
  controllers: [EnqueueApiController],
  providers: [EnqueueApiUseCase],
})
export class EnqueueApiModule {}
