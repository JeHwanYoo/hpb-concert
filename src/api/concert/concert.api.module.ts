import { Module } from '@nestjs/common'
import { TokensModule } from '../../domain/tokens/tokens.module'
import { ConcertApiController } from './concert.api.controller'
import { ConcertApiUseCase } from './concert.api.use-case'
import { ConcertsModule } from '../../domain/concert/concert.module'
import { ConcertsPrismaRepository } from '../../infra/repositories/concert/concert.prisma.repository'
import { SeatModule } from '../../domain/seat/seat.module'
import { SeatsPrismaRepository } from '../../infra/repositories/seat/seat.prisma.repository'
import { PrismaTransactionService } from '../../infra/prisma/prisma.transaction.service'
import { ChargeModule } from '../../domain/charge/charge.module'
import { ChargesPrismaRepository } from '../../infra/repositories/charge/charge.prisma.repository'
import { BillsModule } from '../../domain/bills/bills.module'
import { BillsPrismaRepository } from '../../infra/repositories/bills/bills.prisma.repository'
import { RedisDistributedLockService } from '../../infra/redis/redis.lock.service'

@Module({
  imports: [
    TokensModule,
    ConcertsModule.forFeature({
      ConcertsRepository: ConcertsPrismaRepository,
    }),
    SeatModule.forFeature({
      SeatsRepository: SeatsPrismaRepository,
      TransactionService: PrismaTransactionService,
      LockService: RedisDistributedLockService,
    }),
    ChargeModule.forFeature({
      ChargesRepository: ChargesPrismaRepository,
      TransactionService: PrismaTransactionService,
    }),
    BillsModule.forFeature({
      BillsRepository: BillsPrismaRepository,
      TransactionService: PrismaTransactionService,
    }),
  ],
  controllers: [ConcertApiController],
  providers: [ConcertApiUseCase],
})
export class ConcertApiModule {}
