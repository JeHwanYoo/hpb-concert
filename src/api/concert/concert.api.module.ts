import { Module } from '@nestjs/common'
import { TokenModule } from '../../domain/token/token.module'
import { SeatModule } from '../../domain/seat/seat.module'
import { PrismaModule } from '../../infra/prisma.connection/prisma.module'
import { RedisCacheModule } from '../../infra/redis/redis.cache.module'
import { ChargeModule } from '../../domain/charge/charge.module'
import { ChargePrismaRepository } from '../../infra/prisma.repository/charge/charge.prisma.repository'
import { BillPrismaRepository } from '../../infra/prisma.repository/bill/bill.prisma.repository'
import { ConcertApiController } from './concert.api.controller'
import { ConcertApiUseCase } from './concert.api.use-case'
import { ConcertModule } from '../../domain/concert/concert.module'
import { ConcertPrismaRepository } from '../../infra/prisma.repository/concert/concert.prisma.repository'
import { SeatPrismaRepository } from '../../infra/prisma.repository/seat/seat.prisma.repository'
import { BillModule } from '../../domain/bill/bill.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

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
      ConcertRepository: ConcertPrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisCacheModule,
    }),
    SeatModule.forFeature({
      SeatsRepository: SeatPrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisCacheModule,
    }),
    ChargeModule.forFeature({
      ChargeRepository: ChargePrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisCacheModule,
    }),
    BillModule.forFeature({
      BillRepository: BillPrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisCacheModule,
    }),
  ],
  controllers: [ConcertApiController],
  providers: [ConcertApiUseCase],
})
export class ConcertApiModule {}
