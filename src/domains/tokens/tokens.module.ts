import { Module } from '@nestjs/common'
import { TokensService } from './tokens.service'
import { RedisModule } from '@liaoliaots/nestjs-redis'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [RedisModule, JwtModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
