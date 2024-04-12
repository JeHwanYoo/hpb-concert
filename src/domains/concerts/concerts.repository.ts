import { ConcertCreationModel, ConcertModel } from './models/concert.model'

export const ConcertsRepositoryToken = 'ConcertsRepository'

export interface ConcertsRepository {
  createConcert(creationModel: ConcertCreationModel): Promise<ConcertModel>

  find(): Promise<ConcertModel[]>
}
