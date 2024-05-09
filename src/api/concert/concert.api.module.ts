import { Module } from '@nestjs/common'
import { TokenModule } from '../../domain/token/token.module'
import { ConcertsPrismaRepository } from '../../../dist/src/infra/repositories/concerts/concerts.prisma.repository'
import { SeatModule } from '../../domain/seat/seat.module'
import { SeatsPrismaRepository } from '../../../dist/src/infra/repositories/seats/seats.prisma.repository'
import { PrismaModule } from '../../infra/prisma.connection/prisma.module'
import { RedisConnectionModule } from '../../infra/redis/redis.connection.module'
import { ChargeModule } from '../../domain/charge/charge.module'
import { BillsModule } from '../../../dist/src/domains/bills/bills.module'
import { ChargePrismaRepository } from '../../infra/prisma.repository/charge/charge.prisma.repository'
import { BillPrismaRepository } from '../../infra/prisma.repository/bill/bill.prisma.repository'
import { ConcertApiController } from './concert.api.controller'
import { ConcertApiUseCase } from './concert.api.use-case'
import { ConcertModule } from '../../domain/concert/concert.module'

@Module({
  imports: [
    TokenModule,
    ConcertModule.forFeature({
      ConcertRepository: ConcertsPrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisConnectionModule,
    }),
    SeatModule.forFeature({
      SeatsRepository: SeatsPrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisConnectionModule,
    }),
    ChargeModule.forFeature({
      ChargeRepository: ChargePrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisConnectionModule,
    }),
    BillsModule.forFeature({
      BillRepository: BillPrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisConnectionModule,
    }),
  ],
  controllers: [ConcertApiController],
  providers: [ConcertApiUseCase],
})
export class ConcertApiModule {}
