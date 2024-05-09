import { Module } from '@nestjs/common'
import { SeatPrismaRepository } from './seat.prisma.repository'

@Module({
  providers: [SeatPrismaRepository],
  exports: [SeatPrismaRepository],
})
export class SeatPrismaModule {}
