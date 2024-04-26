import { Module } from '@nestjs/common'
import { TokensModule } from '../../domains/tokens/tokens.module'
import { ConcertsApiController } from './concerts.api.controller'
import { ConcertsApiUseCase } from './concerts.api.usecase'
import { ConcertsModule } from '../../domains/concerts/concerts.module'
import { ConcertsPrismaRepository } from '../../infra/repositories/concerts/concerts.prisma.repository'
import { SeatsModule } from '../../domains/seats/seats.module'
import { SeatsPrismaRepository } from '../../infra/repositories/seats/seats.prisma.repository'
import { PrismaTransactionService } from '../../infra/prisma/prisma.transaction.service'
import { ChargesModule } from '../../domains/charges/charges.module'
import { ChargesPrismaRepository } from '../../infra/repositories/charges/charges.prisma.repository'
import { BillsModule } from '../../domains/bills/bills.module'
import { BillsPrismaRepository } from '../../infra/repositories/bills/bills.prisma.repository'
import { RedisDistributedLockService } from '../../infra/redis/redis.lock.service'

@Module({
  imports: [
    TokensModule,
    ConcertsModule.forFeature({
      ConcertsRepository: ConcertsPrismaRepository,
    }),
    SeatsModule.forFeature({
      SeatsRepository: SeatsPrismaRepository,
      TransactionService: PrismaTransactionService,
      LockService: RedisDistributedLockService,
    }),
    ChargesModule.forFeature({
      ChargesRepository: ChargesPrismaRepository,
      TransactionService: PrismaTransactionService,
    }),
    BillsModule.forFeature({
      BillsRepository: BillsPrismaRepository,
      TransactionService: PrismaTransactionService,
    }),
  ],
  controllers: [ConcertsApiController],
  providers: [ConcertsApiUseCase],
})
export class ConcertsApiModule {}
