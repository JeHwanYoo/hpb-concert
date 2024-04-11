import { Module } from '@nestjs/common'
import { EnqueuesApiController } from './enqueues.api.controller'
import { EnqueuesApiUseCase } from './enqueues.api.use.case'
import { TokensModule } from '../../domains/tokens/tokens.module'

@Module({
  imports: [TokensModule],
  controllers: [EnqueuesApiController],
  providers: [EnqueuesApiUseCase],
})
export class EnqueuesApiModule {}
