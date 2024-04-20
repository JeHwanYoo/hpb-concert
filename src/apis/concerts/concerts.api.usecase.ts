import { Injectable } from '@nestjs/common'
import { ConcertsService } from '../../domains/concerts/concerts.service'
import { ConcertsResponseDto } from './dto/concerts.api.dto'
import { ConcertCreationModel } from '../../domains/concerts/models/concert.model'

@Injectable()
export class ConcertsApiUseCase {
  constructor(private readonly concertsService: ConcertsService) {}

  createConcert(model: ConcertCreationModel): Promise<ConcertsResponseDto> {
    return this.concertsService.create(model)
  }

  getConcerts(): Promise<ConcertsResponseDto[]> {
    return this.concertsService.findManyBy({})
  }
}
