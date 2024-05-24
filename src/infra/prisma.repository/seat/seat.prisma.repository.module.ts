import { Module } from '@nestjs/common'
import { SeatPrismaRepository } from './seat.prisma.repository'
import { SeatRepositoryToken } from '../../../domain/seat/seat.repository'
import { PrismaModule } from '../../prisma.connection/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: SeatRepositoryToken,
      useClass: SeatPrismaRepository,
    },
  ],
  exports: [SeatRepositoryToken],
})
export class SeatPrismaRepositoryModule {}
