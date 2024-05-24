import { ConcertCreationModel, ConcertModel } from './model/concert.model'
import { TransactionalOperation } from '../../shared/transaction/transaction.service'
import { IdentifierFrom } from '../../shared/shared.type.helper'

export const ConcertRepositoryToken = 'ConcertsRepository'

export interface ConcertRepository<Connection = unknown> {
  create(
    creationModel: ConcertCreationModel,
  ): TransactionalOperation<ConcertModel, Connection>

  findManyBy(
    by: Partial<ConcertModel>,
  ): TransactionalOperation<ConcertModel[], Connection>

  findOneBy(
    by: IdentifierFrom<ConcertModel>,
  ): TransactionalOperation<ConcertModel, Connection>
}
