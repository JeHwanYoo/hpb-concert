import { Module } from '@nestjs/common'
import { BillPrismaRepository } from './bill.prisma.repository'

@Module({
  imports: [BillPrismaRepository],
  exports: [BillPrismaRepository],
})
export class BillPrismaModule {}
