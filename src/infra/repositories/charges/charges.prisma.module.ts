import { Module } from '@nestjs/common'
import { ChargesPrismaRepository } from './charges.prisma.repository'

@Module({
  providers: [ChargesPrismaRepository],
  exports: [ChargesPrismaRepository],
})
export class ChargesPrismaModule {}
