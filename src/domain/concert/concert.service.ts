import { Inject, Injectable } from '@nestjs/common'
import { ConcertCreationModel, ConcertModel } from './model/concert.model'
import { ConcertRepository, ConcertRepositoryToken } from './concert.repository'
import { IdentifierFrom } from '../../shared/shared.type.helper'

@Injectable()
export class ConcertService {
  constructor(
    @Inject(ConcertRepositoryToken)
    private readonly concertsRepository: ConcertRepository,
  ) {}

  create(creationModel: ConcertCreationModel): Promise<ConcertModel> {
    return this.concertsRepository.create(creationModel)()
  }

  findManyBy(by: Partial<ConcertModel>): Promise<ConcertModel[]> {
    return this.concertsRepository.findManyBy(by)()
  }

  findOneBy(by: IdentifierFrom<ConcertModel>): Promise<ConcertModel> {
    return this.concertsRepository.findOneBy(by)()
  }
}
