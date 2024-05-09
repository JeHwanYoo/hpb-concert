import { Module } from '@nestjs/common'
import { TokenModule } from '../../domain/token/token.module'
import { ChargeApiController } from './charge.api.controller'
import { ChargeModule } from '../../domain/charge/charge.module'
import { ChargeApiUseCase } from './charge-api-use-case.service'
import { ChargePrismaRepository } from '../../infra/prisma.repository/charge/charge.prisma.repository'
import { PrismaModule } from '../../infra/prisma.connection/prisma.module'
import { RedisConnectionModule } from '../../infra/redis/redis.connection.module'

@Module({
  imports: [
    TokenModule,
    ChargeModule.forFeature({
      ChargeRepository: ChargePrismaRepository,
      DBModule: PrismaModule,
      CacheModule: RedisConnectionModule,
    }),
  ],
  controllers: [ChargeApiController],
  providers: [ChargeApiUseCase],
})
export class ChargeApiModule {}
