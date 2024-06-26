import {
  SeatCreationModel,
  SeatModel,
  SeatUpdatingModel,
} from './model/seat.model'
import { IdentifierFrom } from '../../shared/shared.type.helper'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'

export const SeatRepositoryToken = 'SeatRepository'

export interface SeatRepository<Connection = unknown> {
  create(
    creationModel: SeatCreationModel,
  ): TransactionalOperation<SeatModel, Connection>

  findManyBy(
    by: Partial<SeatModel>,
  ): TransactionalOperation<SeatModel[], Connection>

  findOneBy(
    by: IdentifierFrom<SeatModel, 'seatNo'>,
  ): TransactionalOperation<SeatModel | null, Connection>

  update(
    seatNo: number,
    updatingModel: SeatUpdatingModel,
  ): TransactionalOperation<SeatModel, Connection>
}
