import { Module } from '@nestjs/common'
import { TokenModule } from '../../domain/token/token.module'
import { ChargeApiController } from './charge.api.controller'
import { ChargeModule } from '../../domain/charge/charge.module'
import { PrismaTransactionService } from '../../infra/prisma/prisma.transaction.service'
import { ChargeApiUseCase } from './charge-api-use-case.service'
import { ChargePrismaRepository } from '../../infra/prisma.repository/charge/charge.prisma.repository'

@Module({
  imports: [
    TokenModule,
    ChargeModule.forFeature({
      ChargesRepository: ChargePrismaRepository,
      TransactionService: PrismaTransactionService,
    }),
  ],
  controllers: [ChargeApiController],
  providers: [ChargeApiUseCase],
})
export class ChargeApiModule {}
