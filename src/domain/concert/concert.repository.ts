import { ConcertCreationModel, ConcertModel } from './model/concert.model'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'
import { IdentifierFrom } from '../../shared/shared.type.helper'

export const ConcertsRepositoryToken = 'ConcertsRepository'

export interface ConcertRepository<Connection = unknown> {
  /**
   *
   * @param creationModel
   * @returns Created ConcertModel
   */
  create(
    creationModel: ConcertCreationModel,
  ): TransactionalOperation<ConcertModel, Connection>

  /**
   *
   * @param by
   * @returns Found ConcertModels
   */
  findManyBy(
    by: Partial<ConcertModel>,
  ): TransactionalOperation<ConcertModel[], Connection>

  /**
   *
   * @param by
   * @returns Found ConcertModel
   */
  findOneBy(
    by: IdentifierFrom<ConcertModel>,
  ): TransactionalOperation<ConcertModel, Connection>
}
