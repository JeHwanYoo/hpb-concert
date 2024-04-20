import { Module } from '@nestjs/common'
import { TokensModule } from '../../domains/tokens/tokens.module'
import { ConcertsApiController } from './concerts.api.controller'
import { ConcertsApiUseCase } from './concerts.api.usecase'
import { ConcertsModule } from '../../domains/concerts/concerts.module'
import { ConcertsPrismaRepository } from '../../infra/repositories/concerts/concerts.prisma.repository'
import { SeatsModule } from '../../domains/seats/seats.module'
import { SeatsPrismaRepository } from '../../infra/repositories/seats/seats.prisma.repository'
import { PrismaTransactionService } from '../../infra/prisma/prisma.transaction.service'

@Module({
  imports: [
    TokensModule,
    ConcertsModule.forFeature({
      ConcertsRepository: ConcertsPrismaRepository,
    }),
    SeatsModule.forFeature({
      SeatsRepository: SeatsPrismaRepository,
      TransactionService: PrismaTransactionService,
    }),
  ],
  controllers: [ConcertsApiController],
  providers: [ConcertsApiUseCase],
})
export class ConcertsApiModule {}
