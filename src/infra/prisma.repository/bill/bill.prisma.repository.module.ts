import { Module } from '@nestjs/common'
import { BillRepositoryToken } from '../../../domain/bill/bill.repository'
import { BillPrismaRepository } from './bill.prisma.repository'
import { PrismaModule } from '../../prisma.connection/prisma.module'

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: BillRepositoryToken,
      useClass: BillPrismaRepository,
    },
  ],
  exports: [BillRepositoryToken],
})
export class BillPrismaRepositoryModule {}
