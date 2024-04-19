import { Injectable } from '@nestjs/common'
import {
  TransactionalOperation,
  TransactionLevel,
  TransactionService,
} from '../../shared/transaction/transaction.service'
import { PrismaService } from './prisma.service'
import { Prisma } from '@prisma/client'

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

  tx<Return>(
    transactionLevel: TransactionLevel,
    operations: [
      ...TransactionalOperation<void>[],
      TransactionalOperation<Return>,
    ],
  ): Promise<Return> {
    return this.prisma.$transaction(
      async (conn: PrismaService) => {
        for (const operation of operations.slice(0, -1)) {
          await operation(conn)
        }
        return (await operations.at(-1)(conn)) as Return
      },
      {
        isolationLevel: PrismaTransactionMap[transactionLevel],
      },
    )
  }
}
