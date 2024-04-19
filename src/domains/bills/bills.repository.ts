import { BillCreationModel, BillModel } from './models/bill.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'

export const BillsRepositoryToken = 'BillsRepository'

export interface BillsRepository<Connection = unknown> {
  /**
   *
   * @param creationModel
   * @returns Created BillModel
   */
  create(
    creationModel: BillCreationModel,
  ): TransactionalOperation<BillModel, Connection>

  /**
   *
   * @param by
   * @returns Found BillModel which matches the given condition
   */
  findOneBy(
    by: IdentifierFrom<BillModel>,
  ): TransactionalOperation<BillModel | null, Connection>
}
