export const TransactionServiceToken = 'TransactionService'

export enum TransactionLevel {
  ReadCommitted = 'readCommitted',
  // ...todo others
}

export interface TransactionService {
  /**
   *
   * @param transactionLevel
   * @param operation
   * @returns The last result of operations
   * @description Ensures atomicity of the transaction during the session
   */
  tx<Return, Connection = unknown>(
    operation: TransactionalOperation<Return, Connection>,
    transactionLevel: TransactionLevel,
  ): Promise<Return>
}

/**
 * @template Return The return type of the transactional operation
 * @template Connection If the transaction connection was not provided, it does not ensure isolation
 */
export type TransactionalOperation<Return = void, Connection = unknown> = (
  connection?: Connection,
) => Promise<Return>
