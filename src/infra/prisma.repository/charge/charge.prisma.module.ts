import { Module } from '@nestjs/common'
import { ChargePrismaRepository } from './charge.prisma.repository'

@Module({
  providers: [ChargePrismaRepository],
  exports: [ChargePrismaRepository],
})
export class ChargePrismaModule {}
