import { Module } from '@nestjs/common'
import { TokensModule } from '../../domains/tokens/tokens.module'
import { ChargesApiController } from './charges.api.controller'
import { ChargesModule } from '../../domains/charges/charges.module'
import { ChargesPrismaRepository } from '../../infra/repositories/charges/charges.prisma.repository'
import { PrismaTransactionService } from '../../infra/prisma/prisma.transaction.service'
import { ChargesApiUseCase } from './charges.api.usecase'

@Module({
  imports: [
    TokensModule,
    ChargesModule.forFeature({
      ChargesRepository: ChargesPrismaRepository,
      TransactionService: PrismaTransactionService,
    }),
  ],
  controllers: [ChargesApiController],
  providers: [ChargesApiUseCase],
})
export class ChargesApiModule {}
