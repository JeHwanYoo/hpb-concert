import { Module } from '@nestjs/common'
import { SeatsPrismaRepository } from './seats.prisma.repository'

@Module({
  providers: [SeatsPrismaRepository],
  exports: [SeatsPrismaRepository],
})
export class SeatsPrismaModule {}
