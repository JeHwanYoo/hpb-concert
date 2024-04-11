import { Module } from '@nestjs/common'
import { TokensModule } from '../../domains/tokens/tokens.module'
import { ConcertsApiController } from './concerts.api.controller'

@Module({
  imports: [TokensModule],
  controllers: [ConcertsApiController],
})
export class ConcertsApiModule {}
