import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from './models/seat.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'

export const SeatsRepositoryToken = 'SeatRepository'

export interface SeatsRepository {
  /**
   *
   * @param creationModel
   * @returns Created SeatModel
   */
  create(creationModel: SeatCreationModel): TransactionalOperation<SeatModel>

  /**
   *
   * @param by
   * @retruns Found SeatModels
   */
  findManyBy(by: Partial<SeatModel>): TransactionalOperation<SeatModel[]>

  /**
   *
   * @param by
   * @returns Found SeatModel or null
   */
  findOneBy(
    by: IdentifierFrom<SeatModel, 'seatNo'>,
  ): TransactionalOperation<SeatModel | null>

  /**
   *
   * @param seatId
   * @param updatingModel
   * @returns Updated SeatModel
   */
  update(
    seatId: string,
    updatingModel: SeatUpdatingModel,
  ): TransactionalOperation<SeatModel | null>
}
