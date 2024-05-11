import { BillCreationModel, BillModel } from './model/bill.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'

export const BillRepositoryToken = 'BillRepository'

export interface BillRepository<Connection = unknown> {
  create(
    creationModel: BillCreationModel,
  ): TransactionalOperation<BillModel, Connection>

  findOneBy(
    by: IdentifierFrom<BillModel>,
  ): TransactionalOperation<BillModel | null, Connection>
}
