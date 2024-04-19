import { Module } from '@nestjs/common'
import { TokensModule } from '../../domains/tokens/tokens.module'
import { ConcertsApiController } from './concerts.api.controller'
import { ConcertsApiUseCase } from './concerts.api.usecase'
import { ConcertsModule } from '../../domains/concerts/concerts.module'
import { ConcertsPrismaRepository } from '../../infra/repositories/concerts/concerts.prisma.repository'

@Module({
  imports: [
    TokensModule,
    ConcertsModule.forFeature({
      ConcertsRepository: ConcertsPrismaRepository,
    }),
  ],
  controllers: [ConcertsApiController],
  providers: [ConcertsApiUseCase],
})
export class ConcertsApiModule {}
