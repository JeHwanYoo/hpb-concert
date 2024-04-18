import { Module } from '@nestjs/common'
import { BillsPrismaRepository } from './bills.prisma.repository'

@Module({
  imports: [BillsPrismaRepository],
  exports: [BillsPrismaRepository],
})
export class BillsPrismaModule {}
