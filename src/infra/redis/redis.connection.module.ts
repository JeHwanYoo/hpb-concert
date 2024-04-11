import { Module } from '@nestjs/common'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        readyLog: true,
        config: {
          host: configService.get('REDIS_HOST'),
          port: Number(configService.get('REDIS_PORT')),
        },
      }),
    }),
  ],
})
export class RedisConnectionModule {}
