import { Module } from '@nestjs/common'
import { TokenModule } from '../../domain/token/token.module'
import { ChargeApiController } from './charge.api.controller'
import { ChargeModule } from '../../domain/charge/charge.module'
import { ChargeApiUseCase } from './charge-api-use-case'
import { ChargePrismaRepository } from '../../infra/prisma.repository/charge/charge.prisma.repository'
import { PrismaModule } from '../../infra/prisma.connection/prisma.module'
import { RedisCacheModule } from '../../infra/redis/redis.cache.module'
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
    ChargeModule.forFeature({
      ChargeRepository: ChargePrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisCacheModule,
    }),
  ],
  controllers: [ChargeApiController],
  providers: [ChargeApiUseCase],
})
export class ChargeApiModule {}
