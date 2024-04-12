import { Inject, Injectable } from '@nestjs/common'
import { ConcertCreationModel, ConcertModel } from './models/concert.model'
import {
  ConcertsRepository,
  ConcertsRepositoryToken,
} from './concerts.repository'

@Injectable()
export class ConcertsService {
  constructor(
    @Inject(ConcertsRepositoryToken)
    private readonly concertsRepository: ConcertsRepository,
  ) {}

  create(creationModel: ConcertCreationModel): Promise<ConcertModel> {
    return this.concertsRepository.create(creationModel)
  }

  find(): Promise<ConcertModel[]> {
    return
  }
}
