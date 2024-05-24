import { Module } from '@nestjs/common'
import { TokenModule } from '../../domain/token/token.module'
import { ChargeApiController } from './charge.api.controller'
import { ChargeModule } from '../../domain/charge/charge.module'
import { PrismaModule } from '../../infra/prisma.connection/prisma.module'
import { RedisCacheModule } from '../../infra/redis/redis.cache.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ChargeUsecaseCharge } from './usecase/charge.usecase.charge'
import { ChargeUsecaseGetCharge } from './usecase/charge.usecase.get-charge'
import { ChargeUsecaseUse } from './usecase/charge.usecase.use'
import { ChargePrismaRepositoryModule } from '../../infra/prisma.repository/charge/charge.prisma.repository.module'

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
      DBModule: PrismaModule,
      RepositoryModule: ChargePrismaRepositoryModule,
      CacheModule: RedisCacheModule,
    }),
  ],
  controllers: [ChargeApiController],
  providers: [ChargeUsecaseGetCharge, ChargeUsecaseCharge, ChargeUsecaseUse],
})
export class ChargeApiModule {}
