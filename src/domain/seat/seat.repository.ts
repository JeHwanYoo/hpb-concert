import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from './model/seat.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'

export const SeatsRepositoryToken = 'SeatRepository'

export interface SeatRepository<Connection = unknown> {
  /**
   *
   * @param creationModel
   * @returns Created SeatModel
   */
  create(
    creationModel: SeatCreationModel,
  ): TransactionalOperation<SeatModel, Connection>

  /**
   *
   * @param by
   * @retruns Found SeatModels
   */
  findManyBy(
    by: Partial<SeatModel>,
  ): TransactionalOperation<SeatModel[], Connection>

  /**
   *
   * @param by
   * @returns Found SeatModel or null
   */
  findOneBy(
    by: IdentifierFrom<SeatModel, 'seatNo'>,
  ): TransactionalOperation<SeatModel | null, Connection>

  /**
   *
   * @param seatId
   * @param updatingModel
   * @returns Updated SeatModel
   */
  update(
    seatId: string,
    updatingModel: SeatUpdatingModel,
  ): TransactionalOperation<SeatModel | null, Connection>
}
