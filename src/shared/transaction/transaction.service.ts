export const TransactionServiceToken = 'TransactionService'

export interface TransactionService {
  /**
   *
   * @param transactionLevel
   * @param operations
   * @returns The last result of operations
   * @description Ensures atomicity of the transaction during the session
   */
  tx<Return, Connection = unknown>(
    transactionLevel: string,
    operations: [
      ...TransactionalOperation<unknown, Connection>[],
      TransactionalOperation<Return, Connection>,
    ],
  ): Promise<Return>
}

/**
 * @template Return The return type of the transactional operation
 * @template Connection If the transaction connection was not provided, it does not ensure isolation
 */
export type TransactionalOperation<Return, Connection = unknown> = (
  connection?: Connection,
) => Promise<Return>
