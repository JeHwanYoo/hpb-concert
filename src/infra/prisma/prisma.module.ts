import { Module } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { PrismaTransactionService } from './prisma.transaction.service'

@Module({
  providers: [PrismaService, PrismaTransactionService],
  exports: [PrismaService, PrismaTransactionService],
})
export class PrismaModule {}
