import { Module } from '@nestjs/common'
import { TokensModule } from '../../domains/tokens/tokens.module'
import { ChargesApiController } from './charges.api.controller'

@Module({
  imports: [TokensModule],
  controllers: [ChargesApiController],
  providers: [],
})
export class ChargesApiModule {}
