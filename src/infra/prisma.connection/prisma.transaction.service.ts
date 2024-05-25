import { Injectable } from '@nestjs/common'
import {
  TransactionalOperation,
  TransactionLevel,
  TransactionService,
} from '../../shared/transaction/transaction.service'
import { PrismaService } from './prisma.service'
import { Prisma, PrismaClient } from '@prisma/client'
import * as runtime from '@prisma/client/runtime/library'

export const PrismaTransactionMap: Record<
  TransactionLevel,
  Prisma.TransactionIsolationLevel
> = {
  [TransactionLevel.ReadCommitted]:
    Prisma.TransactionIsolationLevel.ReadCommitted,
}

@Injectable()
export class PrismaTransactionService implements TransactionService {
  constructor(private readonly prisma: PrismaService) {}

  tx<Return, Connection = Omit<PrismaClient, runtime.ITXClientDenyList>>(
    operation: TransactionalOperation<Return, Connection>,
    transactionLevel: TransactionLevel,
  ): Promise<Return> {
    return this.prisma.$transaction<Return>(
      conn => {
        return operation(conn as Connection)
      },
      {
        isolationLevel: PrismaTransactionMap[transactionLevel],
      },
    )
  }
}
