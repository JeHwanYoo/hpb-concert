import {
  ChargeModel,
  ChargeCreationModel,
  ChargeUpdatingModel,
} from './models/charge.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'

export const ChargesRepositoryToken = 'ChargesRepository'

export interface ChargesRepository<Connection = unknown> {
  create(
    creationModel: ChargeCreationModel,
  ): TransactionalOperation<ChargeModel>

  /**
   *
   * @param by
   * @returns Found ChargeModel which matches the given condition
   */
  findOneBy(
    by: IdentifierFrom<ChargeModel>,
  ): TransactionalOperation<ChargeModel | null, Connection>

  /**
   *
   * @param userId
   * @param updatingModel
   * @retruns Updated ChargeModel
   */
  update(
    userId: string,
    updatingModel: ChargeUpdatingModel,
  ): TransactionalOperation<ChargeModel | null, Connection>
}
