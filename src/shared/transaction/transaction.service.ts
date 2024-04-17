export const TransactionServiceToken = 'TransactionService'

export interface TransactionService {
  /**
   *
   * @param cb A function defining the operation to be executed during the transaction
   * @returns Returns the result of the operation function
   * @description Ensures atomicity of the transaction during the session
   */
  tx<T, S = unknown>(cb: (connectingSession: S) => Promise<T>): Promise<T>
}
