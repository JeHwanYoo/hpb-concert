import { Module } from '@nestjs/common'
import { TokenModule } from '../../domain/token/token.module'
import { SeatModule } from '../../domain/seat/seat.module'
import { PrismaModule } from '../../infra/prisma.connection/prisma.module'
import { RedisCacheModule } from '../../infra/redis/redis.cache.module'
import { ChargeModule } from '../../domain/charge/charge.module'
import { ConcertApiController } from './concert.api.controller'
import { ConcertModule } from '../../domain/concert/concert.module'
import { BillModule } from '../../domain/bill/bill.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ConcertUsecaseCreateConcert } from './usecase/concert.usecase.create-concert'
import { ConcertUsecaseGetConcerts } from './usecase/concert.usecase.get-concerts'
import { ConcertUsecaseGetSeats } from './usecase/concert.usecase.get-seats'
import { ConcertUsecasePaySeat } from './usecase/concert.usecase.pay-seat'
import { ConcertUsecaseReserveSeat } from './usecase/concert.usecase.reserve-seat'
import { KafkaModule } from '../../infra/kafka/kafka.module'
import { ConcertPrismaRepositoryModule } from '../../infra/prisma.repository/concert/concert.prisma.repository.module'
import { SeatPrismaRepositoryModule } from '../../infra/prisma.repository/seat/seat.prisma.repository.module'
import { ChargePrismaRepositoryModule } from '../../infra/prisma.repository/charge/charge.prisma.repository.module'
import { BillPrismaRepositoryModule } from '../../infra/prisma.repository/bill/bill.prisma.repository.module'

@Module({
  imports: [
    TokenModule.forFeature({
      CacheModule: RedisCacheModule,
      JWTModule: JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          secret: configService.get('JWT_SECRET'),
        }),
      }),
    }),
    ConcertModule.forFeature({
      DBModule: PrismaModule,
      RepositoryModule: ConcertPrismaRepositoryModule,
      CacheModule: RedisCacheModule,
    }),
    SeatModule.forFeature({
      DBModule: PrismaModule,
      RepositoryModule: SeatPrismaRepositoryModule,
      CacheModule: RedisCacheModule,
    }),
    ChargeModule.forFeature({
      DBModule: PrismaModule,
      RepositoryModule: ChargePrismaRepositoryModule,
      CacheModule: RedisCacheModule,
    }),
    BillModule.forFeature({
      DBModule: PrismaModule,
      RepositoryModule: BillPrismaRepositoryModule,
      CacheModule: RedisCacheModule,
    }),
    KafkaModule,
  ],
  controllers: [ConcertApiController],
  providers: [
    ConcertUsecaseCreateConcert,
    ConcertUsecaseGetConcerts,
    ConcertUsecaseGetSeats,
    ConcertUsecasePaySeat,
    ConcertUsecaseReserveSeat,
  ],
})
export class ConcertApiModule {}
