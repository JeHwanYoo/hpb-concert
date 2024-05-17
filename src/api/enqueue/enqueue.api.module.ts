import { Module } from '@nestjs/common'
import { EnqueueApiController } from './enqueue.api.controller'
import { TokenModule } from '../../domain/token/token.module'
import { RedisCacheModule } from '../../infra/redis/redis.cache.module'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { EnqueueUsecaseCreateToken } from './usecase/enqueue.usecase.create-token'

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
  ],
  controllers: [EnqueueApiController],
  providers: [EnqueueUsecaseCreateToken],
})
export class EnqueueApiModule {}
