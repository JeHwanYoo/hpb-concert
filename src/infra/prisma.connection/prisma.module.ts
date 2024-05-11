import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaTransactionService } from './prisma.transaction.service'
import { TransactionServiceToken } from '../../shared/transaction/transaction.service'

@Module({
  providers: [
    PrismaService,
    {
      provide: TransactionServiceToken,
      useClass: PrismaTransactionService,
    },
  ],
  exports: [
    PrismaService,
    {
      provide: TransactionServiceToken,
      useClass: PrismaTransactionService,
    },
  ],
})
export class PrismaModule {}
