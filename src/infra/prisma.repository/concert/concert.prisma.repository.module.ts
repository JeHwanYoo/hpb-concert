import { Module } from '@nestjs/common'
import { ConcertRepositoryToken } from '../../../domain/concert/concert.repository'
import { ConcertPrismaRepository } from './concert.prisma.repository'
import { PrismaModule } from '../../prisma.connection/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: ConcertRepositoryToken,
      useClass: ConcertPrismaRepository,
    },
  ],
  exports: [ConcertRepositoryToken],
})
export class ConcertPrismaRepositoryModule {}
